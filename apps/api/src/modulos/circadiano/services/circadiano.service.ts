import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { generarPlan, derivarRecordatorios, type ConfiguracionMotor, type ResultadoPlan } from '@circadiano/domain';
import { calcularEventosSolares } from '@circadiano/domain';
import { GenerarPlanDto, PlanDiarioDto } from '@circadiano/contracts';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CircadianoService {
  constructor(private readonly prisma: PrismaService, private readonly eventEmitter: EventEmitter2) {}

  private async obtenerConfigMotor(): Promise<ConfiguracionMotor> {
    return {
      versionAlgoritmo: '1.0.0',
      semividaH: 5,
      umbralCafeinaMg: 50,
    };
  }

  private async obtenerUbicacionActiva(idUsuario: string): Promise<{ lat: number; lng: number } | null> {
    const ubicacion = await this.prisma.ubicacion.findFirst({
      where: { idUsuario, zonaHoraria: 'America/Lima' },
      orderBy: { creadoEn: 'desc' },
    });
    if (!ubicacion) return null;
    return { lat: Number(ubicacion.lat), lng: Number(ubicacion.lng) };
  }

  private async obtenerCronotipo(idUsuario: string): Promise<string> {
    const perfil = await this.prisma.perfilCronotipo.findUnique({ where: { idUsuario } });
    if (!perfil) return 'intermedio';
    return perfil.categoria;
  }

  private async obtenerTurno(idTurno: string): Promise<{ inicio: Date; fin: Date }> {
    // TODO: integrar con OperacionesModule cuando el modelo Prisma esté disponible
    throw new NotFoundException(`Turno ${idTurno} no soportado en Prisma actual`);
  }

  async generarPlanParaUsuario(dto: GenerarPlanDto): Promise<PlanDiarioDto> {
    const { idUsuario, fecha, idTurno } = dto;

    const [ubicacion, cronotipo] = await Promise.all([
      this.obtenerUbicacionActiva(idUsuario),
      this.obtenerCronotipo(idUsuario),
    ]);

    if (!ubicacion) throw new NotFoundException(`Ubicación no encontrada para usuario ${idUsuario}`);

    // Simulación de turno con hora estándar hasta integración real
    const inicioTurno = new Date(`${fecha}T08:00:00-05:00`);
    const finTurno = new Date(`${fecha}T16:00:00-05:00`);

    const solar = calcularEventosSolares(ubicacion.lat, ubicacion.lng, fecha);
    const cfg = await this.obtenerConfigMotor();

    const resultado: ResultadoPlan = generarPlan(
      { inicioTurno, finTurno },
      cronotipo as any,
      solar,
      [],
      cfg,
    );

    const recordatorios = derivarRecordatorios(resultado);

    const planPersistido = await this.prisma.planDiario.upsert({
      where: { idUsuario_fecha: { idUsuario, fecha: new Date(fecha) } },
      create: {
        idUsuario,
        fecha: new Date(fecha),
        inicioSueno: resultado.inicioSueno,
        finSueno: resultado.finSueno,
        inicioSiesta: resultado.inicioSiesta ?? null,
        finSiesta: resultado.finSiesta ?? null,
        picos: resultado.picos as any,
        horaCorteCalefina: resultado.horaCorteCalefina,
        ventanaLuz: resultado.ventanaLuz as any,
        versionAlgoritmo: resultado.versionAlgoritmo,
      },
      update: {
        inicioSueno: resultado.inicioSueno,
        finSueno: resultado.finSueno,
        inicioSiesta: resultado.inicioSiesta ?? null,
        finSiesta: resultado.finSiesta ?? null,
        picos: resultado.picos as any,
        horaCorteCalefina: resultado.horaCorteCalefina,
        ventanaLuz: resultado.ventanaLuz as any,
        versionAlgoritmo: resultado.versionAlgoritmo,
      },
    });

    this.eventEmitter.emit('plan.generado', {
      idPlanDiario: planPersistido.id,
      idUsuario,
      fecha,
    });

    return this.aPlanDiarioDto(planPersistido, recordatorios, resultado.categoriaCronotipo);
  }

  async obtenerPlan(idUsuario: string, fecha: string): Promise<PlanDiarioDto | null> {
    const plan = await this.prisma.planDiario.findUnique({
      where: { idUsuario_fecha: { idUsuario, fecha: new Date(fecha) } },
    });
    if (!plan) return null;

    const perfil = await this.prisma.perfilCronotipo.findUnique({ where: { idUsuario } });
    const categoria = perfil?.categoria ?? 'intermedio';

    return this.aPlanDiarioDto(plan, [], categoria);
  }

  private aPlanDiarioDto(plan: any, recordatorios: any[], categoria: string): PlanDiarioDto {
    return {
      id: plan.id,
      idUsuario: plan.idUsuario,
      fecha: plan.fecha.toISOString().slice(0, 10),
      inicioSueno: plan.inicioSueno,
      finSueno: plan.finSueno,
      inicioSiesta: plan.inicioSiesta,
      finSiesta: plan.finSiesta,
      picos: plan.picos,
      horaCorteCalefina: plan.horaCorteCalefina,
      ventanaLuz: plan.ventanaLuz,
      categoriaCronotipo: categoria as any,
      versionAlgoritmo: plan.versionAlgoritmo,
      recordatorios,
      creadoEn: plan.creadoEn,
      actualizadoEn: plan.actualizadoEn,
    };
  }
}
