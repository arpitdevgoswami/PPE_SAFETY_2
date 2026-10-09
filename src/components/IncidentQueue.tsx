import React from 'react';
import { RefreshCw, AlertTriangle, Video } from 'lucide-react';
import type { IncidentAlert } from '../types';

interface IncidentQueueProps {
  incidents: IncidentAlert[];
  onSelectIncident: (incident: IncidentAlert) => void;
}

function timeAgoLabel(raw: string): string {
  return raw.replace('AGO', 'ago').replace('DISPATCHED', 'dispatched');
}

export const IncidentQueue: React.FC<IncidentQueueProps> = ({ incidents, onSelectIncident }) => {
  return (
    <section style={{
      width: '100%',
      backgroundColor: 'var(--surface-1)',
      borderTop: '1px solid var(--border-subtle)',
      padding: '10px 16px 12px',
      flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '10px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            fontFamily: 'var(--font-sans)', fontSize: '13px',
            fontWeight: 600, color: 'var(--text-primary)',
          }}>Recent incidents</span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px',
            padding: '1px 8px', borderRadius: '999px',
            backgroundColor: 'var(--warning-dim)',
            color: 'var(--warning)',
            border: '1px solid var(--warning-border)',
            fontWeight: 500,
          }}>{incidents.length} unresolved</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <RefreshCw size={12} strokeWidth={1.5}
            style={{ color: 'var(--success)' }}
            className="animate-spin"
          />
          <span style={{
            fontFamily: 'var(--font-sans)', fontSize: '12px',
            color: 'var(--text-tertiary)',
          }}>Live updates</span>
        </div>
      </div>

      {/* Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '8px',
      }}>
        {incidents.map((inc) => {
          const isCrit = inc.severity === 'CRITICAL';
          const borderColor  = isCrit ? 'var(--danger)'  : 'var(--warning)';
          const badgeBg      = isCrit ? 'var(--danger-dim)' : 'var(--warning-dim)';
          const badgeBorder  = isCrit ? 'var(--danger-border)' : 'var(--warning-border)';
          const badgeColor   = isCrit ? 'var(--danger)' : 'var(--warning)';

          const statusColors: Record<string, { bg: string; color: string; border: string }> = {
            DISPATCHED:   { bg: 'var(--accent-dim)',   color: 'var(--accent)',   border: 'var(--accent-border)' },
            ALERTED:      { bg: 'var(--warning-dim)',  color: 'var(--warning)',  border: 'var(--warning-border)' },
            ACKNOWLEDGED: { bg: 'var(--success-dim)',  color: 'var(--success)',  border: 'var(--success-border)' },
          };
          const sc = statusColors[inc.status] ?? statusColors['ALERTED'];
          const statusLabel = inc.status.charAt(0) + inc.status.slice(1).toLowerCase();

          return (
            <div
              key={inc.id}
              onClick={() => onSelectIncident(inc)}
              style={{
                backgroundColor: 'var(--surface-2)',
                borderRadius: '10px',
                borderLeft: `3px solid ${borderColor}`,
                border: `1px solid var(--border-subtle)`,
                borderLeftColor: borderColor,
                borderLeftWidth: '3px',
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px',
                cursor: 'pointer',
                transition: 'background 0.15s, border-color 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'var(--surface-3)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              {/* Thumbnail */}
              <div style={{
                width: '44px', height: '44px',
                backgroundColor: 'var(--surface-0)',
                borderRadius: '8px', position: 'relative',
                flexShrink: 0, overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid var(--border-default)',
              }}>
                <Video size={18} strokeWidth={1.5}
                  style={{ color: badgeColor, opacity: 0.7 }} />
                <span style={{
                  position: 'absolute', top: 0, right: 0,
                  backgroundColor: badgeBg, color: badgeColor,
                  fontFamily: 'var(--font-mono)', fontSize: '7px',
                  fontWeight: 700, padding: '1px 3px',
                  borderRadius: '0 8px 0 4px',
                  border: `1px solid ${badgeBorder}`,
                }}>{isCrit ? 'CRIT' : 'WARN'}</span>
              </div>

              {/* Body */}
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontFamily: 'var(--font-sans)', fontSize: '13px',
                    fontWeight: 600, color: 'var(--text-primary)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    maxWidth: '65%',
                  }}>
                    {inc.title.charAt(0) + inc.title.slice(1).toLowerCase().replace(/_/g, ' ')}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '11px',
                    color: 'var(--text-tertiary)', flexShrink: 0,
                  }}>{timeAgoLabel(inc.timeAgo ?? inc.timestamp)}</span>
                </div>

                <span style={{
                  fontFamily: 'var(--font-sans)', fontSize: '12px',
                  color: 'var(--text-secondary)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {inc.zoneName.replace(/\(.*\)/, '').trim()} · {inc.workerId}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '3px',
                    padding: '1px 7px', borderRadius: '999px',
                    fontSize: '11px', fontWeight: 500,
                    backgroundColor: sc.bg, color: sc.color,
                    border: `1px solid ${sc.border}`,
                  }}>
                    <AlertTriangle size={9} strokeWidth={2} />
                    {statusLabel}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '11px',
                    color: 'var(--text-tertiary)',
                  }}>{inc.confidenceScore}% conf.</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
