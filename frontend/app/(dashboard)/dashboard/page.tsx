'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ClipboardText, Buildings, Wrench, FileText, DownloadSimple,
  ArrowRight, CheckCircle, Clock, Truck, Hourglass,
} from '@phosphor-icons/react';
import { workOrdersApi, clientsApi, equipmentApi, quotesApi, dashboardApi } from '@/lib/api';
import { KPICards } from '@/components/dashboard/KPICards';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { StatusChart } from '@/components/dashboard/StatusChart';
import { TopClientsChart } from '@/components/dashboard/TopClientsChart';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';
import { formatDateTime, OT_STATUS_LABELS, formatCOP } from '@/lib/utils/formatters';
import type { WorkOrder, Client, Equipment, Quote, OtStats } from '@/lib/types';
import { useAuth } from '@/lib/hooks/useAuth';
import { subscribeToWorkOrderEvents } from '@/lib/work-order-realtime';

const STATUS_COLORS: Record<string, string> = {
  RECIBIDO:    '#3b82f6',
  EN_PROCESO:  '#f59e0b',
  CALIBRADO:   '#8b5cf6',
  LISTO_ENVIO: '#22c55e',
  DESPACHADO:  '#6b7280',
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  RECIBIDO:    <Clock size={16} />,
  EN_PROCESO:  <Hourglass size={16} />,
  CALIBRADO:   <CheckCircle size={16} />,
  LISTO_ENVIO: <CheckCircle size={16} />,
  DESPACHADO:  <Truck size={16} />,
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<OtStats | null>(null);
  const [recentOTs, setRecentOTs] = useState<WorkOrder[]>([]);
  const [clientCount, setClientCount] = useState(0);
  const [equipmentCount, setEquipmentCount] = useState(0);
  const [quoteCount, setQuoteCount] = useState(0);
  
  const [allEquipment, setAllEquipment] = useState<Equipment[]>([]);
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('TODAS');

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'operaciones' | 'finanzas'>('operaciones');

  // Analytics states
  const [kpis, setKpis] = useState<any>(null);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [revenuePeriod, setRevenuePeriod] = useState<'day' | 'month' | 'quarter' | 'year'>('month');
  const [advancedMetrics, setAdvancedMetrics] = useState<any>(null);
  const [exporting, setExporting] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      const [otStats, ots, clients, equips, quotes, kpiRes, statusRes, advRes] = await Promise.all([
        workOrdersApi.getStats(),
        workOrdersApi.getAll(1, 5),
        clientsApi.getAll(1, 100),
        equipmentApi.getAll(1, 1000),
        quotesApi.getAll(1, 1),
        dashboardApi.getKpis(),
        dashboardApi.getQuotesByStatus(),
        dashboardApi.getAdvancedMetrics(),
      ]);
      setStats(otStats);
      setRecentOTs(ots.data);
      setClientCount(clients.meta.total);
      setEquipmentCount(equips.meta.total);
      setQuoteCount(quotes.meta.total);
      setAllClients(clients.data);
      setAllEquipment(equips.data);
      setKpis({ ...kpiRes, wipValue: advRes.wipValue });
      setStatusData(statusRes);
      setAdvancedMetrics(advRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => subscribeToWorkOrderEvents(fetchAll), [fetchAll]);

  useEffect(() => {
    dashboardApi.getRevenueTimeline(revenuePeriod).then(setRevenueData).catch(console.error);
  }, [revenuePeriod]);

  const handleExport = async () => {
    try {
      setExporting(true);
      const blob = await dashboardApi.exportDashboard();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `dashboard_gerencial_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exportando dashboard', error);
      alert('Error al exportar el reporte');
    } finally {
      setExporting(false);
    }
  };

  const kpiCards = [
    {
      label: 'Clientes Activos',
      value: clientCount,
      icon: <Buildings size={24} weight="duotone" />,
      href: '/clients',
      accent: '#3b82f6',
      iconBg: 'rgba(59,130,246,0.12)',
    },
    {
      label: 'Equipos Recibidos',
      value: equipmentCount,
      icon: <Wrench size={24} weight="duotone" />,
      href: '/equipment',
      accent: '#8b5cf6',
      iconBg: 'rgba(139,92,246,0.12)',
    },
    {
      label: 'Órdenes de Trabajo',
      value: stats?.total || 0,
      icon: <ClipboardText size={24} weight="duotone" />,
      href: '/work-orders',
      accent: '#ec060b',
      iconBg: 'rgba(236,6,11,0.12)',
    },
    {
      label: 'Cotizaciones',
      value: quoteCount,
      icon: <FileText size={24} weight="duotone" />,
      href: '/quotes',
      accent: '#22c55e',
      iconBg: 'rgba(34,197,94,0.12)',
    },
    {
      label: 'Eficiencia (Lead Time)',
      value: advancedMetrics?.leadTimeDays ? `${advancedMetrics.leadTimeDays} días` : '0 días',
      icon: <Clock size={24} weight="duotone" />,
      href: '/work-orders',
      accent: '#f59e0b',
      iconBg: 'rgba(245,158,11,0.12)',
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
        <div className="spinner spinner--lg" />
      </div>
    );
  }

  const filteredEquipment = selectedClient === 'TODAS' 
    ? allEquipment 
    : allEquipment.filter(e => e.clientId === selectedClient);

  const equipmentTypeCounts = filteredEquipment.reduce((acc, eq) => {
    const type = eq.name || '(en blanco)';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const equipmentChartData = Object.entries(equipmentTypeCounts).sort((a, b) => b[1] - a[1]);
  const maxEqCount = equipmentChartData.length ? Math.max(...equipmentChartData.map(d => d[1])) : 1;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 className="page-header__title">
            Bienvenido, {user?.name || 'Administrador'} <span style={{ animation: 'wave 2s infinite', display: 'inline-block' }}>👋</span>
          </h1>
          <p className="page-header__subtitle">
            Aquí está el resumen del sistema &middot; {new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="btn btn--primary"
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            {exporting ? (
              <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
            ) : (
              <DownloadSimple size={20} weight="bold" />
            )}
            {exporting ? 'Exportando...' : 'Exportar Reporte'}
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: 16, borderBottom: '1px solid var(--color-border)', marginBottom: 32 }}>
        <button
          onClick={() => setActiveTab('operaciones')}
          style={{
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: 600,
            color: activeTab === 'operaciones' ? 'var(--color-brand)' : 'var(--color-text-muted)',
            borderBottom: activeTab === 'operaciones' ? '3px solid var(--color-brand)' : '3px solid transparent',
            background: 'transparent',
            transition: 'all 0.2s',
          }}
        >
          Operaciones y Flujo
        </button>
        <button
          onClick={() => setActiveTab('finanzas')}
          style={{
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: 600,
            color: activeTab === 'finanzas' ? 'var(--color-brand)' : 'var(--color-text-muted)',
            borderBottom: activeTab === 'finanzas' ? '3px solid var(--color-brand)' : '3px solid transparent',
            background: 'transparent',
            transition: 'all 0.2s',
          }}
        >
          Finanzas y Cotizaciones
        </button>
      </div>

      {activeTab === 'operaciones' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {/* KPI Cards */}
          <div className="grid-4" style={{ marginBottom: 32 }}>
            {kpiCards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
              >
                <Link href={card.href} style={{ display: 'block' }}>
                  <div
                    className="stat-card"
                    style={{ '--card-accent': card.accent, '--card-icon-bg': card.iconBg } as any}
                  >
                    <div className="stat-card__icon" style={{ background: card.iconBg, color: card.accent }}>
                      {card.icon}
                    </div>
                    <div className="stat-card__body">
                      <div className="stat-card__label">{card.label}</div>
                      <div className="stat-card__value">{card.value}</div>
                      <div className="stat-card__sub" style={{ color: card.accent, display: 'flex', alignItems: 'center', gap: 4 }}>
                        Ver todos <ArrowRight size={12} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="grid-2">
            {/* OT por Estado */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.3 }}
              className="card"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Estado de Órdenes de Trabajo</h2>
                <Link href="/work-orders" className="btn btn--ghost btn--sm" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  Ver todas <ArrowRight size={14} />
                </Link>
              </div>

              {stats?.byStatus.length ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {stats.byStatus.map((s) => {
                    const pct = Math.round((parseInt(s.count) / (stats.total || 1)) * 100);
                    return (
                      <div key={s.status}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem' }}>
                            <span style={{ color: STATUS_COLORS[s.status] }}>{STATUS_ICONS[s.status]}</span>
                            <span>{OT_STATUS_LABELS[s.status] || s.status}</span>
                          </div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                            {s.count} ({pct}%)
                          </span>
                        </div>
                        <div style={{ height: 6, background: 'var(--color-surface-2)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
                            style={{
                              height: '100%',
                              background: STATUS_COLORS[s.status],
                              borderRadius: 'var(--radius-full)',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state" style={{ padding: '32px 0' }}>
                  <p>No hay órdenes de trabajo aún</p>
                </div>
              )}
            </motion.div>

            {/* OTs recientes */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="card"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Órdenes Recientes</h2>
                <Link href="/work-orders" className="btn btn--ghost btn--sm" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  Ver todas <ArrowRight size={14} />
                </Link>
              </div>

              {recentOTs.length ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {recentOTs.map((ot, i) => (
                    <motion.div
                      key={ot.id}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.45 + i * 0.05 }}
                    >
                      <Link
                        href={`/work-orders/${ot.id}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--color-surface-2)',
                          transition: 'all var(--transition)',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}>
                            {ot.otNumber}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                            {ot.client?.companyName}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span
                            className="badge bg-slate-100 text-slate-800"
                            style={{ fontSize: '0.65rem' }}
                          >
                            {ot.items?.length || 0} items
                          </span>
                          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-subtle)', marginTop: 4 }}>
                            {formatDateTime(ot.createdAt)}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="empty-state" style={{ padding: '32px 0' }}>
                  <p>Sin órdenes recientes</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Gráfico de Equipos (Instrumentos) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="card"
            style={{ marginTop: 24 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Total Equipos por Instrumento</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Cliente:</label>
                <select
                  className="form-input form-input--sm"
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  style={{ minWidth: 200 }}
                >
                  <option value="TODAS">(Todas)</option>
                  {allClients.map((c) => (
                    <option key={c.id} value={c.id}>{c.companyName}</option>
                  ))}
                </select>
              </div>
            </div>

            {equipmentChartData.length ? (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 200, paddingBottom: 24, overflowX: 'auto', borderBottom: '1px solid var(--color-border)' }}>
                {equipmentChartData.map(([type, count]) => {
                  const heightPct = Math.max((count / maxEqCount) * 100, 5); // at least 5% so bar is visible
                  return (
                    <div key={type} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 60, gap: 8 }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-subtle)' }}>{count}</span>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPct}%` }}
                        transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
                        style={{
                          width: 40,
                          background: 'linear-gradient(to top, #b30000, #ff1a1a)',
                          borderRadius: '4px 4px 0 0',
                          boxShadow: '0 2px 8px rgba(179, 0, 0, 0.2)'
                        }}
                      />
                      <span style={{ fontSize: '0.75rem', textAlign: 'center', maxWidth: 80, wordBreak: 'break-word', color: 'var(--color-text)' }}>
                        {type}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '40px 0' }}>
                <p>No se encontraron equipos para el cliente seleccionado</p>
              </div>
            )}
            <div style={{ marginTop: 16, textAlign: 'right', fontSize: '0.875rem', fontWeight: 700 }}>
              Total general: {filteredEquipment.length}
            </div>
          </motion.div>
        </motion.div>
      )}

      {activeTab === 'finanzas' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <KPICards data={kpis} />
          
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'stretch', marginBottom: 24 }}>
            <div style={{ flex: '2 1 600px' }}>
              <RevenueChart data={revenueData} period={revenuePeriod} setPeriod={setRevenuePeriod} />
            </div>
            <div style={{ flex: '1 1 300px' }}>
              <StatusChart data={statusData} />
            </div>
          </div>

          {advancedMetrics && (
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'stretch' }}>
              <div style={{ flex: '1 1 400px' }}>
                <TopClientsChart data={advancedMetrics.topClients} />
              </div>
              <div style={{ flex: '1 1 400px' }}>
                <AlertsPanel alerts={advancedMetrics.alerts} />
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
