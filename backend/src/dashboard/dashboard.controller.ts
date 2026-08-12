import { Controller, Get, Query, UseGuards, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('kpis')
  @ApiOperation({ summary: 'Obtener KPIs principales' })
  getKpis() {
    return this.dashboardService.getKpis();
  }

  @Get('quotes-by-status')
  @ApiOperation({ summary: 'Obtener distribución de cotizaciones por estado' })
  getQuotesByStatus() {
    return this.dashboardService.getQuotesByStatus();
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Obtener ingresos a través del tiempo' })
  getRevenueTimeline(
    @Query('period') period: 'day' | 'month' | 'quarter' | 'year',
  ) {
    return this.dashboardService.getRevenueTimeline(period || 'month');
  }

  @Get('advanced-metrics')
  @ApiOperation({
    summary:
      'Obtener métricas gerenciales avanzadas (Lead time, WIP, Pareto, Alertas)',
  })
  getAdvancedMetrics() {
    return this.dashboardService.getAdvancedMetrics();
  }

  @Get('alerts')
  @ApiOperation({ summary: 'Obtener alertas de cotizaciones por vencer' })
  getAlerts() {
    return this.dashboardService.getAlerts();
  }

  @Get('export')
  @ApiOperation({ summary: 'Exportar Dashboard completo a Excel' })
  async exportDashboard(@Res() res) {
    const buffer = await this.dashboardService.exportDashboardToExcel();
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="dashboard_gerencial.xlsx"',
      'Content-Length': buffer.length,
    });
    res.send(buffer);
  }
}
