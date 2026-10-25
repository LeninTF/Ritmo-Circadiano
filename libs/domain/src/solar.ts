/**
 * solar.ts — cálculo de eventos solares con SunCalc (RF06, RN08).
 *
 * Funciones PURAS: reciben coordenadas y fecha como argumentos,
 * no leen Date.now() ni ninguna fuente externa. Sin I/O, sin frameworks.
 */
import * as SunCalc from 'suncalc';
import { DESFASE_LIMA_H } from './constantes';

/** Resultado del cálculo solar para una ubicación y fecha dadas. */
export interface EventosSolares {
  /** Salida del sol (instante UTC). */
  amanecer: Date;
  /** Mediodía solar (tránsito). */
  mediodia: Date;
  /** Puesta del sol. */
  atardecer: Date;
  lat: number;
  lng: number;
  /** Medianoche local (America/Lima) del día calculado. */
  fecha: Date;
}

function fechaLima(fechaIso: string, horaLocal: number): Date {
  const [anio, mes, dia] = fechaIso.split('-').map(Number) as [number, number, number];
  return new Date(Date.UTC(anio, mes - 1, dia, horaLocal - DESFASE_LIMA_H));
}

/**
 * Calcula amanecer, mediodía solar y atardecer del día `fechaIso` en America/Lima.
 *
 * @throws {Error} En latitudes polares sin salida o puesta del sol.
 */
export function calcularEventosSolares(lat: number, lng: number, fechaIso: string): EventosSolares {
  // SunCalc elige el ciclo solar más cercano a la hora dada: con la medianoche local
  // de Perú devuelve el día anterior, por eso se le pasa el mediodía local.
  const { sunrise, solarNoon, sunset } = SunCalc.getTimes(fechaLima(fechaIso, 12), lat, lng);

  if (!sunrise || !sunset || !solarNoon || isNaN(sunrise.getTime()) || isNaN(sunset.getTime())) {
    throw new Error(
      `SunCalc no pudo calcular el amanecer/atardecer para lat=${lat}, lng=${lng}, fecha=${fechaIso}`,
    );
  }

  return {
    amanecer: sunrise,
    mediodia: solarNoon,
    atardecer: sunset,
    lat,
    lng,
    fecha: fechaLima(fechaIso, 0),
  };
}
