import { IsOptional, IsString } from 'class-validator';

export class UpdateContributorDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  userId?: string;
}
