import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from 'src/auth/utils/public.decorator';
import { User } from './entities/user.entity';
import { ResetPasswordAccess } from 'src/auth/utils/reset-password.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  @Public()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Patch('reset')
  @ResetPasswordAccess()
  resetPassword(@Body() userDto: User) {
    return this.usersService.resetPassword(userDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }
}
