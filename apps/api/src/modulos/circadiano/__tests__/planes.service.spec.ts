import { ForbiddenException, NotFoundException } from '@nestjs/common';
import type { PrismaService } from '../../../prisma/prisma.service';
import type { CafeinaService } from '../../cafeina/cafeina.service';
import type { OperacionesService } from '../../operaciones/operaciones.service';
import type { ParametrosService } from '../../plataforma/parametros/parametros.service';
import type { CronotipoService } from '../cronotipo.service';
import { PlanesService, type TurnoParaPlan } from '../planes.service';
import type { UbicacionService } from '../ubicacion.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('PlanesService (RF07)', () => {
  const prisma = { planDiario: { upsert: jest.fn(), findUnique: jest.fn() } };
  const operaciones = { obtenerTurnoPorId: jest.fn(), listarTurnosMe: jest.fn() };
  const cafeina = { listarIngestas: jest.fn() };
  const parametros = { listar: jest.fn() };
  const cronotipos = { obtenerCategoria: jest.fn() };
  const ubicaciones = { obtenerCoordenadas: jest.fn() };
  const eventEmitter = { emit: jest.fn(), };
  const servicio = new PlanesService(
    prisma as unknown as PrismaService,
    operaciones as unknown as OperacionesService,
    cafeina as unknown as CafeinaService,
    parametros as unknown as ParametrosService,
    cronotipos as unknown as CronotipoService,
    ubicaciones as unknown as UbicacionService,
    eventEmitter as unknown as EventEmitter2,
  );

  // 22:00-05:00 en Lima del 17-oct-2026.
  const turnoNocturno: TurnoParaPlan = {
    id: 't-1',
    idUsuario: 'u-1',
    fecha: new Date('2026-10-17'),
    inicioProgramado: new Date('2026-10-18T03:00:00Z'),
    finProgramado: new Date('2026-10-18T10:00:00Z'),
    horaInicioReal: null,
    horaFinReal: null,
    esNocturno: true,
  };

  beforeEach(() => {
    jest.resetAllMocks();
    operaciones.obtenerTurnoPorId.mockResolvedValue(turnoNocturno);
    operaciones.listarTurnosMe.mockResolvedValue([]);
    cafeina.listarIngestas.mockResolvedValue([]);
    parametros.listar.mockResolvedValue([{ clave: 'umbral_cafeina_mg', valor: '50' }]);
    cronotipos.obtenerCategoria.mockResolvedValue('intermedio');
    ubicaciones.obtenerCoordenadas.mockResolvedValue({ nombre: 'Ica', lat: -14.0689, lng: -75.7222 });
    // Devuelve lo que se guardo, como haria Postgres.
    prisma.planDiario.upsert.mockImplementation(({ create }) =>
      Promise.resolve({ id: 'p-1', actualizadoEn: new Date(), ...create, ventanaLuz: create.ventanaLuz }),
    );
  });

  it('turno ajeno → 403 sin generar nada', async () => {
    operaciones.obtenerTurnoPorId.mockResolvedValue({ ...turnoNocturno, idUsuario: 'otro' });
    await expect(servicio.generar('u-1', 't-1')).rejects.toThrow(ForbiddenException);
    expect(prisma.planDiario.upsert).not.toHaveBeenCalled();
  });

  it('usa el turno real de I2: nocturno con 7,5 h de sueño y protección de luz', async () => {
    const plan = await servicio.generar('u-1', 't-1');

    expect(plan.tipoTurno).toBe('nocturno');
    expect(plan.inicioSueno).toBe('2026-10-18T11:00:00.000Z');
    expect(plan.finSueno).toBe('2026-10-18T18:30:00.000Z');
    expect(plan.protegerLuz).toBe(true);
    expect(plan.recordatorios.map((r) => r.tipo)).not.toContain('luz');
    expect(prisma.planDiario.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ where: { idUsuario_fecha: { idUsuario: 'u-1', fecha: turnoNocturno.fecha } } }),
    );
  });

  it('respeta la hora real si el trabajador corrigió el turno (RF05)', async () => {
    await servicio.generarParaTurno({ ...turnoNocturno, horaFinReal: new Date('2026-10-18T11:00:00Z') });
    const guardado = prisma.planDiario.upsert.mock.calls[0][0].create;
    expect(guardado.inicioSueno).toEqual(new Date('2026-10-18T12:00:00Z'));
  });

  it('siguiente turno cercano → siesta antes de este turno (RN06)', async () => {
    operaciones.listarTurnosMe.mockResolvedValue([
      turnoNocturno,
      { id: 't-2', inicioProgramado: new Date('2026-10-18T17:00:00Z') },
    ]);
    const plan = await servicio.generarParaTurno(turnoNocturno);
    expect(plan.finSueno).toBe('2026-10-18T16:00:00.000Z');
    expect(plan.finSiesta).toBe('2026-10-18T02:00:00.000Z');
  });

  it('lee el umbral de parametro_sistema y la cafeína de I4 (RN04)', async () => {
    parametros.listar.mockResolvedValue([{ clave: 'umbral_cafeina_mg', valor: '400' }]);
    // 300 mg al salir del turno: con umbral 400 aun cabe la dosis de referencia => corte RN05.
    cafeina.listarIngestas
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ cafeina_mg: 300, fecha_hora: '2026-10-18T10:00:00Z' }]);
    const plan = await servicio.generarParaTurno(turnoNocturno);
    expect(cafeina.listarIngestas).toHaveBeenCalledWith('u-1', '2026-10-16');
    expect(cafeina.listarIngestas).toHaveBeenCalledWith('u-1', '2026-10-17');
    expect(plan.horaCorteCafeina).toBe('2026-10-18T05:00:00.000Z');
  });

  it('GET sin plan → 404', async () => {
    prisma.planDiario.findUnique.mockResolvedValue(null);
    await expect(servicio.obtener('u-1', '2026-10-17')).rejects.toThrow(NotFoundException);
  });

  it('GET reconstruye recordatorios desde la fila guardada', async () => {
    const creado = await servicio.generarParaTurno(turnoNocturno);
    prisma.planDiario.findUnique.mockResolvedValue(await prisma.planDiario.upsert.mock.results[0].value);
    const leido = await servicio.obtener('u-1', '2026-10-17');
    expect(leido.recordatorios).toEqual(creado.recordatorios);
  });
});
