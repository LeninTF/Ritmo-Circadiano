/**
 * solar.spec.ts — Tests del cálculo de eventos solares (RF06).
 *
 * Referencia de valores reales para Ica (-14.0678, -75.7286) el 17/10/2026:
 * amanecer ≈ 05:27 Lima (10:27 UTC), atardecer ≈ 18:00 Lima (23:00 UTC).
 */
import { calcularEventosSolares } from './solar';

const ICA_LAT = -14.0678;
const ICA_LNG = -75.7286;
const FECHA_PRUEBA = '2026-10-17';

describe('calcularEventosSolares', () => {
  let solar: ReturnType<typeof calcularEventosSolares>;

  beforeAll(() => {
    solar = calcularEventosSolares(ICA_LAT, ICA_LNG, FECHA_PRUEBA);
  });

  it('devuelve los tres eventos como objetos Date válidos', () => {
    expect(solar.amanecer).toBeInstanceOf(Date);
    expect(solar.mediodia).toBeInstanceOf(Date);
    expect(solar.atardecer).toBeInstanceOf(Date);
    expect(isNaN(solar.amanecer.getTime())).toBe(false);
    expect(isNaN(solar.mediodia.getTime())).toBe(false);
    expect(isNaN(solar.atardecer.getTime())).toBe(false);
  });

  it('el orden es: amanecer < mediodia < atardecer', () => {
    expect(solar.amanecer.getTime()).toBeLessThan(solar.mediodia.getTime());
    expect(solar.mediodia.getTime()).toBeLessThan(solar.atardecer.getTime());
  });

  it('el amanecer en Ica está entre las 04:00 y 07:00 hora local (UTC-5)', () => {
    // UTC-5: hora local = UTCHours - 5
    const horaLocalAmanecer = (solar.amanecer.getUTCHours() - 5 + 24) % 24;
    expect(horaLocalAmanecer).toBeGreaterThanOrEqual(4);
    expect(horaLocalAmanecer).toBeLessThanOrEqual(7);
  });

  it('el atardecer en Ica está entre las 17:00 y 20:00 hora local', () => {
    const horaLocalAtardecer = (solar.atardecer.getUTCHours() - 5 + 24) % 24;
    expect(horaLocalAtardecer).toBeGreaterThanOrEqual(17);
    expect(horaLocalAtardecer).toBeLessThanOrEqual(20);
  });

  it('el mediodía solar está entre las 11:30 y 13:30 hora local', () => {
    const horaLocal = (solar.mediodia.getUTCHours() - 5 + 24) % 24;
    const minuto = solar.mediodia.getUTCMinutes();
    const fraccion = horaLocal + minuto / 60;
    expect(fraccion).toBeGreaterThanOrEqual(11.5);
    expect(fraccion).toBeLessThanOrEqual(13.5);
  });

  it('refleja las coordenadas y fecha de entrada', () => {
    expect(solar.lat).toBe(ICA_LAT);
    expect(solar.lng).toBe(ICA_LNG);
    expect(solar.fecha).toBeInstanceOf(Date);
  });

  it('dos llamadas con la misma entrada devuelven los mismos ms (función pura)', () => {
    const solar2 = calcularEventosSolares(ICA_LAT, ICA_LNG, FECHA_PRUEBA);
    expect(solar2.amanecer.getTime()).toBe(solar.amanecer.getTime());
    expect(solar2.mediodia.getTime()).toBe(solar.mediodia.getTime());
    expect(solar2.atardecer.getTime()).toBe(solar.atardecer.getTime());
  });

  it('lanza error con latitud polar extrema (noche polar ártica en invierno)', () => {
    // 90°N en diciembre: noche polar → SunCalc devuelve Invalid Date.
    expect(() => calcularEventosSolares(89.9, 0, '2026-12-21')).toThrow();
  });

  it('funciona para Nasca (-14.8292, -74.9386)', () => {
    const solarNasca = calcularEventosSolares(-14.8292, -74.9386, FECHA_PRUEBA);
    expect(solarNasca.amanecer.getTime()).toBeLessThan(solarNasca.mediodia.getTime());
  });

  it('funciona para Lima (-12.0464, -77.0428)', () => {
    const solarLima = calcularEventosSolares(-12.0464, -77.0428, FECHA_PRUEBA);
    expect(solarLima.amanecer.getTime()).toBeLessThan(solarLima.mediodia.getTime());
  });
});
