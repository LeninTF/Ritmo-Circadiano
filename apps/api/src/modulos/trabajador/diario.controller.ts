import { Controller, Get, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DiarioService } from './diario.service';
import {
  CrearActualizarDiarioDto,
  DiarioRespuestaDto,
  type UsuarioJwtPayload,
} from '@circadiano/contracts';
import { Roles, UsuarioActual } from '../plataforma/auth';

// El JwtAuthGuard global exige token; el dueno siempre es el `sub` del token (RNF04).
@ApiTags('Diario de Sueño')
@Controller('diario')
@ApiBearerAuth()
@Roles('trabajador')
@ApiResponse({ status: 401, description: 'Token ausente, inválido o vencido.' })
@ApiResponse({ status: 403, description: 'Solo el trabajador registra y consulta su diario.' })
export class DiarioController {
  constructor(private readonly diarioService: DiarioService) {}

  @Put(':fecha')
  @ApiOperation({ summary: 'Upsert de registro diario de sueño para una fecha' })
  @ApiResponse({ status: 200, description: 'Diario creado o actualizado correctamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o fecha incorrecta.' })
  @ApiResponse({ status: 409, description: 'El client_id ya pertenece a otro registro.' })
  async upsertDiario(
    @Param('fecha') fecha: string,
    @Body() dto: CrearActualizarDiarioDto,
    @UsuarioActual() usuario: UsuarioJwtPayload,
  ): Promise<DiarioRespuestaDto> {
    return this.diarioService.upsertDiario(usuario.sub, fecha, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Consultar registros diarios de sueño por intervalo de fechas' })
  @ApiQuery({ name: 'desde', required: true, example: '2026-10-01' })
  @ApiQuery({ name: 'hasta', required: true, example: '2026-10-21' })
  @ApiResponse({ status: 200, description: 'Lista de registros diarios dentro del rango.' })
  @ApiResponse({ status: 400, description: 'Rango de fechas inválido.' })
  async consultarDiarios(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
    @UsuarioActual() usuario: UsuarioJwtPayload,
  ): Promise<DiarioRespuestaDto[]> {
    return this.diarioService.consultarDiarios(usuario.sub, desde, hasta);
  }
}
