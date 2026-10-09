/**
 * LiveCameraPanel — displays real camera streams from the backend
 * with live detection overlays and camera controls.
 *
 * Inserted at the top of the LiveMonitoringPage without changing
 * any existing demo camera tiles below.
 */

import React, { useState, useCallback } from 'react';
import {
  Video,
  VideoOff,
  Wifi,
  WifiOff,
  AlertTriangle,
  ShieldCheck,
  Flame,
  Wind,
  Smartphone,
  Monitor,
  Loader,
  Zap,
} from 'lucide-react';
import { streamUrl } from '../api/config';
import { useCameras, useDetections, useBackendStatus } from '../hooks/useBackend';
import type { DetectionResult } from '../api/client';

export const LiveCameraPanel: React.FC = () => {
  const { data: cameras, connect, disconnect } = useCameras();
  const { data: detections } = useDetections();
  const { data: status, error: backendError } = useBackendStatus();

  const [phoneUrl, setPhoneUrl] = useState('');
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const showMsg = useCallback((msg: string) => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(null), 3000);
  }, []);

  const laptopCam = cameras?.find((c) => c.camera_id === 'laptop');
  const phoneCam = cameras?.find((c) => c.camera_id === 'phone');
  const laptopDet = detections?.find((d) => d.camera_id === 'laptop') ?? null;
  const phoneDet = detections?.find((d) => d.camera_id === 'phone') ?? null;

  const handleConnect = async (id: string) => {
    if (id === 'phone' && phoneUrl) {
      const r = await connect(id, { url: phoneUrl });
      showMsg(r.message);
    } else {
      const r = await connect(id);
      showMsg(r.message);
    }
  };

  const handleDisconnect = async (id: string) => {
    const r = await disconnect(id);
    showMsg(r.message);
  };

  // Backend not reachable
  if (backendError) {
    return (
      <div style={{
        margin: '16px', padding: '16px',
        backgroundColor: 'var(--surface-2)', borderRadius: '8px',
        border: '1px solid var(--warning-border)',
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <WifiOff size={18} style={{ color: 'var(--warning)' }} />
        <div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: 'var(--warning)' }}>
            Backend Offline
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
            Start the backend server: <code style={{ color: 'var(--accent)' }}>python server/run.py</code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Toast */}
      {actionMsg && (
        <div style={{
          position: 'fixed', top: '70px', right: '24px', zIndex: 1000,
          backgroundColor: 'var(--surface-3)', border: '1px solid var(--accent-border)',
          borderRadius: '8px', padding: '10px 18px', color: 'var(--text-primary)',
          fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        }}>
          <Zap size={15} style={{ color: 'var(--accent)' }} />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Section header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            backgroundColor: status?.ppe_model_loaded ? 'var(--success)' : 'var(--warning)',
          }} className="animate-pulse-live" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
            LIVE AI INFERENCE FEEDS
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '10px',
            padding: '1px 6px', borderRadius: '4px',
            backgroundColor: status?.ppe_model_loaded ? 'var(--success-dim)' : 'var(--warning-dim)',
            color: status?.ppe_model_loaded ? 'var(--success)' : 'var(--warning)',
            border: `1px solid ${status?.ppe_model_loaded ? 'var(--success-border)' : 'var(--warning-border)'}`,
            fontWeight: 600,
          }}>
            {status?.ppe_model_loaded ? 'MODELS LOADED' : 'MODELS LOADING…'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-tertiary)' }}>
          <span>PPE: {status?.ppe_model_classes?.join(', ') || '—'}</span>
          <span>|</span>
          <span>Fire: {status?.fire_model_classes?.join(', ') || '—'}</span>
        </div>
      </div>

      {/* Two camera tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        {/* Laptop Camera */}
        <CameraTile
          cameraId="laptop"
          label="Laptop Webcam"
          icon={<Monitor size={14} />}
          cam={laptopCam ?? null}
          detection={laptopDet}
          onConnect={() => handleConnect('laptop')}
          onDisconnect={() => handleDisconnect('laptop')}
        />

        {/* Phone Camera */}
        <CameraTile
          cameraId="phone"
          label="Phone Camera"
          icon={<Smartphone size={14} />}
          cam={phoneCam ?? null}
          detection={phoneDet}
          onConnect={() => handleConnect('phone')}
          onDisconnect={() => handleDisconnect('phone')}
          phoneUrlInput={
            !phoneCam?.connected ? (
              <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                <input
                  type="text"
                  placeholder="http://192.168.x.x:8080/video"
                  value={phoneUrl}
                  onChange={(e) => setPhoneUrl(e.target.value)}
                  style={{
                    flex: 1, padding: '4px 8px', borderRadius: '4px',
                    backgroundColor: 'var(--surface-0)', border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '11px',
                    outline: 'none',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                />
              </div>
            ) : undefined
          }
        />
      </div>
    </div>
  );
};


// ── Camera Tile Sub-Component ─────────────────────────────────

interface CameraTileProps {
  cameraId: string;
  label: string;
  icon: React.ReactNode;
  cam: { connected: boolean; error: string | null; frame_width: number | null; frame_height: number | null } | null;
  detection: DetectionResult | null;
  onConnect: () => void;
  onDisconnect: () => void;
  phoneUrlInput?: React.ReactNode;
}

const CameraTile: React.FC<CameraTileProps> = ({
  cameraId, label, icon, cam, detection, onConnect, onDisconnect, phoneUrlInput,
}) => {
  const connected = cam?.connected ?? false;
  const error = cam?.error ?? null;

  const safetyColor = !detection ? 'var(--text-tertiary)'
    : detection.safety_status.includes('DANGER') ? 'var(--danger)'
    : detection.safety_status.includes('WARNING') ? 'var(--warning)'
    : detection.safety_status === 'SAFE' ? 'var(--success)'
    : 'var(--text-tertiary)';

  return (
    <div style={{
      backgroundColor: 'var(--surface-1)', borderRadius: '8px',
      border: `1px solid ${connected ? 'var(--accent-border)' : 'var(--border-subtle)'}`,
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
      boxShadow: 'var(--shadow-panel)',
    }}>
      {/* Header */}
      <div style={{
        padding: '6px 12px', backgroundColor: 'var(--surface-2)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: 'var(--font-mono)', fontSize: '11px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: '8px', height: '8px', borderRadius: '50%',
            backgroundColor: connected ? 'var(--success)' : 'var(--text-disabled)',
          }} className={connected ? 'animate-pulse-live' : undefined} />
          <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{icon}</span>
          <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{label.toUpperCase()}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {connected && detection && (
            <span style={{ color: safetyColor, fontWeight: 600, fontSize: '10px' }}>
              {detection.safety_status}
            </span>
          )}
          {connected && cam?.frame_width && (
            <span style={{ color: 'var(--text-tertiary)' }}>
              {cam.frame_width}×{cam.frame_height}
            </span>
          )}
        </div>
      </div>

      {/* Video / Placeholder */}
      <div style={{
        position: 'relative', width: '100%', aspectRatio: '16/9',
        backgroundColor: '#0a0e14', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {connected ? (
          <img
            src={streamUrl(cameraId)}
            alt={`${label} live feed`}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
            color: 'var(--text-disabled)',
          }}>
            <VideoOff size={32} strokeWidth={1} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
              {error || 'NOT CONNECTED'}
            </span>
            {phoneUrlInput}
          </div>
        )}

        {/* Detection overlay badges */}
        {connected && detection && (
          <div style={{
            position: 'absolute', top: '8px', left: '8px',
            display: 'flex', flexDirection: 'column', gap: '4px',
          }}>
            <OverlayBadge
              icon={<ShieldCheck size={10} />}
              text={`Persons: ${detection.persons_count}`}
              color="var(--accent)"
            />
            {detection.helmets_count > 0 && (
              <OverlayBadge icon={<ShieldCheck size={10} />} text={`Helmets: ${detection.helmets_count}`} color="var(--success)" />
            )}
            {detection.no_helmets_count > 0 && (
              <OverlayBadge icon={<AlertTriangle size={10} />} text={`No Helmet: ${detection.no_helmets_count}`} color="var(--danger)" />
            )}
            {detection.vests_count > 0 && (
              <OverlayBadge icon={<ShieldCheck size={10} />} text={`Vests: ${detection.vests_count}`} color="var(--success)" />
            )}
            {detection.no_vests_count > 0 && (
              <OverlayBadge icon={<AlertTriangle size={10} />} text={`No Vest: ${detection.no_vests_count}`} color="var(--warning)" />
            )}
            {detection.fire_detected && (
              <OverlayBadge icon={<Flame size={10} />} text="FIRE DETECTED" color="var(--danger)" />
            )}
            {detection.smoke_detected && (
              <OverlayBadge icon={<Wind size={10} />} text="SMOKE DETECTED" color="var(--warning)" />
            )}
          </div>
        )}

        {/* Inference time */}
        {connected && detection && (
          <div style={{
            position: 'absolute', bottom: '8px', right: '8px',
            backgroundColor: 'rgba(0,0,0,0.7)', padding: '2px 6px', borderRadius: '3px',
            fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent)',
          }}>
            {detection.inference_ms.toFixed(0)}ms inference
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div style={{
        padding: '6px 10px', backgroundColor: 'var(--surface-2)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: 'var(--font-mono)', fontSize: '10px',
      }}>
        <span style={{ color: 'var(--text-tertiary)' }}>
          {connected ? 'MJPEG STREAM • LIVE' : 'OFFLINE'}
        </span>
        <button
          onClick={connected ? onDisconnect : onConnect}
          style={{
            padding: '3px 10px', borderRadius: '4px', border: 'none',
            backgroundColor: connected ? 'var(--danger-dim)' : 'var(--success-dim)',
            color: connected ? 'var(--danger)' : 'var(--success)',
            fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
            cursor: 'pointer',
            borderWidth: '1px', borderStyle: 'solid',
            borderColor: connected ? 'var(--danger-border)' : 'var(--success-border)',
          }}
        >
          {connected ? 'DISCONNECT' : 'CONNECT'}
        </button>
      </div>
    </div>
  );
};


// ── Overlay Badge ─────────────────────────────────────────────

const OverlayBadge: React.FC<{ icon: React.ReactNode; text: string; color: string }> = ({ icon, text, color }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: '4px',
    backgroundColor: 'rgba(0,0,0,0.75)', padding: '2px 6px', borderRadius: '3px',
    fontFamily: 'var(--font-mono)', fontSize: '9px', color,
    whiteSpace: 'nowrap',
  }}>
    {icon} {text}
  </div>
);
