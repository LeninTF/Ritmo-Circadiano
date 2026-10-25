import { Injectable, inject } from '@angular/core';
import type { DiarioSyncPayload } from '@circadiano/contracts';
import { OutboxService } from '../../core/offline/outbox.service';

export type EstadoGuardadoDiario = 'inicial' | 'guardando' | 'en_cola' | 'error';

export interface FormularioDiario extends Omit<DiarioSyncPayload, 'horaAcostarse' | 'horaDespertar'> {
  horaAcostarse: string; // HH:mm local
  horaDespertar: string; // HH:mm local
}

@Injectable({ providedIn: 'root' })
export class DiarioService {
  private readonly outbox = inject(OutboxService);

  /** Encola el registro (RNF03); OutboxService lo envia a POST /sync/lote al haber red. Devuelve el client_id. */
  async guardarDiario(formulario: FormularioDiario): Promise<string> {
    const clientId = await this.outbox.enqueue({ operation: 'diario', payload: aPayloadDiario(formulario) });
    void this.outbox.sync().catch(() => undefined);
    return clientId;
  }
}

/**
 * Convierte las horas HH:mm de la zona del dispositivo a ISO 8601.
 * `fecha` es el dia en que se despierta; si la hora de acostarse no es anterior a la de despertar, fue la noche previa.
 */
export function aPayloadDiario({ horaAcostarse, horaDespertar, ...resto }: FormularioDiario): DiarioSyncPayload {
  const [anio, mes, dia] = resto.fecha.split('-').map(Number);
  const enFecha = (hhmm: string) => {
    const [h, m] = hhmm.split(':').map(Number);
    return new Date(anio, mes - 1, dia, h, m);
  };
  const despertar = enFecha(horaDespertar);
  const acostarse = enFecha(horaAcostarse);
  if (acostarse >= despertar) acostarse.setDate(acostarse.getDate() - 1);
  return { ...resto, horaAcostarse: acostarse.toISOString(), horaDespertar: despertar.toISOString() };
}
