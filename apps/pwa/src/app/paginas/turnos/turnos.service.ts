import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, from, catchError, of, switchMap, tap } from 'rxjs';
import { OfflineStoreService } from '../../core/offline/offline-store.service';
import { environment } from '../../../environments/environment';
import type {
  RutaDto,
  TurnoDto,
  CrearTurnoDto,
  ActualizarTurnoDto,
  EliminarTurnoRespuestaDto,
  ImportarTurnosRespuestaDto,
  TrabajadorResumenDto,
} from '@circadiano/contracts';

const parametros = (valores: Record<string, string | undefined>) =>
  Object.entries(valores).reduce((p, [k, v]) => (v ? p.set(k, v) : p), new HttpParams());

@Injectable({
  providedIn: 'root',
})
export class TurnosService {
  private readonly http = inject(HttpClient);
  private readonly offlineStore = inject(OfflineStoreService);
  private readonly baseUrl = `${environment.apiUrl}/operaciones`;

  listarRutas(): Observable<RutaDto[]> {
    // Sin red la grilla sigue mostrandose; solo el formulario queda sin rutas.
    return this.http.get<RutaDto[]>(`${this.baseUrl}/rutas`).pipe(catchError(() => of([])));
  }

  listarTrabajadores(): Observable<TrabajadorResumenDto[]> {
    return this.http.get<TrabajadorResumenDto[]>(`${this.baseUrl}/trabajadores`);
  }

  /** Turnos de cualquier trabajador (jefe, despachador, admin). No se guardan offline: no son del usuario. */
  listarTurnos(idUsuario?: string, desde?: string, hasta?: string): Observable<TurnoDto[]> {
    return this.http.get<TurnoDto[]>(`${this.baseUrl}/turnos`, { params: parametros({ idUsuario, desde, hasta }) });
  }

  listarTurnosMe(desde?: string, hasta?: string): Observable<TurnoDto[]> {
    return this.http.get<TurnoDto[]>(`${this.baseUrl}/turnos/me`, { params: parametros({ desde, hasta }) }).pipe(
      tap(async (turnos) => {
        for (const t of turnos) await this.offlineStore.addTurno({ fecha: t.fecha, data: t });
      }),
      catchError(() =>
        from(this.offlineStore.getMyTurnos()).pipe(
          switchMap((cached) => of((cached || []).map((c) => c.data as TurnoDto))),
        ),
      ),
    );
  }

  crearTurno(dto: CrearTurnoDto): Observable<TurnoDto> {
    return this.http.post<TurnoDto>(`${this.baseUrl}/turnos`, dto);
  }

  actualizarTurno(id: string, dto: ActualizarTurnoDto): Observable<TurnoDto> {
    return this.http.patch<TurnoDto>(`${this.baseUrl}/turnos/${id}`, dto);
  }

  eliminarTurno(id: string): Observable<EliminarTurnoRespuestaDto> {
    return this.http.delete<EliminarTurnoRespuestaDto>(`${this.baseUrl}/turnos/${id}`);
  }

  importarTurnos(file: File): Observable<ImportarTurnosRespuestaDto> {
    const formData = new FormData();
    formData.append('archivo', file, file.name);
    return this.http.post<ImportarTurnosRespuestaDto>(`${this.baseUrl}/turnos/importar`, formData);
  }
}
