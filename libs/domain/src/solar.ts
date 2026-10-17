/**
 * solar.ts — cálculo de eventos solares con SunCalc (RF06, RN08).
 *
 * Todas las funciones son PURAS: reciben coordenadas y fecha como argumentos,
 * no leen Date.now() ni ninguna fuente externa. Sin I/O, sin frameworks.
 */
import * as SunCalc from 'suncalc';

// ─── Tipos públicos ─────────────────────────────────────────────────────────

/** Resultado del cálculo solar para una ubicación y fecha dadas. */
export interface EventosSolares {
  /** Hora local (objeto Date en UTC) del amanecer civil. */
  amanecer: Date;
  /** Hora local (objeto Date en UTC) del mediodía solar (tránsito). */
  mediodia: Date;
  /** Hora local (objeto Date en UTC) del atardecer civil. */
  atardecer: Date;
  /** Latitud usada en el cálculo, en grados decimales. */
  lat: number;
  /** Longitud usada en el cálculo, en grados decimales. */
  lng: number;
  /** Fecha (medianoche local) para la que se calcularon los eventos. */
  fecha: Date;
}

// ─── Helpers internos ───────────────────────────────────────────────────────

/**
 * Construye un objeto Date representando la medianoche local de una cadena
 * ISO `YYYY-MM-DD` en la zona `America/Lima` (UTC-5, sin DST).
 *
 * Se usa `Intl.DateTimeFormat` para interpretar la fecha en la zona objetivo
 * sin depender de la zona del sistema operativo.
 */
function medianocheLima(fechaIso: string): Date {
  // America/Lima = UTC-5 permanente (sin horario de verano).
  // Construimos la medianoche local sumando 5 h al inicio del día UTC.
  const [anio, mes, dia] = fechaIso.split('-').map(Number) as [
    number,
    number,
    number,
  ];
  // UTC midnight del día — a las 00:00 Lima son las 05:00 UTC.
  return new Date(Date.UTC(anio, mes - 1, dia, 5, 0, 0));
}

// ─── API pública ─────────────────────────────────────────────────────────────

/**
 * Calcula amanecer, mediodía solar y atardecer para las coordenadas y fecha
 * indicadas, forzando la interpretación en `America/Lima` (UTC-5, sin DST).
 *
 * @param lat       Latitud en grados decimales (positivo Norte, negativo Sur).
 * @param lng       Longitud en grados decimales (positivo Este, negativo Oeste).
 * @param fechaIso  Fecha en formato `YYYY-MM-DD`.
 * @returns         Objeto {@link EventosSolares} con las tres marcas de tiempo.
 *
 * @throws {Error}  Si SunCalc no puede calcular el amanecer o atardecer
 *                  (latitudes polares con sol de medianoche o noche polar).
 *
 * @example
 * const solar = calcularEventosSolares(-14.0678, -75.7286, '2026-10-17');
 * console.log(solar.amanecer.toISOString()); // ~10:30 UTC (05:30 Lima)
 */
export function calcularEventosSolares(
  lat: number,
  lng: number,
  fechaIso: string,
): EventosSolares {
  const fecha = medianocheLima(fechaIso);

  const tiempos = SunCalc.getTimes(fecha, lat, lng);
  const posicionMediodia = SunCalc.getPosition(fecha, lat, lng);

  const sunrise = tiempos.sunrise;
  const sunset = tiempos.sunset;
  const solarNoon = tiempos.solarNoon;

  if (!sunrise || !sunset || isNaN(sunrise.getTime()) || isNaN(sunset.getTime())) {
    throw new Error(
      `SunCalc no pudo calcular el amanecer/atardecer para lat=${lat}, lng=${lng}, fecha=${fechaIso}`,
    );
  }

  const mediodia = solarNoon && !isNaN(solarNoon.getTime())
    ? solarNoon
    : new Date((sunrise.getTime() + sunset.getTime()) / 2);

  void posicionMediodia;

  return {
    amanecer: sunrise,
    mediodia,
    atardecer: sunset,
    lat,
    lng,
    fecha,
  };
}

