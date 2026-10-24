import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { validarEntorno } from './config/entorno';
import { JwtAuthGuard } from './modulos/plataforma/auth/jwt-auth.guard';
import { RolesGuard } from './modulos/plataforma/auth/roles.guard';
import { CafeinaModule } from './modulos/cafeina/cafeina.module';
import { CircadianoModule } from './modulos/circadiano/circadiano.module';
import { NotificacionesModule } from './modulos/notificaciones/notificaciones.module';
import { IndicadoresModule } from './modulos/indicadores/indicadores.module';
import { OperacionesModule } from './modulos/operaciones/operaciones.module';
import { PlataformaModule } from './modulos/plataforma/plataforma.module';
import { SyncModule } from './modulos/sync/sync.module';
import { TrabajadorModule } from './modulos/trabajador/trabajador.module';
import { PrismaModule } from './prisma/prisma.module';
import { SaludModule } from './salud/salud.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validarEntorno }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    PrismaModule,
    SaludModule,
    PlataformaModule,
    OperacionesModule,
    CircadianoModule,
    CafeinaModule,
    NotificacionesModule,
    TrabajadorModule,
    SyncModule,
    IndicadoresModule,
  ],
  // El orden importa: limite de peticiones, luego token, luego rol.
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}

