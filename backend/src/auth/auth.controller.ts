import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserSessionService } from '../user-session/user-session.service';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { RateLimitGuard } from './guards/rate-limit.guard';

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    email: string;
    login: string;
  };
}

@Controller('auth')
export class AuthController {
  private readonly loginRateLimit = 5; //15 * 60 * 1000;
  constructor(
    private readonly authService: AuthService,
    private readonly userSessionService: UserSessionService,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @UseGuards(new RateLimitGuard(5, 5)) // 5 attempts per 15 minutes
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  async getMe(@Request() req: AuthenticatedRequest) {
    return await this.authService.getMe(req.user.sub);
  }

  @UseGuards(new RateLimitGuard(3, 10 * 60 * 1000)) // 3 attempts per 10 minutes
  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Request() req: AuthenticatedRequest,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this.authService.changePassword(
      req.user.sub,
      changePasswordDto,
    );
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req: AuthenticatedRequest) {
    return this.authService.logout(req.user.sub);
  }

  @Get('sessions')
  async getSessions(@Request() req: AuthenticatedRequest) {
    return this.userSessionService.getUserSessions(req.user.login);
  }

  @Get('sessions/count')
  async getActiveSessionCount(@Request() req: AuthenticatedRequest) {
    const count = await this.userSessionService.getActiveSessionCount(
      req.user.login,
    );
    return { count };
  }

  @Delete('sessions/:sessionId')
  @HttpCode(HttpStatus.OK)
  async deleteSession(
    @Request() req: AuthenticatedRequest,
    @Param('sessionId') sessionId: string,
  ) {
    // First verify the session belongs to the user
    const userSessions = await this.userSessionService.getUserSessions(
      req.user.login,
    );
    const sessionExists = userSessions.some(
      (session) => session.id === sessionId,
    );

    if (!sessionExists) {
      throw new Error('Session not found or does not belong to user');
    }

    await this.userSessionService.deleteSession(sessionId);
    return { message: 'Session deleted successfully' };
  }

  @Delete('sessions')
  @HttpCode(HttpStatus.OK)
  async deleteAllSessions(@Request() req: AuthenticatedRequest) {
    await this.userSessionService.deleteUserSessions(req.user.login);
    return { message: 'All sessions deleted successfully' };
  }

  @Post('sessions/cleanup')
  @HttpCode(HttpStatus.OK)
  async cleanupExpiredSessions() {
    await this.userSessionService.cleanupExpiredSessions();
    return { message: 'Expired sessions cleaned up successfully' };
  }
}
