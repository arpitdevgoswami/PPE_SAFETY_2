import React from 'react';
import { Bell, ShieldCheck, Search, Factory } from 'lucide-react';
import type { SystemMetrics } from '../types';

interface TopHeaderProps {
  metrics: SystemMetrics;
  onAlertClick?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ metrics, onAlertClick }) => {
  return (
    <header style={{
      position: 'fixed', top: 0,
      left: 'var(--sidebar-width)', right: 0,
      height: 'var(--header-height)',
      backgroundColor: 'rgba(17, 21, 29, 0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      zIndex: 40,
      padding: '0 20px',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      {/* Left: logo mark + breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #4C8DFF 0%, #2563eb 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ShieldCheck size={15} strokeWidth={2} style={{ color: '#fff' }} />
          </div>
          <span style={{
            fontFamily: 'var(--font-sans)', fontSize: '14px',
            fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em',
          }}>SmartPPE</span>
        </div>

        <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border-subtle)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Factory size={14} strokeWidth={1.5} style={{ color: 'var(--text-tertiary)' }} />
          <span style={{
            fontFamily: 'var(--font-sans)', fontSize: '13px',
            color: 'var(--text-secondary)',
          }}>Plant 04</span>
          <span style={{ color: 'var(--text-disabled)', fontSize: '13px' }}>/</span>
          <span style={{
            fontFamily: 'var(--font-sans)', fontSize: '13px',
            fontWeight: 500, color: 'var(--text-primary)',
          }}>Command center</span>
        </div>
      </div>

      {/* Right: search + status + bell + user */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Global search */}
        <button style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '6px 12px',
          backgroundColor: 'var(--surface-2)',
          border: '1px solid var(--border-default)',
          borderRadius: '8px',
          color: 'var(--text-tertiary)',
          cursor: 'pointer',
          fontFamily: 'var(--font-sans)', fontSize: '13px',
          transition: 'border-color 0.15s, color 0.15s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--accent)';
          e.currentTarget.style.color = 'var(--text-secondary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-default)';
          e.currentTarget.style.color = 'var(--text-tertiary)';
        }}
        >
          <Search size={14} strokeWidth={1.5} />
          <span>Search...</span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px',
            color: 'var(--text-disabled)',
            backgroundColor: 'var(--surface-3)',
            padding: '1px 5px', borderRadius: '4px',
            border: '1px solid var(--border-default)',
          }}>⌘K</span>
        </button>

        {/* Live status + env pill */}
        <div
          title="Demo environment — synthetic data"
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '4px 10px',
            backgroundColor: 'var(--surface-2)',
            border: '1px solid var(--border-default)',
            borderRadius: '8px',
            cursor: 'default',
          }}
        >
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            backgroundColor: 'var(--success)', flexShrink: 0,
          }} className="animate-pulse-live" />
          <span style={{
            fontFamily: 'var(--font-sans)', fontSize: '12px',
            color: 'var(--text-secondary)',
          }}>Live</span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px',
            color: 'var(--text-disabled)',
          }}>· {metrics.sceneFps} fps</span>
          <span style={{
            marginLeft: '4px',
            fontFamily: 'var(--font-sans)', fontSize: '11px',
            fontWeight: 500,
            padding: '1px 6px', borderRadius: '999px',
            backgroundColor: 'var(--warning-dim)',
            color: 'var(--warning)',
            border: '1px solid var(--warning-border)',
          }}>Demo</span>
        </div>

        <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border-subtle)' }} />

        {/* Bell */}
        <button
          onClick={onAlertClick}
          aria-label="View active alerts"
          title={`${metrics.activeHazards} active hazards`}
          style={{
            position: 'relative',
            background: 'none', border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer', padding: '6px',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'color 0.15s, background-color 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.backgroundColor = 'var(--surface-2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <Bell size={17} strokeWidth={1.5} />
          {metrics.activeHazards > 0 && (
            <span style={{
              position: 'absolute', top: '3px', right: '3px',
              width: '14px', height: '14px', borderRadius: '50%',
              backgroundColor: 'var(--danger)',
              color: '#fff', fontSize: '9px',
              fontFamily: 'var(--font-mono)', fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1.5px solid var(--surface-1)',
            }}>
              {metrics.activeHazards}
            </span>
          )}
        </button>

        {/* User avatar */}
        <div
          title="Safety Director — admin"
          style={{
            width: '30px', height: '30px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #4C8DFF 0%, #7c3aed 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '12px', fontWeight: 600,
            cursor: 'pointer', fontFamily: 'var(--font-sans)',
          }}
        >SD</div>
      </div>
    </header>
  );
};
