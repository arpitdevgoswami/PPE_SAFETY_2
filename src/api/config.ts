/**
 * API configuration — reads base URL from Vite environment variable.
 * Falls back to localhost:8000 during development.
 */

export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

/** Build a full API URL from a path */
export function apiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}

/** MJPEG stream URL for a camera */
export function streamUrl(cameraId: string): string {
  return apiUrl(`/api/cameras/${cameraId}/stream`);
}
