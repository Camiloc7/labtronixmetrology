import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quote, QuoteStatus } from '../quotes/entities/quote.entity';
import { NotificationsService } from './notifications.service';
import { NotificationType } from './entities/notification.entity';

@Injectable()
export class NotificationsCron {
  private readonly logger = new Logger(NotificationsCron.name);

  constructor(
    @InjectRepository(Quote)
    private readonly quotesRepo: Repository<Quote>,
    private readonly notifService: NotificationsService,
  ) {}

  // Se ejecuta todos los días a las 00:00 (Hora Colombia)
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { timeZone: 'America/Bogota' })
  async checkExpiringQuotes() {
    this.logger.log('Revisando cotizaciones por expirar...');
    
    const expiringQuotes = await this.quotesRepo
      .createQueryBuilder('quote')
      .leftJoinAndSelect('quote.client', 'client')
      .where('quote.status IN (:...statuses)', { statuses: [QuoteStatus.BORRADOR, QuoteStatus.ENVIADA] })
      .andWhere("quote.valid_until BETWEEN NOW() AND NOW() + INTERVAL '7 days'")
      .getMany();

    let created = 0;
    for (const quote of expiringQuotes) {
      // Calcular días
      const daysLeft = Math.ceil((new Date(quote.validUntil).getTime() - Date.now()) / (1000 * 3600 * 24));
      
      // Evitar crear la misma notificación repetidamente el mismo día
      // Creamos la alerta "por vencer"
      await this.notifService.create({
        type: NotificationType.QUOTE_EXPIRING,
        title: 'Cotización por expirar',
        message: `La cotización ${quote.quoteNumber} de ${quote.client?.companyName} vence en ${daysLeft} días.`,
        referenceId: quote.id,
      });
      created++;
    }

    this.logger.log(`Se crearon ${created} notificaciones de expiración.`);
  }
}
