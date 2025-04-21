import { RequirePermissions } from '@/modules/auth/decorators/permissions.decorator';
import { Permissions } from '@/shared/enum/permissions.enum';
import { applyDecorators, HttpStatus, Patch } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponseUserDto } from '../dto/user.dto';

export function UpdateUserDecorator() {
  return applyDecorators(
    Patch(':id'),
    RequirePermissions(Permissions.updateUser),
    ApiOperation({
      summary: 'Update user',
      description: 'Updates an existing user with the provided data',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'User successfully updated',
      type: ResponseUserDto,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'User not found',
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
      description: 'Insufficient permissions to update users',
    }),
  );
}
