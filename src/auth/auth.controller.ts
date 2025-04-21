import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { GithubGuard } from './guards/github.guard';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ValidateOtp } from './dto/validate-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  async register(@Body() req: CreateUserDto) {
    return this.authService.createUser(req);
  }

  @Post('login')
  async login(@Body() req: LoginDto) {
    return this.authService.login(req);
  }

  @Get('github')
  @UseGuards(GithubGuard)
  githubAuth() {}

  @Get('callback')
  @UseGuards(GithubGuard)
  async githubAuthCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as { email: string; role: string };
    const ref = await this.authService.generateOtp(user.email);

    const frontendBaseUrl = this.configService.get<string>('FRONTEND_URL');
    const redirectUrl = `${frontendBaseUrl}/otp?ref=${ref}`;
    res.redirect(redirectUrl);
  }

  @Post('validate-otp')
  async validateOtp(@Body() req: ValidateOtp) {
    return this.authService.validateOtp(req)
  }
}
