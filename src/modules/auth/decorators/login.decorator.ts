import { applyDecorators, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function LoginDecorator() {
  return applyDecorators(
    Post('login'),
    ApiOperation({
      summary: 'Sign in to the application',
      description: 'Authenticates a user using their credentials.',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Login successful',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Invalid credentials',
    }),
  );
}
