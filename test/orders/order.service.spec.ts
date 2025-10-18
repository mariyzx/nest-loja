import { OrderService } from '../../src/modules/order/order.service';
import { OrderEntity } from '../../src/modules/order/order.entity';
import { UserEntity } from '../../src/modules/users/user.entity';
import { ProductEntity } from '../../src/modules/products/product.entity';
import { OrderStatus } from '../../src/modules/order/enum/OrderStatus.enum';
import { CreateOrderDto } from '../../src/modules/order/dto/CreateOrder.dto';
import { OrderRepository } from '../../src/modules/order/order.repository';
import { UserRepository } from '../../src/modules/users/user.repository';
import { ProductRepository } from '../../src/modules/products/product.repository';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: jest.Mocked<OrderRepository>;
  let userRepository: jest.Mocked<UserRepository>;
  let productRepository: jest.Mocked<ProductRepository>;

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

  function orderRepoMockFactory(): jest.Mocked<OrderRepository> {
    return Object.assign(Object.create(OrderRepository.prototype), {
      create: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      update: jest.fn(),
      save: jest.fn(),
    }) as jest.Mocked<OrderRepository>;
  }

  function userRepoMockFactory(): jest.Mocked<UserRepository> {
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

  function productRepoMockFactory(): jest.Mocked<ProductRepository> {
    return Object.assign(Object.create(ProductRepository.prototype), {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByIds: jest.fn(),
      save: jest.fn(),
    }) as jest.Mocked<ProductRepository>;
  }

  beforeEach(() => {
    orderRepository = orderRepoMockFactory();
    userRepository = userRepoMockFactory();
    productRepository = productRepoMockFactory();

    service = new OrderService(
      orderRepository,
      userRepository,
      productRepository,
    );

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

      userRepository.findById.mockResolvedValueOnce(user);
      productRepository.findByIds.mockResolvedValueOnce([p1, p2]);
      orderRepository.save.mockResolvedValueOnce(
        makeOrder({ totalValue: 350, status: OrderStatus.PENDING }),
      );

      const result = await service.createOrder(userId, dto);

      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(productRepository.findByIds).toHaveBeenCalled();
      expect(orderRepository.save).toHaveBeenCalled();
      expect(result.totalValue).toBe(350);
      expect(result.status).toBe(OrderStatus.PENDING);
    });

    it('should throw when user not found', async () => {
      const userId = 'missing';
      const dto: CreateOrderDto = {
        orderProducts: [{ productId: 'p', quantity: 1 }],
      };

      userRepository.findById.mockResolvedValueOnce(null);

      await expect(service.createOrder(userId, dto)).rejects.toThrow(
        'User not found!',
      );
    });
  });

  describe('updateOrder', () => {
    it('should update existing order', async () => {
      const orderId = 'order-1';
      const updated = makeOrder({ status: OrderStatus.COMPLETED });

      orderRepository.update.mockResolvedValueOnce(updated);

      const result = await service.updateOrder(orderId, {
        status: OrderStatus.COMPLETED,
      });

      expect(orderRepository.update).toHaveBeenCalledWith(orderId, {
        status: OrderStatus.COMPLETED,
      });
      expect(result.status).toBe(OrderStatus.COMPLETED);
    });

    it('should throw when order not found', async () => {
      orderRepository.update.mockRejectedValueOnce(
        new Error('Order not found'),
      );

      await expect(
        service.updateOrder('missing', { status: OrderStatus.CANCELED }),
      ).rejects.toThrow('Order not found');
    });
  });
});
