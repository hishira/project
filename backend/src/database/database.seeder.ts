import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/users/user.entity';

@Injectable()
export class DatabaseSeeder {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async seed() {
    // Check if users already exist
    const userCount = await this.usersRepository.count();
    if (userCount > 0) {
      console.log('Database already seeded');
      return;
    }

    // Create sample users
    const users = [
      {
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
      },
      {
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
      },
      {
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
      },
    ];

    for (const userData of users) {
      const user = this.usersRepository.create(userData);
      await this.usersRepository.save(user);
    }

    console.log('Database seeded successfully');
  }
}
