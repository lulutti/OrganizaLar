import { IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  userId: string;
}
