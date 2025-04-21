import { RequirePermissions } from '@/modules/auth/decorators/permissions.decorator';
import { Permissions } from '@/shared/enum/permissions.enum';
import { applyDecorators, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { PageDto } from '@/shared/dtos/pagination/page.dto';
import { ResponseCompanyDto } from '../dto/company.dto';

export function FindAllCompanyDecorator() {
  return applyDecorators(
    Get(),
    RequirePermissions(Permissions.viewCompany),
    ApiOperation({
      summary: 'Get all companies',
      description: 'Retrieves a paginated list of all companies according to the provided pagination parameters',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Companies successfully retrieved',
      type: PageDto,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized access',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'Insufficient permissions to view companies',
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

export function FindOneCompanyDecorator() {
  return applyDecorators(
    Get(':id'),
    RequirePermissions(Permissions.viewUser),
    ApiOperation({
      summary: 'Get company by ID',
      description: 'Retrieves a company by their ID',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Company successfully retrieved',
      type: ResponseCompanyDto,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Company not found',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized access',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'Insufficient permissions to view company',
    }),
  );
}
