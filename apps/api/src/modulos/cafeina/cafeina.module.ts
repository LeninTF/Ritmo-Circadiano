import { Module } from '@nestjs/common';
import { PlataformaModule } from '../plataforma/plataforma.module';
import { CafeinaController } from './cafeina.controller';
import { BebidasController } from './bebidas.controller';
import { CafeinaService } from './cafeina.service';
import { IngestaSyncHandler } from './ingesta-sync.handler';
import { UsuarioEliminadoCafeinaListener } from './usuario-eliminado.listener';

@Module({
  imports: [PlataformaModule],
  controllers: [CafeinaController, BebidasController],
  providers: [CafeinaService, IngestaSyncHandler, UsuarioEliminadoCafeinaListener],
  exports: [CafeinaService, IngestaSyncHandler],
})
export class CafeinaModule {}


