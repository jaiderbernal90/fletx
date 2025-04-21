import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseCompanyDto {
  @Expose()
  @ApiProperty({
    description: 'Company id',
    example: 1,
  })
  id: number;

  @Expose()
  @ApiProperty({
    description: 'Name of the company',
    example: 'Acme Corporation',
  })
  name: string;
}
