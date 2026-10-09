export type SafetyStatus = 'SAFE' | 'WARNING' | 'DANGER';

export interface PPECompliance {
  helmet: boolean;
  vest: boolean;
  boots: boolean;
  respirator?: boolean;
  eyeProtection?: boolean;
}

export interface WorkerData {
  id: string;
  name: string;
  role: string;
  zoneId: string;
  zoneName: string;
  status: SafetyStatus;
  ppe: PPECompliance;
  lastHeartbeat: string;
  vitals?: {
    heartRate: number;
    bodyTemp: number;
  };
  location3D: [number, number, number]; // [x, y, z] in 3D factory space
  infractionDetail?: string;
}

export interface WorkZone {
  id: string;
  code: string;
  name: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: SafetyStatus;
  activeWorkers: number;
  maxCapacity: number;
  requiredPPE: string[];
  opticalCamera: string;
  ambientNoise: string;
  color: string;
  bounds: {
    xMin: number;
    xMax: number;
    zMin: number;
    zMax: number;
  };
}

export interface IncidentAlert {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  zoneId: string;
  zoneName: string;
  workerId?: string;
  workerName?: string;
  timestamp: string;
  timeAgo: string;
  status: 'DISPATCHED' | 'ALERTED' | 'ACKNOWLEDGED' | 'RESOLVED';
  confidenceScore: number;
  opticalCamera?: string;
  opticalStream: string;
  description: string;
  badgeLabel: 'CRIT' | 'WARN' | 'INFO';
}

export interface SystemMetrics {
  activeWorkers: number;
  totalWorkersToday: number;
  ppeComplianceRate: number;
  activeHazards: number;
  criticalHazards: number;
  warningHazards: number;
  opticalSensorsOnline: number;
  totalSensors: number;
  sceneFps: number;
  telemetryLatencyMs: number;
}
