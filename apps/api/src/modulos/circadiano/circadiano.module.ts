import { Module } from '@nestjs/common';
import { CafeinaModule } from '../cafeina/cafeina.module';
import { OperacionesModule } from '../operaciones/operaciones.module';
import { PlataformaModule } from '../plataforma/plataforma.module';
import { CircadianoController } from './circadiano.controller';
import { CronotipoService } from './cronotipo.service';
import { PlanesService } from './planes.service';
import { TurnoAsignadoListener } from './turno-asignado.listener';
import { UbicacionService } from './ubicacion.service';
import { UsuarioEliminadoCircadianoListener } from './usuario-eliminado.listener';

@Module({
  imports: [OperacionesModule, CafeinaModule, PlataformaModule],
  controllers: [CircadianoController],
  providers: [
    PlanesService,
    UbicacionService,
    CronotipoService,
    TurnoAsignadoListener,
    UsuarioEliminadoCircadianoListener,
  ],
  exports: [PlanesService],
})
export class CircadianoModule {}
