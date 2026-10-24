import { resolverConflictoLww, sonPayloadsEquivalentes } from './lww-policy';

describe('Política LWW y Resolución de Conflictos (Requisitos 1..9, 17, 20)', () => {
  const basePayload = { horasSueno: 7.5, latenciaMin: 15, calidadPercibida: 4 };

  // 1. Primer registro recibido
  it('1. Acepta el primer registro recibido cuando no existe registro previo', () => {
    const res = resolverConflictoLww({
      existing: null,
      incoming: {
        clientId: 'client-1',
        updatedAt: '2026-10-21T06:00:00.000Z',
        payload: basePayload,
      },
    });
    expect(res.action).toBe('ACCEPT_NEW');
    expect(res.reason).toContain('No existe registro previo');
  });

  // 2. Actualización posterior más reciente
  it('2. Acepta actualización posterior más reciente (LWW)', () => {
    const res = resolverConflictoLww({
      existing: {
        id: 'db-row-1',
        clientId: 'client-1',
        updatedAt: '2026-10-21T06:00:00.000Z',
        payload: basePayload,
      },
      incoming: {
        clientId: 'client-2',
        updatedAt: '2026-10-21T07:30:00.000Z',
        payload: { ...basePayload, horasSueno: 8.0 },
      },
    });
    expect(res.action).toBe('ACCEPT_NEW');
    expect(res.reason).toContain('estrictamente posterior');
  });

  // 3. Actualización anterior rechazada o ignorada
  it('3. Rechaza o ignora una actualización con timestamp anterior (obsoleta)', () => {
    const res = resolverConflictoLww({
      existing: {
        id: 'db-row-1',
        clientId: 'client-2',
        updatedAt: '2026-10-21T07:30:00.000Z',
        payload: basePayload,
      },
      incoming: {
        clientId: 'client-1',
        updatedAt: '2026-10-21T05:00:00.000Z',
        payload: { ...basePayload, horasSueno: 6.0 },
      },
    });
    expect(res.action).toBe('IGNORE_OBSOLETE');
    expect(res.reason).toContain('obsolescencia');
  });

  // 4. Timestamps iguales
  it('4. Resuelve de forma determinista ante timestamps exactamente iguales', () => {
    const ts = '2026-10-21T08:00:00.000Z';
    const resAceptado = resolverConflictoLww({
      existing: {
        clientId: 'client-001',
        updatedAt: ts,
        payload: basePayload,
      },
      incoming: {
        clientId: 'client-002',
        updatedAt: ts,
        payload: basePayload,
      },
    });
    expect(resAceptado.action).toBe('TIE_RESOLVED_ACCEPTED');

    const resIgnorado = resolverConflictoLww({
      existing: {
        clientId: 'client-002',
        updatedAt: ts,
        payload: basePayload,
      },
      incoming: {
        clientId: 'client-001',
        updatedAt: ts,
        payload: basePayload,
      },
    });
    expect(resIgnorado.action).toBe('TIE_RESOLVED_IGNORED');
  });

  // 5. Timestamps inválidos
  it('5. Maneja de forma controlada timestamps inválidos o corruptos', () => {
    const res1 = resolverConflictoLww({
      existing: null,
      incoming: {
        clientId: 'client-1',
        updatedAt: 'fecha-no-parseable',
        payload: basePayload,
      },
    });
    expect(res1.action).toBe('ERROR_INVALID_TIMESTAMP');
  });

  // 6. Horarios con distintas zonas
  it('6. Normaliza horarios expresados con diferentes zonas horarias correctamente', () => {
    const utcIso = '2026-10-21T08:00:00.000Z';
    const limaIsoPosterior = '2026-10-21T03:05:00.000-05:00';
    const limaIsoAnterior = '2026-10-21T02:55:00.000-05:00';

    const resPosterior = resolverConflictoLww({
      existing: {
        clientId: 'client-1',
        updatedAt: utcIso,
        payload: basePayload,
      },
      incoming: {
        clientId: 'client-2',
        updatedAt: limaIsoPosterior,
        payload: basePayload,
      },
    });
    expect(resPosterior.action).toBe('ACCEPT_NEW');

    const resAnterior = resolverConflictoLww({
      existing: {
        clientId: 'client-1',
        updatedAt: utcIso,
        payload: basePayload,
      },
      incoming: {
        clientId: 'client-3',
        updatedAt: limaIsoAnterior,
        payload: basePayload,
      },
    });
    expect(resAnterior.action).toBe('IGNORE_OBSOLETE');
  });

  // Auditoría 1 y 3: Idempotencia estricta, comparación canónica y efectos ejecutados máximo una vez
  it('7. Detecta reintento idempotente exacto (IDEMPOTENT_DUPLICATE_NOOP) y previene escrituras duplicadas', () => {
    const ts = '2026-10-21T09:00:00.000Z';
    const res = resolverConflictoLww({
      existing: {
        clientId: 'client-abc',
        updatedAt: ts,
        payload: { b: 2, a: 1 },
      },
      incoming: {
        clientId: 'client-abc',
        updatedAt: ts,
        payload: { a: 1, b: 2 }, // orden de claves diferente, mismo contenido semántico
      },
    });

    expect(res.action).toBe('IDEMPOTENT_DUPLICATE_NOOP');

    // Simular el consumidor con un espía/mock para verificar que la escritura se ejecuta máximo una vez
    const writeSpy = jest.fn();
    const handleOperation = (action: string, payload: unknown) => {
      if (action === 'ACCEPT_NEW' || action === 'TIE_RESOLVED_ACCEPTED') {
        writeSpy(payload);
      }
      // IDEMPOTENT_DUPLICATE_NOOP no ejecuta escritura (no-op)
    };

    handleOperation(res.action, basePayload);
    expect(writeSpy).not.toHaveBeenCalled();
  });

  // Auditoría 3: Comparación canónica con objetos equivalentes de diferente orden de propiedades
  it('8. Compara estructuras JSON canónicamente ignorando el orden de sus propiedades', () => {
    const obj1 = { z: 10, a: { y: 20, x: 5 }, m: [1, 2, 3] };
    const obj2 = { a: { x: 5, y: 20 }, m: [1, 2, 3], z: 10 };
    const objDiferente = { z: 10, a: { y: 21, x: 5 }, m: [1, 2, 3] };

    expect(sonPayloadsEquivalentes(obj1, obj2)).toBe(true);
    expect(sonPayloadsEquivalentes(obj1, objDiferente)).toBe(false);
  });
});


