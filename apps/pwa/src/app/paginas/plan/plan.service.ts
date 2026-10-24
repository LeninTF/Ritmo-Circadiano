import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  SEDES_EMPRESA,
  type CategoriaCronotipo,
  type EventoSolarDto,
  type PlanDiarioDto,
} from '@circadiano/contracts';
import {
  CATEGORIA_RMEQ_SIN_RESPUESTA,
  SEMIVIDA_H_DEFECTO,
  UMBRAL_CAFEINA_MG_DEFECTO,
  VERSION_ALGORITMO_PLAN,
  aPlanDiarioDto,
  calcularEventosSolares,
  generarPlan,
  type EventosSolares,
  type TurnoLaboral,
} from '@circadiano/domain';
import { environment } from '../../../environments/environment';
import { OfflineStoreService } from '../../core/offline/offline-store.service';
import { ProximoTurnoService } from '../turnos/proximo-turno/proximo-turno.service';

export type OrigenPlan = 'servidor' | 'guardado' | 'calculado';

export interface PlanDelDia {
  plan: PlanDiarioDto;
  origen: OrigenPlan;
  /** Solo si se calculó en el teléfono (RNF01: ≤ 200 ms). */
  duracionMs?: number;
  /** El servidor no tiene ubicación: el plan usa la sede Ica hasta que el trabajador elija. */
  sinUbicacion?: boolean;
}

const DIAS_CACHE = 7;
const MS_DIA = 86_400_000;

/**
 * Calcula el plan en el navegador con el mismo motor que la API (RF07, RNF03).
 * shortcut: offline no hay ingestas ni umbral del servidor, así que el corte de cafeína queda en
 * dormir − 6 h (RN05) y no se conoce el turno siguiente; usar el store `ingestas` cuando I4 lo llene.
 */
export function calcularPlanLocal(
  turno: TurnoLaboral,
  cronotipo: CategoriaCronotipo,
  solarGuardado?: EventoSolarDto,
): PlanDiarioDto {
  const sede = SEDES_EMPRESA[0];
  const solar: EventosSolares = solarGuardado
    ? {
        amanecer: new Date(solarGuardado.amanecer),
        mediodia: new Date(solarGuardado.mediodia),
        atardecer: new Date(solarGuardado.atardecer),
        lat: sede.lat,
        lng: sede.lng,
        fecha: new Date(`${turno.fecha}T05:00:00Z`),
      }
    : calcularEventosSolares(sede.lat, sede.lng, turno.fecha);
  const resultado = generarPlan(
    {
      inicioTurno: new Date(turno.horaInicioReal ?? turno.inicioProgramado),
      finTurno: new Date(turno.horaFinReal ?? turno.finProgramado),
      esNocturno: turno.esNocturno,
    },
    cronotipo,
    solar,
    [],
    { versionAlgoritmo: VERSION_ALGORITMO_PLAN, semividaH: SEMIVIDA_H_DEFECTO, umbralCafeinaMg: UMBRAL_CAFEINA_MG_DEFECTO },
  );
  return aPlanDiarioDto(resultado, {
    id: `local-${turno.id}`,
    idTurno: turno.id,
    fecha: turno.fecha,
    actualizadoEn: new Date().toISOString(),
  });
}

/** RF07 en la PWA: plan del próximo turno desde la API; sin red, el guardado o uno calculado en el teléfono. */
@Injectable({ providedIn: 'root' })
export class PlanService {
  private readonly http = inject(HttpClient);
  private readonly offline = inject(OfflineStoreService);
  private readonly turnos = inject(ProximoTurnoService);
  private readonly url = environment.apiUrl;

  async obtenerPlanDelDia(ahora = new Date()): Promise<PlanDelDia | null> {
    try {
      const turno = await firstValueFrom(this.turnos.obtenerProximoTurno(null, ahora));
      if (!turno) return null;
      const plan = await firstValueFrom(
        this.http.post<PlanDiarioDto>(`${this.url}/planes/generar`, { idTurno: turno.id }),
      );
      await this.offline.addPlan({ fecha: plan.fecha, data: plan });
      const sinUbicacion = !(await this.guardarParaOffline(plan.fecha));
      return { plan, origen: 'servidor', sinUbicacion };
    } catch (error) {
      if (!(error instanceof HttpErrorResponse) || error.status !== 0) throw error;
      return this.planSinConexion(ahora);
    }
  }

  /** Turnos y eventos solares de 7 días para el modo offline. false si aún no hay ubicación. */
  private async guardarParaOffline(desde: string): Promise<boolean> {
    const hasta = new Date(Date.parse(desde) + (DIAS_CACHE - 1) * MS_DIA).toISOString().slice(0, 10);
    const turnos = await firstValueFrom(
      this.http.get<TurnoLaboral[]>(`${this.url}/operaciones/turnos/me`, { params: { desde, hasta } }),
    );
    await Promise.all(turnos.map((t) => this.offline.addTurno({ fecha: t.fecha, data: t })));
    try {
      const eventos = await firstValueFrom(
        this.http.get<EventoSolarDto[]>(`${this.url}/eventos-solares`, { params: { desde, dias: DIAS_CACHE } }),
      );
      await Promise.all(eventos.map((e) => this.offline.addEventoSolar({ fecha: e.fecha, data: e })));
      return true;
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 404) return false;
      throw error;
    }
  }

  private async planSinConexion(ahora: Date): Promise<PlanDelDia | null> {
    const turno = (await this.offline.getMyTurnos())
      .map((t) => t.data as TurnoLaboral)
      .filter((t) => Date.parse(t.horaFinReal ?? t.finProgramado) >= ahora.getTime())
      .sort((a, b) => Date.parse(a.inicioProgramado) - Date.parse(b.inicioProgramado))[0];
    if (!turno) return null;

    const planes = (await this.offline.getMyPlans()).map((p) => p.data as PlanDiarioDto);
    const guardado = planes.find((p) => p.idTurno === turno.id);
    if (guardado) return { plan: guardado, origen: 'guardado' };

    const solar = (await this.offline.getMyEventosSolares()).find((e) => e.fecha === turno.fecha);
    const inicio = performance.now();
    const plan = calcularPlanLocal(
      turno,
      planes[0]?.categoriaCronotipo ?? CATEGORIA_RMEQ_SIN_RESPUESTA,
      solar?.data as EventoSolarDto | undefined,
    );
    return { plan, origen: 'calculado', duracionMs: performance.now() - inicio };
  }
}
