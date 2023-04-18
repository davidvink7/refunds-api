import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmMySQLTestingModule } from 'src/common/tests/typeormTestingModule';

describe('AppController', () => {
  let appController: AppController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [...TypeOrmMySQLTestingModule()],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = module.get<AppController>(AppController);
  });

  afterEach(async () => {
    module.close();
  });

  describe('root', () => {
    it('should return correct info on health check', async () => {
      const response = await appController.healthCheck();
      expect(response).toHaveProperty('currentTime');
      expect(response.dbCheck).toEqual('OK');
    });
  });
});
