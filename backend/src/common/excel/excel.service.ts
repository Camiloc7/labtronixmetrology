import { Injectable, BadRequestException } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExcelService {
  async exportToExcel(data: any[], sheetName: string): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    if (data.length > 0) {
      // Create headers from keys of the first object
      const headers = Object.keys(data[0]);
      worksheet.addRow(headers);

      // Add data rows
      data.forEach((item) => {
        const row = headers.map((header) => {
          const value = item[header];
          if (value instanceof Date) {
             return value.toISOString();
          }
          if (typeof value === 'object' && value !== null) {
             return JSON.stringify(value);
          }
          return value;
        });
        worksheet.addRow(row);
      });

      // Simple auto-fit columns
      worksheet.columns.forEach((column) => {
        column.width = 25;
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer as unknown as Buffer;
  }

  async importFromExcel(buffer: Buffer): Promise<any[]> {
    try {
      const workbook = new ExcelJS.Workbook();
      if (buffer) {
        await workbook.xlsx.load(buffer as unknown as ArrayBuffer);
      }
      
      const worksheet = workbook.worksheets[0]; // Take first sheet
      if (!worksheet) {
        throw new BadRequestException('El archivo Excel está vacío');
      }

      const rows: any[] = [];
      let headers: string[] = [];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) {
          // First row is headers
          headers = (row.values as any[]).slice(1).map((h) => String(h).trim());
        } else {
          // Map values to headers
          const rowData: any = {};
          const values = (row.values as any[]).slice(1);
          
          headers.forEach((header, index) => {
            let val = values[index];
            // Handle formulas
            if (val && typeof val === 'object' && 'result' in val) {
              val = val.result;
            }
            // Handle RichText objects or Hyperlinks
            if (val && typeof val === 'object' && 'text' in val) {
              rowData[header] = val.text;
            } else if (val && typeof val === 'object' && 'hyperlink' in val) {
              rowData[header] = val.text || val.hyperlink;
            } else {
              rowData[header] = val !== undefined ? val : null;
            }
          });
          
          // Check if row is not completely empty
          if (Object.values(rowData).some((v) => v !== null && v !== '')) {
            rows.push(rowData);
          }
        }
      });

      return rows;
    } catch (error) {
      throw new BadRequestException(`Error al procesar archivo Excel: ${error.message}`);
    }
  }
}
