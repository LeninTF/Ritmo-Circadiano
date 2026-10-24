
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import {
  CrearActualizarDiarioDto,
  DiarioRespuestaDto,
} from '@circadiano/contracts';

import {
  DiarioService,
  DIARIO_REPOSITORY,
  IDiarioRepository,
} from './diario.service';

class FakeDiarioRepository implements IDiarioRepository {
  private readonly registros =
    new Map<string, DiarioRespuestaDto>();

  async upsert(
    idUsuario: string,
    fecha: string,
    datos: Partial<DiarioRespuestaDto>,
  ): Promise<DiarioRespuestaDto> {
    const clave = `${idUsuario}:${fecha}`;
    const anterior = this.registros.get(clave);

    const registro = {
      ...anterior,
      ...datos,
      id: anterior?.id ?? 'test-id',
      idUsuario,
      fecha,
    } as DiarioRespuestaDto;

    this.registros.set(clave, registro);
    return registro;
  }

  async consultar(
    idUsuario: string,
    desde: Date,
    hasta: Date,
  ): Promise<DiarioRespuestaDto[]> {
    const inicio = desde.toISOString().slice(0, 10);
    const fin = hasta.toISOString().slice(0, 10);

    return [...this.registros.values()]
      .filter(
        (registro) =>
          registro.idUsuario === idUsuario &&
          registro.fecha >= inicio &&
          registro.fecha <= fin,
      )
      .sort((a, b) => a.fecha.localeCompare(b.fecha));
  }
}

describe('DiarioService', () => {
  let service: DiarioService;
  let repository: FakeDiarioRepository;

  const dtoValido: CrearActualizarDiarioDto = {
    clientId: '123e4567-e89b-12d3-a456-426614174000',
    horaAcostarse: '2026-10-20T22:00:00Z',
    horaDespertar: '2026-10-21T06:00:00Z',
    latenciaMin: 15,
    despertares: 1,
    calidadPercibida: 4,
    fatigaPercibida: 2,
    esDiaLaboral: true,
    luzMatutinaMin: 20,
  };

  beforeEach(async () => {
    repository = new FakeDiarioRepository();

    const testingModule: TestingModule =
      await Test.createTestingModule({
        providers: [
          DiarioService,
          {
            provide: DIARIO_REPOSITORY,
            useValue: repository,
          },
        ],
      }).compile();

    service = testingModule.get(DiarioService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('upsertDiario', () => {
    it('crea un diario', async () => {
      const resultado = await service.upsertDiario(
        'user-1',
        '2026-10-21',
        dtoValido,
      );

      expect(resultado.idUsuario).toBe('user-1');
      expect(resultado.fecha).toBe('2026-10-21');
      expect(resultado.calidadPercibida).toBe(4);
    });

    it('actualiza un diario existente', async () => {
      await service.upsertDiario(
        'user-1',
        '2026-10-21',
        dtoValido,
      );

      const resultado = await service.upsertDiario(
        'user-1',
        '2026-10-21',
        {
          ...dtoValido,
          calidadPercibida: 5,
          fatigaPercibida: 1,
        },
      );

      expect(resultado.calidadPercibida).toBe(5);
      expect(resultado.fatigaPercibida).toBe(1);

      const registros = await service.consultarDiarios(
        'user-1',
        '2026-10-21',
        '2026-10-21',
      );

      expect(registros).toHaveLength(1);
    });

    it('rechaza fechas con formato incorrecto', async () => {
      await expect(
        service.upsertDiario(
          'user-1',
          '21-10-2026',
          dtoValido,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('rechaza fechas inexistentes', async () => {
      await expect(
        service.upsertDiario(
          'user-1',
          '2026-13-40',
          dtoValido,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('rechaza calidad fuera del rango 1-5', async () => {
      await expect(
        service.upsertDiario(
          'user-1',
          '2026-10-21',
          { ...dtoValido, calidadPercibida: 6 },
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('rechaza fatiga fuera del rango 1-5', async () => {
      await expect(
        service.upsertDiario(
          'user-1',
          '2026-10-21',
          { ...dtoValido, fatigaPercibida: 0 },
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('rechaza usuario vacío', async () => {
      await expect(
        service.upsertDiario(
          '',
          '2026-10-21',
          dtoValido,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('consultarDiarios', () => {
    it('consulta registros ordenados por fecha', async () => {
      for (const fecha of [
        '2026-10-22',
        '2026-10-20',
        '2026-10-21',
      ]) {
        await service.upsertDiario(
          'user-1',
          fecha,
          dtoValido,
        );
      }

      const resultados = await service.consultarDiarios(
        'user-1',
        '2026-10-20',
        '2026-10-22',
      );

      expect(resultados).toHaveLength(3);
      expect(resultados.map((r) => r.fecha)).toEqual([
        '2026-10-20',
        '2026-10-21',
        '2026-10-22',
      ]);
    });

    it('aísla registros entre usuarios', async () => {
      await service.upsertDiario(
        'user-1',
        '2026-10-21',
        dtoValido,
      );

      await service.upsertDiario(
        'user-2',
        '2026-10-21',
        dtoValido,
      );

      const resultados = await service.consultarDiarios(
        'user-1',
        '2026-10-20',
        '2026-10-22',
      );

      expect(resultados).toHaveLength(1);
      expect(resultados[0].idUsuario).toBe('user-1');
    });

    it('rechaza intervalos invertidos', async () => {
      await expect(
        service.consultarDiarios(
          'user-1',
          '2026-10-22',
          '2026-10-20',
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
