import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../../src/modules/order/order.controller';
import { OrderService } from '../../src/modules/order/order.service';
import { CreateOrderDto } from '../../src/modules/order/dto/CreateOrder.dto';
import { UpdateOrderDto } from '../../src/modules/order/dto/UpdateOrder.dto';
import { OrderStatus } from '../../src/modules/order/enum/OrderStatus.enum';
import { OrderEntity } from '../../src/modules/order/order.entity';
import { UserEntity } from '../../src/modules/users/user.entity';
import { JwtService } from '@nestjs/jwt';

type OrderServiceMock = jest.Mocked<
  Pick<OrderService, 'createOrder' | 'updateOrder'>
>;

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderServiceMock;

  const mockOrderService: OrderServiceMock = {
    createOrder: jest.fn(),
    updateOrder: jest.fn(),
  };

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

  const makeOrder = (overrides?: Partial<OrderEntity>): OrderEntity => ({
    id: overrides?.id ?? 'order-1',
    totalValue: overrides?.totalValue ?? 300,
    status: overrides?.status ?? OrderStatus.PENDING,
    createdAt: overrides?.createdAt ?? '2024-01-01T00:00:00Z',
    updatedAt: overrides?.updatedAt ?? '2024-01-02T00:00:00Z',
    deletedAt: overrides?.deletedAt ?? '2024-12-31T00:00:00Z',
    user: overrides?.user ?? makeUser(),
    productOrders: overrides?.productOrders ?? [],
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = mockOrderService;

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /order (create)', () => {
    it('should create an order and return it', async () => {
      const userId = 'user-1';
      const dto: CreateOrderDto = {
        orderProducts: [
          { productId: 'product-1', quantity: 2 },
          { productId: 'product-2', quantity: 1 },
        ],
      };

      const created = makeOrder({ totalValue: 2 * 100 + 1 * 150 });
      service.createOrder.mockResolvedValueOnce(created);

      const result = await controller.create(userId, dto);

      expect(service.createOrder).toHaveBeenCalledWith(userId, dto);
      expect(result).toEqual(created);
    });
  });

  describe('PATCH /order/:orderId (update)', () => {
    it('should update order status and return updated order', async () => {
      const orderId = 'order-1';
      const dto: UpdateOrderDto = { status: OrderStatus.COMPLETED };

      const updated = makeOrder({ status: OrderStatus.COMPLETED });
      service.updateOrder.mockResolvedValueOnce(updated);

      const result = await controller.update(orderId, dto);

      expect(service.updateOrder).toHaveBeenCalledWith(orderId, dto);
      expect(result.status).toBe(OrderStatus.COMPLETED);
    });
  });
});
