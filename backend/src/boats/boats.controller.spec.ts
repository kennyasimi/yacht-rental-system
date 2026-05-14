import { Test, TestingModule } from '@nestjs/testing';
import { BoatsController } from './boats.controller';

describe('BoatsController', () => {
  let controller: BoatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoatsController],
    }).compile();

    controller = module.get<BoatsController>(BoatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
