import { Controller, Get, Put, Body, Param, Query, Req, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DiarioService } from './diario.service';
import { CrearActualizarDiarioDto, DiarioRespuestaDto } from '@circadiano/contracts';

@ApiTags('Diario de Sueño')
@Controller('diario')
@ApiBearerAuth()
export class DiarioController {
  constructor(private readonly diarioService: DiarioService) {}

  private obtenerIdUsuario(req: any): string {
    // Extracción estricta y segura exclusivamente desde el contexto de autenticación (req.user o req.usuario).
    // Prohibido aceptar x-usuario-id, query parameters, headers arbitrarios o body.
    const usuario = req.user || req.usuario;
    const usuarioId = usuario?.id || usuario?.sub;
    if (!usuarioId || typeof usuarioId !== 'string' || !usuarioId.trim()) {
      throw new UnauthorizedException('Usuario no autenticado o ID de usuario ausente en el contexto de seguridad.');
    }
    return usuarioId;
  }

  @Put(':fecha')
  @ApiOperation({ summary: 'Upsert de registro diario de sueño para una fecha' })
  @ApiResponse({ status: 200, description: 'Diario creado o actualizado correctamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o fecha incorrecta.' })
  @ApiResponse({ status: 401, description: 'No autorizado / Token ausente o inválido.' })
  async upsertDiario(
    @Param('fecha') fecha: string,
    @Body() dto: CrearActualizarDiarioDto,
    @Req() req: any,
  ): Promise<DiarioRespuestaDto> {
    const idUsuario = this.obtenerIdUsuario(req);
    return this.diarioService.upsertDiario(idUsuario, fecha, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Consultar registros diarios de sueño por intervalo de fechas' })
  @ApiQuery({ name: 'desde', required: true, example: '2026-10-01' })
  @ApiQuery({ name: 'hasta', required: true, example: '2026-10-21' })
  @ApiResponse({ status: 200, description: 'Lista de registros diarios dentro del rango.' })
  @ApiResponse({ status: 400, description: 'Rango de fechas inválido.' })
  @ApiResponse({ status: 401, description: 'No autorizado / Token ausente o inválido.' })
  async consultarDiarios(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
    @Req() req: any,
  ): Promise<DiarioRespuestaDto[]> {
    const idUsuario = this.obtenerIdUsuario(req);
    return this.diarioService.consultarDiarios(idUsuario, desde, hasta);
  }
}

