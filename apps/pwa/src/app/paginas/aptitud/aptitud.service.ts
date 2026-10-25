import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type {
  CrearAptitudRequest,
  CrearAptitudResponse,
  ConsultarDespachoRequest,
  ConsultarDespachoResponse,
} from '@circadiano/contracts';

@Injectable({ providedIn: 'root' })
export class AptitudService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/aptitud';

  crearAptitud(turnoId: string, request: CrearAptitudRequest): Observable<CrearAptitudResponse> {
    return this.http.post<CrearAptitudResponse>(`${this.baseUrl}/${turnoId}`, request);
  }

  consultarDespacho(request: ConsultarDespachoRequest): Observable<ConsultarDespachoResponse> {
    return this.http.get<ConsultarDespachoResponse>(`${this.baseUrl}/despacho`, {
      params: request.codigo ? { fecha: request.fecha, codigo: request.codigo } : { fecha: request.fecha },
    });
  }
}