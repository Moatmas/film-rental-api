import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString, IsEmail, IsOptional, IsBoolean,
  IsInt, IsPositive, MaxLength, IsTimeZone,
} from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ example: 1, description: 'ID du magasin' })
  @IsInt() @IsPositive()
  store_id: number;

  @ApiProperty({ example: 'Marie', description: 'Prénom du client' })
  @IsString() @MaxLength(45)
  first_name: string;

  @ApiProperty({ example: 'Dupont', description: 'Nom du client' })
  @IsString() @MaxLength(45)
  last_name: string;

  @ApiPropertyOptional({ example: 'marie@example.com' })
  @IsEmail() @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsBoolean() @IsOptional()
  activebool?: boolean;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsInt() @IsPositive() @IsOptional()
  address_id?: number;

  @ApiPropertyOptional({
    example: 'Europe/Paris',
    description: 'Fuseau horaire IANA (ex: Europe/Paris, America/New_York, UTC)',
    default: 'UTC',
  })
  @IsTimeZone() @IsOptional()
  timezone?: string;
}