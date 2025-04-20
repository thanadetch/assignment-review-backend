import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { GithubGuard } from './guards/github.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  githubAuthCallback(@Req() req: Request) {
    return this.authService.loginWithGithub(
      req.user as { email: string; role: string },
    );
  }
}
