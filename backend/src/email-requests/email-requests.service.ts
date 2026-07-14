import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailRequest, EmailRequestStatus } from './entities/email-request.entity';
import { ExcelService } from '../common/excel/excel.service';

@Injectable()
export class EmailRequestsService {
  constructor(
    @InjectRepository(EmailRequest)
    private readonly emailRequestsRepo: Repository<EmailRequest>,
    private readonly excelService: ExcelService,
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

  async exportToExcel(): Promise<Buffer> {
    const requests = await this.emailRequestsRepo.find({ order: { createdAt: 'DESC' } });
    const data = requests.map(req => ({
      ID: req.id,
      ContenidoOriginal: req.rawContent,
      EmailsExtraidos: req.extractedData?.emails?.join(', ') || '',
      NITExtraido: req.extractedData?.nit || '',
      Estado: req.status,
      FechaCaptura: req.createdAt,
    }));
    return this.excelService.exportToExcel(data, 'SolicitudesEmail');
  }

  async importFromExcel(buffer: Buffer): Promise<{ total: number; created: number; updated: number }> {
    const data = await this.excelService.importFromExcel(buffer);
    let created = 0;
    let updated = 0;

    for (const row of data) {
      const id = row['ID'] ? String(row['ID']).trim() : null;
      const rawContent = row['ContenidoOriginal'];
      if (!rawContent) continue;

      let req: EmailRequest | null = null;
      if (id && id.length === 36) { 
        req = await this.emailRequestsRepo.findOne({ where: { id } });
      }

      if (req) {
        await this.emailRequestsRepo.save({
          ...req,
          status: (row['Estado'] as EmailRequestStatus) || req.status,
          rawContent,
        });
        updated++;
      } else {
        await this.create(rawContent);
        created++;
      }
    }

    return { total: data.length, created, updated };
  }
}
