import { PartialType } from '@nestjs/mapped-types';
import { CreateCleaningScheduleDto } from './create-cleaning-schedule.dto';

export class UpdateCleaningScheduleDto extends PartialType(
  CreateCleaningScheduleDto,
) {}
