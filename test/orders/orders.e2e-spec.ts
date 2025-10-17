/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderEntity } from '../../src/order/order.entity';
import { UserEntity } from '../../src/users/user.entity';
import { ProductEntity } from '../../src/products/product.entity';
import { OrderStatus } from '../../src/order/enum/OrderStatus.enum';

describe('Orders (e2e)', () => {
  let app: INestApplication;

  const mockOrderRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
  };

  const mockUserRepository = {
    findOneBy: jest.fn(),
  };

  const mockProductRepository = {
    findBy: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getRepositoryToken(OrderEntity))
      .useValue(mockOrderRepository)
      .overrideProvider(getRepositoryToken(UserEntity))
      .useValue(mockUserRepository)
      .overrideProvider(getRepositoryToken(ProductEntity))
      .useValue(mockProductRepository)
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

  describe('/order (POST)', () => {
    it('should create a new order', async () => {
      const userId = 'user-1';
      const orderDto = {
        orderProducts: [{ productId: 'product-1', quantity: 2 }],
      };

      const user = {
        id: userId,
        name: 'User',
        email: 'u@example.com',
      } as unknown as UserEntity;
      const product = {
        id: 'product-1',
        name: 'P',
        value: 100,
        availableQuantity: 10,
      } as unknown as ProductEntity;

      const expectedOrder = {
        id: 'order-1',
        totalValue: 200,
        status: OrderStatus.PENDING,
        user,
        productOrders: [{ id: 'po-1', quantity: 2, sellValue: 100, product }],
      } as unknown as OrderEntity;

      mockUserRepository.findOneBy.mockResolvedValueOnce(user);
      mockProductRepository.findBy.mockResolvedValueOnce([product]);
      mockOrderRepository.save.mockResolvedValueOnce(expectedOrder);

      const response = await request(app.getHttpServer())
        .post(`/order?userId=${userId}`)
        .send(orderDto)
        .expect(201);

      const createdBody = response.body as unknown as {
        status: OrderStatus;
        totalValue: number;
      };
      expect(createdBody).toBeDefined();
      expect(createdBody.status).toBe(OrderStatus.PENDING);
      expect(createdBody.totalValue).toBe(200);
    });

    it('should return 400 when userId is not provided', async () => {
      const orderDto = {
        orderProducts: [{ productId: 'product-1', quantity: 2 }],
      };

      await request(app.getHttpServer())
        .post('/order')
        .send(orderDto)
        .expect(400);
    });
  });

  describe('/order/:id (PATCH)', () => {
    it('should update order status', async () => {
      const orderId = 'order-1';
      const updateDto = { status: OrderStatus.COMPLETED };

      const existingOrder = {
        id: orderId,
        totalValue: 200,
        status: OrderStatus.PENDING,
        productOrders: [],
      } as unknown as OrderEntity;
      const updatedOrder = {
        ...existingOrder,
        status: OrderStatus.COMPLETED,
      } as unknown as OrderEntity;

      mockOrderRepository.findOne.mockResolvedValueOnce(existingOrder);
      mockOrderRepository.save.mockResolvedValueOnce(updatedOrder);

      const response = await request(app.getHttpServer())
        .patch(`/order/${orderId}`)
        .send(updateDto)
        .expect(200);

      const updatedBody = response.body as unknown as { status: OrderStatus };
      expect(updatedBody.status).toBe(OrderStatus.COMPLETED);
    });
  });
});
