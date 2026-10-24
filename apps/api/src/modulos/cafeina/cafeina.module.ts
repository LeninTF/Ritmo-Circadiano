import { Module } from '@nestjs/common';
import { PlataformaModule } from '../plataforma/plataforma.module';
import { CafeinaController } from './cafeina.controller';
import { BebidasController } from './bebidas.controller';
import { CafeinaService } from './cafeina.service';
import { UsuarioEliminadoCafeinaListener } from './usuario-eliminado.listener';

@Module({
  imports: [PlataformaModule],
  controllers: [CafeinaController, BebidasController],
  providers: [CafeinaService, UsuarioEliminadoCafeinaListener],
  exports: [CafeinaService],
})
export class CafeinaModule {}


