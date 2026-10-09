/**
 * React hooks for polling backend data.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import type {
  BackendStatus,
  BackendMetrics,
  DetectionResult,
  CameraStatus,
} from '../api/client';
import {
  getStatus,
  getMetrics,
  getDetections,
  getCameras,
  connectCamera,
  disconnectCamera,
} from '../api/client';

// ── Generic polling hook ──────────────────────────────────────

function usePolling<T>(
  fetcher: () => Promise<T>,
  intervalMs: number,
  enabled: boolean = true
): { data: T | null; error: string | null; loading: boolean } {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let timer: ReturnType<typeof setTimeout>;

    const poll = async () => {
      try {
        const result = await fetcher();
        if (mountedRef.current) {
          setData(result);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (mountedRef.current) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          setLoading(false);
        }
      }
      if (mountedRef.current) {
        timer = setTimeout(poll, intervalMs);
      }
    };

    poll();
    return () => clearTimeout(timer);
  }, [fetcher, intervalMs, enabled]);

  return { data, error, loading };
}

// ── Exported hooks ────────────────────────────────────────────

/** Poll backend system status every 3 seconds */
export function useBackendStatus() {
  return usePolling<BackendStatus>(getStatus, 3000);
}

/** Poll aggregate metrics every 1 second */
export function useBackendMetrics() {
  return usePolling<BackendMetrics>(getMetrics, 1000);
}

/** Poll detection results every 500ms */
export function useDetections() {
  return usePolling<DetectionResult[]>(getDetections, 500);
}

/** Poll camera list every 2 seconds */
export function useCameras() {
  const polling = usePolling<CameraStatus[]>(getCameras, 2000);

  const connect = useCallback(
    async (cameraId: string, params?: { url?: string; index?: number }) => {
      try {
        await connectCamera(cameraId, params);
        return { success: true, message: `${cameraId} connected` };
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Connection failed';
        return { success: false, message: msg };
      }
    },
    []
  );

  const disconnect = useCallback(async (cameraId: string) => {
    try {
      await disconnectCamera(cameraId);
      return { success: true, message: `${cameraId} disconnected` };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Disconnect failed';
      return { success: false, message: msg };
    }
  }, []);

  return { ...polling, connect, disconnect };
}
