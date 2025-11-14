import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '../../src/modules/products/product.controller';
import { ProductService } from '../../src/modules/products/product.service';
import { CreateProductDTO } from '../../src/modules/products/dto/CreateProduct.dto';
import { UpdateProductDTO } from '../../src/modules/products/dto/UpdateProduct';
import { ProductEntity } from '../../src/modules/products/product.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../../src/modules/auth/auth.guard';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid'),
}));

type ProductServiceMock = jest.Mocked<
  Pick<ProductService, 'create' | 'getProducts' | 'update' | 'delete'>
>;

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductServiceMock;

  const mockProductService: ProductServiceMock = {
    create: jest.fn(),
    getProducts: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const makeEntity = (overrides?: Partial<ProductEntity>): ProductEntity => ({
    id: overrides?.id ?? 'p-1',
    name: overrides?.name ?? 'Product',
    value: overrides?.value ?? 100,
    availableQuantity: overrides?.availableQuantity ?? 10,
    description: overrides?.description ?? 'Product description',
    specifications: overrides?.specifications ?? [],
    images: overrides?.images ?? [],
    category: overrides?.category ?? 'general',
    createdAt: overrides?.createdAt ?? '2024-01-01T00:00:00Z',
    updatedAt: overrides?.updatedAt ?? '2024-01-02T00:00:00Z',
    deletedAt: overrides?.deletedAt ?? '2024-01-03T00:00:00Z',
    orders: overrides?.orders ?? [],
  });

  const makeImage = (
    overrides?: Partial<{ url: string; description: string }>,
  ) => ({
    id: 'img-1',
    url: overrides?.url ?? 'https://cdn.exemplo.com/img1.jpg',
    description: overrides?.description ?? 'lorem ipsum',
    product: undefined as unknown as ProductEntity,
  });

  const makeSpec = (
    overrides?: Partial<{ name: string; description: string }>,
  ) => ({
    id: 'spec-1',
    name: overrides?.name ?? 'conection',
    description: overrides?.description ?? 'bluetooth 5.0',
    // compatível com ProductSpecificationDTO.product, não é usado no create
    product: undefined as unknown as ProductEntity,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
            sign: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    controller = module.get<ProductsController>(ProductsController);
    // Como usamos useValue, o service é exatamente o mock
    service = mockProductService;

    jest.clearAllMocks();
  });

  describe('POST /products (create)', () => {
    it('should create a product and return it', async () => {
      const dto: CreateProductDTO = {
        category: 'eletrônicos',
        updatedAt: '2024-01-02T00:00:00Z',
        createdAt: '2024-01-01T00:00:00Z',
        description: 'fone bluetooth',
        name: 'Fone JBL',
        availableQuantity: 10,
        value: 199.99,
        images: [
          makeImage({
            url: 'https://cdn.exemplo.com/img1.jpg',
            description: 'frente',
          }),
          makeImage({
            url: 'https://cdn.exemplo.com/img2.jpg',
            description: 'verso',
          }),
        ],
        specifications: [
          makeSpec({ name: 'conexão', description: 'bluetooth 5.0' }),
          makeSpec({ name: 'autonomia', description: '5h' }),
        ],
      };

      const createdProduct = makeEntity({
        id: 'product-id',
        name: dto.name,
        value: dto.value,
      });
      service.create.mockResolvedValueOnce(createdProduct);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        product: createdProduct,
        message: 'Product created successfully!',
      });
    });
  });

  describe('GET /products (getProducts)', () => {
    it('should return the list from the service', async () => {
      const mockList: ProductEntity[] = [
        {
          id: '1',
          name: 'A',
          value: 0,
          availableQuantity: 0,
          description: 'desc A',
          specifications: [],
          images: [],
          category: 'cat',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
          deletedAt: '2024-01-03T00:00:00Z',
          orders: [],
        },
        {
          id: '2',
          name: 'B',
          value: 0,
          availableQuantity: 0,
          description: 'desc B',
          specifications: [],
          images: [],
          category: 'cat',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
          deletedAt: '2024-01-03T00:00:00Z',
          orders: [],
        },
      ];
      service.getProducts.mockResolvedValueOnce(mockList);

      const result = await controller.getProducts();

      expect(service.getProducts).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockList);
    });
  });

  describe('PUT /products/:id (update)', () => {
    it('should update and return a payload with a message', async () => {
      const id = '123';
      const newData: UpdateProductDTO = {
        name: 'new name',
        description: 'new desc',
      } as UpdateProductDTO;

      const updated: ProductEntity = {
        id: '123',
        name: 'new name',
        description: 'new desc',
        value: 0,
        availableQuantity: 0,
        specifications: [],
        images: [],
        category: 'cat',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
        deletedAt: '2024-01-03T00:00:00Z',
        orders: [],
      };
      service.update.mockResolvedValueOnce(updated);

      const result = await controller.update(id, newData);

      expect(service.update).toHaveBeenCalledWith(id, newData);
      expect(result).toEqual({
        produto: updated,
        mensagem: 'Product updated successfully!',
      });
    });
  });

  describe('DELETE /products/:id (delete)', () => {
    it('should delete and return a payload with a message', async () => {
      const id = '999';
      const deleted: ProductEntity = {
        id: '999',
        name: 'deleted product',
        description: 'deleted desc',
        value: 0,
        availableQuantity: 0,
        specifications: [],
        images: [],
        category: 'cat',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
        deletedAt: '2024-01-03T00:00:00Z',
        orders: [],
      };
      service.delete.mockResolvedValueOnce(deleted);

      const result = await controller.delete(id);

      expect(service.delete).toHaveBeenCalledWith(id);
      expect(result).toEqual({
        produto: deleted,
        mensagem: 'Product deleted successfully!',
      });
    });
  });
});
