import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { OfflineStoreService } from './offline-store.service';

export interface Ruta {
  id: string;
  origen: string;
  destino: string;
  [key: string]: unknown;
}

export interface Turno {
  id: string;
  idUsuario: string;
  idRuta: string;
  fecha: string;
  inicioProgramado: string;
  finProgramado: string;
  horasConduccion: number;
  esNocturno: boolean;
  estadoConfirmacion: string;
  [key: string]: unknown;
}

export interface TurnoDto {
  idUsuario: string;
  idRuta: string;
  fecha: string;
  inicioProgramado: string;
  finProgramado: string;
  horasConduccion: number;
  esNocturno: boolean;
  confirmarExceso?: boolean;
  motivoExceso?: string;
}

export interface ImportResult {
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class TurnosService {
  private readonly http = inject(HttpClient);
  private readonly offlineStore = inject(OfflineStoreService);
  private readonly baseUrl = '/operaciones';

  listarRutas(): Observable<Ruta[]> {
    return this.http.get<Ruta[]>(`${this.baseUrl}/rutas`).pipe(
      tap((r) => this.offlineStore.setItem('rutas', r)),
      catchError(() => {
        const cached = this.offlineStore.getItem<Ruta[]>('rutas');
        return of(cached || []);
      })
    );
  }

  listarTurnos(idUsuario?: string, fecha?: string): Observable<Turno[]> {
    let params = new HttpParams();
    if (idUsuario) params = params.set('idUsuario', idUsuario);
    if (fecha) params = params.set('fecha', fecha);
    return this.http.get<Turno[]>(`${this.baseUrl}/turnos`, { params }).pipe(
      tap((t) => this.offlineStore.setItem('turnos_all', t)),
      catchError(() => {
        const cached = this.offlineStore.getItem<Turno[]>('turnos_all');
        return of(cached || []);
      })
    );
  }

  listarTurnosMe(desde?: string, hasta?: string, idUsuario?: string): Observable<Turno[]> {
    let params = new HttpParams();
    if (desde) params = params.set('desde', desde);
    if (hasta) params = params.set('hasta', hasta);
    if (idUsuario) params = params.set('idUsuario', idUsuario);
    return this.http.get<Turno[]>(`${this.baseUrl}/turnos/me`, { params }).pipe(
      tap((t) => this.offlineStore.setItem('turnos_me', t)),
      catchError(() => {
        const cached = this.offlineStore.getItem<Turno[]>('turnos_me');
        return of(cached || []);
      })
    );
  }

  obtenerTurnoPorId(id: string): Observable<Turno> {
    return this.http.get<Turno>(`${this.baseUrl}/turnos/${id}`);
  }

  crearTurno(dto: TurnoDto): Observable<Turno> {
    return this.http.post<Turno>(`${this.baseUrl}/turnos`, dto);
  }

  actualizarTurno(id: string, dto: TurnoDto): Observable<Turno> {
    return this.http.patch<Turno>(`${this.baseUrl}/turnos/${id}`, dto);
  }

  eliminarTurno(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/turnos/${id}`);
  }

  importarTurnos(file: File): Observable<ImportResult> {
    const formData = new FormData();
    formData.append('archivo', file, file.name);
    return this.http.post<ImportResult>(`${this.baseUrl}/turnos/importar`, formData);
  }
}

