import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { TurnoLaboral } from '@circadiano/domain';
import { environment } from '../../../../environments/environment';
import { ConfirmacionTurnoPayload } from './proximo-turno.models';

/** Mensajes para el trabajador según la respuesta de PATCH /confirmacion (RF05). */
const MENSAJE_POR_ESTADO: Record<number, string> = {
  0: 'Sin conexión. Inténtalo cuando tengas señal.',
  400: 'Los horarios enviados no son válidos.',
  401: 'Tu sesión venció. Vuelve a iniciar sesión.',
  403: 'Este turno no está asignado a ti.',
  404: 'El turno ya no existe.',
  409: 'El turno cambió mientras guardabas. Recarga e inténtalo de nuevo.',
};

/** Turnos y confirmación del trabajador autenticado (RF05); el authInterceptor agrega el token. */
@Injectable({ providedIn: 'root' })
export class ProximoTurnoService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/operaciones/turnos`;

  /**
   * Con `idTurno` (enlace del aviso push) devuelve ese turno. Sin él, el último turno ya iniciado
   * que siga pendiente de confirmar; si no hay, el próximo por terminar.
   */
  obtenerProximoTurno(idTurno?: string | null, ahora = new Date()): Observable<TurnoLaboral | null> {
    const ayer = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() - 1);
    const desde = `${ayer.getFullYear()}-${String(ayer.getMonth() + 1).padStart(2, '0')}-${String(ayer.getDate()).padStart(2, '0')}`;
    // El backend ordena por inicio programado ascendente.
    return this.http.get<TurnoLaboral[]>(`${this.url}/me`, { params: idTurno ? {} : { desde } }).pipe(
      map((turnos) => {
        if (idTurno) return turnos.find((t) => t.id === idTurno) ?? null;
        const pendienteIniciado = [...turnos]
          .reverse()
          .find((t) => t.estadoConfirmacion === 'pendiente' && Date.parse(t.inicioProgramado) <= ahora.getTime());
        return pendienteIniciado ?? turnos.find((t) => Date.parse(t.finProgramado) >= ahora.getTime()) ?? null;
      }),
    );
  }

  confirmarTurno(id: string, payload: ConfirmacionTurnoPayload): Observable<TurnoLaboral> {
    return this.http.patch<TurnoLaboral>(`${this.url}/${id}/confirmacion`, payload).pipe(
      catchError((error: unknown) => {
        const estado = error instanceof HttpErrorResponse ? error.status : -1;
        return throwError(() => new Error(MENSAJE_POR_ESTADO[estado] ?? 'No se pudo guardar. Inténtalo nuevamente.'));
      }),
    );
  }
}
