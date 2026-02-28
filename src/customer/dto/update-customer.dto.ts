import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString, IsEmail, IsOptional, IsBoolean,
  IsInt, IsPositive, MaxLength, IsTimeZone,
} from 'class-validator';

export class UpdateCustomerDto {
  @ApiPropertyOptional({ example: 'Marie' })
  @IsString() @MaxLength(45) @IsOptional()
  first_name?: string;

  @ApiPropertyOptional({ example: 'Dupont' })
  @IsString() @MaxLength(45) @IsOptional()
  last_name?: string;

  @ApiPropertyOptional({ example: 'marie@example.com' })
  @IsEmail() @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean() @IsOptional()
  activebool?: boolean;

  @ApiPropertyOptional({ example: 1 })
  @IsInt() @IsPositive() @IsOptional()
  store_id?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt() @IsPositive() @IsOptional()
  address_id?: number;

  @ApiPropertyOptional({
    example: 'America/New_York',
    description: 'Fuseau horaire IANA',
  })
  @IsTimeZone() @IsOptional()
  timezone?: string;
}