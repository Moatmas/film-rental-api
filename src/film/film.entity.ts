import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('film')
export class Film {
  @PrimaryGeneratedColumn()
  film_id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  release_year: number;

  @Column({ type: 'numeric', precision: 4, scale: 2 })
  rental_rate: number;

  @Column()
  rental_duration: number; // durée standard en jours (info Sakila)
}