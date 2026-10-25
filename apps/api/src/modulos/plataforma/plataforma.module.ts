import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AreasController } from './areas/areas.controller';
import { AreasService } from './areas/areas.service';
import { AuditInterceptor } from './auditoria/audit.interceptor';
import { AuthModule } from './auth/auth.module';
import { ExportacionController } from './exportacion/exportacion.controller';
import { ExportacionService } from './exportacion/exportacion.service';
import { ParametrosController } from './parametros/parametros.controller';
import { ParametrosService } from './parametros/parametros.service';
import { CuentaController } from './usuarios/cuenta.controller';
import { UsuariosAdminController } from './usuarios/usuarios-admin.controller';
import { UsuariosService } from './usuarios/usuarios.service';

@Module({
  imports: [AuthModule],
  controllers: [
    AreasController,
    CuentaController,
    UsuariosAdminController,
    ParametrosController,
    ExportacionController,
  ],
  providers: [
    AreasService,
    UsuariosService,
    ParametrosService,
    ExportacionService,
    { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },
  ],
  exports: [AuthModule, ParametrosService],
})
export class PlataformaModule {}
