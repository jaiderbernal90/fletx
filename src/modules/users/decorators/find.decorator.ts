import { RequirePermissions } from '@/modules/auth/decorators/permissions.decorator';
import { Permissions } from '@/shared/enum/permissions.enum';
import { applyDecorators, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { PageDto } from '@/shared/dtos/pagination/page.dto';
import { ResponseUserDto } from '../dto/user.dto';

export function FindAllUserDecorator() {
  return applyDecorators(
    Get(),
    RequirePermissions(Permissions.viewUser),
    ApiOperation({
      summary: 'Get all users',
      description: 'Retrieves a paginated list of all users according to the provided pagination parameters',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Users successfully retrieved',
      type: PageDto,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized access',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'Insufficient permissions to view users',
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

export function FindOneUserDecorator() {
  return applyDecorators(
    Get(':id'),
    RequirePermissions(Permissions.viewUser),
    ApiOperation({
      summary: 'Get user by ID',
      description: 'Retrieves a user by their ID',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'User successfully retrieved',
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
      description: 'Insufficient permissions to view users',
    }),
  );
}
