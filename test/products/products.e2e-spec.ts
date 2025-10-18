/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { ProductRepository } from '../../src/modules/products/product.repository';

describe('Products (e2e)', () => {
  let app: INestApplication;

  const mockProductRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ProductRepository)
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

      mockProductRepository.findAll.mockResolvedValue(products);

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

      expect(mockProductRepository.findAll).toHaveBeenCalled();
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

      mockProductRepository.findById.mockResolvedValue(existingProduct);
      mockProductRepository.update.mockResolvedValue(updatedProduct);

      const response = await request(app.getHttpServer())
        .put('/products/product-id-123')
        .send(updateProductDto)
        .expect(200);

      expect(response.body).toEqual({
        mensagem: 'Product updated successfully!',
        produto: updatedProduct,
      });

      expect(mockProductRepository.update).toHaveBeenCalledWith(
        'product-id-123',
        updateProductDto,
      );
    });

    it('should return 404 when product not found', async () => {
      const updateProductDto = {
        name: 'Updated Product',
      };

      mockProductRepository.update.mockRejectedValue(
        new NotFoundException('Product not found!'),
      );

      const response = await request(app.getHttpServer())
        .put('/products/non-existent-id')
        .send(updateProductDto)
        .expect(404);

      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 404,
          message: 'Product not found!',
        }),
      );

      expect(mockProductRepository.update).toHaveBeenCalledWith(
        'non-existent-id',
        updateProductDto,
      );
    });
  });

  describe('/products/:id (DELETE)', () => {
    it('should delete a product successfully', async () => {
      const existingProduct = {
        id: 'product-id-123',
        name: 'Product to delete',
        value: 100,
      };

      mockProductRepository.findById.mockResolvedValue(existingProduct);
      mockProductRepository.delete.mockResolvedValue(existingProduct);

      const response = await request(app.getHttpServer())
        .delete('/products/product-id-123')
        .expect(200);

      expect(response.body).toEqual({
        mensagem: 'Product deleted successfully!',
        produto: existingProduct,
      });

      expect(mockProductRepository.delete).toHaveBeenCalledWith(
        'product-id-123',
      );
    });

    it('should return 404 when trying to delete non-existent product', async () => {
      mockProductRepository.delete.mockRejectedValue(
        new NotFoundException('Product not found!'),
      );

      const response = await request(app.getHttpServer())
        .delete('/products/non-existent-id')
        .expect(404);

      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 404,
          message: 'Product not found!',
        }),
      );
      expect(mockProductRepository.delete).toHaveBeenCalledWith(
        'non-existent-id',
      );
    });
  });
});
