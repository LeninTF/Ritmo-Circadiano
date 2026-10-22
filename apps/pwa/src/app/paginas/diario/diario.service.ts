import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { RegistroSuenoDto } from '@circadiano/contracts';

export type EstadoGuardadoDiario = 'inicial' | 'guardando' | 'error' | 'integracion_pendiente';

@Injectable({
  providedIn: 'root',
})
export class DiarioService {
  obtenerDiario(fecha: string): Observable<RegistroSuenoDto | null> {
    if (!fecha) return of(null);
    // Sin autenticación oficial de I1 ni almacenamiento persistente local arbitrario
    return of(null);
  }

  guardarDiario(dto: RegistroSuenoDto, forzarError = false): Observable<{ estado: EstadoGuardadoDiario; clientId: string }> {
    if (!dto) {
      return throwError(() => new Error('Invalid DTO'));
    }
    if (forzarError) {
      return throwError(() => new Error('Error al guardar diario'));
    }
    // Sin autenticación verificable ni OutboxService, el guardado persistente está deshabilitado.
    return throwError(() => new Error('Guardado persistente deshabilitado: requiere la integración de autenticación y OutboxService.'));
  }
}
