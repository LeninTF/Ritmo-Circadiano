import { rangoTurnoLima, semanaDe, sumarDias } from './turnos-fecha';

describe('turnos-fecha (hora de Lima)', () => {
  it('semanaDe devuelve lunes a domingo', () => {
    expect(semanaDe('2026-11-19')).toEqual([
      '2026-11-16', '2026-11-17', '2026-11-18', '2026-11-19', '2026-11-20', '2026-11-21', '2026-11-22',
    ]);
    expect(semanaDe('2026-11-22')[0]).toBe('2026-11-16');
    expect(semanaDe('2026-11-16')[0]).toBe('2026-11-16');
  });

  it('sumarDias cruza meses', () => {
    expect(sumarDias('2026-11-30', 1)).toBe('2026-12-01');
    expect(sumarDias('2026-12-01', -7)).toBe('2026-11-24');
  });

  it('rangoTurnoLima convierte hora de Lima a UTC y pasa al día siguiente si el fin es menor', () => {
    expect(rangoTurnoLima('2026-11-20', '08:00', '12:00')).toEqual({
      inicio: '2026-11-20T13:00:00.000Z',
      fin: '2026-11-20T17:00:00.000Z',
    });
    expect(rangoTurnoLima('2026-11-20', '22:00', '03:00')).toEqual({
      inicio: '2026-11-21T03:00:00.000Z',
      fin: '2026-11-21T08:00:00.000Z',
    });
  });
});
