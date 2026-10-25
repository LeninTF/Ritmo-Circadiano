import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EnvironmentProviders, inject, makeEnvironmentProviders } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import type { SyncLoteResultadoWireDto, SyncLoteWireDto } from '@circadiano/contracts';
import { environment } from '../../../environments/environment';
import { SesionService, decodificarJwt } from '../../auth/sesion.service';
import { ISessionProvider, SESSION_PROVIDER_TOKEN } from './session-provider';
import {
  ISyncTransport,
  SYNC_TRANSPORT_TOKEN,
  SyncTransportRequest,
  SyncTransportResponse,
} from './sync-transport';

/** Estado HTTP equivalente para que OutboxService decida: confirmar, bloquear o reintentar. */
const ESTADO_POR_RESULTADO = {
  confirmed: 200,
  duplicate: 200,
  rejected: 422,
  retryable_failure: 503,
} as const;

/** El dueño de la cola es el `sub` del token; sin sesion, OutboxService no encola ni sincroniza. */
export function crearSesionOffline(sesion: SesionService): ISessionProvider {
  return {
    getUserId: () => {
      const token = sesion.accessToken();
      const sub = token ? decodificarJwt(token)?.sub : undefined;
      if (!sub) throw new Error('Sin sesion');
      return sub;
    },
  };
}

/** Envia cada operacion a POST /sync/lote; el authInterceptor agrega el token. */
export function crearTransporteSync(http: HttpClient, apiUrl: string): ISyncTransport {
  return {
    send: async (op: SyncTransportRequest): Promise<SyncTransportResponse> => {
      let respuesta: SyncLoteResultadoWireDto;
      const lote: SyncLoteWireDto = {
        operations: [
          {
            client_id: op.clientId,
            created_at: op.createdAt,
            operation: op.operation,
            payload: op.payload,
          },
        ],
      };
      try {
        respuesta = await firstValueFrom(http.post<SyncLoteResultadoWireDto>(`${apiUrl}/sync/lote`, lote));
      } catch (error: unknown) {
        // Status 0 = sin red: se lanza sin status para que OutboxService lo reintente.
        if (error instanceof HttpErrorResponse && error.status !== 0) throw error;
        throw new Error('Sin conexion con la API');
      }
      const resultado = respuesta?.results?.find((r) => r.client_id === op.clientId);
      if (!resultado) return { status: 503 };
      return {
        status: ESTADO_POR_RESULTADO[resultado.status],
        confirmedClientId: resultado.client_id,
      };
    },
  };
}

export function proveerOffline(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: SESSION_PROVIDER_TOKEN,
      useFactory: () => crearSesionOffline(inject(SesionService)),
    },
    {
      provide: SYNC_TRANSPORT_TOKEN,
      useFactory: () => crearTransporteSync(inject(HttpClient), environment.apiUrl),
    },
  ]);
}
