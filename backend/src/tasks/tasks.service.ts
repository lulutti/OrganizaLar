import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { RoomsService } from 'src/rooms/rooms.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private userService: UsersService,
    private roomsService: RoomsService,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const { userId, roomId, ...rest } = createTaskDto;

    const user = await this.userService.findOne(userId);
    const room = await this.roomsService.findOne(roomId);

    const task = this.tasksRepository.create({
      ...rest,
      user,
      room,
    });

    return await this.tasksRepository.save(task);
  }

  async findAllByUser(
    userId: string,
    filters: {
      roomId?: string;
      assignedId?: string;
      lastTimeDone?: string;
    },
  ): Promise<Task[]> {
    const where = {
      user: { id: userId },
      ...(filters.roomId && { room: { id: filters.roomId } }),
      ...(filters.assignedId && { assignedId: { id: filters.assignedId } }),
      ...(filters.lastTimeDone && {
        last_time_done: new Date(filters.lastTimeDone),
      }),
    };

    return this.tasksRepository.find({
      where,
      relations: ['room'],
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task | null> {
    await this.tasksRepository.update(id, updateTaskDto);
    return await this.tasksRepository.findOneBy({ id });
  }

  async remove(id: string) {
    const task = await this.findOne(id);

    await this.tasksRepository.remove(task);
    return { message: 'Task deleted successfully' };
  }
}
