import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rental } from './rental.entity';
import { Customer } from '../customer/customer.entity';
import { RentalService } from './rental.service';
import { RentalController } from './rental.controller';
import { SchedulerModule } from '../scheduler/scheduler.module';

@Module({
  imports: [TypeOrmModule.forFeature([Rental, Customer]), SchedulerModule],
  providers: [RentalService],
  controllers: [RentalController],
})
export class RentalModule {}