import { ConflictException, Injectable } from '@nestjs/common';
import { COLUMNAS_EXPORTACION, type ColumnaExportacion } from '@circadiano/contracts';
import { assertKAnonymity, generalizarCuasiIdentificador } from '@circadiano/domain';
import { Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

type FilaExportacion = Record<ColumnaExportacion, unknown>;

const K_MINIMO = 5;

// Lista cerrada de la vista (constantes, no datos del usuario). Fecha y hora como texto:
// Prisma convierte DATE/TIME en Date y la hora saldria como 1970-01-01.
const FORMATO: Partial<Record<ColumnaExportacion, string>> = {
  fecha_aplicacion: `to_char(b.fecha_aplicacion, 'YYYY-MM-DD')`,
  hora_ultima_cafeina: `to_char(b.hora_ultima_cafeina, 'HH24:MI')`,
};
const COLUMNAS_SQL = COLUMNAS_EXPORTACION.filter((c) => c !== 'notificaciones_abiertas_pct')
  .map((c) => `${FORMATO[c] ?? `b.${c}`} AS ${c}`)
  .join(', ');

@Injectable()
export class ExportacionService {
  constructor(private readonly prisma: PrismaService) {}

  /** RF16 / CP-16: CSV seudonimizado del pretest + notificaciones abiertas (VI D2). */
  async generarCsv(): Promise<string> {
    const filas = await this.prisma.$queryRaw<FilaExportacion[]>`
      SELECT ${Prisma.raw(COLUMNAS_SQL)}, n.pct AS notificaciones_abiertas_pct
      FROM base_datos_pretest b
      JOIN usuario u ON u.codigo_participante = b.codigo_participante
      LEFT JOIN (
        SELECT id_usuario, round(100.0 * avg(CASE WHEN abierta THEN 1 ELSE 0 END), 1) AS pct
        FROM notificacion
        WHERE enviada_en IS NOT NULL
        GROUP BY id_usuario
      ) n ON n.id_usuario = u.id
      ORDER BY b.codigo_participante`;

    if (!assertKAnonymity(filas.length, K_MINIMO)) {
      throw new ConflictException({
        suficiente: false,
        message: `Se necesitan al menos ${K_MINIMO} participantes con pretest para exportar`,
      });
    }
    // Area o cargo con menos de k personas identificaria al participante.
    const seguras = generalizarCuasiIdentificador(
      generalizarCuasiIdentificador(filas, 'area', 'Otras areas', K_MINIMO),
      'cargo',
      null,
      K_MINIMO,
    );
    return aCsv(seguras);
  }
}

/** Solo columnas de la lista cerrada, en orden; BOM para que Excel lea los acentos. */
export function aCsv(filas: readonly Partial<FilaExportacion>[]): string {
  const lineas = filas.map((fila) => COLUMNAS_EXPORTACION.map((c) => celda(fila[c])).join(','));
  return '﻿' + [COLUMNAS_EXPORTACION.join(','), ...lineas].join('\r\n') + '\r\n';
}

function celda(valor: unknown): string {
  if (valor === null || valor === undefined) return '';
  let texto = valor instanceof Date ? valor.toISOString().slice(0, 10) : String(valor);
  // Evita que Excel ejecute una formula (inyeccion CSV).
  if (/^[=+\-@\t\r]/.test(texto)) texto = `'${texto}`;
  return /[",\r\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
}
