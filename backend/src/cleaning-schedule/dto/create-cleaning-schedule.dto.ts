import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCleaningScheduleDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsArray()
  @IsUUID('all', { each: true })
  taskIds: string[];

  @IsUUID()
  userId: string;
}
