import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotificacionesService } from './notificaciones.service';
import {
  CrearSuscripcionPushDto,
  NotificacionRespuestaDto,
  type UsuarioJwtPayload,
} from '@circadiano/contracts';
import { UsuarioActual } from '../plataforma/auth';

@ApiTags('notificaciones')
@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  @Post('push/suscripciones')
  @ApiOperation({ summary: 'Guardar o actualizar suscripción Web Push VAPID' })
  @ApiResponse({ status: 201, description: 'Suscripción guardada correctamente.' })
  async guardarSuscripcion(
    @UsuarioActual() usuario: UsuarioJwtPayload,
    @Body() dto: CrearSuscripcionPushDto,
  ): Promise<void> {
    // RNF04: la suscripcion queda a nombre del usuario del token.
    return this.notificacionesService.guardarSuscripcion({ ...dto, id_usuario: usuario.sub });
  }

  @Get('push/clave-publica')
  @ApiOperation({ summary: 'Obtener la clave VAPID pública para la PWA' })
  @ApiResponse({ status: 200, description: 'Clave VAPID pública obtenida correctamente.' })
  async obtenerClavePublica(): Promise<{ clavePublica: string }> {
    return this.notificacionesService.obtenerClavePublica();
  }
  @Patch(':id/abierta')
  @ApiOperation({ summary: 'Marcar una notificación como abierta' })
  @ApiResponse({ status: 200, description: 'Notificación marcada como abierta correctamente.' })
  @ApiResponse({ status: 404, description: 'Notificación no encontrada.' })
  async marcarAbierta(
    @UsuarioActual() usuario: UsuarioJwtPayload,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<NotificacionRespuestaDto> {
    return this.notificacionesService.marcarAbierta(id, usuario.sub);
  }

}
