import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsDateString } from 'class-validator';

export class CreateRentalDto {
  @ApiProperty({ example: 1, description: 'ID du client' })
  @IsInt() @IsPositive()
  customer_id: number;

  @ApiProperty({ example: 1, description: "ID de l'exemplaire (table inventory)" })
  @IsInt() @IsPositive()
  inventory_id: number;

  @ApiProperty({
    example: '2025-04-01',
    description: 'Date de début (ISO 8601) — interprétée dans le fuseau du client',
  })
  @IsDateString()
  rental_date: string;

  @ApiProperty({
    example: '2025-04-15',
    description: 'Date de retour (ISO 8601) — entre 7 et 21 jours après rental_date',
  })
  @IsDateString()
  return_date: string;
}