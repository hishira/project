import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { LoggerService } from './common/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Set custom logger
  const logger = app.get(LoggerService);
  app.useLogger(logger);

  // Enable CORS for frontend communication
  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:4201'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  
  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
      validationError: { target: false, value: false },
    }),
  );

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  
  logger.logInfo(`Application is running on port ${port}`, {
    module: 'Bootstrap',
    port: port.toString(),
    environment: process.env.NODE_ENV || 'development'
  });
}
void bootstrap();
