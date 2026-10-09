import React, { useState } from 'react';
import {
  MapPin,
  Zap,
  RefreshCw,
} from 'lucide-react';

interface ZoneDetail {
  id: string;
  name: string;
  classification: string;
  vocPpm: string;
  temp: string;
  noiseDba: string;
  lelPercent: string;
  occupancy: number;
  maxOccupancy: number;
  status: 'nominal' | 'warning' | 'critical';
  policies: {
    hardhat: boolean;
    vest: boolean;
    eyewear: boolean;
    respirator: boolean;
    hearing: boolean;
    arcShield: boolean;
  };
}

const ZONES_DATA: Record<string, ZoneDetail> = {
  'ZONE-01': {
    id: 'ZONE-01',
    name: 'CNC Machining Bay',
    classification: 'Class-1 Standard Heavy Machinery',
    vocPpm: '0.12 PPM',
    temp: '22.4°C',
    noiseDba: '86.2 dBA',
    lelPercent: '0.00%',
    occupancy: 38,
    maxOccupancy: 45,
    status: 'nominal',
    policies: { hardhat: true, vest: true, eyewear: true, respirator: false, hearing: true, arcShield: false },
  },
  'ZONE-02': {
    id: 'ZONE-02',
    name: 'Solvent & ATEX Reactor Area',
    classification: 'ATEX Zone 1 Hazardous Vapor',
    vocPpm: '0.42 PPM',
    temp: '24.2°C',
    noiseDba: '78.4 dBA',
    lelPercent: '0.04%',
    occupancy: 24,
    maxOccupancy: 30,
    status: 'warning',
    policies: { hardhat: true, vest: true, eyewear: true, respirator: true, hearing: true, arcShield: false },
  },
  'ZONE-03': {
    id: 'ZONE-03',
    name: 'Robotic Arc Bay & Fabrication',
    classification: 'HV + Thermal Extreme Arc Hazard',
    vocPpm: '0.28 PPM',
    temp: '29.4°C',
    noiseDba: '92.1 dBA',
    lelPercent: '0.00%',
    occupancy: 48,
    maxOccupancy: 50,
    status: 'critical',
    policies: { hardhat: true, vest: true, eyewear: true, respirator: false, hearing: true, arcShield: true },
  },
  'ZONE-04': {
    id: 'ZONE-04',
    name: 'AGV Automated Logistics Corridor',
    classification: 'Autonomous Mobile Robot Transit',
    vocPpm: '0.08 PPM',
    temp: '21.8°C',
    noiseDba: '72.0 dBA',
    lelPercent: '0.00%',
    occupancy: 38,
    maxOccupancy: 60,
    status: 'nominal',
    policies: { hardhat: true, vest: true, eyewear: false, respirator: false, hearing: false, arcShield: false },
  },
};

export const SpatialZonesPage: React.FC = () => {
  const [selectedZoneKey, setSelectedZoneKey] = useState<string>('ZONE-02');
  const [viewAngle, setViewAngle] = useState<'iso' | 'top'>('iso');
  const [activeTool, setActiveTool] = useState<string>('edit');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const currentZone = ZONES_DATA[selectedZoneKey] || ZONES_DATA['ZONE-02'];

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

      {/* Top Bar */}
      <div style={{
        padding: '12px 20px', backgroundColor: 'var(--surface-1)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-tertiary)' }}>
            <MapPin size={15} style={{ color: 'var(--accent)' }} />
            <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>FACILITY 04</span>
            <span>/</span>
            <span>LEVEL-02 SPATIAL TWIN</span>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '3px 10px',
            backgroundColor: 'var(--surface-2)', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '11px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--success)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>4 ACTIVE POLYGONS</span>
            <span style={{ color: 'var(--text-tertiary)' }}>•</span>
            <span style={{ color: 'var(--accent)' }}>12 SENSOR NODES</span>
            <span style={{ color: 'var(--text-tertiary)' }}>•</span>
            <span style={{ color: 'var(--danger)', fontWeight: 600 }}>1 BUFFER BREACH</span>
          </div>
        </div>

        {/* Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', backgroundColor: 'var(--surface-0)', padding: '2px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => { setActiveTool('edit'); showToast('Edit Boundary tool active'); }}
              style={{
                padding: '4px 10px', borderRadius: '4px', border: 'none',
                backgroundColor: activeTool === 'edit' ? 'var(--accent-dim)' : 'transparent',
                color: activeTool === 'edit' ? 'var(--accent)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
              }}
            >
              Edit Boundary
            </button>
            <button
              onClick={() => { setActiveTool('exclusion'); showToast('Draw Exclusion tool active'); }}
              style={{
                padding: '4px 10px', borderRadius: '4px', border: 'none',
                backgroundColor: activeTool === 'exclusion' ? 'var(--accent-dim)' : 'transparent',
                color: activeTool === 'exclusion' ? 'var(--accent)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
              }}
            >
              Draw Exclusion
            </button>
            <button
              onClick={() => { setActiveTool('decibel'); showToast('Set Decibel threshold tool active'); }}
              style={{
                padding: '4px 10px', borderRadius: '4px', border: 'none',
                backgroundColor: activeTool === 'decibel' ? 'var(--accent-dim)' : 'transparent',
                color: activeTool === 'decibel' ? 'var(--accent)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
              }}
            >
              Set Decibel
            </button>
            <button
              onClick={() => { setActiveTool('gas'); showToast('Gas Threshold tool active'); }}
              style={{
                padding: '4px 10px', borderRadius: '4px', border: 'none',
                backgroundColor: activeTool === 'gas' ? 'var(--accent-dim)' : 'transparent',
                color: activeTool === 'gas' ? 'var(--accent)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
              }}
            >
              Gas Threshold
            </button>
          </div>

          <button
            onClick={() => showToast('Geofence mesh pushed to 18 UWB local RTLS anchor nodes')}
            style={{
              padding: '6px 12px', backgroundColor: 'var(--surface-2)', border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)', borderRadius: '6px', fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
            }}
          >
            <RefreshCw size={13} style={{ color: 'var(--success)' }} />
            <span>PUSH GEOFENCE MESH</span>
          </button>
        </div>
      </div>

      {/* Main Viewport Workspace: 65% Interactive Ortho Canvas + 35% Inspector */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px',
        padding: '16px', gap: '16px', flex: 1,
      }}>
        {/* Left: Ortho Geo Twin Canvas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{
            position: 'relative', width: '100%', height: '500px',
            backgroundColor: 'var(--surface-1)', borderRadius: '8px',
            border: '1px solid var(--border-subtle)', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            boxShadow: 'var(--shadow-panel)',
          }}>
            {/* Top Canvas Header */}
            <div style={{
              padding: '8px 14px', zIndex: 10,
              backgroundColor: 'rgba(17, 21, 29, 0.9)', backdropFilter: 'blur(8px)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  ORTHO_GEO_TWIN // CAD_REV_4.9
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', backgroundColor: 'var(--surface-2)', padding: '2px 6px', borderRadius: '4px' }}>
                  GRID: 0.50m RESOLUTION
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--success)' }}>
                  LIDAR: LOCK
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={() => setViewAngle('iso')}
                  style={{
                    padding: '3px 8px', borderRadius: '4px', border: 'none',
                    backgroundColor: viewAngle === 'iso' ? 'var(--accent-dim)' : 'transparent',
                    color: viewAngle === 'iso' ? 'var(--accent)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  ISO 45°
                </button>
                <button
                  onClick={() => setViewAngle('top')}
                  style={{
                    padding: '3px 8px', borderRadius: '4px', border: 'none',
                    backgroundColor: viewAngle === 'top' ? 'var(--accent-dim)' : 'transparent',
                    color: viewAngle === 'top' ? 'var(--accent)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  TOP-DOWN
                </button>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>SCALE 1:120</span>
              </div>
            </div>

            {/* SVG Interactive Geofence Canvas */}
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 920 480" style={{ width: '100%', height: '100%', cursor: 'crosshair' }}>
                {/* Background grid */}
                <g stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" strokeDasharray="3 3">
                  <path d="M 40,60 L 880,60 M 40,140 L 880,140 M 40,220 L 880,220 M 40,300 L 880,300 M 40,380 L 880,380 M 40,460 L 880,460" />
                  <path d="M 120,40 L 120,480 M 260,40 L 260,480 M 400,40 L 400,480 M 540,40 L 540,480 M 680,40 L 680,480 M 820,40 L 820,480" />
                </g>

                {/* Zone 1: CNC Machining (Green) */}
                <g onClick={() => setSelectedZoneKey('ZONE-01')} style={{ cursor: 'pointer' }}>
                  <polygon points="50,50 430,50 410,230 50,230" fill="rgba(52, 211, 153, 0.08)" stroke="var(--success)" strokeWidth={selectedZoneKey === 'ZONE-01' ? 3 : 1.5} />
                  <rect x="65" y="65" width="180" height="40" rx="4" fill="var(--surface-2)" />
                  <text x="75" y="83" fill="var(--success)" fontFamily="var(--font-sans)" fontSize="12" fontWeight="600">ZONE 01 : CNC MACHINING</text>
                  <text x="75" y="97" fill="var(--text-secondary)" fontFamily="var(--font-mono)" fontSize="9">CLASS-1 | EYES+EARS+HARDHAT</text>
                  <circle cx="160" cy="160" r="14" fill="rgba(52, 211, 153, 0.2)" stroke="var(--success)" strokeWidth="1.5" />
                  <text x="185" y="164" fill="var(--text-primary)" fontFamily="var(--font-mono)" fontSize="10">CNC-ROW-A (8 UNITS)</text>
                  <circle cx="310" cy="140" r="12" fill="var(--success)" />
                  <text x="310" y="144" fill="#000" fontFamily="var(--font-mono)" fontSize="9" fontWeight="700" textAnchor="middle">38P</text>
                </g>

                {/* Zone 2: Solvent & ATEX (Amber) */}
                <g onClick={() => setSelectedZoneKey('ZONE-02')} style={{ cursor: 'pointer' }}>
                  <polygon points="460,50 870,50 850,210 445,210" fill="rgba(245, 158, 11, 0.08)" stroke="var(--warning)" strokeWidth={selectedZoneKey === 'ZONE-02' ? 3 : 1.5} strokeDasharray="6 3" />
                  <rect x="475" y="65" width="195" height="40" rx="4" fill="var(--surface-2)" />
                  <text x="485" y="83" fill="var(--warning)" fontFamily="var(--font-sans)" fontSize="12" fontWeight="600">ZONE 02 : SOLVENT & ATEX</text>
                  <text x="485" y="97" fill="var(--text-secondary)" fontFamily="var(--font-mono)" fontSize="9">ATEX ZONE 1 | RESPIRATOR + ESD</text>
                  <circle cx="560" cy="130" r="16" fill="rgba(245, 158, 11, 0.2)" stroke="var(--warning)" />
                  <text x="560" y="134" fill="var(--warning)" fontFamily="var(--font-mono)" fontSize="8" fontWeight="700" textAnchor="middle">TANK A</text>
                  <circle cx="630" cy="130" r="16" fill="rgba(245, 158, 11, 0.2)" stroke="var(--warning)" />
                  <text x="630" y="134" fill="var(--warning)" fontFamily="var(--font-mono)" fontSize="8" fontWeight="700" textAnchor="middle">TANK B</text>
                  <rect x="730" y="120" width="60" height="20" rx="3" fill="var(--surface-2)" stroke="var(--warning)" />
                  <text x="760" y="133" fill="var(--warning)" fontFamily="var(--font-mono)" fontSize="8" fontWeight="700" textAnchor="middle">SNIFFER-3</text>
                </g>

                {/* Zone 3: Robotic Arc Bay (Red) */}
                <g onClick={() => setSelectedZoneKey('ZONE-03')} style={{ cursor: 'pointer' }}>
                  <polygon points="435,240 850,240 830,450 415,450" fill="rgba(244, 63, 94, 0.12)" stroke="var(--danger)" strokeWidth={selectedZoneKey === 'ZONE-03' ? 3 : 2} />
                  <rect x="450" y="255" width="220" height="40" rx="4" fill="var(--surface-2)" />
                  <text x="460" y="273" fill="var(--danger)" fontFamily="var(--font-sans)" fontSize="12" fontWeight="600">ZONE 03 : ROBOTIC ARC BAY</text>
                  <text x="460" y="287" fill="var(--text-secondary)" fontFamily="var(--font-mono)" fontSize="9">HV + THERMAL HAZARD | AUTO-SHIELD</text>
                  <rect x="520" y="340" width="80" height="30" rx="3" fill="rgba(244, 63, 94, 0.2)" stroke="var(--danger)" />
                  <text x="560" y="358" fill="var(--danger)" fontFamily="var(--font-mono)" fontSize="8" fontWeight="700" textAnchor="middle">ROBOT-CELL-01</text>
                  <rect x="660" y="340" width="80" height="30" rx="3" fill="rgba(244, 63, 94, 0.2)" stroke="var(--danger)" />
                  <text x="700" y="358" fill="var(--danger)" fontFamily="var(--font-mono)" fontSize="8" fontWeight="700" textAnchor="middle">ROBOT-CELL-02</text>
                  <rect x="710" y="390" width="110" height="24" rx="3" fill="var(--danger)" />
                  <text x="765" y="405" fill="#fff" fontFamily="var(--font-mono)" fontSize="9" fontWeight="700" textAnchor="middle">! INTERLOCK FAULT</text>
                </g>

                {/* Zone 4: AGV Logistics (Cyan) */}
                <g onClick={() => setSelectedZoneKey('ZONE-04')} style={{ cursor: 'pointer' }}>
                  <polygon points="50,260 395,260 375,450 50,450" fill="rgba(76, 141, 255, 0.08)" stroke="var(--accent)" strokeWidth={selectedZoneKey === 'ZONE-04' ? 3 : 1.5} strokeDasharray="4 4" />
                  <rect x="65" y="275" width="205" height="40" rx="4" fill="var(--surface-2)" />
                  <text x="75" y="293" fill="var(--accent)" fontFamily="var(--font-sans)" fontSize="12" fontWeight="600">ZONE 04 : AGV LOGISTICS</text>
                  <text x="75" y="307" fill="var(--text-secondary)" fontFamily="var(--font-mono)" fontSize="9">BUFFER 2.5m | HIGH-VIS + STEEL TOE</text>
                  <path d="M 80,380 L 350,380" stroke="var(--accent)" strokeDasharray="8 6" strokeWidth="3" />
                  <circle cx="210" cy="380" r="10" fill="var(--accent)" />
                  <text x="210" y="383" fill="#fff" fontFamily="var(--font-mono)" fontSize="8" fontWeight="700" textAnchor="middle">AGV-4</text>
                </g>
              </svg>
            </div>

            {/* Bottom Coordinate Bar */}
            <div style={{
              padding: '8px 14px', zIndex: 10,
              backgroundColor: 'rgba(17, 21, 29, 0.9)', backdropFilter: 'blur(8px)',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)',
            }}>
              <div style={{ display: 'flex', gap: '14px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--success)' }} /> SAFE CORRIDOR</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--warning)' }} /> VAPOR MONITOR</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--danger)' }} /> OPTICAL BREACH</span>
              </div>
              <div>COORDS: X 44.18 Y 12.04 Z 0.00 • UWB ANCHORS: 18/18 ONLINE</div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div style={{ backgroundColor: 'var(--surface-1)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)' }}>GEOFENCE BUFFER</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>2.5 METERS</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: 'var(--text-secondary)' }}>Dynamic beacon suppression</div>
            </div>

            <div style={{ backgroundColor: 'var(--surface-1)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)' }}>HVAC EXHAUST LOAD</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>14,200 CFM</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: 'var(--text-secondary)' }}>Plant sector turnover 14 ACH</div>
            </div>

            <div style={{ backgroundColor: 'var(--surface-1)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)' }}>AUTO INTERLOCKS</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700, color: 'var(--danger)', marginTop: '2px' }}>1 TRIGGERED (Z-03)</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: 'var(--danger)' }}>Optic curtain 02 tripped</div>
            </div>
          </div>
        </div>

        {/* Right: Environmental Telemetry & Policies */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Telemetry Card */}
          <div style={{
            backgroundColor: 'var(--surface-1)', borderRadius: '8px',
            border: '1px solid var(--border-subtle)', padding: '14px',
            display: 'flex', flexDirection: 'column', gap: '12px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                ENVIRONMENTAL TELEMETRY
              </span>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
                color: currentZone.status === 'critical' ? 'var(--danger)' : currentZone.status === 'warning' ? 'var(--warning)' : 'var(--success)',
                backgroundColor: currentZone.status === 'critical' ? 'var(--danger-dim)' : currentZone.status === 'warning' ? 'var(--warning-dim)' : 'var(--success-dim)',
                padding: '2px 8px', borderRadius: '4px',
              }}>
                {currentZone.id}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontFamily: 'var(--font-mono)' }}>
              <div style={{ backgroundColor: 'var(--surface-0)', padding: '8px', borderRadius: '6px' }}>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '9px' }}>VOC GAS LEVEL</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{currentZone.vocPpm}</div>
                <div style={{ fontSize: '9px', color: 'var(--text-tertiary)', marginTop: '2px' }}>LIMIT: 1.50 PPM</div>
              </div>

              <div style={{ backgroundColor: 'var(--surface-0)', padding: '8px', borderRadius: '6px' }}>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '9px' }}>AMBIENT TEMP</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{currentZone.temp}</div>
                <div style={{ fontSize: '9px', color: 'var(--text-tertiary)', marginTop: '2px' }}>TARGET: 21-26°C</div>
              </div>

              <div style={{ backgroundColor: 'var(--surface-0)', padding: '8px', borderRadius: '6px' }}>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '9px' }}>NOISE INDEX</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: currentZone.noiseDba > '85' ? 'var(--warning)' : 'var(--text-primary)' }}>
                  {currentZone.noiseDba}
                </div>
                <div style={{ fontSize: '9px', color: 'var(--text-tertiary)', marginTop: '2px' }}>THRESHOLD: 85 dBA</div>
              </div>

              <div style={{ backgroundColor: 'var(--surface-0)', padding: '8px', borderRadius: '6px' }}>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '9px' }}>LEL CONCENTRATION</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{currentZone.lelPercent}</div>
                <div style={{ fontSize: '9px', color: 'var(--success)', marginTop: '2px' }}>EXPLOSION SAFE</div>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--surface-0)', padding: '8px', borderRadius: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>OCCUPANCY</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{currentZone.occupancy} / {currentZone.maxOccupancy} Workers</span>
              </div>
              <div style={{ height: '4px', backgroundColor: 'var(--surface-2)', borderRadius: '2px', overflow: 'hidden', marginTop: '4px' }}>
                <div style={{ width: `${(currentZone.occupancy / currentZone.maxOccupancy) * 100}%`, height: '100%', backgroundColor: 'var(--accent)' }} />
              </div>
            </div>
          </div>

          {/* Mandatory PPE Policies */}
          <div style={{
            backgroundColor: 'var(--surface-1)', borderRadius: '8px',
            border: '1px solid var(--border-subtle)', padding: '14px',
            display: 'flex', flexDirection: 'column', gap: '10px',
          }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
              ZONE ENFORCEMENT POLICIES
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', backgroundColor: 'var(--surface-0)', borderRadius: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Hardhat Required</span>
                <span style={{ color: currentZone.policies.hardhat ? 'var(--success)' : 'var(--text-tertiary)', fontWeight: 700 }}>
                  {currentZone.policies.hardhat ? 'MANDATORY' : 'OPTIONAL'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', backgroundColor: 'var(--surface-0)', borderRadius: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Hi-Vis Safety Vest</span>
                <span style={{ color: currentZone.policies.vest ? 'var(--success)' : 'var(--text-tertiary)', fontWeight: 700 }}>
                  {currentZone.policies.vest ? 'MANDATORY' : 'OPTIONAL'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', backgroundColor: 'var(--surface-0)', borderRadius: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Safety Eyewear</span>
                <span style={{ color: currentZone.policies.eyewear ? 'var(--success)' : 'var(--text-tertiary)', fontWeight: 700 }}>
                  {currentZone.policies.eyewear ? 'MANDATORY' : 'OPTIONAL'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', backgroundColor: 'var(--surface-0)', borderRadius: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>ATEX Respirator</span>
                <span style={{ color: currentZone.policies.respirator ? 'var(--warning)' : 'var(--text-tertiary)', fontWeight: 700 }}>
                  {currentZone.policies.respirator ? 'REQUIRED' : 'NOT REQUIRED'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', backgroundColor: 'var(--surface-0)', borderRadius: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Hearing Protection</span>
                <span style={{ color: currentZone.policies.hearing ? 'var(--warning)' : 'var(--text-tertiary)', fontWeight: 700 }}>
                  {currentZone.policies.hearing ? 'MANDATORY' : 'OPTIONAL'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', backgroundColor: 'var(--surface-0)', borderRadius: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Arc Flash Shield</span>
                <span style={{ color: currentZone.policies.arcShield ? 'var(--danger)' : 'var(--text-tertiary)', fontWeight: 700 }}>
                  {currentZone.policies.arcShield ? 'MANDATORY' : 'NOT REQUIRED'}
                </span>
              </div>
            </div>

            <button
              onClick={() => showToast(`Zone policies committed to Edge Inference for ${currentZone.name}`)}
              style={{
                marginTop: '4px', padding: '8px',
                backgroundColor: 'var(--accent)', color: '#000',
                border: 'none', borderRadius: '6px',
                fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              UPDATE ZONE POLICIES
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
