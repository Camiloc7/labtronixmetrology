import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailRequest, EmailRequestStatus } from './entities/email-request.entity';

@Injectable()
export class EmailRequestsService {
  constructor(
    @InjectRepository(EmailRequest)
    private readonly emailRequestsRepo: Repository<EmailRequest>,
  ) {}

  /** Extrae datos estructurados del texto del correo usando regex */
  private parseEmailContent(content: string): Record<string, any> {
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/gi;
    const phoneRegex = /(?:\+57\s?)?(?:3\d{9}|\d{7,10})/g;
    const nitRegex = /nit[:\s]*(\d{6,12}[-\d]*)/i;

    return {
      emails: content.match(emailRegex) || [],
      phones: content.match(phoneRegex) || [],
      nit: nitRegex.exec(content)?.[1] || null,
      equipments: this.extractEquipments(content),
      rawLength: content.length,
      parsedAt: new Date().toISOString(),
    };
  }

  private extractEquipments(content: string): string[] {
    const equipmentKeywords = [
      'balanza', 'báscula', 'termómetro', 'manómetro', 'calibrador',
      'micrómetro', 'vernier', 'cronómetro', 'voltímetro', 'amperímetro',
      'multímetro', 'transductor', 'sensor', 'higrómetro',
    ];
    const found: string[] = [];
    for (const kw of equipmentKeywords) {
      if (content.toLowerCase().includes(kw)) found.push(kw);
    }
    return found;
  }

  async findAll(): Promise<EmailRequest[]> {
    return this.emailRequestsRepo.find({ order: { createdAt: 'DESC' } });
  }

  async create(rawContent: string): Promise<EmailRequest> {
    const extractedData = this.parseEmailContent(rawContent);
    const req = this.emailRequestsRepo.create({ rawContent, extractedData });
    return this.emailRequestsRepo.save(req);
  }

  async process(id: string, userId: string, clientId?: string): Promise<EmailRequest> {
    const req = await this.emailRequestsRepo.findOne({ where: { id } });
    if (!req) throw new NotFoundException('Solicitud no encontrada');
    req.status = EmailRequestStatus.PROCESADO;
    req.processedById = userId;
    if (clientId) req.clientId = clientId;
    return this.emailRequestsRepo.save(req);
  }

  async discard(id: string, userId: string): Promise<EmailRequest> {
    const req = await this.emailRequestsRepo.findOne({ where: { id } });
    if (!req) throw new NotFoundException('Solicitud no encontrada');
    req.status = EmailRequestStatus.DESCARTADO;
    req.processedById = userId;
    return this.emailRequestsRepo.save(req);
  }
}
