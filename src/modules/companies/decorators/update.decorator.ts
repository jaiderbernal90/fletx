import { RequirePermissions } from '@/modules/auth/decorators/permissions.decorator';
import { Permissions } from '@/shared/enum/permissions.enum';
import { applyDecorators, HttpStatus, Patch } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponseCompanyDto } from '../dto/company.dto';

export function UpdateCompanyDecorator() {
  return applyDecorators(
    Patch(':id'),
    RequirePermissions(Permissions.updateCompany),
    ApiOperation({
      summary: 'Update company',
      description: 'Updates an existing company with the provided data',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Company successfully updated',
      type: ResponseCompanyDto,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Company not found',
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
      description: 'Insufficient permissions to update companies',
    }),
  );
}
