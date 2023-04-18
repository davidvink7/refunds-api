/* eslint-disable @typescript-eslint/no-unused-vars */
import { tracer } from 'dd-trace';
import * as formats from 'dd-trace/ext/formats';
import { LoggerService } from '@nestjs/common';
import { Logger, InternalCodes } from 'nofraud-nodemodules-common';
import { getConfig } from 'src/config';

export class LoggerWrapper implements LoggerService {
  constructor() {
    new Logger(getConfig().logging);
  }

  traceInject(message: any, level: string): void {
    const span = tracer.scope().active();
    const time = new Date().toISOString();
    const record = { time, level, message };
    if (span) {
      tracer.inject(span.context(), formats.LOG, record);
    }
  }

  log(message: any, ...optionalParams: any[]) {
    this.traceInject(message, 'info');
    Logger.info(InternalCodes.NF1000, message);
  }

  error(message: any, err: any, ...optionalParams: any[]) {
    this.traceInject(message, 'error');
    Logger.error(InternalCodes.NF5000, message, err);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.traceInject(message, 'warn');
    Logger.warn(InternalCodes.NF1000, message);
  }

  debug?(message: any, ...optionalParams: any[]) {
    Logger.debug(InternalCodes.NF1000, message);
  }

  verbose?(message: any, ...optionalParams: any[]) {
    Logger.info(InternalCodes.NF1000, message);
  }
}
