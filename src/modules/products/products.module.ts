import { Module } from '@nestjs/common';
import { ProductsService } from './services/products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { PRODUCTS_SERVICE_TOKEN } from './interfaces/products.service.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [
    {
      provide: PRODUCTS_SERVICE_TOKEN,
      useClass: ProductsService,
    },
  ],
})
export class ProductsModule {}
