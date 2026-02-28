import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, OneToMany,
} from 'typeorm';
import { Customer } from '../customer/customer.entity';
import { Film } from '../film/film.entity';
import { ScheduledNotification } from '../scheduler/scheduled-notification.entity';

@Entity('rental')
export class Rental {
  @PrimaryGeneratedColumn()
  rental_id: number;

  @Column({ type: 'timestamptz' })
  rental_date: Date;

  @Column({ type: 'timestamptz', nullable: true })
  return_date: Date;

  @Column()
  customer_id: number;

  @Column()
  inventory_id: number;

  @Column({ nullable: true })
  staff_id: number;

  @ManyToOne(() => Customer, (c) => c.rentals)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => Film)
  @JoinColumn({ name: 'inventory_id', referencedColumnName: 'film_id' })
  film: Film;

  @OneToMany(() => ScheduledNotification, (n) => n.rental)
  notifications: ScheduledNotification[];
}