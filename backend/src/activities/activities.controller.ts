import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  ParseUUIDPipe,
  ParseIntPipe,
  ParseEnumPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { ActivityType, DifficultyLevel } from '../entities/activity.entity';

@Controller('activities')
@UseGuards(JwtAuthGuard)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Request() req: any, @Body() createActivityDto: CreateActivityDto) {
    return this.activitiesService.create(req.user.login, createActivityDto);
  }

  @Get()
  findAll(
    @Request() req: any,
    @Query('type') type?: ActivityType,
    @Query('difficulty', new ParseEnumPipe(DifficultyLevel, { optional: true }))
    difficulty?: DifficultyLevel,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
  ) {
    return this.activitiesService.findAll(req.user.login, {
      type,
      difficulty,
      dateFrom,
      dateTo,
      limit,
      offset,
    });
  }

  @Get('recent')
  getRecentActivities(
    @Request() req: any,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.activitiesService.getRecentActivities(req.user.login, limit);
  }

  @Get('statistics')
  getStatistics(
    @Request() req: any,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.activitiesService.getStatistics(req.user.login, {
      dateFrom,
      dateTo,
    });
  }

  @Get(':id')
  findOne(
    @Request() req: any,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.activitiesService.findOne(id, req.user.login);
  }

  @Patch(':id')
  update(
    @Request() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateActivityDto: UpdateActivityDto,
  ) {
    return this.activitiesService.update(id, req.user.login, updateActivityDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Request() req: any,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.activitiesService.remove(id, req.user.login);
  }
}
