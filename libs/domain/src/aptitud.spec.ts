import { calcularAptitudPresalida, colorDivulgableAlDespachador, AptitudPresalidaInvalidaError } from './aptitud';

const base = { horasSueno24h: 8, somnolencia: 1 };

describe('calcularAptitudPresalida (RN09)', () => {
  it('acepta 24 horas de sueño', () => {
  expect(
    calcularAptitudPresalida({
      horasSueno24h: 24,
      somnolencia: 1,
    }).color,
  ).toBe('verde');
});

it('rechaza más de 24 horas de sueño', () => {
  expect(() =>
    calcularAptitudPresalida({
      horasSueno24h: 24.01,
      somnolencia: 1,
    }),
  ).toThrow(AptitudPresalidaInvalidaError);
});
  it('4.99 h de sueno es rojo por sueno insuficiente', () => {
    const r = calcularAptitudPresalida({ horasSueno24h: 4.99, somnolencia: 1 });
    expect(r.color).toBe('rojo');
    expect(r.motivos).toEqual(['sueno_insuficiente']);
  });

  it('5 h exactas es ambar', () => {
    const r = calcularAptitudPresalida({ horasSueno24h: 5, somnolencia: 1 });
    expect(r.color).toBe('ambar');
    expect(r.motivos).toEqual(['sueno_intermedio']);
  });

  it('6.99 h es ambar', () => {
    const r = calcularAptitudPresalida({ horasSueno24h: 6.99, somnolencia: 2 });
    expect(r.color).toBe('ambar');
  });

  it('7 h exactas es verde', () => {
    const r = calcularAptitudPresalida({ horasSueno24h: 7, somnolencia: 3 });
    expect(r.color).toBe('verde');
    expect(r.motivos).toEqual(['sueno_suficiente']);
  });

  it('somnolencia igual al umbral rojo (4) es rojo aunque el sueno baste', () => {
    const r = calcularAptitudPresalida({ horasSueno24h: 8, somnolencia: 4 });
    expect(r.color).toBe('rojo');
    expect(r.motivos).toEqual(['somnolencia_elevada']);
  });

  it('sueno suficiente con somnolencia elevada es rojo (el rojo tiene prioridad)', () => {
    const r = calcularAptitudPresalida({ horasSueno24h: 7.5, somnolencia: 5 });
    expect(r.color).toBe('rojo');
    expect(r.motivos).toEqual(['somnolencia_elevada']);
  });

  it('sueno intermedio con somnolencia en el umbral es rojo, no ambar', () => {
    const r = calcularAptitudPresalida({ horasSueno24h: 5, somnolencia: 4 });
    expect(r.color).toBe('rojo');
    expect(r.motivos).toEqual(['somnolencia_elevada']);
  });

  it('sueno insuficiente y somnolencia elevada acumulan ambos motivos', () => {
    const r = calcularAptitudPresalida({ horasSueno24h: 3, somnolencia: 4 });
    expect(r.color).toBe('rojo');
    expect(r.motivos).toEqual(['sueno_insuficiente', 'somnolencia_elevada']);
  });

  it('somnolencia 3 no dispara rojo', () => {
    expect(calcularAptitudPresalida({ horasSueno24h: 7, somnolencia: 3 }).color).toBe('verde');
    expect(calcularAptitudPresalida({ horasSueno24h: 5, somnolencia: 3 }).color).toBe('ambar');
  });

  it('0 h de sueno es rojo (no es un valor negativo)', () => {
    expect(calcularAptitudPresalida({ horasSueno24h: 0, somnolencia: 1 }).color).toBe('rojo');
  });

  it('no redondea antes de evaluar: 4.999 sigue siendo rojo y 6.999 ambar', () => {
    expect(calcularAptitudPresalida({ horasSueno24h: 4.999, somnolencia: 1 }).color).toBe('rojo');
    expect(calcularAptitudPresalida({ horasSueno24h: 6.999, somnolencia: 1 }).color).toBe('ambar');
  });

  it('el calculo no depende del consentimiento y no autoriza la salida', () => {
    const r = calcularAptitudPresalida(base);
    expect(r.compartido).toBe(false);
    expect(r.esApoyoPreventivo).toBe(true);
  });

  it('no muta la entrada', () => {
    const entrada = { horasSueno24h: 6.5, somnolencia: 2 };
    const copia = { ...entrada };
    calcularAptitudPresalida(entrada);
    expect(entrada).toEqual(copia);
    expect(Object.isFrozen(entrada)).toBe(false);
  });

  it.each([-0.01, -1, -5])('rechaza horas negativas (%s)', (horasSueno24h) => {
    expect(() => calcularAptitudPresalida({ horasSueno24h, somnolencia: 1 })).toThrow(
      AptitudPresalidaInvalidaError,
    );
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    'rechaza horas no finitas (%s)',
    (horasSueno24h) => {
      expect(() => calcularAptitudPresalida({ horasSueno24h, somnolencia: 1 })).toThrow(
        AptitudPresalidaInvalidaError,
      );
    },
  );

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    'rechaza somnolencia no finita (%s)',
    (somnolencia) => {
      expect(() => calcularAptitudPresalida({ horasSueno24h: 8, somnolencia })).toThrow(
        AptitudPresalidaInvalidaError,
      );
    },
  );

  it.each([0, 6, -1, 1.5, 4.2])(
    'rechaza somnolencia fuera de la escala 1-5 (%s)',
    (somnolencia) => {
      expect(() => calcularAptitudPresalida({ horasSueno24h: 8, somnolencia })).toThrow(
        AptitudPresalidaInvalidaError,
      );
    },
  );

  it('acepta los extremos documentados de la escala (1 y 5)', () => {
    expect(calcularAptitudPresalida({ horasSueno24h: 8, somnolencia: 1 }).color).toBe('verde');
    expect(calcularAptitudPresalida({ horasSueno24h: 8, somnolencia: 5 }).color).toBe('rojo');
  });
});

describe('colorDivulgableAlDespachador (RN10)', () => {
  it('devuelve solo el color cuando el consentimiento es explicito', () => {
    expect(colorDivulgableAlDespachador('ambar', true)).toBe('ambar');
  });

  it.each([false, null, undefined])(
    'no divulga si el consentimiento no es true (%s)',
    (compartido) => {
      expect(colorDivulgableAlDespachador('rojo', compartido)).toBeNull();
    },
  );
});
