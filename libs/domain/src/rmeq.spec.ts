/**
 * rmeq.spec.ts — Tests del clasificador de cronotipo (RN07).
 */
import {
  clasificarCronotipo,
  clasificarCronotipoDesdeRespuestas,
  sumarRespuestasRmeq,
} from './rmeq';
import type { RespuestasRmeq } from './rmeq';

describe('sumarRespuestasRmeq', () => {
  it('suma correctamente las 5 respuestas', () => {
    const r: RespuestasRmeq = { p1: 2, p2: 3, p3: 2, p4: 3, p5: 3 };
    expect(sumarRespuestasRmeq(r)).toBe(13);
  });

  it('clampea al mínimo 4 si la suma es menor', () => {
    const r: RespuestasRmeq = { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0 };
    expect(sumarRespuestasRmeq(r)).toBe(4);
  });

  it('clampea al máximo 25 si la suma excede', () => {
    const r: RespuestasRmeq = { p1: 10, p2: 10, p3: 10, p4: 10, p5: 10 };
    expect(sumarRespuestasRmeq(r)).toBe(25);
  });
});

describe('clasificarCronotipo — todos los rangos (RN07)', () => {
  it('4 → vespertino_definido', () => expect(clasificarCronotipo(4)).toBe('vespertino_definido'));
  it('7 → vespertino_definido', () => expect(clasificarCronotipo(7)).toBe('vespertino_definido'));
  it('8 → vespertino_moderado', () => expect(clasificarCronotipo(8)).toBe('vespertino_moderado'));
  it('11 → vespertino_moderado', () => expect(clasificarCronotipo(11)).toBe('vespertino_moderado'));
  it('12 → intermedio', () => expect(clasificarCronotipo(12)).toBe('intermedio'));
  it('14 → intermedio', () => expect(clasificarCronotipo(14)).toBe('intermedio'));
  it('17 → intermedio', () => expect(clasificarCronotipo(17)).toBe('intermedio'));
  it('18 → matutino_moderado', () => expect(clasificarCronotipo(18)).toBe('matutino_moderado'));
  it('21 → matutino_moderado', () => expect(clasificarCronotipo(21)).toBe('matutino_moderado'));
  it('22 → matutino_definido', () => expect(clasificarCronotipo(22)).toBe('matutino_definido'));
  it('25 → matutino_definido', () => expect(clasificarCronotipo(25)).toBe('matutino_definido'));

  it('puntaje fuera de rango (0) → intermedio (defecto RN07)', () => {
    expect(clasificarCronotipo(0)).toBe('intermedio');
  });
  it('puntaje fuera de rango (99) → intermedio (defecto RN07)', () => {
    expect(clasificarCronotipo(99)).toBe('intermedio');
  });

  it('los bordes entre rangos no se solapan (7→vespertino, 8→moderado)', () => {
    expect(clasificarCronotipo(7)).not.toBe('vespertino_moderado');
    expect(clasificarCronotipo(8)).not.toBe('vespertino_definido');
  });
});

describe('clasificarCronotipoDesdeRespuestas', () => {
  it('respuestas que suman 5 → vespertino_definido', () => {
    const r: RespuestasRmeq = { p1: 1, p2: 1, p3: 1, p4: 1, p5: 1 };
    expect(clasificarCronotipoDesdeRespuestas(r)).toBe('vespertino_definido');
  });

  it('respuestas que suman 14 → intermedio', () => {
    const r: RespuestasRmeq = { p1: 3, p2: 3, p3: 2, p4: 3, p5: 3 };
    expect(clasificarCronotipoDesdeRespuestas(r)).toBe('intermedio');
  });

  it('respuestas que suman 23 → matutino_definido', () => {
    const r: RespuestasRmeq = { p1: 5, p2: 5, p3: 4, p4: 5, p5: 4 };
    expect(clasificarCronotipoDesdeRespuestas(r)).toBe('matutino_definido');
  });
});
