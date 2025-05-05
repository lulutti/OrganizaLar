import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { CleaningScheduleService } from './cleaning-schedule.service';
import { CreateCleaningScheduleDto } from './dto/create-cleaning-schedule.dto';

import { IsEnum } from 'class-validator';
import {
  CleaningSchedule,
  CleaningScheduleStatus,
} from './entities/cleaning-schedule.entity';
import { UpdateCleaningScheduleTaskDto } from './dto/update-cleaning-schedule-task.dto';

export class UpdateCleaningScheduleStatusDto {
  @IsEnum(CleaningScheduleStatus)
  status: CleaningScheduleStatus;
}

@Controller('cleaning-schedule')
export class CleaningScheduleController {
  constructor(
    private readonly cleaningScheduleService: CleaningScheduleService,
  ) {}

  @Post()
  async create(@Body() createCleaningScheduleDto: CreateCleaningScheduleDto) {
    return await this.cleaningScheduleService.createCleaningSchedule(
      createCleaningScheduleDto,
    );
  }

  @Get('active/:userId')
  async findActiveByUser(@Param('userId') userId: string) {
    return await this.cleaningScheduleService.findActiveByUser(userId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateCleaningScheduleStatusDto,
  ) {
    return this.cleaningScheduleService.updateStatus(id, dto.status);
  }

  @Patch('/tasks')
  async updateTaskStatus(
    @Body() updateCleaningScheduleTaskDto: UpdateCleaningScheduleTaskDto,
  ): Promise<CleaningSchedule> {
    const { cleaningScheduleId, taskId, newStatus } =
      updateCleaningScheduleTaskDto;
    return await this.cleaningScheduleService.updateTaskStatus(
      cleaningScheduleId,
      taskId,
      newStatus,
    );
  }
}
