import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { JwtPayload } from './utils';

@Injectable()
export class LocalJwtService {
  verify(refreshToken: string): JwtPayload {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly jwtService: JwtService) {}
  prepareTokens(user: User): {
    accessToken: string;
    refreshToken: string;
  } {
    const payload: JwtPayload = JwtPayload.fromUser(user);

    const access_token = this.jwtService.sign(payload.parseToObject());
    const refresh_token = this.jwtService.sign(payload.parseToObject(), { expiresIn: '7d' });

    return {
      accessToken: access_token,
      refreshToken: refresh_token,
    };
  }
}
