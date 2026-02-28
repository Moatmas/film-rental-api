import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { Rental } from './rental.entity';
import { Customer } from '../customer/customer.entity';
import { CreateRentalDto } from './dto/create-rental.dto';
import { SchedulerService } from '../scheduler/scheduler.service';

const MIN_DAYS = 7;
const MAX_DAYS = 21;

@Injectable()
export class RentalService {
  constructor(
    @InjectRepository(Rental) private readonly rentalRepo: Repository<Rental>,
    @InjectRepository(Customer) private readonly customerRepo: Repository<Customer>,
    private readonly schedulerService: SchedulerService,
  ) {}

  async createRental(dto: CreateRentalDto): Promise<Rental> {
    const customer = await this.customerRepo.findOne({
      where: { customer_id: dto.customer_id },
    });
    if (!customer) throw new NotFoundException('Client introuvable');

    const tz = customer.timezone;

    const rentalDate = DateTime.fromISO(dto.rental_date, { zone: tz });
    const returnDate = DateTime.fromISO(dto.return_date, { zone: tz });

    if (!rentalDate.isValid || !returnDate.isValid) {
      throw new BadRequestException('Dates invalides');
    }

    const durationDays = returnDate.diff(rentalDate, 'days').days;

    if (durationDays < MIN_DAYS) {
      throw new BadRequestException(`Durée minimale : ${MIN_DAYS} jours`);
    }
    if (durationDays > MAX_DAYS) {
      throw new BadRequestException(`Durée maximale : ${MAX_DAYS} jours`);
    }

    const rental = this.rentalRepo.create({
      customer_id: dto.customer_id,
      inventory_id: dto.inventory_id,
      rental_date: rentalDate.toJSDate(),
      return_date: returnDate.toJSDate(),
      staff_id: 1, 
    });

    const saved = await this.rentalRepo.save(rental);

    await this.schedulerService.scheduleRentalNotifications(saved, customer);

    return saved;
  }

  async findAll(): Promise<Rental[]> {
    return this.rentalRepo.find({ relations: ['customer', 'notifications'] });
  }

  async findOne(id: number): Promise<Rental> {
    const rental = await this.rentalRepo.findOne({
      where: { rental_id: id },
      relations: ['customer', 'notifications'],
    });
    if (!rental) throw new NotFoundException('Location introuvable');
    return rental;
  }

  private isOngoing(rental: Rental): boolean {
    const now = new Date();
    return rental.rental_date <= now && (!rental.return_date || rental.return_date >= now);
  }
}