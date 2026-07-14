import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Response } from 'express';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PdfPrinter = require('pdfmake/src/printer');
import { Quote } from './entities/quote.entity';
import { QuoteItem } from './entities/quote-item.entity';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { Client } from '../clients/entities/client.entity';

@Injectable()
export class QuotesService {
  constructor(
    @InjectRepository(Quote)
    private readonly quotesRepo: Repository<Quote>,
    @InjectRepository(QuoteItem)
    private readonly itemsRepo: Repository<QuoteItem>,
    @InjectRepository(Client)
    private readonly clientsRepo: Repository<Client>,
  ) {}

  private async generateQuoteNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.quotesRepo.count();
    return `COT-${year}-${String(count + 1).padStart(4, '0')}`;
  }

  async findAll(): Promise<Quote[]> {
    return this.quotesRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Quote> {
    const quote = await this.quotesRepo.findOne({ where: { id } });
    if (!quote) throw new NotFoundException(`Cotización ${id} no encontrada`);
    return quote;
  }

  async create(dto: CreateQuoteDto, userId: string): Promise<Quote> {
    const quoteNumber = await this.generateQuoteNumber();
    const items = dto.items.map((item) => {
      const qi = new QuoteItem();
      qi.description = item.description;
      qi.quantity = item.quantity;
      qi.unitPrice = item.unitPrice;
      qi.subtotal = item.quantity * item.unitPrice;
      return qi;
    });
    const totalValue = items.reduce((sum, i) => sum + Number(i.subtotal), 0);

    const quote = this.quotesRepo.create({
      quoteNumber,
      clientId: dto.clientId,
      createdById: userId,
      status: dto.status,
      notes: dto.notes,
      validUntil: dto.validUntil ? new Date(dto.validUntil) : undefined,
      totalValue,
      items,
    });
    return this.quotesRepo.save(quote);
  }

  async update(id: string, dto: Partial<CreateQuoteDto>): Promise<Quote> {
    const quote = await this.findOne(id);
    if (dto.items) {
      await this.itemsRepo.delete({ quoteId: id });
      const newItems = dto.items.map((item) => {
        const qi = new QuoteItem();
        qi.description = item.description;
        qi.quantity = item.quantity;
        qi.unitPrice = item.unitPrice;
        qi.subtotal = item.quantity * item.unitPrice;
        qi.quoteId = id;
        return qi;
      });
      await this.itemsRepo.save(newItems);
      const totalValue = newItems.reduce((s, i) => s + Number(i.subtotal), 0);
      quote.totalValue = totalValue;
    }
    return this.quotesRepo.save({ ...quote, ...dto, items: undefined });
  }

  async generatePdf(id: string, res: Response): Promise<void> {
    const quote = await this.findOne(id);
    const client = await this.clientsRepo.findOne({ where: { id: quote.clientId } });

    const fonts = {
      Roboto: {
        normal: 'node_modules/pdfmake/build/vfs_fonts.js',
        bold: 'node_modules/pdfmake/build/vfs_fonts.js',
        italics: 'node_modules/pdfmake/build/vfs_fonts.js',
        bolditalics: 'node_modules/pdfmake/build/vfs_fonts.js',
      },
    };

    const printer = new PdfPrinter(fonts);

    const docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      defaultStyle: { font: 'Roboto', fontSize: 10 },
      content: [
        {
          columns: [
            { text: 'LABTRONIX METROLOGÍA', style: 'header', width: '*' },
            {
              text: [`Cotización: `, { text: quote.quoteNumber, bold: true }],
              alignment: 'right',
              width: 'auto',
            },
          ],
          margin: [0, 0, 0, 20],
        },
        {
          table: {
            widths: ['*', '*'],
            body: [
              [
                { text: 'DATOS DEL CLIENTE', bold: true, colSpan: 2, fillColor: '#ec060b', color: '#ffffff' },
                {},
              ],
              ['Empresa:', client?.companyName || ''],
              ['NIT:', client?.nit || ''],
              ['Contacto:', client?.contactName || ''],
              ['Email:', client?.email || ''],
              ['Ciudad:', client?.city || ''],
            ],
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 20],
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'Descripción', style: 'tableHeader', fillColor: '#0a0a0a', color: '#ffffff' },
                { text: 'Cant.', style: 'tableHeader', fillColor: '#0a0a0a', color: '#ffffff' },
                { text: 'Precio Unit.', style: 'tableHeader', fillColor: '#0a0a0a', color: '#ffffff' },
                { text: 'Subtotal', style: 'tableHeader', fillColor: '#0a0a0a', color: '#ffffff' },
              ],
              ...quote.items.map((item) => [
                item.description,
                item.quantity.toString(),
                `$${Number(item.unitPrice).toLocaleString('es-CO')}`,
                `$${Number(item.subtotal).toLocaleString('es-CO')}`,
              ]),
              [
                { text: 'TOTAL', bold: true, colSpan: 3, alignment: 'right' },
                {},
                {},
                { text: `$${Number(quote.totalValue).toLocaleString('es-CO')}`, bold: true },
              ],
            ],
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 20],
        },
        quote.notes ? { text: `Observaciones: ${quote.notes}`, italics: true } : {},
        quote.validUntil
          ? { text: `Válida hasta: ${new Date(quote.validUntil).toLocaleDateString('es-CO')}`, margin: [0, 10, 0, 0] }
          : {},
        {
          text: 'Jhonatan Camilo Corredor Silva – Consultor Labtronix',
          margin: [0, 40, 0, 0],
          alignment: 'center',
          italics: true,
          color: '#666666',
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true, color: '#ec060b' },
        tableHeader: { bold: true, fontSize: 10 },
      },
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${quote.quoteNumber}.pdf"`);
    pdfDoc.pipe(res);
    pdfDoc.end();
  }
}
