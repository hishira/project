import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';

describe('Authentication System (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Configure the same global validation pipe as in main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        disableErrorMessages: false,
        validationError: { target: false, value: false },
      }),
    );

    dataSource = moduleFixture.get<DataSource>(DataSource);

    // Clear database before each test
    await dataSource.synchronize(true);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Authentication Flow', () => {
    const testUser = {
      login: 'johndoe',
      email: 'test@example.com',
      password: 'StrongPassword123!',
      firstName: 'John',
      lastName: 'Doe',
    };

    let authToken: string;

    it('should register a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('access_token');
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user.firstName).toBe(testUser.firstName);
      expect(response.body.user.lastName).toBe(testUser.lastName);
      expect(response.body.user).not.toHaveProperty('password');

      authToken = response.body.access_token;
    });

    it('should not register user with duplicate email', async () => {
      // First registration
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      // Second registration with same email
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(409);
    });

    it('should login with valid email credentials', async () => {
      // Register user first
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      // Login with email
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          identifier: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('access_token');
      expect(response.body.user.email).toBe(testUser.email);
    });

    it('should login with valid username credentials', async () => {
      // Register user first
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      // Login with login/username
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          identifier: testUser.login,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('access_token');
      expect(response.body.user.login).toBe(testUser.login);
    });

    it('should not login with invalid credentials', async () => {
      // Register user first
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      // Login with wrong password
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          identifier: testUser.email,
          password: 'WrongPassword123!',
        })
        .expect(401);
    });

    it('should get current user with valid token', async () => {
      // Register user
      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      const token = registerResponse.body.access_token;

      // Get current user
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.email).toBe(testUser.email);
      expect(response.body.firstName).toBe(testUser.firstName);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should not get current user without token', async () => {
      await request(app.getHttpServer()).get('/auth/me').expect(401);
    });

    it('should change password with valid current password', async () => {
      // Register user
      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      const token = registerResponse.body.access_token;

      // Change password
      const newPassword = 'NewStrongPassword123!';
      await request(app.getHttpServer())
        .patch('/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: testUser.password,
          newPassword: newPassword,
        })
        .expect(200);

      // Verify old password doesn't work
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          identifier: testUser.email,
          password: testUser.password,
        })
        .expect(401);

      // Verify new password works
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          identifier: testUser.email,
          password: newPassword,
        })
        .expect(200);
    });

    it('should not change password with invalid current password', async () => {
      // Register user
      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      const token = registerResponse.body.access_token;

      // Try to change password with wrong current password
      await request(app.getHttpServer())
        .patch('/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'WrongPassword123!',
          newPassword: 'NewStrongPassword123!',
        })
        .expect(401);
    });
  });

  describe('Input Validation', () => {
    it('should validate registration input', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: 'weak',
          firstName: '',
          lastName: '',
        })
        .expect(400);
    });

    it('should validate password complexity', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123', // Missing uppercase and special character
          firstName: 'John',
          lastName: 'Doe',
        })
        .expect(400);
    });

    it('should validate password change input', async () => {
      // Register user first
      const testUser = {
        login: 'janedoe',
        email: 'test@example.com',
        password: 'StrongPassword123!',
        firstName: 'John',
        lastName: 'Doe',
      };

      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      const token = registerResponse.body.access_token;

      // Try to change password with invalid new password
      await request(app.getHttpServer())
        .patch('/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: testUser.password,
          newPassword: 'weak', // Too weak
        })
        .expect(400);
    });
  });
});
