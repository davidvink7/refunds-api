import { Test, TestingModule } from '@nestjs/testing';
import { RefundsService } from 'src/services/refunds/refunds.service';
import { RefundsController } from './refunds.controller';

describe('RefundsController', () => {
  let controller: RefundsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RefundsController],
      providers: [RefundsService],
    }).compile();

    controller = module.get<RefundsController>(RefundsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
