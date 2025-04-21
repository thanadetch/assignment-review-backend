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
  githubAuthCallback(@Req() req: Request, @Res() res: Response) {
    const token = this.authService.loginWithGithub(
      req.user as { email: string; role: string },
    );
    const frontendBaseUrl = this.configService.get<string>('FRONTEND_URL');
    const redirectUrl = `${frontendBaseUrl}/login?token=${token}`;
    console.log('hit call back');
    res.redirect(redirectUrl);
  }

  @Get('redirect')
  test(@Req() req: Request, @Res() res: Response) {
    const frontendBaseUrl = this.configService.get<string>('FRONTEND_URL');
    const redirectUrl = `${frontendBaseUrl}/login`;
    res.redirect(redirectUrl);
  }
}
