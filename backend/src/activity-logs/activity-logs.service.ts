import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from './entities/activity-log.entity';

interface CreateLogDto {
  userId: string;
  action: string;
  resource: string;
  description?: string;
}

@Injectable()
export class ActivityLogsService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly logsRepo: Repository<ActivityLog>,
  ) {}

  async create(dto: CreateLogDto): Promise<ActivityLog> {
    const log = this.logsRepo.create({ ...dto });
    return this.logsRepo.save(log);
  }

  async findAll(limit = 100): Promise<ActivityLog[]> {
    return this.logsRepo.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
