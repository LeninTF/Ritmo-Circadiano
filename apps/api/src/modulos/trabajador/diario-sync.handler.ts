import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  CrearActualizarDiarioDto,
  type SyncHandlerResult,
  type SyncIdentity,
  type SyncOperacionDto,
  type SyncOperationHandler,
} from '@circadiano/contracts';
import { DiarioService } from './diario.service';

/**
 * Operacion `diario` de POST /sync/lote (RNF03). Payload: `{ fecha, ...CrearActualizarDiarioDto sin clientId }`;
 * el client_id es el del sobre. La idempotencia la da el upsert por (usuario, fecha) + UNIQUE(client_id).
 */
@Injectable()
export class DiarioSyncHandler implements SyncOperationHandler<'diario'> {
  readonly operation = 'diario';

  constructor(private readonly diario: DiarioService) {}

  async handle(operacion: SyncOperacionDto, identidad: SyncIdentity): Promise<SyncHandlerResult> {
    const { fecha, ...resto } = operacion.payload;
    const dto = plainToInstance(CrearActualizarDiarioDto, { ...resto, clientId: operacion.clientId });
    const errores = await validate(dto, { whitelist: true, forbidNonWhitelisted: true });
    if (typeof fecha !== 'string' || errores.length > 0) {
      return { status: 'rejected', code: 'SYNC_INVALID_PAYLOAD', message: 'Payload de diario invalido' };
    }
    try {
      await this.diario.upsertDiario(identidad.userId, fecha, dto);
      return { status: 'confirmed' };
    } catch (error) {
      if (error instanceof ConflictException) {
        return { status: 'rejected', code: 'SYNC_CLIENT_ID_COLLISION', message: 'client_id ya usado' };
      }
      if (error instanceof BadRequestException) {
        return { status: 'rejected', code: 'SYNC_INVALID_PAYLOAD', message: 'Payload de diario invalido' };
      }
      throw error;
    }
  }
}
