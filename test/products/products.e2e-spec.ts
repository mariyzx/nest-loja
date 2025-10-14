/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductEntity } from '../../src/products/product.entity';

describe('Products (e2e)', () => {
  let app: INestApplication;

  const mockProductRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getRepositoryToken(ProductEntity))
      .useValue(mockProductRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    // Silencia logs durante os testes
    app.useLogger(false);

    await app.init();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  describe('/products (GET)', () => {
    it('should return list of products', async () => {
      const products = [
        {
          id: 'product-id-1',
          name: 'Product 1',
          value: 100,
          description: 'Description 1',
          category: 'Category 1',
          images: [],
          specifications: [],
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
      ];

      mockProductRepository.find.mockResolvedValue(products);

      const response = await request(app.getHttpServer())
        .get('/products')
        .expect(200);

      expect(response.body).toEqual([
        {
          id: 'product-id-1',
          name: 'Product 1',
          value: 100,
          description: 'Description 1',
          category: 'Category 1',
          images: [],
          specifications: [],
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
      ]);

      expect(mockProductRepository.find).toHaveBeenCalled();
    });
  });

  describe('/products/:id (PUT)', () => {
    it('should update a product successfully', async () => {
      const updateProductDto = {
        name: 'Updated Product',
        value: 150,
      };

      const existingProduct = {
        id: 'product-id-123',
        name: 'Original Product',
        value: 100,
        description: 'Original description',
        category: 'Original category',
        images: [],
        specifications: [],
      };

      const updatedProduct = {
        id: 'product-id-123',
        name: 'Updated Product',
        value: 150,
        description: 'Original description',
        category: 'Original category',
        images: [],
        specifications: [],
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T01:00:00.000Z',
      };

      mockProductRepository.findOneBy.mockResolvedValue(existingProduct);
      mockProductRepository.update.mockResolvedValue({ affected: 1 });
      mockProductRepository.save.mockResolvedValue(updatedProduct);

      const response = await request(app.getHttpServer())
        .put('/products/product-id-123')
        .send(updateProductDto)
        .expect(200);

      expect(response.body).toEqual({
        mensagem: 'Product updated successfully!',
        produto: { affected: 1 },
      });

      expect(mockProductRepository.findOneBy).toHaveBeenCalledWith({
        id: 'product-id-123',
      });
    });

    it('should return 200 with null when product not found', async () => {
      const updateProductDto = {
        name: 'Updated Product',
      };

      mockProductRepository.findOneBy.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .put('/products/non-existent-id')
        .send(updateProductDto)
        .expect(200);

      expect(response.body).toEqual({
        produto: null,
        mensagem: 'Product updated successfully!',
      });

      expect(mockProductRepository.findOneBy).toHaveBeenCalledWith({
        id: 'non-existent-id',
      });
    });
  });

  describe('/products/:id (DELETE)', () => {
    it('should delete a product successfully', async () => {
      const existingProduct = {
        id: 'product-id-123',
        name: 'Product to delete',
        value: 100,
      };

      mockProductRepository.findOneBy.mockResolvedValue(existingProduct);
      mockProductRepository.delete.mockResolvedValue({ affected: 1 });

      const response = await request(app.getHttpServer())
        .delete('/products/product-id-123')
        .expect(200);

      expect(response.body).toEqual({
        mensagem: 'Product deleted successfully!',
        produto: { affected: 1 },
      });

      expect(mockProductRepository.delete).toHaveBeenCalledWith(
        'product-id-123',
      );
    });

    it('should return 200 with null when trying to delete non-existent product', async () => {
      mockProductRepository.findOneBy.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .delete('/products/non-existent-id')
        .expect(200);

      expect(response.body).toEqual({
        produto: null,
        mensagem: 'Product deleted successfully!',
      });

      expect(mockProductRepository.findOneBy).toHaveBeenCalledWith({
        id: 'non-existent-id',
      });
      expect(mockProductRepository.delete).not.toHaveBeenCalled();
    });
  });
});
