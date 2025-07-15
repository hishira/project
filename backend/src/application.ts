import {
  INestApplication,
  PipeTransform,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { LoggerService } from 'src/common/logger';
import { AppModule } from './app.module';

export class Application {
  private currentApp: INestApplication;
  private loggerService: LoggerService;
  private readonly port: number = 3001;

  async createApp(): Promise<this> {
    this.currentApp = await NestFactory.create(AppModule, {
      bufferLogs: true,
    });
    this.loggerService = this.currentApp.get(LoggerService);
    this.currentApp.useLogger(this.loggerService);
    return this;
  }

  enableCors(
    origin?: string[],
    methods?: string[],
    allowedHeaders?: string[],
    creadentials?: boolean,
  ): this {
    this.currentApp.enableCors({
      origin: origin ?? ['http://localhost:4200', 'http://localhost:4201'],
      methods: methods ?? ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: allowedHeaders ?? ['Content-Type', 'Authorization'],
      credentials: creadentials ?? true,
    });
    return this;
  }

  createGlobalPipes(pipes: PipeTransform<any>[]): this {
    const allPipes = [
      ...pipes,
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        disableErrorMessages: false,
        validationError: { target: false, value: false },
      }),
    ];
    this.currentApp.useGlobalPipes(...allPipes);
    return this;
  }

  async listenOnPort(): Promise<void> {
    await this.currentApp.listen(this.port);
    this.loggerService.logInfo(`Application is running on port ${this.port}`, {
      module: 'Bootstrap',
      port: this.port.toString(),
      environment: process.env.NODE_ENV || 'development',
    });
  }
}
