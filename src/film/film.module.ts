import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film } from './film.entity';
import { FilmService } from './film.service';
import { FilmController } from './film.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Film])],
  providers: [FilmService],
  controllers: [FilmController],
  exports: [FilmService],
})
export class FilmModule {}