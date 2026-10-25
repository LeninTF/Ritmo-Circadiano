import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type {
  EventoSolarDto,
  PerfilCronotipoDto,
  PlanDiarioDto,
  UbicacionDto,
  UsuarioJwtPayload,
} from '@circadiano/contracts';
import { Roles, UsuarioActual } from '../plataforma/auth';
import { CronotipoService } from './cronotipo.service';
import { ConsultarEventosSolaresDto, ConsultarFechaDto } from './dto/consultar-fecha.dto';
import { CrearPerfilCronotipoDto } from './dto/crear-perfil-cronotipo.dto';
import { CrearUbicacionDto } from './dto/crear-ubicacion.dto';
import { GenerarPlanDto } from './dto/generar-plan.dto';
import { PlanesService } from './planes.service';
import { UbicacionService } from './ubicacion.service';

// El usuario siempre sale del token: ninguna ruta acepta un idUsuario del cliente (RNF04).
@ApiTags('Motor circadiano (RF03, RF06, RF07)')
@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Token ausente, inválido o vencido.' })
@ApiResponse({ status: 403, description: 'Solo el trabajador consulta su propio plan.' })
@Roles('trabajador')
@Controller()
export class CircadianoController {
  constructor(
    private readonly planes: PlanesService,
    private readonly ubicaciones: UbicacionService,
    private readonly cronotipos: CronotipoService,
  ) {}

  @Post('planes/generar')
  @ApiOperation({ summary: 'Genera (o regenera) el plan del día para un turno propio (RF07)' })
  @ApiResponse({ status: 201, description: 'Plan con sueño, siesta, picos, luz y corte de cafeína.' })
  @ApiResponse({ status: 404, description: 'Turno no encontrado.' })
  generarPlan(@UsuarioActual() usuario: UsuarioJwtPayload, @Body() dto: GenerarPlanDto): Promise<PlanDiarioDto> {
    return this.planes.generar(usuario.sub, dto.idTurno);
  }

  @Get('planes')
  @ApiOperation({ summary: 'Plan del día del trabajador autenticado' })
  @ApiResponse({ status: 404, description: 'No hay plan para esa fecha.' })
  obtenerPlan(@UsuarioActual() usuario: UsuarioJwtPayload, @Query() query: ConsultarFechaDto): Promise<PlanDiarioDto> {
    return this.planes.obtener(usuario.sub, query.fecha);
  }

  @Post('ubicacion')
  @ApiOperation({ summary: 'Registra la ubicación (GPS o sede elegida) para el cálculo solar (RF06)' })
  registrarUbicacion(@UsuarioActual() usuario: UsuarioJwtPayload, @Body() dto: CrearUbicacionDto): Promise<UbicacionDto> {
    return this.ubicaciones.registrar(usuario.sub, dto);
  }

  @Get('eventos-solares')
  @ApiOperation({ summary: 'Amanecer, mediodía y atardecer de hasta 7 días; usa caché (RF06)' })
  @ApiResponse({ status: 404, description: 'El trabajador aún no registró su ubicación.' })
  listarEventosSolares(
    @UsuarioActual() usuario: UsuarioJwtPayload,
    @Query() query: ConsultarEventosSolaresDto,
  ): Promise<EventoSolarDto[]> {
    return this.ubicaciones.listarEventos(usuario.sub, query.desde, query.dias);
  }

  @Post('cronotipo')
  @ApiOperation({ summary: 'Guarda las respuestas del rMEQ y devuelve el cronotipo (RF03, RN07)' })
  guardarCronotipo(
    @UsuarioActual() usuario: UsuarioJwtPayload,
    @Body() dto: CrearPerfilCronotipoDto,
  ): Promise<PerfilCronotipoDto> {
    return this.cronotipos.guardar(usuario.sub, dto);
  }

  @Get('cronotipo/me')
  @ApiOperation({ summary: 'Cronotipo del trabajador autenticado' })
  @ApiResponse({ status: 404, description: 'Aún no respondió el cuestionario.' })
  obtenerCronotipo(@UsuarioActual() usuario: UsuarioJwtPayload): Promise<PerfilCronotipoDto> {
    return this.cronotipos.obtener(usuario.sub);
  }
}
