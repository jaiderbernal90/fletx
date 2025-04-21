import { RequirePermissions } from '@/modules/auth/decorators/permissions.decorator';
import { Permissions } from '@/shared/enum/permissions.enum';
import { applyDecorators, Delete, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponseProductDto } from '../dto/product.dto';

export function DeleteProductDecorator() {
  return applyDecorators(
    Delete(':id'),
    RequirePermissions(Permissions.deleteProduct),
    ApiOperation({
      summary: 'Delete product',
      description: 'Deletes a user by their ID',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Product successfully deleted',
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
      description: 'Insufficient permissions to delete products',
    }),
  );
}
