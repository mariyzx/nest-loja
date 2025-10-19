import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfigService } from './config/postgres.config.service';
import { ConfigModule } from '@nestjs/config';
import { OrderModule } from './modules/order/order.module';
import { GlobalExceptionFilter } from './filters/global-exception';
import { UserModule } from './modules/users/user.module';
import { ProductsModule } from './modules/products/product.module';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';

@Module({
  imports: [
    UserModule,
    ProductsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
      inject: [PostgresConfigService],
    }),
    OrderModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => {
        const redisStore = new KeyvRedis('redis://127.0.0.1:6379');

        return {
          stores: [redisStore],
          ttl: 60000,
        };
      },
    }),
  ],
  providers: [
    {
      provide: 'APP_FILTER',
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
