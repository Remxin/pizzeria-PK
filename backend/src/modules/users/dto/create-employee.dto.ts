import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '../../../common/enums/role.enum';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'employee@pizzeria.com' })
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;

  @ApiProperty({ example: 'Anna Nowak' })
  @IsString()
  @MaxLength(100)
  fullName: string;

  @ApiPropertyOptional({ example: '+48111222333' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiProperty({
    enum: [Role.EMPLOYEE, Role.ADMIN],
    example: Role.EMPLOYEE,
    description: 'Only EMPLOYEE or ADMIN — CLIENT accounts use POST /auth/register',
  })
  @IsIn([Role.EMPLOYEE, Role.ADMIN])
  role: Role.EMPLOYEE | Role.ADMIN;
}
