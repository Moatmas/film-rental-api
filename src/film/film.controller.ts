import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { FilmService } from './film.service';

@ApiTags('films')
@Controller('films')
export class FilmController {
  constructor(private readonly filmService: FilmService) {}

  @Get()
  @ApiOperation({ summary: 'Lister tous les films (filtrable par titre)' })
  @ApiQuery({ name: 'title', required: false, example: 'Academy' })
  findAll(@Query('title') title?: string) {
    return this.filmService.findAll(title);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un film par ID' })
  @ApiParam({ name: 'id', example: 1 })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.filmService.findOne(id);
  }
}