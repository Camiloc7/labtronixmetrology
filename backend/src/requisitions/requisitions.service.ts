import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Requisition } from './entities/requisition.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { CreateRequisitionDto } from './dto/create-requisition.dto';
import { UpdateRequisitionDto } from './dto/update-requisition.dto';
import { SettingsService } from '../settings/settings.service';
import * as exceljs from 'exceljs';
import * as path from 'path';
import * as fs from 'fs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PdfPrinter = require('pdfmake/js/Printer.js').default;

const fonts = {
  Roboto: {
    normal: 'node_modules/pdfmake/fonts/Roboto/Roboto-Regular.ttf',
    bold: 'node_modules/pdfmake/fonts/Roboto/Roboto-Medium.ttf',
    italics: 'node_modules/pdfmake/fonts/Roboto/Roboto-Italic.ttf',
    bolditalics: 'node_modules/pdfmake/fonts/Roboto/Roboto-MediumItalic.ttf',
  },
};
const printer = new PdfPrinter(fonts);

@Injectable()
export class RequisitionsService {
  constructor(
    @InjectRepository(Requisition)
    private requisitionsRepository: Repository<Requisition>,
    private settingsService: SettingsService,
  ) {}

  async create(createRequisitionDto: CreateRequisitionDto): Promise<Requisition> {
    const requisition = this.requisitionsRepository.create(createRequisitionDto);
    return this.requisitionsRepository.save(requisition);
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Requisition>> {
    const { page = 1, limit = 10, search } = paginationDto;
    const skip = (page - 1) * limit;

    const where = search
      ? [
          { companyName: ILike(`%${search}%`) },
        ]
      : {};

    const [data, total] = await this.requisitionsRepository.findAndCount({
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

  async findOne(id: string): Promise<Requisition> {
    const requisition = await this.requisitionsRepository.findOne({ where: { id } });
    if (!requisition) {
      throw new NotFoundException(`Requisition with ID ${id} not found`);
    }
    return requisition;
  }

  async update(id: string, updateRequisitionDto: UpdateRequisitionDto): Promise<Requisition> {
    const requisition = await this.findOne(id);
    // Para actualizar items, typeorm con cascade a veces requiere precauciones, pero `save` maneja bien si pasamos el ID.
    const updated = this.requisitionsRepository.merge(requisition, updateRequisitionDto);
    return this.requisitionsRepository.save(updated);
  }

  async remove(id: string): Promise<void> {
    const requisition = await this.findOne(id);
    await this.requisitionsRepository.remove(requisition);
  }

  async generatePdf(id: string): Promise<Buffer> {
    const requisition = await this.findOne(id);
    const fonts = {
      Roboto: {
        normal: 'node_modules/pdfmake/fonts/Roboto/Roboto-Regular.ttf',
        bold: 'node_modules/pdfmake/fonts/Roboto/Roboto-Medium.ttf',
        italics: 'node_modules/pdfmake/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics: 'node_modules/pdfmake/fonts/Roboto/Roboto-MediumItalic.ttf',
      },
    };
    
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const PdfPrinter = require('pdfmake');
    const printer = new PdfPrinter(fonts);

    let logoBase64: string | null = null;
    try {
      const logoPath = path.join(process.cwd(), '..', 'frontend', 'public', 'logo.png');
      if (fs.existsSync(logoPath)) {
        logoBase64 = 'data:image/png;base64,' + fs.readFileSync(logoPath).toString('base64');
      }
    } catch (e) {
      console.warn('Logo not found', e);
    }

    const docDefinition: any = {
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [30, 30, 30, 30],
      defaultStyle: { font: 'Roboto', fontSize: 9 },
      content: [
        {
          table: {
            widths: ['40%', '*', '15%', '20%'],
            body: [
              [
                { 
                  image: logoBase64 || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 
                  width: 120, 
                  rowSpan: 2, 
                  alignment: 'center', 
                  margin: [0, 5, 0, 0] 
                },
                { text: 'REQUISICIÓN DE COMPRAS Y/O SERVICIOS', bold: true, colSpan: 3, alignment: 'center', fontSize: 14, margin: [0, 5, 0, 0] },
                '', ''
              ],
              [
                '',
                { text: 'Código: AD-FR-07 Versión 01 de 2020-01-17', colSpan: 3, alignment: 'center', fontSize: 8 },
                '', ''
              ],
              [
                '',
                { text: 'CONSECUTIVO DE REQUISICIÓN:', bold: true, alignment: 'right', margin: [0, 10, 0, 0] },
                { text: requisition.consecutiveNumber, bold: true, alignment: 'left', margin: [0, 10, 0, 0], colSpan: 2 },
                ''
              ],
              [
                { text: `ACTIVIDAD:    ${requisition.activity}`, bold: true, alignment: 'left', colSpan: 2, margin: [0, 10, 0, 5] },
                '',
                { text: 'FECHA:', bold: true, alignment: 'right', margin: [0, 10, 0, 5] },
                { text: new Date(requisition.date).toISOString().split('T')[0], bold: true, alignment: 'left', margin: [0, 10, 0, 5] }
              ]
            ]
          },
          layout: {
            hLineWidth: (i: number) => 1,
            vLineWidth: (i: number) => 1,
            hLineColor: (i: number) => '#0000ff',
            vLineColor: (i: number) => '#0000ff',
          },
          margin: [0, 0, 0, 10]
        },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', '*'],
            body: [
              [
                { text: 'ITEM No.', bold: true, alignment: 'center', fillColor: '#b30000', color: 'white' },
                { text: 'CANTIDAD', bold: true, alignment: 'center', fillColor: '#b30000', color: 'white' },
                { text: 'U. MEDIDA', bold: true, alignment: 'center', fillColor: '#b30000', color: 'white' },
                { text: 'DESCRIPCIÓN\n(Características técnicas)', bold: true, alignment: 'center', fillColor: '#b30000', color: 'white' }
              ],
              ...(requisition.items?.map((item, index) => [
                { text: (index + 1).toString(), alignment: 'center' },
                { text: item.quantity.toString(), alignment: 'center' },
                { text: item.unitOfMeasure, alignment: 'center' },
                { text: item.description }
              ]) || []),
              ...Array.from({ length: Math.max(0, 10 - (requisition.items?.length || 0)) }).map((_, i) => [
                { text: ((requisition.items?.length || 0) + i + 1).toString(), alignment: 'center' },
                { text: ' ' },
                { text: ' ' },
                { text: ' ' }
              ])
            ]
          },
          layout: {
            hLineWidth: (i: number) => 1,
            vLineWidth: (i: number) => 1,
            hLineColor: (i: number) => '#0000ff',
            vLineColor: (i: number) => '#0000ff',
            hLineStyle: (i: number, node: any) => i > 1 ? { dash: { length: 2, space: 2 } } : null,
            vLineStyle: (i: number, node: any) => ({ dash: { length: 2, space: 2 } })
          },
          margin: [0, 0, 0, 20]
        },
        {
          table: {
            widths: ['30%', '40%', '30%'],
            body: [
              [
                { text: 'OBSERVACIONES:', bold: true, colSpan: 3, border: [false, false, false, false] },
                '', ''
              ],
              [
                { text: 'Los certificados debe salir a nombre de:', border: [false, false, false, false] },
                { text: requisition.certificateToName, bold: true, colSpan: 2, border: [false, false, false, false] },
                ''
              ],
              [
                { text: 'Dirección:', border: [false, false, false, false] },
                { text: requisition.certificateAddress, colSpan: 2, border: [false, false, false, false] },
                ''
              ],
              [
                { text: 'Cotización:', border: [false, false, false, false] },
                { text: requisition.quoteNumber || 'N/A', colSpan: 2, border: [false, false, false, false] },
                ''
              ],
              [
                { text: ' ', margin: [0, 10, 0, 10], colSpan: 3, border: [false, false, false, false] },
                '', ''
              ],
              [
                { text: 'Solicitante:', bold: true, border: [false, false, false, false] },
                { text: 'Autorizado:', bold: true, colSpan: 2, border: [false, false, false, false] },
                ''
              ],
              [
                { text: requisition.requesterName, border: [false, false, false, false] },
                { text: requisition.authorizerName || '', colSpan: 2, border: [false, false, false, false] },
                ''
              ],
              [
                { text: `Cargo: ${requisition.requesterRole}`, border: [false, false, false, false] },
                { text: `Cargo: ${requisition.authorizerRole || ''}`, colSpan: 2, border: [false, false, false, false] },
                ''
              ]
            ]
          },
          layout: {
            hLineWidth: (i: number) => 1,
            vLineWidth: (i: number) => 1,
            hLineColor: (i: number) => '#0000ff',
            vLineColor: (i: number) => '#0000ff',
          },
          margin: [0, 0, 0, 0]
        }
      ]
    };

    return new Promise((resolve, reject) => {
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      const chunks: Buffer[] = [];
      pdfDoc.on('data', (chunk) => chunks.push(chunk));
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
      pdfDoc.on('error', reject);
      pdfDoc.end();
    });
  }

  async generateExcel(id: string): Promise<Buffer> {
    const requisition = await this.findOne(id);
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Requisición');

    worksheet.mergeCells('B2:E2');
    worksheet.getCell('B2').value = 'REQUISICIÓN DE COMPRAS Y/O SERVICIOS';
    worksheet.getCell('B2').font = { bold: true, size: 14 };
    worksheet.getCell('B2').alignment = { horizontal: 'center' };

    worksheet.mergeCells('B3:E3');
    worksheet.getCell('B3').value = 'Código: AD-FR-07 Versión 01 de 2020-01-17';
    worksheet.getCell('B3').alignment = { horizontal: 'center' };

    worksheet.getCell('D5').value = 'CONSECUTIVO DE REQUISICIÓN:';
    worksheet.getCell('D5').font = { bold: true };
    worksheet.getCell('E5').value = requisition.consecutiveNumber;
    
    worksheet.getCell('B7').value = `ACTIVIDAD: ${requisition.activity}`;
    worksheet.getCell('B7').font = { bold: true };
    
    worksheet.getCell('D7').value = 'FECHA:';
    worksheet.getCell('D7').font = { bold: true };
    worksheet.getCell('E7').value = new Date(requisition.date).toISOString().split('T')[0];

    // Table headers
    const headerRow = worksheet.getRow(9);
    headerRow.values = ['', 'ITEM No.', 'CANTIDAD', 'U. MEDIDA', 'DESCRIPCIÓN (Características técnicas)'];
    headerRow.eachCell((cell, colNumber) => {
      if (colNumber > 1) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFB30000' } };
        cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      }
    });

    // Items
    let currentRow = 10;
    requisition.items?.forEach((item, idx) => {
      const row = worksheet.getRow(currentRow);
      row.values = ['', idx + 1, item.quantity, item.unitOfMeasure, item.description];
      row.eachCell((cell, col) => {
        if (col > 1) {
          cell.border = { top: { style: 'dotted' }, left: { style: 'dotted' }, bottom: { style: 'dotted' }, right: { style: 'dotted' } };
          if (col < 5) cell.alignment = { horizontal: 'center' };
        }
      });
      currentRow++;
    });

    // Empty rows for formatting
    for (let i = 0; i < 10; i++) {
      const row = worksheet.getRow(currentRow);
      row.values = ['', (requisition.items?.length || 0) + i + 1, '', '', ''];
      row.eachCell((cell, col) => {
        if (col > 1) {
          cell.border = { top: { style: 'dotted' }, left: { style: 'dotted' }, bottom: { style: 'dotted' }, right: { style: 'dotted' } };
          if (col < 5) cell.alignment = { horizontal: 'center' };
        }
      });
      currentRow++;
    }

    currentRow += 2;
    worksheet.getCell(`B${currentRow}`).value = 'OBSERVACIONES:';
    worksheet.getCell(`B${currentRow}`).font = { bold: true };
    
    currentRow++;
    worksheet.getCell(`B${currentRow}`).value = 'Los certificados debe salir a nombre de:';
    worksheet.getCell(`D${currentRow}`).value = requisition.certificateToName;

    currentRow++;
    worksheet.getCell(`B${currentRow}`).value = 'Dirección:';
    worksheet.getCell(`D${currentRow}`).value = requisition.certificateAddress;

    currentRow++;
    worksheet.getCell(`B${currentRow}`).value = 'Cotización:';
    worksheet.getCell(`D${currentRow}`).value = requisition.quoteNumber || 'N/A';

    currentRow += 3;
    worksheet.getCell(`B${currentRow}`).value = 'Solicitante:';
    worksheet.getCell(`B${currentRow}`).font = { bold: true };
    worksheet.getCell(`D${currentRow}`).value = 'Autorizado:';
    worksheet.getCell(`D${currentRow}`).font = { bold: true };

    currentRow++;
    worksheet.getCell(`B${currentRow}`).value = requisition.requesterName;
    worksheet.getCell(`D${currentRow}`).value = requisition.authorizerName;

    currentRow++;
    worksheet.getCell(`B${currentRow}`).value = `Cargo: ${requisition.requesterRole}`;
    worksheet.getCell(`D${currentRow}`).value = `Cargo: ${requisition.authorizerRole || ''}`;

    worksheet.getColumn('B').width = 15;
    worksheet.getColumn('C').width = 15;
    worksheet.getColumn('D').width = 25;
    worksheet.getColumn('E').width = 60;

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}

