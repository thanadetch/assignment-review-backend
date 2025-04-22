import {
  ExtractJwt,
  Strategy,
  StrategyOptionsWithoutRequest,
} from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import * as process from 'node:process';
import { UsersService } from '../../users/users.service';
import { GroupService } from '../../groups/groups.service';

export interface JwtPayload {
  email: string;
  role: string;
  group: string;
  userId: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UsersService,
    private readonly groupService: GroupService,
  ) {
    const secret = process.env.JWT_SECRET;
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    } as StrategyOptionsWithoutRequest);
  }

  validate(payload: JwtPayload) {
    return {
      email: payload.email,
      role: payload.role,
      group: payload.group,
      userId: payload.userId,
    };
  }
}
