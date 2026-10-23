import { Module } from '@nestjs/common';
import { CafeinaController } from './cafeina.controller';
import { BebidasController } from './bebidas.controller';
import { CafeinaService } from './cafeina.service';

@Module({
  controllers: [CafeinaController, BebidasController],
  providers: [CafeinaService],
  exports: [CafeinaService],
})
export class CafeinaModule {}


