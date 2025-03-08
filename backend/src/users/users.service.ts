import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const isUserExist = await this.findOneByEmail(createUserDto.email);

      if (isUserExist) {
        throw new Error('An user with this email already exists');
      } else {
        const user = this.usersRepository.create(createUserDto);

        await this.usersRepository.save(user);

        return {
          message: 'User created successfully',
          user: user.id,
        };
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async resetPassword({ email, password: newPassword }: User) {
    const user = await this.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.password = newPassword;
    await this.usersRepository.save(user);

    return {
      message: 'User password updated successfully',
      user: user.id,
    };
  }

  async findOne(id: string) {
    return (
      (await this.usersRepository.findOne({ where: { id } })) ||
      new NotFoundException('User not found')
    );
  }

  async findOneByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }
}
