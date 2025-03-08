import { IsBoolean, IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    secretQuestion: string; 
  
    @IsNotEmpty()
    secretAnswer: string; 

    @IsBoolean()
    isAdmin: boolean;
}
