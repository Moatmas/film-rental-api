import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Film } from './film.entity';

@Injectable()
export class FilmService {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepo: Repository<Film>,
  ) {}

  async findAll(title?: string): Promise<Film[]> {
    if (title) {
      return this.filmRepo.find({
        where: { title: ILike(`%${title}%`) },
        order: { title: 'ASC' },
      });
    }
    return this.filmRepo.find({ order: { title: 'ASC' } });
  }

  async findOne(id: number): Promise<Film> {
    const film = await this.filmRepo.findOne({ where: { film_id: id } });
    if (!film) throw new NotFoundException(`Film #${id} introuvable`);
    return film;
  }
}