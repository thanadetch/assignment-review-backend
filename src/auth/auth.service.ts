import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { OtpService } from '../otp/otp.service';
import { ValidateOtp } from './dto/validate-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private otpService: OtpService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.userService.findByEmail(createUserDto.email);
    if (user) {
      return 'fail : user already exists';
    }
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    await this.userService.create(createUserDto);
    return 'success';
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      return { message: 'Invalid email or password' };
    }
    if (!(await bcrypt.compare(loginDto.password, user.password))) {
      return { message: 'Invalid email or password' };
    }
    const payload = { email: user.email, role: user.role.toString() };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getProfile(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return { message: 'User not found' };
    }
    const { role, firstName, lastName } = user;

    return { email, role, firstName, lastName };
  }

  async validateGithubUser(email: string, name: string) {
    let user = await this.userService.findByEmail(email);
    if (!user) {
      user = await this.userService.create({
        email,
        password: '',
        firstName: name,
        lastName: '',
        role: Role.STUDENT,
      });
    }
    return user;
  }

  async generateOtp(email: string) {
    return this.otpService.generateOtp(email);
  }

  async validateOtp(req: ValidateOtp) {
    const userEmail = await this.otpService.challengeOtp(req.code, req.ref);
    const user = await this.userService.findByEmail(userEmail);
    if (!user) {
      throw new UnauthorizedException();
    }
    const payload = { email: user.email, role: user.role.toString() };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
