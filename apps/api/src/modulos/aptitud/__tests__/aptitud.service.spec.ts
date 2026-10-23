// ___tests__/aptitud.service.spec.ts
import type { AptitudCalculator } from '../aptitud.calculator';
import { AptitudService, RegistroSuenoRepository, TurnoRepository, AptitudRepository } from '../aptitud.service';
import type { UsuarioJwtPayload } from '@circadiano/contracts';

const mockAptitudCalculator: jest.Mocked<AptitudCalculator> = {
  calcular: jest.fn(),
};
const mockRegistroSuenoRepo: RegistroSuenoRepository = {
  findByUserAndRange: jest.fn(),
};
const mockTurnoRepo: TurnoRepository = {
  findById: jest.fn(),
};
const mockAptitudRepo: AptitudRepository = {
  save: jest.fn(),
  findCompartidos: jest.fn(),
};

const servicio = new AptitudService(
  mockRegistroSuenoRepo,
  mockTurnoRepo,
  mockAptitudRepo,
  mockAptitudCalculator,
);

describe('AptitudService.consultarDespacho', () => {
  beforeEach(() => {
  jest.clearAllMocks();
  mockAptitudCalculator.calcular.mockReturnValue('verde');
});

  it('devuelve solo evaluaciones compartidas', async () => {
    (mockAptitudRepo.findCompartidos as jest.Mock).mockResolvedValue([
      { codigo: 'P01', color: 'verde', compartido: true },
      { codigo: 'P02', color: 'rojo', compartido: false },
      { codigo: 'P03', color: 'ambar', compartido: true },
    ]);

    const resultado = await servicio.consultarDespacho(
      'P01',
      new Date('2026-10-23T00:00:00Z'),
    );

    expect(resultado).toEqual([
      { codigo: 'P01', color: 'verde' },
      { codigo: 'P03', color: 'ambar' },
    ]);
  });

  it('no divulga evaluaciones sin consentimiento', async () => {
    (mockAptitudRepo.findCompartidos as jest.Mock).mockResolvedValue([
      { codigo: 'P02', color: 'rojo', compartido: false },
    ]);

    const resultado = await servicio.consultarDespacho(
      'P01',
      new Date('2026-10-23T00:00:00Z'),
    );

    expect(resultado).toEqual([]);
  });

  it('rechaza fechas inválidas', async () => {
    await expect(
      servicio.consultarDespacho('P01', new Date('fecha-invalida')),
    ).rejects.toThrow();

    expect(mockAptitudRepo.findCompartidos).not.toHaveBeenCalled();
  });

  it('no expone campos adicionales', async () => {
    (mockAptitudRepo.findCompartidos as jest.Mock).mockResolvedValue([
      {
        codigo: 'P01',
        color: 'verde',
        compartido: true,
        idUsuario: 'u1',
        horasSueno24h: 8,
        somnolencia: 1,
      },
    ]);

    const resultado = await servicio.consultarDespacho(
      'P01',
      new Date('2026-10-23T00:00:00Z'),
    );

    expect(resultado).toEqual([{ codigo: 'P01', color: 'verde' }]);
  });
  describe('AptitudService.crearAptitud', () => {
  const usuario: UsuarioJwtPayload = {
    sub: 'u1',
    rol: 'trabajador',
    codigoParticipante: 'P01',
  };

  const turnoId = 't1';

  beforeEach(() => {
    jest.clearAllMocks();
    mockAptitudCalculator.calcular.mockReturnValue('verde');

    (mockTurnoRepo.findById as jest.Mock).mockResolvedValue({
      id: turnoId,
      idUsuario: usuario.sub,
    });

    const ahora = Date.now();

    (mockRegistroSuenoRepo.findByUserAndRange as jest.Mock)
      .mockResolvedValue([
        {
          inicio: new Date(ahora - 9 * 60 * 60 * 1000).toISOString(),
          fin: new Date(ahora - 1 * 60 * 60 * 1000).toISOString(),
        },
      ]);

    (mockAptitudRepo.save as jest.Mock).mockResolvedValue(undefined);
  });

  it('crea la evaluación de un trabajador con turno propio', async () => {
    const resultado = await servicio.crearAptitud(
      { somnolencia: 2 },
      turnoId,
      usuario,
    );

    expect(resultado).toEqual({ color: 'verde' });

    expect(mockAptitudCalculator.calcular).toHaveBeenCalledWith(
      expect.closeTo(8, 2),
      2,
    );

    expect(mockAptitudRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        idUsuario: usuario.sub,
        idTurno: turnoId,
        compartido: false,
      }),
    );
  });

  it('rechaza un turno perteneciente a otro trabajador', async () => {
    (mockTurnoRepo.findById as jest.Mock).mockResolvedValue({
      id: turnoId,
      idUsuario: 'otro-usuario',
    });

    await expect(
      servicio.crearAptitud({ somnolencia: 2 }, turnoId, usuario),
    ).rejects.toThrow();

    expect(mockAptitudRepo.save).not.toHaveBeenCalled();
    expect(mockAptitudCalculator.calcular).not.toHaveBeenCalled();
  });

  it('rechaza una identidad ausente', async () => {
    await expect(
      servicio.crearAptitud(
        { somnolencia: 2 },
        turnoId,
        null as unknown as UsuarioJwtPayload,
      ),
    ).rejects.toThrow();

    expect(mockTurnoRepo.findById).not.toHaveBeenCalled();
    expect(mockAptitudRepo.save).not.toHaveBeenCalled();
  });

  it('guarda compartido como false cuando se omite', async () => {
    await servicio.crearAptitud(
      { somnolencia: 2 },
      turnoId,
      usuario,
    );

    expect(mockAptitudRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ compartido: false }),
    );
  });

  it('guarda consentimiento explícito', async () => {
    await servicio.crearAptitud(
      { somnolencia: 2, compartido: true },
      turnoId,
      usuario,
    );

    expect(mockAptitudRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ compartido: true }),
    );
  });

  it.each([0, 6, 2.5, NaN, Infinity])(
    'rechaza somnolencia inválida: %s',
    async (somnolencia) => {
      await expect(
        servicio.crearAptitud(
          { somnolencia },
          turnoId,
          usuario,
        ),
      ).rejects.toThrow();

      expect(mockAptitudRepo.save).not.toHaveBeenCalled();
    },
  );

  it('informa un error cuando falla la persistencia', async () => {
    (mockAptitudRepo.save as jest.Mock).mockRejectedValue(
      new Error('Fallo de BD'),
    );

    await expect(
      servicio.crearAptitud({ somnolencia: 2 }, turnoId, usuario),
    ).rejects.toThrow('Error al persistir la evaluación');
  });

  it('propaga fallos de lectura de registros de sueño', async () => {
    (mockRegistroSuenoRepo.findByUserAndRange as jest.Mock)
      .mockRejectedValue(new Error('Fallo de lectura'));

    await expect(
      servicio.crearAptitud({ somnolencia: 2 }, turnoId, usuario),
    ).rejects.toThrow('Fallo de lectura');

    expect(mockAptitudRepo.save).not.toHaveBeenCalled();
  });
});
});
