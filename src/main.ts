import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ── Swagger UI ─────────────────────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('🎬 Film Rental API')
    .setDescription('API de gestion de locations de films avec notifications planifiées')
    .setVersion('1.0')
    .addTag('customers', 'Gestion des clients')
    .addTag('films', 'Catalogue de films')
    .addTag('rentals', 'Gestion des locations')
    .addTag('scheduler', 'Tâches planifiées & notifications')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // ───────────────────────────────────────────────────────────────────────

  await app.listen(3000);
  console.log('🎬 Film Rental API  → http://localhost:3000');
  console.log('📖 Swagger UI      → http://localhost:3000/api');
  console.log('📄 Swagger JSON    → http://localhost:3000/api-json');
}

bootstrap();