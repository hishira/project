import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DatabaseExceptionFilter.name);

  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    this.logger.error('Database error occurred', {
      error: exception.message,
      query: exception.query,
      parameters: exception.parameters,
    });

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    // Handle specific SQLite constraint errors
    if (exception.message.includes('UNIQUE constraint failed')) {
      status = HttpStatus.CONFLICT;

      if (exception.message.includes('user.email')) {
        message = 'Email address is already in use';
      } else {
        message = 'A record with this data already exists';
      }
    } else if (exception.message.includes('NOT NULL constraint failed')) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Required field cannot be empty';
    } else if (exception.message.includes('FOREIGN KEY constraint failed')) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Invalid reference to related data';
    }

    response.status(status).json({
      statusCode: status,
      message,
      error: this.getErrorName(status),
      timestamp: new Date().toISOString(),
    });
  }

  private getErrorName(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'Bad Request';
      case HttpStatus.CONFLICT:
        return 'Conflict';
      default:
        return 'Internal Server Error';
    }
  }
}
