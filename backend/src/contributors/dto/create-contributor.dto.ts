import { IsNotEmpty, IsString } from 'class-validator';

export class CreateContributorDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
