import React, { Suspense, useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, Grid } from '@react-three/drei';
import * as THREE from 'three';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Activity,
} from 'lucide-react';
import type { WorkerData, WorkZone } from '../types';

interface FactorySceneProps {
  workers: WorkerData[];
  zones: WorkZone[];
  selectedWorkerId: string | null;
  selectedZoneId: string | null;
  onSelectWorker: (workerId: string) => void;
  onSelectZone: (zoneId: string) => void;
}

// ==========================================
// 1. FACTORY STRUCTURAL MODEL COMPONENT
// ==========================================
function FactoryModel({ showHeatmap }: { showHeatmap: boolean }) {
  const { scene } = useGLTF('/model/model.glb');

  // Compute exact bounding box and normalize scale & position
  const normalizedModel = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    // Target footprint dimension ~48m across
    const targetSize = 48;
    const scale = maxDim > 0 ? targetSize / maxDim : 1;

    clone.scale.set(scale, scale, scale);
    clone.position.x = -center.x * scale;
    clone.position.y = -box.min.y * scale; // Rest on floor (Y = 0)
    clone.position.z = -center.z * scale;

    // Apply SCADA styling to materials
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          const updateMat = (mat: THREE.Material) => {
            if ('roughness' in mat) (mat as THREE.MeshStandardMaterial).roughness = 0.7;
            if ('metalness' in mat) (mat as THREE.MeshStandardMaterial).metalness = 0.2;
          };
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(updateMat);
          } else {
            updateMat(mesh.material);
          }
        }
      }
    });

    return clone;
  }, [scene]);

  return (
    <group>
      <primitive object={normalizedModel} />
      {showHeatmap && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
          <planeGeometry args={[50, 50]} />
          <meshBasicMaterial
            color="#ef4444"
            transparent
            opacity={0.15}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}

// ==========================================
// 2. WORKER 3D INSTANCE COMPONENT
// ==========================================
function WorkerMesh({
  worker,
  isSelected,
  onClick,
}: {
  worker: WorkerData;
  isSelected: boolean;
  onClick: () => void;
}) {
  const { scene } = useGLTF('/model/worker.glb');
  const groupRef = useRef<THREE.Group>(null);

  const clonedWorker = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);

    // Standard human height is ~1.85m in factory coordinates
    const scale = size.y > 0 ? 1.85 / size.y : 1;
    clone.scale.set(scale, scale, scale);
    clone.position.y = -box.min.y * scale; // Align feet with ground Y=0

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });

    return clone;
  }, [scene]);

  const [x, y, z] = worker.location3D;
  const isDanger = worker.status === 'DANGER';
  const isWarning = worker.status === 'WARNING';

  // Ring pulse animation for infraction target
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ringRef.current && isDanger) {
      const t = clock.getElapsedTime();
      const scale = 1 + 0.3 * Math.sin(t * 4);
      ringRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group
      ref={groupRef}
      position={[x, y, z]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* 3D Worker Avatar */}
      <primitive object={clonedWorker} />

      {/* Floor Status Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
        <ringGeometry args={[0.6, 0.75, 32]} />
        <meshBasicMaterial
          color={isDanger ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981'}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Dynamic Pulsing Halo for Critical Violations */}
      {isDanger && (
        <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.09, 0]}>
          <ringGeometry args={[0.75, 1.1, 32]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.35} />
        </mesh>
      )}

      {/* Floating 3D HTML SCADA Marker */}
      <Html
        position={[0, 2.3, 0]}
        center
        distanceFactor={28}
        style={{ pointerEvents: 'auto', cursor: 'pointer' }}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transform: isSelected ? 'scale(1.15)' : 'scale(1)',
            transition: 'transform 0.15s ease-out',
          }}
        >
          {isDanger && (
            <div style={{
              backgroundColor: '#160808',
              border: '1.5px solid #ef4444',
              color: '#ef4444',
              padding: '2px 6px',
              borderRadius: '2px',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 800,
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginBottom: '3px',
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                boxShadow: '0 0 6px #ef4444',
              }} />
              <span>⚠ NO HELMET</span>
            </div>
          )}

          <div style={{
            backgroundColor: isSelected ? 'var(--color-cyan)' : 'rgba(16, 19, 25, 0.9)',
            color: isSelected ? '#000' : 'var(--color-text-main)',
            border: `1px solid ${isSelected ? 'var(--color-cyan)' : isDanger ? '#ef4444' : 'var(--color-border)'}`,
            padding: '2px 6px',
            borderRadius: '2px',
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <span>{worker.id}</span>
            <span style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              backgroundColor: isDanger ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981',
            }} />
          </div>
        </div>
      </Html>
    </group>
  );
}

// ==========================================
// 3. WORK ZONE BOUNDARY OVERLAYS
// ==========================================
function ZoneBoundaryOverlay({
  zone,
  isSelected,
  onClick,
}: {
  zone: WorkZone;
  isSelected: boolean;
  onClick: () => void;
}) {
  const { xMin, xMax, zMin, zMax } = zone.bounds;
  const width = xMax - xMin;
  const depth = zMax - zMin;
  const centerX = (xMin + xMax) / 2;
  const centerZ = (zMin + zMax) / 2;

  const isCritical = zone.riskLevel === 'CRITICAL';
  const color = zone.color;

  return (
    <group position={[centerX, 0.04, centerZ]} onClick={onClick}>
      {/* Floor Zone Projection */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected ? 0.18 : 0.06}
          depthWrite={false}
        />
      </mesh>

      {/* Zone Outline Box */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(width, 0.1, depth)]} />
        <lineBasicMaterial
          color={color}
          linewidth={isSelected ? 2 : 1}
          transparent
          opacity={0.8}
        />
      </lineSegments>

      {/* Floating Zone Tag */}
      <Html position={[0, 0.5, -depth / 2 + 1]} center distanceFactor={35}>
        <div
          style={{
            backgroundColor: isSelected ? color : 'rgba(11, 14, 20, 0.85)',
            color: isSelected ? '#000' : color,
            border: `1px solid ${color}`,
            borderRadius: '2px',
            padding: '2px 6px',
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            fontWeight: 800,
            letterSpacing: '0.05em',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <span style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            backgroundColor: color,
          }} />
          <span>{zone.code} • {zone.name.split(' ')[0].toUpperCase()}</span>
          {isCritical && <span>⚠</span>}
        </div>
      </Html>
    </group>
  );
}

// ==========================================
// 4. SURVEILLANCE CAMERA MAST & FRUSTUM FOV
// ==========================================
function CameraSensorRig({
  position,
  label,
  isRecording = true,
}: {
  position: [number, number, number];
  label: string;
  isRecording?: boolean;
}) {
  return (
    <group position={position}>
      {/* Mast */}
      <mesh position={[0, -2, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 4, 8]} />
        <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Camera head */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.25, 12, 12]} />
        <meshStandardMaterial color="#0ea5e9" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* HTML Camera Tag */}
      <Html position={[0, 0.5, 0]} center distanceFactor={32}>
        <div style={{
          backgroundColor: '#030712',
          border: '1px solid #0ea5e9',
          color: '#0ea5e9',
          padding: '1px 5px',
          borderRadius: '2px',
          fontFamily: 'var(--font-mono)',
          fontSize: '8px',
          fontWeight: 700,
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          {isRecording && (
            <span style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: '#ef4444',
            }} />
          )}
          <span>{label}</span>
        </div>
      </Html>
    </group>
  );
}

// ==========================================
// 5. CAMERA CONTROLLER HELPER
// ==========================================
function CameraController({
  cameraTarget,
  controlsRef,
}: {
  cameraTarget: [number, number, number] | null;
  controlsRef: React.RefObject<any>;
}) {
  const { camera } = useThree();

  useEffect(() => {
    if (cameraTarget && controlsRef.current) {
      const [tx, ty, tz] = cameraTarget;
      // Animate smoothly towards target
      controlsRef.current.target.set(tx, ty, tz);
      camera.position.set(tx + 18, 16, tz + 22);
      controlsRef.current.update();
    }
  }, [cameraTarget, camera, controlsRef]);

  return null;
}

// ==========================================
// 6. MAIN FACTORY SCENE CONTAINER
// ==========================================
export const FactoryScene: React.FC<FactorySceneProps> = ({
  workers,
  zones,
  selectedWorkerId,
  selectedZoneId,
  onSelectWorker,
  onSelectZone,
}) => {
  const controlsRef = useRef<any>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showWorkers, setShowWorkers] = useState(true);
  const [cameraTarget, setCameraTarget] = useState<[number, number, number] | null>(null);

  // Quick perspective pills
  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 2, 0);
      controlsRef.current.object.position.set(28, 22, 32);
      controlsRef.current.update();
    }
  };

  const handleIsoTop = () => {
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.object.position.set(0, 48, 0.1);
      controlsRef.current.update();
    }
  };

  const handleSector03Focus = () => {
    onSelectZone('zone-03');
    onSelectWorker('WRK-3651');
    setCameraTarget([-12, 0, 12]);
  };

  const handleBay04Focus = () => {
    onSelectZone('zone-04');
    setCameraTarget([14, 0, 14]);
  };

  const handleZoom = (delta: number) => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object as THREE.PerspectiveCamera;
      const factor = 1 + delta;
      camera.position.multiplyScalar(factor);
      controlsRef.current.update();
    }
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      backgroundColor: '#0a0d13',
      overflow: 'hidden',
    }}>
      {/* Top SCADA HUD Header Strip */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '32px',
        backgroundColor: 'rgba(25, 28, 34, 0.9)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--color-border-subtle)',
        padding: '0 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 20,
        userSelect: 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '6px',
              height: '6px',
              backgroundColor: 'var(--color-green)',
              boxShadow: '0 0 6px var(--color-green)',
            }} />
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 700,
              color: 'var(--color-text-main)',
              letterSpacing: '0.06em',
            }}>
              SCENE: FAB_MAIN_HALL_LVL1
            </span>
          </div>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            color: 'var(--color-text-subtle)',
          }}>
            ENGINE: WEBGL 2.0 (HARDWARE_ACCEL)
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          color: 'var(--color-text-subtle)',
        }}>
          <span>X: 042.81  Y: 104.12  Z: 012.00</span>
          <span style={{ color: 'var(--color-green)' }}>FRAME: 16.6ms • 60 FPS</span>
        </div>
      </div>

      {/* Floating Toolbar Controls */}
      <div style={{
        position: 'absolute',
        top: '40px',
        left: '12px',
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        backgroundColor: 'rgba(29, 32, 38, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '4px',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: '2px',
      }}>
        <button
          onClick={handleResetCamera}
          title="Reset Orbit & Pan"
          style={{
            padding: '5px',
            backgroundColor: 'var(--color-panel-elevated)',
            border: 'none',
            color: 'var(--color-cyan)',
            cursor: 'pointer',
            borderRadius: '2px',
          }}
        >
          <RotateCcw size={14} />
        </button>

        <button
          onClick={() => handleZoom(-0.15)}
          title="Zoom In"
          style={{
            padding: '5px',
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
          }}
        >
          <ZoomIn size={14} />
        </button>

        <button
          onClick={() => handleZoom(0.15)}
          title="Zoom Out"
          style={{
            padding: '5px',
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
          }}
        >
          <ZoomOut size={14} />
        </button>

        <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--color-border-subtle)', margin: '0 2px' }} />

        {/* Heatmap Layer Button */}
        <button
          onClick={() => setShowHeatmap(!showHeatmap)}
          style={{
            padding: '3px 8px',
            backgroundColor: showHeatmap ? 'var(--color-cyan)' : 'var(--color-panel)',
            color: showHeatmap ? '#000' : 'var(--color-text-muted)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: '2px',
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '0.05em',
          }}
        >
          HEATMAP: {showHeatmap ? 'ON' : 'OFF'}
        </button>

        {/* Workers Toggle Button */}
        <button
          onClick={() => setShowWorkers(!showWorkers)}
          style={{
            padding: '3px 8px',
            backgroundColor: showWorkers ? 'var(--color-panel-elevated)' : 'var(--color-panel)',
            color: showWorkers ? 'var(--color-green)' : 'var(--color-text-muted)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: '2px',
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '0.05em',
          }}
        >
          WORKERS ({workers.length})
        </button>
      </div>

      {/* Floating Perspective Quick-Pills */}
      <div style={{
        position: 'absolute',
        top: '40px',
        right: '12px',
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        <button
          onClick={handleIsoTop}
          style={{
            padding: '4px 8px',
            backgroundColor: 'rgba(39, 42, 48, 0.9)',
            border: '1px solid var(--color-border-subtle)',
            color: 'var(--color-text-main)',
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            fontWeight: 700,
            cursor: 'pointer',
            borderRadius: '2px',
            backdropFilter: 'blur(8px)',
          }}
        >
          [ISO TOP]
        </button>

        <button
          onClick={handleSector03Focus}
          style={{
            padding: '4px 8px',
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.6)',
            color: 'var(--color-red)',
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            fontWeight: 700,
            cursor: 'pointer',
            borderRadius: '2px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 0 10px rgba(239, 68, 68, 0.25)',
          }}
        >
          <span style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-red)',
          }} />
          [SECTOR 03 - FAB] ⚠
        </button>

        <button
          onClick={handleBay04Focus}
          style={{
            padding: '4px 8px',
            backgroundColor: 'rgba(39, 42, 48, 0.9)',
            border: '1px solid var(--color-border-subtle)',
            color: 'var(--color-text-main)',
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            fontWeight: 700,
            cursor: 'pointer',
            borderRadius: '2px',
          }}
        >
          [BAY 04 - DOCK]
        </button>
      </div>

      {/* 3D WebGL Canvas */}
      <Canvas
        camera={{ position: [28, 22, 32], fov: 42 }}
        shadows
        style={{ width: '100%', height: '100%' }}
      >
        <color attach="background" args={['#080c14']} />

        {/* Ambient & Directional Lighting */}
        <ambientLight intensity={0.65} color="#cbd5e1" />
        <directionalLight
          position={[25, 40, 25]}
          intensity={1.2}
          color="#f8fafc"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-15, 10, -15]} intensity={0.4} color="#38bdf8" />
        <pointLight position={[15, 10, 15]} intensity={0.4} color="#f59e0b" />

        {/* Industrial Ground Slab Grid */}
        <Grid
          args={[60, 60]}
          cellSize={1.5}
          cellThickness={0.6}
          cellColor="#1e293b"
          sectionSize={6}
          sectionThickness={1.2}
          sectionColor="#334155"
          fadeDistance={65}
          fadeStrength={1.5}
        />

        <CameraController cameraTarget={cameraTarget} controlsRef={controlsRef} />

        <Suspense fallback={
          <Html center>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'rgba(11, 14, 20, 0.95)',
              border: '1px solid var(--color-cyan)',
              padding: '12px 20px',
              borderRadius: '3px',
              color: 'var(--color-cyan)',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 700,
              boxShadow: '0 4px 20px rgba(0,0,0,0.8)',
            }}>
              <Activity size={18} className="animate-spin" />
              <span>INITIALIZING 3D INDUSTRIAL TWIN (GLTF)...</span>
            </div>
          </Html>
        }>
          {/* 1. Factory Model */}
          <FactoryModel showHeatmap={showHeatmap} />

          {/* 2. Work Zone Boundaries */}
          {zones.map((zone) => (
            <ZoneBoundaryOverlay
              key={zone.id}
              zone={zone}
              isSelected={selectedZoneId === zone.id}
              onClick={() => onSelectZone(zone.id)}
            />
          ))}

          {/* 3. Optical Sensor Surveillance Rigs */}
          <CameraSensorRig
            position={[-18, 5, 8]}
            label="CAM-04 [REC]"
            isRecording={true}
          />
          <CameraSensorRig
            position={[18, 5, -8]}
            label="CAM-02"
            isRecording={true}
          />

          {/* 4. Worker Instances */}
          {showWorkers &&
            workers.map((worker) => (
              <WorkerMesh
                key={worker.id}
                worker={worker}
                isSelected={selectedWorkerId === worker.id}
                onClick={() => {
                  onSelectWorker(worker.id);
                  onSelectZone(worker.zoneId);
                }}
              />
            ))}
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.06}
          maxPolarAngle={Math.PI / 2.05} // Prevent camera going below floor
          minDistance={8}
          maxDistance={75}
        />
      </Canvas>

      {/* Base Stream Status Bar */}
      <div style={{
        position: 'absolute',
        bottom: '8px',
        left: '12px',
        right: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pointerEvents: 'none',
        zIndex: 20,
      }}>
        <div style={{
          backgroundColor: 'rgba(25, 28, 34, 0.9)',
          backdropFilter: 'blur(8px)',
          padding: '4px 10px',
          borderRadius: '2px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid var(--color-border-subtle)',
        }}>
          <span style={{ width: '5px', height: '5px', backgroundColor: 'var(--color-green)' }} />
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            LIVE MESH OCCUPANCY: 18 / 20 IN SECTOR 3
          </span>
        </div>

        <div style={{
          backgroundColor: 'rgba(25, 28, 34, 0.9)',
          backdropFilter: 'blur(8px)',
          padding: '4px 10px',
          borderRadius: '2px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          border: '1px solid var(--color-border-subtle)',
        }}>
          <span style={{ color: 'var(--color-amber)' }}>LATENCY: 14ms</span>
          <span style={{ color: 'var(--color-text-dim)' }}>|</span>
          <span style={{ color: 'var(--color-green)' }}>BUFFER: STABLE</span>
        </div>
      </div>
    </div>
  );
};
