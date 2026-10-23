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
  CrearIngestaCafeinaDto,
  IngestaCafeinaRespuestaDto,
  ResidualCafeinaRespuestaDto,
} from '@circadiano/contracts';

@ApiTags('cafeina')
@Controller('cafeina')
export class CafeinaController {
  constructor(private readonly cafeinaService: CafeinaService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar una ingesta de cafeína (idempotente por client_id)' })
  @ApiResponse({ status: 201, description: 'Ingesta registrada o recuperada correctamente.' })
  async registrarIngesta(
    @Body() dto: CrearIngestaCafeinaDto,
  ): Promise<IngestaCafeinaRespuestaDto> {
    return this.cafeinaService.registrarIngesta(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar ingestas de cafeína de un usuario en una fecha específica' })
  @ApiQuery({ name: 'id_usuario', required: true, type: String })
  @ApiQuery({ name: 'fecha', required: true, type: String, example: '2026-10-17' })
  @ApiResponse({ status: 200, description: 'Lista de ingestas obtenida.' })
  async listarIngestas(
    @Query('id_usuario') idUsuario: string,
    @Query('fecha') fecha: string,
  ): Promise<IngestaCafeinaRespuestaDto[]> {
    return this.cafeinaService.listarIngestas(idUsuario, fecha);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un registro de ingesta de cafeína' })
  @ApiResponse({ status: 200, description: 'Ingesta eliminada correctamente.' })
  async eliminarIngesta(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.cafeinaService.eliminarIngesta(id);
  }

  @Get('residual')
  @ApiOperation({ summary: 'Calcular el residual de cafeína hasta la hora de dormir y hora de corte' })
  @ApiQuery({ name: 'id_usuario', required: true, type: String })
  @ApiQuery({ name: 'hasta', required: true, type: Number, description: 'Hora en formato decimal o timestamp en horas' })
  @ApiResponse({ status: 200, description: 'Cálculo de residual y corte realizado.' })
  async calcularResidual(
    @Query('id_usuario') idUsuario: string,
    @Query('hasta') hasta: string,
  ): Promise<ResidualCafeinaRespuestaDto> {
    const hastaNum = parseFloat(hasta);
    return this.cafeinaService.calcularResidualHastaSueno(idUsuario, hastaNum);
  }

  @Post('sync/lote')
  @ApiOperation({ summary: 'Sincronización offline por lote de ingestas de cafeína (contrato con I5)' })
  @ApiResponse({ status: 201, description: 'Lote sincronizado exitosamente.' })
  async sincronizarLote(
    @Body() lote: CrearIngestaCafeinaDto[],
  ): Promise<IngestaCafeinaRespuestaDto[]> {
    return this.cafeinaService.sincronizarLote(lote);
  }
}
