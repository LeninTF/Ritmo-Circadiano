import {
  detectarTurnoNocturno,
  validarDescansoMinimo,
  validarJornadaRN01,
} from './jornada';

describe('validarJornadaRN01 (RN01, ventana movil de 24 h)', () => {
  // Horas de Lima explicitas (-05:00): el resultado no depende del TZ de la maquina.
  const bloque = (inicio: string, horas: number) => ({ inicio, horas });

  it('3 h + 4 h el mismo dia se acepta: 7 h en 24 h, cada bloque dentro de 5 h', () => {
    const r = validarJornadaRN01({
      nuevo: bloque('2026-10-20T14:00:00-05:00', 4),
      previos: [bloque('2026-10-20T07:00:00-05:00', 3)],
    });
    expect(r.horasVentana24h).toBe(7);
    expect(r.superaContinuo).toBe(false);
    expect(r.superaVentana).toBe(false);
  });

  it('el turno nuevo se cuenta una sola vez', () => {
    expect(validarJornadaRN01({ nuevo: bloque('2026-10-20T08:00:00-05:00', 4), previos: [] }).horasVentana24h).toBe(4);
  });

  it('ventana movil entre dos dias: 5 h + 3 h + 3 h en 24 h supera 10 h aunque cada dia calendario no', () => {
    const r = validarJornadaRN01({
      nuevo: bloque('2026-10-21T10:00:00-05:00', 3),
      previos: [bloque('2026-10-20T16:00:00-05:00', 5), bloque('2026-10-21T06:00:00-05:00', 3)],
    });
    expect(r.horasVentana24h).toBe(11);
    expect(r.superaVentana).toBe(true);
  });

  it('turnos a mas de 24 h no se suman', () => {
    const r = validarJornadaRN01({
      nuevo: bloque('2026-10-21T17:00:00-05:00', 5),
      previos: [bloque('2026-10-20T07:00:00-05:00', 5), bloque('2026-10-20T12:00:00-05:00', 5)],
    });
    expect(r.horasVentana24h).toBe(5);
    expect(r.superaVentana).toBe(false);
  });

  it('exactamente 10 h en 24 h no supera; el redondeo evita falsos 409', () => {
    const r = validarJornadaRN01({
      nuevo: bloque('2026-10-20T13:00:00-05:00', 4.9),
      previos: [bloque('2026-10-20T06:00:00-05:00', 5.1)],
    });
    expect(r.horasVentana24h).toBe(10);
    expect(r.superaVentana).toBe(false);
  });

  it('limite continuo: 5 h diurno y 4 h nocturno', () => {
    const diurno = validarJornadaRN01({ nuevo: bloque('2026-10-20T08:00:00-05:00', 5.5), previos: [] });
    expect(diurno.limiteContinuo).toBe(5);
    expect(diurno.superaContinuo).toBe(true);
    const nocturno = validarJornadaRN01({ nuevo: bloque('2026-10-20T22:00:00-05:00', 4), previos: [], esNocturno: true });
    expect(nocturno.limiteContinuo).toBe(4);
    expect(nocturno.superaContinuo).toBe(false);
    expect(validarJornadaRN01({ nuevo: bloque('2026-10-20T22:00:00-05:00', 4.5), previos: [], esNocturno: true }).superaContinuo).toBe(true);
  });
});

describe('validarDescansoMinimo', () => {
  it('es suficiente con 11 h exactas (valor por defecto)', () => {
    const r = validarDescansoMinimo('2026-10-20T06:00:00Z', '2026-10-20T17:00:00Z');
    expect(r.horasDescanso).toBe(11);
    expect(r.esSuficiente).toBe(true);
    expect(r.minRequerido).toBe(11);
  });

  it('es insuficiente con menos de 11 h', () => {
    const r = validarDescansoMinimo('2026-10-20T06:00:00Z', '2026-10-20T14:30:00Z');
    expect(r.horasDescanso).toBe(8.5);
    expect(r.esSuficiente).toBe(false);
  });

  it('acepta un minimo personalizado', () => {
    const r = validarDescansoMinimo('2026-10-20T06:00:00Z', '2026-10-20T14:00:00Z', 8);
    expect(r.esSuficiente).toBe(true);
    expect(r.minRequerido).toBe(8);
  });

  it('descanso negativo (turnos superpuestos) cuenta como 0 h', () => {
    const r = validarDescansoMinimo('2026-10-20T12:00:00Z', '2026-10-20T08:00:00Z');
    expect(r.horasDescanso).toBe(0);
    expect(r.esSuficiente).toBe(false);
  });
});

describe('detectarTurnoNocturno (franja 22:00-05:59)', () => {
  // Hora de Lima explicita: el resultado no depende de la zona horaria de la maquina.
  it('turno diurno no es nocturno', () => {
    expect(detectarTurnoNocturno('2026-10-20T08:00:00-05:00', '2026-10-20T12:00:00-05:00')).toBe(false);
  });

  it('inicio dentro de la franja nocturna', () => {
    expect(detectarTurnoNocturno('2026-10-20T23:00:00-05:00', '2026-10-20T23:30:00-05:00')).toBe(true);
    expect(detectarTurnoNocturno('2026-10-20T03:00:00-05:00', '2026-10-20T04:00:00-05:00')).toBe(true);
  });

  it('fin dentro de la franja nocturna', () => {
    expect(detectarTurnoNocturno('2026-10-20T18:00:00-05:00', '2026-10-20T22:00:00-05:00')).toBe(true);
  });

  it('limites: 05:59 es nocturno y 06:00 no', () => {
    expect(detectarTurnoNocturno('2026-10-20T05:59:00-05:00', '2026-10-20T05:59:30-05:00')).toBe(true);
    expect(detectarTurnoNocturno('2026-10-20T06:00:00-05:00', '2026-10-20T07:00:00-05:00')).toBe(false);
  });

  it('turno largo que atraviesa la noche aunque inicio y fin sean diurnos', () => {
    expect(detectarTurnoNocturno('2026-10-20T20:30:00-05:00', '2026-10-21T06:30:00-05:00')).toBe(true);
    expect(detectarTurnoNocturno('2026-10-20T07:00:00-05:00', '2026-10-21T08:00:00-05:00')).toBe(true);
  });

  it('usa la hora de Lima aunque la fecha llegue en UTC (servidor en UTC)', () => {
    // 14:00-20:00 Lima = 19:00-01:00 UTC: con getHours() en un servidor UTC salia nocturno.
    expect(detectarTurnoNocturno('2026-10-20T19:00:00Z', '2026-10-21T01:00:00Z')).toBe(false);
    expect(detectarTurnoNocturno('2026-10-20T19:00:00Z', '2026-10-21T04:30:00Z')).toBe(true);
  });

  it('fechas invalidas o rango invertido devuelven false', () => {
    expect(detectarTurnoNocturno('no-es-fecha', '2026-10-20T12:00:00-05:00')).toBe(false);
    expect(detectarTurnoNocturno('2026-10-20T12:00:00-05:00', 'no-es-fecha')).toBe(false);
    expect(detectarTurnoNocturno('2026-10-20T14:00:00-05:00', '2026-10-20T10:00:00-05:00')).toBe(false);
  });
});
