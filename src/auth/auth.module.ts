import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'node:process';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GithubStrategy } from './strategies/github.strategy';
import { ConfigService } from '@nestjs/config';
import { OtpModule } from '../otp/otp.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    OtpModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GithubStrategy, ConfigService],
})
export class AuthModule {}
