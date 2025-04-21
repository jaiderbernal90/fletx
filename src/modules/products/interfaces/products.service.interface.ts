import { FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from 'typeorm';
import { PageDto } from '@/shared/dtos/pagination/page.dto';
import { PageOptionsDto } from '@/shared/dtos/pagination/page-options.dto';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

export const PRODUCTS_SERVICE_TOKEN = 'PRODUCTS_SERVICE_TOKEN';

export interface IProductsService {
  create(createProductDto: CreateProductDto): Promise<{ message: string; data?: Product }>;
  findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<Product>>;
  findOne(
    whereConditions: FindOptionsWhere<Product> | FindOptionsWhere<Product>[],
    options?: { relations?: FindOptionsRelations<Product>; select?: FindOptionsSelect<Product> },
  ): Promise<Product>;
  update(id: number, updateProductDto: UpdateProductDto): Promise<Product>;
  remove(id: number): Promise<Product>;
}
