import { RequirePermissions } from '@/modules/auth/decorators/permissions.decorator';
import { Permissions } from '@/shared/enum/permissions.enum';
import { applyDecorators, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponseCompanyDto } from '../dto/company.dto';

export function CreateCompanyDecorator() {
  return applyDecorators(
    Post(),
    RequirePermissions(Permissions.createCompany),
    ApiOperation({ summary: 'Create a new company', description: 'Creates a new company with the provided data' }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Company successfully created',
      type: ResponseCompanyDto,
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
      description: 'Insufficient permissions to create companies',
    }),
  );
}
