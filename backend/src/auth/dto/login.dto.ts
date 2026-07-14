import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@labtronix.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Admin2026!' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
