import * as winston from 'winston';
import LokiTransport from 'winston-loki';
import TransportStream from 'winston-transport';

export class Transporters {
  static readonly fileFormat = winston.format.combine(
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
  static readonly isTerminal = process.stdout.isTTY === true;

  static ConsoleTransport(): TransportStream {
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
    return new winston.transports.Console({
      format: consoleFormat,
    });
  }
  static CombinedTransporter(): TransportStream {
    return new winston.transports.DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format: this.fileFormat,
    });
  }

  static ErrorsOnlyTransport(): TransportStream {
    return new winston.transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '30d',
      format: this.fileFormat,
    });
  }

  static HttpAccessTransport(): TransportStream {
    return new winston.transports.DailyRotateFile({
      filename: 'logs/access-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'http',
      maxSize: '20m',
      maxFiles: '14d',
      format: this.fileFormat,
    });
  }

  static LokiTransport(): TransportStream {
    return new LokiTransport({
      host: 'http://192.168.1.42:3100',
      json: true,
      format: winston.format.json(),
      replaceTimestamp: true,
      onConnectionError: (err) => console.error(err),
    });
  }
}
