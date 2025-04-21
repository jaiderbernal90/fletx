import { RequirePermissions } from '@/modules/auth/decorators/permissions.decorator';
import { Permissions } from '@/shared/enum/permissions.enum';
import { applyDecorators, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponseProductDto } from '../dto/product.dto';

export function CreateProductDecorator() {
  return applyDecorators(
    Post(),
    RequirePermissions(Permissions.createProduct),
    ApiOperation({ summary: 'Create a new product', description: 'Creates a new product with the provided data' }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Product successfully created',
      type: ResponseProductDto,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid input data or user already exists',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized access',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'Insufficient permissions to create products',
    }),
  );
}
