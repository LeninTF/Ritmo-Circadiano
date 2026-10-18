import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { generarPlan, calcularEventosSolares, type ConfiguracionMotor } from '@circadiano/domain';

export interface PlanStore {
  id?: number;
  idUsuario: string;
  fecha: string;
  plan: any;
}

export class CircadianoDexie extends Dexie {
  planes!: Dexie.Table<PlanStore, number>;

  constructor() {
    super('CircadianoDB');
    this.version(1).stores({
      planes: '++id, idUsuario, fecha',
    });
  }
}

@Injectable({ providedIn: 'root' })
export class OfflineStore {
  private db = new CircadianoDexie();

  async generarPlanLocal(params: {
    idUsuario: string;
    fecha: string;
    lat: number;
    lng: number;
    cronotipo: string;
    turnoInicio: Date;
    turnoFin: Date;
  }): Promise<{ plan: any; durationMs: number }> {
    const start = performance.now();
    const solar = calcularEventosSolares(params.lat, params.lng, params.fecha);
    const cfg: ConfiguracionMotor = { versionAlgoritmo: '1.0.0', semividaH: 5, umbralCafeinaMg: 50 };
    const plan = generarPlan(
      { inicioTurno: params.turnoInicio, finTurno: params.turnoFin },
      params.cronotipo as any,
      solar,
      [],
      cfg
    );
    const duration = performance.now() - start;
    if (duration > 200) {
      console.warn('Plan offline >200ms', duration);
    }
    await this.db.planes.put({
      idUsuario: params.idUsuario,
      fecha: params.fecha,
      plan: JSON.stringify(plan),
    });
    return { plan, durationMs: duration };
  }

  async obtenerPlan(idUsuario: string, fecha: string): Promise<any | null> {
    const row = await this.db.planes.get({ idUsuario, fecha });
    if (!row || !row.plan) return null;
    return JSON.parse(row.plan);
  }
}
