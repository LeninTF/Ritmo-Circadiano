import { calcularHorasSuenoEnVentana } from '../sleep-window';

describe('calcularHorasSuenoEnVentana', () => {
  const ventanaInicio = new Date('2024-01-01T00:00:00.000Z');
  const ventanaFin = new Date('2024-01-02T00:00:00.000Z');

  it('un período normal dentro de la ventana', () => {
    const periods = [{ inicio: '2024-01-01T02:00:00.000Z', fin: '2024-01-01T06:00:00.000Z' }];
    expect(calcularHorasSuenoEnVentana(periods, ventanaInicio, ventanaFin)).toBeCloseTo(4);
  });

  it('dos períodos independientes', () => {
    const periods = [
      { inicio: '2024-01-01T02:00:00.000Z', fin: '2024-01-01T04:00:00.000Z' },
      { inicio: '2024-01-01T08:00:00.000Z', fin: '2024-01-01T10:00:00.000Z' },
    ];
    expect(calcularHorasSuenoEnVentana(periods, ventanaInicio, ventanaFin)).toBeCloseTo(4);
  });

  it('dos períodos superpuestos', () => {
    const periods = [
      { inicio: '2024-01-01T02:00:00.000Z', fin: '2024-01-01T06:00:00.000Z' },
      { inicio: '2024-01-01T04:00:00.000Z', fin: '2024-01-01T08:00:00.000Z' },
    ];
    // 6 horas sin duplicar
    expect(calcularHorasSuenoEnVentana(periods, ventanaInicio, ventanaFin)).toBeCloseTo(6);
  });

  it('dos períodos contiguos', () => {
    const periods = [
      { inicio: '2024-01-01T02:00:00.000Z', fin: '2024-01-01T04:00:00.000Z' },
      { inicio: '2024-01-01T04:00:00.000Z', fin: '2024-01-01T06:00:00.000Z' },
    ];
    expect(calcularHorasSuenoEnVentana(periods, ventanaInicio, ventanaFin)).toBeCloseTo(4);
  });

  it('período que comienza antes de la ventana', () => {
    const periods = [{ inicio: '2023-12-31T22:00:00.000Z', fin: '2024-01-01T02:00:00.000Z' }];
    expect(calcularHorasSuenoEnVentana(periods, ventanaInicio, ventanaFin)).toBeCloseTo(2);
  });

  it('período que termina después de la ventana', () => {
    const periods = [{ inicio: '2024-01-01T22:00:00.000Z', fin: '2024-01-02T02:00:00.000Z' }];
    expect(calcularHorasSuenoEnVentana(periods, ventanaInicio, ventanaFin)).toBeCloseTo(2);
  });

  it('período que cubre toda la ventana', () => {
    const periods = [{ inicio: '2023-12-31T22:00:00.000Z', fin: '2024-01-02T02:00:00.000Z' }];
    expect(calcularHorasSuenoEnVentana(periods, ventanaInicio, ventanaFin)).toBeCloseTo(24);
  });

  it('períodos completamente fuera de la ventana', () => {
    const periods = [{ inicio: '2023-12-31T10:00:00.000Z', fin: '2023-12-31T12:00:00.000Z' }];
    expect(calcularHorasSuenoEnVentana(periods, ventanaInicio, ventanaFin)).toBe(0);
  });

  it('arreglo vacío', () => {
    expect(calcularHorasSuenoEnVentana([], ventanaInicio, ventanaFin)).toBe(0);
  });

  it('fechas inválidas', () => {
    const periods = [{ inicio: 'invalid', fin: '2024-01-01T04:00:00.000Z' }];
    expect(() => calcularHorasSuenoEnVentana(periods, ventanaInicio, ventanaFin)).toThrow();
  });

  it('inicio posterior o igual al fin', () => {
    const periods = [{ inicio: '2024-01-01T04:00:00.000Z', fin: '2024-01-01T04:00:00.000Z' }];
    expect(() => calcularHorasSuenoEnVentana(periods, ventanaInicio, ventanaFin)).toThrow();
  });

  it('intervalos que cruzan medianoche', () => {
  const periods = [
    {
      inicio: '2024-01-01T22:00:00.000Z',
      fin: '2024-01-02T02:00:00.000Z',
    },
  ];

  const inicio = new Date('2024-01-01T12:00:00.000Z');
  const fin = new Date('2024-01-02T12:00:00.000Z');

  expect(
    calcularHorasSuenoEnVentana(periods, inicio, fin),
  ).toBeCloseTo(4);
});
it('rechaza una ventana con inicio inválido', () => {
  expect(() =>
    calcularHorasSuenoEnVentana(
      [],
      new Date('fecha-invalida'),
      ventanaFin,
    ),
  ).toThrow();
});

it('rechaza una ventana con fin inválido', () => {
  expect(() =>
    calcularHorasSuenoEnVentana(
      [],
      ventanaInicio,
      new Date('fecha-invalida'),
    ),
  ).toThrow();
});

  it('sin mutación de las entradas', () => {
    const periods = [{ inicio: '2024-01-01T02:00:00.000Z', fin: '2024-01-01T04:00:00.000Z' }];
    const copy = JSON.parse(JSON.stringify(periods));
    calcularHorasSuenoEnVentana(periods, ventanaInicio, ventanaFin);
    expect(periods).toEqual(copy);
  });
});
