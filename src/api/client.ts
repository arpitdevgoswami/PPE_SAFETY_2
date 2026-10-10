/**
 * API client — typed fetch wrappers for the SmartPPE backend.
 */

import { apiUrl } from './config';

// ── Types matching the backend Pydantic schemas ───────────────

export interface DetectionBox {
  class_name: string;
  confidence: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface CameraStatus {
  camera_id: string;
  label: string;
  connected: boolean;
  source: string;
  frame_width: number | null;
  frame_height: number | null;
  last_frame_time: string | null;
  error: string | null;
}

export interface DetectionResult {
  camera_id: string;
  timestamp: string;
  ppe_detections: DetectionBox[];
  fire_smoke_detections: DetectionBox[];
  persons_count: number;
  helmets_count: number;
  no_helmets_count: number;
  vests_count: number;
  no_vests_count: number;
  boots_count: number;
  no_boots_count: number;
  fire_detected: boolean;
  smoke_detected: boolean;
  safety_status: string;
  inference_ms: number;
}

export interface BackendMetrics {
  cameras_online: number;
  total_cameras: number;
  ppe_model_loaded: boolean;
  fire_model_loaded: boolean;
  total_persons: number;
  total_helmets: number;
  total_no_helmets: number;
  total_vests: number;
  total_no_vests: number;
  total_boots: number;
  total_no_boots: number;
  fire_detected: boolean;
  smoke_detected: boolean;
  overall_safety_status: string;
  inference_fps: number;
}

export interface BackendStatus {
  status: string;
  ppe_model_loaded: boolean;
  fire_model_loaded: boolean;
  ppe_model_classes: string[];
  fire_model_classes: string[];
  cameras: CameraStatus[];
}

// ── Fetch helpers ─────────────────────────────────────────────

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(apiUrl(path), init);
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    let detail = body;
    try {
      const parsed = JSON.parse(body);
      if (parsed.detail) detail = parsed.detail;
      else if (parsed.message) detail = parsed.message;
    } catch {}
    throw new Error(detail || `API error ${res.status}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

// ── Public API ────────────────────────────────────────────────

export async function getStatus(): Promise<BackendStatus> {
  return fetchJson<BackendStatus>('/api/status');
}

export async function getCameras(): Promise<CameraStatus[]> {
  return fetchJson<CameraStatus[]>('/api/cameras');
}

export async function connectCamera(
  cameraId: string,
  params?: { url?: string; index?: number }
): Promise<{ message: string }> {
  const query = new URLSearchParams();
  if (params?.url) query.set('url', params.url);
  if (params?.index !== undefined) query.set('index', String(params.index));
  const qs = query.toString();
  return fetchJson<{ message: string }>(
    `/api/cameras/${cameraId}/connect${qs ? `?${qs}` : ''}`,
    { method: 'POST' }
  );
}

export async function disconnectCamera(
  cameraId: string
): Promise<{ message: string }> {
  return fetchJson<{ message: string }>(
    `/api/cameras/${cameraId}/disconnect`,
    { method: 'POST' }
  );
}

export async function getDetections(): Promise<DetectionResult[]> {
  return fetchJson<DetectionResult[]>('/api/detections');
}

export async function getCameraDetections(
  cameraId: string
): Promise<DetectionResult | null> {
  try {
    return await fetchJson<DetectionResult>(`/api/detections/${cameraId}`);
  } catch {
    return null;
  }
}

export async function getMetrics(): Promise<BackendMetrics> {
  return fetchJson<BackendMetrics>('/api/metrics');
}
