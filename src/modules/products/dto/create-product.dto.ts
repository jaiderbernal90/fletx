import { CompanyExistValidator } from '@/modules/users/validators/company-id.validations';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength, Validate } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Name of the product',
    example: 'Product name',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Price of the product',
    example: 299.99,
    type: Number,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'Company id',
    example: 1,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  @Validate(CompanyExistValidator)
  companyId: number;
}
