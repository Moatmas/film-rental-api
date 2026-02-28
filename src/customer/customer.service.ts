import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { IANAZone } from 'luxon';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) {}

  async findAll(): Promise<Customer[]> {
    return this.customerRepo.find({ order: { customer_id: 'ASC' } });
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customerRepo.findOne({
      where: { customer_id: id },
      relations: ['rentals'],
    });
    if (!customer) throw new NotFoundException(`Client #${id} introuvable`);
    return customer;
  }

  async create(dto: CreateCustomerDto): Promise<Customer> {
    this.validateTimezone(dto.timezone);

    const customer = this.customerRepo.create({
      store_id:   dto.store_id,
      first_name: dto.first_name,
      last_name:  dto.last_name,
      email:      dto.email,
      activebool: dto.activebool ?? true,
      address_id: dto.address_id ?? 1,
      timezone:   dto.timezone ?? 'UTC',
    });

    return this.customerRepo.save(customer);
  }

  async update(id: number, dto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id);

    if (dto.timezone) this.validateTimezone(dto.timezone);

    Object.assign(customer, dto);
    return this.customerRepo.save(customer);
  }

  private validateTimezone(tz?: string): void {
    if (!tz) return;
    if (!IANAZone.isValidZone(tz)) {
      throw new BadRequestException(
        `Fuseau horaire invalide : "${tz}". Utilisez un identifiant IANA valide (ex: "Europe/Paris", "UTC").`,
      );
    }
  }
}