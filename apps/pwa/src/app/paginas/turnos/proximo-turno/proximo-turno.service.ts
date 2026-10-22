import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { TurnoLaboral } from '@circadiano/domain';
import {
  ConfirmacionTurnoPayload,
  DEMO_PROXIMO_TURNO,
  DEMO_TURNO_NOCTURNO,
} from './proximo-turno.models';

/**
 * Servicio para gestión del próximo turno del trabajador (RF05).
 * Separa la capa de presentación de la infraestructura HTTP.
 *
 * NOTA DE ARQUITECTURA (Fase 4):
 * El endpoint HTTP `/turnos/:id/confirmacion` depende del guard JWT oficial de I1.
 * Mientras tanto, este servicio permite operar en modo demostración/fixture tipada
 * sin enviar credenciales falsas ni eludir la seguridad del backend.
 */
@Injectable({
  providedIn: 'root',
})
export class ProximoTurnoService {
  private readonly http = inject(HttpClient, { optional: true });
  private readonly baseUrl = '/turnos';

  private turnoDemoActual: TurnoLaboral | null = { ...DEMO_PROXIMO_TURNO };
  private forzarErrorDemo = false;

  setTurnoDemo(turno: TurnoLaboral | null): void {
    this.turnoDemoActual = turno ? { ...turno } : null;
    this.forzarErrorDemo = false;
  }

  setForzarError(forzar: boolean): void {
    this.forzarErrorDemo = forzar;
  }

  obtenerProximoTurno(
  idTurno?: string | null,
): Observable<TurnoLaboral | null> {
  if (this.forzarErrorDemo) {
    return throwError(
      () => new Error('Error simulado en servidor'),
    );
  }

  // Un ID explícito debe devolver únicamente ese turno.
  if (idTurno) {
    if (idTurno === DEMO_TURNO_NOCTURNO.id) {
      return of({ ...DEMO_TURNO_NOCTURNO });
    }

    if (this.turnoDemoActual?.id === idTurno) {
      return of({ ...this.turnoDemoActual });
    }

    return of(null);
  }

  // Sin ID: mostrar el próximo turno disponible.
  return of(
    this.turnoDemoActual
      ? { ...this.turnoDemoActual }
      : null,
  );
}

  /**
   * Confirma o corrige el horario de un turno.
   *
   * @param id Identificador único del turno
   * @param payload Datos de confirmación o corrección
   */
  confirmarTurno(
    id: string,
    payload: ConfirmacionTurnoPayload,
  ): Observable<TurnoLaboral> {
    if (!id) {
      return throwError(() => new Error('Identificador de turno no proporcionado.'));
    }

    // Modo demostración explícito: no se realizan llamadas HTTP.
    if (this.turnoDemoActual && this.turnoDemoActual.id === id) {
      if (this.forzarErrorDemo) {
        return throwError(() => new Error('Error simulado en servidor'));
      }

      const turnoActualizado: TurnoLaboral = {
        ...this.turnoDemoActual,
        estadoConfirmacion: payload.estadoConfirmacion,
        horaInicioReal:
          payload.estadoConfirmacion === 'corregido'
            ? payload.horaInicioReal ?? this.turnoDemoActual.inicioProgramado
            : this.turnoDemoActual.inicioProgramado,
        horaFinReal:
          payload.estadoConfirmacion === 'corregido'
            ? payload.horaFinReal ?? this.turnoDemoActual.finProgramado
            : this.turnoDemoActual.finProgramado,
        actualizadoEn: new Date().toISOString(),
      };

      this.turnoDemoActual = turnoActualizado;
      return of(turnoActualizado);
    }

    return throwError(
      () => new Error('Operación de demostración no disponible para este turno.')
    );
  }
}
