'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import { useAuth } from '@/lib/hooks/useAuth';
import { ThemeProvider } from '@/components/ThemeProvider';
import { useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 16,
      }}>
        <div className="spinner spinner--lg" />
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          Cargando sistema...
        </p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <ThemeProvider>
      <div className={`dashboard-layout ${isSidebarCollapsed ? 'dashboard-layout--collapsed' : ''}`}>
        <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} 
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />
        <TopBar onMenuToggle={() => setIsSidebarOpen(true)} />
        <main className="main-content">
          <motion.div
            key={typeof window !== 'undefined' ? window.location.pathname : ''}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="page-container"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </ThemeProvider>
  );
}
