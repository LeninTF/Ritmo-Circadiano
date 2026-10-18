import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TurnosService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/operaciones';

  listarRutas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/rutas`);
  }

  listarTurnos(idUsuario?: string, fecha?: string): Observable<any[]> {
    let params = new HttpParams();
    if (idUsuario) params = params.set('idUsuario', idUsuario);
    if (fecha) params = params.set('fecha', fecha);
    return this.http.get<any[]>(`${this.baseUrl}/turnos`, { params });
  }

  listarTurnosMe(desde?: string, hasta?: string, idUsuario?: string): Observable<any[]> {
    let params = new HttpParams();
    if (desde) params = params.set('desde', desde);
    if (hasta) params = params.set('hasta', hasta);
    if (idUsuario) params = params.set('idUsuario', idUsuario);
    return this.http.get<any[]>(`${this.baseUrl}/turnos/me`, { params });
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
