import 'dd-trace/init';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { LoggerWrapper } from './common/logger';
import { getConfig } from './config';

async function bootstrap() {
  const config = getConfig();
  const loggerWrapper = new LoggerWrapper();
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
    logger: loggerWrapper,
  });
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  await app.listen(config.port);
  loggerWrapper.log({
    message: 'Listening on port: ' + config.port,
  });
}
bootstrap();
