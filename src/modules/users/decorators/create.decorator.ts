import { RequirePermissions } from '@/modules/auth/decorators/permissions.decorator';
import { Permissions } from '@/shared/enum/permissions.enum';
import { applyDecorators, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponseUserDto } from '../dto/user.dto';

export function CreateUserDecorator() {
  return applyDecorators(
    Post(),
    RequirePermissions(Permissions.createUser),
    ApiOperation({ summary: 'Create a new user', description: 'Creates a new user with the provided data' }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'User successfully created',
      type: ResponseUserDto,
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
      description: 'Insufficient permissions to create users',
    }),
  );
}
