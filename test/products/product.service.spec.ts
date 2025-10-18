import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../../src/products/product.service';
import { ProductEntity } from '../../src/products/product.entity';
import { ProductRepository } from '../../src/products/product.repository';

describe('ProductService', () => {
  let service: ProductService;
  let repository: jest.Mocked<ProductRepository>;

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

  function repoMockFactory(): jest.Mocked<ProductRepository> {
    return Object.assign(Object.create(ProductRepository.prototype), {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }) as jest.Mocked<ProductRepository>;
  }

  beforeEach(() => {
    repository = repoMockFactory();
    service = new ProductService(repository);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should save a new product', async () => {
      const entity = makeEntity();
      repository.create.mockResolvedValueOnce(entity);

      const result = await service.create(entity);

      expect(repository.create).toHaveBeenCalledWith(
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
      repository.findAll.mockResolvedValueOnce(list);

      const result = await service.getProducts();

      expect(repository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(list);
    });
  });

  describe('update', () => {
    it('should update when the product exists', async () => {
      const id = 'p-1';
      const payload: Partial<ProductEntity> = { name: 'Novo nome' };
      const updatedProduct = makeEntity({ id, name: 'Novo nome' });
      repository.update.mockResolvedValueOnce(updatedProduct);

      const result = await service.update(id, payload as any);

      expect(repository.update).toHaveBeenCalledWith(id, payload as any);
      expect(result).toEqual(updatedProduct);
    });

    it('should return NotFoundException when the product does not exist', async () => {
      const id = 'inexistente';
      repository.update.mockRejectedValueOnce(new Error('Product not found!'));

      await expect(service.update(id, { name: 'Nome' } as any)).rejects.toThrow(
        'Product not found',
      );

      expect(repository.update).toHaveBeenCalledWith(id, {
        name: 'Nome',
      } as any);
    });
  });

  describe('delete', () => {
    it('should delete when the product exists', async () => {
      const id = 'p-1';
      const deletedProduct = makeEntity({ id });
      repository.delete.mockResolvedValueOnce(deletedProduct);

      const result = await service.delete(id);

      expect(repository.delete).toHaveBeenCalledWith(id);
      expect(result).toEqual(deletedProduct);
    });

    it('should return NotFoundException when the product does not exist', async () => {
      const id = 'does-not-exist';
      repository.delete.mockRejectedValueOnce(new Error('Product not found!'));

      await expect(service.delete(id)).rejects.toThrow('Product not found');
      expect(repository.delete).toHaveBeenCalledWith(id);
    });
  });
});
