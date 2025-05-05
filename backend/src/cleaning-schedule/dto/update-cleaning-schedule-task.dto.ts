import { ScheduleTaskStatus } from '../entities/cleaning-schedule-task.entity';

export class UpdateCleaningScheduleTaskDto {
  cleaningScheduleId: string;
  taskId: string;
  newStatus: ScheduleTaskStatus;
}
