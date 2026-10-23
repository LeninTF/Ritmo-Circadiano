import { Body, Controller, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotificacionesService } from './notificaciones.service';
import {
  CrearSuscripcionPushDto,
  NotificacionRespuestaDto,
  type UsuarioJwtPayload,
} from '@circadiano/contracts';
import { UsuarioActual } from '../plataforma/auth';

@ApiTags('notificaciones')
@Controller()
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

  @Patch('notificaciones/:id/abierta')
  @ApiOperation({ summary: 'Marcar notificación como abierta (Indicador D2)' })
  @ApiResponse({ status: 200, description: 'Notificación marcada como abierta.' })
  async marcarAbierta(
    @UsuarioActual() usuario: UsuarioJwtPayload,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<NotificacionRespuestaDto> {
    return this.notificacionesService.marcarAbierta(id, usuario.sub);
  }
}
