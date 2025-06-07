import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './utils/public.decorator';
import { SignInDto } from './dto/signIn.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  signIn(@Body() signIn: SignInDto) {
    return this.authService.signIn(signIn.email, signIn.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('forgot')
  @Public()
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Public()
  @Post('validate-token')
  async validateToken(@Body('token') token: string) {
    const data = await this.authService.validateToken(token);
    if (data?.userId !== null) {
      return { userId: data?.userId, userName: data?.userName };
    } else {
      throw new Error('Token inválido');
    }
  }
}
