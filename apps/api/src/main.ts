import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const config = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    })
  );

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: config.get<string>('FRONTEND_URL', '*'),
    credentials: true
  });

  const port = config.get<number>('PORT', 4000);
  await app.listen(port);
}

void bootstrap();
