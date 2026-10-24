import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import type { CrearUbicacionDto, SedeEmpresa, UbicacionDto } from '@circadiano/contracts';
import { SEDES_EMPRESA } from '@circadiano/domain';
import { environment } from '../../../environments/environment';

const TIEMPO_GPS_MS = 8000;

/** RF06: ubicacion por GPS o, si se niega el permiso, por sede elegida. */
@Injectable({ providedIn: 'root' })
export class GeoService {
  private readonly http = inject(HttpClient);
  readonly sedes = SEDES_EMPRESA;

  /** null si no hay permiso, no hay GPS o tarda mas de 8 s: la UI muestra las sedes. */
  obtenerPorGps(): Promise<CrearUbicacionDto | null> {
    if (!('geolocation' in navigator)) return Promise.resolve(null);
    return new Promise((resolve) =>
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => resolve({ lat: coords.latitude, lng: coords.longitude, origen: 'Ubicación actual' }),
        () => resolve(null),
        { enableHighAccuracy: false, timeout: TIEMPO_GPS_MS, maximumAge: 5 * 60_000 },
      ),
    );
  }

  registrar(ubicacion: CrearUbicacionDto | SedeEmpresa): Promise<UbicacionDto> {
    const { lat, lng } = ubicacion;
    const origen = 'nombre' in ubicacion ? ubicacion.nombre : ubicacion.origen;
    return firstValueFrom(this.http.post<UbicacionDto>(`${environment.apiUrl}/ubicacion`, { lat, lng, origen }));
  }
}
