import React, { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  Users,
  Search,
  Lock,
  Unlock,
  RefreshCw,
  Zap,
  Key,
  Radio,
  Activity,
} from 'lucide-react';

interface GateLog {
  id: string;
  time: string;
  workerName: string;
  workerId: string;
  gate: string;
  result: 'cleared' | 'denied' | 'override';
  duration: string;
  ppeChecks: {
    helmet: boolean;
    vest: boolean;
    boots: boolean;
    glasses: boolean;
  };
  reason?: string;
}

const INITIAL_LOGS: GateLog[] = [
  {
    id: 'LOG-8841',
    time: '14:28:19',
    workerName: 'Marcus Vance',
    workerId: 'WRK-3651',
    gate: 'GATE 01-A',
    result: 'cleared',
    duration: '0.8s',
    ppeChecks: { helmet: true, vest: true, boots: true, glasses: true },
  },
  {
    id: 'LOG-8840',
    time: '14:26:44',
    workerName: 'Elena Rostova',
    workerId: 'WRK-8947',
    gate: 'GATE 03-C',
    result: 'denied',
    duration: '1.4s',
    ppeChecks: { helmet: true, vest: false, boots: true, glasses: false },
    reason: 'Hi-Vis Vest missing in fabrication queue',
  },
  {
    id: 'LOG-8839',
    time: '14:25:02',
    workerName: 'David Chen',
    workerId: 'WRK-4102',
    gate: 'GATE 01-A',
    result: 'cleared',
    duration: '0.9s',
    ppeChecks: { helmet: true, vest: true, boots: true, glasses: true },
  },
  {
    id: 'LOG-8838',
    time: '14:22:15',
    workerName: 'Sarah Jenkins',
    workerId: 'WRK-1092',
    gate: 'GATE 02-B',
    result: 'cleared',
    duration: '1.1s',
    ppeChecks: { helmet: true, vest: true, boots: true, glasses: true },
  },
  {
    id: 'LOG-8837',
    time: '14:19:30',
    workerName: 'Aarav Patel',
    workerId: 'WRK-5519',
    gate: 'GATE 03-C',
    result: 'denied',
    duration: '2.1s',
    ppeChecks: { helmet: false, vest: true, boots: true, glasses: true },
    reason: 'Hardhat optical beacon missing',
  },
  {
    id: 'LOG-8836',
    time: '14:15:50',
    workerName: 'Mateo Morales',
    workerId: 'WRK-2234',
    gate: 'GATE 04-D',
    result: 'override',
    duration: '4.2s',
    ppeChecks: { helmet: true, vest: true, boots: true, glasses: true },
    reason: 'Manual supervisor keycard pass',
  },
];

export const GateAccessAttendancePage: React.FC = () => {
  const [logs] = useState<GateLog[]>(INITIAL_LOGS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGate, setSelectedGate] = useState<string>('GATE 01-A');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredLogs = logs.filter((log) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      log.workerName.toLowerCase().includes(q) ||
      log.workerId.toLowerCase().includes(q) ||
      log.gate.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: 'calc(100vh - var(--header-height))', backgroundColor: 'var(--surface-0)' }}>
      {/* Toast */}
      {toastMessage && (
        <div style={{
          position: 'fixed', top: '70px', right: '24px', zIndex: 1000,
          backgroundColor: 'var(--surface-3)', border: '1px solid var(--accent-border)',
          borderRadius: '8px', padding: '10px 18px', color: 'var(--text-primary)',
          fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        }}>
          <Zap size={15} style={{ color: 'var(--accent)' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Command Deck Header Strip */}
      <section style={{
        padding: '14px 20px',
        backgroundColor: 'var(--surface-1)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
        gap: '14px',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
              GATE ARRAY PORTAL // 04
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
              color: 'var(--success)', backgroundColor: 'var(--success-dim)',
              padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--success-border)',
            }}>
              SYNCHRONIZED
            </span>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-tertiary)' }}>
            OPTICAL LIDAR • THERMAL FACE-ID • AI PPE SENSOR MATRIX
          </span>
        </div>

        {/* Metric Pods */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ padding: '8px 14px', backgroundColor: 'var(--surface-0)', borderRadius: '6px', border: '1px solid var(--border-subtle)', minWidth: '120px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-tertiary)', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
              <span>PRESENT ON-SITE</span>
              <Users size={13} style={{ color: 'var(--success)' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>148</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--success)' }}>+12 / 10m</span>
            </div>
          </div>

          <div style={{ padding: '8px 14px', backgroundColor: 'var(--surface-0)', borderRadius: '6px', border: '1px solid var(--border-subtle)', minWidth: '120px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-tertiary)', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
              <span>DENIED AT GATE</span>
              <XCircle size={13} style={{ color: 'var(--danger)' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700, color: 'var(--danger)' }}>04</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--danger)' }}>PPE Breaches</span>
            </div>
          </div>

          <div style={{ padding: '8px 14px', backgroundColor: 'var(--surface-0)', borderRadius: '6px', border: '1px solid var(--border-subtle)', minWidth: '120px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-tertiary)', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
              <span>AVG AUTH TIME</span>
              <Clock size={13} style={{ color: 'var(--accent)' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700, color: 'var(--accent)' }}>1.2</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)' }}>SEC / PERS</span>
            </div>
          </div>

          <div style={{ padding: '8px 14px', backgroundColor: 'var(--surface-0)', borderRadius: '6px', border: '1px solid var(--border-subtle)', minWidth: '120px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-tertiary)', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
              <span>TURNSTILE YIELD</span>
              <Activity size={13} style={{ color: 'var(--warning)' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>97.4%</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--success)' }}>NOMINAL</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Operational Arena: 65% Visual Matrix + 35% Live Telemetry Log */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px',
        padding: '16px', gap: '16px', flex: 1,
      }}>
        {/* Left: 4 Visual Turnstile Gates */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            backgroundColor: 'var(--surface-1)', padding: '10px 14px', borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
              SECURE INGRESS MATRIX: BAYS ALPHA THROUGH DELTA
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--success)' }} /> CLEARED (1)</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent)' }} /> READY (1)</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--danger)' }} /> LOCKOUT (1)</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--warning)' }} /> RESTRICTED (1)</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
            {/* Gate 01-A: Cleared / Passing */}
            <div
              onClick={() => setSelectedGate('GATE 01-A')}
              style={{
                backgroundColor: 'var(--surface-1)', borderRadius: '8px',
                border: selectedGate === 'GATE 01-A' ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                borderTop: '3px solid var(--success)', padding: '14px',
                display: 'flex', flexDirection: 'column', gap: '10px',
                cursor: 'pointer', boxShadow: 'var(--shadow-panel)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>GATE 01-A</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)' }}>MAIN INGRESS</span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, color: 'var(--success)', backgroundColor: 'var(--success-dim)', padding: '2px 6px', borderRadius: '3px' }}>
                  CLEARED: PASSING
                </span>
              </div>

              {/* Graphic Simulation */}
              <div style={{
                height: '140px', backgroundColor: 'var(--surface-0)', borderRadius: '6px',
                position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid var(--border-subtle)',
              }}>
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '2px', backgroundColor: 'var(--success)', boxShadow: '0 0 10px #34d399' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', zIndex: 5 }}>
                  <div style={{ width: '24px', height: '80px', backgroundColor: 'var(--surface-2)', borderRadius: '4px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
                    <span style={{ width: '8px', height: '3px', backgroundColor: 'var(--success)', borderRadius: '1px' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', color: 'var(--text-tertiary)' }}>LIDAR</span>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--success)' }} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <User size={36} style={{ color: 'var(--success)' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--success)', fontWeight: 600 }}>T. VANCE (#8841)</span>
                  </div>

                  <div style={{ width: '24px', height: '80px', backgroundColor: 'var(--surface-2)', borderRadius: '4px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
                    <span style={{ width: '8px', height: '3px', backgroundColor: 'var(--success)', borderRadius: '1px' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', color: 'var(--text-tertiary)' }}>CAM</span>
                    <CheckCircle size={10} style={{ color: 'var(--success)' }} />
                  </div>
                </div>

                <div style={{ position: 'absolute', bottom: '6px', left: '10px', right: '10px', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-tertiary)' }}>
                  <span>PASS VERIFIED: 0.8s</span>
                  <span style={{ color: 'var(--success)' }}>WING UNLOCKED</span>
                </div>
              </div>

              {/* PPE Checks */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
                <div style={{ backgroundColor: 'var(--surface-0)', padding: '5px', borderRadius: '4px', textAlign: 'center' }}>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '8px' }}>HARDHAT</div>
                  <div style={{ color: 'var(--success)', fontWeight: 700 }}>PASS</div>
                </div>
                <div style={{ backgroundColor: 'var(--surface-0)', padding: '5px', borderRadius: '4px', textAlign: 'center' }}>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '8px' }}>HI-VIS VEST</div>
                  <div style={{ color: 'var(--success)', fontWeight: 700 }}>PASS</div>
                </div>
                <div style={{ backgroundColor: 'var(--surface-0)', padding: '5px', borderRadius: '4px', textAlign: 'center' }}>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '8px' }}>BOOTS</div>
                  <div style={{ color: 'var(--success)', fontWeight: 700 }}>PASS</div>
                </div>
              </div>
            </div>

            {/* Gate 02-B: Cleanroom Air Shower (Idle / Ready) */}
            <div
              onClick={() => setSelectedGate('GATE 02-B')}
              style={{
                backgroundColor: 'var(--surface-1)', borderRadius: '8px',
                border: selectedGate === 'GATE 02-B' ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                borderTop: '3px solid var(--accent)', padding: '14px',
                display: 'flex', flexDirection: 'column', gap: '10px',
                cursor: 'pointer', boxShadow: 'var(--shadow-panel)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>GATE 02-B</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)' }}>AIR SHOWER</span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, color: 'var(--accent)', backgroundColor: 'var(--accent-dim)', padding: '2px 6px', borderRadius: '3px' }}>
                  IDLE / READY
                </span>
              </div>

              <div style={{
                height: '140px', backgroundColor: 'var(--surface-0)', borderRadius: '6px',
                position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid var(--border-subtle)',
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <Radio size={32} style={{ color: 'var(--accent)' }} className="animate-pulse" />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>AWAITING BADGE SCAN</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-tertiary)' }}>HEPA AIR SHOWER PURGE: NOMINAL</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
                <div style={{ backgroundColor: 'var(--surface-0)', padding: '5px', borderRadius: '4px', textAlign: 'center' }}>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '8px' }}>FILTER</div>
                  <div style={{ color: 'var(--accent)', fontWeight: 700 }}>99.8%</div>
                </div>
                <div style={{ backgroundColor: 'var(--surface-0)', padding: '5px', borderRadius: '4px', textAlign: 'center' }}>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '8px' }}>CHAMBER</div>
                  <div style={{ color: 'var(--accent)', fontWeight: 700 }}>SEALED</div>
                </div>
                <div style={{ backgroundColor: 'var(--surface-0)', padding: '5px', borderRadius: '4px', textAlign: 'center' }}>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '8px' }}>SENSOR</div>
                  <div style={{ color: 'var(--success)', fontWeight: 700 }}>ONLINE</div>
                </div>
              </div>
            </div>

            {/* Gate 03-C: Lockout / Denied (Red) */}
            <div
              onClick={() => setSelectedGate('GATE 03-C')}
              style={{
                backgroundColor: 'var(--surface-1)', borderRadius: '8px',
                border: selectedGate === 'GATE 03-C' ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                borderTop: '3px solid var(--danger)', padding: '14px',
                display: 'flex', flexDirection: 'column', gap: '10px',
                cursor: 'pointer', boxShadow: 'var(--shadow-panel)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>GATE 03-C</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)' }}>FABRICATION PORTAL</span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: 'var(--danger)', backgroundColor: 'var(--danger-dim)', padding: '2px 6px', borderRadius: '3px' }}>
                  LOCKOUT / DENIED
                </span>
              </div>

              <div style={{
                height: '140px', backgroundColor: 'var(--surface-0)', borderRadius: '6px',
                position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid var(--danger-border)',
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <Lock size={30} style={{ color: 'var(--danger)' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--danger)', fontWeight: 700 }}>
                    WING MECHANICAL LOCK ENGAGED
                  </span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: 'var(--text-secondary)' }}>
                    Breach: Hi-Vis vest missing & Eye protection unverified
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
                <div style={{ backgroundColor: 'var(--surface-0)', padding: '5px', borderRadius: '4px', textAlign: 'center' }}>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '8px' }}>HARDHAT</div>
                  <div style={{ color: 'var(--success)', fontWeight: 700 }}>PASS</div>
                </div>
                <div style={{ backgroundColor: 'var(--surface-0)', padding: '5px', borderRadius: '4px', textAlign: 'center' }}>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '8px' }}>HI-VIS VEST</div>
                  <div style={{ color: 'var(--danger)', fontWeight: 700 }}>FAIL</div>
                </div>
                <div style={{ backgroundColor: 'var(--surface-0)', padding: '5px', borderRadius: '4px', textAlign: 'center' }}>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '8px' }}>EYEWEAR</div>
                  <div style={{ color: 'var(--danger)', fontWeight: 700 }}>FAIL</div>
                </div>
              </div>
            </div>

            {/* Gate 04-D: Restricted Access */}
            <div
              onClick={() => setSelectedGate('GATE 04-D')}
              style={{
                backgroundColor: 'var(--surface-1)', borderRadius: '8px',
                border: selectedGate === 'GATE 04-D' ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                borderTop: '3px solid var(--warning)', padding: '14px',
                display: 'flex', flexDirection: 'column', gap: '10px',
                cursor: 'pointer', boxShadow: 'var(--shadow-panel)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>GATE 04-D</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)' }}>HAZMAT CORRIDOR</span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, color: 'var(--warning)', backgroundColor: 'var(--warning-dim)', padding: '2px 6px', borderRadius: '3px' }}>
                  RESTRICTED (LVL-4)
                </span>
              </div>

              <div style={{
                height: '140px', backgroundColor: 'var(--surface-0)', borderRadius: '6px',
                position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid var(--border-subtle)',
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <Key size={30} style={{ color: 'var(--warning)' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--warning)', fontWeight: 600 }}>
                    DUAL AUTHORIZATION REQUIRED
                  </span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: 'var(--text-secondary)' }}>
                    SCBA Respirator + Level A Suit Mandated
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
                <div style={{ backgroundColor: 'var(--surface-0)', padding: '5px', borderRadius: '4px', textAlign: 'center' }}>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '8px' }}>SCBA TANK</div>
                  <div style={{ color: 'var(--success)', fontWeight: 700 }}>PASS</div>
                </div>
                <div style={{ backgroundColor: 'var(--surface-0)', padding: '5px', borderRadius: '4px', textAlign: 'center' }}>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '8px' }}>GAS CALIBRATION</div>
                  <div style={{ color: 'var(--success)', fontWeight: 700 }}>PASS</div>
                </div>
                <div style={{ backgroundColor: 'var(--surface-0)', padding: '5px', borderRadius: '4px', textAlign: 'center' }}>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '8px' }}>PASS LIMIT</div>
                  <div style={{ color: 'var(--warning)', fontWeight: 700 }}>2 MAX</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Telemetry Ingress Log & Controls */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Quick Gate Controls */}
          <div style={{
            backgroundColor: 'var(--surface-1)', borderRadius: '8px',
            border: '1px solid var(--border-subtle)', padding: '14px',
            display: 'flex', flexDirection: 'column', gap: '10px',
          }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
              PORTAL OVERRIDE CONTROLS
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                onClick={() => showToast('Emergency Lockdown dispatched to all 4 portals')}
                style={{
                  padding: '8px', backgroundColor: 'var(--danger-dim)', border: '1px solid var(--danger-border)',
                  color: 'var(--danger)', borderRadius: '6px', fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer',
                }}
              >
                <Lock size={13} />
                <span>LOCK ALL GATES</span>
              </button>
              <button
                onClick={() => showToast(`Manual unlock clearance issued for ${selectedGate}`)}
                style={{
                  padding: '8px', backgroundColor: 'var(--success-dim)', border: '1px solid var(--success-border)',
                  color: 'var(--success)', borderRadius: '6px', fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer',
                }}
              >
                <Unlock size={13} />
                <span>OVERRIDE GATE</span>
              </button>
            </div>
            <button
              onClick={() => showToast('Badge RFID & Facial Biometric database re-synchronized')}
              style={{
                width: '100%', padding: '7px', backgroundColor: 'var(--surface-2)', border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)', borderRadius: '6px', fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer',
              }}
            >
              <RefreshCw size={13} />
              <span>SYNC RFID / NFC CREDENTIALS</span>
            </button>
          </div>

          {/* Real-time Ingress Stream Log */}
          <div style={{
            backgroundColor: 'var(--surface-1)', borderRadius: '8px',
            border: '1px solid var(--border-subtle)', padding: '14px',
            display: 'flex', flexDirection: 'column', gap: '10px', flex: 1,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                ACCESS STREAM LOG
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)' }}>
                STREAMING LIVE
              </span>
            </div>

            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search ingress log..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', backgroundColor: 'var(--surface-0)',
                  border: '1px solid var(--border-subtle)', borderRadius: '6px',
                  padding: '5px 8px 5px 28px', fontFamily: 'var(--font-sans)', fontSize: '11px',
                  color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box',
                }}
              />
              <Search size={13} style={{ position: 'absolute', left: '9px', top: '8px', color: 'var(--text-tertiary)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto', flex: 1 }}>
              {filteredLogs.map((log) => {
                const isCleared = log.result === 'cleared';
                const isDenied = log.result === 'denied';
                const color = isCleared ? 'var(--success)' : isDenied ? 'var(--danger)' : 'var(--warning)';
                return (
                  <div
                    key={log.id}
                    style={{
                      padding: '8px', backgroundColor: 'var(--surface-0)',
                      borderRadius: '6px', border: '1px solid var(--border-subtle)',
                      display: 'flex', flexDirection: 'column', gap: '4px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {log.workerName}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-tertiary)' }}>
                        {log.time}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>{log.gate}</span>
                      <span style={{ color, fontWeight: 700, textTransform: 'uppercase' }}>
                        {log.result} ({log.duration})
                      </span>
                    </div>

                    {log.reason && (
                      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: 'var(--danger)', marginTop: '2px' }}>
                        {log.reason}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
