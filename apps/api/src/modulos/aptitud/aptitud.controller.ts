import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { ConsultarDespachoResponse, CrearAptitudResponse, UsuarioJwtPayload } from '@circadiano/contracts';
import { Roles, UsuarioActual } from '../plataforma/auth';
import { AptitudService } from './aptitud.service';
import { CrearAptitudDto } from './dto/crear-aptitud.dto';

@ApiTags('Aptitud pre-salida (RF12)')
@Controller('aptitud')
@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Token ausente, inválido o vencido.' })
export class AptitudController {
  constructor(private readonly aptitud: AptitudService) {}

  // Ruta estatica antes de la parametrica.
  @Get('despacho')
  @Roles('despachador')
  @ApiOperation({ summary: 'Color del semáforo compartido por un participante en un día (RN10)' })
  @ApiQuery({ name: 'codigo', example: 'P01', description: 'codigo_participante' })
  @ApiQuery({ name: 'fecha', example: '2026-10-24', description: 'Día en hora de Lima (AAAA-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Solo colores con consentimiento; sin horas de sueño ni somnolencia.' })
  @ApiResponse({ status: 400, description: 'codigo o fecha inválidos.' })
  @ApiResponse({ status: 403, description: 'Solo el despachador consulta.' })
  consultarDespacho(
    @Query('codigo') codigo: string,
    @Query('fecha') fecha: string,
  ): Promise<ConsultarDespachoResponse> {
    return this.aptitud.consultarDespacho(codigo, fecha);
  }

  @Post(':idTurno')
  @Roles('trabajador')
  @ApiOperation({ summary: 'Autoevaluación de aptitud pre-salida del turno propio (RN09)' })
  @ApiResponse({ status: 201, description: 'Color del semáforo. Herramienta preventiva: no autoriza la salida.' })
  @ApiResponse({ status: 400, description: 'Somnolencia fuera de 1–5 o id de turno inválido.' })
  @ApiResponse({ status: 403, description: 'El turno no es del trabajador o el rol no es trabajador.' })
  @ApiResponse({ status: 404, description: 'Turno no encontrado.' })
  crearAptitud(
    @Param('idTurno', ParseUUIDPipe) idTurno: string,
    @Body() dto: CrearAptitudDto,
    @UsuarioActual() usuario: UsuarioJwtPayload,
  ): Promise<CrearAptitudResponse> {
    return this.aptitud.crearAptitud(usuario.sub, idTurno, dto);
  }
}
