import { Injectable } from '@angular/core';

export interface Ubicacion {
  lat: number;
  lng: number;
  nombre: string;
  zonaHoraria: string;
}

const CIUDADES_FALLBACK: Ubicacion[] = [
  { lat: -14.0689, lng: -75.7222, nombre: 'Ica', zonaHoraria: 'America/Lima' },
  { lat: -15.363, lng: -74.874, nombre: 'Nasca', zonaHoraria: 'America/Lima' },
  { lat: -14.742, lng: -75.293, nombre: 'Palpa', zonaHoraria: 'America/Lima' },
  { lat: -15.803, lng: -74.502, nombre: 'Acarí', zonaHoraria: 'America/Lima' },
  { lat: -12.0464, lng: -77.0428, nombre: 'Lima', zonaHoraria: 'America/Lima' },
];

@Injectable({ providedIn: 'root' })
export class GeoService {
  private timeoutMs = 8000;

  async obtenerUbicacion(): Promise<Ubicacion> {
    try {
      const pos = await this.pedirConTimeout(this.timeoutMs);
      return {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        nombre: 'Ubicación actual',
        zonaHoraria: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
    } catch {
      return this.seleccionarFallback();
    }
  }

  private pedirConTimeout(ms: number): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => reject(new Error('timeout')), ms);
      navigator.geolocation.getCurrentPosition(
        (pos) => { clearTimeout(timeoutId); resolve(pos); },
        (err) => { clearTimeout(timeoutId); reject(err); },
        { enableHighAccuracy: false, timeout: ms, maximumAge: 5 * 60 * 1000 }
      );
    });
  }

  seleccionarFallback(): Ubicacion {
    // Por simplicidad, primero Ica; en producción se puede exponer selector UI
    return CIUDADES_FALLBACK[0];
  }

  listarCiudades(): Ubicacion[] {
    return CIUDADES_FALLBACK;
  }
}
