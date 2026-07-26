import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notifRepo: Repository<Notification>,
  ) {}

  async create(data: Partial<Notification>) {
    const notif = this.notifRepo.create(data);
    return this.notifRepo.save(notif);
  }

  async getRecent(days: number = 30) {
    return this.notifRepo
      .createQueryBuilder('n')
      .where("n.created_at >= NOW() - INTERVAL '30 days'")
      .orderBy('n.created_at', 'DESC')
      .getMany();
  }

  async getUnreadCount() {
    return this.notifRepo.count({ where: { isRead: false } });
  }

  async markAsRead(id: string) {
    const notif = await this.notifRepo.findOne({ where: { id } });
    if (!notif) throw new NotFoundException('Notificación no encontrada');
    notif.isRead = true;
    return this.notifRepo.save(notif);
  }
}
