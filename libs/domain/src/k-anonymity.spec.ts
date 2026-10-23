import { assertKAnonymity } from './k-anonymity';

describe('k-anonymity (RN10)', () => {
  it('debe retornar true si n >= k (por defecto k=5)', () => {
    expect(assertKAnonymity(5)).toBe(true);
    expect(assertKAnonymity(6)).toBe(true);
  });

  it('debe retornar false si n < k (por defecto k=5)', () => {
    expect(assertKAnonymity(4)).toBe(false);
    expect(assertKAnonymity(0)).toBe(false);
  });

  it('debe permitir un valor k personalizado', () => {
    expect(assertKAnonymity(3, 3)).toBe(true);
    expect(assertKAnonymity(2, 3)).toBe(false);
  });
});
