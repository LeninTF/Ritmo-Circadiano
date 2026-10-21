import * as argon2 from 'argon2';
import type { PrismaClient } from '../../apps/api/src/generated/prisma/client';

// Tabla 5 del informe. La sede aun no esta definida.
const AREAS = [
  'Gerencia General',
  'Administración y Finanzas',
  'Operaciones – Jefe de Operaciones',
  'Operaciones – Conductores',
  'Operaciones – Despachador',
  'Comercial y Atención al Cliente',
];

const CODIGO_ADMIN = 'A01';

/** Idempotente: reejecutar no duplica ni pisa datos existentes. */
export async function sembrarIdentidad(prisma: PrismaClient): Promise<void> {
  for (const nombre of AREAS) {
    await prisma.area.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
  }

  const clave = process.env['SEED_ADMIN_CLAVE'];
  if (!clave) {
    process.stderr.write(
      'SEED_ADMIN_CLAVE vacia: se omite el administrador de desarrollo.\n',
    );
    return;
  }
  const correo = process.env['SEED_ADMIN_CORREO'] ?? 'admin@circadiano.local';
  const area = await prisma.area.findUniqueOrThrow({
    where: { nombre: 'Gerencia General' },
  });
  await prisma.usuario.upsert({
    where: { correo },
    update: {},
    create: {
      idArea: area.id,
      codigoParticipante: CODIGO_ADMIN,
      rol: 'administrador',
      correo,
      hashClave: await argon2.hash(clave, { type: argon2.argon2id }),
    },
  });
}
