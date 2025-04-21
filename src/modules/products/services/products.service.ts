import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { IProductsService } from '../interfaces/products.service.interface';
import { Product } from '../entities/product.entity';
import { FindOptionsOrder, FindOptionsRelations, FindOptionsSelect, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PageMetaDto } from '@/shared/dtos/pagination/page-meta.dto';
import { Order } from '@/shared/constants/pagination';
import { PageDto } from '@/shared/dtos/pagination/page.dto';
import { PageOptionsDto } from '@/shared/dtos/pagination/page-options.dto';

@Injectable()
export class ProductsService implements IProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(@InjectRepository(Product) private readonly productRepo: Repository<Product>) {
    this.logger.log('ProductsService initialized');
  }

  async create(createProductDto: CreateProductDto): Promise<{ message: string; data?: Product }> {
    try {
      this.logger.log(`Creating product with email: ${createProductDto.name}`);

      const { companyId } = createProductDto;
      this.logger.debug(`Using companyId: ${companyId}`);

      const product = this.productRepo.create({
        ...createProductDto,
        company: companyId ? { id: companyId } : undefined,
      });

      const result = await this.productRepo.save(product, { reload: true });
      this.logger.log(`Product created successfully with ID: ${result.id}`);

      return { message: 'Product created successfully', data: result as Product };
    } catch (error) {
      this.logger.error(`Error creating product: ${error.message}`, error.stack);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException(`Failed to create product: ${error.message}`);
    }
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<Product>> {
    try {
      this.logger.log(`Finding all products with pagination: page ${pageOptionsDto.page}, size ${pageOptionsDto.take}`);

      const { skip, take } = pageOptionsDto;

      const defaultOrder: FindOptionsOrder<Product> = {
        createdAt: pageOptionsDto.order,
      } as any;

      this.logger.debug(`Executing findAndCount with skip: ${skip}, take: ${take}`);
      const [items, itemCount] = await this.productRepo.findAndCount({
        relations: {
          company: true,
        },
        order: defaultOrder,
        skip,
        take,
      });

      this.logger.log(`Found ${items.length} products (total: ${itemCount})`);

      const pageMetaDto = new PageMetaDto({
        pageOptionsDto: {
          pageCount: items.length,
          itemCount,
          page: pageOptionsDto.page || 1,
          take: pageOptionsDto.take,
          order: Order.DESC,
        },
        itemCount,
      });

      return new PageDto(items, pageMetaDto);
    } catch (error) {
      this.logger.error(`Error finding products: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to fetch products: ${error.message}`);
    }
  }

  async findOne(
    whereConditions: FindOptionsWhere<Product> | FindOptionsWhere<Product>[],
    options?: { relations?: FindOptionsRelations<Product>; select?: FindOptionsSelect<Product> },
  ): Promise<Product> {
    try {
      this.logger.log(`Finding product with conditions: ${JSON.stringify(whereConditions)}`);

      const product = await this.productRepo.findOne({
        where: whereConditions,
        relations: options?.relations,
        select: options?.select,
      });

      if (product) {
        this.logger.log(`Product found with ID: ${product.id}`);
      } else {
        this.logger.warn('No product found for the specified conditions');
      }

      return product;
    } catch (error) {
      this.logger.error(`Error finding product: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to fetch product: ${error.message}`);
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    try {
      this.logger.log(`Updating product with ID: ${id}`);

      const existingProduct = await this.findByIdAndValidate(id);
      this.logger.debug(`Found product to update: ${existingProduct.name}`);

      const updateData: any = { ...updateProductDto };

      if (updateProductDto.companyId) {
        this.logger.debug(`Updating companyId to: ${updateProductDto.companyId}`);
        updateData.company = { id: updateProductDto.companyId };
        delete updateData.companyId;
      }

      await this.productRepo.update(id, updateData);
      this.logger.log('Product updated successfully');

      const updatedProduct = await this.findOne({ id }, { relations: { company: true } });

      return updatedProduct as Product;
    } catch (error) {
      this.logger.error(`Error updating product: ${error.message}`, error.stack);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException(`Failed to update product: ${error.message}`);
    }
  }

  async remove(id: number): Promise<Product> {
    try {
      this.logger.log(`Removing product with ID: ${id}`);

      const product = await this.findByIdAndValidate(id);
      this.logger.debug(`Found product to remove: ${product.name}`);

      await this.productRepo.delete(id);
      this.logger.log('Product removed successfully');

      return product as Product;
    } catch (error) {
      this.logger.error(`Error removing product: ${error.message}`, error.stack);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException(`Failed to remove product: ${error.message}`);
    }
  }

  private async findByIdAndValidate(id: number): Promise<Product> {
    this.logger.debug(`Validating product existence with ID: ${id}`);

    const product = await this.findOne({ id }, { relations: { company: true } });

    if (!product) {
      this.logger.warn(`Product with ID ${id} not found`);
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }
}
