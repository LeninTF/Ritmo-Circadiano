import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IndicadoresService } from './indicadores.service';
import { Roles } from '../plataforma/auth';

@ApiTags('Indicadores (RF13)')
@Controller('indicadores')
export class IndicadoresController {
  constructor(private readonly indicadoresService: IndicadoresService) {}

  @Get('panel')
  // El RolesGuard global (I1) lee este decorador; el usuario esta en req.usuario.
  @Roles('jefe_operaciones')
  @ApiOperation({ summary: 'Obtener panel agregado de indicadores con validación k-anonymity (k >= 5) (RF13)' })
  @ApiQuery({ name: 'desde', required: false, description: 'Fecha de inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'hasta', required: false, description: 'Fecha de fin (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Panel obtenido exitosamente (puede retornar suficiente: false si n < 5).' })
  async obtenerPanel(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    return this.indicadoresService.obtenerPanel(desde, hasta);
  }
}
