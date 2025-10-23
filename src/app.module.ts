import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfigService } from './config/postgres.config.service';
import { ConfigModule } from '@nestjs/config';
import { OrderModule } from './modules/order/order.module';
import { GlobalExceptionFilter } from './resources/filters/global-exception';
import { UserModule } from './modules/users/user.module';
import { ProductsModule } from './modules/products/product.module';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthModule } from './modules/auth/auth.module';
import KeyvRedis from '@keyv/redis';
import { APP_INTERCEPTOR } from '@nestjs/core';

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
    AuthModule,
  ],
  providers: [
    {
      provide: 'APP_FILTER',
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
