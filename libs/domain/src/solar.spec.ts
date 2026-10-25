/**
 * solar.spec.ts — Tests del cálculo de eventos solares (RF06, CP-06).
 */
import { calcularEventosSolares } from './solar';

const ICA_LAT = -14.0689;
const ICA_LNG = -75.7222;
const FECHA_PRUEBA = '2026-10-17';

/** Hora local de Lima (UTC-5) en horas decimales. */
function horaLima(d: Date): number {
  return (((d.getUTCHours() - 5 + 24) % 24) + d.getUTCMinutes() / 60);
}

/** Fecha local de Lima YYYY-MM-DD. */
function fechaLima(d: Date): string {
  return new Date(d.getTime() - 5 * 3_600_000).toISOString().slice(0, 10);
}

describe('calcularEventosSolares', () => {
  const solar = calcularEventosSolares(ICA_LAT, ICA_LNG, FECHA_PRUEBA);

  it('devuelve los eventos del mismo día local pedido, no del anterior', () => {
    expect(fechaLima(solar.amanecer)).toBe(FECHA_PRUEBA);
    expect(fechaLima(solar.mediodia)).toBe(FECHA_PRUEBA);
    expect(fechaLima(solar.atardecer)).toBe(FECHA_PRUEBA);
    expect(solar.fecha.toISOString()).toBe('2026-10-17T05:00:00.000Z');
  });

  it('el orden es: amanecer < mediodia < atardecer', () => {
    expect(solar.amanecer.getTime()).toBeLessThan(solar.mediodia.getTime());
    expect(solar.mediodia.getTime()).toBeLessThan(solar.atardecer.getTime());
  });

  it('horas plausibles en Ica (amanecer 4-7 h, mediodía 11:30-13:30, atardecer 17-20 h)', () => {
    expect(horaLima(solar.amanecer)).toBeGreaterThanOrEqual(4);
    expect(horaLima(solar.amanecer)).toBeLessThanOrEqual(7);
    expect(horaLima(solar.mediodia)).toBeGreaterThanOrEqual(11.5);
    expect(horaLima(solar.mediodia)).toBeLessThanOrEqual(13.5);
    expect(horaLima(solar.atardecer)).toBeGreaterThanOrEqual(17);
    expect(horaLima(solar.atardecer)).toBeLessThanOrEqual(20);
  });

  it('refleja las coordenadas de entrada y es pura', () => {
    expect(solar.lat).toBe(ICA_LAT);
    expect(solar.lng).toBe(ICA_LNG);
    const otra = calcularEventosSolares(ICA_LAT, ICA_LNG, FECHA_PRUEBA);
    expect(otra.amanecer.getTime()).toBe(solar.amanecer.getTime());
  });

  it('lanza error con latitud polar extrema (noche polar ártica en invierno)', () => {
    expect(() => calcularEventosSolares(89.9, 0, '2026-12-21')).toThrow();
  });
});

describe('CP-06 · Nasca frente a tabla de referencia (diferencia ≤ 2 min)', () => {
  // Referencia NOAA vía api.sunrise-sunset.org para (-14.8292, -74.9386), instantes UTC.
  const REFERENCIA = [
    { fecha: '2026-06-21', amanecer: '2026-06-21T11:24:09Z', atardecer: '2026-06-21T22:39:06Z' },
    { fecha: '2026-10-17', amanecer: '2026-10-17T10:31:23Z', atardecer: '2026-10-17T22:58:43Z' },
    { fecha: '2026-12-21', amanecer: '2026-12-21T10:27:40Z', atardecer: '2026-12-21T23:28:09Z' },
  ];
  const DOS_MIN_MS = 2 * 60_000;

  it.each(REFERENCIA)('$fecha', ({ fecha, amanecer, atardecer }) => {
    const solar = calcularEventosSolares(-14.8292, -74.9386, fecha);
    expect(Math.abs(solar.amanecer.getTime() - Date.parse(amanecer))).toBeLessThanOrEqual(DOS_MIN_MS);
    expect(Math.abs(solar.atardecer.getTime() - Date.parse(atardecer))).toBeLessThanOrEqual(DOS_MIN_MS);
  });
});
