/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../../src/users/user.entity';
import { UserRepository } from '../../src/users/user.repository';

describe('Users (e2e)', () => {
  let app: INestApplication;

  const mockUserRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    existsWithEmail: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getRepositoryToken(UserEntity))
      .useValue(mockUserRepository)
      .overrideProvider(UserRepository)
      .useValue(mockUserRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    app.useLogger(false);

    await app.init();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  describe('/users (GET)', () => {
    it('should return list of users', async () => {
      const users = [
        {
          id: 'user-id-1',
          name: 'User 1',
          email: 'user1@teste.com',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
      ];

      mockUserRepository.findAll.mockResolvedValue(users);

      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      expect(response.body).toEqual([
        {
          id: 'user-id-1',
          name: 'User 1',
        },
      ]);

      expect(mockUserRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('/users/:id (PUT)', () => {
    it('should update a user successfully', async () => {
      const updateUserDto = {
        name: 'João Silva Updated',
      };

      mockUserRepository.update.mockResolvedValue('User updated succesfully!');

      const response = await request(app.getHttpServer())
        .put('/users/user-id-123')
        .send(updateUserDto)
        .expect(200);

      expect(response.body).toEqual({
        user: 'User updated succesfully!',
        message: 'User updated successfully!',
      });

      expect(mockUserRepository.update).toHaveBeenCalledWith(
        'user-id-123',
        updateUserDto,
      );
    });

    it('should return 404 when user not found', async () => {
      const updateUserDto = {
        name: 'João Silva Updated',
      };

      mockUserRepository.update.mockRejectedValue(new Error('User not found!'));

      await request(app.getHttpServer())
        .put('/users/non-existent-id')
        .send(updateUserDto)
        .expect(500);

      expect(mockUserRepository.update).toHaveBeenCalledWith(
        'non-existent-id',
        updateUserDto,
      );
    });
  });

  describe('/users/:id (DELETE)', () => {
    it('should delete a user successfully', async () => {
      const existingUser = {
        id: 'user-id-123',
        name: 'João Silva',
        email: 'joao@teste.com',
      };

      mockUserRepository.findById.mockResolvedValue(existingUser);
      mockUserRepository.delete.mockResolvedValue(existingUser);

      const response = await request(app.getHttpServer())
        .delete('/users/user-id-123')
        .expect(200);

      expect(response.body).toEqual({
        message: 'User deleted successfully!',
        user: {
          id: 'user-id-123',
          name: 'João Silva',
        },
      });

      expect(mockUserRepository.delete).toHaveBeenCalledWith('user-id-123');
    });

    it('should return 404 when trying to delete non-existent user', async () => {
      mockUserRepository.findById.mockResolvedValue(null);
      mockUserRepository.delete.mockRejectedValue(new Error('User not found!'));

      await request(app.getHttpServer())
        .delete('/users/non-existent-id')
        .expect(500);

      expect(mockUserRepository.delete).toHaveBeenCalledWith('non-existent-id');
    });
  });
});
