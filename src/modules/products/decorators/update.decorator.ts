import { RequirePermissions } from '@/modules/auth/decorators/permissions.decorator';
import { Permissions } from '@/shared/enum/permissions.enum';
import { applyDecorators, HttpStatus, Patch } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponseProductDto } from '../dto/product.dto';

export function UpdateProductDecorator() {
  return applyDecorators(
    Patch(':id'),
    RequirePermissions(Permissions.updateProduct),
    ApiOperation({
      summary: 'Update product',
      description: 'Updates an existing product with the provided data',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Product successfully updated',
      type: ResponseProductDto,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Product not found',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid input data',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized access',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'Insufficient permissions to update products',
    }),
  );
}
