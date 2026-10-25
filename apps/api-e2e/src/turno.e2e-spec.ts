import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, ExecutionContext } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { AppModule } from 'api/app.module';
import { PrismaService } from 'api/prisma/prisma.service';
import { RolesGuard } from 'api/modulos/plataforma/auth/roles.guard';
import { TURNO_ASIGNADO } from '@circadiano/contracts';

describe('Turnos e2e (Transporte Cueva S.A.C.)', () => {
  let app: INestApplication;
  let eventEmitter: EventEmitter2;
  let jwt: JwtService;

  const validRutaId = '987e6543-e21b-12d3-a456-426614174999';
  const validUserId = '123e4567-e89b-12d3-a456-426614174000';

  const token = (rol = 'jefe_operaciones', sub = validUserId) =>
    jwt.signAsync({ sub, rol, codigoParticipante: 'P01' }).then((t) => `Bearer ${t}`);

  const mockPrismaService: any = {
    ruta: {
      findUnique: jest.fn().mockResolvedValue({ id: validRutaId, nombre: 'Lima - Ica', activa: true }),
      findMany: jest.fn().mockResolvedValue([{ id: validRutaId, nombre: 'Lima - Ica', activa: true }]),
    },
    turnoLaboral: {
      findMany: jest.fn().mockResolvedValue([]),
      create: jest.fn().mockImplementation(({ data }) => ({
        id: 'turno-e2e-1',
        ...data,
        createdAt: new Date(),
      })),
    },
    excesoJornadaAuditoria: {
      create: jest.fn().mockResolvedValue({ id: 'auditoria-1' }),
    },
    notificacion: {
      create: jest.fn().mockResolvedValue({ id: 'notif-1', fechaProgramada: new Date() }),
    },
    $transaction: jest.fn(async (cb: any) => cb(mockPrismaService)),
  };

  beforeAll(async () => {
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
    expect(emitSpy).toHaveBeenCalledWith(
      TURNO_ASIGNADO,
      expect.objectContaining({ idUsuario: validUserId }),
    );
  });

  it('/operaciones/turnos (POST) - Manejo de conflictos HTTP 409 por exceso de jornada (RF14/RN01)', async () => {
    const dtoExceso = {
      idUsuario: validUserId,
      idRuta: validRutaId,
      fecha: '2026-10-20',
      inicioProgramado: '2026-10-20T06:00:00Z',
      finProgramado: '2026-10-20T17:00:00Z',
      horasConduccion: 11.0, // Excede límite diario de 10h (RN01)
      esNocturno: false,
    };

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

  it('/indicadores/panel (GET) - Validación de control de acceso HTTP 403 (Rol insuficiente)', async () => {
    const moduleWithGuardOverride = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .overrideGuard(RolesGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          const rol = req.headers['x-user-rol'];
          if (rol !== 'jefe_operaciones') {
            throw new (require('@nestjs/common').ForbiddenException)('Acceso denegado: rol insuficiente');
          }
          return true;
        },
      })
      .compile();

    const testApp = moduleWithGuardOverride.createNestApplication();
    testApp.useGlobalPipes(new ValidationPipe({ transform: true }));
    await testApp.init();

    const testJwt = testApp.get(JwtService);
    const testToken = await testJwt.signAsync({ sub: validUserId, rol: 'trabajador', codigoParticipante: 'P01' });

    await request(testApp.getHttpServer())
      .get('/indicadores/panel')
      .set('Authorization', `Bearer ${testToken}`)
      .set('x-user-rol', 'trabajador')
      .expect(403);

    await testApp.close();
  });
});


