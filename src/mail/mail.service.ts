import { Injectable, Logger } from '@nestjs/common';
import { DateTime } from 'luxon';

export interface MailPayload {
  to:            string;
  customerName:  string;
  rentalId:      number;
  returnDate:    Date;
  daysRemaining: number;
  timezone:      string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  async sendRentalReminderEmail(payload: MailPayload): Promise<void> {
    const returnDateFormatted = DateTime.fromJSDate(payload.returnDate, {
      zone: payload.timezone,
    }).toFormat('dd/MM/yyyy à HH:mm');

    this.logger.log(
      '\n' +
      '┌─────────────────────────────────────────────────────┐\n' +
      '│                   EMAIL SIMULÉ                      │\n' +
      '├─────────────────────────────────────────────────────┤\n' +
      `│  À        : ${payload.to}\n` +
      `│  Objet    : Rappel retour - Location #${payload.rentalId}\n` +
      '├─────────────────────────────────────────────────────┤\n' +
      `│  Bonjour ${payload.customerName},\n` +
      `│  Votre location #${payload.rentalId} arrive à échéance\n` +
      `│  dans ${payload.daysRemaining} jours.\n` +
      `│  Date de retour : ${returnDateFormatted}\n` +
      `│  Fuseau horaire : ${payload.timezone}\n` +
      '└─────────────────────────────────────────────────────┘',
    );

    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}