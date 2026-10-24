import { segundosDeExpira, validarEntorno } from './entorno';

const BASE = { DATABASE_URL: 'postgresql://x', JWT_SECRET: 'a'.repeat(32) };

describe('validarEntorno', () => {
  it('falla si falta DATABASE_URL', () => {
    expect(() => validarEntorno({ JWT_SECRET: BASE.JWT_SECRET })).toThrow(
      /DATABASE_URL/,
    );
  });

  it('acepta un entorno con DATABASE_URL y JWT_SECRET', () => {
    expect(validarEntorno(BASE).DATABASE_URL).toBe('postgresql://x');
  });

  it('falla si JWT_SECRET falta o es corto', () => {
    expect(() => validarEntorno({ DATABASE_URL: 'x' })).toThrow(/JWT_SECRET/);
    expect(() => validarEntorno({ ...BASE, JWT_SECRET: 'corto' })).toThrow(
      /JWT_SECRET/,
    );
  });

  it('rechaza JWT_EXPIRA mayor a 24h o mal formada', () => {
    expect(() => validarEntorno({ ...BASE, JWT_EXPIRA: '25h' })).toThrow(
      /24h/,
    );
    expect(() => validarEntorno({ ...BASE, JWT_EXPIRA: 'ocho' })).toThrow(
      /JWT_EXPIRA/,
    );
    expect(() => validarEntorno({ ...BASE, JWT_EXPIRA: '24h' })).not.toThrow();
  });
});

describe('segundosDeExpira', () => {
  it('convierte unidades y usa 8h por defecto', () => {
    expect(segundosDeExpira()).toBe(8 * 3600);
    expect(segundosDeExpira('30m')).toBe(1800);
    expect(segundosDeExpira('45s')).toBe(45);
  });
});
