import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../apps/api/src/generated/prisma/client';

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

    // Rutas iniciales de Transporte Cueva S.A.C. (Lima, Ica, Nasca, Lomas, Bella Unión, Acarí)
    const rutasIniciales = [
      {
        origen: 'Lima',
        destino: 'Ica',
        distanciaKm: 303.50,
        duracionEstimadaH: 4.50,
        activa: true,
      },
      {
        origen: 'Ica',
        destino: 'Nasca',
        distanciaKm: 145.20,
        duracionEstimadaH: 2.25,
        activa: true,
      },
      {
        origen: 'Nasca',
        destino: 'Lomas',
        distanciaKm: 90.00,
        duracionEstimadaH: 1.50,
        activa: true,
      },
      {
        origen: 'Lomas',
        destino: 'Bella Unión',
        distanciaKm: 45.00,
        duracionEstimadaH: 0.75,
        activa: true,
      },
      {
        origen: 'Bella Unión',
        destino: 'Acarí',
        distanciaKm: 25.00,
        duracionEstimadaH: 0.50,
        activa: true,
      },
      {
        origen: 'Lima',
        destino: 'Nasca',
        distanciaKm: 448.70,
        duracionEstimadaH: 7.00,
        activa: true,
      },
    ];

    for (const r of rutasIniciales) {
      const existente = await prisma.ruta.findFirst({
        where: { origen: r.origen, destino: r.destino },
      });
      if (!existente) {
        await prisma.ruta.create({
          data: r,
        });
      }
    }

    process.stdout.write('Seed ejecutado exitosamente con parámetros y rutas de Transporte Cueva S.A.C.\n');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  process.stderr.write(`Seed fallido: ${String(error)}\n`);
  process.exit(1);
});

