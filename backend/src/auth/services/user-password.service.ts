import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { LoggerService } from '../../common/logger';
import { User } from '../../entities/user.entity';
import { ChangePasswordDto } from '../dto/change-password.dto';

const selection: (keyof User)[] = [
  'id',
  'login',
  'email',
  'password',
  'firstName',
  'lastName',
  'isActive',
  'createdAt',
  'updatedAt',
];

@Injectable()
export class UserPasswordService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly logger: LoggerService,
  ) {}

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const { currentPassword, newPassword } = changePasswordDto;

    this.logger.logInfo('Password change attempt', {
      module: 'UserPasswordService',
      action: 'changePassword',
      userId,
    });

    const user = await this.validateUser(userId);
    await this.validateCurrentPassword(currentPassword, user);
    await this.updatePassword(userId, newPassword);

    this.logger.logSecurity('Password changed successfully', 'medium', {
      module: 'UserPasswordService',
      action: 'changePassword',
      userId,
    });

    return { message: 'Password changed successfully' };
  }

  private async validateUser(userId: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: selection,
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    return user;
  }

  private async validateCurrentPassword(
    currentPassword: string,
    user: User,
  ): Promise<void> {
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      this.logger.logWarn(
        'Password change failed: incorrect current password',
        {
          module: 'UserPasswordService',
          action: 'changePassword',
          userId: user.id,
        },
      );
      throw new UnauthorizedException('Current password is incorrect');
    }
  }

  private async updatePassword(
    userId: string,
    newPassword: string,
  ): Promise<void> {
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    await this.usersRepository.update(userId, { password: hashedNewPassword });
  }
}
