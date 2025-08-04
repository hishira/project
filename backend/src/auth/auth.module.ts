import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserSessionModule } from '../user-session/user-session.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalJwtService } from './jwt.service';
import { UserAuthenticationService } from './services/user-authentication.service';
import { UserPasswordService } from './services/user-password.service';
import { UserRegistrationService } from './services/user-registration.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Credentials } from 'src/entities/credentials.entity';
import { UserCredentials } from 'src/entities/user-credentials.entity';
import { AuthenticationService } from './services/authentication.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Credentials, UserCredentials]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'your-secret-key-change-in-production',
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN ?? '24h',
      },
    }),
    UsersModule,
    UserSessionModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    LocalJwtService,
    UserAuthenticationService,
    UserPasswordService,
    UserRegistrationService,
    AuthenticationService,
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
