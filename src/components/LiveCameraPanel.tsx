/**
 * LiveCameraPanel — displays real camera streams from the backend
 * with live detection overlays and camera controls.
 *
 * Supports Laptop Webcam and Phone IP Camera (IP Webcam, DroidCam, RTSP, etc.).
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  VideoOff,
  WifiOff,
  AlertTriangle,
  ShieldCheck,
  Flame,
  Wind,
  Smartphone,
  Monitor,
  Loader2,
  Zap,
  HelpCircle,
} from 'lucide-react';
import { streamUrl } from '../api/config';
import { useCameras, useDetections, useBackendStatus } from '../hooks/useBackend';
import type { DetectionResult } from '../api/client';

const STORAGE_KEY_PHONE_URL = 'smartppe_phone_camera_url';

export const LiveCameraPanel: React.FC = () => {
  const { data: cameras, connect, disconnect } = useCameras();
  const { data: detections } = useDetections();
  const { data: status, error: backendError } = useBackendStatus();

  const [phoneUrl, setPhoneUrl] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_PHONE_URL) || '';
  });
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<{ text: string; isError?: boolean } | null>(null);

  // Sync phoneUrl to local storage
  const updatePhoneUrl = (url: string) => {
    setPhoneUrl(url);
    localStorage.setItem(STORAGE_KEY_PHONE_URL, url);
  };

  const showMsg = useCallback((text: string, isError: boolean = false) => {
    setActionMsg({ text, isError });
    setTimeout(() => setActionMsg(null), 4000);
  }, []);

  const laptopCam = cameras?.find((c) => c.camera_id === 'laptop');
  const phoneCam = cameras?.find((c) => c.camera_id === 'phone');
  const laptopDet = detections?.find((d) => d.camera_id === 'laptop') ?? null;
  const phoneDet = detections?.find((d) => d.camera_id === 'phone') ?? null;

  const handleConnect = async (id: string) => {
    setIsConnecting(id);
    try {
      if (id === 'phone') {
        const targetUrl = phoneUrl.trim();
        if (!targetUrl && !phoneCam?.source) {
          showMsg('Please enter your Phone Camera IP / URL first', true);
          setIsConnecting(null);
          return;
        }
        const r = await connect(id, targetUrl ? { url: targetUrl } : undefined);
        showMsg(r.message, !r.success);
      } else {
        const r = await connect(id);
        showMsg(r.message, !r.success);
      }
    } finally {
      setIsConnecting(null);
    }
  };

  const handleDisconnect = async (id: string) => {
    const r = await disconnect(id);
    showMsg(r.message, !r.success);
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
          backgroundColor: 'var(--surface-3)',
          border: `1px solid ${actionMsg.isError ? 'var(--danger-border)' : 'var(--accent-border)'}`,
          borderRadius: '8px', padding: '10px 18px',
          color: actionMsg.isError ? 'var(--danger)' : 'var(--text-primary)',
          fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        }}>
          {actionMsg.isError ? (
            <AlertTriangle size={15} style={{ color: 'var(--danger)' }} />
          ) : (
            <Zap size={15} style={{ color: 'var(--accent)' }} />
          )}
          <span>{actionMsg.text}</span>
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
          loading={isConnecting === 'laptop'}
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
          loading={isConnecting === 'phone'}
          onConnect={() => handleConnect('phone')}
          onDisconnect={() => handleDisconnect('phone')}
          phoneUrlInput={
            !phoneCam?.connected ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '90%', maxWidth: '340px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="text"
                    placeholder="http://192.168.1.X:8080/video"
                    value={phoneUrl}
                    onChange={(e) => updatePhoneUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleConnect('phone');
                    }}
                    style={{
                      flex: 1, padding: '6px 10px', borderRadius: '4px',
                      backgroundColor: 'var(--surface-0)', border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '11px',
                      outline: 'none',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                  />
                  <button
                    onClick={() => handleConnect('phone')}
                    disabled={isConnecting === 'phone'}
                    style={{
                      padding: '4px 12px', borderRadius: '4px',
                      backgroundColor: 'var(--accent)', color: '#000',
                      border: 'none', fontFamily: 'var(--font-mono)', fontSize: '11px',
                      fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                    }}
                  >
                    {isConnecting === 'phone' ? <Loader2 size={12} className="animate-spin" /> : 'CONNECT'}
                  </button>
                </div>
                <div style={{
                  display: 'flex', flexWrap: 'wrap', gap: '4px',
                  alignItems: 'center', fontSize: '10px', color: 'var(--text-tertiary)',
                  fontFamily: 'var(--font-mono)',
                }}>
                  <span>Quick format:</span>
                  <button
                    type="button"
                    onClick={() => {
                      const ipMatch = phoneUrl.match(/\d+\.\d+\.\d+\.\d+/);
                      const ip = ipMatch ? ipMatch[0] : '192.168.1.X';
                      updatePhoneUrl(`http://${ip}:8080/video`);
                    }}
                    style={{
                      background: 'var(--surface-2)', border: '1px solid var(--border-subtle)',
                      color: 'var(--accent)', padding: '1px 5px', borderRadius: '3px', cursor: 'pointer', fontSize: '10px'
                    }}
                  >
                    IP Webcam (:8080)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const ipMatch = phoneUrl.match(/\d+\.\d+\.\d+\.\d+/);
                      const ip = ipMatch ? ipMatch[0] : '192.168.1.X';
                      updatePhoneUrl(`http://${ip}:4747/video`);
                    }}
                    style={{
                      background: 'var(--surface-2)', border: '1px solid var(--border-subtle)',
                      color: 'var(--accent)', padding: '1px 5px', borderRadius: '3px', cursor: 'pointer', fontSize: '10px'
                    }}
                  >
                    DroidCam (:4747)
                  </button>
                </div>
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
  cam: { connected: boolean; error: string | null; frame_width: number | null; frame_height: number | null; source?: string } | null;
  detection: DetectionResult | null;
  loading?: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  phoneUrlInput?: React.ReactNode;
}

const CameraTile: React.FC<CameraTileProps> = ({
  cameraId, label, icon, cam, detection, loading, onConnect, onDisconnect, phoneUrlInput,
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
            color: 'var(--text-disabled)', textAlign: 'center', padding: '16px',
          }}>
            <VideoOff size={30} strokeWidth={1} />
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '11px',
              color: error ? 'var(--danger)' : 'var(--text-secondary)',
              maxWidth: '360px',
            }}>
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
          disabled={loading}
          style={{
            padding: '4px 12px', borderRadius: '4px', border: 'none',
            backgroundColor: connected ? 'var(--danger-dim)' : 'var(--success-dim)',
            color: connected ? 'var(--danger)' : 'var(--success)',
            fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            borderWidth: '1px', borderStyle: 'solid',
            borderColor: connected ? 'var(--danger-border)' : 'var(--success-border)',
            display: 'flex', alignItems: 'center', gap: '4px',
          }}
        >
          {loading && <Loader2 size={10} className="animate-spin" />}
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
