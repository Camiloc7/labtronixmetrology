import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { Client } from '../clients/entities/client.entity';
import { Quote } from '../quotes/entities/quote.entity';
import { ServiceTracking } from '../quotes/entities/service-tracking.entity';
import { EquipmentReception } from '../equipment/entities/equipment-reception.entity';

@Injectable()
export class ImportService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>,
    @InjectRepository(Quote)
    private readonly quoteRepo: Repository<Quote>,
    @InjectRepository(ServiceTracking)
    private readonly trackingRepo: Repository<ServiceTracking>,
    @InjectRepository(EquipmentReception)
    private readonly receptionRepo: Repository<EquipmentReception>,
  ) {}

  async processExcel(buffer: Buffer) {
    const workbook = new ExcelJS.Workbook();
    try {
      await workbook.xlsx.load(buffer as unknown as ArrayBuffer);
    } catch (e) {
      throw new BadRequestException('El archivo no es un Excel válido');
    }

    const result = {
      clientesImportados: 0,
      cotizacionesImportadas: 0,
      recepcionesImportadas: 0,
      errores: [] as string[],
    };

    // 1. Process "Clientes"
    const sheetClientes = workbook.getWorksheet('Clientes');
    if (sheetClientes) {
      const rows = this.extractData(sheetClientes);
      for (const row of rows) {
        try {
          const codCliente = row['COD_CLIENTE'] || row['COD_CLIENTE_2'];
          const companyName = row['RAZON_SOCIAL'];
          if (!companyName) continue;

          let client = await this.clientRepo.findOne({ where: { nit: row['NIT'] } });
          if (!client && codCliente) {
             client = await this.clientRepo.findOne({ where: { codCliente } });
          }

          if (!client) {
            client = this.clientRepo.create();
          }

          client.codCliente = codCliente;
          client.companyName = companyName;
          client.nit = row['NIT'];
          client.address = row['DIRECCION'];
          client.city = row['CUIDAD']; // Note the typo in excel header 'CUIDAD'
          
          client.contactoTecnico = row['CONTACTO_TEC'];
          client.emailTecnico = row['EMAIL_TEC'];
          client.telefonoTecnico = row['TELEFONO_TEC'];

          client.contactoComercial = row['CONTACTO_COM'];
          client.emailComercial = row['EMAIL_COM'];
          client.telefonoComercial = row['TELEFONO_COM'];
          
          client.notes = row['Observaciones'];

          await this.clientRepo.save(client);
          result.clientesImportados++;
        } catch (e: any) {
          result.errores.push(`Error en cliente ${row['RAZON_SOCIAL']}: ${e.message}`);
        }
      }
    } else {
      result.errores.push('No se encontró la hoja "Clientes"');
    }

    // 2. Process "Cotizaciones"
    const sheetCotizaciones = workbook.getWorksheet('Cotizaciones');
    if (sheetCotizaciones) {
      const rows = this.extractData(sheetCotizaciones);
      for (const row of rows) {
        try {
          const quoteNumber = row['Cotizacion'] || row['ID Cotización'];
          if (!quoteNumber) continue;

          // Find client
          const nit = row['NIT'];
          let client = null;
          if (nit) {
            client = await this.clientRepo.findOne({ where: { nit } });
          }

          let quote = await this.quoteRepo.findOne({ where: { quoteNumber } });
          if (!quote) {
            quote = this.quoteRepo.create({ quoteNumber });
          }

          if (client) {
            quote.clientId = client.id;
          }
          
          const valor = parseFloat(row['Valor']);
          if (!isNaN(valor)) {
             quote.totalValue = valor;
          }
          quote.notes = row['Observaciones'];

          quote = await this.quoteRepo.save(quote);
          
          // Service Tracking
          let tracking = await this.trackingRepo.findOne({ where: { quoteId: quote.id } });
          if (!tracking) {
            tracking = this.trackingRepo.create({ quoteId: quote.id });
          }

          tracking.fechaPactadaServicio = this.parseDate(row['Fecha pactada de la Prestación del Servicio']) as any;
          tracking.idOrdenTrabajo = row['ID Orden de Trabajo'];
          tracking.idRequisicion = row['ID Requisición'];
          tracking.fechaReporte = this.parseDate(row['Fecha de Reporte']) as any;
          tracking.idReporteServicio = row['ID Reporte de Servicio'];
          tracking.fechaRecepcionEquipos = this.parseDate(row['Fecha de Recepción de Equipos']) as any;
          tracking.idRecepcionEquipos = row['ID Recepción de Equipos'];
          tracking.fechaEntregaOc = this.parseDate(row['Fecha de entrega OC']) as any;
          tracking.idOrdenCompra = row['ID Orden de Compra'];
          tracking.fechaIngresoLabExterno = this.parseDate(row['Fecha de Ingreso a Lab. Externo']) as any;
          tracking.laboratorioExterno = row['Laboratorio Externo'];
          tracking.fechaEntregaEquipoLabExterno = this.parseDate(row['Fecha de Entrega del Equipo Lab Externo']) as any;
          tracking.fechaRecogerEquipo = this.parseDate(row['Fecha de Recoger el Equipo']) as any;
          tracking.fechaEntregaEquipoCliente = this.parseDate(row['Fecha de Entrega del Equipo al Cliente']) as any;
          tracking.idReporteEntregaServicios = row['ID Reporte Entrega de Servicios'];
          tracking.fechaReporteEntregaServicio = this.parseDate(row['Fecha de Reporte Entrega de Servicio']) as any;
          tracking.fechaEmisionCertificado = this.parseDate(row['Fecha de Emisión del Certificado']) as any;
          tracking.idCertificado = row['ID Certificado'];
          tracking.fechaEntregaCertificado = this.parseDate(row['Fecha de Entrega Certificado']) as any;
          tracking.idFactura = row['ID Factura'];
          tracking.fechaFactura = this.parseDate(row['Fecha de Factura']) as any;
          tracking.fechaPago = this.parseDate(row['Fecha de Pago']) as any;
          tracking.comprobanteEgreso = row['Comprobante de Egreso'];

          await this.trackingRepo.save(tracking);
          result.cotizacionesImportadas++;

        } catch (e: any) {
          result.errores.push(`Error en cotización ${row['Cotizacion']}: ${e.message}`);
        }
      }
    }

    // 3. Process "Recepción Equi"
    const sheetRecepcion = workbook.getWorksheet('Recepción Equi');
    if (sheetRecepcion) {
      const rows = this.extractData(sheetRecepcion);
      for (const row of rows) {
        try {
          const nRecepcion = row['N_Recepcion'];
          const quoteNumber = row['Cotizacion'];
          
          let quote: Quote | null = null;
          if (quoteNumber) {
            quote = await this.quoteRepo.findOne({ where: { quoteNumber } });
          }

          let reception: EquipmentReception | null = null;
          if (nRecepcion) {
             reception = await this.receptionRepo.findOne({ where: { nRecepcion } });
          }
          if (!reception) {
             reception = this.receptionRepo.create();
          }

          reception.nRecepcion = nRecepcion;
          if (quote) {
             reception.quoteId = quote.id;
             reception.clientId = quote.clientId;
          }

          reception.fechaRecepcion = (this.parseDate(row['Fecha recepción']) || this.parseDate(row['Fecha de Recepción'])) as any;
          reception.cantidad = parseInt(row['Cantidad']) || 1;
          reception.magnitud = row['Magnitud'];
          reception.acreditacion = row['Acreditacion'];
          reception.lugarCalibracion = row['Lugar_Calibracion'];
          reception.descripcion = row['Descripcion'];
          reception.fechaDevolucion = this.parseDate(row['Fecha de devolución']) as any;
          reception.consecutivoEntrega = row['Consecutivo Entrega'];
          reception.entregadoPor = row['Entregado por'];
          reception.fechaCalibracion = this.parseDate(row['Fecha de Calibración']) as any;
          reception.fechaEnvioCertificado = this.parseDate(row['Fecha de envio de Certificado']) as any;
          reception.noCertificado = row['No. Certificado'];

          await this.receptionRepo.save(reception);
          result.recepcionesImportadas++;
        } catch (e: any) {
           result.errores.push(`Error en recepción ${row['N_Recepcion']}: ${e.message}`);
        }
      }
    }

    return result;
  }

  private extractData(worksheet: ExcelJS.Worksheet): any[] {
    const rows: any[] = [];
    let headers: string[] = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        headers = (row.values as any[]).slice(1).map((h) => String(h).trim());
      } else {
        const rowData: any = {};
        const values = (row.values as any[]).slice(1);
        
        headers.forEach((header, index) => {
          let val = values[index];
          if (val && typeof val === 'object' && 'result' in val) val = val.result;
          if (val && typeof val === 'object' && 'text' in val) {
            rowData[header] = val.text;
          } else if (val && typeof val === 'object' && 'hyperlink' in val) {
            rowData[header] = val.text || val.hyperlink;
          } else {
            rowData[header] = val !== undefined ? val : null;
          }
        });
        
        if (Object.values(rowData).some((v) => v !== null && v !== '')) {
          rows.push(rowData);
        }
      }
    });

    return rows;
  }

  private parseDate(val: any): Date | null {
    if (!val) return null;
    if (val instanceof Date) return val;
    // Excel might send strings like DD/MM/YYYY
    if (typeof val === 'string') {
       const parsed = new Date(val);
       if (!isNaN(parsed.getTime())) return parsed;
    }
    // Excel dates are often floats (number of days since 1900-01-01)
    if (typeof val === 'number') {
       // Excel's epoch starts on Jan 1, 1900 (with the 1900 leap year bug)
       // 25569 is the difference in days between 1900 and 1970 (Unix epoch)
       const unixTime = (val - 25569) * 86400 * 1000;
       return new Date(unixTime);
    }
    return null;
  }
}
