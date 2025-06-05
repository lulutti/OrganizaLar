import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  lastTimeDone?: Date;

  @IsBoolean()
  @IsOptional()
  planned?: boolean;

  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  assignedId?: string;

  @IsString()
  roomId: string;
}
