import { Injectable, inject } from '@angular/core';
import { Dexie } from 'dexie';
import { DEXIE_DB_TOKEN } from './dexie-db-token';
import { SESSION_PROVIDER_TOKEN } from './session-provider';
import {
  Plan,
  EventoSolar,
  Turno,
  Ingesta,
  Diario,
  Outbox,
} from './types/offline-schema';

@Injectable({ providedIn: 'root' })
export class OfflineStoreService {
  private readonly dbProvider = inject(DEXIE_DB_TOKEN);
  private readonly session = inject(SESSION_PROVIDER_TOKEN);
  private readonly db: Dexie;
  private readonly tables: {
    planes: Dexie.Table<Plan, number>;
    eventosSolares: Dexie.Table<EventoSolar, number>;
    turnos: Dexie.Table<Turno, number>;
    ingestas: Dexie.Table<Ingesta, number>;
    diario: Dexie.Table<Diario, number>;
    outbox: Dexie.Table<Outbox, number>;
  };

  constructor() {
    this.db = this.dbProvider.getDatabase();
    this.tables = {
      planes: this.db.table('planes'),
      eventosSolares: this.db.table('eventosSolares'),
      turnos: this.db.table('turnos'),
      ingestas: this.db.table('ingestas'),
      diario: this.db.table('diario'),
      outbox: this.db.table('outbox'),
    };
  }

  private getUserId(): string {
    const userId = this.session.getUserId();
    if (typeof userId !== 'string' || !userId.trim()) {
      throw new Error('Unauthenticated: invalid user ID');
    }
    return userId;
  }

  /* ---------- Plan ---------- */
  /** Un plan por usuario y fecha: si ya existe se reemplaza (I3 regenera el plan). */
  async addPlan(plan: Omit<Plan, 'id' | 'usuario'>): Promise<number> {
    return this.upsertPorFecha(this.tables.planes, plan);
  }
  async getMyPlans(): Promise<Plan[]> {
    return this.tables.planes
      .where('usuario')
      .equals(this.getUserId())
      .toArray();
  }

  /* ---------- EventoSolar ---------- */
  /** Un registro por usuario y fecha (cache de 7 dias de I3). */
  async addEventoSolar(
    ev: Omit<EventoSolar, 'id' | 'usuario'>
  ): Promise<number> {
    return this.upsertPorFecha(this.tables.eventosSolares, ev);
  }
  async getMyEventosSolares(): Promise<EventoSolar[]> {
    return this.tables.eventosSolares
      .where('usuario')
      .equals(this.getUserId())
      .toArray();
  }

  /* ---------- Turno ---------- */
  /** Un turno por usuario y fecha: la cache se refresca al volver la conexion. */
  async addTurno(turno: Omit<Turno, 'id' | 'usuario'>): Promise<number> {
    return this.upsertPorFecha(this.tables.turnos, turno);
  }
  async getMyTurnos(): Promise<Turno[]> {
    return this.tables.turnos
      .where('usuario')
      .equals(this.getUserId())
      .toArray();
  }

  /* ---------- Ingesta ---------- */
  async addIngesta(ingesta: Omit<Ingesta, 'id' | 'usuario'>): Promise<number> {
    const user = this.getUserId();
    return this.tables.ingestas.put({ ...ingesta, usuario: user });
  }
  /** Borra las copias locales de una ingesta eliminada en el servidor (I4 guarda el clientId en `data`). */
  async removeIngestaPorClientId(clientId: string): Promise<void> {
    const ids = (await this.getMyIngestas())
      .filter((i) => (i.data as { clientId?: unknown } | undefined)?.clientId === clientId)
      .map((i) => i.id)
      .filter((id): id is number => id !== undefined);
    await this.tables.ingestas.bulkDelete(ids);
  }

  async getMyIngestas(): Promise<Ingesta[]> {
    return this.tables.ingestas
      .where('usuario')
      .equals(this.getUserId())
      .toArray();
  }

  /* ---------- Diario ---------- */
  async addDiario(diario: Omit<Diario, 'id' | 'usuario'>): Promise<number> {
    const user = this.getUserId();
    return this.tables.diario.put({ ...diario, usuario: user });
  }
  async getMyDiarios(): Promise<Diario[]> {
    return this.tables.diario
      .where('usuario')
      .equals(this.getUserId())
      .toArray();
  }

  /* ---------- Outbox ---------- */
  async addOutbox(
    item: Omit<Outbox, 'id' | 'usuario' | 'createdAt'>,
    ownerId: string = this.getUserId()
  ): Promise<number> {
    if (!item || !item.clientId || !item.clientId.trim()) {
      throw new Error('Invalid clientId: clientId is required');
    }
    return this.db.transaction('rw', this.tables.outbox, async () => {
      this.assertCurrentUser(ownerId);
      const createdAt = new Date().toISOString();
      const id = await this.tables.outbox.put({
        ...item,
        usuario: ownerId,
        createdAt,
        status: 'pending',
        attempts: 0,
      });
      this.assertCurrentUser(ownerId);
      return id;
    });
  }

  async getMyOutbox(): Promise<Outbox[]> {
    const user = this.getUserId();
    return this.tables.outbox
      .where('usuario')
      .equals(user)
      .toArray();
  }

  async getPendingOutbox(ownerId: string = this.getUserId()): Promise<Outbox[]> {
    this.assertCurrentUser(ownerId);
    const user = ownerId;
    const all = await this.tables.outbox
      .where('usuario')
      .equals(user)
      .toArray();
    this.assertCurrentUser(ownerId);
    return all.filter(
      (item) =>
        !item.status ||
        item.status === 'pending' ||
        item.status === 'syncing' ||
        item.status === 'failed'
    );
  }

  async getOutboxByClientId(
    clientId: string,
    ownerId: string = this.getUserId()
  ): Promise<Outbox | undefined> {
    this.assertCurrentUser(ownerId);
    const user = ownerId;
    if (!clientId || !clientId.trim()) {
      throw new Error('Invalid clientId');
    }
    const result = await this.tables.outbox
      .where('[usuario+clientId]')
      .equals([user, clientId])
      .first();
    this.assertCurrentUser(ownerId);
    return result;
  }

  async updateOutboxRetry(
    clientId: string,
    attempts: number,
    nextRetryAt: string,
    lastError?: string,
    ownerId: string = this.getUserId()
  ): Promise<void> {
    this.assertCurrentUser(ownerId);
    const user = ownerId;
    if (!clientId || !clientId.trim()) {
      throw new Error('Invalid clientId');
    }
    if (!Number.isInteger(attempts) || attempts < 0) {
      throw new Error('Attempts must be a non-negative integer');
    }
    if (!this.isValidIsoDate(nextRetryAt)) {
      throw new Error('Invalid nextRetryAt');
    }

    await this.db.transaction('rw', this.tables.outbox, async () => {
      this.assertCurrentUser(ownerId);
      const updated = await this.tables.outbox
        .where('[usuario+clientId]')
        .equals([user, clientId])
        .modify({
          attempts,
          nextRetryAt,
          lastError,
          status: 'pending',
        });
      if (updated === 0) {
        throw new Error(`Outbox item not found for client ID: ${clientId}`);
      }
      this.assertCurrentUser(ownerId);
    });
  }

  async markOutboxBlocked(
    clientId: string,
    lastError: string,
    attempts?: number,
    ownerId: string = this.getUserId()
  ): Promise<void> {
    this.assertCurrentUser(ownerId);
    const user = ownerId;
    if (!clientId || !clientId.trim()) {
      throw new Error('Invalid clientId');
    }
    if (attempts !== undefined && (!Number.isInteger(attempts) || attempts < 0)) {
      throw new Error('Attempts must be a non-negative integer');
    }

    await this.db.transaction('rw', this.tables.outbox, async () => {
      this.assertCurrentUser(ownerId);
      const updated = await this.tables.outbox
        .where('[usuario+clientId]')
        .equals([user, clientId])
        .modify({
          status: 'blocked',
          lastError,
          ...(attempts === undefined ? {} : { attempts }),
        });
      if (updated === 0) {
        throw new Error(`Outbox item not found for client ID: ${clientId}`);
      }
      this.assertCurrentUser(ownerId);
    });
  }

  async removeOutbox(
    clientId: string,
    ownerId: string = this.getUserId()
  ): Promise<void> {
    this.assertCurrentUser(ownerId);
    const user = ownerId;
    if (!clientId || !clientId.trim()) {
      throw new Error('Invalid clientId');
    }
    await this.db.transaction('rw', this.tables.outbox, async () => {
      this.assertCurrentUser(ownerId);
      await this.tables.outbox
        .where('[usuario+clientId]')
        .equals([user, clientId])
        .delete();
      this.assertCurrentUser(ownerId);
    });
  }

  private async upsertPorFecha<T extends { id?: number; fecha: string; usuario: string }>(
    tabla: Dexie.Table<T, number>,
    item: Omit<T, 'id' | 'usuario'>
  ): Promise<number> {
    const usuario = this.getUserId();
    return this.db.transaction('rw', tabla, async () => {
      const existente = await tabla.where('[usuario+fecha]').equals([usuario, item.fecha]).first();
      return tabla.put({ ...item, usuario, ...(existente ? { id: existente.id } : {}) } as T);
    });
  }

  private assertCurrentUser(ownerId: string): void {
    if (typeof ownerId !== 'string' || !ownerId.trim()) {
      throw new Error('Invalid Outbox owner ID');
    }
    if (this.getUserId() !== ownerId) {
      throw new Error('Session changed during Outbox operation');
    }
  }

  private isValidIsoDate(value: string): boolean {
    return typeof value === 'string' && !Number.isNaN(Date.parse(value));
  }
}