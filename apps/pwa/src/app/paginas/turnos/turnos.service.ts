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
} from '@circadiano/contracts';

@Injectable({
  providedIn: 'root',
})
export class TurnosService {
  private readonly http = inject(HttpClient);
  private readonly offlineStore = inject(OfflineStoreService);
  private readonly baseUrl = `${environment.apiUrl}/operaciones`;

  listarRutas(): Observable<RutaDto[]> {
    return this.http.get<RutaDto[]>(`${this.baseUrl}/rutas`).pipe(
      catchError(() => {
        // Nota: Si las rutas requieren almacenamiento offline específico, 
        // se pueden gestionar por el store o retornar un array vacío en caso de fallo de red.
        return of([]);
      })
    );
  }

  listarTurnos(idUsuario?: string, fecha?: string): Observable<TurnoDto[]> {
    let params = new HttpParams();
    if (idUsuario) params = params.set('idUsuario', idUsuario);
    if (fecha) params = params.set('fecha', fecha);
    
    return this.http.get<TurnoDto[]>(`${this.baseUrl}/turnos`, { params }).pipe(
      tap(async (turnos) => {
        if (Array.isArray(turnos)) {
          for (const t of turnos) {
            // Aseguramos que cada turno se guarde con su fecha y data (TurnoDto)
            await this.offlineStore.addTurno({ fecha: t.fecha, data: t });
          }
        }
      }),
      catchError(() => 
        from(this.offlineStore.getMyTurnos()).pipe(
          switchMap((cached) => of((cached || []).map((c) => c.data as TurnoDto)))
        )
      )
    );
  }

  listarTurnosMe(desde?: string, hasta?: string, idUsuario?: string): Observable<TurnoDto[]> {
    let params = new HttpParams();
    if (desde) params = params.set('desde', desde);
    if (hasta) params = params.set('hasta', hasta);
    if (idUsuario) params = params.set('idUsuario', idUsuario);
    
    return this.http.get<TurnoDto[]>(`${this.baseUrl}/turnos/me`, { params }).pipe(
      tap(async (turnos) => {
        if (Array.isArray(turnos)) {
          for (const t of turnos) {
            await this.offlineStore.addTurno({ fecha: t.fecha, data: t });
          }
        }
      }),
      catchError(() => 
        from(this.offlineStore.getMyTurnos()).pipe(
          switchMap((cached) => of((cached || []).map((c) => c.data as TurnoDto)))
        )
      )
    );
  }

  obtenerTurnoPorId(id: string): Observable<TurnoDto> {
    return this.http.get<TurnoDto>(`${this.baseUrl}/turnos/${id}`);
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