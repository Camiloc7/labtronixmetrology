import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quote, QuoteStatus } from '../quotes/entities/quote.entity';
import { WorkOrderItem, WorkOrderStatus } from '../work-orders/entities/work-order-item.entity';
import { WorkOrder } from '../work-orders/entities/work-order.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Quote)
    private readonly quotesRepo: Repository<Quote>,
    @InjectRepository(WorkOrderItem)
    private readonly woiRepo: Repository<WorkOrderItem>,
    @InjectRepository(WorkOrder)
    private readonly woRepo: Repository<WorkOrder>,
  ) {}

  async getKpis() {
    const totalQuotes = await this.quotesRepo.count();
    const approvedQuotes = await this.quotesRepo.count({ where: { status: QuoteStatus.APROBADA } });
    
    const { totalRevenue } = await this.quotesRepo
      .createQueryBuilder('quote')
      .select('SUM(quote.total_value)', 'totalRevenue')
      .where('quote.status = :status', { status: QuoteStatus.APROBADA })
      .getRawOne();

    const conversionRate = totalQuotes > 0 ? (approvedQuotes / totalQuotes) * 100 : 0;

    return {
      totalQuotes,
      approvedQuotes,
      conversionRate: Number(conversionRate.toFixed(2)),
      totalRevenue: Number(totalRevenue || 0),
    };
  }

  async getQuotesByStatus() {
    const data = await this.quotesRepo
      .createQueryBuilder('quote')
      .select('quote.status', 'status')
      .addSelect('COUNT(quote.id)', 'count')
      .groupBy('quote.status')
      .getRawMany();

    return data.map(item => ({
      status: item.status,
      count: Number(item.count),
    }));
  }

  async getRevenueTimeline(period: 'day' | 'month' | 'quarter' | 'year' = 'month') {
    let dateTruncExpr = '';
    
    switch (period) {
      case 'day':
        dateTruncExpr = "date_trunc('day', quote.created_at)";
        break;
      case 'month':
        dateTruncExpr = "date_trunc('month', quote.created_at)";
        break;
      case 'quarter':
        dateTruncExpr = "date_trunc('quarter', quote.created_at)";
        break;
      case 'year':
        dateTruncExpr = "date_trunc('year', quote.created_at)";
        break;
      default:
        dateTruncExpr = "date_trunc('month', quote.created_at)";
    }

    const data = await this.quotesRepo
      .createQueryBuilder('quote')
      .select(dateTruncExpr, 'date')
      .addSelect('SUM(quote.total_value)', 'revenue')
      .addSelect('COUNT(quote.id)', 'quotesCount')
      .where('quote.status = :status', { status: QuoteStatus.APROBADA })
      .groupBy('date')
      .orderBy('date', 'ASC')
      .getRawMany();

    return data.map(item => ({
      date: item.date,
      revenue: Number(item.revenue || 0),
      quotesCount: Number(item.quotesCount || 0),
    }));
  }

  async getAdvancedMetrics() {
    // 1. Lead Time (Días promedio desde creación hasta DESPACHADO)
    const { leadTime } = await this.woiRepo
      .createQueryBuilder('item')
      .select('AVG(EXTRACT(EPOCH FROM (item.updated_at - item.created_at))/86400)', 'leadTime')
      .where('item.status = :status', { status: WorkOrderStatus.DESPACHADO })
      .getRawOne();

    // 2. Top Clientes (Cotizaciones Aprobadas)
    const topClients = await this.quotesRepo
      .createQueryBuilder('quote')
      .leftJoinAndSelect('quote.client', 'client')
      .select('client.company_name', 'name')
      .addSelect('SUM(quote.total_value)', 'total')
      .where('quote.status = :status', { status: QuoteStatus.APROBADA })
      .groupBy('client.company_name')
      .orderBy('total', 'DESC')
      .limit(5)
      .getRawMany();

    // 3. Pipeline / Alertas (Vencen en <= 7 días)
    const alerts = await this.getAlerts();

    // 4. WIP (Dinero Atrapado)
    // Suma del valor de cotizaciones aprobadas que tienen OTs no despachadas
    const { wipValue } = await this.quotesRepo
      .createQueryBuilder('quote')
      .select('SUM(quote.total_value)', 'wipValue')
      .where('quote.status = :status', { status: QuoteStatus.APROBADA })
      .andWhere(`EXISTS (
        SELECT 1 FROM work_orders w
        JOIN work_order_items i ON i.work_order_id = w.id
        WHERE w.quote_id = quote.id AND i.status != :despachado
      )`, { despachado: WorkOrderStatus.DESPACHADO })
      .getRawOne();

    return {
      leadTimeDays: Number(leadTime || 0).toFixed(1),
      topClients: topClients.map(c => ({ name: c.name, total: Number(c.total) })),
      alerts: alerts.map(a => ({
        id: a.id,
        quoteNumber: a.quoteNumber,
        clientName: a.client.companyName,
        totalValue: Number(a.totalValue),
        validUntil: a.validUntil,
        status: a.status
      })),
      wipValue: Number(wipValue || 0),
    };
  }

  async getAlerts() {
    return this.quotesRepo
      .createQueryBuilder('quote')
      .leftJoinAndSelect('quote.client', 'client')
      .where('quote.status IN (:...statuses)', { statuses: [QuoteStatus.BORRADOR, QuoteStatus.ENVIADA] })
      .andWhere("quote.valid_until BETWEEN NOW() AND NOW() + INTERVAL '7 days'")
      .orderBy('quote.valid_until', 'ASC')
      .getMany();
  }

  async exportDashboardToExcel(): Promise<Buffer> {
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const metrics = await this.getAdvancedMetrics();
    const kpis = await this.getKpis();

    // Hoja 1: Resumen General
    const sheet1 = workbook.addWorksheet('Resumen General');
    sheet1.columns = [
      { header: 'Métrica', key: 'metric', width: 30 },
      { header: 'Valor', key: 'value', width: 20 },
    ];
    sheet1.addRow({ metric: 'Total Cotizaciones', value: kpis.totalQuotes });
    sheet1.addRow({ metric: 'Cotizaciones Aprobadas', value: kpis.approvedQuotes });
    sheet1.addRow({ metric: 'Tasa de Conversión (%)', value: kpis.conversionRate });
    sheet1.addRow({ metric: 'Ingresos Totales (Aprobadas)', value: kpis.totalRevenue });
    sheet1.addRow({ metric: 'Dinero Atrapado (WIP)', value: metrics.wipValue });
    sheet1.addRow({ metric: 'Eficiencia (Lead Time Días)', value: metrics.leadTimeDays });

    // Hoja 2: Top Clientes
    const sheet2 = workbook.addWorksheet('Top Clientes');
    sheet2.columns = [
      { header: 'Cliente', key: 'name', width: 40 },
      { header: 'Ingresos Totales', key: 'total', width: 20 },
    ];
    metrics.topClients.forEach(c => sheet2.addRow(c));

    // Hoja 3: Alertas de Cotizaciones
    const sheet3 = workbook.addWorksheet('Cotizaciones por Vencer');
    sheet3.columns = [
      { header: 'Cotización', key: 'quoteNumber', width: 20 },
      { header: 'Cliente', key: 'clientName', width: 40 },
      { header: 'Valor', key: 'totalValue', width: 20 },
      { header: 'Estado', key: 'status', width: 15 },
      { header: 'Vence el', key: 'validUntil', width: 15 },
    ];
    metrics.alerts.forEach(a => sheet3.addRow(a));

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer as Buffer;
  }
}
