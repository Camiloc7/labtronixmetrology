import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Response } from 'express';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PdfPrinter = require('pdfmake');
import { Quote, QuoteStatus } from './entities/quote.entity';
import { QuoteHistory, QuoteHistoryAction } from './entities/quote-history.entity';
import { QuoteItem } from './entities/quote-item.entity';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { Client } from '../clients/entities/client.entity';
import { ExcelService } from '../common/excel/excel.service';
import { SettingsService } from '../settings/settings.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/entities/notification.entity';
import * as fs from 'fs';
import * as path from 'path';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { ILike } from 'typeorm';

@Injectable()
export class QuotesService implements OnModuleInit {
  constructor(
    @InjectRepository(Quote)
    private readonly quotesRepo: Repository<Quote>,
    @InjectRepository(QuoteItem)
    private readonly itemsRepo: Repository<QuoteItem>,
    @InjectRepository(QuoteHistory)
    private readonly historyRepo: Repository<QuoteHistory>,
    @InjectRepository(Client)
    private readonly clientsRepo: Repository<Client>,
    private readonly excelService: ExcelService,
    private readonly settingsService: SettingsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async onModuleInit() {
    await this.quotesRepo.query(`CREATE SEQUENCE IF NOT EXISTS quote_number_seq START 1`);
    const [lastQuote] = await this.quotesRepo.find({ order: { createdAt: 'DESC' }, take: 1 });
    if (lastQuote && lastQuote.quoteNumber) {
      const parts = lastQuote.quoteNumber.split('-');
      if (parts.length === 3) {
        const lastNum = parseInt(parts[2], 10);
        if (!isNaN(lastNum)) {
          await this.quotesRepo.query(`SELECT setval('quote_number_seq', $1, true)`, [lastNum]);
        }
      }
    }
  }

  private async generateQuoteNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const result = await this.quotesRepo.query(`SELECT nextval('quote_number_seq')`);
    const nextNumber = result[0].nextval;
    return `COT-${year}-${String(nextNumber).padStart(4, '0')}`;
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Quote>> {
    const { page = 1, limit = 10, search } = paginationDto;
    const skip = (page - 1) * limit;

    const where = search
      ? [
          { quoteNumber: ILike(`%${search}%`) },
        ]
      : {};

    const [data, total] = await this.quotesRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      take: limit,
      skip,
    });

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        limit,
      },
    };
  }

  async findOne(id: string): Promise<Quote> {
    const quote = await this.quotesRepo.findOne({
      where: { id },
      relations: { items: true, client: true, createdBy: true },
    });
    if (!quote) throw new NotFoundException(`Cotización ${id} no encontrada`);
    return quote;
  }

  async create(dto: CreateQuoteDto, userId: string): Promise<Quote> {
    const items = dto.items.map((item) => {
      const qi = new QuoteItem();
      qi.description = item.description;
      qi.quantity = item.quantity;
      qi.unitPrice = item.unitPrice;
      qi.subtotal = item.quantity * item.unitPrice;
      qi.serviceType = item.serviceType || '';
      qi.equipmentName = item.equipmentName || '';
      qi.measuringRange = item.measuringRange || '';
      qi.scaleDivision = item.scaleDivision || '';
      qi.brand = item.brand || '';
      qi.model = item.model || '';
      qi.serialNumber = item.serialNumber || '';
      qi.internalCode = item.internalCode || '';
      qi.location = item.location || '';
      qi.calibrationPoints = item.calibrationPoints || '';
      return qi;
    });
    const totalValue = items.reduce((sum, i) => sum + Number(i.subtotal), 0);

    let retries = 3;
    while (retries > 0) {
      try {
        const quoteNumber = await this.generateQuoteNumber();
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
        
        return await this.quotesRepo.manager.transaction(async (manager) => {
          const savedQuote = await manager.save(quote);
          
          const history = manager.create(QuoteHistory, {
            quoteId: savedQuote.id,
            userId,
            action: QuoteHistoryAction.CREATED,
            changes: { initialTotal: totalValue, initialStatus: dto.status },
          });
          await manager.save(history);
          
          return savedQuote;
        });
      } catch (error: any) {
        if (error.code === '23505' && retries > 1) {
          retries--;
          await new Promise(resolve => setTimeout(resolve, Math.random() * 90 + 10));
          continue;
        }
        throw error;
      }
    }
    throw new Error('Could not generate unique quoteNumber');
  }

  async update(id: string, dto: Partial<CreateQuoteDto>, userId?: string): Promise<Quote> {
    const quote = await this.findOne(id);
    
    if (quote.status === QuoteStatus.APROBADA || quote.status === QuoteStatus.RECHAZADA) {
      throw new Error('No se puede editar una cotización aprobada o rechazada.');
    }

    const changes: any = {};
    if (dto.status && dto.status !== quote.status) changes.status = { old: quote.status, new: dto.status };
    if (dto.notes !== undefined && dto.notes !== quote.notes) changes.notes = { old: quote.notes, new: dto.notes };
    if (dto.validUntil) {
      const newValid = new Date(dto.validUntil).toISOString().split('T')[0];
      const oldValid = quote.validUntil ? new Date(quote.validUntil).toISOString().split('T')[0] : null;
      if (newValid !== oldValid) changes.validUntil = { old: oldValid, new: newValid };
    }

    let newItems: QuoteItem[] = [];
    if (dto.items) {
      changes.items = { old: quote.items.length, new: dto.items.length };
      newItems = dto.items.map((item) => {
        const qi = new QuoteItem();
        qi.description = item.description;
        qi.quantity = item.quantity;
        qi.unitPrice = item.unitPrice;
        qi.subtotal = item.quantity * item.unitPrice;
        qi.serviceType = item.serviceType || '';
        qi.equipmentName = item.equipmentName || '';
        qi.measuringRange = item.measuringRange || '';
        qi.scaleDivision = item.scaleDivision || '';
        qi.brand = item.brand || '';
        qi.model = item.model || '';
        qi.serialNumber = item.serialNumber || '';
        qi.internalCode = item.internalCode || '';
        qi.location = item.location || '';
        qi.calibrationPoints = item.calibrationPoints || '';
        qi.quoteId = id;
        return qi;
      });
      const totalValue = newItems.reduce((s, i) => s + Number(i.subtotal), 0);
      if (totalValue !== Number(quote.totalValue)) {
        changes.totalValue = { old: Number(quote.totalValue), new: totalValue };
      }
    }

    if (Object.keys(changes).length === 0) return quote; // Nothing changed

    return await this.quotesRepo.manager.transaction(async (manager) => {
      if (dto.items) {
        await manager.delete(QuoteItem, { quoteId: id });
        await manager.save(QuoteItem, newItems);
      }
      
      const updatedQuote = await manager.save(Quote, { 
        ...quote, 
        ...dto, 
        totalValue: newItems.length > 0 ? newItems.reduce((s, i) => s + Number(i.subtotal), 0) : quote.totalValue,
        items: undefined 
      }) as Quote;

      if (dto.status === QuoteStatus.APROBADA) {
        await this.notificationsService.create({
          type: NotificationType.QUOTE_APPROVED,
          title: 'Cotización Aprobada',
          message: `La cotización ${updatedQuote.quoteNumber} de ${updatedQuote.client?.companyName || 'cliente'} por ${updatedQuote.totalValue} ha sido aprobada.`,
          referenceId: updatedQuote.id,
        });
      }

      if (userId) {
        const action = changes.status ? QuoteHistoryAction.STATUS_CHANGED : QuoteHistoryAction.UPDATED;
        const history = manager.create(QuoteHistory, {
          quoteId: id,
          userId,
          action,
          changes,
        });
        await manager.save(history);
      }

      return updatedQuote;
    });
  }

  async getHistory(id: string): Promise<QuoteHistory[]> {
    return this.historyRepo.find({
      where: { quoteId: id },
      order: { createdAt: 'DESC' },
    });
  }

  async generatePdf(id: string, res: Response): Promise<void> {
    const quote = await this.findOne(id);
    const client = await this.clientsRepo.findOne({ where: { id: quote.clientId } });

    // Fetch settings with fallbacks
    const companyAddress = await this.settingsService.getValue('company_address', 'Carrera 106 # 15 - 25 Manzana 14 - Bodega 92 zona franca Fontibón');
    const companyPhones = await this.settingsService.getValue('company_phones', '3115111439 / 4238000 EXT: 33373 - 33374 - 33320 - 33324 - 33290.');
    const companyCity = await this.settingsService.getValue('company_city', 'Bogotá D.C.');

    const fonts = {
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
      },
    };
    const printer = new PdfPrinter(fonts);
    
    // Attempt to load logo from frontend/public
    let logoBase64: string | null = null;
    try {
      const logoPath = path.join(process.cwd(), '..', 'frontend', 'public', 'logo.png');
      if (fs.existsSync(logoPath)) {
        logoBase64 = 'data:image/png;base64,' + fs.readFileSync(logoPath).toString('base64');
      }
    } catch (e) {
      console.warn('Logo not found or could not be loaded', e);
    }

    const docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [30, 30, 30, 30],
      defaultStyle: { font: 'Helvetica', fontSize: 8 },
      content: [
        // TOP HEADER
        {
          table: {
            widths: ['35%', '15%', '15%', '35%'],
            body: [
              [
                { 
                  image: logoBase64 || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', // transparent 1x1 fallback
                  width: 120, 
                  rowSpan: 4, 
                  alignment: 'center', 
                  margin: [0, 10, 0, 0] 
                },
                { text: 'CONSECUTIVO:', bold: true, alignment: 'right', fontSize: 8, margin: [0, 10, 0, 0] },
                { text: quote.quoteNumber, alignment: 'center', fontSize: 8, margin: [0, 10, 0, 0] },
                { text: '', rowSpan: 4 } // Reserved for extra info or spacing
              ],
              [
                '',
                { text: 'FECHA :', bold: true, alignment: 'right', fontSize: 8 },
                { text: new Date(quote.createdAt).toISOString().split('T')[0], alignment: 'center', fontSize: 8 },
                ''
              ],
              [
                '',
                { text: 'DIRECCIÓN:', bold: true, alignment: 'right', fontSize: 8 },
                { text: companyAddress, alignment: 'center', fontSize: 8, colSpan: 2 },
                ''
              ],
              [
                '',
                { text: 'TELÉFONOS:', bold: true, alignment: 'right', fontSize: 8 },
                { text: companyPhones, alignment: 'center', fontSize: 8, colSpan: 2 },
                ''
              ],
              [
                { text: 'RAZON SOCIAL:', bold: true, alignment: 'right', fontSize: 8 },
                { text: client?.companyName || '', alignment: 'center', fontSize: 8, colSpan: 2 },
                '',
                { text: `CIUDAD:\n${companyCity}`, alignment: 'center', fontSize: 8, rowSpan: 4 }
              ],
              [
                { text: 'NIT:', bold: true, alignment: 'right', fontSize: 8 },
                { text: client?.nit || '', alignment: 'center', fontSize: 8, colSpan: 2 },
                '',
                ''
              ],
              [
                { text: 'CONTACTO:', bold: true, alignment: 'right', fontSize: 8 },
                { text: client?.contactName || '', alignment: 'center', fontSize: 8, colSpan: 2 },
                '',
                ''
              ],
              [
                { text: 'E-MAIL:', bold: true, alignment: 'right', fontSize: 8 },
                { text: client?.email || '', alignment: 'center', fontSize: 8, colSpan: 2 },
                '',
                ''
              ]
            ]
          },
          layout: {
            hLineWidth: function (i, node) { return 1; },
            vLineWidth: function (i, node) { return 1; },
            hLineColor: function (i, node) { return '#0000ff'; }, // Blue borders based on image
            vLineColor: function (i, node) { return '#0000ff'; },
          },
          margin: [0, 0, 0, 10],
        },
        
        // MAIN TABLE
        {
          table: {
            headerRows: 2,
            widths: ['auto', '*', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'DESCRIPCIÓN', bold: true, colSpan: 5, alignment: 'center', fillColor: '#b30000', color: 'white', fontSize: 9 },
                {}, {}, {}, {}
              ],
              [
                { text: 'ÍTEM', bold: true, alignment: 'center', fillColor: '#b30000', color: 'white' },
                { text: 'INSTRUMENTO\n(Detallar Marca, Modelo, Cap. Máxima, División escala)', bold: true, alignment: 'center', fillColor: '#b30000', color: 'white' },
                { text: 'CANTIDAD', bold: true, alignment: 'center', fillColor: '#b30000', color: 'white' },
                { text: 'VALOR UNITARIO', bold: true, alignment: 'center', fillColor: '#b30000', color: 'white' },
                { text: 'VALOR TOTAL', bold: true, alignment: 'center', fillColor: '#b30000', color: 'white' }
              ],
              // Items
              ...quote.items.map((item, index) => [
                { text: (index + 1).toString(), alignment: 'center' },
                item.description,
                { text: item.quantity.toString(), alignment: 'center' },
                { text: `$ ${Number(item.unitPrice).toLocaleString('es-CO')}`, alignment: 'right' },
                { text: `$ ${Number(item.subtotal).toLocaleString('es-CO')}`, alignment: 'right' }
              ]),
              // Empty rows to match design if needed
              ...Array.from({ length: Math.max(0, 12 - quote.items.length) }).map((_, i) => [
                { text: (quote.items.length + i + 1).toString(), alignment: 'center' },
                { text: '*' },
                { text: '*' },
                { text: '*' },
                { text: '*' }
              ]),
              // Summary footer
              [
                { 
                  text: [
                    { text: 'Observaciones:\n', bold: true },
                    { text: quote.notes || 'El cliente debe garantizar que sus instrumentos cuenten con los mantenimientos respectivos antes de realizar la calibración.\n\n', fontSize: 7 },
                    { text: '"En Labtronix Metrology S.A.S. contamos con acreditación ONAC, vigente a la fecha, con código de acreditación 21-LAC-011, bajo la norma ISO/IEC 17025:2017".\n', fontSize: 7 },
                    { text: 'Nuestro certificado puede ser consultado en la página web: https://onac.org.co/certificados/21-LAC-011.pdf o solicitada por medio de nuestros canales de atención', fontSize: 7, color: 'blue', decoration: 'underline' }
                  ], 
                  colSpan: 3, 
                  rowSpan: 5 
                },
                {},
                {},
                { text: 'SUBTOTAL', bold: true, fillColor: '#b30000', color: 'white', alignment: 'right' },
                { text: `$ ${Number(quote.totalValue).toLocaleString('es-CO')}`, alignment: 'right' }
              ],
              [
                {}, {}, {},
                { text: 'DESCUENTO', bold: true, fillColor: '#b30000', color: 'white', alignment: 'right' },
                { text: `$ 0`, alignment: 'right' }
              ],
              [
                {}, {}, {},
                { text: 'SUBTOTAL', bold: true, fillColor: '#b30000', color: 'white', alignment: 'right' },
                { text: `$ ${Number(quote.totalValue).toLocaleString('es-CO')}`, alignment: 'right' }
              ],
              [
                {}, {}, {},
                { text: 'IVA 19%', bold: true, fillColor: '#b30000', color: 'white', alignment: 'right' },
                { text: `$ ${(Number(quote.totalValue) * 0.19).toLocaleString('es-CO')}`, alignment: 'right' }
              ],
              [
                {}, {}, {},
                { text: 'TOTAL', bold: true, fillColor: '#b30000', color: 'white', alignment: 'right' },
                { text: `$ ${(Number(quote.totalValue) * 1.19).toLocaleString('es-CO')}`, alignment: 'right' }
              ]
            ]
          },
          layout: {
            hLineWidth: function (i, node) { return 1; },
            vLineWidth: function (i, node) { return 1; },
            hLineColor: function (i, node) { return '#0000ff'; },
            vLineColor: function (i, node) { return '#0000ff'; },
          },
          margin: [0, 0, 0, 10],
        },
        
        // CONDICIONES COMERCIALES
        {
          table: {
            widths: ['25%', '*'],
            body: [
              [{ text: 'CONDICIONES COMERCIALES', bold: true, colSpan: 2, alignment: 'center', fillColor: '#b30000', color: 'white' }, {}],
              [{ text: 'Forma de pago:', bold: true }, { text: '' }],
              [{ text: 'Tiempo de entrega:', bold: true }, { text: '' }],
              [{ text: 'Sitio de entrega:', bold: true }, { text: '' }],
              [{ text: 'Garantía:', bold: true }, { text: '' }],
              [{ text: 'Vigencia de la oferta:', bold: true }, { text: quote.validUntil ? new Date(quote.validUntil).toLocaleDateString('es-CO') : '' }]
            ]
          },
          layout: {
            hLineWidth: function (i, node) { return 1; },
            vLineWidth: function (i, node) { return 1; },
            hLineColor: function (i, node) { return '#0000ff'; },
            vLineColor: function (i, node) { return '#0000ff'; },
          },
          margin: [0, 0, 0, 10],
        },

        // LEGAL TEXTS
        {
          table: {
            widths: ['*'],
            body: [
              [{ text: 'TRATAMIENTO DE QUEJAS', bold: true, alignment: 'center', fillColor: '#b30000', color: 'white' }],
              [{ text: 'En caso de presentarse inconformidad en cualquier momento de la prestación del servicio o posteriormente, el cliente podrá:\n\n- Comunicar a Labtronix Metrology S.A.S. o al correo calidadlabtronix@gmail.com la inconformidad o a través de cualquier canal de comunicación.\n- El área de calidad enviará comunicación confirmando la recepción de la comunicación e iniciará el análisis de la situación reportada.\n- El equipo de trabajo del laboratorio realizará la validación, investigación de la queja y tomará las decisión sobre las acciones a tomar para dar respuesta, implementando las acciones definidas notificando el avance / progreso de la implementación del plan establecido.\n- Labtronix Metrology S.A.S. el laboratorio notificará formalmente el tratamiento y cierre de la queja.', fontSize: 7, alignment: 'justify' }],
              
              [{ text: 'INFORMACIÓN GENERAL PARA LA PRESTACIÓN DEL SERVICIO DE CALIBRACIÓN', bold: true, alignment: 'center', fillColor: '#b30000', color: 'white' }],
              [{ text: 'Para calibración de Instrumentos de pesaje de funcionamiento no automático:\nLa calibración de los instrumentos de pesaje se realiza mediante el método de comparación directa con pesas patrón, realizando la prueba para los errores de indicación "exactitud", prueba de repetibilidad y la prueba de excentricidad, siguiendo los lineamientos de la Guía SIM MWG7/cg-01/v.00:2009, Guía para la calibración de instrumentos para pesar de funcionamiento no automático.\n\nAdicionalmente tener en cuenta las siguientes condiciones para la prestación del servicio en las instalaciones del cliente:\n- Tener disponibilidad del instrumento y su área de trabajo en adecuadas condiciones de limpieza\n- Se recomienda que el instrumento tenga previamente ejecutado mantenimiento preventivo\n- Es responsabilidad del cliente asegurar que el instrumento este adecuadamente identificado (serie, código interno y ubicación)\n- Es importante que la calibración se realice en el lugar de uso habitual del instrumento. Todo cambio de ubicación es responsabilidad del cliente y podría invalidar el certificado de calibración emitido.\n- Labtronix Metrology S.A.S. no realiza declaraciones de conformidad para estas calibraciones.', fontSize: 7, alignment: 'justify' }],
              
              [{ text: 'CONSIDERACIONES GENERALES', bold: true, alignment: 'center', fillColor: '#b30000', color: 'white' }],
              [{ text: '- El valor ofertado no incluye trabajos dominicales, festivos o en horario extendido posterior a las 5:00pm\n- No se contempla ningún elemento de protección personal especial para la prestación del servicio, como respiradores, máscaras antigás etc., que no se especifiquen desde la solicitud del servicio o condiciones para el ingreso del personal. Es responsabilidad del cliente notificar con anticipación los requisitos especiales; el valor ofertado no incluye acompañamiento de personal de Seguridad y salud en el trabajo.\n- Los gastos de desplazamiento cuando se encuentren los equipos fuera del perímetro urbano de las ciudades donde Labtronix Metrology S.A.S. tiene cobertura, serán cotizados como un ÍTEM independiente dentro de la presente oferta.\n- Labtronix Metrology S.A.S. entrega como constancia y aceptación del servicio ya ejecutado en el documento "GT-FR-19 Reporte de servicio" completamente diligenciado.\n- Labtronix Metrology S.A.S. entregara el certificado de calibración a los (08) ocho días hábiles después de la prestación del servicio\n- Cualquier retraso en la prestación del servicio ajena a Labtronix Metrology S.A.S. tendrá un costo adicional de acuerdo al tiempo de demora el cual será facturado al cliente.', fontSize: 7, alignment: 'justify' }],
              
              [{ text: 'CONSIDERACIONES GENERALES', bold: true, alignment: 'center', fillColor: '#b30000', color: 'white' }],
              [{ text: 'Notas:\n- COSTO DE CANCELACIÓN DE ORDEN DE COMPRA:\nUna vez aceptada la oferta y emitida la orden de Compra a favor de Labtronix Metrology S.A.S., si el Cliente decide por cualquier motivo cancelar la misma, el CLIENTE será responsable de pagar a modo de costo de cancelación de la misma, el cincuenta por ciento (50%) del valor total de la orden de Compra, caso en el cual Labtronix Metrology S.A.S. procederá a emitir una factura por dicho valor. En caso que el Cliente no acepte la factura el presente documento presta mérito ejecutivo para exigir el pago aquí previsto. No se aceptarán cancelaciones una vez que los equipos hayan sido entregados al cliente.', fontSize: 7, alignment: 'justify' }],

              [{ text: 'COMPROMISO DE CONFIDENCIALIDAD', bold: true, alignment: 'center', fillColor: '#b30000', color: 'white' }],
              [{ text: 'Labtronix Metrology S.A.S. se obliga a mantener bajo absoluta reserva y confidencialidad toda información que llegaré a conocer de propiedad del cliente con ocasión de la ejecución del servicio de calibración. Labtronix Metrology S.A.S. se obliga a tomar todas las medidas y precauciones necesarias para la protección de la información a la que tenga acceso y comunicará a sus empleados, que puedan tener acceso a dicha información que la misma es de carácter estrictamente confidencial y reservada y que por lo mismo no puede ser entregada o comunicada a terceros, sin el previo consentimiento del cliente. Por medio de este documento se le comunica al cliente que toda la información suministrada por él y elementos de su propiedad (equipos, certificados de calibración), puede ser conocida por personas diferentes a Labtronix Metrology S.A.S., en actividades tales como auditorías internas y auditorías externas realizadas por ONAC o en caso de que esta información sea requerida por ley y no sea posible notificarle por temas legales.\nLabtronix Metrology S.A.S. reconoce y acepta que toda la información confidencial es de propiedad exclusiva de el y que está última es dueña de todos los derechos que recaen sobre la misma y cualquier revelación de información confidencial que llegaré a realizar el cliente a Labtronix Metrology S.A.S. no le confiere a esta última licencia, derecho o uso de ninguna naturaleza sobre la información transmitida.', fontSize: 7, alignment: 'justify' }],

              [{ text: 'DESCARGO DE RESPONSABILIDAD', bold: true, alignment: 'center', fillColor: '#b30000', color: 'white' }],
              [{ text: 'El uso de nuestro logotipo con acreditación bajo la norma NTC ISO/IEC 17025:2017, está estrictamente reservado para nosotros como organización acreditada o autorizada conforme en la norma. Cualquier uso malintencionado, indebido o no autorizado del logo, por parte de los usuarios finales, clientes u otras partes, queda bajo la exclusiva responsabilidad de quien lo haga. Labtronix Metrology S.A.S no se hace responsable por acciones, daños, perdidas o consecuencas derivadas del uso no autorizado o engaños, incluyendo, pero no limitándose a la inducción al error, publicidad falsa o representaciones fraudulentas relacionadas con la acreditación o cumplimiento de la norma.', fontSize: 7, alignment: 'justify' }]
            ]
          },
          layout: {
            hLineWidth: function (i, node) { return 1; },
            vLineWidth: function (i, node) { return 1; },
            hLineColor: function (i, node) { return '#0000ff'; },
            vLineColor: function (i, node) { return '#0000ff'; },
          }
        }
      ]
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${quote.quoteNumber}.pdf"`);
    pdfDoc.pipe(res);
    pdfDoc.end();
  }

  async exportToExcel(): Promise<Buffer> {
    const quotes = await this.quotesRepo.find({ relations: { client: true, createdBy: true }, order: { createdAt: 'DESC' } });
    const data = quotes.map(qt => ({
      Cotizacion: qt.quoteNumber,
      NITCliente: qt.client?.nit || '',
      NombreCliente: qt.client?.companyName || '',
      Estado: qt.status,
      Total: qt.totalValue,
      ValidaHasta: qt.validUntil,
      Notas: qt.notes,
      FechaCreacion: qt.createdAt,
    }));
    return this.excelService.exportToExcel(data, 'Cotizaciones');
  }

  async importFromExcel(buffer: Buffer, userId: string): Promise<{ total: number; created: number; updated: number }> {
    const data = await this.excelService.importFromExcel(buffer);
    let created = 0;
    let updated = 0;

    for (const row of data) {
      const quoteNumber = row['Cotizacion'] ? String(row['Cotizacion']).trim() : null;
      const nitCliente = row['NITCliente'] ? String(row['NITCliente']).trim() : null;

      let clientId: string | null = null;
      if (nitCliente) {
        const client = await this.clientsRepo.findOne({ where: { nit: nitCliente } });
        if (client) clientId = client.id;
      }

      let qt: Quote | null = null;
      if (quoteNumber) {
        qt = await this.quotesRepo.findOne({ where: { quoteNumber } });
      }

      const status = (row['Estado'] as QuoteStatus) || qt?.status || QuoteStatus.BORRADOR;

      if (qt) {
        await this.quotesRepo.save({
          ...qt,
          clientId: clientId || qt.clientId || undefined,
          status,
          notes: row['Notas'] || qt.notes || undefined,
        });
        updated++;
      } else if (quoteNumber) {
        const newQt = this.quotesRepo.create({
          quoteNumber,
          clientId: clientId || undefined,
          createdById: userId,
          status,
          notes: row['Notas'] || undefined,
          totalValue: 0,
        });
        await this.quotesRepo.save(newQt);
        created++;
      }
    }

    return { total: data.length, created, updated };
  }

  async generateTechnicalPdf(id: string, res: Response): Promise<void> {
    const quote = await this.findOne(id);
    const client = await this.clientsRepo.findOne({ where: { id: quote.clientId } });

    // Fetch settings with fallbacks
    const companyAddress = await this.settingsService.getValue('company_address', 'Carrera 106 # 15 - 25 Manzana 14 - Bodega 92 zona franca Fontibón');
    const companyPhones = await this.settingsService.getValue('company_phones', '3115111439 / 4238000 EXT: 33373 - 33374 - 33320 - 33324 - 33290.');
    const companyCity = await this.settingsService.getValue('company_city', 'Bogotá D.C.');

    const fonts = {
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
      },
    };

    const printer = new PdfPrinter(fonts);
    
    let logoBase64: string | null = null;
    try {
      const logoPath = path.join(process.cwd(), '..', 'frontend', 'public', 'logo.png');
      if (fs.existsSync(logoPath)) {
        logoBase64 = 'data:image/png;base64,' + fs.readFileSync(logoPath).toString('base64');
      }
    } catch (e) {
      console.warn('Logo not found or could not be loaded', e);
    }

    const docDefinition: any = {
      pageSize: 'A4',
      pageOrientation: 'landscape', // Wide format
      pageMargins: [20, 20, 20, 20],
      defaultStyle: { font: 'Helvetica', fontSize: 6 },
      content: [
        {
          table: {
            widths: [
               '3%', // ITEM
               '16%', // DESCRIPCION
               '4%', // CANTIDAD
               '5%', // V.UNITARIO
               '6%', // V.TOTAL
               '7%', // SERVICIO
               '10%', // EQUIPO
               '8%', // RANGO
               '7%', // DIVISION
               '6%', // MARCA
               '6%', // MODELO
               '6%', // SERIE
               '5%', // CODIGO
               '6%', // UBICACION
               '5%'  // PUNTOS
            ],
            body: [
              [
                { 
                  image: logoBase64 || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 
                  width: 100, 
                  rowSpan: 4, 
                  alignment: 'center',
                  colSpan: 5,
                  margin: [0, 10, 0, 0]
                }, '', '', '', '',
                { text: 'CONSECUTIVO:', bold: true, alignment: 'right', colSpan: 2 }, '',
                { text: quote.quoteNumber, alignment: 'center', bold: true, color: 'red', colSpan: 2 }, '',
                { text: '', colSpan: 6, rowSpan: 4 }, '', '', '', '', ''
              ],
              [
                '', '', '', '', '',
                { text: 'FECHA:', bold: true, alignment: 'right', colSpan: 2 }, '',
                { text: new Date(quote.createdAt).toISOString().split('T')[0], alignment: 'center', colSpan: 2 }, '',
                '', '', '', '', '', ''
              ],
              [
                '', '', '', '', '',
                { text: 'DIRECCIÓN:', bold: true, alignment: 'right', colSpan: 2 }, '',
                { text: companyAddress, alignment: 'center', colSpan: 2 }, '',
                '', '', '', '', '', ''
              ],
              [
                '', '', '', '', '',
                { text: 'TELÉFONOS:', bold: true, alignment: 'right', colSpan: 2 }, '',
                { text: companyPhones, alignment: 'center', colSpan: 2 }, '',
                '', '', '', '', '', ''
              ],
              // Info del cliente
              [
                { text: 'RAZON SOCIAL:', bold: true, colSpan: 2 }, '',
                { text: client?.companyName || '', colSpan: 3 }, '', '',
                { text: 'CIUDAD:', bold: true, alignment: 'right', colSpan: 2 }, '',
                { text: companyCity, alignment: 'center', colSpan: 2 }, '',
                { text: '', colSpan: 6 }, '', '', '', '', ''
              ],
              [
                { text: 'NIT:', bold: true, colSpan: 2 }, '',
                { text: client?.nit || '', colSpan: 3 }, '', '',
                { text: '', colSpan: 10 }, '', '', '', '', '', '', '', '', ''
              ],
              [
                { text: 'CONTACTO:', bold: true, colSpan: 2 }, '',
                { text: client?.contactName || '', colSpan: 3 }, '', '',
                { text: '', colSpan: 10 }, '', '', '', '', '', '', '', '', ''
              ],
              [
                { text: 'E-MAIL:', bold: true, colSpan: 2 }, '',
                { text: client?.email || '', colSpan: 3 }, '', '',
                { text: '', colSpan: 10 }, '', '', '', '', '', '', '', '', ''
              ],
              
              // TABLE HEADERS
              [
                { text: 'ITEM', bold: true, alignment: 'center', fillColor: '#b30000', color: 'white' },
                { text: 'DESCRIPCIÓN\n(Detallar Marca, Modelo, Cap. Máxima, División escala)', bold: true, alignment: 'center', fillColor: '#b30000', color: 'white' },
                { text: 'CANTIDAD', bold: true, alignment: 'center', fillColor: '#b30000', color: 'white' },
                { text: 'VALOR UNITARIO', bold: true, alignment: 'center', fillColor: '#b30000', color: 'white' },
                { text: 'VALOR TOTAL', bold: true, alignment: 'center', fillColor: '#b30000', color: 'white' },
                
                { text: 'SERVICIO', bold: true, alignment: 'center', fillColor: '#cce6ff', color: 'black' },
                { text: 'EQUIPO', bold: true, alignment: 'center', fillColor: '#cce6ff', color: 'black' },
                { text: 'INTERVALO DE MEDICIÓN\nCAP MÁXIMA', bold: true, alignment: 'center', fillColor: '#cce6ff', color: 'black' },
                { text: 'DIVISIÓN DE\nESCALA', bold: true, alignment: 'center', fillColor: '#cce6ff', color: 'black' },
                { text: 'MARCA', bold: true, alignment: 'center', fillColor: '#cce6ff', color: 'black' },
                { text: 'MODELO', bold: true, alignment: 'center', fillColor: '#cce6ff', color: 'black' },
                { text: 'SERIE', bold: true, alignment: 'center', fillColor: '#cce6ff', color: 'black' },
                { text: 'CÓDIGO', bold: true, alignment: 'center', fillColor: '#cce6ff', color: 'black' },
                { text: 'UBICACIÓN', bold: true, alignment: 'center', fillColor: '#cce6ff', color: 'black' },
                { text: 'PUNTOS A CALIBRAR', bold: true, alignment: 'center', fillColor: '#cce6ff', color: 'black' }
              ],
              // Items
              ...quote.items.map((item, index) => [
                { text: (index + 1).toString(), alignment: 'center' },
                item.description || '',
                { text: item.quantity.toString(), alignment: 'center' },
                { text: `$ ${Number(item.unitPrice).toLocaleString('es-CO')}`, alignment: 'right' },
                { text: `$ ${Number(item.subtotal).toLocaleString('es-CO')}`, alignment: 'right' },
                { text: item.serviceType || '', alignment: 'center' },
                { text: item.equipmentName || '', alignment: 'center' },
                { text: item.measuringRange || '', alignment: 'center' },
                { text: item.scaleDivision || '', alignment: 'center' },
                { text: item.brand || '', alignment: 'center' },
                { text: item.model || '', alignment: 'center' },
                { text: item.serialNumber || '', alignment: 'center' },
                { text: item.internalCode || '', alignment: 'center' },
                { text: item.location || '', alignment: 'center' },
                { text: item.calibrationPoints || '', alignment: 'center' }
              ]),
              // FOOTER TOTALS
              [
                { text: 'FORMA DE PAGO:', bold: true, colSpan: 2 }, '',
                { text: '', colSpan: 1 },
                { text: 'SUBTOTAL', bold: true, alignment: 'right' },
                { text: `$ ${Number(quote.totalValue).toLocaleString('es-CO')}`, alignment: 'right' },
                { text: '', colSpan: 10 }, '', '', '', '', '', '', '', '', ''
              ],
              [
                { text: 'PLAZO DE ENTREGA:', bold: true, colSpan: 2 }, '',
                { text: '', colSpan: 1 },
                { text: 'IVA 19%', bold: true, alignment: 'right' },
                { text: `$ ${(Number(quote.totalValue) * 0.19).toLocaleString('es-CO')}`, alignment: 'right' },
                { text: '', colSpan: 10 }, '', '', '', '', '', '', '', '', ''
              ],
              [
                { text: 'SITIO DE ENTREGA:', bold: true, colSpan: 2 }, '',
                { text: '', colSpan: 1 },
                { text: 'VALOR TOTAL', bold: true, alignment: 'right' },
                { text: `$ ${(Number(quote.totalValue) * 1.19).toLocaleString('es-CO')}`, alignment: 'right' },
                { text: '', colSpan: 10 }, '', '', '', '', '', '', '', '', ''
              ],
              [
                { text: 'GARANTÍA:', bold: true, colSpan: 2 }, '',
                { text: '', colSpan: 13 }, '', '', '', '', '', '', '', '', '', '', '', ''
              ],
              [
                { text: 'VIGENCIA DE LA OFERTA:', bold: true, colSpan: 2 }, '',
                { text: quote.validUntil ? new Date(quote.validUntil).toLocaleDateString('es-CO') : '', colSpan: 13 }, '', '', '', '', '', '', '', '', '', '', '', ''
              ],
              // OBSERVACIONES
              [
                { 
                  text: [
                    { text: 'OBSERVACIONES :\n', bold: true },
                    { text: '1. El cliente debe garantizar que sus instrumentos cuenten con los mantenimientos respectivos antes de realizar la calibración.\n2.\n\n\n' },
                    { text: '*En LABTRONIX S.A.S. contamos con acreditación ONAC, vigente a la fecha con código de acreditación 21-LAC-011, bajo la norma ISO/IEC 17025:2017.\n', bold: true },
                    { text: 'Puede consultar nuestro alcance acreditado 21-LAC-011 en el directorio de acreditados de ONAC o en el siguiente link: ', italics: true },
                    { text: 'https://onac.org.co/certificados/21-LAC-011.pdf\n', color: 'blue', decoration: 'underline' },
                    { text: 'Consulte nuestras condiciones comerciales en el siguiente Link: ', italics: true },
                    { text: 'https://drive.google.com/file/d/1y2Jjqk3IZAB3AqOAWoZToTiNqL-pvvvo/view?usp=drive_link', color: 'blue', decoration: 'underline' }
                  ], 
                  colSpan: 15 
                }, '', '', '', '', '', '', '', '', '', '', '', '', '', ''
              ]
            ]
          },
          layout: {
            hLineWidth: function (i, node) { return 0.5; },
            vLineWidth: function (i, node) { return 0.5; },
            hLineColor: function (i, node) { return '#cccccc'; },
            vLineColor: function (i, node) { return '#cccccc'; },
          }
        }
      ]
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${quote.quoteNumber}-tecnica.pdf"`);
    pdfDoc.pipe(res);
    pdfDoc.end();
  }

  async generateTechnicalExcel(id: string, res: Response): Promise<void> {
    const quote = await this.findOne(id);
    const client = await this.clientsRepo.findOne({ where: { id: quote.clientId } });
    
    const companyAddress = await this.settingsService.getValue('company_address', 'Carrera 106 # 15 - 25 Manzana 14 - Bodega 92 zona franca Fontibón');
    const companyPhones = await this.settingsService.getValue('company_phones', '3115111439 / 4238000 EXT: 33373 - 33374 - 33320 - 33324 - 33290.');
    const companyCity = await this.settingsService.getValue('company_city', 'Bogotá D.C.');

    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Cotización Técnica', { views: [{ showGridLines: false }] });

    // Styles
    const borderAll: Partial<import('exceljs').Borders> = {
      top: {style:'thin', color: {argb:'FFCCCCCC'}},
      left: {style:'thin', color: {argb:'FFCCCCCC'}},
      bottom: {style:'thin', color: {argb:'FFCCCCCC'}},
      right: {style:'thin', color: {argb:'FFCCCCCC'}}
    };

    // Columns width
    sheet.columns = [
      { width: 5 }, // A ITEM
      { width: 40 }, // B DESC
      { width: 10 }, // C CANT
      { width: 15 }, // D V.UNIT
      { width: 15 }, // E V.TOTAL
      { width: 15 }, // F SERV
      { width: 20 }, // G EQUIPO
      { width: 25 }, // H RANGO
      { width: 15 }, // I DIV
      { width: 15 }, // J MARCA
      { width: 15 }, // K MODELO
      { width: 15 }, // L SERIE
      { width: 15 }, // M COD
      { width: 15 }, // N UBIC
      { width: 15 }, // O PUNTOS
    ];

    // Headers
    sheet.getCell('D1').value = 'CONSECUTIVO:';
    sheet.getCell('D1').font = { bold: true };
    sheet.getCell('E1').value = quote.quoteNumber;
    sheet.getCell('E1').font = { bold: true, color: { argb: 'FFFF0000' } };
    sheet.getCell('E1').alignment = { horizontal: 'center' };

    sheet.getCell('D3').value = 'FECHA:';
    sheet.getCell('D3').font = { bold: true };
    sheet.getCell('E3').value = new Date(quote.createdAt).toISOString().split('T')[0];

    sheet.getCell('D4').value = 'DIRECCIÓN:';
    sheet.getCell('D4').font = { bold: true };
    sheet.getCell('E4').value = companyAddress;

    sheet.getCell('D5').value = 'TELÉFONO:';
    sheet.getCell('D5').font = { bold: true };
    sheet.getCell('E5').value = companyPhones;

    sheet.getCell('A6').value = 'RAZÓN SOCIAL:';
    sheet.getCell('A6').font = { bold: true };
    sheet.getCell('B6').value = client?.companyName || '';
    sheet.getCell('D6').value = 'CIUDAD:';
    sheet.getCell('D6').font = { bold: true };
    sheet.getCell('E6').value = companyCity;

    sheet.getCell('A7').value = 'NIT:';
    sheet.getCell('A7').font = { bold: true };
    sheet.getCell('B7').value = client?.nit || '';

    sheet.getCell('A8').value = 'CONTACTO:';
    sheet.getCell('A8').font = { bold: true };
    sheet.getCell('B8').value = client?.contactName || '';

    sheet.getCell('A9').value = 'E-MAIL:';
    sheet.getCell('A9').font = { bold: true };
    sheet.getCell('B9').value = client?.email || '';

    // Table Headers
    const headerRow = sheet.getRow(11);
    const headers = [
      'ITEM', 'DESCRIPCIÓN', 'CANTIDAD', 'VALOR UNITARIO', 'VALOR TOTAL',
      'SERVICIO', 'EQUIPO', 'INTERVALO DE MEDICIÓN CAP MÁXIMA', 'DIVISIÓN DE ESCALA',
      'MARCA', 'MODELO', 'SERIE', 'CÓDIGO', 'UBICACIÓN', 'PUNTOS A CALIBRAR'
    ];
    headers.forEach((h, i) => {
      const cell = headerRow.getCell(i + 1);
      cell.value = h;
      cell.font = { bold: true, color: { argb: i < 5 ? 'FFFFFFFF' : 'FF000000' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: i < 5 ? 'FFB30000' : 'FFCCE6FF' }
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = borderAll;
    });
    headerRow.height = 30;

    let currentRow = 12;
    quote.items.forEach((item, index) => {
      const row = sheet.getRow(currentRow);
      row.getCell(1).value = index + 1;
      row.getCell(2).value = item.description;
      row.getCell(3).value = item.quantity;
      row.getCell(4).value = Number(item.unitPrice);
      row.getCell(5).value = Number(item.subtotal);
      
      row.getCell(6).value = item.serviceType || '';
      row.getCell(7).value = item.equipmentName || '';
      row.getCell(8).value = item.measuringRange || '';
      row.getCell(9).value = item.scaleDivision || '';
      row.getCell(10).value = item.brand || '';
      row.getCell(11).value = item.model || '';
      row.getCell(12).value = item.serialNumber || '';
      row.getCell(13).value = item.internalCode || '';
      row.getCell(14).value = item.location || '';
      row.getCell(15).value = item.calibrationPoints || '';

      for(let i=1; i<=15; i++) {
        row.getCell(i).border = borderAll;
        if(i === 4 || i === 5) row.getCell(i).numFmt = '"$"#,##0.00';
      }
      currentRow++;
    });

    // Fill some empty rows
    for(let i=0; i<10; i++) {
      const row = sheet.getRow(currentRow);
      for(let c=1; c<=15; c++) {
        row.getCell(c).border = borderAll;
      }
      currentRow++;
    }

    currentRow += 2;
    sheet.getCell(`A${currentRow}`).value = 'FORMA DE PAGO:';
    sheet.getCell(`D${currentRow}`).value = 'SUBTOTAL';
    sheet.getCell(`E${currentRow}`).value = Number(quote.totalValue);
    
    currentRow++;
    sheet.getCell(`A${currentRow}`).value = 'PLAZO DE ENTREGA:';
    sheet.getCell(`D${currentRow}`).value = 'IVA 19%';
    sheet.getCell(`E${currentRow}`).value = Number(quote.totalValue) * 0.19;

    currentRow++;
    sheet.getCell(`A${currentRow}`).value = 'SITIO DE ENTREGA:';
    sheet.getCell(`D${currentRow}`).value = 'VALOR TOTAL';
    sheet.getCell(`E${currentRow}`).value = Number(quote.totalValue) * 1.19;

    [currentRow-2, currentRow-1, currentRow].forEach(r => {
      sheet.getCell(`E${r}`).numFmt = '"$"#,##0.00';
    });

    currentRow++;
    sheet.getCell(`A${currentRow}`).value = 'GARANTÍA:';
    
    currentRow++;
    sheet.getCell(`A${currentRow}`).value = 'VIGENCIA DE LA OFERTA:';
    sheet.getCell(`B${currentRow}`).value = quote.validUntil ? new Date(quote.validUntil).toLocaleDateString('es-CO') : '';
    
    currentRow += 2;
    sheet.getCell(`A${currentRow}`).value = 'OBSERVACIONES :\n1. El cliente debe garantizar que sus instrumentos cuenten con los mantenimientos respectivos antes de realizar la calibración.\n2.\n\n*En LABTRONIX S.A.S. contamos con acreditación ONAC, vigente a la fecha con código de acreditación 21-LAC-011, bajo la norma ISO/IEC 17025:2017.\nPuede consultar nuestro alcance acreditado 21-LAC-011 en el directorio de acreditados de ONAC o en el siguiente link: https://onac.org.co/certificados/21-LAC-011.pdf\nConsulte nuestras condiciones comerciales en el siguiente Link: https://drive.google.com/file/d/1y2Jjqk3IZAB3AqOAWoZToTiNqL-pvvvo/view?usp=drive_link';
    sheet.getCell(`A${currentRow}`).alignment = { wrapText: true, vertical: 'top' };
    sheet.mergeCells(`A${currentRow}:O${currentRow+5}`);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${quote.quoteNumber}-tecnica.xlsx"`);
    
    await workbook.xlsx.write(res);
    res.end();
  }
}
