import { Injectable, Scope } from '@nestjs/common';
import {
  createWriteStream,
  existsSync,
  mkdirSync,
  renameSync,
  statSync,
  WriteStream,
} from 'fs';
import * as path from 'path';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  VERBOSE = 'verbose',
}

@Injectable({ scope: Scope.TRANSIENT })
export class LoggingService {
  private logLevel: LogLevel = LogLevel.INFO;
  private logDir: string;
  private mainLogPath: string;
  private errorLogPath: string;
  private maxFileSize: number = 1024 * 1024;
  private logStream: WriteStream;
  private errorStream: WriteStream;

  constructor() {
    const logLevel = (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO;
    const maxSize = parseInt(process.env.LOG_MAX_FILE_SIZE_KB || '1024', 10);

    this.configure(logLevel, maxSize);

    // 👇 Обработчики ошибок
    process.on('uncaughtException', this.handleUncaughtException.bind(this));
    process.on('unhandledRejection', this.handleUnhandledRejection.bind(this));
  }

  configure(level: LogLevel, maxFileSizeKB: number) {
    this.logLevel = level;
    this.maxFileSize = maxFileSizeKB * 1024;
    this.logDir = process.env.LOG_DIR || path.resolve(process.cwd(), 'logs');
    this.mainLogPath = path.join(this.logDir, 'application.log');
    this.errorLogPath = path.join(
      this.logDir,
      process.env.ERROR_LOG_FILE || 'error.log',
    );

    if (!existsSync(this.logDir)) {
      mkdirSync(this.logDir, { recursive: true });
    }

    this.logStream = createWriteStream(this.mainLogPath, { flags: 'a' });
    this.errorStream = createWriteStream(this.errorLogPath, { flags: 'a' });
  }

  error(message: string, trace?: string, context?: string) {
    this.writeLog(
      LogLevel.ERROR,
      `${message}${trace ? `\n${trace}` : ''}`,
      context,
    );
  }

  warn(message: string, context?: string) {
    this.writeLog(LogLevel.WARN, message, context);
  }

  log(message: string, context?: string) {
    this.writeLog(LogLevel.INFO, message, context);
  }

  debug(message: string, context?: string) {
    this.writeLog(LogLevel.DEBUG, message, context);
  }

  verbose(message: string, context?: string) {
    this.writeLog(LogLevel.VERBOSE, message, context);
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [
      LogLevel.ERROR,
      LogLevel.WARN,
      LogLevel.INFO,
      LogLevel.DEBUG,
      LogLevel.VERBOSE,
    ];
    const currentIdx = levels.indexOf(this.logLevel);
    const levelIdx = levels.indexOf(level);
    return levelIdx <= currentIdx;
  }

  private rotateLogFileIfNeeded(filePath: string) {
    try {
      if (existsSync(filePath)) {
        const stats = statSync(filePath);
        if (stats.size >= this.maxFileSize) {
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const newFileName = `${filePath}.${timestamp}`;
          renameSync(filePath, newFileName);
        }
      }
    } catch (err) {
      this.writeToStdout(`[LOGGING ERROR] Failed to rotate: ${err.message}`);
    }
  }

  private writeLog(level: LogLevel, message: string, context?: string) {
    if (!this.shouldLog(level)) return;

    const logEntry = `[${new Date().toISOString()}] [${level.toUpperCase()}]${context ? ` [${context}]` : ''} ${message}\n`;

    this.writeToStdout(logEntry);

    this.rotateLogFileIfNeeded(this.mainLogPath);
    this.logStream.write(logEntry);

    if (level === LogLevel.ERROR) {
      this.rotateLogFileIfNeeded(this.errorLogPath);
      this.errorStream.write(logEntry);
    }
  }

  private writeToStdout(message: string) {
    try {
      process.stdout.write(message);
    } catch (e) {}
  }

  private handleUncaughtException(error: Error) {
    this.error(
      `Uncaught Exception: ${error.message}`,
      error.stack,
      'uncaughtException',
    );
  }

  private handleUnhandledRejection(reason: any, promise: Promise<any>) {
    this.error(
      `Unhandled Rejection at: ${promise}, reason: ${JSON.stringify(reason)}`,
      undefined,
      'unhandledRejection',
    );
  }
}
