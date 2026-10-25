import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import type {
  SyncHandlerResult,
  SyncIdentity,
  SyncOperacionDto,
  SyncOperationHandler,
} from '@circadiano/contracts';
import { CafeinaService } from './cafeina.service';
import { CrearIngestaCafeinaBodyDto } from './dto/crear-ingesta.dto';

/**
 * Operacion `ingesta` de POST /sync/lote (RNF03). Payload: CrearIngestaCafeinaBodyDto sin client_id;
 * el client_id es el del sobre. La idempotencia la da UNIQUE(client_id) en registrarIngesta.
 */
@Injectable()
export class IngestaSyncHandler implements SyncOperationHandler<'ingesta'> {
  readonly operation = 'ingesta';

  constructor(private readonly cafeina: CafeinaService) {}

  async handle(operacion: SyncOperacionDto, identidad: SyncIdentity): Promise<SyncHandlerResult> {
    const dto = plainToInstance(CrearIngestaCafeinaBodyDto, { ...operacion.payload, client_id: operacion.clientId });
    const errores = await validate(dto, { whitelist: true, forbidNonWhitelisted: true });
    if (errores.length > 0) {
      return { status: 'rejected', code: 'SYNC_INVALID_PAYLOAD', message: 'Payload de ingesta invalido' };
    }
    try {
      await this.cafeina.registrarIngesta({ ...dto, id_usuario: identidad.userId });
      return { status: 'confirmed' };
    } catch (error) {
      if (error instanceof ConflictException) {
        return { status: 'rejected', code: 'SYNC_CLIENT_ID_COLLISION', message: 'client_id ya usado' };
      }
      if (error instanceof BadRequestException) {
        return { status: 'rejected', code: 'SYNC_INVALID_PAYLOAD', message: 'Payload de ingesta invalido' };
      }
      throw error;
    }
  }
}
