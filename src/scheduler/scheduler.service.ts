import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { DateTime } from 'luxon';
import {
  ScheduledNotification,
  NotificationType,
} from './scheduled-notification.entity';
import { Rental } from '../rental/rental.entity';
import { Customer } from '../customer/customer.entity';
import { MailService } from '../mail/mail.service';

const ALLOWED_CRON_NAMES = ['reminder-J-5', 'reminder-J-3'] as const;
type CronName = typeof ALLOWED_CRON_NAMES[number];

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    @InjectRepository(ScheduledNotification)
    private readonly notifRepo: Repository<ScheduledNotification>,
    @InjectRepository(Rental)
    private readonly rentalRepo: Repository<Rental>,
    private readonly mailService: MailService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}


  async scheduleRentalNotifications(
    rental: Rental,
    customer: Customer,
  ): Promise<ScheduledNotification[]> {
    const tz = customer.timezone;
    const returnDate = DateTime.fromJSDate(rental.return_date, { zone: tz });

    const notifications: Partial<ScheduledNotification>[] = [];

    for (const type of ['J-5', 'J-3'] as NotificationType[]) {
      const daysOffset = type === 'J-5' ? 5 : 3;

      const scheduledAt = returnDate
        .minus({ days: daysOffset })
        .set({ hour: 12, minute: 0, second: 0, millisecond: 0 });

      const now = new Date();
      const status = scheduledAt.toJSDate() < now ? 'SKIPPED' : 'PENDING';

      if (status === 'SKIPPED') {
        this.logger.warn(
          `[${type}] Notification SKIPPED pour location #${rental.rental_id} ` +
          `(date passée : ${scheduledAt.toISO()})`,
        );
      }

      notifications.push({
        rental_id:    rental.rental_id,
        type,
        scheduled_at: scheduledAt.toJSDate(),
        status,
      });
    }

    const saved = await this.notifRepo.save(notifications);
    this.logger.log(
      `✓ Notifications planifiées pour location #${rental.rental_id} ` +
      `(${customer.email}, tz: ${tz})`,
    );
    return saved;
  }

  // ── CRON : tous les jours à 12h00 UTC ──────

  @Cron('0 12 * * *', { name: 'reminder-J-5', timeZone: 'UTC' })
  async handleJ5Reminder(): Promise<void> {
    this.logger.log('[CRON] Déclenchement reminder-J-5');
    await this.processNotifications('J-5');
  }

  @Cron('0 12 * * *', { name: 'reminder-J-3', timeZone: 'UTC' })
  async handleJ3Reminder(): Promise<void> {
    this.logger.log('[CRON] Déclenchement reminder-J-3');
    await this.processNotifications('J-3');
  }


  async processNotifications(type: NotificationType): Promise<number> {
    const now = new Date();

    const pending = await this.notifRepo.find({
      where: {
        type,
        status: 'PENDING',
        scheduled_at: LessThanOrEqual(now),
      },
      relations: ['rental', 'rental.customer'],
    });

    this.logger.log(`[${type}] ${pending.length} notification(s) à traiter`);

    let sent = 0;
    for (const notif of pending) {
      await this.sendNotification(notif);
      sent++;
    }
    return sent;
  }

  private async sendNotification(
    notif: ScheduledNotification,
  ): Promise<void> {
    const { rental } = notif;
    const customer = rental.customer;
    const daysRemaining = notif.type === 'J-5' ? 5 : 3;

    try {
      await this.mailService.sendRentalReminderEmail({
        to:           customer.email,
        customerName: `${customer.first_name} ${customer.last_name}`,
        rentalId:     rental.rental_id,
        returnDate:   rental.return_date,
        daysRemaining,
        timezone:     customer.timezone,
      });

      notif.status      = 'SENT';
      notif.executed_at = new Date();
      this.logger.log(
        `✓ Email envoyé → ${customer.email} [${notif.type}] rental#${rental.rental_id}`,
      );
    } catch (err) {
      notif.status        = 'FAILED';
      notif.executed_at   = new Date();
      notif.error_message = (err as Error).message;
      this.logger.error(
        `✗ Échec email → ${customer.email} : ${(err as Error).message}`,
      );
    }

    await this.notifRepo.save(notif);
  }


  async findAllNotifications(): Promise<ScheduledNotification[]> {
    return this.notifRepo.find({
      order: { scheduled_at: 'ASC' },
      relations: ['rental', 'rental.customer'],
    });
  }


  async triggerManually(id: number): Promise<ScheduledNotification> {
    const notif = await this.notifRepo.findOne({
      where: { id },
      relations: ['rental', 'rental.customer'],
    });
    if (!notif) throw new NotFoundException(`Notification #${id} introuvable`);
    if (notif.status === 'SENT') {
      throw new BadRequestException(
        `Notification #${id} déjà envoyée (status: SENT)`,
      );
    }

    notif.status = 'PENDING';
    await this.sendNotification(notif);
    return notif;
  }


  async getNotificationStatus(id: number): Promise<ScheduledNotification> {
    const notif = await this.notifRepo.findOne({
      where: { id },
      relations: ['rental'],
    });
    if (!notif) throw new NotFoundException(`Notification #${id} introuvable`);
    return notif;
  }


  async triggerCronByName(name: CronName): Promise<{ processed: number }> {
    if (!ALLOWED_CRON_NAMES.includes(name)) {
      throw new BadRequestException(
        `Nom de CRON invalide. Valeurs autorisées : ${ALLOWED_CRON_NAMES.join(', ')}`,
      );
    }
    const type: NotificationType = name === 'reminder-J-5' ? 'J-5' : 'J-3';
    const processed = await this.processNotifications(type);
    return { processed };
  }


  getCronJobs(): Record<string, { next: Date | null }> {
    const result: Record<string, { next: Date | null }> = {};
    for (const name of ALLOWED_CRON_NAMES) {
      try {
        const job = this.schedulerRegistry.getCronJob(name);
        result[name] = { next: job.nextDate().toJSDate() };
      } catch {
        result[name] = { next: null };
      }
    }
    return result;
  }
}