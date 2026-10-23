import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AreasController } from './areas/areas.controller';
import { AreasService } from './areas/areas.service';
import { AuditInterceptor } from './auditoria/audit.interceptor';
import { AuthModule } from './auth/auth.module';
import { CuentaController } from './usuarios/cuenta.controller';
import { UsuariosAdminController } from './usuarios/usuarios-admin.controller';
import { UsuariosService } from './usuarios/usuarios.service';

@Module({
  imports: [AuthModule],
  controllers: [AreasController, CuentaController, UsuariosAdminController],
  providers: [
    AreasService,
    UsuariosService,
    { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },
  ],
  exports: [AuthModule],
})
export class PlataformaModule {}
