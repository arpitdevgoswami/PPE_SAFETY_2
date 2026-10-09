import React from 'react';
import type { NavItemKey } from './AppSidebar';
import { Construction, ArrowLeft } from 'lucide-react';

interface ModulePlaceholderProps {
  moduleKey: NavItemKey;
  onReturnToOverview: () => void;
}

const MODULE_TITLES: Record<NavItemKey, string> = {
  overview:   'Command center overview',
  monitoring: 'Real-time optical monitoring',
  workers:    'Workforce directory',
  attendance: 'Attendance tracking',
  ppe:        'PPE assignment',
  zones:      'Work zone management',
  incidents:  'Incident history',
  analytics:  'Safety analytics',
  settings:   'Platform settings',
};

const MODULE_DESCRIPTIONS: Record<NavItemKey, string> = {
  overview:   'The 3D digital twin command center.',
  monitoring: 'Live optical sensor feeds and multi-camera monitoring.',
  workers:    'Browse and manage your workforce with live telemetry.',
  attendance: 'Automated gate-access and attendance logs.',
  ppe:        'Assign and track PPE equipment across workers.',
  zones:      'Geo-fencing, risk boundaries, and zone configuration.',
  incidents:  'Full incident timeline, evidence review, and replay.',
  analytics:  'Predictive safety analytics and compliance trends.',
  settings:   'System configuration, model thresholds, and integrations.',
};

export const ModulePlaceholder: React.FC<ModulePlaceholderProps> = ({
  moduleKey,
  onReturnToOverview,
}) => {
  return (
    <div style={{
      width: '100%', minHeight: '600px',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px', gap: '20px',
      backgroundColor: 'var(--surface-0)',
    }}>
      <div style={{
        width: '56px', height: '56px', borderRadius: '12px',
        backgroundColor: 'var(--surface-2)',
        border: '1px solid var(--accent-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--accent)',
      }}>
        <Construction size={26} strokeWidth={1.5} />
      </div>

      <div style={{ maxWidth: '440px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{
          fontFamily: 'var(--font-sans)', fontSize: '11px',
          fontWeight: 500, color: 'var(--accent)',
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>In development</span>
        <h2 style={{
          fontFamily: 'var(--font-sans)', fontSize: '20px',
          fontWeight: 600, color: 'var(--text-primary)',
        }}>
          {MODULE_TITLES[moduleKey]}
        </h2>
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: '14px',
          color: 'var(--text-secondary)', lineHeight: 1.6,
        }}>
          {MODULE_DESCRIPTIONS[moduleKey]}
        </p>
      </div>

      <button
        onClick={onReturnToOverview}
        style={{
          marginTop: '8px', padding: '8px 16px',
          backgroundColor: 'var(--accent-dim)',
          color: 'var(--accent)',
          border: '1px solid var(--accent-border)',
          borderRadius: '8px',
          fontFamily: 'var(--font-sans)', fontSize: '13px',
          fontWeight: 500, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '8px',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(76,141,255,0.2)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--accent-dim)'; }}
      >
        <ArrowLeft size={14} strokeWidth={1.5} />
        Back to overview
      </button>
    </div>
  );
};
