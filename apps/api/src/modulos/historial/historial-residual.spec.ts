import { HistorialService } from './historial.service';
import { DiarioService } from '../trabajador/diario.service';
import { PrismaService } from '../../prisma/prisma.service';
import type { DiarioRespuestaDto } from '@circadiano/contracts';

 describe('RF15 cafeína histórica', () => {
  const consultarDiarios = jest.fn();
  const findMany = jest.fn();
  const count = jest.fn();
  const service = new HistorialService(
    { consultarDiarios } as unknown as DiarioService,
    { ingestaCafeina: { findMany }, notificacion: { count } } as unknown as PrismaService,
  );
  const diario = (fecha: string, horaAcostarse: string): DiarioRespuestaDto => ({
    id: fecha, idUsuario: 'yo', fecha, horaAcostarse,
    horaDespertar: `${fecha}T23:00:00Z`, latenciaMin: 0, despertares: 0,
    calidadPercibida: 3, fatigaPercibida: 3, esDiaLaboral: true,
    luzMatutinaMin: 0, clientId: fecha, updatedAt: `${fecha}T23:00:00Z`,
  });
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-10-20T18:00:00Z'));
    jest.resetAllMocks();
    count.mockResolvedValue(0);
    findMany.mockResolvedValue([]);
    consultarDiarios.mockResolvedValue([]);
  });
  afterEach(() => jest.useRealTimers());

  it('dos fechas con ingestas distintas producen residuales distintos', async () => {
    consultarDiarios.mockResolvedValue([
      diario('2026-10-19', '2026-10-19T22:00:00Z'),
      diario('2026-10-20', '2026-10-20T22:00:00Z'),
    ]);
    findMany.mockResolvedValue([
      { cafeina_mg: 100, fecha_hora: new Date('2026-10-19T17:00:00Z') },
      { cafeina_mg: 200, fecha_hora: new Date('2026-10-20T17:00:00Z') },
    ]);
    const { dias } = await service.getHistorial('yo', 7);
    expect(dias[5].cafeinaResidual).toBe(50);
    expect(dias[6].cafeinaResidual).toBe(101.8);
  });

  it('una ingesta posterior a acostarse no afecta al residual del día', async () => {
    consultarDiarios.mockResolvedValue([diario('2026-10-20', '2026-10-20T22:00:00Z')]);
    const anterior = { cafeina_mg: 100, fecha_hora: new Date('2026-10-20T17:00:00Z') };
    findMany.mockResolvedValue([anterior]);
    const antes = await service.getHistorial('yo', 7);
    findMany.mockResolvedValue([anterior, { cafeina_mg: 500, fecha_hora: new Date('2026-10-20T23:00:00Z') }]);
    const despues = await service.getHistorial('yo', 7);
    expect(antes.dias[6].cafeinaResidual).toBe(50);
    expect(despues.dias[6].cafeinaResidual).toBe(50);
  });

  it.each(['', 'invalida'])('sin hora válida de acostarse (%s) devuelve null', async (hora) => {
    consultarDiarios.mockResolvedValue([diario('2026-10-20', hora)]);
    const { dias } = await service.getHistorial('yo', 7);
    expect(dias[6].cafeinaResidual).toBeNull();
  });

  it('con hora válida y sin ingestas anteriores devuelve cero', async () => {
    consultarDiarios.mockResolvedValue([diario('2026-10-20', '2026-10-20T22:00:00Z')]);
    findMany.mockResolvedValue([{ cafeina_mg: 500, fecha_hora: new Date('2026-10-20T23:00:00Z') }]);
    const { dias } = await service.getHistorial('yo', 7);
    expect(dias[6].cafeinaResidual).toBe(0);
  });

  it('todas las consultas filtran exclusivamente el id recibido del trabajador', async () => {
    await service.getHistorial('yo', 7);
    expect(consultarDiarios).toHaveBeenCalledWith('yo', '2026-10-14', '2026-10-20');
    expect(findMany).toHaveBeenCalledWith({ where: { id_usuario: 'yo' }, orderBy: { fecha_hora: 'asc' } });
    expect(count).toHaveBeenCalledTimes(7);
    for (const [consulta] of count.mock.calls) expect(consulta.where.id_usuario).toBe('yo');
  });
});
