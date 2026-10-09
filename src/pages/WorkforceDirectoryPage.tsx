import React, { useState } from 'react';
import {
  Activity,
  UserCheck,
  Search,
  Vibrate,
  Headphones,
  BellRing,
  Zap,
  Compass,
  Layers,
  Maximize2,
  Crosshair,
} from 'lucide-react';

interface WorkerRecord {
  id: string;
  name: string;
  trade: string;
  zone: string;
  status: 'compliant' | 'warning' | 'critical';
  heartRate: number;
  skinTemp: string;
  shiftTime: string;
  coords: string;
  avatar: string;
  alertMsg?: string;
  ppe: {
    helmet: boolean;
    vest: boolean;
    boots: boolean;
    earPro: boolean;
  };
}

const WORKERS_DATA: WorkerRecord[] = [
  {
    id: 'WRK-3651',
    name: 'Marcus Vance',
    trade: 'Welder Gr. II',
    zone: 'Sector 03 - Fabrication',
    status: 'critical',
    heartRate: 108,
    skinTemp: '37.8°C',
    shiftTime: '05h 22m',
    coords: 'X: 42.8 // Y: 104.1',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    alertMsg: 'Helmet removed in active arc zone (> 2m40s)',
    ppe: { helmet: false, vest: true, boots: true, earPro: true },
  },
  {
    id: 'WRK-8947',
    name: 'Elena Rostova',
    trade: 'Chemical Process Tech',
    zone: 'Sector 02 - Chemical',
    status: 'warning',
    heartRate: 84,
    skinTemp: '36.9°C',
    shiftTime: '06h 10m',
    coords: 'X: 88.4 // Y: 62.0',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    alertMsg: 'Respirator cartridge saturation 88%',
    ppe: { helmet: true, vest: true, boots: true, earPro: true },
  },
  {
    id: 'WRK-4102',
    name: 'David Chen',
    trade: 'Logistics Supervisor',
    zone: 'Sector 04 - Logistics',
    status: 'compliant',
    heartRate: 72,
    skinTemp: '36.5°C',
    shiftTime: '04h 45m',
    coords: 'X: 112.1 // Y: 94.7',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    ppe: { helmet: true, vest: true, boots: true, earPro: true },
  },
  {
    id: 'WRK-1092',
    name: 'Sarah Jenkins',
    trade: 'CNC Machinist',
    zone: 'Sector 01 - Machining',
    status: 'compliant',
    heartRate: 76,
    skinTemp: '36.4°C',
    shiftTime: '07h 05m',
    coords: 'X: 24.5 // Y: 38.2',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    ppe: { helmet: true, vest: true, boots: true, earPro: true },
  },
  {
    id: 'WRK-5519',
    name: 'Aarav Patel',
    trade: 'Electrical Tech',
    zone: 'Sector 03 - Fabrication',
    status: 'warning',
    heartRate: 88,
    skinTemp: '37.1°C',
    shiftTime: '03h 50m',
    coords: 'X: 55.2 // Y: 82.3',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    alertMsg: 'LIDAR beacon telemetry 15% charge',
    ppe: { helmet: true, vest: true, boots: true, earPro: true },
  },
  {
    id: 'WRK-2234',
    name: 'Mateo Morales',
    trade: 'Rigging Specialist',
    zone: 'Sector 04 - Logistics',
    status: 'compliant',
    heartRate: 80,
    skinTemp: '36.7°C',
    shiftTime: '05h 15m',
    coords: 'X: 98.6 // Y: 115.4',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    ppe: { helmet: true, vest: true, boots: true, earPro: true },
  },
  {
    id: 'WRK-7711',
    name: 'Priya Sharma',
    trade: 'Safety Marshal',
    zone: 'Sector 03 - Fabrication',
    status: 'compliant',
    heartRate: 78,
    skinTemp: '36.6°C',
    shiftTime: '06h 40m',
    coords: 'X: 38.1 // Y: 92.4',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    ppe: { helmet: true, vest: true, boots: true, earPro: true },
  },
  {
    id: 'WRK-9042',
    name: 'Liam O’Connor',
    trade: 'Maintenance Lead',
    zone: 'Sector 01 - Machining',
    status: 'compliant',
    heartRate: 74,
    skinTemp: '36.3°C',
    shiftTime: '02h 30m',
    coords: 'X: 18.9 // Y: 52.8',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    ppe: { helmet: true, vest: true, boots: true, earPro: true },
  },
];

export const WorkforceDirectoryPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'compliant' | 'warning' | 'critical'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('WRK-3651');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const selectedWorker = WORKERS_DATA.find((w) => w.id === selectedWorkerId) || WORKERS_DATA[0];

  const filteredWorkers = WORKERS_DATA.filter((w) => {
    if (filter !== 'all' && w.status !== filter) return false;
    if (searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase();
    return (
      w.name.toLowerCase().includes(q) ||
      w.id.toLowerCase().includes(q) ||
      w.trade.toLowerCase().includes(q) ||
      w.zone.toLowerCase().includes(q)
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

      {/* Top Command Ribbon */}
      <section style={{
        padding: '12px 20px',
        backgroundColor: 'var(--surface-1)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 10px', backgroundColor: 'var(--surface-0)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }} className="animate-pulse" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-tertiary)' }}>ACTIVE ON-SHIFT:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700, color: 'var(--success)' }}>148 <span style={{ color: 'var(--text-tertiary)', fontSize: '11px' }}>/ 160</span></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 10px', backgroundColor: 'var(--surface-0)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
            <Activity size={14} style={{ color: 'var(--accent)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-tertiary)' }}>BIOMETRIC BASELINE:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, color: 'var(--accent)' }}>98.2% NOMINAL</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 10px', backgroundColor: 'var(--surface-0)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
            <UserCheck size={14} style={{ color: 'var(--success)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-tertiary)' }}>LONE WORKER ALARMS:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, color: 'var(--success)' }}>0 PENDING</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 10px', backgroundColor: 'var(--danger-dim)', borderRadius: '6px', border: '1px solid var(--danger-border)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--danger)' }} className="animate-pulse" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--danger)', fontWeight: 600 }}>MARSHAL DISPATCH:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--danger)' }}>1 ACTIVE // UNIT-02</span>
          </div>
        </div>

        {/* Filter Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--surface-0)', padding: '2px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '4px 12px', borderRadius: '4px', border: 'none',
              backgroundColor: filter === 'all' ? 'var(--accent-dim)' : 'transparent',
              color: filter === 'all' ? 'var(--accent)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            ALL (148)
          </button>
          <button
            onClick={() => setFilter('compliant')}
            style={{
              padding: '4px 12px', borderRadius: '4px', border: 'none',
              backgroundColor: filter === 'compliant' ? 'var(--success-dim)' : 'transparent',
              color: filter === 'compliant' ? 'var(--success)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            COMPLIANT (142)
          </button>
          <button
            onClick={() => setFilter('warning')}
            style={{
              padding: '4px 12px', borderRadius: '4px', border: 'none',
              backgroundColor: filter === 'warning' ? 'var(--warning-dim)' : 'transparent',
              color: filter === 'warning' ? 'var(--warning)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            WARNING (5)
          </button>
          <button
            onClick={() => setFilter('critical')}
            style={{
              padding: '4px 12px', borderRadius: '4px', border: 'none',
              backgroundColor: filter === 'critical' ? 'var(--danger-dim)' : 'transparent',
              color: filter === 'critical' ? 'var(--danger)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            CRITICAL (1)
          </button>
        </div>
      </section>

      {/* Main Viewport Workspace: 65% Visual Twin + 35% Inspector */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px',
        padding: '16px', gap: '16px', flex: 1,
      }}>
        {/* Left Side: 2.5D Schematic Facility Spatial Twin */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{
            position: 'relative', width: '100%', height: '460px',
            backgroundColor: 'var(--surface-1)', borderRadius: '8px',
            border: '1px solid var(--border-subtle)', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            boxShadow: 'var(--shadow-panel)',
          }}>
            {/* Top Twin Controls */}
            <div style={{
              padding: '10px 14px', zIndex: 10,
              backgroundColor: 'rgba(17, 21, 29, 0.85)', backdropFilter: 'blur(8px)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Layers size={14} /> PLANT 04 // SPATIAL MATRIX (L3)
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 6px', backgroundColor: 'var(--surface-2)', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)' }}>
                  <Compass size={11} style={{ color: 'var(--success)' }} />
                  <span>AZIMUTH 234° // TILT 45°</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button onClick={() => showToast('Orthographic viewport recentered')} style={{ padding: '4px', backgroundColor: 'var(--surface-2)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'var(--text-secondary)', cursor: 'pointer' }} title="Recenter">
                  <Crosshair size={14} />
                </button>
                <button onClick={() => showToast('Density heatmap layer toggled')} style={{ padding: '4px', backgroundColor: 'var(--surface-2)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'var(--text-secondary)', cursor: 'pointer' }} title="Toggle Heatmap">
                  <Layers size={14} />
                </button>
                <button onClick={() => showToast('Full geometry mode enabled')} style={{ padding: '4px', backgroundColor: 'var(--surface-2)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'var(--text-secondary)', cursor: 'pointer' }} title="Fullscreen">
                  <Maximize2 size={14} />
                </button>
              </div>
            </div>

            {/* 2.5D SVG Schematic Map */}
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 1000 520" style={{ width: '100%', height: '100%' }}>
                {/* Outer perimeter */}
                <polygon points="120,320 490,90 920,240 550,470" fill="#131722" stroke="#252d3d" strokeWidth="1.5" />

                {/* Sector 01: Machining */}
                <polygon points="260,250 480,110 600,165 380,305" fill="#18202c" stroke="#2a374a" strokeWidth="1.2" />
                <text x="340" y="180" fill="var(--accent)" fontFamily="var(--font-sans)" fontSize="13" fontWeight="600">SECTOR 01 // MACHINING</text>
                <text x="340" y="195" fill="var(--text-tertiary)" fontFamily="var(--font-mono)" fontSize="9">BAY 1-8 • CNC & MILLING • 38 TECHS</text>
                <circle cx="330" cy="220" r="3.5" fill="var(--success)" />
                <circle cx="400" cy="210" r="3.5" fill="var(--success)" />
                <circle cx="440" cy="170" r="3.5" fill="var(--success)" />
                <circle cx="480" cy="200" r="3.5" fill="var(--success)" />

                {/* Sector 02: Chemical */}
                <polygon points="490,110 720,185 610,260 395,180" fill="#1b1c24" stroke="var(--warning)" strokeDasharray="4 2" strokeWidth="1" />
                <text x="540" y="150" fill="var(--warning)" fontFamily="var(--font-sans)" fontSize="13" fontWeight="600">SECTOR 02 // CHEMICAL</text>
                <text x="540" y="165" fill="var(--warning)" fontFamily="var(--font-mono)" fontSize="9" opacity="0.8">ATEX ZONE 1 • 24 TECHS</text>
                <circle cx="510" cy="150" r="3.5" fill="var(--success)" />
                <circle cx="560" cy="200" r="3.5" fill="var(--success)" />
                <circle cx="610" cy="190" r="5" fill="var(--warning)" className="animate-pulse" />
                <line x1="610" y1="190" x2="660" y2="140" stroke="var(--warning)" strokeWidth="1" />
                <rect x="660" y="125" width="135" height="24" rx="3" fill="var(--surface-2)" stroke="var(--warning)" strokeWidth="1" />
                <text x="668" y="141" fill="var(--warning)" fontFamily="var(--font-mono)" fontSize="10" fontWeight="600">#8947 RESPIRATOR 12%</text>

                {/* Sector 03: Fabrication (Threat target) */}
                <polygon points="200,310 410,190 530,270 320,390" fill="#20171d" stroke="var(--danger)" strokeWidth="1.5" />
                <text x="240" y="300" fill="var(--danger)" fontFamily="var(--font-sans)" fontSize="13" fontWeight="600">SECTOR 03 // FABRICATION</text>
                <text x="240" y="315" fill="var(--danger)" fontFamily="var(--font-mono)" fontSize="9" opacity="0.75">HEAVY ARC WELDING • 48 TECHS</text>
                <circle cx="270" cy="330" r="3.5" fill="var(--success)" />
                <circle cx="320" cy="290" r="3.5" fill="var(--success)" />
                <circle cx="350" cy="340" r="3.5" fill="var(--success)" />
                <circle cx="420" cy="280" r="3.5" fill="var(--success)" />

                {/* Critical Worker 3651 Marcus Vance Pulse */}
                <circle cx="390" cy="310" r="7" fill="var(--danger)" className="animate-ping" opacity="0.8" />
                <circle cx="390" cy="310" r="4" fill="var(--danger)" />
                <line x1="390" y1="310" x2="440" y2="360" stroke="var(--danger)" strokeWidth="1.5" />
                <rect x="440" y="360" width="165" height="26" rx="3" fill="var(--surface-2)" stroke="var(--danger)" strokeWidth="1" />
                <text x="448" y="377" fill="var(--danger)" fontFamily="var(--font-mono)" fontSize="10" fontWeight="700">#3651 NO HELMET (2m40s)</text>

                {/* Sector 04: Logistics */}
                <polygon points="430,290 660,210 850,290 620,380" fill="#14211f" stroke="var(--success)" strokeWidth="1" />
                <text x="630" y="290" fill="var(--success)" fontFamily="var(--font-sans)" fontSize="13" fontWeight="600">SECTOR 04 // LOGISTICS</text>
                <text x="630" y="305" fill="var(--text-tertiary)" fontFamily="var(--font-mono)" fontSize="9">STAGING & AGV • 38 TECHS</text>
                <circle cx="540" cy="330" r="3.5" fill="var(--success)" />
                <circle cx="600" cy="320" r="3.5" fill="var(--success)" />
                <circle cx="660" cy="330" r="4" fill="var(--success)" />
                <line x1="660" y1="330" x2="700" y2="355" stroke="var(--success)" strokeDasharray="2 2" strokeWidth="1" />
                <rect x="700" y="350" width="130" height="20" rx="2" fill="var(--surface-0)" stroke="var(--success)" strokeWidth="0.75" />
                <text x="708" y="364" fill="var(--success)" fontFamily="var(--font-mono)" fontSize="9" fontWeight="600">#4102 D. CHEN (100% OK)</text>

                {/* Marshal response vector path */}
                <path d="M 320 420 L 360 360 L 388 315" stroke="var(--danger)" strokeDasharray="4 4" strokeWidth="2" fill="none" className="animate-pulse" />
              </svg>
            </div>

            {/* Lower Floorplan Cluster Density Badges */}
            <div style={{
              padding: '10px 14px', zIndex: 10,
              backgroundColor: 'rgba(17, 21, 29, 0.85)', backdropFilter: 'blur(8px)',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
              gap: '8px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                <span style={{ backgroundColor: 'var(--surface-2)', padding: '3px 8px', borderRadius: '4px' }}>
                  SEC 01: <span style={{ color: 'var(--success)', fontWeight: 600 }}>38 Workers (100% OK)</span>
                </span>
                <span style={{ backgroundColor: 'var(--surface-2)', padding: '3px 8px', borderRadius: '4px' }}>
                  SEC 02: <span style={{ color: 'var(--warning)', fontWeight: 600 }}>24 Workers (1 Warning)</span>
                </span>
                <span style={{ backgroundColor: 'var(--surface-2)', padding: '3px 8px', borderRadius: '4px', borderLeft: '2px solid var(--danger)' }}>
                  SEC 03: <span style={{ color: 'var(--danger)', fontWeight: 700 }}>48 Workers (1 Breach)</span>
                </span>
                <span style={{ backgroundColor: 'var(--surface-2)', padding: '3px 8px', borderRadius: '4px' }}>
                  SEC 04: <span style={{ color: 'var(--success)', fontWeight: 600 }}>38 Workers (100% OK)</span>
                </span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)' }}>
                UWB LOBE 10Hz REALTIME
              </div>
            </div>
          </div>

          {/* Sector Biometric Micro Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div style={{ backgroundColor: 'var(--surface-1)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
                <span>SEC 03 THERMAL INDEX</span>
                <span style={{ color: 'var(--warning)', fontWeight: 600 }}>ELEVATED</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>29.4°C</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)' }}>+1.8°C / 1hr</span>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--surface-1)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
                <span>SEC 02 VOC / TOXIC PPM</span>
                <span style={{ color: 'var(--success)', fontWeight: 600 }}>NORMAL</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>4.2 PPM</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--success)' }}>SAFE THRESHOLD</span>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--surface-1)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
                <span>PPE BEACON INTEGRITY</span>
                <span style={{ color: 'var(--success)', fontWeight: 600 }}>147/148 ACTIVE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>99.3%</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--danger)' }}>1 FAULT DETECTED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Target Inspector & Notice Feed */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Selected Worker Inspector */}
          <div style={{
            backgroundColor: 'var(--surface-1)', borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            borderLeft: selectedWorker.status === 'critical' ? '4px solid var(--danger)' : selectedWorker.status === 'warning' ? '4px solid var(--warning)' : '4px solid var(--success)',
            padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px',
            boxShadow: 'var(--shadow-card)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                TARGET INSPECTOR
              </span>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
                color: selectedWorker.status === 'critical' ? 'var(--danger)' : selectedWorker.status === 'warning' ? 'var(--warning)' : 'var(--success)',
                backgroundColor: selectedWorker.status === 'critical' ? 'var(--danger-dim)' : selectedWorker.status === 'warning' ? 'var(--warning-dim)' : 'var(--success-dim)',
                padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase',
              }}>
                {selectedWorker.status}
              </span>
            </div>

            {/* Profile */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <img
                src={selectedWorker.avatar}
                alt={selectedWorker.name}
                style={{ width: '52px', height: '52px', borderRadius: '8px', objectFit: 'cover' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {selectedWorker.name}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-tertiary)' }}>
                    {selectedWorker.id}
                  </span>
                </div>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {selectedWorker.trade}
                </span>
                <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', padding: '1px 5px', backgroundColor: 'var(--surface-2)', borderRadius: '3px', color: 'var(--text-secondary)' }}>
                    {selectedWorker.zone}
                  </span>
                </div>
              </div>
            </div>

            {/* Telemetry Matrix */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
              <div style={{ backgroundColor: 'var(--surface-0)', padding: '6px 8px', borderRadius: '4px' }}>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '9px' }}>COORDINATES</div>
                <div style={{ color: 'var(--accent)', fontWeight: 600 }}>{selectedWorker.coords}</div>
              </div>
              <div style={{ backgroundColor: 'var(--surface-0)', padding: '6px 8px', borderRadius: '4px' }}>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '9px' }}>SHIFT DURATION</div>
                <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedWorker.shiftTime}</div>
              </div>
              <div style={{ backgroundColor: 'var(--surface-0)', padding: '6px 8px', borderRadius: '4px' }}>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '9px' }}>HEART RATE</div>
                <div style={{ color: selectedWorker.heartRate > 100 ? 'var(--danger)' : 'var(--text-primary)', fontWeight: 700 }}>
                  {selectedWorker.heartRate} BPM
                </div>
              </div>
              <div style={{ backgroundColor: 'var(--surface-0)', padding: '6px 8px', borderRadius: '4px' }}>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '9px' }}>SKIN TEMP</div>
                <div style={{ color: 'var(--warning)', fontWeight: 600 }}>{selectedWorker.skinTemp}</div>
              </div>
            </div>

            {/* Hardware registration */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>
                HARDWARE REGISTRATION MATRIX
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
                <div style={{ backgroundColor: 'var(--surface-2)', padding: '5px 8px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>HELMET</span>
                  <span style={{ color: selectedWorker.ppe.helmet ? 'var(--success)' : 'var(--danger)', fontWeight: 700 }}>
                    {selectedWorker.ppe.helmet ? 'ON' : 'OFF'}
                  </span>
                </div>
                <div style={{ backgroundColor: 'var(--surface-2)', padding: '5px 8px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>HI-VIS VEST</span>
                  <span style={{ color: selectedWorker.ppe.vest ? 'var(--success)' : 'var(--danger)', fontWeight: 700 }}>
                    {selectedWorker.ppe.vest ? 'ON' : 'OFF'}
                  </span>
                </div>
                <div style={{ backgroundColor: 'var(--surface-2)', padding: '5px 8px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>BOOTS</span>
                  <span style={{ color: selectedWorker.ppe.boots ? 'var(--success)' : 'var(--danger)', fontWeight: 700 }}>
                    {selectedWorker.ppe.boots ? 'LINKED' : 'FAULT'}
                  </span>
                </div>
                <div style={{ backgroundColor: 'var(--surface-2)', padding: '5px 8px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>EAR PRO</span>
                  <span style={{ color: selectedWorker.ppe.earPro ? 'var(--success)' : 'var(--warning)', fontWeight: 700 }}>
                    {selectedWorker.ppe.earPro ? 'ACTIVE' : 'IDLE'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
              <button
                onClick={() => showToast(`Safety Marshal dispatched to ${selectedWorker.name} (${selectedWorker.zone})`)}
                style={{
                  flex: 1, padding: '8px',
                  backgroundColor: 'var(--danger)', color: '#fff',
                  border: 'none', borderRadius: '6px',
                  fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}
              >
                <BellRing size={14} />
                <span>DISPATCH MARSHAL</span>
              </button>
              <button
                onClick={() => showToast(`Haptic alert buzzed on vest #${selectedWorker.id}`)}
                style={{ padding: '8px 12px', backgroundColor: 'var(--surface-2)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)', cursor: 'pointer' }}
                title="Send Haptic Buzz"
              >
                <Vibrate size={15} />
              </button>
              <button
                onClick={() => showToast(`Direct radio hail open with ${selectedWorker.name}`)}
                style={{ padding: '8px 12px', backgroundColor: 'var(--surface-2)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)', cursor: 'pointer' }}
                title="Direct Radio Comm"
              >
                <Headphones size={15} />
              </button>
            </div>
          </div>

          {/* Incident Notices Feed */}
          <div style={{
            backgroundColor: 'var(--surface-1)', borderRadius: '8px',
            border: '1px solid var(--border-subtle)', padding: '14px',
            display: 'flex', flexDirection: 'column', gap: '8px', flex: 1,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                ACTIVE NOTICES
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)' }}>
                AUTO-REFRESH 1s
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto' }}>
              <div
                onClick={() => setSelectedWorkerId('WRK-3651')}
                style={{ padding: '8px', backgroundColor: 'var(--danger-dim)', border: '1px solid var(--danger-border)', borderRadius: '6px', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--danger)', fontWeight: 600 }}>
                  <span>Vance, Marcus (#3651)</span>
                  <span>14:22:04</span>
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Helmet optical sensor detached in arc zone &gt; 2m
                </div>
              </div>

              <div
                onClick={() => setSelectedWorkerId('WRK-8947')}
                style={{ padding: '8px', backgroundColor: 'var(--warning-dim)', border: '1px solid var(--warning-border)', borderRadius: '6px', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--warning)', fontWeight: 600 }}>
                  <span>Rostova, Elena (#8947)</span>
                  <span>14:19:12</span>
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Cartridge filter particulate saturation &gt; 88%
                </div>
              </div>

              <div
                onClick={() => setSelectedWorkerId('WRK-5519')}
                style={{ padding: '8px', backgroundColor: 'var(--surface-2)', border: '1px solid var(--border-subtle)', borderRadius: '6px', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-primary)', fontWeight: 600 }}>
                  <span>Patel, Aarav (#5519)</span>
                  <span>13:58:30</span>
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  LIDAR beacon telemetry 15% charge
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom Workforce Telemetry Matrix Roster */}
      <section style={{
        padding: '16px 20px',
        backgroundColor: 'var(--surface-1)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex', flexDirection: 'column', gap: '12px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              WORKFORCE TELEMETRY MATRIX
            </h3>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', backgroundColor: 'var(--surface-2)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-tertiary)' }}>
              STREAMING {filteredWorkers.length} NODES
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Filter by Name, ID, or Zone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  backgroundColor: 'var(--surface-0)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '6px 10px 6px 30px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                  width: '240px',
                  outline: 'none',
                }}
              />
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '9px', color: 'var(--text-tertiary)' }} />
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
          {filteredWorkers.map((w) => {
            const isSelected = selectedWorkerId === w.id;
            const borderColor = w.status === 'critical' ? 'var(--danger)' : w.status === 'warning' ? 'var(--warning)' : 'var(--success)';
            return (
              <div
                key={w.id}
                onClick={() => setSelectedWorkerId(w.id)}
                style={{
                  backgroundColor: isSelected ? 'var(--surface-3)' : 'var(--surface-0)',
                  borderRadius: '6px',
                  border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                  borderLeft: `3px solid ${borderColor}`,
                  padding: '10px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={w.avatar} alt={w.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{w.name}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)' }}>{w.id}</span>
                    </div>
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700,
                    color: borderColor, backgroundColor: 'rgba(255,255,255,0.04)',
                    padding: '2px 5px', borderRadius: '3px', textTransform: 'uppercase',
                  }}>
                    {w.status}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontFamily: 'var(--font-mono)', fontSize: '10px', backgroundColor: 'var(--surface-1)', padding: '5px', borderRadius: '4px' }}>
                  <div>
                    <span style={{ color: 'var(--text-tertiary)' }}>HEART: </span>
                    <span style={{ color: w.heartRate > 100 ? 'var(--danger)' : 'var(--text-primary)', fontWeight: 600 }}>{w.heartRate} BPM</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-tertiary)' }}>TEMP: </span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{w.skinTemp}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
