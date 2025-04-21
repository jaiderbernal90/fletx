import { Controller, Body, Param, ParseIntPipe, Query, Inject, UseGuards } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PageOptionsDto } from '@/shared/dtos/pagination/page-options.dto';
import { IProductsService, PRODUCTS_SERVICE_TOKEN } from './interfaces/products.service.interface';
import { JwtAuthGuard } from '@/shared/guards/auth/auth.guard';
import { PermissionsGuard } from '@/shared/guards/permissions/permissions.guard';
import { ApiTags } from '@nestjs/swagger';
import { CreateProductDecorator } from './decorators/create.decorator';
import { DeleteProductDecorator } from './decorators/delete.decorator';
import { FindAllProductDecorator, FindOneProductDecorator } from './decorators/find.decorator';
import { UpdateProductDecorator } from './decorators/update.decorator';

@Controller('products')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiTags('Products')
export class ProductsController {
  constructor(@Inject(PRODUCTS_SERVICE_TOKEN) private readonly productsSvc: IProductsService) {}

  @CreateProductDecorator()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsSvc.create(createProductDto);
  }

  @FindAllProductDecorator()
  findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return this.productsSvc.findAll(pageOptionsDto);
  }

  @FindOneProductDecorator()
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.productsSvc.findOne({ id }, { relations: { company: true } });
  }

  @UpdateProductDecorator()
  update(@Param('id', new ParseIntPipe()) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productsSvc.update(id, updateProductDto);
  }

  @DeleteProductDecorator()
  remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.productsSvc.remove(id);
  }
}
