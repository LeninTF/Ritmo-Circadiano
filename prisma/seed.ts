import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../apps/api/src/generated/prisma/client';
import { sembrarIdentidad } from './seeds/identidad';

async function main(): Promise<void> {
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env['DATABASE_URL'] }),
  });
  try {
    // Idempotente: reejecutar no duplica ni pisa un valor ajustado a mano.
    await prisma.parametroSistema.upsert({
      where: { clave: 'umbral_cafeina_mg' },
      update: {},
      create: { clave: 'umbral_cafeina_mg', valor: '50' },
    });
    await sembrarIdentidad(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  process.stderr.write(`Seed fallido: ${String(error)}\n`);
  process.exit(1);
});
