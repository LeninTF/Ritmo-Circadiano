import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { HistorialRespuestaDto } from '@circadiano/contracts';
import { environment } from '../../../environments/environment';

export type PeriodoHistorial = 7 | 14 | 30;

@Injectable({ providedIn: 'root' })
export class HistorialService {
  private readonly http = inject(HttpClient);

  obtener(dias: PeriodoHistorial) {
    return this.http.get<HistorialRespuestaDto>(
      `${environment.apiUrl}/historial/me`,
      {
        params: { dias },
      },
    );
  }
}
