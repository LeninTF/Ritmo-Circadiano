import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PanelIndicadoresResponse {
  suficiente: boolean;
  datos?: {
    conductoresUnicos: number;
    totalTurnos: number;
    promedioHorasConduccion: number;
    turnosNocturnos: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class IndicadoresService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/indicadores`;

  obtenerPanel(desde?: string, hasta?: string): Observable<PanelIndicadoresResponse> {
    let params = new HttpParams();
    if (desde) params = params.set('desde', desde);
    if (hasta) params = params.set('hasta', hasta);
    return this.http.get<PanelIndicadoresResponse>(`${this.baseUrl}/panel`, { params });
  }
}
