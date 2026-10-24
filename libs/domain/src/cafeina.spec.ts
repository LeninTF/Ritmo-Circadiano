import {
  CORTE_CAFEINA_ANTES_DORMIR_H,
  SEMIVIDA_H_DEFECTO,
  SEMIVIDA_H_FUMADOR,
  SEMIVIDA_H_METABOLIZADOR_LENTO,
  UMBRAL_CAFEINA_MG_DEFECTO,
} from './constantes';
import {
  calcularCafeinaActiva,
  calcularHoraCorte,
  IngestaCafeina,
  residual,
  resumirConsumoPorDia,
} from './cafeina';

describe('dominio farmacocinético de cafeína', () => {
  describe('residual', () => {
    it('suma correctamente múltiples ingestas y coincide con el cálculo manual (< 1 mg)', () => {
      const ingestas: IngestaCafeina[] = [
        { dosisMg: 80, hora: 8 },
        { dosisMg: 60, hora: 11 },
        { dosisMg: 100, hora: 13 },
      ];
      const esperado = 80 * 0.5 ** ((16 - 8) / 5)
        + 60 * 0.5 ** ((16 - 11) / 5)
        + 100 * 0.5 ** ((16 - 13) / 5);

      expect(Math.abs(residual(ingestas, 16) - esperado)).toBeLessThan(1);
      expect(residual(ingestas, 16)).toBeCloseTo(122.3656, 3);
    });

    it('ignora ingestas posteriores al instante consultado y acepta una lista vacía', () => {
      expect(residual([
        { dosisMg: 100, hora: 8 },
        { dosisMg: 200, hora: 11 },
      ], 10, 5)).toBeCloseTo(75.7858, 3);
      expect(residual([], 10)).toBe(0);
    });

    it.each([
      [SEMIVIDA_H_FUMADOR, 50],
      [SEMIVIDA_H_DEFECTO, 50],
      [SEMIVIDA_H_METABOLIZADOR_LENTO, 50],
    ])('aplica semivida de %i h', (tMedia, esperado) => {
      expect(residual([{ dosisMg: 100, hora: 0 }], tMedia, tMedia))
        .toBeCloseTo(esperado, 4);
    });

    it('rechaza semivida, hora o ingestas fuera de rango', () => {
      expect(() => residual([], 0, 0)).toThrow(RangeError);
      expect(() => residual([], Number.NaN)).toThrow(RangeError);
      expect(() => residual([{ dosisMg: -1, hora: 0 }], 1)).toThrow(RangeError);
      expect(() => residual([{ dosisMg: 1, hora: Number.POSITIVE_INFINITY }], 1))
        .toThrow(RangeError);
    });
  });

  describe('calcularHoraCorte', () => {
    it('RN04: aplica el cálculo farmacocinético cuando es más restrictivo que RN05', () => {
      const dosis = 200;
      const dormir = 23;
      const libre = 50;
      const corteRn04 = dormir - 5 * Math.log2(dosis / libre);

      expect(calcularHoraCorte(dosis, dormir, [], 5, 50)).toBe(corteRn04);
      expect(corteRn04).toBeLessThan(dormir - CORTE_CAFEINA_ANTES_DORMIR_H);
    });

    it('usa usuario.semivida_h en residual y hora de corte; usa 5 h si no está configurada', () => {
      const usuario = { semivida_h: 8 };
      expect(residual([{ dosisMg: 100, hora: 0 }], 8, usuario)).toBe(50);
      expect(residual([{ dosisMg: 100, hora: 0 }], 5, {})).toBe(50);
      expect(calcularHoraCorte(200, 23, [], usuario, 50)).toBe(23 - 8 * Math.log2(4));
    });

    it('RN05 prevalece sobre RN04 cuando el cálculo permitiría cafeína hasta dormir', () => {
      const dormir = 23;
      expect(calcularHoraCorte(10, dormir, [], 5, UMBRAL_CAFEINA_MG_DEFECTO))
        .toBe(dormir - CORTE_CAFEINA_ANTES_DORMIR_H);
    });

    it('retorna null si el residual previo alcanza exactamente el umbral o lo supera', () => {
      expect(calcularHoraCorte(30, 20, [{ dosisMg: 50, hora: 20 }], 5, 50)).toBeNull();
      expect(calcularHoraCorte(30, 20, [{ dosisMg: 60, hora: 20 }], 5, 50)).toBeNull();
    });

    it.each([
      [SEMIVIDA_H_FUMADOR],
      [SEMIVIDA_H_DEFECTO],
      [SEMIVIDA_H_METABOLIZADOR_LENTO],
    ])('respeta RN05 con semivida de %i h', (tMedia) => {
      const dormir = 7;
      const corte = calcularHoraCorte(80, dormir, [], tMedia, 50);
      expect(corte).not.toBeNull();
      expect(corte).toBeLessThanOrEqual(dormir - CORTE_CAFEINA_ANTES_DORMIR_H);
    });

    it('valida dosis, hora, semivida y umbral', () => {
      expect(() => calcularHoraCorte(-1, 20, [])).toThrow(RangeError);
      expect(() => calcularHoraCorte(1, Number.NaN, [])).toThrow(RangeError);
      expect(() => calcularHoraCorte(1, 20, [], -2)).toThrow(RangeError);
      expect(() => calcularHoraCorte(1, 20, [], { semivida_h: 0 })).toThrow(RangeError);
      expect(() => calcularHoraCorte(1, 20, [], 5, -1)).toThrow(RangeError);
    });
  });

  describe('calcularCafeinaActiva (SPEC §7.1, con ahora fijo)', () => {
    const ahora = 1000;

    it.each<[string, IngestaCafeina[], number, number | null]>([
      ['100 mg hace 5 h', [{ dosisMg: 100, hora: ahora - 5 }], 50, null],
      ['200 mg ahora', [{ dosisMg: 200, hora: ahora }], 200, ahora + 10],
      ['300 mg hace 25 h (fuera de la ventana)', [{ dosisMg: 300, hora: ahora - 25 }], 0, null],
      ['ninguno', [], 0, null],
    ])('%s', (_caso, ingestas, mg, horaNivelBajo) => {
      const activa = calcularCafeinaActiva(ingestas, ahora, 5, 50);
      expect(activa.mg).toBeCloseTo(mg, 6);
      if (horaNivelBajo === null) expect(activa.horaNivelBajo).toBeNull();
      else expect(activa.horaNivelBajo).toBeCloseTo(horaNivelBajo, 6);
    });

    it('95 mg hace 10 h + 63 mg ahora: ~87 mg y baja en ~3 h 58 min 29 s (±1 min)', () => {
      const activa = calcularCafeinaActiva(
        [{ dosisMg: 95, hora: ahora - 10 }, { dosisMg: 63, hora: ahora }],
        ahora,
      );
      expect(activa.mg).toBeCloseTo(86.75, 6);
      expect(Math.round(activa.mg)).toBe(87);
      const segundos = ((activa.horaNivelBajo ?? Number.NaN) - ahora) * 3600;
      expect(Math.abs(segundos - (3 * 3600 + 58 * 60 + 29))).toBeLessThan(60);
    });

    it('rechaza ahora o umbral inválidos', () => {
      expect(() => calcularCafeinaActiva([], Number.NaN)).toThrow(RangeError);
      expect(() => calcularCafeinaActiva([], ahora, 5, 0)).toThrow(RangeError);
    });
  });

  describe('resumirConsumoPorDia (SPEC §7.2)', () => {
    const h = (iso: string) => Date.parse(iso) / 3_600_000;
    // 15:00 en Lima del 24 de octubre.
    const ahora = h('2026-10-24T20:00:00.000Z');

    it('agrupa por día de Lima, rellena con 0 y termina en hoy', () => {
      const resumen = resumirConsumoPorDia([
        { dosisMg: 95, hora: h('2026-10-24T04:00:00.000Z') }, // 23:00 del 23 en Lima
        { dosisMg: 63, hora: h('2026-10-24T06:00:00.000Z') }, // 01:00 del 24 en Lima
        { dosisMg: 95, hora: h('2026-10-24T15:00:00.000Z') },
        { dosisMg: 80, hora: h('2026-10-10T15:00:00.000Z') }, // fuera del rango
      ], ahora, 7);

      expect(resumen.map((d) => d.fecha)).toEqual([
        '2026-10-18', '2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23', '2026-10-24',
      ]);
      expect(resumen[5]).toEqual({ fecha: '2026-10-23', totalMg: 95, conteo: 1 });
      expect(resumen[6]).toEqual({ fecha: '2026-10-24', totalMg: 158, conteo: 2 });
      expect(resumen.slice(0, 5).every((d) => d.totalMg === 0 && d.conteo === 0)).toBe(true);
    });

    it('rechaza una cantidad de días inválida', () => {
      expect(() => resumirConsumoPorDia([], ahora, 0)).toThrow(RangeError);
      expect(() => resumirConsumoPorDia([], ahora, 1.5)).toThrow(RangeError);
    });
  });
});
