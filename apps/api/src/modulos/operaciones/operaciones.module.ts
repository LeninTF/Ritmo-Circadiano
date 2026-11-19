import { Module } from '@nestjs/common';
import { OperacionesController } from './operaciones.controller';
import { OperacionesService } from './operaciones.service';
import { UsuarioEliminadoOperacionesListener } from './usuario-eliminado.listener';
import { PrismaModule } from '../../prisma/prisma.module';
import { PlataformaModule } from '../plataforma/plataforma.module';

@Module({
  imports: [PrismaModule, PlataformaModule],
  controllers: [OperacionesController],
  providers: [OperacionesService, UsuarioEliminadoOperacionesListener],
  exports: [OperacionesService],
})
export class OperacionesModule {}

