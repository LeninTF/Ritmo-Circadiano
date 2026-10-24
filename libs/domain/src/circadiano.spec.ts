/**
 * circadiano.spec.ts — Tests del motor circadiano (RF07, RN04-RN08, CP-07).
 */
import * as fc from 'fast-check';
import { derivarRecordatorios, generarPlan } from './circadiano';
import type { ConfiguracionMotor, ParametrosTurno, ResultadoPlan } from './circadiano';
import { calcularEventosSolares } from './solar';
import { VERSION_ALGORITMO_PLAN } from './constantes';

const CFG: ConfiguracionMotor = {
  versionAlgoritmo: VERSION_ALGORITMO_PLAN,
  semividaH: 5,
  umbralCafeinaMg: 50,
};

const SOLAR_ICA = calcularEventosSolares(-14.0689, -75.7222, '2026-10-17');

const H = 3_600_000;
const horas = (a: Date, b: Date) => (b.getTime() - a.getTime()) / H;
const addH = (d: Date, h: number) => new Date(d.getTime() + h * H);
/** Instante a partir de una hora local de Lima del 17-oct-2026 (puede pasar de 24). */
const lima = (hora: number) => new Date(Date.UTC(2026, 9, 17, 5) + hora * H);

const TURNO_DIURNO: ParametrosTurno = { inicioTurno: lima(8), finTurno: lima(16), esNocturno: false };
const TURNO_NOCTURNO: ParametrosTurno = { inicioTurno: lima(22), finTurno: lima(29), esNocturno: true };

describe('generarPlan — diurno 08:00–16:00', () => {
  const plan = generarPlan(TURNO_DIURNO, 'intermedio', SOLAR_ICA, [], CFG);

  it('despierta 90 min antes y duerme 7,5 h, sin siesta', () => {
    expect(plan.tipoTurno).toBe('diurno');
    expect(plan.finSueno).toEqual(lima(6.5));
    expect(horas(plan.inicioSueno, plan.finSueno)).toBeCloseTo(7.5, 5);
    expect(plan.inicioSiesta).toBeNull();
    expect(plan.protegerLuz).toBe(false);
  });

  it('dos picos: despertar + 2–4 h y uno de tarde el mismo día', () => {
    expect(plan.picos).toHaveLength(2);
    expect(plan.picos[0].inicio).toEqual(addH(plan.finSueno, 2));
    expect(plan.picos[1].inicio).toEqual(addH(SOLAR_ICA.mediodia, 1));
    expect(plan.picos[1].inicio.getTime()).toBeGreaterThan(TURNO_DIURNO.inicioTurno.getTime());
  });

  it('sin ingestas: corte = dormir − 6 h (RN05)', () => {
    expect(plan.horaCorteCafeina).toEqual(addH(plan.inicioSueno, -6));
  });

  it('vespertino +30 min, matutino −30 min', () => {
    const vesp = generarPlan(TURNO_DIURNO, 'vespertino_definido', SOLAR_ICA, [], CFG);
    const mat = generarPlan(TURNO_DIURNO, 'matutino_definido', SOLAR_ICA, [], CFG);
    expect(horas(plan.finSueno, vesp.finSueno)).toBeCloseTo(0.5, 5);
    expect(horas(plan.finSueno, mat.finSueno)).toBeCloseTo(-0.5, 5);
  });

  it('regresión: turno de 06:00 no da luz antes del amanecer (RN08)', () => {
    const temprano = generarPlan(
      { inicioTurno: lima(6), finTurno: lima(14), esNocturno: false },
      'intermedio', SOLAR_ICA, [], CFG,
    );
    expect(temprano.ventanaLuz?.inicio).toEqual(SOLAR_ICA.amanecer);
  });

  it('sin luz de día si se despierta después del atardecer', () => {
    const tarde = generarPlan(
      { inicioTurno: lima(21), finTurno: lima(21.5), esNocturno: false },
      'intermedio', SOLAR_ICA, [], CFG,
    );
    expect(tarde.ventanaLuz).toBeNull();
  });
});

describe('generarPlan — nocturno 22:00–05:00', () => {
  const plan = generarPlan(TURNO_NOCTURNO, 'vespertino_definido', SOLAR_ICA, [], CFG);

  it('regresión: duerme 7,5 h desde fin + 60 min (antes daba 0 h)', () => {
    expect(plan.tipoTurno).toBe('nocturno');
    expect(plan.inicioSueno).toEqual(lima(30));
    expect(horas(plan.inicioSueno, plan.finSueno)).toBeCloseTo(7.5, 5);
    expect(plan.inicioSiesta).toBeNull();
  });

  it('no aplica ajuste por cronotipo', () => {
    const intermedio = generarPlan(TURNO_NOCTURNO, 'intermedio', SOLAR_ICA, [], CFG);
    expect(plan.inicioSueno).toEqual(intermedio.inicioSueno);
  });

  it('proteger de luz entre fin del turno y el sueño (RN08)', () => {
    expect(plan.protegerLuz).toBe(true);
    expect(plan.ventanaLuz).toEqual({ inicio: TURNO_NOCTURNO.finTurno, fin: plan.inicioSueno });
  });

  it('siguiente turno cercano: sueño hasta 60 min antes y siesta de 90 min antes de este turno (RN06)', () => {
    const corto = generarPlan(
      { ...TURNO_NOCTURNO, inicioSiguienteTurno: lima(36) },
      'intermedio', SOLAR_ICA, [], CFG,
    );
    expect(corto.finSueno).toEqual(lima(35));
    expect(corto.finSiesta).toEqual(lima(21));
    expect(horas(corto.inicioSiesta as Date, corto.finSiesta as Date)).toBe(1.5);
  });
});

describe('generarPlan — cafeína (RN04 + RN05)', () => {
  const dormirH = (p: ResultadoPlan) => p.inicioSueno.getTime() / H;

  it('dosis previa grande adelanta el corte antes de dormir − 6 h', () => {
    const base = generarPlan(TURNO_DIURNO, 'intermedio', SOLAR_ICA, [], CFG);
    // 100 mg 8 h antes deja ~33 mg al dormir: libre ~17 mg => corte ~12,8 h antes de dormir.
    const ingesta = { dosisMg: 100, hora: dormirH(base) - 8 };
    const plan = generarPlan(TURNO_DIURNO, 'intermedio', SOLAR_ICA, [ingesta], CFG);
    expect(plan.horaCorteCafeina?.getTime()).toBeLessThan(addH(plan.inicioSueno, -6).getTime());
  });

  it('si el residual ya supera el umbral no hay corte (null)', () => {
    const base = generarPlan(TURNO_DIURNO, 'intermedio', SOLAR_ICA, [], CFG);
    const plan = generarPlan(TURNO_DIURNO, 'intermedio', SOLAR_ICA, [{ dosisMg: 400, hora: dormirH(base) - 1 }], CFG);
    expect(plan.horaCorteCafeina).toBeNull();
    expect(derivarRecordatorios(plan).map((r) => r.tipo)).not.toContain('corte_cafeina');
  });
});

describe('derivarRecordatorios', () => {
  it('diurno: luz, corte, relajación y dormir en ISO', () => {
    const rec = derivarRecordatorios(generarPlan(TURNO_DIURNO, 'intermedio', SOLAR_ICA, [], CFG));
    expect(rec.map((r) => r.tipo)).toEqual(['luz', 'corte_cafeina', 'relajacion', 'dormir']);
    rec.forEach((r) => expect(Number.isNaN(Date.parse(r.programadaPara))).toBe(false));
  });

  it('nocturno: no recuerda buscar luz cuando hay que protegerse', () => {
    const rec = derivarRecordatorios(generarPlan(TURNO_NOCTURNO, 'intermedio', SOLAR_ICA, [], CFG));
    expect(rec.map((r) => r.tipo)).not.toContain('luz');
  });
});

describe('generarPlan — propiedades (CP-07)', () => {
  const turnoArb = fc
    .record({
      inicioH: fc.integer({ min: 0, max: 47 }),
      durH: fc.integer({ min: 4, max: 12 }),
      esNocturno: fc.boolean(),
      descansoH: fc.option(fc.integer({ min: 6, max: 30 }), { nil: null }),
    })
    .map(({ inicioH, durH, esNocturno, descansoH }): ParametrosTurno => ({
      inicioTurno: lima(inicioH),
      finTurno: lima(inicioH + durH),
      esNocturno,
      inicioSiguienteTurno: descansoH === null ? null : lima(inicioH + durH + descansoH),
    }));
  const plan = (t: ParametrosTurno) => generarPlan(t, 'intermedio', SOLAR_ICA, [], CFG);

  it('≥ 7 h de sueño, o siesta de 90 min que termina ≥ 60 min antes del turno (RN06)', () =>
    fc.assert(fc.property(turnoArb, (t) => {
      const p = plan(t);
      if (horas(p.inicioSueno, p.finSueno) >= 7) return true;
      return p.inicioSiesta !== null && p.finSiesta !== null
        && horas(p.inicioSiesta, p.finSiesta) === 1.5
        && horas(p.finSiesta, t.inicioTurno) >= 1;
    }), { numRuns: 300 }));

  it('el sueño nunca tiene duración negativa', () =>
    fc.assert(fc.property(turnoArb, (t) => {
      const p = plan(t);
      return p.finSueno.getTime() >= p.inicioSueno.getTime();
    }), { numRuns: 300 }));

  it('corte de cafeína ≤ inicio del sueño − 6 h (RN05)', () =>
    fc.assert(fc.property(turnoArb, (t) => {
      const p = plan(t);
      return p.horaCorteCafeina === null || horas(p.horaCorteCafeina, p.inicioSueno) >= 6;
    }), { numRuns: 300 }));

  it('diurno: la ventana de luz cae dentro de [amanecer, atardecer] (RN08)', () =>
    fc.assert(fc.property(turnoArb.filter((t) => !t.esNocturno), (t) => {
      const luz = plan(t).ventanaLuz;
      return luz === null || (
        luz.inicio.getTime() >= SOLAR_ICA.amanecer.getTime()
        && luz.fin.getTime() <= SOLAR_ICA.atardecer.getTime()
      );
    }), { numRuns: 300 }));
});

describe('RNF01 · plan offline ≤ 200 ms', () => {
  it('cálculo solar + plan + recordatorios en menos de 200 ms', () => {
    const t0 = performance.now();
    const solar = calcularEventosSolares(-14.0689, -75.7222, '2026-10-17');
    derivarRecordatorios(generarPlan(TURNO_NOCTURNO, 'intermedio', solar, [], CFG));
    expect(performance.now() - t0).toBeLessThan(200);
  });
});
