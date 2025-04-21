import { RequirePermissions } from '@/modules/auth/decorators/permissions.decorator';
import { Permissions } from '@/shared/enum/permissions.enum';
import { applyDecorators, Delete, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponseCompanyDto } from '../dto/company.dto';

export function DeleteCompanyDecorator() {
  return applyDecorators(
    Delete(':id'),
    RequirePermissions(Permissions.deleteCompany),
    ApiOperation({
      summary: 'Delete company',
      description: 'Deletes a company by their ID',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Company successfully deleted',
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
      description: 'Insufficient permissions to delete companies',
    }),
  );
}
