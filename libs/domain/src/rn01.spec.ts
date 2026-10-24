import {
  detectarTurnoNocturno,
  validarDescansoMinimo,
  validarJornadaRN01,
} from './rn01';

describe('validarJornadaRN01 (RN01)', () => {
  it('turno diurno: limite continuo de 5 h y limite diario de 10 h', () => {
    const r = validarJornadaRN01({ horasConduccion: 5, horasAcumuladasDia: 10 });
    expect(r.limiteContinuo).toBe(5);
    expect(r.limiteDiario).toBe(10);
    expect(r.superaContinuo).toBe(false);
    expect(r.superaDiario).toBe(false);
  });

  it('turno nocturno: limite continuo de 4 h', () => {
    expect(validarJornadaRN01({ horasConduccion: 4, horasAcumuladasDia: 4, esNocturno: true }).superaContinuo).toBe(false);
    const r = validarJornadaRN01({ horasConduccion: 4.5, horasAcumuladasDia: 4.5, esNocturno: true });
    expect(r.limiteContinuo).toBe(4);
    expect(r.superaContinuo).toBe(true);
  });

  it('marca exceso continuo diurno por encima de 5 h', () => {
    expect(validarJornadaRN01({ horasConduccion: 5.5, horasAcumuladasDia: 5.5 }).superaContinuo).toBe(true);
  });

  it('marca exceso diario por encima de 10 h y devuelve las horas totales', () => {
    const r = validarJornadaRN01({ horasConduccion: 4, horasAcumuladasDia: 11 });
    expect(r.superaDiario).toBe(true);
    expect(r.horasTotalesDia).toBe(11);
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
