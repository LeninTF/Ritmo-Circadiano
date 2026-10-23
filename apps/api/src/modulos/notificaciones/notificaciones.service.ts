import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OnEvent } from '@nestjs/event-emitter';
import * as webPush from 'web-push';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { EncolarNotificacionDto, NotificacionRespuestaDto } from '@circadiano/contracts';

@Injectable()
export class NotificacionesService {
  private readonly logger = new Logger(NotificacionesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const publicKey = this.configService.get<string>('VAPID_PUBLIC_KEY');
    const privateKey = this.configService.get<string>('VAPID_PRIVATE_KEY');
    if (publicKey && privateKey) {
      webPush.setVapidDetails(
        'mailto:soporte@transantecueva.pe',
        publicKey,
        privateKey,
      );
    }
  }

  async guardarSuscripcion(dto: {
    id_usuario: string;
    endpoint: string;
    clave_p256dh: string;
    clave_auth: string;
  }): Promise<void> {
    await this.prisma.suscripcionPush.upsert({
      where: { endpoint: dto.endpoint },
      update: {
        id_usuario: dto.id_usuario,
        clave_p256dh: dto.clave_p256dh,
        clave_auth: dto.clave_auth,
      },
      create: {
        id_usuario: dto.id_usuario,
        endpoint: dto.endpoint,
        clave_p256dh: dto.clave_p256dh,
        clave_auth: dto.clave_auth,
      },
    });
  }

  async marcarAbierta(idNotificacion: number): Promise<NotificacionRespuestaDto> {
    const actualizada = await this.prisma.notificacion.update({
      where: { id_notificacion: idNotificacion },
      data: { abierta: true },
    });
    return {
      id_notificacion: actualizada.id_notificacion,
      id_usuario: actualizada.id_usuario,
      id_plan: actualizada.id_plan,
      tipo: actualizada.tipo,
      programada_para: actualizada.programada_para.toISOString(),
      enviada_en: actualizada.enviada_en ? actualizada.enviada_en.toISOString() : null,
      estado: actualizada.estado,
      abierta: actualizada.abierta,
    };
  }

  async encolar(dto: EncolarNotificacionDto): Promise<NotificacionRespuestaDto> {
    const nueva = await this.prisma.notificacion.create({
      data: {
        id_usuario: dto.id_usuario,
        id_plan: dto.id_plan ?? null,
        tipo: dto.tipo,
        programada_para: new Date(dto.programada_para),
        estado: 'pendiente',
        abierta: false,
      },
    });
    return {
      id_notificacion: nueva.id_notificacion,
      id_usuario: nueva.id_usuario,
      id_plan: nueva.id_plan,
      tipo: nueva.tipo,
      programada_para: nueva.programada_para.toISOString(),
      enviada_en: null,
      estado: nueva.estado,
      abierta: nueva.abierta,
    };
  }

  @OnEvent('circadiano.plan.generado')
  async handlePlanGenerado(payload: { id_usuario: string; id_plan: number; fecha: string }): Promise<void> {
    const inicioDia = new Date(`${payload.fecha}T00:00:00.000Z`);
    const finDia = new Date(`${payload.fecha}T23:59:59.999Z`);

    await this.prisma.notificacion.updateMany({
      where: {
        id_usuario: payload.id_usuario,
        estado: 'pendiente',
        programada_para: { gte: inicioDia, lte: finDia },
      },
      data: { estado: 'cancelada' },
    });

    const tipos = ['luz', 'corte_cafeina', 'relajacion', 'dormir'];
    for (let i = 0; i < tipos.length; i++) {
      const horaProg = new Date(inicioDia.getTime() + (8 + i * 3) * 3600000);
      await this.encolar({
        id_usuario: payload.id_usuario,
        id_plan: payload.id_plan,
        tipo: tipos[i],
        programada_para: horaProg.toISOString(),
      });
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async procesarNotificacionesPendientes(): Promise<void> {
    const ahora = new Date();
    const pendientes = await this.prisma.notificacion.findMany({
      where: {
        estado: 'pendiente',
        programada_para: { lte: ahora },
      },
      take: 50,
    });

    for (const notif of pendientes) {
      try {
        const suscripciones = await this.prisma.suscripcionPush.findMany({
          where: { id_usuario: notif.id_usuario },
        });

        const payloadPush = JSON.stringify({
          title: `Aviso Circadiano (${notif.tipo})`,
          body: `Es hora de tu recordatorio preventivo: ${notif.tipo}`,
          data: { id_notificacion: notif.id_notificacion },
        });

        let enviado = false;
        for (const sub of suscripciones) {
          try {
            await webPush.sendNotification(
              {
                endpoint: sub.endpoint,
                keys: {
                  p256dh: sub.clave_p256dh,
                  auth: sub.clave_auth,
                },
              },
              payloadPush,
            );
            enviado = true;
          } catch (err: unknown) {
            const errorObj = err as { statusCode?: number; message: string };
            if (errorObj.statusCode === 410 || errorObj.statusCode === 404) {
              await this.prisma.suscripcionPush.delete({
                where: { endpoint: sub.endpoint },
              });
            }
            this.logger.error(`Error enviando push a ${sub.endpoint}: ${errorObj.message}`);
          }
        }

        await this.prisma.notificacion.update({
          where: { id_notificacion: notif.id_notificacion },
          data: {
            estado: enviado ? 'enviada' : 'fallida',
            enviada_en: ahora,
          },
        });
      } catch (error: unknown) {
        const errObj = error as { message: string };
        this.logger.error(`Error procesando notificación ${notif.id_notificacion}: ${errObj.message}`);
      }
    }
  }
}
