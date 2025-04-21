import { RequirePermissions } from '@/modules/auth/decorators/permissions.decorator';
import { Permissions } from '@/shared/enum/permissions.enum';
import { applyDecorators, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { PageDto } from '@/shared/dtos/pagination/page.dto';
import { ResponseProductDto } from '../dto/product.dto';

export function FindAllProductDecorator() {
  return applyDecorators(
    Get(),
    RequirePermissions(Permissions.viewProduct),
    ApiOperation({
      summary: 'Get all products',
      description: 'Retrieves a paginated list of all products according to the provided pagination parameters',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Products successfully retrieved',
      type: PageDto,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized access',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'Insufficient permissions to view products',
    }),
    ApiQuery({
      name: 'page',
      required: false,
      description: 'Page number (starts from 1)',
      type: Number,
    }),
    ApiQuery({
      name: 'take',
      required: false,
      description: 'Number of items per page',
      type: Number,
    }),
    ApiQuery({
      name: 'order',
      required: false,
      description: 'Sort order (ASC or DESC)',
      enum: ['ASC', 'DESC'],
    }),
  );
}

export function FindOneProductDecorator() {
  return applyDecorators(
    Get(':id'),
    RequirePermissions(Permissions.viewProduct),
    ApiOperation({
      summary: 'Get product by ID',
      description: 'Retrieves a product by their ID',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Product successfully retrieved',
      type: ResponseProductDto,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Product not found',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized access',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'Insufficient permissions to view products',
    }),
  );
}
