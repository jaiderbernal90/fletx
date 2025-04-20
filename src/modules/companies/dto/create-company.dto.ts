import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
  Validate,
  ValidateIf,
} from 'class-validator';
import { CityExistValidator } from '../validators/city-id.validations';
import { DepartmentExistValidator } from '../validators/department-id.validations';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({ description: 'Company name', example: 'Company name' })
  name: string;

  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({ description: 'Company sectoy', example: 'Technology' })
  sector: string;

  @IsPhoneNumber('CO')
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(4)
  @ApiProperty({ description: 'Company phone number', example: '+571234567890' })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Company address', example: 'Address' })
  address: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Company actives and passives', example: 'Actives and passives' })
  activesAndPassives: string;

  @IsNumber()
  @ApiProperty({ description: 'Company city id', example: '1' })
  @ValidateIf(o => o.cityId !== null)
  @Validate(CityExistValidator)
  cityId: number;

  @IsNumber()
  @ApiProperty({ description: 'Company department id', example: '1' })
  @ValidateIf(o => o.departmentId !== null)
  @Validate(DepartmentExistValidator)
  departmentId: number;
}
