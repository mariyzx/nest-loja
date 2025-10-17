import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { ProductService } from '../../src/products/product.service';
import { ProductEntity } from '../../src/products/product.entity';

type RepoMock = Pick<
  Repository<ProductEntity>,
  'save' | 'find' | 'findOneBy' | 'update' | 'delete'
>;

describe('ProductService', () => {
  let service: ProductService;
  let repository: jest.Mocked<RepoMock>;

  const makeEntity = (overrides?: Partial<ProductEntity>): ProductEntity => ({
    id: overrides?.id ?? 'p-1',
    name: overrides?.name ?? 'Produto',
    value: overrides?.value ?? 100,
    availableQuantity: overrides?.availableQuantity ?? 10,
    description: overrides?.description ?? 'Descrição do produto',
    specifications: overrides?.specifications ?? [],
    images: overrides?.images ?? [],
    category: overrides?.category ?? 'geral',
    createdAt: overrides?.createdAt ?? '2024-01-01T00:00:00Z',
    updatedAt: overrides?.updatedAt ?? '2024-01-02T00:00:00Z',
    deletedAt: overrides?.deletedAt ?? '2024-01-03T00:00:00Z',
    orders: overrides?.orders ?? [],
  });

  const repoMockFactory = (): jest.Mocked<RepoMock> => ({
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  });

  beforeEach(async () => {
    repository = repoMockFactory();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should save a new product', async () => {
      const entity = makeEntity();
      repository.save.mockResolvedValueOnce(entity);

      const result = await service.create(entity);

      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: entity.name,
          value: entity.value,
          availableQuantity: entity.availableQuantity,
          description: entity.description,
          category: entity.category,
        }),
      );
      expect(result).toEqual(entity);
    });
  });

  describe('getProducts', () => {
    it('should return the list of products', async () => {
      const list = [makeEntity({ id: 'p-1' }), makeEntity({ id: 'p-2' })];
      repository.find.mockResolvedValueOnce(list);

      const result = await service.getProducts();

      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual(list);
    });
  });

  describe('update', () => {
    it('should update when the product exists', async () => {
      const id = 'p-1';
      const payload: Partial<ProductEntity> = { name: 'Novo nome' };
      repository.findOneBy.mockResolvedValueOnce(makeEntity({ id }));
      const updateResult: UpdateResult = {
        raw: {},
        generatedMaps: [],
        affected: 1,
      };
      repository.update.mockResolvedValueOnce(updateResult);

      const result = await service.update(id, payload);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id });
      expect(repository.update).toHaveBeenCalledWith(id, payload);
      expect(result).toEqual(updateResult);
    });

    it('should return NotFoundException when the product does not exist', async () => {
      const id = 'inexistente';
      repository.findOneBy.mockResolvedValueOnce(null);

      await expect(service.update(id, { name: 'Nome' })).rejects.toThrow(
        'Product not found',
      );

      expect(repository.findOneBy).toHaveBeenCalledWith({ id });
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete when the product exists', async () => {
      const id = 'p-1';
      repository.findOneBy.mockResolvedValueOnce(makeEntity({ id }));
      const deleteResult: DeleteResult = { raw: {}, affected: 1 };
      repository.delete.mockResolvedValueOnce(deleteResult);

      const result = await service.delete(id);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id });
      expect(repository.delete).toHaveBeenCalledWith(id);
      expect(result).toEqual(deleteResult);
    });

    it('should return null when the product does not exist', async () => {
      const id = 'does-not-exist';
      repository.findOneBy.mockResolvedValueOnce(null);

      const result = await service.delete(id);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id });
      expect(repository.delete).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});
