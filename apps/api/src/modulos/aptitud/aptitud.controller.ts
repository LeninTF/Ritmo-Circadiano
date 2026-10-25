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
  @ApiOperation({ summary: 'Colores del semáforo compartidos en un día, de todos o de un participante (RN10)' })
  @ApiQuery({
    name: 'codigo',
    required: false,
    example: 'P01',
    description: 'codigo_participante. Sin él, una fila por turno evaluado y compartido del día.',
  })
  @ApiQuery({ name: 'fecha', example: '2026-10-24', description: 'Día en hora de Lima (AAAA-MM-DD)' })
  @ApiResponse({
    status: 200,
    description: 'Solo {codigo, color} con consentimiento; sin horas de sueño ni somnolencia. Quien no evaluó o no compartió no aparece.',
  })
  @ApiResponse({ status: 400, description: 'codigo o fecha inválidos.' })
  @ApiResponse({ status: 403, description: 'Solo el despachador consulta.' })
  consultarDespacho(
    @Query('fecha') fecha: string,
    @Query('codigo') codigo?: string,
  ): Promise<ConsultarDespachoResponse> {
    return this.aptitud.consultarDespacho(fecha, codigo);
  }

  @Post(':idTurno')
  @Roles('trabajador')
  @ApiOperation({ summary: 'Autoevaluación de aptitud pre-salida del turno propio (RN09)' })
  @ApiResponse({
    status: 201,
    description: 'Color, horas de sueño de las últimas 24 h y motivos. Herramienta preventiva: no autoriza la salida.',
  })
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
