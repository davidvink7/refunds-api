import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getConfig } from './config';
import { RefundsController } from './controllers/refunds/refunds.controller';
import { RefundsService } from './services/refunds/refunds.service';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AuthMiddleware } from './middlewares/auth.middleware';
import Refund from './entities/refund.entity';
import RefundTransactions from './entities/transaction.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      ...getConfig().databaseConfig,
      entities: [Refund, RefundTransactions],
      namingStrategy: new SnakeNamingStrategy(),
    }),
  ],
  controllers: [AppController, RefundsController],
  providers: [AppService, RefundsService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({
        path: '/health',
        method: RequestMethod.ALL,
      })
      .forRoutes('*');
  }
}
