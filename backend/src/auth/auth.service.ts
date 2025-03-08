import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { jwtConstants } from './utils/constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<any> {
    const { email, secretQuestion, secretAnswer } = forgotPasswordDto;
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }

    if (!secretQuestion) {
      return { question: user?.secretQuestion };
    } else if (!secretAnswer) {
      throw new UnauthorizedException('Secret answer is required');
    }

    const isAnswerCorrect = await user.compareAnswer(secretAnswer);
    if (!isAnswerCorrect) {
      throw new UnauthorizedException('Invalid secret answer');
    }

    const payload = { sub: user.id, type: 'password_reset' };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: jwtConstants.secret,
        expiresIn: '5m',
      }),
    };
  }
}
