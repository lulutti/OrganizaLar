import { Module } from '@nestjs/common';
import { CleaningScheduleService } from './cleaning-schedule.service';
import { CleaningScheduleController } from './cleaning-schedule.controller';
import { CleaningSchedule } from './entities/cleaning-schedule.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CleaningScheduleTask } from './entities/cleaning-schedule-task.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CleaningSchedule, CleaningScheduleTask, Task]),
    UsersModule,
  ],
  controllers: [CleaningScheduleController],
  providers: [CleaningScheduleService],
})
export class CleaningScheduleModule {}
