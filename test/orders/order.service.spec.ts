import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderService } from '../../src/order/order.service';
import { OrderEntity } from '../../src/order/order.entity';
import { UserEntity } from '../../src/users/user.entity';
import { ProductEntity } from '../../src/products/product.entity';
import { OrderStatus } from '../../src/order/enum/OrderStatus.enum';
import { CreateOrderDto } from '../../src/order/dto/CreateOrder.dto';

type OrderRepoMock = Pick<Repository<OrderEntity>, 'save' | 'findOne'>;

type UserRepoMock = Pick<Repository<UserEntity>, 'findOneBy'>;

type ProductRepoMock = Pick<Repository<ProductEntity>, 'findBy'>;

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: jest.Mocked<OrderRepoMock>;
  let userRepository: jest.Mocked<UserRepoMock>;
  let productRepository: jest.Mocked<ProductRepoMock>;

  const makeUser = (overrides?: Partial<UserEntity>): UserEntity => ({
    id: overrides?.id ?? 'user-1',
    name: overrides?.name ?? 'John Doe',
    email: overrides?.email ?? 'john@example.com',
    password: overrides?.password ?? 'hashed',
    createdAt: overrides?.createdAt ?? '2024-01-01T00:00:00Z',
    updatedAt: overrides?.updatedAt ?? '2024-01-01T00:00:00Z',
    deletedAt: overrides?.deletedAt ?? '2024-12-31T00:00:00Z',
    orders: overrides?.orders ?? [],
  });

  const makeProduct = (overrides?: Partial<ProductEntity>): ProductEntity => ({
    id: overrides?.id ?? 'product-1',
    name: overrides?.name ?? 'Phone',
    value: overrides?.value ?? 100,
    availableQuantity: overrides?.availableQuantity ?? 10,
    description: overrides?.description ?? 'desc',
    category: overrides?.category ?? 'general',
    specifications: overrides?.specifications ?? [],
    images: overrides?.images ?? [],
    createdAt: overrides?.createdAt ?? '2024-01-01T00:00:00Z',
    updatedAt: overrides?.updatedAt ?? '2024-01-01T00:00:00Z',
    deletedAt: overrides?.deletedAt ?? '2024-12-31T00:00:00Z',
    orders: overrides?.orders ?? [],
  });

  const makeOrder = (overrides?: Partial<OrderEntity>): OrderEntity => ({
    id: overrides?.id ?? 'order-1',
    totalValue: overrides?.totalValue ?? 200,
    status: overrides?.status ?? OrderStatus.PENDING,
    createdAt: overrides?.createdAt ?? '2024-01-01T00:00:00Z',
    updatedAt: overrides?.updatedAt ?? '2024-01-02T00:00:00Z',
    deletedAt: overrides?.deletedAt ?? '2024-12-31T00:00:00Z',
    user: overrides?.user ?? makeUser(),
    productOrders: overrides?.productOrders ?? [],
  });

  beforeEach(async () => {
    const orderRepoMock: jest.Mocked<OrderRepoMock> = {
      save: jest.fn(),
      findOne: jest.fn(),
    };

    const userRepoMock: jest.Mocked<UserRepoMock> = {
      findOneBy: jest.fn(),
    };

    const productRepoMock: jest.Mocked<ProductRepoMock> = {
      findBy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: getRepositoryToken(OrderEntity), useValue: orderRepoMock },
        { provide: getRepositoryToken(UserEntity), useValue: userRepoMock },
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: productRepoMock,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = orderRepoMock;
    userRepository = userRepoMock;
    productRepository = productRepoMock;

    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create order and compute total', async () => {
      const userId = 'user-1';
      const dto: CreateOrderDto = {
        orderProducts: [
          { productId: 'product-1', quantity: 2 },
          { productId: 'product-2', quantity: 1 },
        ],
      };

      const user = makeUser({ id: userId });
      const p1 = makeProduct({ id: 'product-1', value: 100 });
      const p2 = makeProduct({ id: 'product-2', value: 150 });

      userRepository.findOneBy.mockResolvedValueOnce(user);
      productRepository.findBy.mockResolvedValueOnce([p1, p2]);
      orderRepository.save.mockResolvedValueOnce(
        makeOrder({ totalValue: 350, status: OrderStatus.PENDING }),
      );

      const result = await service.createOrder(userId, dto);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
      expect(productRepository.findBy).toHaveBeenCalled();
      expect(orderRepository.save).toHaveBeenCalled();
      expect(result.totalValue).toBe(350);
      expect(result.status).toBe(OrderStatus.PENDING);
    });

    it('should throw when user not found', async () => {
      const userId = 'missing';
      const dto: CreateOrderDto = {
        orderProducts: [{ productId: 'p', quantity: 1 }],
      };

      userRepository.findOneBy.mockResolvedValueOnce(null);

      await expect(service.createOrder(userId, dto)).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('updateOrder', () => {
    it('should update existing order', async () => {
      const orderId = 'order-1';
      const existing = makeOrder({ status: OrderStatus.PENDING });
      const updated = makeOrder({ status: OrderStatus.COMPLETED });

      orderRepository.findOne.mockResolvedValueOnce(existing);
      orderRepository.save.mockResolvedValueOnce(updated);

      const result = await service.updateOrder(orderId, {
        status: OrderStatus.COMPLETED,
      });

      expect(orderRepository.findOne).toHaveBeenCalledWith({
        where: { id: orderId },
        relations: ['productOrders', 'productOrders.product'],
      });
      expect(result.status).toBe(OrderStatus.COMPLETED);
    });

    it('should throw when order not found', async () => {
      orderRepository.findOne.mockResolvedValueOnce(null);

      await expect(
        service.updateOrder('missing', { status: OrderStatus.CANCELED }),
      ).rejects.toThrow('Order not found');
    });
  });
});
