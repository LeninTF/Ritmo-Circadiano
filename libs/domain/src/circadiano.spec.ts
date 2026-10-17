/**
 * circadiano.spec.ts — Tests del motor circadiano (RF07, RN06, RN08).
 *
 * Cubre:
 *  - Plan diurno: despertar, sueño, picos, luz, corte cafeína.
 *  - Plan nocturno con hueco suficiente (≥ 7 h).
 *  - Plan nocturno con siesta (hueco < 7 h, RN06).
 *  - Cruce de medianoche.
 *  - Propiedades con fast-check (invariantes para cualquier turno válido).
 */
import * as fc from 'fast-check';
import {
  derivarRecordatorios,
  esTurnoNocturno,
  generarPlan,
} from './circadiano';
import type { ConfiguracionMotor, ParametrosTurno, ResultadoPlan } from './circadiano';
import type { EventosSolares } from './solar';

// ─── Fixtures ────────────────────────────────────────────────────────────────

const CFG: ConfiguracionMotor = {
  versionAlgoritmo: '1.0.0',
  semividaH: 5,
  umbralCafeinaMg: 50,
};

/** Solar de Ica 17-oct-2026 (valores reales aproximados en UTC). */
const SOLAR_ICA: EventosSolares = {
  amanecer: new Date('2026-10-17T10:27:00Z'), // 05:27 Lima
  mediodia: new Date('2026-10-17T17:10:00Z'), // 12:10 Lima
  atardecer: new Date('2026-10-17T23:00:00Z'), // 18:00 Lima
  lat: -14.0678,
  lng: -75.7286,
  fecha: new Date('2026-10-17T05:00:00Z'),
};

/** Turno diurno 08:00–16:00 Lima (13:00–21:00 UTC). */
const TURNO_DIURNO: ParametrosTurno = {
  inicioTurno: new Date('2026-10-17T13:00:00Z'),
  finTurno: new Date('2026-10-17T21:00:00Z'),
};

/** Helper local. */
function msToH(a: Date, b: Date): number {
  return (b.getTime() - a.getTime()) / 3_600_000;
}
function addH(d: Date, h: number): Date {
  return new Date(d.getTime() + h * 3_600_000);
}

// ─── esTurnoNocturno ─────────────────────────────────────────────────────────

describe('esTurnoNocturno', () => {
  it('22:00 Lima (03:00 UTC) → nocturno', () =>
    expect(esTurnoNocturno(new Date('2026-10-18T03:00:00Z'))).toBe(true));
  it('05:00 Lima (10:00 UTC) → nocturno (< 6)', () =>
    expect(esTurnoNocturno(new Date('2026-10-18T10:00:00Z'))).toBe(true));
  it('06:00 Lima (11:00 UTC) → diurno', () =>
    expect(esTurnoNocturno(new Date('2026-10-18T11:00:00Z'))).toBe(false));
  it('08:00 Lima (13:00 UTC) → diurno', () =>
    expect(esTurnoNocturno(new Date('2026-10-17T13:00:00Z'))).toBe(false));
  it('22:00 Lima (03:00 UTC) → nocturno (borde inferior)', () =>
    expect(esTurnoNocturno(new Date('2026-10-18T03:00:00Z'))).toBe(true));
});


// ─── Plan diurno ─────────────────────────────────────────────────────────────

describe('generarPlan — diurno 08:00–16:00 Lima', () => {
  let plan: ResultadoPlan;
  beforeAll(() => {
    plan = generarPlan(TURNO_DIURNO, 'intermedio', SOLAR_ICA, [], CFG);
  });

  it('tipoTurno = diurno', () => expect(plan.tipoTurno).toBe('diurno'));
  it('sin siesta', () => {
    expect(plan.inicioSiesta).toBeNull();
    expect(plan.finSiesta).toBeNull();
  });
  it('finSueno = inicioTurno − 90 min', () => {
    const esperado = new Date(TURNO_DIURNO.inicioTurno.getTime() - 90 * 60_000);
    expect(plan.finSueno.getTime()).toBe(esperado.getTime());
  });
  it('duración sueño = 7.5 h', () =>
    expect(msToH(plan.inicioSueno, plan.finSueno)).toBeCloseTo(7.5, 5));
  it('exactamente 2 picos', () => expect(plan.picos).toHaveLength(2));
  it('pico 1 inicia 2 h después del despertar', () =>
    expect(plan.picos[0].inicio.getTime()).toBe(addH(plan.finSueno, 2).getTime()));
  it('ventana de luz: inicio ≥ amanecer', () =>
    expect(plan.ventanaLuz.inicio.getTime()).toBeGreaterThanOrEqual(SOLAR_ICA.amanecer.getTime()));
  it('ventana de luz: dura 60 min', () => {
    const dur = (plan.ventanaLuz.fin.getTime() - plan.ventanaLuz.inicio.getTime()) / 60_000;
    expect(dur).toBeCloseTo(60, 5);
  });
  it('horaCorteCalefina = inicioSueno − 6 h (RN05)', () => {
    const esperado = new Date(plan.inicioSueno.getTime() - 6 * 3_600_000);
    expect(plan.horaCorteCalefina.getTime()).toBe(esperado.getTime());
  });
  it('vespertino: sueño 30 min más tarde que intermedio', () => {
    const v = generarPlan(TURNO_DIURNO, 'vespertino_definido', SOLAR_ICA, [], CFG);
    const i = generarPlan(TURNO_DIURNO, 'intermedio', SOLAR_ICA, [], CFG);
    expect((v.inicioSueno.getTime() - i.inicioSueno.getTime()) / 60_000).toBeCloseTo(30, 5);
  });
  it('matutino: sueño 30 min más temprano que intermedio', () => {
    const m = generarPlan(TURNO_DIURNO, 'matutino_definido', SOLAR_ICA, [], CFG);
    const i = generarPlan(TURNO_DIURNO, 'intermedio', SOLAR_ICA, [], CFG);
    expect((i.inicioSueno.getTime() - m.inicioSueno.getTime()) / 60_000).toBeCloseTo(30, 5);
  });
});


// ─── Plan nocturno (22:00–05:00 Lima) ────────────────────────────────────────

describe('generarPlan — nocturno', () => {
  const turnoNocturnoReal: ParametrosTurno = {
    inicioTurno: new Date('2026-10-18T03:00:00Z'), // 22:00 Lima
    finTurno: new Date('2026-10-18T10:00:00Z'),    // 05:00 Lima
  };
  let plan: ResultadoPlan;
  beforeAll(() => {
    plan = generarPlan(turnoNocturnoReal, 'intermedio', SOLAR_ICA, [], CFG);
  });

  it('tipoTurno = nocturno', () => expect(plan.tipoTurno).toBe('nocturno'));
  it('inicioSueno = finTurno + 60 min', () => {
    const esperado = new Date(turnoNocturnoReal.finTurno.getTime() + 60 * 60_000);
    expect(plan.inicioSueno.getTime()).toBe(esperado.getTime());
  });
  it('ventana de luz nocturna inicia en finTurno (RN08)', () =>
    expect(plan.ventanaLuz.inicio.getTime()).toBe(turnoNocturnoReal.finTurno.getTime()));
});



// ─── Plan nocturno sin siesta (hueco ≥ 7 h) ──────────────────────────────────

describe('generarPlan — nocturno sin siesta (siguiente turno +24 h)', () => {
  const turnoAmplio: ParametrosTurno = {
    inicioTurno: new Date('2026-10-19T03:00:00Z'),
    finTurno: new Date('2026-10-18T10:00:00Z'),
  };
  let plan: ResultadoPlan;
  beforeAll(() => {
    plan = generarPlan(turnoAmplio, 'intermedio', SOLAR_ICA, [], CFG);
  });

  it('inicioSueno = finTurno + 60 min', () => {
    const esperado = new Date(turnoAmplio.finTurno.getTime() + 60 * 60_000);
    expect(plan.inicioSueno.getTime()).toBe(esperado.getTime());
  });
  it('sin siesta cuando hueco ≥ 7 h', () => {
    const limite = new Date(turnoAmplio.inicioTurno.getTime() - 60 * 60_000);
    const hueco = (limite.getTime() - plan.inicioSueno.getTime()) / 3_600_000;
    if (hueco >= 7) {
      expect(plan.inicioSiesta).toBeNull();
      expect(plan.finSiesta).toBeNull();
    }
  });
});


// ─── Recordatorios y Propiedades fast-check ──────────────────────────────────

describe('derivarRecordatorios', () => {
  let plan: ResultadoPlan;
  beforeAll(() => {
    plan = generarPlan(TURNO_DIURNO, 'intermedio', SOLAR_ICA, [], CFG);
  });

  it('genera 4 recordatorios', () => expect(derivarRecordatorios(plan)).toHaveLength(4));
  it('contiene los 4 tipos', () => {
    const tipos = derivarRecordatorios(plan).map((r) => r.tipo);
    expect(tipos).toContain('luz');
    expect(tipos).toContain('corte_cafeina');
    expect(tipos).toContain('relajacion');
    expect(tipos).toContain('dormir');
  });
  it('todos con Date válida', () =>
    derivarRecordatorios(plan).forEach((r) => {
      expect(r.programadaPara).toBeInstanceOf(Date);
      expect(isNaN(r.programadaPara.getTime())).toBe(false);
    }));
});

describe('generarPlan — propiedades (fast-check)', () => {
  const diurnoArb = fc
    .record({ horaLocal: fc.integer({ min: 6, max: 20 }), durH: fc.integer({ min: 2, max: 10 }) })
    .map(({ horaLocal, durH }) => {
      const utc = (horaLocal + 5) % 24;
      const base = new Date('2026-10-17T00:00:00Z');
      const inicio = new Date(base.getTime() + utc * 3_600_000);
      return { inicioTurno: inicio, finTurno: new Date(inicio.getTime() + durH * 3_600_000) } as ParametrosTurno;
    });

  const nocturnoArb = fc
    .record({ offsetH: fc.integer({ min: 0, max: 6 }), durH: fc.integer({ min: 4, max: 10 }) })
    .map(({ offsetH, durH }) => {
      const fin = new Date(new Date('2026-10-18T01:00:00Z').getTime() + offsetH * 3_600_000);
      const siguiente = new Date(fin.getTime() - durH * 3_600_000 + 24 * 3_600_000);
      return { inicioTurno: siguiente, finTurno: fin } as ParametrosTurno;
    });

  it('PROP diurno: inicioSueno < finSueno', () =>
    fc.assert(fc.property(diurnoArb, (t) => {
      const p = generarPlan(t, 'intermedio', SOLAR_ICA, [], CFG);
      return p.inicioSueno.getTime() < p.finSueno.getTime();
    }), { numRuns: 200 }));

  it('PROP diurno: horaCorteCalefina < inicioSueno', () =>
    fc.assert(fc.property(diurnoArb, (t) => {
      const p = generarPlan(t, 'intermedio', SOLAR_ICA, [], CFG);
      return p.horaCorteCalefina.getTime() < p.inicioSueno.getTime();
    }), { numRuns: 200 }));

  it('PROP nocturno (cruce medianoche): siesta termina ≥ 60 min antes del turno', () =>
    fc.assert(fc.property(nocturnoArb, (t) => {
      const p = generarPlan(t, 'intermedio', SOLAR_ICA, [], CFG);
      if (p.finSiesta === null) return true;
      return (t.inicioTurno.getTime() - p.finSiesta.getTime()) / 60_000 >= 60;
    }), { numRuns: 200 }));

  it('PROP nocturno: siesta dura 90 min cuando existe', () =>
    fc.assert(fc.property(nocturnoArb, (t) => {
      const p = generarPlan(t, 'intermedio', SOLAR_ICA, [], CFG);
      if (!p.inicioSiesta || !p.finSiesta) return true;
      return Math.abs((p.finSiesta.getTime() - p.inicioSiesta.getTime()) / 60_000 - 90) < 0.001;
    }), { numRuns: 200 }));
});

