import { Test, TestingModule } from '@nestjs/testing';
import { CleaningScheduleController } from './cleaning-schedule.controller';
import { CleaningScheduleService } from './cleaning-schedule.service';

describe('CleaningScheduleController', () => {
  let controller: CleaningScheduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CleaningScheduleController],
      providers: [CleaningScheduleService],
    }).compile();

    controller = module.get<CleaningScheduleController>(
      CleaningScheduleController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
