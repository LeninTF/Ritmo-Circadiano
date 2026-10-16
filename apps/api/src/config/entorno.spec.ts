import { validarEntorno } from './entorno';

describe('validarEntorno', () => {
  it('falla si falta DATABASE_URL', () => {
    expect(() => validarEntorno({ PORT: '3000' })).toThrow(/DATABASE_URL/);
  });

  it('acepta un entorno con DATABASE_URL', () => {
    const entorno = validarEntorno({ DATABASE_URL: 'postgresql://x' });
    expect(entorno.DATABASE_URL).toBe('postgresql://x');
  });
});
