import { randomBytes } from 'node:crypto';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { PrismaService } from 'api/prisma/prisma.service';
import { DiarioService } from 'api/modulos/trabajador/diario.service';
import {
  TURNO_ASIGNADO,
  type Rol,
  type TurnoAsignadoEvento,
  type UsuarioJwtPayload,
} from '@circadiano/contracts';

type MockDelegado = Record<string, jest.Mock>;

describe('Turnos e2e (Transporte Cueva S.A.C.)', () => {
  let app: INestApplication;
  let eventEmitter: EventEmitter2;
  let jwt: JwtService;

  const validRutaId = '987e6543-e21b-12d3-a456-426614174999';
  const validUserId = '123e4567-e89b-12d3-a456-426614174000';

  const dtoExceso = {
    idUsuario: validUserId,
    idRuta: validRutaId,
    fecha: '2026-10-20',
    inicioProgramado: '2026-10-20T06:00:00Z',
    finProgramado: '2026-10-20T17:00:00Z',
    horasConduccion: 11.0, // Excede límite diario de 10h (RN01)
    esNocturno: false,
  };

  const token = (rol: Rol = 'jefe_operaciones', sub = validUserId) =>
    jwt
      .signAsync({ sub, rol, codigoParticipante: 'P01' } satisfies UsuarioJwtPayload)
      .then((t) => `Bearer ${t}`);

  const excesoJornadaAuditoria: MockDelegado = {
    create: jest.fn().mockResolvedValue({ id: 'auditoria-1' }),
  };
  const auditLog: MockDelegado = {
    create: jest.fn().mockResolvedValue({ id: 'audit-1' }),
  };

  const mockPrismaService: Record<string, MockDelegado | jest.Mock> = {
    ruta: {
      findUnique: jest.fn().mockResolvedValue({ id: validRutaId, nombre: 'Lima - Ica', activa: true }),
      findMany: jest.fn().mockResolvedValue([{ id: validRutaId, nombre: 'Lima - Ica', activa: true }]),
    },
    turnoLaboral: {
      findMany: jest.fn().mockResolvedValue([]),
      create: jest.fn().mockImplementation(({ data }: { data: Record<string, unknown> }) => ({
        id: 'turno-e2e-1',
        ...data,
        createdAt: new Date(),
      })),
    },
    excesoJornadaAuditoria,
    auditLog,
    notificacion: {
      create: jest.fn().mockImplementation(({ data }) => ({
        id_notificacion: 1, ...data, enviada_en: null,
      })),
    },
    $transaction: jest.fn(async (cb: (tx: Record<string, unknown>) => Promise<unknown>) => cb(mockPrismaService)),
  };

  beforeAll(async () => {
    // Secreto efímero por corrida: no depende del .env local ni queda fijo en el repo.
    // Se fija antes de importar AppModule porque ConfigModule valida el entorno al cargarse.
    process.env.JWT_SECRET = randomBytes(32).toString('hex');
    process.env.DATABASE_URL = 'postgresql://e2e-sin-bd';
    const { AppModule } = await import('api/app.module');

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    eventEmitter = app.get(EventEmitter2);
    jwt = app.get(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('AppModule inicializa y resuelve DiarioService sin duplicar proveedores', () => {
    expect(app.get(DiarioService)).toBeInstanceOf(DiarioService);
  });

  it('/operaciones/rutas (GET) - listar rutas activas', async () => {
    const response = await request(app.getHttpServer())
      .get('/operaciones/rutas')
      .set('Authorization', await token('jefe_operaciones'))
      .expect(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: validRutaId, nombre: 'Lima - Ica' }),
      ]),
    );
  });

  it('/operaciones/turnos (POST) - Flujo completo exitoso y emisión de evento TurnoAsignado', async () => {
    const emitSpy = jest.spyOn(eventEmitter, 'emit');

    const dto = {
      idUsuario: validUserId,
      idRuta: validRutaId,
      fecha: '2026-10-20',
      inicioProgramado: '2026-10-20T08:00:00Z',
      finProgramado: '2026-10-20T12:00:00Z',
      horasConduccion: 4.0,
      esNocturno: false,
    };

    const response = await request(app.getHttpServer())
      .post('/operaciones/turnos')
      .set('Authorization', await token('jefe_operaciones'))
      .send(dto)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.horasConduccion).toEqual(4.0);
    expect(emitSpy).toHaveBeenCalledWith(TURNO_ASIGNADO, {
      idTurno: 'turno-e2e-1',
      idUsuario: validUserId,
      fecha: '2026-10-20',
    } satisfies TurnoAsignadoEvento);
  });

  it('/operaciones/turnos (POST) - Manejo de conflictos HTTP 409 por exceso de jornada (RF14/RN01)', async () => {
    const response = await request(app.getHttpServer())
      .post('/operaciones/turnos')
      .set('Authorization', await token('jefe_operaciones'))
      .send(dtoExceso)
      .expect(409);

    expect(response.body).toMatchObject({
      superaDiario: true,
      requiereConfirmacion: true,
    });
  });

  it('/operaciones/turnos (POST) - exceso confirmado → 201, exceso_jornada_auditoria y audit_log (RF14/RN01)', async () => {
    // El forzado se pide con confirmarExceso + motivoExceso en el body (CrearTurnoDto), no con ?forzar=true.
    await request(app.getHttpServer())
      .post('/operaciones/turnos')
      .set('Authorization', await token('jefe_operaciones'))
      .send({ ...dtoExceso, confirmarExceso: true, motivoExceso: 'Relevo ausente' })
      .expect(201);

    expect(excesoJornadaAuditoria.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        idTurno: 'turno-e2e-1',
        idUsuario: validUserId,
        motivoExceso: 'Relevo ausente',
      }),
    });
    expect(auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ accion: 'turno_forzado' }),
    });
  });

  it('/operaciones/turnos?forzar=true (POST) - 201, exceso_jornada_auditoria y audit_log (RN01)', async () => {
    await request(app.getHttpServer())
      .post('/operaciones/turnos?forzar=true')
      .set('Authorization', await token('jefe_operaciones'))
      .send({ ...dtoExceso, motivoExceso: 'Relevo ausente' })
      .expect(201);

    expect(excesoJornadaAuditoria.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ idTurno: 'turno-e2e-1', motivoExceso: 'Relevo ausente' }),
    });
    expect(auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ accion: 'turno_forzado', recurso: 'POST /operaciones/turnos' }),
    });
  });

  it('/operaciones/turnos?forzar=true (POST) - sin motivoExceso → 400 y sin auditoría (RF14)', async () => {
    await request(app.getHttpServer())
      .post('/operaciones/turnos?forzar=true')
      .set('Authorization', await token('jefe_operaciones'))
      .send(dtoExceso)
      .expect(400);

    expect(excesoJornadaAuditoria.create).not.toHaveBeenCalled();
    expect(auditLog.create).not.toHaveBeenCalled();
  });

  it('/indicadores/panel (GET) - rol trabajador → 403', async () => {
    await request(app.getHttpServer())
      .get('/indicadores/panel')
      .set('Authorization', await token('trabajador'))
      .expect(403);
  });

  it('/indicadores/panel (GET) - sin token → 401', async () => {
    await request(app.getHttpServer()).get('/indicadores/panel').expect(401);
  });
});
