import { Test, TestingModule } from '@nestjs/testing';
import { BoatsService } from './boats.service';

describe('BoatsService', () => {
  let service: BoatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoatsService],
    }).compile();

    service = module.get<BoatsService>(BoatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
