import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, from, catchError, of, switchMap, tap } from 'rxjs';
import { OfflineStoreService } from '../../core/offline/offline-store.service';

@Injectable({
  providedIn: 'root',
})
export class TurnosService {
  private readonly http = inject(HttpClient);
  private readonly offlineStore = inject(OfflineStoreService);
  private readonly baseUrl = '/operaciones';

  listarRutas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/rutas`).pipe(
      catchError(() => {
        // Nota: Si las rutas requieren almacenamiento offline específico, 
        // se pueden gestionar por el store o retornar un array vacío en caso de fallo de red.
        return of([]);
      })
    );
  }

  listarTurnos(idUsuario?: string, fecha?: string): Observable<any[]> {
    let params = new HttpParams();
    if (idUsuario) params = params.set('idUsuario', idUsuario);
    if (fecha) params = params.set('fecha', fecha);
    
    return this.http.get<any[]>(`${this.baseUrl}/turnos`, { params }).pipe(
      tap(async (turnos) => {
        if (Array.isArray(turnos)) {
          for (const t of turnos) {
            // Aseguramos que cada turno cumpla con el formato requerido por el upsert de Dexie
            await this.offlineStore.addTurno(t);
          }
        }
      }),
      catchError(() => 
        from(this.offlineStore.getMyTurnos()).pipe(
          switchMap((cached) => of(cached || []))
        )
      )
    );
  }

  listarTurnosMe(desde?: string, hasta?: string, idUsuario?: string): Observable<any[]> {
    let params = new HttpParams();
    if (desde) params = params.set('desde', desde);
    if (hasta) params = params.set('hasta', hasta);
    if (idUsuario) params = params.set('idUsuario', idUsuario);
    
    return this.http.get<any[]>(`${this.baseUrl}/turnos/me`, { params }).pipe(
      tap(async (turnos) => {
        if (Array.isArray(turnos)) {
          for (const t of turnos) {
            await this.offlineStore.addTurno(t);
          }
        }
      }),
      catchError(() => 
        from(this.offlineStore.getMyTurnos()).pipe(
          switchMap((cached) => of(cached || []))
        )
      )
    );
  }

  obtenerTurnoPorId(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/turnos/${id}`);
  }

  crearTurno(dto: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/turnos`, dto);
  }

  actualizarTurno(id: string, dto: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/turnos/${id}`, dto);
  }

  eliminarTurno(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/turnos/${id}`);
  }

  importarTurnos(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('archivo', file, file.name);
    return this.http.post<any>(`${this.baseUrl}/turnos/importar`, formData);
  }
}