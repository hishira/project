import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from '../entities/user.entity';
import { Credentials } from 'src/entities/credentials.entity';
import { UserCredentials } from 'src/entities/user-credentials.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Credentials, UserCredentials])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
