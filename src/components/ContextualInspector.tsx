import React, { useState } from 'react';
import {
  AlertTriangle, ShieldAlert, ShieldCheck,
  CheckCircle, User, Send, Heart, Thermometer,
} from 'lucide-react';
import type { WorkZone, WorkerData } from '../types';

interface ContextualInspectorProps {
  selectedZone: WorkZone;
  selectedWorker?: WorkerData | null;
  onDispatchMarshal?: (zoneId: string) => void;
  onAcknowledge?: (zoneId: string) => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{
        fontFamily: 'var(--font-sans)', fontSize: '11px',
        fontWeight: 500, color: 'var(--text-disabled)',
        letterSpacing: '0.06em', textTransform: 'uppercase',
        paddingBottom: '6px',
        borderBottom: '1px solid var(--border-subtle)',
      }}>{title}</div>
      {children}
    </div>
  );
}

function KVRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      padding: '5px 0',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-secondary)' }}>
        {label}
      </span>
      <span style={{
        fontFamily: 'var(--font-sans)', fontSize: '13px',
        fontWeight: 500, color: valueColor ?? 'var(--text-primary)',
        textAlign: 'right', maxWidth: '55%',
      }}>
        {value}
      </span>
    </div>
  );
}

export const ContextualInspector: React.FC<ContextualInspectorProps> = ({
  selectedZone,
  selectedWorker,
  onDispatchMarshal,
  onAcknowledge,
}) => {
  const [acknowledged, setAcknowledged] = useState(false);
  const [dispatched, setDispatched] = useState(false);

  const isCritical = selectedZone.status === 'DANGER';
  const isWarning  = selectedZone.status === 'WARNING';

  const statusColor  = isCritical ? 'var(--danger)'  : isWarning ? 'var(--warning)'  : 'var(--success)';
  const statusBg     = isCritical ? 'var(--danger-dim)'  : isWarning ? 'var(--warning-dim)'  : 'var(--success-dim)';
  const statusBorder = isCritical ? 'var(--danger-border)' : isWarning ? 'var(--warning-border)' : 'var(--success-border)';
  const StatusIcon   = isCritical ? ShieldAlert : isWarning ? AlertTriangle : ShieldCheck;

  const statusLabel   = isCritical ? 'Critical' : isWarning ? 'Warning' : 'Compliant';
  const statusMessage = isCritical
    ? 'Helmet infraction detected — immediate action required'
    : isWarning
    ? 'PPE check required before proceeding'
    : 'All operators compliant';

  const ppeItems = selectedWorker ? [
    { label: 'Helmet',    ok: selectedWorker.ppe.helmet ?? false },
    { label: 'Vest',      ok: selectedWorker.ppe.vest ?? false },
    { label: 'Boots',     ok: selectedWorker.ppe.boots ?? false },
    { label: 'Respirator',ok: selectedWorker.ppe.respirator ?? true },
  ] : [];

  return (
    <div style={{
      width: '100%', height: '100%',
      backgroundColor: 'var(--surface-1)',
      display: 'flex', flexDirection: 'column',
      overflowY: 'auto',
      animation: 'slideIn 0.2s ease-out',
    }}>
      {/* Panel header */}
      <div style={{
        padding: '14px 16px 12px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-sans)', fontSize: '11px',
            fontWeight: 500, color: 'var(--text-tertiary)',
            letterSpacing: '0.06em', textTransform: 'uppercase',
            marginBottom: '2px',
          }}>Zone inspector</div>
          <h2 style={{
            fontFamily: 'var(--font-sans)', fontSize: '15px',
            fontWeight: 600, color: 'var(--text-primary)',
          }}>{selectedZone.name}</h2>
        </div>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '11px',
          fontWeight: 500,
          backgroundColor: 'var(--accent-dim)',
          color: 'var(--accent)',
          border: '1px solid var(--accent-border)',
          padding: '2px 8px', borderRadius: '999px',
        }}>{selectedZone.code}</span>
      </div>

      <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Status banner */}
        <div style={{
          padding: '10px 12px',
          backgroundColor: statusBg,
          border: `1px solid ${statusBorder}`,
          borderRadius: '10px',
          display: 'flex', alignItems: 'flex-start', gap: '10px',
        }}>
          <StatusIcon size={17} strokeWidth={1.5} style={{ color: statusColor, flexShrink: 0, marginTop: '1px' }} />
          <div>
            <div style={{
              fontFamily: 'var(--font-sans)', fontSize: '13px',
              fontWeight: 600, color: statusColor, marginBottom: '2px',
            }}>{statusLabel}</div>
            <div style={{
              fontFamily: 'var(--font-sans)', fontSize: '12px',
              color: 'var(--text-secondary)', lineHeight: 1.4,
            }}>{statusMessage}</div>
          </div>
        </div>

        {/* Zone details */}
        <Section title="Zone details">
          <KVRow label="Active workers" value={`${selectedZone.activeWorkers} / ${selectedZone.maxCapacity}`} valueColor="var(--accent)" />
          <KVRow label="Camera stream" value={selectedZone.opticalCamera} valueColor="var(--success)" />
          <KVRow label="Ambient noise" value={selectedZone.ambientNoise} />
          <KVRow label="Required PPE" value={selectedZone.requiredPPE.join(', ')} valueColor="var(--warning)" />
        </Section>

        {/* Worker card */}
        {selectedWorker && (
          <Section title="Worker">
            <div style={{
              backgroundColor: 'var(--surface-2)',
              border: '1px solid var(--border-default)',
              borderRadius: '10px',
              padding: '12px',
            }}>
              {/* Avatar row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4C8DFF 0%, #7c3aed 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '13px', fontWeight: 600, flexShrink: 0,
                  fontFamily: 'var(--font-sans)',
                }}>
                  {selectedWorker.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'var(--font-sans)', fontSize: '13px',
                    fontWeight: 600, color: 'var(--text-primary)',
                  }}>{selectedWorker.name}</div>
                  <div style={{
                    fontFamily: 'var(--font-sans)', fontSize: '12px',
                    color: 'var(--text-secondary)',
                  }}>{selectedWorker.role}</div>
                </div>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '11px',
                  color: 'var(--text-tertiary)',
                }}>{selectedWorker.id}</span>
              </div>

              {/* Vitals */}
              <div style={{
                display: 'flex', gap: '8px', marginBottom: '10px',
                paddingBottom: '10px', borderBottom: '1px solid var(--border-subtle)',
              }}>
                {selectedWorker.vitals && (
                  <>
                    <div style={{
                      flex: 1, display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '6px 8px', borderRadius: '8px',
                      backgroundColor: 'var(--success-dim)',
                      border: '1px solid var(--success-border)',
                    }}>
                      <Heart size={13} strokeWidth={1.5} style={{ color: 'var(--success)' }} />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--success)' }}>
                        {selectedWorker.vitals.heartRate} bpm
                      </span>
                    </div>
                    <div style={{
                      flex: 1, display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '6px 8px', borderRadius: '8px',
                      backgroundColor: 'var(--surface-3)',
                      border: '1px solid var(--border-default)',
                    }}>
                      <Thermometer size={13} strokeWidth={1.5} style={{ color: 'var(--info)' }} />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {selectedWorker.vitals.bodyTemp} °C
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* PPE chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {ppeItems.map(({ label, ok }) => (
                  <span key={label} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    padding: '3px 8px', borderRadius: '999px',
                    fontSize: '12px', fontWeight: 500,
                    backgroundColor: ok ? 'var(--success-dim)' : 'var(--danger-dim)',
                    color: ok ? 'var(--success)' : 'var(--danger)',
                    border: `1px solid ${ok ? 'var(--success-border)' : 'var(--danger-border)'}`,
                  }}>
                    {ok
                      ? <CheckCircle size={10} strokeWidth={2} />
                      : <AlertTriangle size={10} strokeWidth={2} />
                    }
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </Section>
        )}

        {/* Evidence */}
        <Section title="Evidence feed">
          <div style={{
            backgroundColor: 'var(--surface-2)',
            border: '1px solid var(--border-default)',
            borderRadius: '10px', overflow: 'hidden',
          }}>
            {/* Camera frame */}
            <div style={{
              position: 'relative', height: '130px',
              backgroundColor: '#05070a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(rgba(30,41,59,0.3) 1px, transparent 1px)',
                backgroundSize: '14px 14px',
              }} />
              <div style={{ position: 'absolute', top: '8px', left: '10px', right: '10px', display: 'flex', justifyContent: 'space-between', zIndex: 2 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)' }}>CAM-04-FAB</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--danger)' }} className="animate-pulse-live" />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--danger)', fontWeight: 600 }}>REC</span>
                </div>
              </div>
              <div style={{
                width: '72px', height: '90px',
                border: '1.5px solid var(--danger)',
                borderRadius: '4px',
                display: 'flex', flexDirection: 'column',
                justifyContent: 'space-between', padding: '3px',
                backgroundColor: 'var(--danger-dim)',
                position: 'relative', zIndex: 2,
              }}>
                <span style={{
                  backgroundColor: 'var(--danger)', color: '#fff',
                  fontFamily: 'var(--font-mono)', fontSize: '7px',
                  fontWeight: 700, padding: '1px 3px',
                  borderRadius: '2px', alignSelf: 'flex-start',
                }}>No helmet</span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.8 }}>
                  <User size={32} style={{ color: 'var(--danger)' }} />
                </div>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '8px',
                  color: 'var(--text-secondary)', textAlign: 'center',
                }}>97.4% confidence</span>
              </div>
            </div>

            {/* Evidence metadata */}
            <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)' }}>
                  Helmet infraction detected
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-tertiary)',
                }}>2 min ago</span>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button
                  onClick={() => { setDispatched(true); if (onDispatchMarshal) onDispatchMarshal(selectedZone.id); }}
                  disabled={dispatched}
                  style={{
                    width: '100%', padding: '8px',
                    backgroundColor: dispatched ? 'var(--surface-3)' : 'var(--danger)',
                    color: dispatched ? 'var(--text-secondary)' : '#fff',
                    border: dispatched ? '1px solid var(--border-default)' : 'none',
                    fontFamily: 'var(--font-sans)', fontSize: '13px',
                    fontWeight: 500, cursor: dispatched ? 'default' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    borderRadius: '8px', transition: 'background 0.15s',
                    opacity: dispatched ? 0.6 : 1,
                  }}
                >
                  <Send size={13} strokeWidth={1.5} />
                  {dispatched ? 'Marshal dispatched' : 'Dispatch safety marshal'}
                </button>
                <button
                  onClick={() => { setAcknowledged(true); if (onAcknowledge) onAcknowledge(selectedZone.id); }}
                  disabled={acknowledged}
                  style={{
                    width: '100%', padding: '7px',
                    backgroundColor: 'transparent',
                    color: acknowledged ? 'var(--success)' : 'var(--text-secondary)',
                    border: '1px solid var(--border-default)',
                    fontFamily: 'var(--font-sans)', fontSize: '13px',
                    fontWeight: 500, cursor: acknowledged ? 'default' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    borderRadius: '8px', transition: 'color 0.15s',
                    opacity: acknowledged ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => { if (!acknowledged) e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
                  onMouseLeave={(e) => { if (!acknowledged) e.currentTarget.style.borderColor = 'var(--border-default)'; }}
                >
                  <CheckCircle size={13} strokeWidth={1.5} />
                  {acknowledged ? 'Acknowledged' : 'Acknowledge event'}
                </button>
              </div>
            </div>
          </div>
        </Section>

        {/* Sensor health */}
        <Section title="Sensor health">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {[
              { name: 'Optical', val: '100%', ok: true },
              { name: 'Thermal', val: '98%', ok: true },
              { name: 'Proximity', val: '100%', ok: true },
            ].map(s => (
              <div key={s.name} style={{
                padding: '8px', borderRadius: '8px', textAlign: 'center',
                backgroundColor: 'var(--surface-2)',
                border: '1px solid var(--border-subtle)',
              }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '2px' }}>{s.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 500, color: 'var(--success)' }}>{s.val}</div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
};
