// src/auth/github.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';
import * as process from 'node:process';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private readonly authService: AuthService, // Inject your AuthService
  ) {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    const callbackUrl = process.env.GITHUB_CALLBACK_URL;
    super({
      clientID: clientId,
      clientSecret: clientSecret,
      callbackURL: callbackUrl,
      scope: ['user:email'], // Request user's primary email (optional)
    } as any);
  }

  async validate(
    accessToken: string,
    refreshToken: string, // Might be undefined depending on GitHub settings/flow
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void,
  ) {
    const { id, username, displayName, emails, photos } = profile;
    const githubUser = {
      githubId: id,
      email: emails?.[0]?.value, // Primary email if available and requested
      username: username,
      displayName: displayName,
      photo: photos?.[0]?.value,
      accessToken, // You might want to store the access token for API calls
    };
    if (!githubUser.email) {
      throw new Error();
    }
    const payload = await this.authService.validateGithubUser(
      githubUser.email,
      githubUser.displayName,
    );
    done(null, payload);
  }
}
