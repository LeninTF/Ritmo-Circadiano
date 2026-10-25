import { Module } from '@nestjs/common';
import { CafeinaController } from './cafeina.controller';
import { BebidasController } from './bebidas.controller';
import { CafeinaService } from './cafeina.service';
import { UsuarioEliminadoCafeinaListener } from './usuario-eliminado.listener';

@Module({
  controllers: [CafeinaController, BebidasController],
  providers: [CafeinaService, UsuarioEliminadoCafeinaListener],
  exports: [CafeinaService],
})
export class CafeinaModule {}


