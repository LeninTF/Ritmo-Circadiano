import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AreasController } from './areas/areas.controller';
import { AreasService } from './areas/areas.service';
import { AuditInterceptor } from './auditoria/audit.interceptor';
import { AuthModule } from './auth/auth.module';
import { ExportacionController } from './exportacion/exportacion.controller';
import { ExportacionService } from './exportacion/exportacion.service';

@Module({
  imports: [AuthModule],
  controllers: [AreasController, ExportacionController],
  providers: [
    AreasService,
    ExportacionService,
    { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },
  ],
  exports: [AuthModule],
})
export class PlataformaModule {}
