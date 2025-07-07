import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { LoggerService } from '../common/logger';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Event, EventType } from 'src/entities/event.entity';

const selectVariables: (keyof User)[] = [
  'id',
  'login',
  'email',
  'firstName',
  'lastName',
  'isActive',
  'createdAt',
  'updatedAt',
];

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly logger: LoggerService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<Omit<Partial<User>, 'password'>> {
    const { password, ...userData } = createUserDto;

    this.logger.logInfo('Creating new user', {
      module: 'UsersService',
      action: 'create',
      email: userData.email,
      login: userData.login,
    });

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(user);
    const event = this.eventRepository.create({
      name: 'User Created',
      corelatedEntityId: savedUser.id,
      corelatedEntity: savedUser,
      type: EventType.Create,
    });

    event
      .save()
      .then(() => {
        this.logger.logDatabase('Event saved successfully', 'event', {
          module: 'UsersService',
          action: 'create',
          eventId: event.id,
          userId: savedUser.id,
        });
      })
      .catch((error: Error) => {
        this.logger.logError('Failed to save event', error, {
          module: 'UsersService',
          action: 'create',
          error: error.message,
          userId: savedUser.id,
        });
      });

    this.logger.logBusiness('User created successfully', {
      module: 'UsersService',
      action: 'create',
      userId: savedUser.id,
      email: savedUser.email,
      login: savedUser.login,
    });

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      select: selectVariables,
    });
  }

  async findByLogin(login: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { login },
      select: selectVariables,
    });
  }

  async update(id: string, updateData: UpdateUserDto): Promise<User | null> {
    await this.usersRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
