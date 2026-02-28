import {
  Controller, Get, Post, Param,
  Body, ParseIntPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { RentalService } from './rental.service';
import { CreateRentalDto } from './dto/create-rental.dto';

@ApiTags('rentals')
@Controller('rentals')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Get()
  @ApiOperation({ summary: 'Lister toutes les locations' })
  findAll() {
    return this.rentalService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une location par ID' })
  @ApiParam({ name: 'id', example: 1 })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rentalService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Effectuer une location',
    description: 'Durée entre 7 et 21 jours. Planifie automatiquement les notifications J-5 et J-3.',
  })
  @ApiResponse({ status: 201, description: 'Location créée, notifications planifiées' })
  @ApiResponse({ status: 400, description: 'Durée invalide ou dates incorrectes' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateRentalDto) {
    return this.rentalService.createRental(dto);
  }
}