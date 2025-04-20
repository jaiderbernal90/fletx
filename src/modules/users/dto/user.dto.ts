import { ApiProperty } from '@nestjs/swagger';
import {
  IsDecimal,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ResponseUserDto {
  @IsPhoneNumber('CO')
  @IsNotEmpty()
  @MaxLength(20)
  @ApiProperty({ description: 'User phone number', example: '+571234567890' })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({ description: 'User position', example: 'Developer' })
  position: string;

  @IsDecimal({ decimal_digits: '2' })
  @IsNotEmpty()
  @ApiProperty({ description: 'User salary', example: '1000.00' })
  salary: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'User role id', example: '1' })
  roleId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'User company id', example: '1' })
  companyId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({ description: 'User first name', example: 'John' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({ description: 'User last name', example: 'Doe' })
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(256)
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(30)
  @IsStrongPassword()
  @ApiProperty({ description: 'User password', example: 'password123' })
  password: string;
}
