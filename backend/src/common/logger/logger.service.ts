import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import LokiTransport from 'winston-loki';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  HTTP = 'http',
  VERBOSE = 'verbose',
  DEBUG = 'debug',
  SILLY = 'silly',
}

export interface LogContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  ip?: string;
  userAgent?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  responseTime?: number;
  module?: string;
  action?: string;
  [key: string]: any;
}

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: winston.Logger;
  private readonly isDevelopment: boolean;
  private readonly isTerminal: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV !== 'production';
    this.isTerminal = process.stdout.isTTY === true;
    this.logger = this.createLogger();
  }

  private createLogger(): winston.Logger {
    // Enhanced color scheme for different log levels
    const colors = {
      error: 'red',
      warn: 'yellow',
      info: 'cyan',
      http: 'green',
      verbose: 'blue',
      debug: 'magenta',
      silly: 'gray',
    };

    // Add colors to winston
    winston.addColors(colors);

    // File format (no colors)
    const fileFormat = winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.errors({ stack: true }),
      winston.format.json(),
      winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
        const contextStr = meta.module ? ` [${meta.module}]` : '';
        const metaStr = Object.keys(meta).length
          ? ` ${JSON.stringify(meta)}`
          : '';
        const stackStr = stack ? `\n${stack}` : '';
        return `${timestamp} [${level.toUpperCase()}]${contextStr} ${message}${metaStr}${stackStr}`;
      }),
    );

    // Console format (with colors if terminal)
    const consoleFormat = winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.errors({ stack: true }),
      // Only colorize if we're in a terminal
      ...(this.isTerminal ? [winston.format.colorize({ all: true })] : []),
      winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
        const contextStr = meta.module ? ` [${meta.module}]` : '';

        // Create a more readable meta string for console
        const filteredMeta = { ...meta };
        delete filteredMeta.module;
        delete filteredMeta.timestamp;

        const metaStr = Object.keys(filteredMeta).length
          ? ` ${JSON.stringify(filteredMeta, null, 2).replace(/\n/g, ' ').replace(/\s+/g, ' ')}`
          : '';

        const stackStr = stack ? `\n${stack}` : '';

        if (this.isTerminal) {
          // Enhanced formatting for terminal with emojis
          const levelEmoji =
            {
              error: '❌',
              warn: '⚠️ ',
              info: '💡',
              http: '🌐',
              verbose: '📝',
              debug: '🔍',
              silly: '🤪',
            }[level] || '📄';

          return `${timestamp} ${levelEmoji} [${level.toUpperCase()}]${contextStr} ${message}${metaStr}${stackStr}`;
        } else {
          return `${timestamp} [${level.toUpperCase()}]${contextStr} ${message}${metaStr}${stackStr}`;
        }
      }),
    );

    const transports: winston.transport[] = [];

    // Console transport for development
    if (this.isDevelopment) {
      transports.push(
        new winston.transports.Console({
          format: consoleFormat,
        }),
      );
    }

    // File transports
    transports.push(
      // Combined logs (all levels)
      new winston.transports.DailyRotateFile({
        filename: 'logs/combined-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '14d',
        format: fileFormat,
      }),

      // Error logs only
      new winston.transports.DailyRotateFile({
        filename: 'logs/error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        maxSize: '20m',
        maxFiles: '30d',
        format: fileFormat,
      }),

      // HTTP access logs
      new winston.transports.DailyRotateFile({
        filename: 'logs/access-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        level: 'http',
        maxSize: '20m',
        maxFiles: '14d',
        format: fileFormat,
      }),

      new LokiTransport({
        host: 'http://192.168.1.42:3100',
        json: true,
        format: winston.format.json(),
        replaceTimestamp: true,
        onConnectionError: (err) => console.error(err),
      }),
    );

    return winston.createLogger({
      level: this.isDevelopment ? 'debug' : 'info',
      transports,
      exitOnError: false,
    });
  }

  /**
   * Log with context information
   */
  private logWithContext(
    level: LogLevel,
    message: string,
    context?: LogContext | string,
  ) {
    const contextData =
      typeof context === 'string' ? { module: context } : context;
    this.logger.log(level, message, contextData);
  }

  /**
   * NestJS Logger interface methods
   */
  log(message: any, context?: string) {
    this.logWithContext(LogLevel.INFO, message, context);
  }

  error(message: any, stack?: string, context?: string) {
    this.logWithContext(LogLevel.ERROR, message, {
      module: context,
      stack: stack || (message instanceof Error ? message.stack : undefined),
    });
  }

  warn(message: any, context?: string) {
    this.logWithContext(LogLevel.WARN, message, context);
  }

  debug(message: any, context?: string) {
    this.logWithContext(LogLevel.DEBUG, message, context);
  }

  verbose(message: any, context?: string) {
    this.logWithContext(LogLevel.VERBOSE, message, context);
  }

  /**
   * Enhanced logging methods with context
   */
  logInfo(message: string, context?: LogContext) {
    this.logWithContext(LogLevel.INFO, message, context);
  }

  logError(message: string, error?: Error, context?: LogContext) {
    const errorContext = {
      ...context,
      stack: error?.stack,
      errorMessage: error?.message,
      errorName: error?.name,
    };
    this.logWithContext(LogLevel.ERROR, message, errorContext);
  }

  logWarn(message: string, context?: LogContext) {
    this.logWithContext(LogLevel.WARN, message, context);
  }

  logDebug(message: string, context?: LogContext) {
    this.logWithContext(LogLevel.DEBUG, message, context);
  }

  /**
   * HTTP request logging
   */
  logHttpRequest(context: LogContext) {
    const message = `${context.method} ${context.url} - ${context.statusCode} - ${context.responseTime}ms`;
    this.logWithContext(LogLevel.HTTP, message, context);
  }

  /**
   * User action logging
   */
  logUserAction(action: string, userId: string, context?: LogContext) {
    const actionContext = {
      ...context,
      userId,
      action,
      module: 'UserAction',
    };
    this.logWithContext(
      LogLevel.INFO,
      `User ${userId} performed action: ${action}`,
      actionContext,
    );
  }

  /**
   * Authentication logging
   */
  logAuth(
    event: 'login' | 'logout' | 'register' | 'failed_login',
    userId?: string,
    context?: LogContext,
  ) {
    const authContext = {
      ...context,
      userId,
      module: 'Auth',
      event,
    };
    this.logWithContext(
      LogLevel.INFO,
      `Authentication event: ${event}`,
      authContext,
    );
  }

  /**
   * Database operation logging
   */
  logDatabase(operation: string, table?: string, context?: LogContext) {
    const dbContext = {
      ...context,
      module: 'Database',
      operation,
      table,
    };
    this.logWithContext(
      LogLevel.DEBUG,
      `Database operation: ${operation}`,
      dbContext,
    );
  }

  /**
   * Security event logging
   */
  logSecurity(
    event: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    context?: LogContext,
  ) {
    const securityContext = {
      ...context,
      module: 'Security',
      event,
      severity,
    };
    const level =
      severity === 'critical' || severity === 'high'
        ? LogLevel.ERROR
        : LogLevel.WARN;
    this.logWithContext(level, `Security event: ${event}`, securityContext);
  }

  /**
   * Performance logging
   */
  logPerformance(operation: string, duration: number, context?: LogContext) {
    const perfContext = {
      ...context,
      module: 'Performance',
      operation,
      duration,
    };
    this.logWithContext(
      LogLevel.INFO,
      `Performance: ${operation} took ${duration}ms`,
      perfContext,
    );
  }

  /**
   * Business logic logging
   */
  logBusiness(event: string, context?: LogContext) {
    const businessContext = {
      ...context,
      module: 'Business',
      event,
    };
    this.logWithContext(
      LogLevel.INFO,
      `Business event: ${event}`,
      businessContext,
    );
  }
}
