import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn,
} from 'typeorm';
import { Rental } from '../rental/rental.entity';

export type NotificationType = 'J-5' | 'J-3';
export type NotificationStatus = 'PENDING' | 'SENT' | 'FAILED' | 'SKIPPED';

@Entity('scheduled_notification')
export class ScheduledNotification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rental_id: number;

  @Column({ type: 'varchar', length: 10 })
  type: NotificationType;

  @Column({ type: 'timestamptz' })
  scheduled_at: Date;

  @Column({ type: 'varchar', length: 20, default: 'PENDING' })
  status: NotificationStatus;

  @Column({ type: 'timestamptz', nullable: true })
  executed_at: Date;

  @Column({ type: 'text', nullable: true })
  error_message: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Rental, (r) => r.notifications)
  @JoinColumn({ name: 'rental_id' })
  rental: Rental;
}