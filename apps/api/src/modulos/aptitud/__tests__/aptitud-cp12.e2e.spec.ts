import { randomBytes, randomUUID } from 'node:crypto';
import { NotFoundException, ValidationPipe, type INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { ColorSemaforo, Rol } from '@circadiano/contracts';
import { PrismaService } from '../../../prisma/prisma.service';
import { OperacionesService } from '../../operaciones/operaciones.service';
import { JwtAuthGuard, RolesGuard } from '../../plataforma/auth';
import { AptitudController } from '../aptitud.controller';
import { AptitudService } from '../aptitud.service';

interface FilaAptitud {
  idUsuario: string;
  idTurno: string;
  fechaHora: Date;
  horasSueno24h: number;
  somnolencia: number;
  color: ColorSemaforo;
  compartido: boolean;
}

interface ConsultaAptitud {
  where: { fechaHora: { gte: Date; lt: Date }; usuario?: { codigoParticipante: string } };
  distinct: (keyof FilaAptitud)[];
}

const USUARIOS: Record<string, string> = { 'u-1': 'P01', 'u-2': 'P02', 'u-3': 'P03' };

/**
 * Doble en memoria de PrismaService: solo las consultas que usa AptitudService.
 * Respeta orderBy fechaHora desc + distinct como PostgreSQL.
 */
function crearPrismaEnMemoria() {
  const aptitudes: FilaAptitud[] = [];
  return {
    aptitudes,
    registroSueno: { findMany: async () => [] },
    aptitudPresalida: {
      create: async ({ data }: { data: FilaAptitud }) => {
        aptitudes.push({ ...data });
        return data;
      },
      findMany: async ({ where, distinct }: ConsultaAptitud) => {
        const vistos = new Set<string>();
        return [...aptitudes]
          .filter((a) => a.fechaHora >= where.fechaHora.gte && a.fechaHora < where.fechaHora.lt)
          .filter((a) => !where.usuario || USUARIOS[a.idUsuario] === where.usuario.codigoParticipante)
          .sort((a, b) => b.fechaHora.getTime() - a.fechaHora.getTime())
          .filter((a) => {
            const clave = distinct.map((campo) => String(a[campo])).join('|');
            return !vistos.has(clave) && Boolean(vistos.add(clave));
          })
          .map((a) => ({
            color: a.color,
            compartido: a.compartido,
            usuario: { codigoParticipante: USUARIOS[a.idUsuario] },
          }));
      },
    },
  };
}

describe('CP-12 /aptitud con servicio y guards reales (RF12, RN09, RN10)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  const prisma = crearPrismaEnMemoria();
  const turnos = new Map<string, string>(); // idTurno -> idUsuario

  const token = (rol: Rol, sub = 'u-1') =>
    jwt.signAsync({ sub, rol, codigoParticipante: USUARIOS[sub] ?? 'P99' }).then((t) => `Bearer ${t}`);
  const evaluar = (fila: Partial<FilaAptitud> & Pick<FilaAptitud, 'idUsuario' | 'idTurno' | 'fechaHora'>) =>
    prisma.aptitudes.push({ horasSueno24h: 8, somnolencia: 2, color: 'verde', compartido: true, ...fila });
  const despacho = async (query: string) =>
    request(app.getHttpServer())
      .get(`/aptitud/despacho?${query}`)
      .set('Authorization', await token('despachador', 'u-9'))
      .expect(200);

  beforeAll(async () => {
    const modulo = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: randomBytes(32).toString('hex') })],
      controllers: [AptitudController],
      providers: [
        AptitudService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: OperacionesService,
          useValue: {
            obtenerTurnoPorId: async (id: string) => {
              const idUsuario = turnos.get(id);
              if (!idUsuario) throw new NotFoundException();
              return { id, idUsuario };
            },
          },
        },
        { provide: APP_GUARD, useClass: JwtAuthGuard },
        { provide: APP_GUARD, useClass: RolesGuard },
      ],
    }).compile();
    app = modulo.createNestApplication();
    // Igual que main.ts.
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
    jwt = app.get(JwtService);
  });

  beforeEach(() => {
    prisma.aptitudes.length = 0;
    turnos.clear();
  });

  afterAll(() => app.close());

  it('trabajador → 403 en /despacho', async () => {
    await request(app.getHttpServer())
      .get('/aptitud/despacho?fecha=2026-10-24')
      .set('Authorization', await token('trabajador'))
      .expect(403);
  });

  it('el despachador no ve evaluaciones con compartido=false', async () => {
    evaluar({ idUsuario: 'u-1', idTurno: 't-1', fechaHora: new Date('2026-10-24T12:00:00Z'), compartido: false });
    evaluar({ idUsuario: 'u-2', idTurno: 't-2', fechaHora: new Date('2026-10-24T12:00:00Z'), color: 'rojo' });

    expect((await despacho('fecha=2026-10-24')).body).toEqual({ evaluaciones: [{ codigo: 'P02', color: 'rojo' }] });
    expect((await despacho('fecha=2026-10-24&codigo=P01')).body).toEqual({ evaluaciones: [] });
  });

  it('con compartido=true ve exactamente {codigo, color}, sin horas ni somnolencia', async () => {
    turnos.set('5b1c1c55-0000-4000-8000-000000000001', 'u-1');
    const post = await request(app.getHttpServer())
      .post('/aptitud/5b1c1c55-0000-4000-8000-000000000001')
      .set('Authorization', await token('trabajador', 'u-1'))
      .send({ somnolencia: 4, compartido: true })
      .expect(201);
    // El trabajador sí recibe el detalle de su propio resultado.
    expect(post.body).toEqual({ color: 'rojo', horasSueno24h: 0, motivos: ['sueno_insuficiente', 'somnolencia_elevada'] });

    // Día de hoy en hora de Lima (UTC-5, sin horario de verano).
    const hoyLima = new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const { body } = await despacho(`fecha=${hoyLima}`);
    expect(body).toEqual({ evaluaciones: [{ codigo: 'P01', color: 'rojo' }] });
    expect(Object.keys(body.evaluaciones[0]).sort()).toEqual(['codigo', 'color']);
    expect(JSON.stringify(body)).not.toMatch(/horas|somnolencia|compartido|idUsuario/);
  });

  it('devuelve solo la última evaluación de cada turno', async () => {
    // t-1: la última (rojo) reemplaza a la anterior (verde).
    evaluar({ idUsuario: 'u-1', idTurno: 't-1', fechaHora: new Date('2026-10-24T10:00:00Z'), color: 'verde' });
    evaluar({ idUsuario: 'u-1', idTurno: 't-1', fechaHora: new Date('2026-10-24T11:00:00Z'), color: 'rojo' });
    // t-3 del mismo usuario es otra fila.
    evaluar({ idUsuario: 'u-1', idTurno: 't-3', fechaHora: new Date('2026-10-24T20:00:00Z'), color: 'ambar' });
    // t-2: la última no se compartió, así que no aparece aunque la anterior sí.
    evaluar({ idUsuario: 'u-2', idTurno: 't-2', fechaHora: new Date('2026-10-24T10:00:00Z') });
    evaluar({ idUsuario: 'u-2', idTurno: 't-2', fechaHora: new Date('2026-10-24T11:00:00Z'), compartido: false });

    const { body } = await despacho('fecha=2026-10-24');
    expect(body.evaluaciones).toEqual([
      { codigo: 'P01', color: 'ambar' },
      { codigo: 'P01', color: 'rojo' },
    ]);
  });

  it('el día se corta en hora de Lima (00:00–24:00 UTC-5)', async () => {
    // 2026-10-24 23:59 en Lima = 2026-10-25T04:59Z → pertenece al 24.
    evaluar({ idUsuario: 'u-1', idTurno: 't-1', fechaHora: new Date('2026-10-25T04:59:00Z') });
    // 2026-10-25 00:00 en Lima = 2026-10-25T05:00Z → ya es el 25.
    evaluar({ idUsuario: 'u-2', idTurno: 't-2', fechaHora: new Date('2026-10-25T05:00:00Z') });
    // 2026-10-23 23:59 en Lima = 2026-10-24T04:59Z → es del 23 aunque en UTC sea el 24.
    evaluar({ idUsuario: 'u-3', idTurno: 't-3', fechaHora: new Date('2026-10-24T04:59:00Z') });

    expect((await despacho('fecha=2026-10-24')).body.evaluaciones).toEqual([{ codigo: 'P01', color: 'verde' }]);
    expect((await despacho('fecha=2026-10-25')).body.evaluaciones).toEqual([{ codigo: 'P02', color: 'verde' }]);
  });

  it('codigo vacío o fecha inválida → 400', async () => {
    const auth = await token('despachador', 'u-9');
    await request(app.getHttpServer()).get('/aptitud/despacho?fecha=2026-10-24&codigo=').set('Authorization', auth).expect(400);
    await request(app.getHttpServer()).get('/aptitud/despacho?fecha=24-10-2026').set('Authorization', auth).expect(400);
  });

  it('turno de otro trabajador → 403 sin guardar', async () => {
    const idTurno = randomUUID();
    turnos.set(idTurno, 'u-2');
    await request(app.getHttpServer())
      .post(`/aptitud/${idTurno}`)
      .set('Authorization', await token('trabajador', 'u-1'))
      .send({ somnolencia: 2 })
      .expect(403);
    expect(prisma.aptitudes).toHaveLength(0);
  });
});
