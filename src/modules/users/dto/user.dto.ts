import { ApiProperty } from '@nestjs/swagger';

export class ResponseUserDto {
  @ApiProperty({ description: 'User phone number', example: '+571234567890' })
  phone: string;

  @ApiProperty({ description: 'User position', example: 'Developer' })
  position: string;

  @ApiProperty({ description: 'User salary', example: '1000.00' })
  salary: number;

  @ApiProperty({ description: 'User role id', example: '1' })
  roleId: number;

  @ApiProperty({ description: 'User company id', example: '1' })
  companyId: number;

  @ApiProperty({ description: 'User first name', example: 'John' })
  name: string;

  @ApiProperty({ description: 'User last name', example: 'Doe' })
  lastName: string;

  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  email: string;
}
