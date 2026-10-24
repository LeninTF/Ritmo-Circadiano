export interface LwwComparisonInput<T> {
  readonly existing: {
    readonly id?: string;
    readonly updatedAt: string | Date;
    readonly clientId: string;
    readonly payload: T;
  } | null;
  readonly incoming: {
    readonly id?: string;
    readonly updatedAt: string | Date;
    readonly clientId: string;
    readonly payload: T;
  };
}

export type LwwResolutionAction =
  | 'ACCEPT_NEW'
  | 'IGNORE_OBSOLETE'
  | 'IDEMPOTENT_DUPLICATE_NOOP'
  | 'TIE_RESOLVED_ACCEPTED'
  | 'TIE_RESOLVED_IGNORED'
  | 'ERROR_INVALID_TIMESTAMP'
  | 'ERROR_CLIENT_ID_COLLISION';

export interface LwwResolutionResult {
  readonly action: LwwResolutionAction;
  readonly reason: string;
}

/**
 * Resuelve conflictos de sincronización aplicando la política Last-Write-Wins (LWW)
 * basada en `updatedAt`, con desempate determinista por `clientId`.
 * 
 * NOTAS DE ARQUITECTURA Y LIMITACIONES:
 * 1. Es una función puramente lógica y en memoria: no dispone de persistencia ni sustituye
 *    una tabla de historial de operaciones en la base de datos.
 * 2. El desempate lexicográfico por `clientId` es una convención determinista propuesta por I5
 *    para evitar discrepancias de orden de red, pero NO garantiza causalidad distribuida.
 * 3. Asume instantes UTC normalizados; clientes con desfase de reloj (clock drift) pueden
 *    provocar que escrituras físicamente posteriores sean clasificadas como obsoletas.
 */
export function resolverConflictoLww<T>(input: LwwComparisonInput<T>): LwwResolutionResult {
  const { existing, incoming } = input;

  // 1. Validar timestamps de entrada
  const incomingTime = parseTimestamp(incoming.updatedAt);
  if (incomingTime === null || isNaN(incomingTime)) {
    return {
      action: 'ERROR_INVALID_TIMESTAMP',
      reason: `El timestamp de entrada '${String(incoming.updatedAt)}' no es válido.`,
    };
  }

  // Si no existe registro previo, se acepta directamente como primera versión
  if (!existing) {
    return {
      action: 'ACCEPT_NEW',
      reason: 'No existe registro previo; se acepta la inserción inicial.',
    };
  }

  const existingTime = parseTimestamp(existing.updatedAt);
  if (existingTime === null || isNaN(existingTime)) {
    return {
      action: 'ERROR_INVALID_TIMESTAMP',
      reason: `El timestamp existente '${String(existing.updatedAt)}' no es válido.`,
    };
  }

  // 2. Comprobación de client_id duplicado / colisión (prioridad absoluta sobre LWW y desempate)
  if (existing.clientId === incoming.clientId) {
    if (sonPayloadsEquivalentes(existing.payload, incoming.payload)) {
      return {
        action: 'IDEMPOTENT_DUPLICATE_NOOP',
        reason: 'Mismo clientId y payload equivalente: reintento duplicado ya aplicado (no-op).',
      };
    } else {
      return {
        action: 'ERROR_CLIENT_ID_COLLISION',
        reason: 'Colisión de clientId: mismo identificador con diferente payload.',
      };
    }
  }

  // 3. Regla Last-Write-Wins (LWW) por updatedAt normalizado UTC
  if (incomingTime > existingTime) {
    return {
      action: 'ACCEPT_NEW',
      reason: 'El timestamp entrante es estrictamente posterior al existente (LWW).',
    };
  }

  if (incomingTime < existingTime) {
    return {
      action: 'IGNORE_OBSOLETE',
      reason: 'El timestamp entrante es anterior al existente; se descarta por obsolescencia.',
    };
  }

  // 4. Timestamps iguales: desempate determinista por clientId lexicográfico
  if (incoming.clientId > existing.clientId) {
    return {
      action: 'TIE_RESOLVED_ACCEPTED',
      reason: 'Timestamps iguales; desempate determinista acepta por mayor clientId.',
    };
  } else {
    return {
      action: 'TIE_RESOLVED_IGNORED',
      reason: 'Timestamps iguales; desempate determinista descarta por menor o igual clientId.',
    };
  }
}

function parseTimestamp(value: string | Date): number | null {
  if (value instanceof Date) {
    const time = value.getTime();
    return Number.isFinite(time) ? time : null;
  }
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

/**
 * Comparación canónica profunda de estructuras JSON.
 * Normaliza recursivamente el orden de las propiedades para evitar falsos negativos
 * cuando los atributos están serializados en distinto orden.
 */
export function sonPayloadsEquivalentes(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
    return a === b;
  }
  if (Array.isArray(a) !== Array.isArray(b)) {
    return false;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!sonPayloadsEquivalentes(a[i], b[i])) return false;
    }
    return true;
  }

  const objA = a as Record<string, unknown>;
  const objB = b as Record<string, unknown>;
  const keysA = Object.keys(objA).sort();
  const keysB = Object.keys(objB).sort();

  if (keysA.length !== keysB.length) return false;
  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];
    if (key !== keysB[i]) return false;
    if (!sonPayloadsEquivalentes(objA[key], objB[key])) return false;
  }

  return true;
}


