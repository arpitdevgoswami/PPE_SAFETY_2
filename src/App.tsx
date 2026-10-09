import React, { useState, useEffect } from 'react';
import { AppSidebar } from './components/AppSidebar';
import type { NavItemKey } from './components/AppSidebar';
import { TopHeader } from './components/TopHeader';
import { MetricsStrip } from './components/MetricsStrip';
import { FactoryScene } from './components/FactoryScene';
import { ContextualInspector } from './components/ContextualInspector';
import { IncidentQueue } from './components/IncidentQueue';

import { LiveMonitoringPage } from './pages/LiveMonitoringPage';
import { WorkforceDirectoryPage } from './pages/WorkforceDirectoryPage';
import { GateAccessAttendancePage } from './pages/GateAccessAttendancePage';
import { PpeAssetVaultPage } from './pages/PpeAssetVaultPage';
import { SpatialZonesPage } from './pages/SpatialZonesPage';
import { IncidentInvestigationPage } from './pages/IncidentInvestigationPage';
import { PredictiveAnalyticsPage } from './pages/PredictiveAnalyticsPage';
import { NeuralSettingsPage } from './pages/NeuralSettingsPage';

import {
  INITIAL_METRICS,
  DEMO_ZONES,
  DEMO_WORKERS,
  DEMO_INCIDENTS,
} from './data/demoData';
import type { IncidentAlert, SystemMetrics } from './types';
import { useBackendMetrics, useBackendStatus } from './hooks/useBackend';

export const App: React.FC = () => {
  const [activeNav, setActiveNav] = useState<NavItemKey>('overview');
  const [metrics, setMetrics] = useState<SystemMetrics>(INITIAL_METRICS);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('zone-03');
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>('WRK-3651');

  // Real backend data (augments demo metrics when backend is online)
  const { data: backendMetrics } = useBackendMetrics();
  const { data: backendStatus } = useBackendStatus();

  useEffect(() => {
    if (backendMetrics) {
      setMetrics((prev) => ({
        ...prev,
        opticalSensorsOnline: backendMetrics.cameras_online + (prev.totalSensors - 2),
        activeHazards:
          (backendMetrics.total_no_helmets > 0 ? 1 : 0) +
          (backendMetrics.total_no_vests > 0 ? 1 : 0) +
          (backendMetrics.fire_detected ? 1 : 0) +
          (backendMetrics.smoke_detected ? 1 : 0),
        criticalHazards: backendMetrics.fire_detected ? 1 : 0,
        warningHazards:
          (backendMetrics.total_no_helmets > 0 ? 1 : 0) +
          (backendMetrics.total_no_vests > 0 ? 1 : 0) +
          (backendMetrics.smoke_detected ? 1 : 0),
        sceneFps: backendMetrics.inference_fps || prev.sceneFps,
        telemetryLatencyMs: backendMetrics.inference_fps > 0
          ? Math.round(1000 / backendMetrics.inference_fps)
          : prev.telemetryLatencyMs,
      }));
    }
  }, [backendMetrics]);

  const selectedZone   = DEMO_ZONES.find((z) => z.id === selectedZoneId) || DEMO_ZONES[2];
  const selectedWorker = selectedWorkerId
    ? DEMO_WORKERS.find((w) => w.id === selectedWorkerId) || null
    : null;

  const handleSelectIncident = (incident: IncidentAlert) => {
    setSelectedZoneId(incident.zoneId);
    if (incident.workerId) {
      const match = DEMO_WORKERS.find(
        (w) => incident.workerId?.includes(w.id.replace('WRK-', ''))
      );
      if (match) setSelectedWorkerId(match.id);
    }
  };

  const handleDispatchMarshal = (zoneId: string) => {
    console.log(`[SmartPPE] Safety marshal dispatched to ${zoneId}`);
  };

  const handleAcknowledge = (zoneId: string) => {
    console.log(`[SmartPPE] Event acknowledged for ${zoneId}`);
    setMetrics((prev) => ({
      ...prev,
      activeHazards: Math.max(0, prev.activeHazards - 1),
    }));
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: 'var(--surface-0)',
      color: 'var(--text-primary)',
    }}>
      {/* Left nav rail */}
      <AppSidebar
        activeItem={activeNav}
        onSelectItem={setActiveNav}
        latencyMs={metrics.telemetryLatencyMs}
      />

      {/* Main content */}
      <div style={{
        marginLeft: 'var(--sidebar-width)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        minHeight: '100vh',
      }}>
        <TopHeader
          metrics={metrics}
          onAlertClick={() => {
            setSelectedZoneId('zone-03');
            setActiveNav('overview');
          }}
        />

        <main style={{
          marginTop: 'var(--header-height)',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}>
          {activeNav === 'overview' && (
            <>
              {/* KPI strip */}
              <MetricsStrip metrics={metrics} />

              {/* Centre grid: 3D twin + inspector */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) 340px',
                flex: 1,
                minHeight: '480px',
                gap: 0,
              }}>
                {/* 3D Viewport */}
                <section style={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderBottom: '1px solid var(--border-subtle)',
                }}>
                  <FactoryScene
                    workers={DEMO_WORKERS}
                    zones={DEMO_ZONES}
                    selectedWorkerId={selectedWorkerId}
                    selectedZoneId={selectedZoneId}
                    onSelectWorker={setSelectedWorkerId}
                    onSelectZone={setSelectedZoneId}
                  />
                </section>

                {/* Inspector panel */}
                <aside style={{
                  borderLeft: '1px solid var(--border-subtle)',
                  borderBottom: '1px solid var(--border-subtle)',
                  overflow: 'hidden',
                }}>
                  <ContextualInspector
                    selectedZone={selectedZone}
                    selectedWorker={selectedWorker}
                    onDispatchMarshal={handleDispatchMarshal}
                    onAcknowledge={handleAcknowledge}
                  />
                </aside>
              </div>

              {/* Incident queue */}
              <IncidentQueue
                incidents={DEMO_INCIDENTS}
                onSelectIncident={handleSelectIncident}
              />
            </>
          )}

          {activeNav === 'monitoring' && (
            <LiveMonitoringPage onSelectIncident={() => setActiveNav('incidents')} />
          )}

          {activeNav === 'workers' && (
            <WorkforceDirectoryPage />
          )}

          {activeNav === 'attendance' && (
            <GateAccessAttendancePage />
          )}

          {activeNav === 'ppe' && (
            <PpeAssetVaultPage />
          )}

          {activeNav === 'zones' && (
            <SpatialZonesPage />
          )}

          {activeNav === 'incidents' && (
            <IncidentInvestigationPage />
          )}

          {activeNav === 'analytics' && (
            <PredictiveAnalyticsPage />
          )}

          {activeNav === 'settings' && (
            <NeuralSettingsPage />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
