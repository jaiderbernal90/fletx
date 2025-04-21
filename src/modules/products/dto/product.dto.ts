import { ResponseCompanyDto } from '@/modules/companies/dto/company.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class ResponseProductDto {
  @Expose()
  @ApiProperty({
    description: 'Product id',
    example: 1,
  })
  id: number;

  @Expose()
  @ApiProperty({
    description: 'Product name',
    example: 'Product name',
  })
  name: string;

  @Expose()
  @ApiProperty({
    description: 'Product price',
    example: 299.99,
  })
  price: number;

  @Expose()
  @Type(() => ResponseCompanyDto)
  @ApiProperty({
    description: 'Company of the product',
    type: ResponseCompanyDto,
  })
  company: ResponseCompanyDto;
}
