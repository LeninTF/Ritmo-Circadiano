import { generalizarCuasiIdentificador } from './privacidad';

describe('generalizarCuasiIdentificador (RN10)', () => {
  const filas = [
    ...Array.from({ length: 5 }, (_, i) => ({ codigo: `P0${i + 1}`, area: 'Operaciones' })),
    { codigo: 'P06', area: 'Finanzas' },
    { codigo: 'P07', area: 'Finanzas' },
  ];

  it('conserva los valores con >= k participantes y reemplaza los demas', () => {
    const r = generalizarCuasiIdentificador(filas, 'area', 'Otras');
    expect(r.filter((f) => f.area === 'Operaciones')).toHaveLength(5);
    expect(r.filter((f) => f.area === 'Otras').map((f) => f.codigo)).toEqual(['P06', 'P07']);
  });

  it('no modifica las filas de entrada y respeta k personalizado', () => {
    const r = generalizarCuasiIdentificador(filas, 'area', 'Otras', 2);
    expect(r.every((f) => f.area !== 'Otras')).toBe(true);
    expect(filas[5].area).toBe('Finanzas');
  });
});
