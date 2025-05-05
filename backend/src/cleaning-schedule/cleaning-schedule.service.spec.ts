import { Test, TestingModule } from '@nestjs/testing';
import { CleaningScheduleService } from './cleaning-schedule.service';

describe('CleaningScheduleService', () => {
  let service: CleaningScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CleaningScheduleService],
    }).compile();

    service = module.get<CleaningScheduleService>(CleaningScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
