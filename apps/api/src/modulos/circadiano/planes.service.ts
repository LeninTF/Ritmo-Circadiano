import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { PlanDiarioDto, PlanGeneradoEvento, VentanaTemporalDto } from '@circadiano/contracts';
import { EVENTO_PLAN_GENERADO } from '@circadiano/contracts';
import {
  SEMIVIDA_H_DEFECTO,
  UMBRAL_CAFEINA_MG_DEFECTO,
  VERSION_ALGORITMO_PLAN,
  aPlanDiarioDto,
  calcularEventosSolares,
  generarPlan,
  type IngestaCafeina,
  type ResultadoPlan,
  type Ventana,
} from '@circadiano/domain';
import { Prisma, type PlanDiario } from '../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CafeinaService } from '../cafeina/cafeina.service';
import { OperacionesService } from '../operaciones/operaciones.service';
import { ParametrosService } from '../plataforma/parametros/parametros.service';
import { CronotipoService } from './cronotipo.service';
import { UbicacionService } from './ubicacion.service';

const MS_DIA = 86_400_000;
const MS_H = 3_600_000;

/** Campos del turno de I2 que usa el motor. */
export interface TurnoParaPlan {
  id: string;
  idUsuario: string;
  fecha: Date;
  inicioProgramado: Date;
  finProgramado: Date;
  horaInicioReal: Date | null;
  horaFinReal: Date | null;
  esNocturno: boolean;
}

// Sin anotar el retorno: un literal inferido es JSON valido para Prisma; la interfaz no.
const aIso = (v: Ventana) => ({ inicio: v.inicio.toISOString(), fin: v.fin.toISOString() });
const aFecha = (v: VentanaTemporalDto): Ventana => ({ inicio: new Date(v.inicio), fin: new Date(v.fin) });
const diaIso = (fecha: Date) => fecha.toISOString().slice(0, 10);

/** RF07: genera y consulta el plan diario con el mismo motor que la PWA offline. */
@Injectable()
export class PlanesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly operaciones: OperacionesService,
    private readonly cafeina: CafeinaService,
    private readonly parametros: ParametrosService,
    private readonly cronotipos: CronotipoService,
    private readonly ubicaciones: UbicacionService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /** POST /planes/generar: solo para un turno propio. */
  async generar(idUsuario: string, idTurno: string): Promise<PlanDiarioDto> {
    const turno = await this.operaciones.obtenerTurnoPorId(idTurno);
    if (turno.idUsuario !== idUsuario) {
      throw new ForbiddenException('El turno no pertenece al trabajador autenticado.');
    }
    return this.generarParaTurno(turno);
  }

  /** Lo usa tambien el listener de TurnoAsignado. Respeta la hora real si el turno fue corregido (RF05). */
  async generarParaTurno(turno: TurnoParaPlan): Promise<PlanDiarioDto> {
    const { idUsuario } = turno;
    const fecha = diaIso(turno.fecha);
    const inicioTurno = turno.horaInicioReal ?? turno.inicioProgramado;
    const finTurno = turno.horaFinReal ?? turno.finProgramado;

    const [coordenadas, cronotipo, turnos, umbralCafeinaMg, ingestas] = await Promise.all([
      this.ubicaciones.obtenerCoordenadas(idUsuario),
      this.cronotipos.obtenerCategoria(idUsuario),
      this.operaciones.listarTurnosMe(idUsuario, fecha, diaIso(new Date(turno.fecha.getTime() + 2 * MS_DIA))),
      this.leerUmbralCafeina(),
      this.leerIngestas(idUsuario, turno.fecha),
    ]);
    const siguiente = turnos.find((t) => t.id !== turno.id && t.inicioProgramado.getTime() >= finTurno.getTime());

    const resultado = generarPlan(
      { inicioTurno, finTurno, esNocturno: turno.esNocturno, inicioSiguienteTurno: siguiente?.inicioProgramado ?? null },
      cronotipo,
      calcularEventosSolares(coordenadas.lat, coordenadas.lng, fecha),
      ingestas,
      // shortcut: semivida por defecto (RN03) como en /cafeina/residual; leer usuario.semivida_h cuando I1 lo exponga.
      { versionAlgoritmo: VERSION_ALGORITMO_PLAN, semividaH: SEMIVIDA_H_DEFECTO, umbralCafeinaMg },
    );

    const datos = {
      idTurno: turno.id,
      inicioSueno: resultado.inicioSueno,
      finSueno: resultado.finSueno,
      inicioSiesta: resultado.inicioSiesta,
      finSiesta: resultado.finSiesta,
      picos: resultado.picos.map(aIso),
      horaCorteCafeina: resultado.horaCorteCafeina,
      ventanaLuz: resultado.ventanaLuz ? aIso(resultado.ventanaLuz) : Prisma.DbNull,
      protegerLuz: resultado.protegerLuz,
      categoria: resultado.categoriaCronotipo,
      versionAlgoritmo: resultado.versionAlgoritmo,
    };
    const fila = await this.prisma.planDiario.upsert({
      where: { idUsuario_fecha: { idUsuario, fecha: turno.fecha } },
      create: { idUsuario, fecha: turno.fecha, ...datos },
      update: datos,
    });

    const dto = this.aDto(fila);
    const eventoPayload: PlanGeneradoEvento = {
      id_usuario: idUsuario,
      id_plan: fila.id,
      fecha,
      recordatorios: dto.recordatorios,
    };
    this.eventEmitter.emit(EVENTO_PLAN_GENERADO, eventoPayload);

    return dto;
  }

  /** GET /planes?fecha */
  async obtener(idUsuario: string, fecha: string): Promise<PlanDiarioDto> {
    const fila = await this.prisma.planDiario.findUnique({
      where: { idUsuario_fecha: { idUsuario, fecha: new Date(fecha) } },
    });
    if (!fila) throw new NotFoundException('No hay plan para esa fecha.');
    return this.aDto(fila);
  }

  private async leerUmbralCafeina(): Promise<number> {
    const parametros = await this.parametros.listar();
    const valor = Number(parametros.find((p) => p.clave === 'umbral_cafeina_mg')?.valor);
    return Number.isFinite(valor) ? valor : UMBRAL_CAFEINA_MG_DEFECTO;
  }

  /** Ingestas del dia del turno y del anterior: las que siguen en el cuerpo al dormir. */
  private async leerIngestas(idUsuario: string, fecha: Date): Promise<IngestaCafeina[]> {
    const dias = [diaIso(new Date(fecha.getTime() - MS_DIA)), diaIso(fecha)];
    const listas = await Promise.all(dias.map((d) => this.cafeina.listarIngestas(idUsuario, d)));
    return listas.flat().map((i) => ({ dosisMg: i.cafeina_mg, hora: Date.parse(i.fecha_hora) / MS_H }));
  }

  private aDto(fila: PlanDiario): PlanDiarioDto {
    const ventanaLuz = fila.ventanaLuz as unknown as VentanaTemporalDto | null;
    const resultado: ResultadoPlan = {
      tipoTurno: fila.protegerLuz ? 'nocturno' : 'diurno',
      inicioSueno: fila.inicioSueno,
      finSueno: fila.finSueno,
      inicioSiesta: fila.inicioSiesta,
      finSiesta: fila.finSiesta,
      picos: (fila.picos as unknown as VentanaTemporalDto[]).map(aFecha),
      horaCorteCafeina: fila.horaCorteCafeina,
      ventanaLuz: ventanaLuz && aFecha(ventanaLuz),
      protegerLuz: fila.protegerLuz,
      categoriaCronotipo: fila.categoria,
      versionAlgoritmo: fila.versionAlgoritmo,
    };
    return aPlanDiarioDto(resultado, {
      id: fila.id,
      idTurno: fila.idTurno,
      fecha: diaIso(fila.fecha),
      actualizadoEn: fila.actualizadoEn.toISOString(),
    });
  }
}
