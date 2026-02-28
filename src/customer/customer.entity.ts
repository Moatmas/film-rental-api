import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Rental } from '../rental/rental.entity';

@Entity('customer')
export class Customer {
  @PrimaryGeneratedColumn({ name: 'customer_id' })
  customer_id: number;

  @Column({ name: 'store_id' })
  store_id: number;

  @Column({ name: 'first_name', length: 45 })
  first_name: string;

  @Column({ name: 'last_name', length: 45 })
  last_name: string;

  @Column({ name: 'email', length: 50, nullable: true })
  email: string;

  @Column({ name: 'activebool', default: true })
  activebool: boolean;

  @Column({ name: 'address_id', default: 1 })
  address_id: number;

  @Column({ name: 'timezone', length: 50, default: 'UTC' })
  timezone: string;

  @OneToMany(() => Rental, (rental) => rental.customer)
  rentals: Rental[];
}