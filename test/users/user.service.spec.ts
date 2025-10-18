import { UserService } from '../../src/users/user.service';
import { UserEntity } from '../../src/users/user.entity';
import { ListUserDTO } from '../../src/users/dto/ListUser.dto';
import { UpdateUserDTO } from '../../src/users/dto/UpdateUser.dto';
import { UserRepository } from '../../src/users/user.repository';

describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<UserRepository>;

  const makeEntity = (overrides?: Partial<UserEntity>): UserEntity => ({
    id: overrides?.id ?? 'u-1',
    name: overrides?.name ?? 'Jane Doe',
    email: overrides?.email ?? 'jane@example.com',
    password: overrides?.password ?? 'secret123',
    createdAt: overrides?.createdAt ?? '2024-01-01T00:00:00Z',
    updatedAt: overrides?.updatedAt ?? '2024-01-02T00:00:00Z',
    deletedAt: overrides?.deletedAt ?? '2024-01-03T00:00:00Z',
    orders: overrides?.orders ?? [],
  });

  function repoMockFactory(): jest.Mocked<UserRepository> {
    return Object.assign(Object.create(UserRepository.prototype), {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      existsWithEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }) as jest.Mocked<UserRepository>;
  }

  beforeEach(() => {
    repository = repoMockFactory();
    service = new UserService(repository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should save the entity and return it', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };
      const savedUser = makeEntity(userData);
      repository.create.mockResolvedValueOnce(savedUser);

      const result = await service.create(userData);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        }),
      );
      expect(result).toEqual(savedUser);
    });
  });

  describe('getUsers', () => {
    it('should return list mapped to ListUserDTO', async () => {
      const entities = [
        makeEntity({ id: '1', name: 'A' }),
        makeEntity({ id: '2', name: 'B' }),
      ];
      repository.findAll.mockResolvedValueOnce(entities);

      const result = await service.getUsers();

      expect(repository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([
        new ListUserDTO('1', 'A'),
        new ListUserDTO('2', 'B'),
      ]);
    });
  });

  describe('update', () => {
    it('should update and return the updated entity', async () => {
      const id = 'u-1';
      const payload: UpdateUserDTO = { name: 'New Name' } as UpdateUserDTO;
      const updatedUser = makeEntity({ id, name: 'New Name' });
      repository.update.mockResolvedValueOnce(updatedUser);

      const result = await service.update(id, payload);

      expect(repository.update).toHaveBeenCalledWith(id, payload);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('delete', () => {
    it('should delete and return the removed entity when exists', async () => {
      const id = 'u-1';
      const entity = makeEntity({ id, name: 'Jane' });
      repository.delete.mockResolvedValueOnce(entity);

      const result = await service.delete(id);

      expect(repository.delete).toHaveBeenCalledWith(id);
      expect(result).toEqual(entity);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      const id = 'missing';
      repository.delete.mockRejectedValueOnce(new Error('User not found!'));

      await expect(service.delete(id)).rejects.toThrow('User not found!');
      expect(repository.delete).toHaveBeenCalledWith(id);
    });
  });
});
