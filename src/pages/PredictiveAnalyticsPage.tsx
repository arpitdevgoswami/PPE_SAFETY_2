import React, { useState } from 'react';
import {
  Brain,
  Zap,
} from 'lucide-react';

export const PredictiveAnalyticsPage: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<'infractions' | 'near-miss' | 'heat' | 'noise'>('infractions');
  const [selectedDay, setSelectedDay] = useState<number>(30);
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

      {/* Analytics Control Ribbon */}
      <div style={{
        padding: '12px 20px', backgroundColor: 'var(--surface-1)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-tertiary)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--success)' }} className="animate-pulse" />
            <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>ENGINE // NEURAL-SPATIAL MODEL V4.19</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '3px 8px', backgroundColor: 'var(--surface-2)', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
            <span style={{ color: 'var(--text-tertiary)' }}>TEMPORAL WINDOW:</span>
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>T-30 DAYS (ROLLING)</span>
          </div>
        </div>

        {/* Heatmap Layer Switches */}
        <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--surface-0)', padding: '2px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setActiveLayer('infractions')}
            style={{
              padding: '4px 10px', borderRadius: '4px', border: 'none',
              backgroundColor: activeLayer === 'infractions' ? 'var(--accent)' : 'transparent',
              color: activeLayer === 'infractions' ? '#000' : 'var(--text-secondary)',
              fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            Infraction Frequency
          </button>
          <button
            onClick={() => setActiveLayer('near-miss')}
            style={{
              padding: '4px 10px', borderRadius: '4px', border: 'none',
              backgroundColor: activeLayer === 'near-miss' ? 'var(--accent)' : 'transparent',
              color: activeLayer === 'near-miss' ? '#000' : 'var(--text-secondary)',
              fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            Near-Miss Clusters
          </button>
          <button
            onClick={() => setActiveLayer('heat')}
            style={{
              padding: '4px 10px', borderRadius: '4px', border: 'none',
              backgroundColor: activeLayer === 'heat' ? 'var(--accent)' : 'transparent',
              color: activeLayer === 'heat' ? '#000' : 'var(--text-secondary)',
              fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            Heat Stress Index
          </button>
          <button
            onClick={() => setActiveLayer('noise')}
            style={{
              padding: '4px 10px', borderRadius: '4px', border: 'none',
              backgroundColor: activeLayer === 'noise' ? 'var(--accent)' : 'transparent',
              color: activeLayer === 'noise' ? '#000' : 'var(--text-secondary)',
              fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            Noise Exceedance
          </button>
        </div>
      </div>

      {/* Primary Visual Grid: Spatial Topology (65%) + Neural Projections (35%) */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px',
        padding: '16px', gap: '16px', flex: 1,
      }}>
        {/* Left: 2.5D Isometric Risk Density Topology */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{
            position: 'relative', width: '100%', height: '480px',
            backgroundColor: 'var(--surface-1)', borderRadius: '8px',
            border: '1px solid var(--border-subtle)', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            boxShadow: 'var(--shadow-panel)',
          }}>
            {/* Reticle Header */}
            <div style={{
              padding: '10px 14px', zIndex: 10,
              backgroundColor: 'rgba(17, 21, 29, 0.9)', backdropFilter: 'blur(8px)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)' }}>
                  PRIMARY TOPOLOGY // PLANT 04 FABRICATION FLOOR
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Cumulative Risk Surface (LIDAR Matrix 14,800m²)
                </div>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', backgroundColor: 'var(--surface-2)', padding: '2px 8px', borderRadius: '4px' }}>
                GEO_ACC: 0.12m
              </span>
            </div>

            {/* SVG Cumulative Risk Heatmap */}
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 1000 540" style={{ width: '100%', height: '100%' }}>
                {/* Diamond Floor Slab */}
                <polygon points="500,60 880,240 500,460 120,240" fill="#141720" stroke="#272a32" strokeWidth="2" />

                {/* Bays */}
                {/* Bay 01 */}
                <polygon points="500,60 660,135 480,220 320,145" fill="#181c25" stroke="#252a35" />
                {/* Bay 02 */}
                <polygon points="660,135 820,210 640,295 480,220" fill="#1b1f29" stroke="#252a35" />
                {/* Bay 03: Hotspot Zone */}
                <polygon points="320,145 480,220 300,305 140,230" fill="#201a1f" stroke="#3e242d" strokeWidth="1.5" />
                {/* Bay 04: AGV Pinch */}
                <polygon points="480,220 640,295 460,380 300,305" fill="#221e1a" stroke="#3e3224" strokeWidth="1.5" />
                {/* Bay 05 */}
                <polygon points="640,295 800,370 620,450 460,380" fill="#171a22" stroke="#252a35" />

                {/* Heatmap Ellipses */}
                {/* Amber Pinch Point Bay 04 */}
                <ellipse cx="475" cy="305" rx="110" ry="50" fill="rgba(245, 158, 11, 0.3)" />
                <ellipse cx="475" cy="305" rx="55" ry="25" fill="rgba(245, 158, 11, 0.6)" className="animate-pulse" />

                {/* Crimson Hotspot Bay 03 */}
                <ellipse cx="295" cy="230" rx="115" ry="55" fill="rgba(244, 63, 94, 0.35)" />
                <ellipse cx="295" cy="230" rx="60" ry="28" fill="rgba(244, 63, 94, 0.7)" />
                <ellipse cx="295" cy="230" rx="22" ry="10" fill="#ffffff" opacity="0.9" />

                {/* Callout: Zone 04 AGV */}
                <line x1="475" y1="305" x2="475" y2="230" stroke="var(--warning)" strokeDasharray="3 3" />
                <circle cx="475" cy="305" r="4" fill="var(--warning)" />
                <rect x="420" y="190" width="130" height="28" rx="4" fill="var(--surface-2)" stroke="var(--warning)" />
                <text x="485" y="204" fill="var(--warning)" fontFamily="var(--font-mono)" fontSize="9" fontWeight="600" textAnchor="middle">ZONE 04 // AGV CROSSING</text>
                <text x="485" y="214" fill="var(--text-tertiary)" fontFamily="var(--font-mono)" fontSize="8" textAnchor="middle">DENSITY: 84.6% WARN</text>

                {/* Callout: Critical Hotspot Bay 03 */}
                <line x1="290" y1="230" x2="290" y2="135" stroke="var(--danger)" strokeDasharray="3 3" />
                <circle cx="290" cy="230" r="5" fill="var(--danger)" />
                <circle cx="290" cy="230" r="16" fill="none" stroke="var(--danger)" strokeDasharray="4 2" />
                <rect x="210" y="95" width="160" height="38" rx="4" fill="var(--surface-2)" stroke="var(--danger)" strokeWidth="1.5" />
                <text x="290" y="111" fill="var(--danger)" fontFamily="var(--font-mono)" fontSize="10" fontWeight="700" textAnchor="middle">CRITICAL HOTSPOT // BAY 03</text>
                <text x="290" y="124" fill="var(--text-secondary)" fontFamily="var(--font-mono)" fontSize="8" textAnchor="middle">38 NEAR-MISS / 14 PPE BREACHES</text>

                {/* Callout: Bay 02 Nominal */}
                <line x1="680" y1="230" x2="680" y2="180" stroke="var(--success)" strokeDasharray="2 2" />
                <circle cx="680" cy="230" r="3" fill="var(--success)" />
                <rect x="635" y="160" width="90" height="20" rx="3" fill="var(--surface-2)" stroke="var(--success)" />
                <text x="680" y="173" fill="var(--success)" fontFamily="var(--font-mono)" fontSize="8" fontWeight="600" textAnchor="middle">BAY 02: NOMINAL</text>
              </svg>
            </div>

            {/* Density Scale Legend & Timeline Scrubber */}
            <div style={{
              padding: '10px 14px', zIndex: 10,
              backgroundColor: 'rgba(17, 21, 29, 0.9)', backdropFilter: 'blur(8px)',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
              gap: '12px',
            }}>
              {/* Scale bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)' }}>
                <span>CUMULATIVE EXPOSURE:</span>
                <span>0.0</span>
                <div style={{ width: '80px', height: '6px', background: 'linear-gradient(to right, #101319, #f59e0b, #f43f5e, #ffffff)', borderRadius: '3px' }} />
                <span style={{ color: 'var(--danger)', fontWeight: 700 }}>1.0 HIGH</span>
              </div>

              {/* Day Scrubber */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-primary)', fontWeight: 600 }}>
                  DAY {selectedDay} OF 30 (REAL-TIME AGGREGATE)
                </span>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(parseInt(e.target.value))}
                  style={{ width: '120px', accentColor: 'var(--accent)' }}
                />
              </div>
            </div>
          </div>

          {/* Leading Risk Indicators Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div style={{ backgroundColor: 'var(--surface-1)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)' }}>INFRACTION VELOCITY</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700, color: 'var(--success)', marginTop: '2px' }}>-18.4%</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: 'var(--text-secondary)' }}>Vs. 30-day prior baseline</div>
            </div>

            <div style={{ backgroundColor: 'var(--surface-1)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)' }}>PEAK CONFLICT TIME</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700, color: 'var(--warning)', marginTop: '2px' }}>14:45 UTC</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: 'var(--text-secondary)' }}>Shift relief transition point</div>
            </div>

            <div style={{ backgroundColor: 'var(--surface-1)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)' }}>RESOLVED INTERVENTIONS</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>94 / 96</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: 'var(--success)' }}>97.9% Marshal response rate</div>
            </div>
          </div>
        </div>

        {/* Right: Neural Risk Forecast & AI Interventions */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Plant Safety Index */}
          <div style={{
            backgroundColor: 'var(--surface-1)', borderRadius: '8px',
            border: '1px solid var(--border-subtle)', padding: '14px',
            display: 'flex', flexDirection: 'column', gap: '8px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                PLANT SAFETY INDEX // 30D
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--success)' }}>
                PREDICTIVE RISK: LOW-MED
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)' }}>94.8</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-tertiary)' }}>/ 100</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--success)', marginLeft: 'auto' }}>
                +1.4 pts vs prev shift
              </span>
            </div>

            <div style={{ height: '6px', backgroundColor: 'var(--surface-0)', borderRadius: '3px', overflow: 'hidden', marginTop: '4px' }}>
              <div style={{ width: '94.8%', height: '100%', backgroundColor: 'var(--success)' }} />
            </div>
          </div>

          {/* Neural Risk Forecast Card */}
          <div style={{
            backgroundColor: 'var(--surface-1)', borderRadius: '8px',
            border: '1px solid var(--border-subtle)', padding: '14px',
            display: 'flex', flexDirection: 'column', gap: '10px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Brain size={16} style={{ color: 'var(--accent)' }} />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  NEURAL RISK FORECAST
                </span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', backgroundColor: 'var(--accent-dim)', padding: '2px 6px', borderRadius: '4px' }}>
                92% CONFIDENCE
              </span>
            </div>

            <div style={{ backgroundColor: 'var(--warning-dim)', border: '1px solid var(--warning-border)', borderRadius: '6px', padding: '10px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--warning)', fontWeight: 700 }}>
                PROJECTED HIGH-RISK WINDOW
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                14:30 – 15:30 (SHIFT TURNOVER)
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                Bay 04 projected pinch collision risk escalation due to simultaneous logistics AGV cargo transfers intersecting high pedestrian density during relief staging.
              </div>
            </div>

            {/* AI Recommended Interventions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>
                AI RECOMMENDED INTERVENTIONS
              </span>

              <div style={{ padding: '8px', backgroundColor: 'var(--surface-0)', borderRadius: '6px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--text-primary)' }}>
                  Stagger AGV-04 dock ingress by 15 mins
                </div>
                <button
                  onClick={() => showToast('Dispatched automated reschedule to AGV Fleet Master')}
                  style={{ padding: '4px 8px', backgroundColor: 'var(--accent-dim)', border: '1px solid var(--accent-border)', color: 'var(--accent)', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, cursor: 'pointer' }}
                >
                  APPLY
                </button>
              </div>

              <div style={{ padding: '8px', backgroundColor: 'var(--surface-0)', borderRadius: '6px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--text-primary)' }}>
                  Deploy Safety Marshal to Bay 03 Arc Area
                </div>
                <button
                  onClick={() => showToast('Dispatched Safety Marshal to Bay 03 relief post')}
                  style={{ padding: '4px 8px', backgroundColor: 'var(--accent-dim)', border: '1px solid var(--accent-border)', color: 'var(--accent)', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, cursor: 'pointer' }}
                >
                  APPLY
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
