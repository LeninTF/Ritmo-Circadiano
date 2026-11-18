import * as argon2 from 'argon2';
import type { PrismaClient } from '../../apps/api/src/generated/prisma/client';

type Rol = 'trabajador' | 'jefe_operaciones' | 'despachador' | 'administrador';

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

interface CuentaDemo {
  codigo: string;
  rol: Rol;
  area: string;
  cargo: string;
  correo: string;
}

/**
 * Cuentas para probar roles y permisos en local y staging. Los codigos no usan
 * el prefijo P para no mover la numeracion de los participantes reales
 * (P01-P17) ni mezclarse con el estudio. Cinco trabajadores alcanzan k = 5
 * (RN10), asi el panel y la exportacion devuelven agregados.
 */
const CUENTAS_DEMO: CuentaDemo[] = [
  {
    codigo: 'J01',
    rol: 'jefe_operaciones',
    area: 'Operaciones – Jefe de Operaciones',
    cargo: 'Jefe de operaciones',
    correo: 'jefe@circadiano.local',
  },
  {
    codigo: 'D01',
    rol: 'despachador',
    area: 'Operaciones – Despachador',
    cargo: 'Despachador',
    correo: 'despachador@circadiano.local',
  },
  ...[1, 2, 3, 4, 5].map(
    (n): CuentaDemo => ({
      codigo: `T0${n}`,
      rol: 'trabajador',
      area: 'Operaciones – Conductores',
      cargo: 'Conductor',
      correo: `trabajador${n}@circadiano.local`,
    }),
  ),
];

/** Idempotente: reejecutar no duplica ni pisa datos existentes. */
export async function sembrarIdentidad(prisma: PrismaClient): Promise<void> {
  for (const nombre of AREAS) {
    await prisma.area.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
  }

  await sembrarAdministrador(prisma);
  await sembrarCuentasDemo(prisma);
}

async function sembrarAdministrador(prisma: PrismaClient): Promise<void> {
  const clave = process.env['SEED_ADMIN_CLAVE'];
  if (!clave) {
    process.stderr.write(
      'SEED_ADMIN_CLAVE vacia: se omite el administrador de desarrollo.\n',
    );
    return;
  }
  const correo = process.env['SEED_ADMIN_CORREO'] ?? 'admin@circadiano.local';
  await crearSiNoExiste(prisma, {
    codigo: CODIGO_ADMIN,
    rol: 'administrador',
    area: 'Gerencia General',
    cargo: 'Administrador del sistema',
    correo,
  }, clave);
}

async function sembrarCuentasDemo(prisma: PrismaClient): Promise<void> {
  const clave = process.env['SEED_DEMO_CLAVE'];
  if (!clave) {
    process.stderr.write(
      'SEED_DEMO_CLAVE vacia: se omiten las cuentas de prueba por rol.\n',
    );
    return;
  }
  // Nunca en produccion: serian cuentas con clave compartida.
  if (process.env['NODE_ENV'] === 'production') {
    process.stderr.write(
      'NODE_ENV=production: se omiten las cuentas de prueba por rol.\n',
    );
    return;
  }
  for (const cuenta of CUENTAS_DEMO) {
    await crearSiNoExiste(prisma, cuenta, clave);
  }
}

async function crearSiNoExiste(
  prisma: PrismaClient,
  cuenta: CuentaDemo,
  clave: string,
): Promise<void> {
  const area = await prisma.area.findUniqueOrThrow({
    where: { nombre: cuenta.area },
  });
  await prisma.usuario.upsert({
    where: { correo: cuenta.correo },
    update: {},
    create: {
      idArea: area.id,
      codigoParticipante: cuenta.codigo,
      rol: cuenta.rol,
      cargo: cuenta.cargo,
      correo: cuenta.correo,
      hashClave: await argon2.hash(clave, { type: argon2.argon2id }),
      // RN11: sin consentimiento el trabajador no podria registrar datos.
      consentimiento: true,
      fechaConsentimiento: new Date(),
    },
  });
}
