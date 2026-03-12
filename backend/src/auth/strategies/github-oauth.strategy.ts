import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';

@Injectable()
export class GithubOAuthStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      callbackURL:
        process.env.GITHUB_CALLBACK_URL ||
        'http://localhost:4000/auth/github/callback',
      scope: ['user:email'],
    });
  }

  validate(
    accessToken: string,
    _refreshToken: string,
    profile: Record<string, unknown>,
  ) {
    return { accessToken, profile };
  }
}
