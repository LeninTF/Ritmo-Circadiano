import { ConflictException } from '@nestjs/common';
import type { PrismaService } from '../../../prisma/prisma.service';
import { aCsv, ExportacionService } from './exportacion.service';

const PII = /correo|hash_clave|nombre|@|\$argon2/i;

function filas(n: number, extra: object = {}) {
  return Array.from({ length: n }, (_, i) => ({
    codigo_participante: `P${String(i + 1).padStart(2, '0')}`,
    area: 'Operaciones',
    cargo: 'Conductor',
    tipo_turno_predominante: 'nocturno',
    fecha_aplicacion: new Date('2026-10-20T00:00:00Z'),
    psqi_global: 7,
    ess_total: 9,
    notificaciones_abiertas_pct: '50.0',
    // Columnas que la consulta nunca debe devolver; si aparecieran, el CSV no las expone.
    correo: `p${i}@empresa.pe`,
    hash_clave: '$argon2id$v=19$falso',
    nombre: 'Juan Perez',
    ...extra,
  }));
}

describe('ExportacionService (RF16, CP-16)', () => {
  const queryRaw = jest.fn();
  const servicio = new ExportacionService({ $queryRaw: queryRaw } as unknown as PrismaService);

  it('CP-16: el CSV no contiene correo, hash_clave ni nombres', async () => {
    queryRaw.mockResolvedValueOnce(filas(5));
    const csv = await servicio.generarCsv();
    expect(csv).not.toMatch(PII);
    const [cabecera, primera] = csv.replace('﻿', '').split('\r\n');
    expect(cabecera.split(',')[0]).toBe('codigo_participante');
    expect(primera.startsWith('P01,Operaciones,Conductor,nocturno,2026-10-20,')).toBe(true);
  });

  it('con menos de 5 participantes responde 409 { suficiente: false } (RN10)', async () => {
    queryRaw.mockResolvedValueOnce(filas(4));
    await expect(servicio.generarCsv()).rejects.toBeInstanceOf(ConflictException);
  });

  it('generaliza area y cargo compartidos por menos de 5', async () => {
    const datos = [...filas(5), ...filas(1, { codigo_participante: 'P06', area: 'Finanzas', cargo: 'Contador' })];
    queryRaw.mockResolvedValueOnce(datos);
    const ultima = (await servicio.generarCsv()).trim().split('\r\n').at(-1) ?? '';
    expect(ultima.startsWith('P06,Otras areas,,')).toBe(true);
    expect(ultima).not.toMatch(/Finanzas|Contador/);
  });

  it('escapa comillas y neutraliza formulas de Excel', () => {
    const csv = aCsv([{ codigo_participante: '=HYPERLINK("x")', area: 'A, B' }]);
    expect(csv).toContain(`"'=HYPERLINK(""x"")","A, B"`);
  });
});
