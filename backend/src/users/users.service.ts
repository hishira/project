import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCredentials } from 'src/entities/credentials.entity';
import { CreateEventPayload } from 'src/events/events.service';
import { Repository } from 'typeorm';
import { LoggerService } from '../common/logger';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const selectVariables: (keyof User)[] = [
  'id',
  'firstName',
  'lastName',
  'createdAt',
  'updatedAt',
];

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly logger: LoggerService,
    private eventEmitter: EventEmitter2,
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

    const credentials = await UserCredentials.Create(
      userData.login,
      userData.email,
      password,
    );
    const user = this.usersRepository.create({
      ...userData,
      credentials: credentials,
    });

    const savedUser = await this.usersRepository.save(user);
    this.eventEmitter.emit(
      'create',
      new CreateEventPayload('User Created', savedUser.id, savedUser),
    );

    this.logger.logBusiness('User created successfully', {
      module: 'UsersService',
      action: 'create',
      userId: savedUser.id,
      email: savedUser.credentials.email,
      login: savedUser.credentials.login,
    });

    // Remove credentials from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { credentials: _, ...userWithoutPassword } = savedUser;
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
      relations: { credentials: true },
      where: { credentials: { email } },
      select: selectVariables,
    });
  }

  async findByLogin(login: string): Promise<User | null> {
    return this.usersRepository.findOne({
      relations: { credentials: true },
      where: { credentials: { login } },
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
