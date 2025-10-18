import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserService } from '../../src/users/user.service';
import { UserEntity } from '../../src/users/user.entity';
import { ListUserDTO } from '../../src/users/dto/ListUser.dto';
import { UpdateUserDTO } from '../../src/users/dto/UpdateUser.dto';

type RepoMock = Pick<
  Repository<UserEntity>,
  'save' | 'find' | 'findOne' | 'update' | 'delete'
>;

describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<RepoMock>;

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

  const repoMockFactory = (): jest.Mocked<RepoMock> => ({
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  });

  beforeEach(async () => {
    repository = repoMockFactory();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
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
      repository.save.mockResolvedValueOnce(savedUser);

      const result = await service.create(userData);

      expect(repository.save).toHaveBeenCalledWith(
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
      repository.find.mockResolvedValueOnce(entities);

      const result = await service.getUsers();

      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual([
        new ListUserDTO('1', 'A'),
        new ListUserDTO('2', 'B'),
      ]);
    });
  });

  describe('update', () => {
    it('should update and return success message', async () => {
      const id = 'u-1';
      const payload: UpdateUserDTO = { name: 'New Name' } as UpdateUserDTO;

      const updateResult: UpdateResult = {
        raw: {},
        generatedMaps: [],
        affected: 1,
      };
      repository.findOne.mockResolvedValueOnce({
        id,
        ...payload,
      } as UserEntity);

      repository.update.mockResolvedValueOnce(updateResult);

      const result = await service.update(id, payload);

      expect(repository.update).toHaveBeenCalledWith(id, payload);
      expect(result).toBe('User updated succesfully!');
    });
  });

  describe('delete', () => {
    it('should delete and return the removed entity when exists', async () => {
      const id = 'u-1';
      const entity = makeEntity({ id, name: 'Jane' });
      repository.findOne.mockResolvedValueOnce(entity);
      const deleteResult: DeleteResult = { raw: {}, affected: 1 };
      repository.delete.mockResolvedValueOnce(deleteResult);

      const result = await service.delete(id);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(repository.delete).toHaveBeenCalledWith(id);
      expect(result).toEqual(entity);
    });

    it('should return NotFoundException when user does not exist', async () => {
      const id = 'missing';
      repository.findOne.mockResolvedValueOnce(null);

      await expect(service.delete(id)).rejects.toThrow('User not found!');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});
