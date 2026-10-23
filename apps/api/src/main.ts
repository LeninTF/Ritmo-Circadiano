import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function arrancar(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  // Un origen distinto a CORS_ORIGIN no recibe cabeceras CORS (el navegador lo bloquea).
  const origenPermitido = process.env['CORS_ORIGIN'];
  app.enableCors({
    origin: (
      origen: string | undefined,
      devolver: (err: Error | null, permitir?: boolean) => void,
    ) => devolver(null, origen === undefined || origen === origenPermitido),
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Cerrado por defecto: en produccion /docs y /docs-json revelarian toda la superficie de la API.
  if (process.env['SWAGGER_HABILITADO'] === 'true') {
    const documento = new DocumentBuilder()
      .setTitle('Gestor Web Circadiano')
      .setVersion('0.0.0')
      .addBearerAuth()
      .build();
    SwaggerModule.setup(
      'docs',
      app,
      SwaggerModule.createDocument(app, documento),
    );
  }

  const puerto = Number(process.env['PORT'] ?? 3000);
  await app.listen(puerto);
  Logger.log(`API escuchando en el puerto ${puerto}`, 'Arranque');
}

void arrancar();
