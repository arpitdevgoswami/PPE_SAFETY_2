import React, { useState } from 'react';
import {
  LayoutGrid,
  Grid3X3,
  Maximize2,
  Video,
  Activity,
  Cpu,
  RefreshCw,
  AlertTriangle,
  ShieldCheck,
  Radio,
  Eye,
  Crosshair,
  Volume2,
  Bookmark,
  Smartphone,
  Zap,
} from 'lucide-react';
import { LiveCameraPanel } from '../components/LiveCameraPanel';

interface LiveMonitoringPageProps {
  onSelectIncident?: () => void;
}

export const LiveMonitoringPage: React.FC<LiveMonitoringPageProps> = () => {
  const [layoutMode, setLayoutMode] = useState<'2x2' | '3x3' | 'focus'>('2x2');
  const [selectedCam, setSelectedCam] = useState<string>('CAM-01');
  const [isBeaconActive, setIsBeaconActive] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const cameraNodes = [
    { id: 'CAM-01', name: 'Fabrication Bay 4-S', status: 'critical', latency: '14.2ms', fps: '59.9', mode: 'Optical 4K', alert: 'PPE BREACH // NO HELMET' },
    { id: 'CAM-02', name: 'Tank Farm Alpha', status: 'nominal', latency: '11.8ms', fps: '30.0', mode: 'FLIR Thermal', alert: null },
    { id: 'CAM-03', name: 'Logistics Dock 03', status: 'warning', latency: '12.4ms', fps: '30.0', mode: 'Top-Down AGV', alert: 'PROXIMITY WARNING' },
    { id: 'CAM-04', name: 'Robotic Weld Cell 02', status: 'critical', latency: '13.1ms', fps: '60.0', mode: 'Arc Shielded', alert: 'INTERLOCK TRIPPED' },
    { id: 'CAM-05', name: 'East Ingress Portal', status: 'nominal', latency: '10.5ms', fps: '30.0', mode: 'Face + PPE', alert: null },
    { id: 'CAM-06', name: 'Chemical Storage B', status: 'nominal', latency: '11.2ms', fps: '30.0', mode: 'Thermal IR', alert: null },
    { id: 'CAM-07', name: 'Assembly Line 01', status: 'nominal', latency: '12.0ms', fps: '59.9', mode: 'Optical 4K', alert: null },
    { id: 'CAM-08', name: 'CNC Milling Array', status: 'nominal', latency: '11.9ms', fps: '30.0', mode: 'Acoustic + Cam', alert: null },
    { id: 'CAM-09', name: 'Paint & Solvent Booth', status: 'warning', latency: '13.5ms', fps: '30.0', mode: 'ATEX Zone 1', alert: 'VOC ELEVATED' },
    { id: 'CAM-10', name: 'West Pedestrian Gate', status: 'nominal', latency: '10.1ms', fps: '30.0', mode: 'Turnstile Cam', alert: null },
    { id: 'CAM-11', name: 'High-Bay Stacker 03', status: 'nominal', latency: '12.8ms', fps: '30.0', mode: 'LIDAR + Cam', alert: null },
    { id: 'CAM-12', name: 'Substation Transformer', status: 'nominal', latency: '14.0ms', fps: '30.0', mode: 'Thermal IR', alert: null },
    { id: 'CAM-13', name: 'Foundry Tapping Pit', status: 'nominal', latency: '12.2ms', fps: '60.0', mode: 'Extreme Heat', alert: null },
    { id: 'CAM-14', name: 'AGV Charging Terminal', status: 'nominal', latency: '11.5ms', fps: '30.0', mode: 'Optical', alert: null },
    { id: 'CAM-15', name: 'Hazmat Drainage Pit', status: 'nominal', latency: '13.9ms', fps: '30.0', mode: 'Multi-Sensor', alert: null },
    { id: 'CAM-16', name: 'Roof Exhaust Array', status: 'nominal', latency: '15.1ms', fps: '30.0', mode: 'Anemometer Cam', alert: null },
  ];

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

      {/* Viewport Control Bar */}
      <div style={{
        padding: '10px 20px',
        backgroundColor: 'var(--surface-1)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {/* Layout Mode Selector */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--surface-0)',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)',
            padding: '2px',
          }}>
            <button
              onClick={() => setLayoutMode('2x2')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '4px 10px', borderRadius: '4px', border: 'none',
                backgroundColor: layoutMode === '2x2' ? 'var(--surface-3)' : 'transparent',
                color: layoutMode === '2x2' ? 'var(--accent)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              <LayoutGrid size={13} />
              <span>GRID 2x2</span>
            </button>
            <button
              onClick={() => setLayoutMode('3x3')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '4px 10px', borderRadius: '4px', border: 'none',
                backgroundColor: layoutMode === '3x3' ? 'var(--surface-3)' : 'transparent',
                color: layoutMode === '3x3' ? 'var(--accent)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              <Grid3X3 size={13} />
              <span>3x3</span>
            </button>
            <button
              onClick={() => setLayoutMode('focus')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '4px 10px', borderRadius: '4px', border: 'none',
                backgroundColor: layoutMode === 'focus' ? 'var(--surface-3)' : 'transparent',
                color: layoutMode === 'focus' ? 'var(--accent)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              <Maximize2 size={13} />
              <span>FOCUS 1+4</span>
            </button>
          </div>

          <div style={{ height: '16px', width: '1px', backgroundColor: 'var(--border-subtle)' }} />

          {/* Telemetry Status Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '3px 8px', borderRadius: '4px', backgroundColor: 'var(--surface-0)',
              border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '11px',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--success)' }} />
              <span style={{ color: 'var(--text-tertiary)' }}>NODES:</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>16/16 ONLINE</span>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '3px 8px', borderRadius: '4px', backgroundColor: 'var(--surface-0)',
              border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '11px',
            }}>
              <Activity size={12} style={{ color: 'var(--accent)' }} />
              <span style={{ color: 'var(--text-tertiary)' }}>THROUGHPUT:</span>
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>142.4 MBPS</span>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '3px 8px', borderRadius: '4px', backgroundColor: 'var(--surface-0)',
              border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '11px',
            }}>
              <Cpu size={12} style={{ color: 'var(--success)' }} />
              <span style={{ color: 'var(--text-tertiary)' }}>YOLOv9-PPE:</span>
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>42.1 FPS // GPU-01</span>
            </div>

            <div style={{
              padding: '2px 8px', borderRadius: '4px',
              backgroundColor: 'var(--warning-dim)', border: '1px solid var(--warning-border)',
              color: 'var(--warning)', fontFamily: 'var(--font-mono)', fontSize: '10px',
              fontWeight: 600, letterSpacing: '0.04em',
            }}>
              LIVE OPTICAL STREAM
            </div>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '4px 10px', borderRadius: '4px', backgroundColor: 'var(--surface-0)',
            border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)', fontSize: '11px',
          }}>
            <Video size={13} />
            <span>BUFFERED 120s</span>
          </div>
          <button
            onClick={() => showToast('Pipeline synced with edge inference engines')}
            style={{
              padding: '5px 12px', borderRadius: '4px', border: '1px solid var(--accent-border)',
              backgroundColor: 'var(--accent-dim)', color: 'var(--accent)',
              fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            <RefreshCw size={12} />
            <span>REFRESH PIPELINE</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Cameras & Diagnostic Panel */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 340px',
        flex: 1,
        gap: 0,
      }}>
        {/* Cameras Viewport */}
        <div style={{ overflowY: 'auto' }}>
          {/* Live AI Camera Feeds (real backend) */}
          <LiveCameraPanel />

          {/* Factory Camera Network (demo tiles) */}
          <div style={{
          padding: '16px',
          display: 'grid',
          gridTemplateColumns: layoutMode === '3x3' ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
          gap: '14px',
          alignContent: 'start',
        }}>
          {/* CAM-01: Fabrication Bay 4-S */}
          <div
            onClick={() => setSelectedCam('CAM-01')}
            style={{
              backgroundColor: 'var(--surface-1)',
              borderRadius: '8px',
              border: selectedCam === 'CAM-01' ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-panel)',
              cursor: 'pointer',
            }}
          >
            <div style={{
              padding: '6px 12px',
              backgroundColor: 'var(--surface-2)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              fontFamily: 'var(--font-mono)', fontSize: '11px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--danger)' }} className="animate-pulse" />
                <span style={{ color: 'var(--accent)', fontWeight: 700 }}>CAM-01</span>
                <span style={{ color: 'var(--text-tertiary)' }}>// FABRICATION BAY 4-S</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: 'var(--danger)', fontWeight: 600 }}>CRITICAL INCIDENT</span>
                <span style={{ color: 'var(--text-tertiary)' }}>4K UHD • 59.9 FPS</span>
              </div>
            </div>

            {/* Video Canvas Simulation */}
            <div style={{
              position: 'relative', width: '100%', aspectRatio: '16/9',
              backgroundColor: '#0a0e14', overflow: 'hidden',
            }}>
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"
                alt="Fabrication Bay"
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7) contrast(1.15)' }}
              />

              {/* Bounding Box 1: Compliant */}
              <div style={{
                position: 'absolute', top: '22%', left: '16%', width: '22%', height: '60%',
                border: '2px solid var(--success)', backgroundColor: 'rgba(52, 211, 153, 0.08)',
                pointerEvents: 'none',
              }}>
                <div style={{
                  position: 'absolute', top: '-20px', left: 0,
                  backgroundColor: 'var(--success)', color: '#000',
                  padding: '1px 5px', fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}>
                  WRK #1092 • PPE NOMINAL [99.2%]
                </div>
                <div style={{
                  position: 'absolute', top: '4px', left: '4px',
                  backgroundColor: 'rgba(0,0,0,0.7)', padding: '2px 4px',
                  fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--success)',
                  lineHeight: 1.3,
                }}>
                  <div>HELMET: PASS</div>
                  <div>HI-VIS: PASS</div>
                  <div>HARNESS: ATTACHED</div>
                </div>
              </div>

              {/* Bounding Box 2: Violation */}
              <div style={{
                position: 'absolute', top: '18%', right: '22%', width: '24%', height: '64%',
                border: '2px solid var(--danger)', backgroundColor: 'rgba(244, 63, 94, 0.15)',
                pointerEvents: 'none',
              }} className="animate-pulse">
                <div style={{
                  position: 'absolute', top: '-22px', right: 0,
                  backgroundColor: 'var(--danger)', color: '#fff',
                  padding: '2px 6px', fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap',
                }}>
                  <AlertTriangle size={10} />
                  WRK #3651: NO HELMET (98.4%)
                </div>
                <div style={{
                  position: 'absolute', top: '4px', right: '4px',
                  backgroundColor: 'rgba(0,0,0,0.8)', padding: '2px 4px',
                  fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--danger)',
                  lineHeight: 1.3, textAlign: 'right',
                }}>
                  <div style={{ fontWeight: 700 }}>VIOLATION [00:14s]</div>
                  <div>VEST: DETECTED</div>
                  <div>ARC FLASH HAZARD</div>
                </div>
              </div>

              {/* Reticle Overlay */}
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                padding: '8px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(76,141,255,0.8)' }}>
                  <span style={{ backgroundColor: 'rgba(0,0,0,0.6)', padding: '1px 4px' }}>+43° 21' 09.2" N</span>
                  <span style={{ backgroundColor: 'rgba(0,0,0,0.6)', padding: '1px 4px' }}>FOV: 94.2° | FL: 24mm</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '9px' }}>
                  <span style={{ backgroundColor: 'rgba(0,0,0,0.6)', padding: '1px 4px', color: 'var(--success)' }}>H.265 / CBR 18.2 Mb/s</span>
                  <span style={{ backgroundColor: 'rgba(244,63,94,0.3)', padding: '1px 4px', color: 'var(--danger)', fontWeight: 700 }}>AUTODETECT ALARM ACTIVE</span>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div style={{
              padding: '6px 10px', backgroundColor: 'var(--surface-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              fontFamily: 'var(--font-mono)', fontSize: '10px',
            }}>
              <span style={{ color: 'var(--text-tertiary)' }}>ZOOM: 1.0X • PTZ LOCKED</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={(e) => { e.stopPropagation(); showToast('Snapshot archived to compliance vault'); }}
                  style={{ padding: '2px 6px', backgroundColor: 'var(--surface-3)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '3px', cursor: 'pointer' }}
                >
                  SNAPSHOT
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); showToast('Feed isolated for forensic review'); }}
                  style={{ padding: '2px 6px', backgroundColor: 'var(--danger-dim)', border: '1px solid var(--danger-border)', color: 'var(--danger)', borderRadius: '3px', fontWeight: 600, cursor: 'pointer' }}
                >
                  ISOLATE FEED
                </button>
              </div>
            </div>
          </div>

          {/* CAM-02: Tank Farm Alpha */}
          <div
            onClick={() => setSelectedCam('CAM-02')}
            style={{
              backgroundColor: 'var(--surface-1)',
              borderRadius: '8px',
              border: selectedCam === 'CAM-02' ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-panel)',
              cursor: 'pointer',
            }}
          >
            <div style={{
              padding: '6px 12px',
              backgroundColor: 'var(--surface-2)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              fontFamily: 'var(--font-mono)', fontSize: '11px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }} />
                <span style={{ color: 'var(--accent)', fontWeight: 700 }}>CAM-02</span>
                <span style={{ color: 'var(--text-tertiary)' }}>// TANK FARM ALPHA [IR/LWIR]</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: 'var(--success)', fontWeight: 600 }}>THERMAL NOMINAL</span>
                <span style={{ color: 'var(--text-tertiary)' }}>FLIR SC-600</span>
              </div>
            </div>

            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#05070d', overflow: 'hidden' }}>
              <img
                src="https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80"
                alt="Tank Farm Thermal"
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'hue-rotate(240deg) saturate(2.5) contrast(1.4)' }}
              />

              <div style={{
                position: 'absolute', bottom: '15%', left: '30%', width: '22%', height: '58%',
                border: '1px solid var(--success)', backgroundColor: 'rgba(52,211,153,0.1)',
                pointerEvents: 'none',
              }}>
                <div style={{
                  position: 'absolute', top: '-18px', left: 0,
                  backgroundColor: 'var(--success)', color: '#000',
                  padding: '1px 5px', fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}>
                  WRK #4102 • RESPIRATOR VERIFIED
                </div>
                <div style={{ position: 'absolute', bottom: '4px', left: '4px', fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--success)', backgroundColor: 'rgba(0,0,0,0.7)', padding: '2px' }}>
                  <div>SKIN TEMP: 36.8°C</div>
                  <div>O2 LEVEL: NORMAL</div>
                </div>
              </div>

              {/* Thermal legend */}
              <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--warning)' }}>90°C</span>
                <div style={{ width: '8px', height: '60px', background: 'linear-gradient(to bottom, #f59e0b, #ef4444, #7c3aed, #2563eb)', borderRadius: '2px' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--accent)' }}>14°C</span>
              </div>

              <div style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: 'rgba(0,0,0,0.7)', padding: '3px 6px', fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent)' }}>
                <div>MAX: 78.4°C [EXHAUST FLANGE]</div>
                <div>GAS PLUME: 0.00 PPM LEL</div>
              </div>
            </div>

            <div style={{ padding: '6px 10px', backgroundColor: 'var(--surface-2)', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
              <span style={{ color: 'var(--text-tertiary)' }}>DIFF TEMP DELTA: +0.4°C/h</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={(e) => { e.stopPropagation(); showToast('Thermal isotherm filter applied'); }} style={{ padding: '2px 6px', backgroundColor: 'var(--surface-3)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '3px', cursor: 'pointer' }}>TEMP ISOTHERM</button>
                <button onClick={(e) => { e.stopPropagation(); showToast('FLIR optics auto-calibrated'); }} style={{ padding: '2px 6px', backgroundColor: 'var(--surface-3)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '3px', cursor: 'pointer' }}>CALIBRATE</button>
              </div>
            </div>
          </div>

          {/* CAM-03: Logistics Dock Overhead */}
          <div
            onClick={() => setSelectedCam('CAM-03')}
            style={{
              backgroundColor: 'var(--surface-1)',
              borderRadius: '8px',
              border: selectedCam === 'CAM-03' ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-panel)',
              cursor: 'pointer',
            }}
          >
            <div style={{
              padding: '6px 12px',
              backgroundColor: 'var(--surface-2)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              fontFamily: 'var(--font-mono)', fontSize: '11px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--warning)' }} />
                <span style={{ color: 'var(--accent)', fontWeight: 700 }}>CAM-03</span>
                <span style={{ color: 'var(--text-tertiary)' }}>// LOGISTICS DOCK OVERHEAD [BIRD-EYE]</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: 'var(--warning)', fontWeight: 600 }}>PROXIMITY WARNING</span>
                <span style={{ color: 'var(--text-tertiary)' }}>2.8K 30FPS</span>
              </div>
            </div>

            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#07090e', overflow: 'hidden' }}>
              <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80"
                alt="Logistics Dock"
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7) contrast(1.2)' }}
              />

              {/* AGV Ring */}
              <div style={{
                position: 'absolute', top: '35%', left: '38%', width: '100px', height: '100px',
                borderRadius: '50%', border: '2px dashed var(--warning)',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                pointerEvents: 'none',
              }}>
                <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--warning)', backgroundColor: 'rgba(0,0,0,0.8)', padding: '2px 4px', borderRadius: '3px' }}>
                  <div>AGV-07 (1.4 m/s)</div>
                  <div>HALO: 2.5m</div>
                </div>
              </div>

              {/* Light Curtain */}
              <div style={{
                position: 'absolute', bottom: '18%', left: '8%', right: '8%', height: '24px',
                borderTop: '2px solid var(--success)', borderBottom: '2px solid var(--success)',
                backgroundColor: 'rgba(52, 211, 153, 0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 8px', fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--success)',
                pointerEvents: 'none',
              }}>
                <span>PEDESTRIAN CORRIDOR #02</span>
                <span>CLEAR • 0 ENTITY</span>
              </div>
            </div>

            <div style={{ padding: '6px 10px', backgroundColor: 'var(--surface-2)', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
              <span style={{ color: 'var(--text-tertiary)' }}>TRAFFIC DENSITY: 38% NOMINAL</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={(e) => { e.stopPropagation(); showToast('Overlaying spatial geomesh wireframe'); }} style={{ padding: '2px 6px', backgroundColor: 'var(--surface-3)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '3px', cursor: 'pointer' }}>SHOW GEOMESH</button>
                <button onClick={(e) => { e.stopPropagation(); showToast('EMERGENCY STOP dispatched to Dock AGV Fleet'); }} style={{ padding: '2px 6px', backgroundColor: 'var(--danger-dim)', border: '1px solid var(--danger-border)', color: 'var(--danger)', borderRadius: '3px', fontWeight: 600, cursor: 'pointer' }}>ESTOP ALL</button>
              </div>
            </div>
          </div>

          {/* CAM-04: Robotic Welding Cell 02 */}
          <div
            onClick={() => setSelectedCam('CAM-04')}
            style={{
              backgroundColor: 'var(--surface-1)',
              borderRadius: '8px',
              border: selectedCam === 'CAM-04' ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-panel)',
              cursor: 'pointer',
            }}
          >
            <div style={{
              padding: '6px 12px',
              backgroundColor: 'var(--surface-2)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              fontFamily: 'var(--font-mono)', fontSize: '11px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--danger)' }} />
                <span style={{ color: 'var(--accent)', fontWeight: 700 }}>CAM-04</span>
                <span style={{ color: 'var(--text-tertiary)' }}>// ROBOTIC WELD CELL 02</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: 'var(--danger)', fontWeight: 600 }}>INTERLOCK TRIPPED</span>
                <span style={{ color: 'var(--text-tertiary)' }}>SHUTTER 1/4000s</span>
              </div>
            </div>

            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#07090e', overflow: 'hidden' }}>
              <img
                src="https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80"
                alt="Robotic Welding"
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.65) contrast(1.3)' }}
              />

              <div style={{
                position: 'absolute', top: '40%', right: '15%', width: '35%', height: '45%',
                border: '2px dashed var(--danger)', backgroundColor: 'rgba(244, 63, 94, 0.12)',
                pointerEvents: 'none',
              }}>
                <div style={{
                  position: 'absolute', top: '-20px', right: 0,
                  backgroundColor: 'var(--danger)', color: '#fff',
                  padding: '1px 5px', fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700,
                }}>
                  INTERLOCK BREACH • ARM ESTOP
                </div>
                <div style={{ position: 'absolute', bottom: '4px', right: '4px', fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--danger)', backgroundColor: 'rgba(0,0,0,0.8)', padding: '2px', textAlign: 'right' }}>
                  <div>DISTANCE TO ARM: 0.82m</div>
                  <div>POWER SHUTDOWN: 12ms</div>
                </div>
              </div>

              <div style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: 'rgba(0,0,0,0.7)', padding: '3px 6px', fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--danger)' }}>
                <div>OPTICAL BEAM BARRIER TRIPPED</div>
                <div style={{ color: 'var(--text-tertiary)' }}>SECTOR: ZONE 03-PERIMETER</div>
              </div>
            </div>

            <div style={{ padding: '6px 10px', backgroundColor: 'var(--surface-2)', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
              <span style={{ color: 'var(--text-tertiary)' }}>SPARK SCATTER INDEX: HIGH (3.4)</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={(e) => { e.stopPropagation(); showToast('Safety log opened for weld cell 02'); }} style={{ padding: '2px 6px', backgroundColor: 'var(--surface-3)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '3px', cursor: 'pointer' }}>VIEW TRIP LOG</button>
                <button onClick={(e) => { e.stopPropagation(); showToast('Interlock beam override requested'); }} style={{ padding: '2px 6px', backgroundColor: 'var(--warning-dim)', border: '1px solid var(--warning-border)', color: 'var(--warning)', borderRadius: '3px', fontWeight: 600, cursor: 'pointer' }}>OVERRIDE BEAM</button>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Right Diagnostic & Inspector Panel */}
        <aside style={{
          borderLeft: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--surface-1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          padding: '16px',
          overflowY: 'auto',
        }}>
          {/* Selected Stream Diagnostic Card */}
          <div style={{
            backgroundColor: 'var(--surface-2)',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Crosshair size={15} style={{ color: 'var(--accent)' }} />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  INSPECTOR: {selectedCam}
                </span>
              </div>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
                color: 'var(--danger)', backgroundColor: 'var(--danger-dim)',
                padding: '1px 6px', borderRadius: '4px', border: '1px solid var(--danger-border)',
              }}>
                ACTIVE ALARM
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
              <div style={{ backgroundColor: 'var(--surface-0)', padding: '6px 8px', borderRadius: '4px' }}>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '9px' }}>FOCAL LENGTH</div>
                <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>24.5 mm (F/1.8)</div>
              </div>
              <div style={{ backgroundColor: 'var(--surface-0)', padding: '6px 8px', borderRadius: '4px' }}>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '9px' }}>FRAME BUFFER</div>
                <div style={{ color: 'var(--accent)', fontWeight: 600 }}>8,420 FRAMES</div>
              </div>
              <div style={{ backgroundColor: 'var(--surface-0)', padding: '6px 8px', borderRadius: '4px' }}>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '9px' }}>ENCODER BITRATE</div>
                <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>18,240 kbps</div>
              </div>
              <div style={{ backgroundColor: 'var(--surface-0)', padding: '6px 8px', borderRadius: '4px' }}>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '9px' }}>INFERENCE LATENCY</div>
                <div style={{ color: 'var(--success)', fontWeight: 600 }}>14.2 ms</div>
              </div>
            </div>
          </div>

          {/* Live Object & PPE Compliance Breakdown */}
          <div style={{
            backgroundColor: 'var(--surface-2)',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                LIVE PPE COMPLIANCE
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)' }}>
                EPOCH #482
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', backgroundColor: 'var(--surface-0)', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                  <ShieldCheck size={14} style={{ color: 'var(--success)' }} />
                  <span>Hardhats</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: 'var(--success)', fontWeight: 700 }}>18 / 19</span>
                  <span style={{ color: 'var(--danger)', fontSize: '10px' }}>(1 MISSING)</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', backgroundColor: 'var(--surface-0)', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                  <ShieldCheck size={14} style={{ color: 'var(--success)' }} />
                  <span>Hi-Vis Vests</span>
                </div>
                <span style={{ color: 'var(--success)', fontWeight: 700 }}>17 / 17</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', backgroundColor: 'var(--surface-0)', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                  <Eye size={14} style={{ color: 'var(--warning)' }} />
                  <span>Safety Eyewear</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: 'var(--warning)', fontWeight: 700 }}>14 / 15</span>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>(1 PENDING)</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', backgroundColor: 'var(--surface-0)', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                  <Radio size={14} style={{ color: 'var(--success)' }} />
                  <span>Respirator Seals</span>
                </div>
                <span style={{ color: 'var(--success)', fontWeight: 700 }}>4 / 4 PASS</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: 'var(--danger-dim)', border: '1px solid var(--danger-border)', borderRadius: '4px', marginTop: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--danger)' }}>
                  <AlertTriangle size={15} />
                  <span style={{ fontWeight: 600 }}>TOTAL BREACHES</span>
                </div>
                <span style={{ color: 'var(--danger)', fontWeight: 700 }}>1 SEVERE</span>
              </div>
            </div>

            {/* Sparkline */}
            <div style={{ marginTop: '4px', backgroundColor: 'var(--surface-0)', padding: '8px', borderRadius: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
                <span>INFRACTION TREND (60m)</span>
                <span style={{ color: 'var(--success)' }}>99.4% NOMINAL</span>
              </div>
              <svg style={{ width: '100%', height: '32px', overflow: 'visible' }} viewBox="0 0 100 24" fill="none">
                <path d="M0 20 L15 19 L30 20 L45 18 L60 21 L75 14 L85 20 L100 6" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="100" cy="6" r="3" fill="var(--danger)" className="animate-ping" />
                <circle cx="100" cy="6" r="2.5" fill="var(--danger)" />
              </svg>
            </div>
          </div>

          {/* Operational Protocols */}
          <div style={{
            backgroundColor: 'var(--surface-2)',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginTop: 'auto',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>
              OPERATIONAL PROTOCOLS
            </span>

            <button
              onClick={() => {
                setIsBeaconActive(!isBeaconActive);
                showToast(isBeaconActive ? 'Audible beacon silenced' : 'AUDIBLE BEACON TRIGGERED IN BAY 4-S');
              }}
              style={{
                width: '100%', padding: '9px',
                backgroundColor: isBeaconActive ? '#dc2626' : 'var(--danger)',
                color: '#fff', border: 'none', borderRadius: '6px',
                fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                cursor: 'pointer', boxShadow: '0 4px 12px rgba(244, 63, 94, 0.4)',
              }}
            >
              <Volume2 size={15} />
              <span>{isBeaconActive ? 'SILENCE BEACON' : 'TRIGGER AUDIBLE BEACON [BAY 4-S]'}</span>
            </button>

            <button
              onClick={() => showToast('Evidence flagged and exported for safety audit')}
              style={{
                width: '100%', padding: '8px',
                backgroundColor: 'var(--surface-3)', color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)', borderRadius: '6px',
                fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                cursor: 'pointer',
              }}
            >
              <Bookmark size={14} />
              <span>FLAG EVIDENCE FOR SAFETY AUDIT</span>
            </button>

            <button
              onClick={() => showToast('Radio alert sent to Zone Supervisor unit')}
              style={{
                width: '100%', padding: '8px',
                backgroundColor: 'var(--surface-0)', color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)', borderRadius: '6px',
                fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                cursor: 'pointer',
              }}
            >
              <Smartphone size={14} />
              <span>PAGE ZONE SUPERVISOR</span>
            </button>
          </div>
        </aside>
      </div>

      {/* Bottom 16-Camera Node Matrix Strip */}
      <div style={{
        padding: '10px 20px',
        backgroundColor: 'var(--surface-1)',
        borderTop: '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
              SCADA CAMERA NODE MATRIX (16 CHANNELS)
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--success)' }}>
              MEAN LATENCY: 12.4ms • JITTER: 0.6ms
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--success)' }} /> NOMINAL</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--warning)' }} /> WARNING</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--danger)' }} /> INCIDENT</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, minmax(0, 1fr))', gap: '6px' }}>
          {cameraNodes.map((node) => {
            const isSelected = selectedCam === node.id;
            const statusColor = node.status === 'critical' ? 'var(--danger)' : node.status === 'warning' ? 'var(--warning)' : 'var(--success)';
            return (
              <div
                key={node.id}
                onClick={() => setSelectedCam(node.id)}
                style={{
                  backgroundColor: isSelected ? 'var(--surface-3)' : 'var(--surface-0)',
                  border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                  borderTop: `2px solid ${statusColor}`,
                  borderRadius: '4px',
                  padding: '4px 6px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: isSelected ? 'var(--accent)' : 'var(--text-primary)' }}>{node.id}</span>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: statusColor }} />
                </div>
                <div style={{ color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {node.latency}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
