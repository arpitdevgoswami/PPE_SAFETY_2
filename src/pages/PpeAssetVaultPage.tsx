import React, { useState } from 'react';
import {
  HardHat,
  Shield,
  Radio,
  Wind,
  BatteryCharging,
  Zap,
  Activity,
} from 'lucide-react';

interface PpeAsset {
  id: string;
  type: string;
  assignedWorker: string;
  battery: number;
  firmware: string;
  meshSignal: string;
  status: 'nominal' | 'warning' | 'critical';
  calibrationDue: string;
}

const ASSETS_LIST: PpeAsset[] = [
  { id: 'SH-4091', type: 'Smart Helmet Gen-4', assignedWorker: 'Marcus Vance (#3651)', battery: 84, firmware: 'v4.1.8-PROD', meshSignal: '-52 dBm', status: 'critical', calibrationDue: '2025-04-12' },
  { id: 'SH-4092', type: 'Smart Helmet Gen-4', assignedWorker: 'Sarah Jenkins (#1092)', battery: 96, firmware: 'v4.1.8-PROD', meshSignal: '-44 dBm', status: 'nominal', calibrationDue: '2025-05-18' },
  { id: 'CV-1044', type: 'Connected Vest Rev-2', assignedWorker: 'Elena Rostova (#8947)', battery: 68, firmware: 'v2.8.0-RT', meshSignal: '-58 dBm', status: 'warning', calibrationDue: '2025-02-28' },
  { id: 'SR-3012', type: 'Smart Respirator ATEX', assignedWorker: 'Elena Rostova (#8947)', battery: 12, firmware: 'v1.4.2', meshSignal: '-62 dBm', status: 'critical', calibrationDue: '2025-01-10' },
  { id: 'FA-0821', type: 'Fall-Arrest Harness H1', assignedWorker: 'Mateo Morales (#2234)', battery: 92, firmware: 'v3.0.1', meshSignal: '-49 dBm', status: 'nominal', calibrationDue: '2025-06-30' },
  { id: 'GS-7740', type: 'Gas Sniffer NDIR 4-Gas', assignedWorker: 'David Chen (#4102)', battery: 78, firmware: 'v2.1.0', meshSignal: '-47 dBm', status: 'nominal', calibrationDue: '2025-04-20' },
];

export const PpeAssetVaultPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'helmets' | 'vests' | 'respirators' | 'harnesses' | 'sniffers'>('helmets');
  const [viewMode, setViewMode] = useState<'exploded' | 'xray' | 'thermal'>('exploded');
  const [selectedAssetId, setSelectedAssetId] = useState<string>('SH-4091');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

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

      {/* Top Utility Bar: Category Telemetry Tabs */}
      <div style={{
        padding: '12px 20px',
        backgroundColor: 'var(--surface-1)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto' }}>
          <button
            onClick={() => setSelectedCategory('helmets')}
            style={{
              padding: '6px 14px', borderRadius: '6px', border: 'none',
              backgroundColor: selectedCategory === 'helmets' ? 'var(--accent-dim)' : 'var(--surface-2)',
              color: selectedCategory === 'helmets' ? 'var(--accent)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
            }}
          >
            <HardHat size={15} />
            <span>Smart Helmets</span>
            <span style={{ padding: '1px 6px', borderRadius: '10px', backgroundColor: 'var(--surface-0)', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>164</span>
          </button>

          <button
            onClick={() => setSelectedCategory('vests')}
            style={{
              padding: '6px 14px', borderRadius: '6px', border: 'none',
              backgroundColor: selectedCategory === 'vests' ? 'var(--accent-dim)' : 'var(--surface-2)',
              color: selectedCategory === 'vests' ? 'var(--accent)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
            }}
          >
            <Shield size={15} />
            <span>Connected Vests</span>
            <span style={{ padding: '1px 6px', borderRadius: '10px', backgroundColor: 'var(--surface-0)', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>150</span>
          </button>

          <button
            onClick={() => setSelectedCategory('respirators')}
            style={{
              padding: '6px 14px', borderRadius: '6px', border: 'none',
              backgroundColor: selectedCategory === 'respirators' ? 'var(--accent-dim)' : 'var(--surface-2)',
              color: selectedCategory === 'respirators' ? 'var(--accent)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
            }}
          >
            <Wind size={15} />
            <span>Smart Respirators</span>
            <span style={{ padding: '1px 6px', borderRadius: '10px', backgroundColor: 'var(--danger-dim)', color: 'var(--danger)', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>45</span>
          </button>

          <button
            onClick={() => setSelectedCategory('harnesses')}
            style={{
              padding: '6px 14px', borderRadius: '6px', border: 'none',
              backgroundColor: selectedCategory === 'harnesses' ? 'var(--accent-dim)' : 'var(--surface-2)',
              color: selectedCategory === 'harnesses' ? 'var(--accent)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
            }}
          >
            <Activity size={15} />
            <span>Fall-Arrest Harnesses</span>
            <span style={{ padding: '1px 6px', borderRadius: '10px', backgroundColor: 'var(--surface-0)', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>30</span>
          </button>

          <button
            onClick={() => setSelectedCategory('sniffers')}
            style={{
              padding: '6px 14px', borderRadius: '6px', border: 'none',
              backgroundColor: selectedCategory === 'sniffers' ? 'var(--accent-dim)' : 'var(--surface-2)',
              color: selectedCategory === 'sniffers' ? 'var(--accent)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
            }}
          >
            <Radio size={15} />
            <span>Gas Sniffers</span>
            <span style={{ padding: '1px 6px', borderRadius: '10px', backgroundColor: 'var(--surface-0)', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>62</span>
          </button>
        </div>

        {/* Selected Unit Diagnostics */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '4px 10px', backgroundColor: 'var(--surface-0)', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: 'var(--text-tertiary)' }}>SELECTED UNIT:</span>
            <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{selectedAssetId} // REV.4B</span>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--danger)' }} className="animate-pulse" />
          </div>
          <div style={{ padding: '4px 10px', backgroundColor: 'var(--surface-0)', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: 'var(--text-tertiary)' }}>MESH:</span>
            <span style={{ color: 'var(--success)', fontWeight: 600 }}>99.8% ONLINE</span>
          </div>
        </div>
      </div>

      {/* Primary Split View: Schematic Blueprint (65%) + Maintenance Radar (35%) */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px',
        padding: '16px', gap: '16px', flex: 1,
      }}>
        {/* Central Technical Blueprint Canvas */}
        <div style={{
          backgroundColor: 'var(--surface-1)', borderRadius: '8px',
          border: '1px solid var(--border-subtle)', padding: '16px',
          display: 'flex', flexDirection: 'column', gap: '12px',
          boxShadow: 'var(--shadow-panel)',
        }}>
          {/* Top Canvas HUD Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <HardHat size={18} style={{ color: 'var(--accent)' }} />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                SMARTPPE GEN-4 CONNECTED HELMET
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', backgroundColor: 'var(--accent-dim)', padding: '2px 8px', borderRadius: '4px' }}>
                MIL-STD 810H CERTIFIED
              </span>
            </div>

            <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--surface-0)', padding: '2px', borderRadius: '6px' }}>
              <button
                onClick={() => setViewMode('exploded')}
                style={{
                  padding: '4px 10px', borderRadius: '4px', border: 'none',
                  backgroundColor: viewMode === 'exploded' ? 'var(--surface-3)' : 'transparent',
                  color: viewMode === 'exploded' ? 'var(--accent)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, cursor: 'pointer',
                }}
              >
                EXPLODED ISO
              </button>
              <button
                onClick={() => setViewMode('xray')}
                style={{
                  padding: '4px 10px', borderRadius: '4px', border: 'none',
                  backgroundColor: viewMode === 'xray' ? 'var(--surface-3)' : 'transparent',
                  color: viewMode === 'xray' ? 'var(--accent)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, cursor: 'pointer',
                }}
              >
                X-RAY BUS
              </button>
              <button
                onClick={() => setViewMode('thermal')}
                style={{
                  padding: '4px 10px', borderRadius: '4px', border: 'none',
                  backgroundColor: viewMode === 'thermal' ? 'var(--surface-3)' : 'transparent',
                  color: viewMode === 'thermal' ? 'var(--accent)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, cursor: 'pointer',
                }}
              >
                THERMAL
              </button>
            </div>
          </div>

          {/* Main Visual Schematic Area */}
          <div style={{
            position: 'relative', width: '100%', height: '440px',
            backgroundColor: 'var(--surface-0)', borderRadius: '6px',
            border: '1px solid var(--border-subtle)', overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* Battery Gauge Floating Top */}
            <div style={{
              position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', zIndex: 10,
              backgroundColor: 'rgba(17, 21, 29, 0.9)', backdropFilter: 'blur(6px)',
              padding: '4px 12px', borderRadius: '20px', border: '1px solid var(--border-subtle)',
              display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '11px',
            }}>
              <BatteryCharging size={14} style={{ color: 'var(--success)' }} />
              <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>84% CHARGE</span>
              <span style={{ color: 'var(--text-tertiary)' }}>•</span>
              <span style={{ color: 'var(--text-secondary)' }}>18h 42m EST. TIME REMAINING</span>
            </div>

            {/* SVG Schematic Helmet */}
            <svg viewBox="0 0 760 480" style={{ width: '100%', height: '100%', zIndex: 5 }}>
              {/* Axes & crosshairs */}
              <line x1="40" y1="240" x2="720" y2="240" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
              <line x1="380" y1="30" x2="380" y2="450" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
              <circle cx="380" cy="240" r="140" fill="none" stroke="rgba(76,141,255,0.1)" strokeDasharray="4 4" />

              {/* Inner Suspension Cradle */}
              <path d="M260 260 C260 190, 500 190, 500 260 C500 300, 460 320, 380 325 C300 320, 260 300, 260 260 Z" fill="none" stroke="var(--text-tertiary)" strokeDasharray="4 2" strokeWidth="1.5" />

              {/* Outer Shell */}
              <path d="M240 210 C240 120, 330 70, 380 70 C430 70, 520 120, 520 210 C520 230, 505 245, 490 248 C440 258, 320 258, 270 248 C255 245, 240 230, 240 210 Z" fill={viewMode === 'thermal' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(76, 141, 255, 0.12)'} stroke="var(--accent)" strokeWidth="2" />

              {/* Brow Contour */}
              <path d="M275 200 Q380 150 485 200" fill="none" stroke="var(--accent)" strokeWidth="1.5" />

              {/* High-Impact Visor */}
              <path d="M285 245 C320 265, 440 265, 475 245 C485 285, 450 315, 380 318 C310 315, 275 285, 285 245 Z" fill="rgba(52, 211, 153, 0.1)" stroke="var(--success)" strokeWidth="1.5" />

              {/* Nodes */}
              {/* Accel node apex */}
              <circle cx="380" cy="95" r="7" fill="var(--surface-0)" stroke="var(--accent)" strokeWidth="1.5" />
              <circle cx="380" cy="95" r="3" fill="var(--accent)" />
              <polyline points="380,95 380,50 500,50" fill="none" stroke="var(--accent)" strokeWidth="1" />

              {/* HUD Node */}
              <circle cx="340" cy="250" r="7" fill="var(--surface-0)" stroke="var(--success)" strokeWidth="1.5" />
              <circle cx="340" cy="250" r="3" fill="var(--success)" />
              <polyline points="340,250 230,250 190,270" fill="none" stroke="var(--success)" strokeWidth="1" />

              {/* Gas Sniffer */}
              <circle cx="495" cy="210" r="7" fill="var(--surface-0)" stroke="var(--warning)" strokeWidth="1.5" />
              <circle cx="495" cy="210" r="3" fill="var(--warning)" />
              <polyline points="495,210 560,210 600,180" fill="none" stroke="var(--warning)" strokeWidth="1" />

              {/* Chin strap sensor */}
              <circle cx="380" cy="360" r="7" fill="var(--surface-0)" stroke="var(--success)" strokeWidth="1.5" />
              <circle cx="380" cy="360" r="3" fill="var(--success)" />
              <polyline points="380,360 380,410 490,410" fill="none" stroke="var(--success)" strokeWidth="1" />
              <path d="M305 265 L365 360 L395 360 L455 265" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5" />
            </svg>

            {/* Floating HUD Badge: 3-Axis G-Force */}
            <div style={{
              position: 'absolute', top: '24px', right: '20px', zIndex: 10,
              backgroundColor: 'rgba(17, 21, 29, 0.85)', backdropFilter: 'blur(6px)',
              padding: '8px 12px', borderRadius: '6px', borderLeft: '3px solid var(--accent)',
              fontFamily: 'var(--font-mono)', fontSize: '11px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-tertiary)', fontSize: '9px' }}>
                <span>NODE // ACCEL-01</span>
                <span style={{ color: 'var(--success)' }}>ACTIVE</span>
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                3-AXIS G-FORCE
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '10px', marginTop: '2px' }}>
                Peak 24h: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>1.18 G [NOMINAL]</span>
              </div>
            </div>

            {/* Floating HUD Badge: Chin Strap */}
            <div style={{
              position: 'absolute', bottom: '24px', right: '40px', zIndex: 10,
              backgroundColor: 'rgba(17, 21, 29, 0.85)', backdropFilter: 'blur(6px)',
              padding: '8px 12px', borderRadius: '6px', borderLeft: '3px solid var(--success)',
              fontFamily: 'var(--font-mono)', fontSize: '11px', minWidth: '180px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-tertiary)', fontSize: '9px' }}>
                <span>BIO-INTERLOCK</span>
                <span style={{ color: 'var(--success)' }}>LOCKED</span>
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                CHIN-STRAP TENSION
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <div style={{ flex: 1, height: '4px', backgroundColor: 'var(--surface-2)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: '76%', height: '100%', backgroundColor: 'var(--success)' }} />
                </div>
                <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '10px' }}>18.4 N</span>
              </div>
            </div>

            {/* Floating HUD Badge: HUD Optics */}
            <div style={{
              position: 'absolute', bottom: '24px', left: '20px', zIndex: 10,
              backgroundColor: 'rgba(17, 21, 29, 0.85)', backdropFilter: 'blur(6px)',
              padding: '8px 12px', borderRadius: '6px', borderLeft: '3px solid var(--success)',
              fontFamily: 'var(--font-mono)', fontSize: '11px',
            }}>
              <div style={{ color: 'var(--text-tertiary)', fontSize: '9px' }}>OPTICS // HUD-RETICLE</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>MICRO-OLED DISPLAY</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '10px', marginTop: '2px' }}>Luminance: 1200 Nits • Evac Route B-03</div>
            </div>
          </div>

          {/* Canvas Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-tertiary)' }}>
            <div style={{ display: 'flex', gap: '14px' }}>
              <span>UWB Anchor: <strong style={{ color: 'var(--text-primary)' }}>Active (12 APs)</strong></span>
              <span>Firmware: <strong style={{ color: 'var(--text-primary)' }}>v4.1.8-PROD</strong></span>
              <span>Interlock: <strong style={{ color: 'var(--success)' }}>COMPLIANT</strong></span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => showToast('Schematic orientation reset')} style={{ padding: '3px 8px', backgroundColor: 'var(--surface-2)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                RESET ORIENTATION
              </button>
              <button onClick={() => showToast('Full diagnostic trace completed')} style={{ padding: '3px 8px', backgroundColor: 'var(--surface-2)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                DIAGNOSTIC TRACE
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Power State Radar & Actions */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Power State Radar */}
          <div style={{
            backgroundColor: 'var(--surface-1)', borderRadius: '8px',
            border: '1px solid var(--border-subtle)', padding: '14px',
            display: 'flex', flexDirection: 'column', gap: '10px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                POWER STATE RADAR
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)' }}>
                451 UNITS TRACKED
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '6px 0' }}>
              {/* Donut Simulation */}
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'conic-gradient(var(--success) 0deg 320deg, var(--accent) 320deg 348deg, var(--danger) 348deg 360deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--surface-1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>89%</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--text-tertiary)' }}>READY</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--success)' }}>Full (&gt; 70%)</span>
                  <span>401 units (89%)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--accent)' }}>Nominal (25-70%)</span>
                  <span>36 units (8%)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--danger)' }}>Dock Alert (&lt; 25%)</span>
                  <span style={{ color: 'var(--danger)', fontWeight: 700 }}>14 units (3%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Unit Actions */}
          <div style={{
            backgroundColor: 'var(--surface-1)', borderRadius: '8px',
            border: '1px solid var(--border-subtle)', padding: '14px',
            display: 'flex', flexDirection: 'column', gap: '8px',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>
              ASSET ACTIONS ({selectedAssetId})
            </span>
            <button
              onClick={() => showToast(`Audible acoustic beacon pinged on ${selectedAssetId}`)}
              style={{
                padding: '8px', backgroundColor: 'var(--accent-dim)', border: '1px solid var(--accent-border)',
                color: 'var(--accent)', borderRadius: '6px', fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              PING AUDIBLE LOCATOR
            </button>
            <button
              onClick={() => showToast(`Remote lock command sent to ${selectedAssetId}`)}
              style={{
                padding: '8px', backgroundColor: 'var(--danger-dim)', border: '1px solid var(--danger-border)',
                color: 'var(--danger)', borderRadius: '6px', fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              LOCKOUT ASSET
            </button>
            <button
              onClick={() => showToast(`Calibration work order queued for ${selectedAssetId}`)}
              style={{
                padding: '8px', backgroundColor: 'var(--surface-2)', border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)', borderRadius: '6px', fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              REQUEST RE-CALIBRATION
            </button>
          </div>
        </aside>
      </div>

      {/* Bottom Asset Vault Table */}
      <section style={{
        padding: '16px 20px', backgroundColor: 'var(--surface-1)',
        borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '10px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
            ASSET INVENTORY & TELEMETRY REGISTRY
          </h3>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-tertiary)' }}>
            SHOWING {ASSETS_LIST.length} MONITORED UNITS
          </span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)', textAlign: 'left' }}>
              <th style={{ padding: '6px 8px' }}>ASSET SERIAL</th>
              <th style={{ padding: '6px 8px' }}>HARDWARE TYPE</th>
              <th style={{ padding: '6px 8px' }}>ASSIGNED WORKER</th>
              <th style={{ padding: '6px 8px' }}>BATTERY</th>
              <th style={{ padding: '6px 8px' }}>MESH SIGNAL</th>
              <th style={{ padding: '6px 8px' }}>FIRMWARE</th>
              <th style={{ padding: '6px 8px' }}>STATUS</th>
              <th style={{ padding: '6px 8px' }}>CALIBRATION DUE</th>
            </tr>
          </thead>
          <tbody>
            {ASSETS_LIST.map((item) => {
              const isSelected = selectedAssetId === item.id;
              const statusColor = item.status === 'critical' ? 'var(--danger)' : item.status === 'warning' ? 'var(--warning)' : 'var(--success)';
              return (
                <tr
                  key={item.id}
                  onClick={() => setSelectedAssetId(item.id)}
                  style={{
                    backgroundColor: isSelected ? 'var(--surface-3)' : 'transparent',
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                  }}
                >
                  <td style={{ padding: '8px', color: 'var(--accent)', fontWeight: 700 }}>{item.id}</td>
                  <td style={{ padding: '8px', color: 'var(--text-primary)' }}>{item.type}</td>
                  <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>{item.assignedWorker}</td>
                  <td style={{ padding: '8px' }}>
                    <span style={{ color: item.battery < 20 ? 'var(--danger)' : 'var(--text-primary)' }}>{item.battery}%</span>
                  </td>
                  <td style={{ padding: '8px', color: 'var(--text-tertiary)' }}>{item.meshSignal}</td>
                  <td style={{ padding: '8px', color: 'var(--text-tertiary)' }}>{item.firmware}</td>
                  <td style={{ padding: '8px' }}>
                    <span style={{ color: statusColor, fontWeight: 700, textTransform: 'uppercase' }}>{item.status}</span>
                  </td>
                  <td style={{ padding: '8px', color: 'var(--text-tertiary)' }}>{item.calibrationDue}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
};
