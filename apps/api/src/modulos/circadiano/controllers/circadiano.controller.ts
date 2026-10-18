import { Controller, Get, Param, Post, Body, NotFoundException } from '@nestjs/common';
import { GenerarPlanDto, PlanDiarioDto } from '@circadiano/contracts';
import { CircadianoService } from '../services/circadiano.service';

@Controller('planes')
export class CircadianoController {
  constructor(private readonly circadianoService: CircadianoService) {}

  @Post('generar')
  async generarPlan(@Body() dto: GenerarPlanDto): Promise<PlanDiarioDto> {
    return this.circadianoService.generarPlanParaUsuario(dto);
  }

  @Get('usuario/:idUsuario/fecha/:fecha')
  async obtenerPlan(@Param('idUsuario') idUsuario: string, @Param('fecha') fecha: string): Promise<PlanDiarioDto> {
    const plan = await this.circadianoService.obtenerPlan(idUsuario, fecha);
    if (!plan) {
      throw new NotFoundException(`Plan no encontrado para ${idUsuario} en ${fecha}`);
    }
    return plan;
  }
}
