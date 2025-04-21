import { applyDecorators, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PageDto } from '@/shared/dtos/pagination/page.dto';
import { ResponseCompanyDto } from '../dto/company.dto';

export function LocationCitiesDecorator() {
  return applyDecorators(
    Get('cities/:departmentId'),
    ApiOperation({
      summary: 'Get all cities for a department',
      description: 'Retrieves list of all cities according to the provided pagination parameters',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Cities successfully retrieved',
      type: PageDto,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized access',
    }),
  );
}

export function LocationDepartmentsDecorator() {
  return applyDecorators(
    Get('departments'),
    ApiOperation({
      summary: 'Get departments',
      description: 'Retrieves a company by their ID',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Departments successfully retrieved',
      type: ResponseCompanyDto,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized access',
    }),
  );
}
