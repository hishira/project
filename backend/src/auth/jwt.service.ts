import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { JwtPayload } from './strategies/jwt.strategy';
import { JwtService } from '@nestjs/jwt';

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
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      login: user.login,
    };

    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      accessToken: access_token,
      refreshToken: refresh_token,
    };
  }
}
