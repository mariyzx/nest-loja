import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../src/modules/users/user.controller';
import { UserService } from '../../src/modules/users/user.service';
import { CreateUserDTO } from '../../src/modules/users/dto/CreateUser.dto';
import { UpdateUserDTO } from '../../src/modules/users/dto/UpdateUser.dto';
import { ListUserDTO } from '../../src/modules/users/dto/ListUser.dto';
import { UserEntity } from '../../src/modules/users/user.entity';
import { UserRepository } from '../../src/modules/users/user.repository';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid'),
}));

describe('UserController', () => {
  let controller: UserController;
  let service: jest.Mocked<UserService>;

  function serviceMockFactory(): jest.Mocked<UserService> {
    return Object.assign(Object.create(UserService.prototype), {
      create: jest.fn(),
      getUsers: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }) as jest.Mocked<UserService>;
  }

  const makeEntity = (overrides?: Partial<UserEntity>): UserEntity => ({
    id: overrides?.id ?? 'u-1',
    name: overrides?.name ?? 'Jane Doe',
    email: overrides?.email ?? 'jane@example.com',
    password: overrides?.password ?? 'secret123',
    createdAt: overrides?.createdAt ?? '2024-01-01T00:00:00Z',
    updatedAt: overrides?.updatedAt ?? '2024-01-02T00:00:00Z',
    deletedAt: overrides?.deletedAt ?? '2024-01-03T00:00:00Z',
    orders: [],
  });

  beforeEach(async () => {
    service = serviceMockFactory();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: service,
        },
        {
          provide: UserRepository,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    jest.clearAllMocks();
  });

  describe('POST /users (create)', () => {
    it('should create a user with uuid and return ListUserDTO', async () => {
      const dto: CreateUserDTO = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const createdUser = makeEntity({
        id: 'mocked-uuid',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });
      (service.create as jest.Mock).mockResolvedValueOnce(createdUser);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        user: new ListUserDTO('mocked-uuid', 'John Doe'),
        message: 'User created successfully!',
      });
    });
  });

  describe('GET /users (getUsers)', () => {
    it('should return the list from service', async () => {
      const list: ListUserDTO[] = [
        new ListUserDTO('1', 'A'),
        new ListUserDTO('2', 'B'),
      ];
      (service.getUsers as jest.Mock).mockResolvedValueOnce(list);

      const result = await controller.getUsers();

      expect(service.getUsers).toHaveBeenCalledTimes(1);
      expect(result).toEqual(list);
    });
  });

  describe('PUT /users/:id (update)', () => {
    it('should update and return payload with message', async () => {
      const id = 'u-1';
      const newData: UpdateUserDTO = { name: 'New Name' } as UpdateUserDTO;
      (service.update as jest.Mock).mockResolvedValueOnce(
        'User updated succesfully!',
      );

      const result = await controller.update(id, newData);

      expect(service.update).toHaveBeenCalledWith(id, newData);
      expect(result).toEqual({
        user: 'User updated succesfully!',
        message: 'User updated successfully!',
      });
    });
  });

  describe('DELETE /users/:id (delete)', () => {
    it('should delete and return payload with message when exists', async () => {
      const id = 'u-1';
      const removed = makeEntity({ id, name: 'Jane' });
      (service.delete as jest.Mock).mockResolvedValueOnce(removed);

      const result = await controller.delete(id);

      expect(service.delete).toHaveBeenCalledWith(id);
      expect(result).toEqual({
        user: new ListUserDTO(id, 'Jane'),
        message: 'User deleted successfully!',
      });
    });

    it('should throw error when user does not exist', async () => {
      const id = 'missing';
      (service.delete as jest.Mock).mockResolvedValueOnce(null);

      await expect(controller.delete(id)).rejects.toThrow('User not found');
      expect(service.delete).toHaveBeenCalledWith(id);
    });
  });
});
