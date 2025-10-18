/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { UserEntity } from '../../src/users/user.entity';
import { ProductEntity } from '../../src/products/product.entity';
import { OrderEntity } from '../../src/modules/order/order.entity';
import { OrderStatus } from '../../src/modules/order/enum/OrderStatus.enum';
import { OrderRepository } from '../../src/modules/order/order.repository';
import { UserRepository } from '../../src/users/user.repository';
import { ProductRepository } from '../../src/products/product.repository';

describe('Orders (e2e)', () => {
  let app: INestApplication;

  const mockOrderRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findByUserId: jest.fn(),
    update: jest.fn(),
    save: jest.fn(),
  };

  const mockUserRepository = {
    findById: jest.fn(),
  };

  const mockProductRepository = {
    findByIds: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(OrderRepository)
      .useValue(mockOrderRepository)
      .overrideProvider(UserRepository)
      .useValue(mockUserRepository)
      .overrideProvider(ProductRepository)
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
        orderProducts: [
          { productId: '5535765f-f2b1-4151-b646-d3e66c24faac', quantity: 2 },
        ],
      };

      const user = {
        id: userId,
        name: 'User',
        email: 'u@example.com',
      } as unknown as UserEntity;
      const product = {
        id: '5535765f-f2b1-4151-b646-d3e66c24faac',
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

      mockUserRepository.findById.mockResolvedValueOnce(user);
      mockProductRepository.findByIds.mockResolvedValueOnce([product]);
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
        id: orderId,
        totalValue: 200,
        status: OrderStatus.COMPLETED,
        productOrders: [],
      } as unknown as OrderEntity;

      mockOrderRepository.findById.mockResolvedValueOnce(existingOrder);
      mockOrderRepository.update.mockResolvedValueOnce(updatedOrder);

      const response = await request(app.getHttpServer())
        .patch(`/order/${orderId}`)
        .send(updateDto)
        .expect(200);

      const updatedBody = response.body as unknown as { status: OrderStatus };
      expect(updatedBody.status).toBe(OrderStatus.COMPLETED);
    });
  });
});
