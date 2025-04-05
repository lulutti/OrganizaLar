import { IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  lastTimeDone?: Date;

  @IsBoolean()
  planned: boolean;

  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  assignedId?: string;

  @IsString()
  roomId: string;
}
