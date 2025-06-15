import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  constructor(private readonly loggingService: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, body, query } = req;

    this.loggingService.log(
      `Incoming request: ${method} ${originalUrl} - query: ${JSON.stringify(query)} - body: ${JSON.stringify(body)}`,
      'RequestLogging',
    );

    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      this.loggingService.log(
        `Response: ${method} ${originalUrl} - status: ${res.statusCode} - duration: ${duration}ms`,
        'RequestLogging',
      );
    });

    next();
  }
}
