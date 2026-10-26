import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CafeinaService } from './cafeina.service';
import {
  IngestaCafeinaRespuestaDto,
  ResidualCafeinaRespuestaDto,
  ResumenCafeinaDto,
  type UsuarioJwtPayload,
} from '@circadiano/contracts';
import { Roles, UsuarioActual } from '../plataforma/auth';
import { ConsultarResumenCafeinaDto } from './dto/consultar-resumen.dto';
import { CrearIngestaCafeinaBodyDto } from './dto/crear-ingesta.dto';

@ApiTags('cafeina')
// Datos personales de consumo: solo el trabajador dueño (CLAUDE.md §6).
@Roles('trabajador')
@Controller('cafeina')
export class CafeinaController {
  constructor(private readonly cafeinaService: CafeinaService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar una ingesta de cafeína (idempotente por client_id)' })
  @ApiResponse({ status: 201, description: 'Ingesta registrada o recuperada correctamente.' })
  async registrarIngesta(
    @UsuarioActual() usuario: UsuarioJwtPayload,
    @Body() dto: CrearIngestaCafeinaBodyDto,
  ): Promise<IngestaCafeinaRespuestaDto> {
    // RNF04: el dueno siempre es el del token, nunca el id_usuario del cuerpo.
    return this.cafeinaService.registrarIngesta({ ...dto, id_usuario: usuario.sub });
  }

  @Get()
  @ApiOperation({ summary: 'Listar ingestas de cafeína de un usuario en una fecha específica' })
  @ApiQuery({ name: 'fecha', required: true, type: String, example: '2026-10-17' })
  @ApiResponse({ status: 200, description: 'Lista de ingestas obtenida.' })
  async listarIngestas(
    @UsuarioActual() usuario: UsuarioJwtPayload,
    @Query('fecha') fecha: string,
  ): Promise<IngestaCafeinaRespuestaDto[]> {
    return this.cafeinaService.listarIngestas(usuario.sub, fecha);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un registro de ingesta de cafeína' })
  @ApiResponse({ status: 200, description: 'Ingesta eliminada correctamente.' })
  async eliminarIngesta(
    @UsuarioActual() usuario: UsuarioJwtPayload,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.cafeinaService.eliminarIngesta(id, usuario.sub);
  }

  @Get('resumen')
  @ApiOperation({ summary: 'Consumo por día (hora de Lima) y cafeína activa estimada (RF09)' })
  @ApiResponse({ status: 200, description: 'Resumen calculado. La cafeína activa es una estimación, no un dato médico.' })
  async obtenerResumen(
    @UsuarioActual() usuario: UsuarioJwtPayload,
    @Query() query: ConsultarResumenCafeinaDto,
  ): Promise<ResumenCafeinaDto> {
    return this.cafeinaService.obtenerResumen(usuario.sub, query.dias);
  }

  @Get('residual')
  @ApiOperation({ summary: 'Calcular el residual de cafeína hasta la hora de dormir y hora de corte' })
  @ApiQuery({ name: 'hasta', required: true, type: Number, description: 'Hora en formato decimal o timestamp en horas' })
  @ApiResponse({ status: 200, description: 'Cálculo de residual y corte realizado.' })
  async calcularResidual(
    @UsuarioActual() usuario: UsuarioJwtPayload,
    @Query('hasta') hasta: string,
  ): Promise<ResidualCafeinaRespuestaDto> {
    const hastaNum = parseFloat(hasta);
    return this.cafeinaService.calcularResidualHastaSueno(usuario.sub, hastaNum);
  }
}
