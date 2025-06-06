import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCleaningScheduleDto } from './dto/create-cleaning-schedule.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import {
  CleaningSchedule,
  CleaningScheduleStatus,
} from './entities/cleaning-schedule.entity';
import { Task } from 'src/tasks/entities/task.entity';
import {
  CleaningScheduleTask,
  ScheduleTaskStatus,
} from 'src/cleaning-schedule/entities/cleaning-schedule-task.entity';
import { UsersService } from 'src/users/users.service';
import { UpdateCleaningScheduleTaskDto } from './dto/update-cleaning-schedule-task.dto';

@Injectable()
export class CleaningScheduleService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(CleaningSchedule)
    private readonly cleaningScheduleRepository: Repository<CleaningSchedule>,
    @InjectRepository(CleaningScheduleTask)
    private readonly cleaningScheduleTaskRepository: Repository<CleaningScheduleTask>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private userService: UsersService,
  ) {}

  async createCleaningSchedule(dto: CreateCleaningScheduleDto) {
    const { title, taskIds, userId } = dto;
    const user = await this.userService.findOne(userId);
    const schedule = this.cleaningScheduleRepository.create({
      user,
      title,
      status: CleaningScheduleStatus.IN_PROGRESS,
    });

    const savedSchedule = await this.cleaningScheduleRepository.save(schedule);

    const tasks = await this.taskRepository.findBy({
      id: In(taskIds),
    });

    const scheduleTasks = tasks.map((task) =>
      this.cleaningScheduleTaskRepository.create({
        cleaningSchedule: savedSchedule,
        task: task,
        status: ScheduleTaskStatus.PENDING,
      }),
    );

    await this.cleaningScheduleTaskRepository.save(scheduleTasks);

    return {
      schedule: savedSchedule,
    };
  }

  async findActiveByUser(userId: string): Promise<CleaningSchedule | null> {
    return this.cleaningScheduleRepository.findOne({
      where: {
        user: { id: userId },
        status: CleaningScheduleStatus.IN_PROGRESS,
      },
      relations: ['tasks', 'tasks.task', 'tasks.task.room'],
    });
  }

  async updateStatus(
    id: string,
    status: CleaningScheduleStatus,
  ): Promise<CleaningSchedule> {
    const schedule = await this.cleaningScheduleRepository.findOneBy({ id });

    if (!schedule) {
      throw new NotFoundException('Cleaning schedule not found');
    }

    schedule.status = status;
    return this.cleaningScheduleRepository.save(schedule);
  }
  async updateTask(
    cleaningScheduleId: string,
    taskId: string,
    dto: UpdateCleaningScheduleTaskDto,
  ): Promise<CleaningSchedule> {
    return await this.dataSource.transaction(async (manager) => {
      const cleaningSchedule = await manager.findOne(CleaningSchedule, {
        where: {
          id: cleaningScheduleId,
          status: CleaningScheduleStatus.IN_PROGRESS,
        },
        relations: ['tasks', 'tasks.task'],
      });

      if (!cleaningSchedule) {
        throw new Error('Cleaning Schedule not found or not in progress');
      }

      const scheduleTask = cleaningSchedule.tasks.find((t) => t.id === taskId);
      if (!scheduleTask) {
        throw new Error('Task not found in this schedule');
      }

      if (dto.newStatus) {
        scheduleTask.status = dto.newStatus;

        if (dto.newStatus === ScheduleTaskStatus.DONE) {
          const now = new Date();
          scheduleTask.completedAt = now;
          scheduleTask.task.last_time_done = now;
          await manager.save(Task, scheduleTask.task);
        }
      }

      const { assignedToContributorId, assignedToAdminUserId } = dto;

      scheduleTask.assignedContributorId = assignedToContributorId;
      scheduleTask.assignedUserId = assignedToAdminUserId;
      await manager.save(CleaningScheduleTask, scheduleTask);

      const allTasksDone = cleaningSchedule.tasks.every((task) =>
        task.id === scheduleTask.id
          ? dto.newStatus === ScheduleTaskStatus.DONE
          : task.status === ScheduleTaskStatus.DONE,
      );

      if (allTasksDone) {
        cleaningSchedule.status = CleaningScheduleStatus.DONE;
        await manager.save(CleaningSchedule, cleaningSchedule);
      }

      return cleaningSchedule;
    });
  }
}
