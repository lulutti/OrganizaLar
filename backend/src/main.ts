import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { connectionSource } from './config/typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await connectionSource.initialize();

  await connectionSource.runMigrations();

  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
  });

  await app.listen(process.env.PORT ?? 3020);
}
bootstrap();
