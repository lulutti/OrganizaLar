import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  secretQuestion: string;

  @IsNotEmpty()
  secretAnswer: string;
}
