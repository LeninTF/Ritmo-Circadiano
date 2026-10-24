import { BadRequestException, Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  syncLoteDesdeWire,
  syncResultadoAFormaWire,
  type SyncLoteResultadoWireDto,
  type SyncLoteWireDto,
  type UsuarioJwtPayload,
} from '@circadiano/contracts';
import { Roles, UsuarioActual } from '../plataforma/auth';
import { InvalidSyncBatchError, SyncOrchestratorService } from './sync-orchestrator.service';

// La identidad del lote es siempre el `sub` del token, nunca un campo del cuerpo (RNF04).
@ApiTags('Sincronizacion offline')
@Controller('sync')
@ApiBearerAuth()
@Roles('trabajador')
export class SyncController {
  constructor(private readonly orquestador: SyncOrchestratorService) {}

  @Post('lote')
  @HttpCode(200)
  @ApiOperation({ summary: 'Procesa un lote de operaciones offline; resultado por client_id' })
  @ApiResponse({ status: 200, description: 'confirmed | duplicate | rejected | retryable_failure por operacion.' })
  @ApiResponse({ status: 400, description: 'Lote vacio, mal formado o con client_id repetido.' })
  @ApiResponse({ status: 401, description: 'Token ausente, invalido o vencido.' })
  @ApiResponse({ status: 403, description: 'Solo el trabajador sincroniza sus datos.' })
  async procesarLote(
    @Body() cuerpo: SyncLoteWireDto,
    @UsuarioActual() usuario: UsuarioJwtPayload,
  ): Promise<SyncLoteResultadoWireDto> {
    if (!Array.isArray(cuerpo?.operations) || cuerpo.operations.some((op) => !op || typeof op !== 'object')) {
      throw new BadRequestException('operations debe ser una lista de objetos');
    }
    try {
      const { results } = await this.orquestador.process(syncLoteDesdeWire(cuerpo), { userId: usuario.sub });
      return { results: results.map(syncResultadoAFormaWire) };
    } catch (error) {
      if (error instanceof InvalidSyncBatchError) throw new BadRequestException(error.message);
      throw error;
    }
  }
}
