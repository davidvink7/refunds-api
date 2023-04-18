import { Controller, Get, Logger } from '@nestjs/common';
import { getManager } from 'typeorm';

@Controller()
export class AppController {
  constructor() {}

  @Get('/health')
  async healthCheck() {
    Logger.log({
      message: `Calling health check.`,
      data: { heathCheck: 'data' },
    });
    await getManager().query(`select 1`);
    return {
      version: '0.0',
      currentTime: new Date(),
      dbCheck: 'OK',
    };
  }
}
