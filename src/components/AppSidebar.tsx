import React from 'react';
import {
  LayoutGrid,
  Activity,
  Users,
  CalendarCheck,
  ShieldCheck,
  MapPin,
  AlertTriangle,
  BarChart3,
  Settings,
  Wifi,
  ChevronRight,
} from 'lucide-react';

export type NavItemKey =
  | 'overview'
  | 'monitoring'
  | 'workers'
  | 'attendance'
  | 'ppe'
  | 'zones'
  | 'incidents'
  | 'analytics'
  | 'settings';

interface AppSidebarProps {
  activeItem: NavItemKey;
  onSelectItem: (key: NavItemKey) => void;
  latencyMs?: number;
}

interface NavItemDef {
  key: NavItemKey;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  badge?: string | number;
}

const NAV_GROUPS: { label: string; items: NavItemDef[] }[] = [
  {
    label: 'Operations',
    items: [
      { key: 'overview',   label: 'Overview',       icon: LayoutGrid },
      { key: 'monitoring', label: 'Monitoring',     icon: Activity },
      { key: 'incidents',  label: 'Alerts',         icon: AlertTriangle, badge: 3 },
    ],
  },
  {
    label: 'Management',
    items: [
      { key: 'workers',    label: 'Workers',        icon: Users },
      { key: 'attendance', label: 'Attendance',     icon: CalendarCheck },
      { key: 'ppe',        label: 'PPE assignment', icon: ShieldCheck },
      { key: 'zones',      label: 'Work zones',     icon: MapPin },
    ],
  },
  {
    label: 'System',
    items: [
      { key: 'analytics', label: 'Analytics',      icon: BarChart3 },
      { key: 'settings',  label: 'Settings',       icon: Settings },
    ],
  },
];

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeItem,
  onSelectItem,
  latencyMs = 14,
}) => {
  return (
    <aside style={{
      position: 'fixed',
      left: 0, top: 0, bottom: 0,
      width: 'var(--sidebar-width)',
      backgroundColor: 'var(--surface-1)',
      borderRight: '1px solid var(--border-subtle)',
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Logo */}
      <div style={{
        height: 'var(--header-height)',
        padding: '0 16px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', gap: '10px',
        flexShrink: 0,
      }}>
        <div style={{
          width: '28px', height: '28px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #4C8DFF 0%, #2563eb 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <ShieldCheck size={16} strokeWidth={2} style={{ color: '#fff' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
          <span style={{
            fontFamily: 'var(--font-sans)', fontSize: '14px',
            fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em',
          }}>SmartPPE</span>
          <span style={{
            fontFamily: 'var(--font-sans)', fontSize: '11px',
            color: 'var(--text-tertiary)', fontWeight: 400,
          }}>Safety platform</span>
        </div>
      </div>

      {/* Nav groups */}
      <nav style={{
        flex: 1, padding: '12px 8px',
        display: 'flex', flexDirection: 'column', gap: '20px',
        overflowY: 'auto',
      }}>
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <div style={{
              padding: '0 8px 6px',
              fontFamily: 'var(--font-sans)', fontSize: '11px',
              fontWeight: 500, color: 'var(--text-disabled)',
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              {group.label}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              {group.items.map((item) => {
                const isActive = activeItem === item.key;
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => onSelectItem(item.key)}
                    title={item.label}
                    style={{
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      backgroundColor: isActive ? 'var(--accent-dim)' : 'transparent',
                      color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                      border: 'none',
                      borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                      borderRadius: '0 8px 8px 0',
                      cursor: 'pointer', textAlign: 'left', width: '100%',
                      transition: 'background-color 0.15s, color 0.15s',
                      fontFamily: 'var(--font-sans)', fontSize: '13px',
                      fontWeight: isActive ? 500 : 400,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'var(--surface-3)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                      <Icon size={16} strokeWidth={isActive ? 2 : 1.5} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span style={{
                        fontSize: '11px', fontWeight: 500,
                        padding: '1px 6px', borderRadius: '999px',
                        backgroundColor: 'var(--danger-dim)',
                        color: 'var(--danger)',
                        border: '1px solid var(--danger-border)',
                        lineHeight: 1.5, fontFamily: 'var(--font-mono)',
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom: status + user */}
      <div style={{
        padding: '12px 8px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex', flexDirection: 'column', gap: '8px',
        flexShrink: 0,
      }}>
        {/* Live status */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '7px 10px',
          backgroundColor: 'var(--success-dim)',
          border: '1px solid var(--success-border)',
          borderRadius: '8px',
        }}>
          <Wifi size={13} strokeWidth={1.5} style={{ color: 'var(--success)', flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-sans)', fontSize: '12px',
              fontWeight: 500, color: 'var(--success)', lineHeight: 1.2,
            }}>Connected</div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '11px',
              color: 'var(--text-tertiary)', lineHeight: 1.2,
            }}>{latencyMs} ms latency</div>
          </div>
          <div style={{
            width: '6px', height: '6px',
            borderRadius: '50%', backgroundColor: 'var(--success)',
            flexShrink: 0,
          }} className="animate-pulse-live" />
        </div>

        {/* User */}
        <button
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '8px 10px',
            backgroundColor: 'transparent', border: 'none',
            borderRadius: '8px', cursor: 'pointer',
            textAlign: 'left', width: '100%',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--surface-3)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <div style={{
            width: '30px', height: '30px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #4C8DFF 0%, #7c3aed 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '12px', fontWeight: 600,
            flexShrink: 0, fontFamily: 'var(--font-sans)',
          }}>SD</div>
          <div style={{ flex: 1, minWidth: 0, lineHeight: 1.3 }}>
            <div style={{
              fontFamily: 'var(--font-sans)', fontSize: '13px',
              fontWeight: 500, color: 'var(--text-primary)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>Safety Director</div>
            <div style={{
              fontFamily: 'var(--font-sans)', fontSize: '11px',
              color: 'var(--text-tertiary)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>Plant 04 — admin</div>
          </div>
          <ChevronRight size={14} strokeWidth={1.5}
            style={{ color: 'var(--text-disabled)', flexShrink: 0 }} />
        </button>
      </div>
    </aside>
  );
};
