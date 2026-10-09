import React, { useState } from 'react';
import {
  AlertTriangle,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Download,
  Video,
  Layers,
  Flame,
  ShieldCheck,
  FileText,
  Zap,
  CheckCircle,
  Flag,
} from 'lucide-react';

export const IncidentInvestigationPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<string>('1.0x');
  const [timelinePosition, setTimelinePosition] = useState<number>(44);
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

      {/* Header Banner */}
      <div style={{
        padding: '14px 20px', backgroundColor: 'var(--surface-1)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            backgroundColor: 'var(--danger-dim)', border: '1px solid var(--danger-border)',
            color: 'var(--danger)', padding: '4px 10px', borderRadius: '4px',
            fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <AlertTriangle size={14} />
            <span>SEV-1 CRITICAL</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>INC-2024-0892</span>
              <span style={{ color: 'var(--text-tertiary)' }}>/</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                BAY 4-S HELMET INFRACTION & ARC FLASH PROXIMITY
              </span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-tertiary)' }}>
              INCIDENT REPLAY RECORDED: 2024-10-18 11:47:18 UTC [DEMO DATA]
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px',
            backgroundColor: 'var(--surface-2)', borderRadius: '4px',
            fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--danger)' }} className="animate-pulse" />
            <span>REPLAY SYNC: LOCK [CH-1 + CH-2 + CH-3]</span>
          </div>

          <button
            onClick={() => showToast('Full forensic dossier & evidence exported to secure PDF')}
            style={{
              padding: '6px 14px', backgroundColor: 'var(--accent)', color: '#000',
              border: 'none', borderRadius: '6px', fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
            }}
          >
            <Download size={14} />
            <span>EVIDENCE EXPORT</span>
          </button>
        </div>
      </div>

      {/* Main Forensic Grid: Multi-Channel Replay + Forensic Timeline */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px',
        padding: '16px', gap: '16px', flex: 1,
      }}>
        {/* Left: Replay Video Channels & Scrubber */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Synchronized Multi-Angle Replay Canvas */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
            {/* Primary Channel 1: Optical 4K High Speed */}
            <div style={{
              position: 'relative', height: '360px', backgroundColor: '#070a10',
              borderRadius: '8px', border: '1px solid var(--border-subtle)', overflow: 'hidden',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              boxShadow: 'var(--shadow-panel)',
            }}>
              <img
                src="https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80"
                alt="Optical High Speed"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.65) contrast(1.2)' }}
              />

              {/* HUD Header */}
              <div style={{
                position: 'relative', zIndex: 10, padding: '8px 12px',
                backgroundColor: 'rgba(11, 14, 20, 0.85)', backdropFilter: 'blur(6px)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                fontFamily: 'var(--font-mono)', fontSize: '11px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent)' }}>
                  <Video size={14} />
                  <span>CAM_OPTICAL_4S_HIGH_SPEED [PRIMARY]</span>
                </div>
                <div style={{ color: 'var(--danger)', fontWeight: 700, backgroundColor: 'var(--danger-dim)', padding: '1px 6px', borderRadius: '3px' }}>
                  UNSTRAPPED PPE EVENT
                </div>
              </div>

              {/* AI Bounding Box Over Worker */}
              <div style={{
                position: 'absolute', top: '25%', left: '45%', width: '130px', height: '190px',
                border: '2px dashed var(--danger)', backgroundColor: 'rgba(244, 63, 94, 0.15)',
                zIndex: 5, pointerEvents: 'none',
              }}>
                <div style={{ position: 'absolute', top: '15px', left: '50%', transform: 'translateX(-50%)', width: '38px', height: '38px', borderRadius: '50%', border: '2px solid var(--danger)', backgroundColor: 'rgba(244,63,94,0.3)' }} className="animate-pulse" />
              </div>

              {/* HUD Footer */}
              <div style={{
                position: 'relative', zIndex: 10, padding: '8px 12px',
                backgroundColor: 'rgba(11, 14, 20, 0.85)', backdropFilter: 'blur(6px)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
                fontFamily: 'var(--font-mono)', fontSize: '11px',
              }}>
                <div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>TGT: WORKER #3651 (M. VANCE)</div>
                  <div style={{ color: 'var(--danger)', fontWeight: 700 }}>HEAD_GEAR: MISSING (0.00s DELTA)</div>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>ARC DISTANCE: 1.42m (BREACH LIMIT: &lt; 2.50m)</div>
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--success)' }}>
                  11:47:18.420
                </div>
              </div>
            </div>

            {/* Channels 2 & 3: 3D Twin Iso + FLIR Thermal IR */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* CH-2: 3D Twin Isometric */}
              <div style={{
                position: 'relative', flex: 1, backgroundColor: '#090d15',
                borderRadius: '8px', border: '1px solid var(--border-subtle)', overflow: 'hidden',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                padding: '8px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '10px', zIndex: 5 }}>
                  <span style={{ color: 'var(--text-primary)', backgroundColor: 'rgba(0,0,0,0.7)', padding: '1px 5px', borderRadius: '3px' }}>3D TWIN ISOMETRIC CH-2</span>
                  <span style={{ color: 'var(--accent)' }}>MESH: 120 FPS</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Layers size={40} style={{ color: 'var(--accent)', opacity: 0.6 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)', zIndex: 5, backgroundColor: 'rgba(0,0,0,0.7)', padding: '2px 5px', borderRadius: '3px' }}>
                  <span>POS: X:144.2 Y:88.1</span>
                  <span style={{ color: 'var(--danger)' }}>SECTOR 4S-HOT</span>
                </div>
              </div>

              {/* CH-3: FLIR Thermal IR */}
              <div style={{
                position: 'relative', flex: 1, backgroundColor: '#090812',
                borderRadius: '8px', border: '1px solid var(--border-subtle)', overflow: 'hidden',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                padding: '8px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '10px', zIndex: 5 }}>
                  <span style={{ color: 'var(--warning)', backgroundColor: 'rgba(0,0,0,0.7)', padding: '1px 5px', borderRadius: '3px' }}>FLIR THERMAL IR CH-3</span>
                  <span style={{ color: 'var(--warning)', fontWeight: 700 }}>MAX: 842°C</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Flame size={40} style={{ color: 'var(--warning)', opacity: 0.7 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)', zIndex: 5, backgroundColor: 'rgba(0,0,0,0.7)', padding: '2px 5px', borderRadius: '3px' }}>
                  <span>SKIN TEMP EST: 36.8°C</span>
                  <span style={{ color: 'var(--warning)' }}>RAD HEAT: HIGH</span>
                </div>
              </div>
            </div>
          </div>

          {/* Synchronized Replay Timeline Scrubber */}
          <div style={{
            backgroundColor: 'var(--surface-1)', borderRadius: '8px',
            border: '1px solid var(--border-subtle)', padding: '14px',
            display: 'flex', flexDirection: 'column', gap: '10px',
          }}>
            {/* Scrubber Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{
                    width: '32px', height: '32px', borderRadius: '6px', border: 'none',
                    backgroundColor: 'var(--accent)', color: '#000',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  }}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <button
                  onClick={() => setTimelinePosition(Math.max(0, timelinePosition - 10))}
                  style={{ width: '30px', height: '30px', borderRadius: '6px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--surface-2)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <SkipBack size={14} />
                </button>
                <button
                  onClick={() => setTimelinePosition(Math.min(100, timelinePosition + 10))}
                  style={{ width: '30px', height: '30px', borderRadius: '6px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--surface-2)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <SkipForward size={14} />
                </button>
                <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border-subtle)' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  T-PLAY: 11:47:18.420
                </span>
              </div>

              {/* Speeds */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                <span style={{ color: 'var(--text-tertiary)', marginRight: '4px' }}>SPEED:</span>
                {['0.25x', '0.5x', '1.0x', '2.0x'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setPlaybackSpeed(s)}
                    style={{
                      padding: '3px 8px', borderRadius: '4px', border: 'none',
                      backgroundColor: playbackSpeed === s ? 'var(--accent-dim)' : 'var(--surface-2)',
                      color: playbackSpeed === s ? 'var(--accent)' : 'var(--text-secondary)',
                      fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Timeline Bar with Event Markers */}
            <div style={{ position: 'relative', width: '100%', height: '54px', backgroundColor: 'var(--surface-0)', borderRadius: '6px', padding: '6px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', boxSizing: 'border-box' }}>
              {/* Event Flags on Timeline */}
              <div style={{ position: 'relative', width: '100%', height: '22px' }}>
                <div style={{ position: 'absolute', left: '18%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Flag size={11} style={{ color: 'var(--warning)' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--warning)' }}>Zone-In</span>
                </div>
                <div style={{ position: 'absolute', left: '44%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <AlertTriangle size={12} style={{ color: 'var(--danger)' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--danger)', fontWeight: 700 }}>Unstrap</span>
                </div>
                <div style={{ position: 'absolute', left: '58%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Zap size={11} style={{ color: 'var(--warning)' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--warning)' }}>Alarm</span>
                </div>
                <div style={{ position: 'absolute', left: '84%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <ShieldCheck size={11} style={{ color: 'var(--accent)' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--accent)' }}>Marshal</span>
                </div>
              </div>

              {/* Progress Track */}
              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                  setTimelinePosition(pct);
                }}
                style={{ position: 'relative', width: '100%', height: '12px', backgroundColor: 'var(--surface-2)', borderRadius: '3px', cursor: 'pointer' }}
              >
                <div style={{ width: `${timelinePosition}%`, height: '100%', backgroundColor: 'rgba(76, 141, 255, 0.4)', borderRadius: '3px' }} />
                {/* Marker lines */}
                <div style={{ position: 'absolute', left: '18%', top: 0, bottom: 0, width: '2px', backgroundColor: 'var(--warning)' }} />
                <div style={{ position: 'absolute', left: '44%', top: 0, bottom: 0, width: '3px', backgroundColor: 'var(--danger)' }} />
                <div style={{ position: 'absolute', left: '58%', top: 0, bottom: 0, width: '2px', backgroundColor: 'var(--warning)' }} />
                <div style={{ position: 'absolute', left: '84%', top: 0, bottom: 0, width: '2px', backgroundColor: 'var(--accent)' }} />
                {/* Scrubber head */}
                <div style={{ position: 'absolute', left: `${timelinePosition}%`, top: '-4px', bottom: '-4px', width: '6px', transform: 'translateX(-50%)', backgroundColor: '#fff', borderRadius: '2px', boxShadow: '0 0 6px rgba(255,255,255,0.8)' }} />
              </div>

              {/* Timestamp Labels */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                <span>11:46:30</span>
                <span>11:47:00</span>
                <span style={{ color: 'var(--danger)', fontWeight: 700 }}>11:47:18 [BREACH]</span>
                <span>11:48:00</span>
                <span style={{ color: 'var(--success)' }}>11:49:02 [RESOLVED]</span>
              </div>
            </div>

            {/* Timeline Log Points */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>
              <div>• 11:46:52 Worker Entered Arc Buffer Zone</div>
              <div style={{ color: 'var(--danger)' }}>• 11:47:18 SmartPPE Chin-Strap Release (Telemetry Drop)</div>
              <div>• 11:47:34 Zone Klaxon & Light Strobe Triggered</div>
              <div style={{ color: 'var(--success)' }}>• 11:49:02 Marshal Intercept & Hot-Work Shutoff</div>
            </div>
          </div>
        </div>

        {/* Right: Forensic Dossier & Evidence Log */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Dossier Card */}
          <div style={{
            backgroundColor: 'var(--surface-1)', borderRadius: '8px',
            border: '1px solid var(--border-subtle)', padding: '14px',
            display: 'flex', flexDirection: 'column', gap: '12px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                CHAIN OF CUSTODY DOSSIER
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--success)', backgroundColor: 'var(--success-dim)', padding: '2px 6px', borderRadius: '4px' }}>
                CRYPTOGRAPHICALLY SEALED
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
              <div style={{ backgroundColor: 'var(--surface-0)', padding: '8px', borderRadius: '4px' }}>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '9px' }}>SHA-256 EVIDENCE HASH</div>
                <div style={{ color: 'var(--accent)', fontSize: '10px', wordBreak: 'break-all' }}>
                  e7a89f3c1b09d44e5fa682e4a8b190f845a7c29377da9081e289bf4490c3451a
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <div style={{ backgroundColor: 'var(--surface-0)', padding: '6px 8px', borderRadius: '4px' }}>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '9px' }}>OFFICER ON DUTY</div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>S. Miller (SD-04)</div>
                </div>
                <div style={{ backgroundColor: 'var(--surface-0)', padding: '6px 8px', borderRadius: '4px' }}>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '9px' }}>ZONE AUDIT TICKET</div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>TKT-99124-B</div>
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--surface-0)', padding: '6px 8px', borderRadius: '4px' }}>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '9px' }}>WORKER STATEMENT STATUS</div>
                <div style={{ color: 'var(--warning)', fontWeight: 600 }}>Pending Safety Debrief at Shift End</div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
              <button
                onClick={() => showToast('Full forensic dossier packet prepared for OSHA/ISO audit')}
                style={{
                  padding: '8px', backgroundColor: 'var(--accent-dim)', border: '1px solid var(--accent-border)',
                  color: 'var(--accent)', borderRadius: '6px', fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer',
                }}
              >
                <Download size={14} />
                <span>DOWNLOAD AUDIT DOSSIER (.PDF)</span>
              </button>

              <button
                onClick={() => showToast('Dispatched follow-up review invite to Worker #3651 and Safety Lead')}
                style={{
                  padding: '8px', backgroundColor: 'var(--surface-2)', border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)', borderRadius: '6px', fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer',
                }}
              >
                <FileText size={14} />
                <span>SCHEDULE SAFETY DEBRIEF</span>
              </button>

              <button
                onClick={() => showToast('Incident marked closed with corrective counseling applied')}
                style={{
                  padding: '8px', backgroundColor: 'var(--surface-0)', border: '1px solid var(--border-subtle)',
                  color: 'var(--success)', borderRadius: '6px', fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer',
                }}
              >
                <CheckCircle size={14} />
                <span>CLOSE INCIDENT (RESOLVED)</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
