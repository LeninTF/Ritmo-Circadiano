import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import type { BebidaDto, CrearIngestaCafeinaDto } from '@circadiano/contracts';
import { environment } from '../../../environments/environment';
import { OfflineStoreService } from '../../core/offline/offline-store.service';
import { OutboxService } from '../../core/offline/outbox.service';

/** Lo que el trabajador elige en /cafeina. `bebida: null` es «Otro (indico los mg)». */
export interface RegistroCafeina {
  bebida: BebidaDto | null;
  porciones: number;
  cafeinaMg: number | null;
  /** HH:mm de hoy en la zona del dispositivo. */
  hora: string;
}

const CLAVE_CACHE_BEBIDAS = 'circaruta.bebidas';
// HU-03: el servidor acepta hasta 5 min en el futuro por relojes desfasados.
const MARGEN_FUTURO_MS = 5 * 60_000;

/** Total en vivo: para el catálogo es una vista previa, el servidor recalcula los mg. */
export function totalMg(registro: RegistroCafeina): number {
  if (registro.bebida) return Math.round(registro.bebida.cafeina_mg * registro.porciones);
  return registro.cafeinaMg ?? 0;
}

export function aFechaHoy(hora: string, ahora: Date): Date {
  const [h, m] = hora.split(':').map(Number);
  return new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), h, m);
}

/** Mismas reglas que valida la API, para mostrar el error junto al campo antes de enviar. */
export function errorRegistro(registro: RegistroCafeina, ahora: Date): string | null {
  const mg = registro.cafeinaMg;
  if (!registro.bebida && (mg === null || !Number.isInteger(mg) || mg < 1 || mg > 1000)) {
    return 'Indica los mg (entre 1 y 1000).';
  }
  if (!/^\d{2}:\d{2}$/.test(registro.hora)) return 'Indica la hora.';
  if (aFechaHoy(registro.hora, ahora).getTime() > ahora.getTime() + MARGEN_FUTURO_MS) {
    return 'La hora no puede estar en el futuro.';
  }
  return null;
}

@Injectable({ providedIn: 'root' })
export class CafeinaService {
  private readonly http = inject(HttpClient);
  private readonly outbox = inject(OutboxService);
  private readonly store = inject(OfflineStoreService);

  /** Catálogo de GET /bebidas; sin red usa la última copia guardada en el teléfono. */
  async obtenerBebidas(): Promise<BebidaDto[]> {
    try {
      const bebidas = await firstValueFrom(this.http.get<BebidaDto[]>(`${environment.apiUrl}/bebidas`));
      try {
        localStorage.setItem(CLAVE_CACHE_BEBIDAS, JSON.stringify(bebidas));
      } catch {
        // Sin almacenamiento: el catálogo se vuelve a pedir la próxima vez.
      }
      return bebidas;
    } catch {
      try {
        return JSON.parse(localStorage.getItem(CLAVE_CACHE_BEBIDAS) ?? '[]') as BebidaDto[];
      } catch {
        return [];
      }
    }
  }

  /** Encola la ingesta (RNF03); OutboxService la envía a POST /sync/lote al haber red. Devuelve el client_id. */
  async registrar(registro: RegistroCafeina, ahora = new Date()): Promise<string> {
    const fechaHora = aFechaHoy(registro.hora, ahora).toISOString();
    const payload: Omit<CrearIngestaCafeinaDto, 'id_usuario' | 'client_id'> = registro.bebida
      ? { id_bebida: registro.bebida.id_bebida, porciones: registro.porciones, fecha_hora: fechaHora }
      : { cafeina_mg: registro.cafeinaMg ?? undefined, fecha_hora: fechaHora };
    const clientId = await this.outbox.enqueue({ operation: 'ingesta', payload });
    // El plan offline de I3 lee este store para el corte de cafeína (shortcut en plan.service.ts).
    await this.store.addIngesta({
      fecha: fechaHora,
      data: { clientId, cafeinaMg: totalMg(registro), nombre: registro.bebida?.nombre ?? 'Otro' },
    });
    void this.outbox.sync().catch(() => undefined);
    return clientId;
  }
}
