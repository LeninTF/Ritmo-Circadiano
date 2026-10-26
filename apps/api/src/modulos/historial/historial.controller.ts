import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { HistorialService } from './historial.service';
import { 
  HistorialRespuestaDto, 
  type UsuarioJwtPayload 
} from '@circadiano/contracts';
import { Roles, UsuarioActual } from '../plataforma/auth';

@ApiTags('Historial Personal')
@Controller('historial')
@ApiBearerAuth()
@Roles('trabajador')
@ApiResponse({ status: 401, description: 'Token ausente, inválido o vencido.' })
@ApiResponse({ status: 403, description: 'Solo el trabajador puede consultar su propio historial.' })
export class HistorialController {
  constructor(private readonly historialService: HistorialService) {}

  @Get('me')
  @ApiOperation({ summary: 'Obtener tendencia de sueño, cafeína y adherencia (7, 14 o 30 días)' })
  @ApiQuery({ name: 'dias', required: true, enum: [7, 14, 30], example: 7 })
  @ApiResponse({ status: 200, description: 'Serie cronológica de métricas diarias obtenida.' })
  @ApiResponse({ status: 400, description: 'Parámetro dias inválido.' })
  async getMe(
    @Query('dias') diasStr: string,
    @UsuarioActual() usuario: UsuarioJwtPayload,
  ): Promise<HistorialRespuestaDto> {
    // Validación estricta: solo aceptar las cadenas exactas '7', '14' o '30'
    if (!['7', '14', '30'].includes(diasStr)) {
      throw new BadRequestException('El parámetro dias debe ser exactamente 7, 14 o 30.');
    }
    const dias = parseInt(diasStr, 10);
    return this.historialService.getHistorial(usuario.sub, dias);
  }
}