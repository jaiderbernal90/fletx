import { RequirePermissions } from '@/modules/auth/decorators/permissions.decorator';
import { Permissions } from '@/shared/enum/permissions.enum';
import { applyDecorators, Delete, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponseUserDto } from '../dto/user.dto';

export function DeleteUserDecorator() {
  return applyDecorators(
    Delete(':id'),
    RequirePermissions(Permissions.deleteUser),
    ApiOperation({
      summary: 'Delete user',
      description: 'Deletes a user by their ID',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'User successfully deleted',
      type: ResponseUserDto,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'User not found',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized access',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'Insufficient permissions to delete users',
    }),
  );
}
