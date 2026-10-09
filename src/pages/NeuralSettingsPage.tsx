import React, { useState } from 'react';
import {
  Cpu,
  Brain,
  Save,
  Zap,
  HardHat,
  Shield,
  Eye,
  Wind,
  Video,
  Server,
} from 'lucide-react';

interface EdgeNode {
  id: string;
  name: string;
  device: string;
  status: 'nominal' | 'warning' | 'offline';
  gpuLoad: number;
  temp: number;
  vram: string;
  assignedCams: string[];
}

export const NeuralSettingsPage: React.FC = () => {
  // Confidence Sliders
  const [hardhatConf, setHardhatConf] = useState<number>(88);
  const [vestConf, setVestConf] = useState<number>(92);
  const [gogglesConf, setGogglesConf] = useState<number>(85);
  const [maskConf, setMaskConf] = useState<number>(90);
  const [fpsMode, setFpsMode] = useState<'30' | '60'>('60');

  // Escalation Toggles
  const [autoLockTurnstiles, setAutoLockTurnstiles] = useState<boolean>(true);
  const [triggerStrobeSirens, setTriggerStrobeSirens] = useState<boolean>(true);
  const [dispatchMarshalSms, setDispatchMarshalSms] = useState<boolean>(true);
  const [powerShuntInterlock, setPowerShuntInterlock] = useState<boolean>(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const edgeNodes: EdgeNode[] = [
    { id: 'NODE-01', name: 'Jetson Orin AGX-01', device: 'NVIDIA Orin 64GB', status: 'nominal', gpuLoad: 68, temp: 48, vram: '14.2 / 64 GB', assignedCams: ['CAM-01', 'CAM-02', 'CAM-03', 'CAM-04'] },
    { id: 'NODE-02', name: 'Jetson Orin AGX-02', device: 'NVIDIA Orin 64GB', status: 'nominal', gpuLoad: 72, temp: 51, vram: '15.8 / 64 GB', assignedCams: ['CAM-05', 'CAM-06', 'CAM-07', 'CAM-08'] },
    { id: 'NODE-03', name: 'Jetson Orin AGX-03', device: 'NVIDIA Orin 64GB', status: 'warning', gpuLoad: 89, temp: 64, vram: '18.4 / 64 GB', assignedCams: ['CAM-09', 'CAM-10', 'CAM-11', 'CAM-12'] },
    { id: 'NODE-04', name: 'Jetson Orin AGX-04', device: 'NVIDIA Orin 64GB', status: 'nominal', gpuLoad: 64, temp: 46, vram: '13.9 / 64 GB', assignedCams: ['CAM-13', 'CAM-14', 'CAM-15', 'CAM-16'] },
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

      {/* Header Sub-bar */}
      <div style={{
        padding: '14px 20px', backgroundColor: 'var(--surface-1)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)', letterSpacing: '0.08em' }}>SYS_CFG // PIPELINE</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', backgroundColor: 'var(--accent-dim)', padding: '1px 6px', borderRadius: '4px' }}>MODEL_v4.2.1-FP16</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Neural Vision & Node Topology Settings
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px',
            backgroundColor: 'var(--surface-2)', borderRadius: '4px',
            fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--success)',
          }}>
            <Cpu size={13} />
            <span>CUDA CORE INFERENCE: ACTIVE</span>
          </div>

          <button
            onClick={() => showToast('Parameters committed and synced to 4 Jetson Orin Edge Nodes')}
            style={{
              padding: '6px 16px', backgroundColor: 'var(--accent)', color: '#000',
              border: 'none', borderRadius: '6px', fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
            }}
          >
            <Save size={14} />
            <span>COMMIT PARAMETERS</span>
          </button>
        </div>
      </div>

      {/* Main Multi-Split Command Layout */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)',
        padding: '16px', gap: '16px', flex: 1,
      }}>
        {/* Left Side: Neural Vision CV Tuning Board */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Top Tuning Engine */}
          <div style={{
            backgroundColor: 'var(--surface-1)', borderRadius: '8px',
            border: '1px solid var(--border-subtle)', padding: '16px',
            display: 'flex', flexDirection: 'column', gap: '14px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Brain size={18} style={{ color: 'var(--accent)' }} />
                <div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)' }}>YOLOv9-PPE Pipeline</span>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Model Confidence & Occlusion Matrix
                  </div>
                </div>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--success)', backgroundColor: 'var(--success-dim)', padding: '2px 8px', borderRadius: '4px' }}>
                TENSORRT_ACCEL
              </span>
            </div>

            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
              Dynamically calibrate synthetic bounding confidence thresholds and optical occlusion weights across 16 synchronized real-time RTSP streams.
            </p>

            {/* Slider Controls */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {/* Slider 1: Hardhat */}
              <div style={{ backgroundColor: 'var(--surface-0)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-primary)' }}>
                    <HardHat size={14} style={{ color: 'var(--accent)' }} />
                    <span>Hardhat Confidence</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700, color: 'var(--accent)' }}>{hardhatConf}%</span>
                </div>
                <input
                  type="range" min="70" max="99" value={hardhatConf}
                  onChange={(e) => setHardhatConf(parseInt(e.target.value))}
                  style={{ accentColor: 'var(--accent)', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-tertiary)' }}>
                  <span>70% (Permissive)</span>
                  <span>Optimum: 88%</span>
                  <span>99% (Strict)</span>
                </div>
              </div>

              {/* Slider 2: Vest */}
              <div style={{ backgroundColor: 'var(--surface-0)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-primary)' }}>
                    <Shield size={14} style={{ color: 'var(--success)' }} />
                    <span>Vest Retroreflective</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700, color: 'var(--success)' }}>{vestConf}%</span>
                </div>
                <input
                  type="range" min="60" max="99" value={vestConf}
                  onChange={(e) => setVestConf(parseInt(e.target.value))}
                  style={{ accentColor: 'var(--success)', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-tertiary)' }}>
                  <span>60% (Dust Masking)</span>
                  <span>ISO 20471 Spec</span>
                  <span>99%</span>
                </div>
              </div>

              {/* Slider 3: Goggles */}
              <div style={{ backgroundColor: 'var(--surface-0)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-primary)' }}>
                    <Eye size={14} style={{ color: 'var(--warning)' }} />
                    <span>Goggle Glare Tolerance</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700, color: 'var(--warning)' }}>{gogglesConf}%</span>
                </div>
                <input
                  type="range" min="50" max="95" value={gogglesConf}
                  onChange={(e) => setGogglesConf(parseInt(e.target.value))}
                  style={{ accentColor: 'var(--warning)', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-tertiary)' }}>
                  <span>50%</span>
                  <span>Welding Flare Filter</span>
                  <span>95%</span>
                </div>
              </div>

              {/* Slider 4: Respirator */}
              <div style={{ backgroundColor: 'var(--surface-0)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-primary)' }}>
                    <Wind size={14} style={{ color: 'var(--accent)' }} />
                    <span>Respirator Seal Margin</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700, color: 'var(--accent)' }}>{maskConf}%</span>
                </div>
                <input
                  type="range" min="65" max="98" value={maskConf}
                  onChange={(e) => setMaskConf(parseInt(e.target.value))}
                  style={{ accentColor: 'var(--accent)', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-tertiary)' }}>
                  <span>65% (Loose Fit)</span>
                  <span>EN 149 FFP3 Mode</span>
                  <span>98%</span>
                </div>
              </div>
            </div>

            {/* FPS Toggle Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--surface-2)', padding: '10px 14px', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Video size={16} style={{ color: 'var(--text-secondary)' }} />
                <div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>Inference Sampling Rate</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: 'var(--text-tertiary)' }}>Compute overhead tradeoff per RTSP channel</div>
                </div>
              </div>
              <div style={{ display: 'flex', backgroundColor: 'var(--surface-0)', padding: '2px', borderRadius: '4px' }}>
                <button
                  onClick={() => setFpsMode('30')}
                  style={{
                    padding: '4px 10px', borderRadius: '3px', border: 'none',
                    backgroundColor: fpsMode === '30' ? 'var(--accent-dim)' : 'transparent',
                    color: fpsMode === '30' ? 'var(--accent)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  30 FPS (Eco)
                </button>
                <button
                  onClick={() => setFpsMode('60')}
                  style={{
                    padding: '4px 10px', borderRadius: '3px', border: 'none',
                    backgroundColor: fpsMode === '60' ? 'var(--accent)' : 'transparent',
                    color: fpsMode === '60' ? '#000' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  60 FPS (Ultra-Low Latency)
                </button>
              </div>
            </div>
          </div>

          {/* Active Pipeline Verification Loop */}
          <div style={{
            backgroundColor: 'var(--surface-1)', borderRadius: '8px',
            border: '1px solid var(--border-subtle)', padding: '14px',
            display: 'flex', flexDirection: 'column', gap: '10px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Active Pipeline Verification Loop [ZONE_04_FEED_02]
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--success)' }}>
                LATENCY: 14.2 ms (JITTER: ±0.8ms)
              </span>
            </div>

            <div style={{ position: 'relative', height: '200px', backgroundColor: '#070a10', borderRadius: '6px', overflow: 'hidden' }}>
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"
                alt="Verification Stream"
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
              />

              <div style={{ position: 'absolute', top: '8px', left: '10px', backgroundColor: 'rgba(0,0,0,0.7)', padding: '2px 6px', borderRadius: '3px', fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent)' }}>
                CAM_N04_NORTH // 1920x1080@60Hz
              </div>

              {/* Box 1 */}
              <div style={{ position: 'absolute', top: '25%', left: '35%', width: '100px', height: '130px', border: '1px solid var(--accent)', backgroundColor: 'rgba(76, 141, 255, 0.1)', padding: '4px', fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--accent)' }}>
                <div>WRK #804 (CONF: 0.94)</div>
                <div style={{ color: 'var(--success)' }}>HARDHAT: PASS 96%</div>
                <div style={{ color: 'var(--success)' }}>HI-VIS: PASS 98%</div>
              </div>

              {/* Box 2 */}
              <div style={{ position: 'absolute', top: '30%', right: '25%', width: '90px', height: '120px', border: '1px solid var(--warning)', backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '4px', fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--warning)' }}>
                <div>WRK #912 (CONF: 0.89)</div>
                <div style={{ color: 'var(--warning)' }}>GOGGLES: WARN 72%</div>
                <div style={{ color: 'var(--success)' }}>RESPIRATOR: PASS</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Edge Topology & Escalation Routing */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Edge Compute Node Topology */}
          <div style={{
            backgroundColor: 'var(--surface-1)', borderRadius: '8px',
            border: '1px solid var(--border-subtle)', padding: '14px',
            display: 'flex', flexDirection: 'column', gap: '10px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                EDGE COMPUTE TOPOLOGY (4 NODES)
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)' }}>
                NVIDIA JETSON CLUSTER
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {edgeNodes.map((node) => (
                <div
                  key={node.id}
                  style={{
                    backgroundColor: 'var(--surface-0)', padding: '10px',
                    borderRadius: '6px', border: '1px solid var(--border-subtle)',
                    display: 'flex', flexDirection: 'column', gap: '4px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Server size={14} style={{ color: 'var(--accent)' }} />
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {node.name}
                      </span>
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700,
                      color: node.status === 'warning' ? 'var(--warning)' : 'var(--success)',
                      textTransform: 'uppercase',
                    }}>
                      {node.status}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                    <div>GPU: <strong style={{ color: 'var(--text-primary)' }}>{node.gpuLoad}%</strong></div>
                    <div>TEMP: <strong style={{ color: node.temp > 60 ? 'var(--warning)' : 'var(--text-primary)' }}>{node.temp}°C</strong></div>
                    <div>VRAM: <strong style={{ color: 'var(--text-primary)' }}>{node.vram.split(' ')[0]}G</strong></div>
                  </div>

                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                    FEEDS: {node.assignedCams.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Escalation Routing & Hardware Interlock Logic */}
          <div style={{
            backgroundColor: 'var(--surface-1)', borderRadius: '8px',
            border: '1px solid var(--border-subtle)', padding: '14px',
            display: 'flex', flexDirection: 'column', gap: '10px',
          }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
              ESCALATION ROUTING & INTERLOCKS
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'var(--font-sans)', fontSize: '12px' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '6px', backgroundColor: 'var(--surface-0)', borderRadius: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Auto-Lock Ingress Turnstiles on Breach</span>
                <input
                  type="checkbox"
                  checked={autoLockTurnstiles}
                  onChange={(e) => setAutoLockTurnstiles(e.target.checked)}
                  style={{ accentColor: 'var(--accent)' }}
                />
              </label>

              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '6px', backgroundColor: 'var(--surface-0)', borderRadius: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Trigger Audible Klaxon Strobe</span>
                <input
                  type="checkbox"
                  checked={triggerStrobeSirens}
                  onChange={(e) => setTriggerStrobeSirens(e.target.checked)}
                  style={{ accentColor: 'var(--accent)' }}
                />
              </label>

              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '6px', backgroundColor: 'var(--surface-0)', borderRadius: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Dispatch Push Alert to Safety Marshal</span>
                <input
                  type="checkbox"
                  checked={dispatchMarshalSms}
                  onChange={(e) => setDispatchMarshalSms(e.target.checked)}
                  style={{ accentColor: 'var(--accent)' }}
                />
              </label>

              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '6px', backgroundColor: 'var(--surface-0)', borderRadius: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Robotic Arm Emergency Power Shunt</span>
                <input
                  type="checkbox"
                  checked={powerShuntInterlock}
                  onChange={(e) => setPowerShuntInterlock(e.target.checked)}
                  style={{ accentColor: 'var(--danger)' }}
                />
              </label>
            </div>

            <button
              onClick={() => showToast('Escalation & Interlock policies updated')}
              style={{
                marginTop: '4px', padding: '8px',
                backgroundColor: 'var(--surface-2)', border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)', borderRadius: '6px',
                fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              SAVE INTERLOCK RULES
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
