import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserStatisticsService } from './user-statistics.service';

interface AuthenticatedRequest extends Request {
  user?: {
    login?: string;
    username?: string;
  };
}

@Controller('user-statistics')
@UseGuards(JwtAuthGuard)
export class UserStatisticsController {
  constructor(private readonly userStatisticsService: UserStatisticsService) {}

  @Get()
  async getUserStatistics(@Request() req: AuthenticatedRequest) {
    const username = req.user?.login || req.user?.username;
    if (!username) {
      throw new BadRequestException('User not authenticated');
    }
    return this.userStatisticsService.getUserStatistics(username);
  }

  @Post('recalculate')
  @HttpCode(HttpStatus.OK)
  async recalculateStatistics(@Request() req: AuthenticatedRequest) {
    const username = req.user?.login || req.user?.username;
    if (!username) {
      throw new BadRequestException('User not authenticated');
    }
    return this.userStatisticsService.recalculateAllStatistics(username);
  }
}
