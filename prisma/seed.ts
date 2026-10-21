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

    const bebidasBase = [
      { nombre: 'Café pasado', cafeina_mg: '95.0', volumen_ml: 240 },
      { nombre: 'Espresso', cafeina_mg: '63.0', volumen_ml: 30 },
      { nombre: 'Té', cafeina_mg: '47.0', volumen_ml: 240 },
      { nombre: 'Gaseosa cola', cafeina_mg: '34.0', volumen_ml: 355 },
      { nombre: 'Bebida energizante', cafeina_mg: '80.0', volumen_ml: 250 },
    ];

    for (const bebida of bebidasBase) {
      await prisma.bebida.upsert({
        where: { nombre: bebida.nombre },
        update: {},
        create: bebida,
      });
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  process.stderr.write(`Seed fallido: ${String(error)}\n`);
  process.exit(1);
});
