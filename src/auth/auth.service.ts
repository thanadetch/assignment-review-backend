import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { OtpService } from '../otp/otp.service';
import { ValidateOtp } from './dto/validate-otp.dto';
import { Prisma } from '@prisma/client';
import { GroupService } from '../groups/groups.service';
import { JwtPayload } from './strategies/jwt.strategy';

const DEFAULT_GROUP_ID = '170e618c-829d-4cff-a84b-1e3320266ba8'; // Group Z

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private otpService: OtpService,
    private groupService: GroupService,
  ) {}

  async createUser(createUserDto: Prisma.UserUncheckedCreateInput) {
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
    const payload = {
      email: user.email,
      role: user.role.toString(),
      group: user?.group?.id,
      userId: user.id
    };
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
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return await this.createNewStudent(email, name);
    }
    return {
      email: email,
      role: user.role,
      group: user.group?.id,
      userId: user.id,
    } as JwtPayload;
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
    const payload = {
      email: user.email,
      role: user.role.toString(),
      group: user.group?.id,
      userId: user.id,
    } as JwtPayload;
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  private async createNewStudent(
    email: string,
    name: string,
  ) {
    const group = await this.groupService.findOne(DEFAULT_GROUP_ID); // just assign first then change later
    const DEFAULT_SUBJECT_ID = '550e8400-e29b-41d4-a716-446655440002';
    const createdUser = await this.userService.create({
      email,
      password: '',
      firstName: name,
      lastName: '',
      role: Role.STUDENT,
      groupId: DEFAULT_GROUP_ID,
      subjectId: DEFAULT_SUBJECT_ID // to default
    });
    return {
      email: email,
      role: createdUser.role,
      group: group.name,
      userId: createdUser.id,
    } as JwtPayload;
  }
}
