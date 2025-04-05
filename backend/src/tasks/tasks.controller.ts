import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from './entities/task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    return await this.tasksService.create(createTaskDto);
  }
  @Get(':userId')
  async findAllByUser(
    @Param('userId') userId: string,
    @Query('roomId') roomId?: string,
    @Query('assignedId') assignedId?: string,
    @Query('status') status?: TaskStatus,
    @Query('lastTimeDone') lastTimeDone?: string,
  ) {
    return await this.tasksService.findAllByUser(userId, {
      roomId,
      assignedId,
      status,
      lastTimeDone,
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return await this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.tasksService.remove(id);
  }
}
