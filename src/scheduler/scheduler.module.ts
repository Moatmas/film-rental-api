// src/scheduler/scheduler.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduledNotification } from './scheduled-notification.entity';
import { SchedulerService } from './scheduler.service';
import { SchedulerController } from './scheduler.controller';
import { Rental } from '../rental/rental.entity';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([ScheduledNotification, Rental])],
  providers: [SchedulerService, MailService],
  controllers: [SchedulerController],
  exports: [SchedulerService],
})
export class SchedulerModule {}