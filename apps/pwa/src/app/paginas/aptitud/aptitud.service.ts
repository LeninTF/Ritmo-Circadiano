import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import type {
  CrearAptitudRequest,
  CrearAptitudResponse,
  ConsultarDespachoRequest,
  ConsultarDespachoResponse,
} from '@circadiano/contracts';
import type { TurnoLaboral } from '@circadiano/domain';
import { environment } from '../../../environments/environment';

/** Solo se evalua un turno que empieza dentro de este plazo (RF12). */
const VENTANA_TURNO_MS = 12 * 60 * 60 * 1000;

/** AAAA-MM-DD con los componentes locales del dispositivo (toISOString daria el dia en UTC). */
export function fechaLocal(fecha: Date): string {
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}

/** Autoevaluacion pre-salida (RF12) y vista del despachador; el authInterceptor agrega el token. */
@Injectable({ providedIn: 'root' })
export class AptitudService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/aptitud`;
  private readonly urlTurnos = `${environment.apiUrl}/operaciones/turnos/me`;

  /** Primer turno propio que empieza despues de `ahora` y dentro de 12 h, o null. */
  obtenerTurnoParaEvaluar(ahora = new Date()): Observable<TurnoLaboral | null> {
    // Desde ayer: un turno nocturno puede llevar la fecha del dia anterior.
    const ayer = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() - 1);
    return this.http.get<TurnoLaboral[]>(this.urlTurnos, { params: { desde: fechaLocal(ayer) } }).pipe(
      map(
        (turnos) =>
          turnos.find((t) => {
            const faltan = Date.parse(t.inicioProgramado) - ahora.getTime();
            return faltan > 0 && faltan <= VENTANA_TURNO_MS;
          }) ?? null,
      ),
    );
  }

  crearAptitud(idTurno: string, request: CrearAptitudRequest): Observable<CrearAptitudResponse> {
    return this.http.post<CrearAptitudResponse>(`${this.url}/${idTurno}`, request);
  }

  consultarDespacho(request: ConsultarDespachoRequest): Observable<ConsultarDespachoResponse> {
    return this.http.get<ConsultarDespachoResponse>(`${this.url}/despacho`, {
      params: request.codigo ? { fecha: request.fecha, codigo: request.codigo } : { fecha: request.fecha },
    });
  }
}
