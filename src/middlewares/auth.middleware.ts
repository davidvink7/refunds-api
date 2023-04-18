import { HttpStatus, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { getConfig, ServerConfig } from 'src/config';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  config: ServerConfig;

  constructor() {
    this.config = getConfig();
  }

  use(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.get('x-api-key');
    Logger.log({
      message: 'Checking Authorization for Request',
      data: {
        baseUrl: req.baseUrl,
        method: req.method,
        headers: req.headers,
      },
    });
    if (!apiKey || apiKey !== this.config.xApiKey) {
      Logger.error('Invalid API Key sent on request');
      return res.status(HttpStatus.FORBIDDEN).send();
    }
    Logger.log({ message: 'Validated API Key header' });
    next();
  }
}
