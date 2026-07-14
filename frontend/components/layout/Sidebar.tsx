'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  SquaresFour,
  Users,
  Buildings,
  FileText,
  Wrench,
  ClipboardText,
  EnvelopeOpen,
  Gear,
  SignOut,
  ChartBar,
  CaretLeft,
  CaretRight,
} from '@phosphor-icons/react';
import { useAuth } from '@/lib/hooks/useAuth';
import { getInitials } from '@/lib/utils/formatters';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles?: string[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',         href: '/dashboard',       icon: <SquaresFour size={20} weight="duotone" /> },
  { label: 'Clientes',          href: '/clients',         icon: <Buildings size={20} weight="duotone" /> },
  { label: 'Cotizaciones',      href: '/quotes',          icon: <FileText size={20} weight="duotone" /> },
  { label: 'Equipos',           href: '/equipment',       icon: <Wrench size={20} weight="duotone" /> },
  { label: 'Órdenes de Trabajo',href: '/work-orders',     icon: <ClipboardText size={20} weight="duotone" /> },
  { label: 'Solicitudes Email', href: '/email-requests',  icon: <EnvelopeOpen size={20} weight="duotone" />, roles: ['ADMIN', 'COMERCIAL'] },
  { label: 'Usuarios',          href: '/users',           icon: <Users size={20} weight="duotone" />, roles: ['ADMIN'] },
  { label: 'Administración',    href: '/admin',           icon: <Gear size={20} weight="duotone" />, roles: ['ADMIN'] },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.success('Sesión cerrada');
    router.push('/login');
  };

  const filteredItems = NAV_ITEMS.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role)),
  );

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'sidebar-overlay--open' : ''}`} onClick={() => setIsOpen(false)} />
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''} ${isCollapsed ? 'sidebar--collapsed' : ''}`}>
        
        {/* Toggle Button (Desktop only) */}
        <button
          className="desktop-only sidebar__toggle-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expandir menú' : 'Contraer menú'}
        >
          {isCollapsed ? <CaretRight weight="bold" size={14} /> : <CaretLeft weight="bold" size={14} />}
        </button>

        {/* Logo */}
        <div className="sidebar__logo">
        <div style={{
          width: 36,
          height: 36,
          background: 'white',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 3,
          flexShrink: 0,
        }}>
          <Image
            src="/logo.png"
            alt="Labtronix"
            width={30}
            height={30}
            style={{ objectFit: 'contain' }}
          />
        </div>
        <div className="sidebar__logo-text" style={{ display: isCollapsed ? 'none' : 'flex' }}>
          <span className="sidebar__logo-name">Labtronix</span>
          <span className="sidebar__logo-sub">Metrología</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar__nav">
        <span className="sidebar__section-label" style={{ opacity: isCollapsed ? 0 : 1, transition: 'opacity 0.2s' }}>
          Menú principal
        </span>
        {filteredItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20 }}>
                {item.icon}
              </div>
              {!isCollapsed && <span>{item.label}</span>}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(236,6,11,0.08)',
                    borderRadius: 'var(--radius-md)',
                    zIndex: -1,
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      {user && (
        <div className="sidebar__footer" style={{ padding: isCollapsed ? '16px 8px' : '16px 12px' }}>
          <div className="sidebar__user" style={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
            <div className="sidebar__user-avatar" title={isCollapsed ? user.name : undefined}>
              {getInitials(user.name)}
            </div>
            {!isCollapsed && (
              <div className="sidebar__user-info">
                <div className="sidebar__user-name">{user.name}</div>
                <div className="sidebar__user-role">{user.role}</div>
              </div>
            )}
            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              style={{
                display: isCollapsed ? 'none' : 'flex',
                alignItems: 'center',
                padding: 6,
                borderRadius: 'var(--radius-sm)',
                transition: 'all var(--transition)',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = 'var(--color-brand)';
                (e.target as HTMLElement).style.background = 'rgba(236,6,11,0.1)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = 'var(--color-text-muted)';
                (e.target as HTMLElement).style.background = 'transparent';
              }}
            >
              <SignOut size={18} />
            </button>
          </div>
        </div>
      )}
    </aside>
    </>
  );
}
