import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { ArthCharacter } from './ArthCharacter';
import { WorkshopWorkbench } from './WorkshopWorkbench';
import {
  Compass,
  RotateCw,
  Camera,
  Layers,
  Sparkles,
  Eye,
  Sliders,
  Maximize2,
  Box,
  Monitor,
  User,
  Wrench,
} from 'lucide-react';

export type CameraPreset =
  | 'front'
  | 'left'
  | 'right'
  | 'back'
  | 'top'
  | 'pc'
  | 'monitors'
  | 'character';

export type WorkshopQuality = 'cinematic' | 'balanced' | 'performance';

interface WorkshopCanvasProps {
  screwsTightened: boolean[];
  onScrewClick: (index: number) => void;
  isBooted: boolean;
  isAntiG: boolean;
  isTyping: boolean;
  isTightening: boolean;
  isCelebrating: boolean;
  isWaving: boolean;
}

// Camera Preset coordinates: [posX, posY, posZ, targetX, targetY, targetZ]
const PRESET_COORDS: Record<CameraPreset, [number, number, number, number, number, number]> = {
  front: [0.2, 0.4, 3.2, 0.2, 0, 0],
  left: [-2.8, 0.5, 0.6, -0.2, 0, 0],
  right: [2.8, 0.5, 0.6, 0.8, 0.1, 0],
  back: [0.2, 0.7, -2.4, 0.2, 0, 0],
  top: [0.2, 3.6, 0.2, 0.2, -0.2, 0],
  pc: [-0.2, 0.1, 1.45, -0.2, 0.05, 0.1],
  monitors: [1.0, 0.35, 1.45, 1.1, 0.2, -0.2],
  character: [-1.2, 0.5, 1.45, -1.2, 0.5, -0.4],
};

// Smooth Camera Controller component inside R3F
interface CameraControllerProps {
  activePreset: CameraPreset | null;
  controlsRef: React.RefObject<OrbitControlsImpl>;
  isAutoRotate: boolean;
  onUserInteracted: () => void;
  setCameraYaw: (yaw: number) => void;
}

const CameraController: React.FC<CameraControllerProps> = ({
  activePreset,
  controlsRef,
  isAutoRotate,
  onUserInteracted,
  setCameraYaw,
}) => {
  const { camera } = useThree();
  const targetPos = useRef<THREE.Vector3>(new THREE.Vector3(0.2, 0.4, 3.2));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0.2, 0, 0));
  const isTransitioning = useRef(false);

  useEffect(() => {
    if (activePreset && PRESET_COORDS[activePreset]) {
      const [px, py, pz, tx, ty, tz] = PRESET_COORDS[activePreset];
      targetPos.current.set(px, py, pz);
      targetLookAt.current.set(tx, ty, tz);
      isTransitioning.current = true;
    }
  }, [activePreset]);

  useFrame((_, delta) => {
    // 1. Smooth lerping during preset transitions
    if (isTransitioning.current) {
      camera.position.lerp(targetPos.current, delta * 4);
      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLookAt.current, delta * 4);
        controlsRef.current.update();
      }

      if (camera.position.distanceTo(targetPos.current) < 0.05) {
        isTransitioning.current = false;
      }
    }

    // 2. Track camera yaw for compass gizmo
    const azimuth = Math.atan2(camera.position.x, camera.position.z);
    setCameraYaw((azimuth * 180) / Math.PI);
  });

  return null;
};

export const WorkshopCanvas: React.FC<WorkshopCanvasProps> = ({
  screwsTightened,
  onScrewClick,
  isBooted,
  isAntiG,
  isTyping,
  isTightening,
  isCelebrating,
  isWaving,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredProp, setHoveredProp] = useState<string | null>(null);

  // 360 View Controls
  const [activePreset, setActivePreset] = useState<CameraPreset | null>('front');
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [isExploded, setIsExploded] = useState(false);
  const [quality, setQuality] = useState<WorkshopQuality>('cinematic');
  const [interactionMode, setInteractionMode] = useState<'orbit' | 'interact'>('orbit');
  const [cameraYaw, setCameraYaw] = useState(0);

  const controlsRef = useRef<OrbitControlsImpl>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Track mouse for character eye-tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Pause auto-rotate on interaction, resume after 3.5s
  const handleUserInteracted = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    setActivePreset(null); // Clear preset so user has free control

    if (isAutoRotate) {
      if (controlsRef.current) controlsRef.current.autoRotate = false;
      idleTimerRef.current = setTimeout(() => {
        if (controlsRef.current && isAutoRotate) {
          controlsRef.current.autoRotate = true;
        }
      }, 3500);
    }
  }, [isAutoRotate]);

  // Handle Hotspot Click
  const handleFocusSubject = (subject: 'pc' | 'monitors' | 'character' | 'tools') => {
    if (subject === 'pc') setActivePreset('pc');
    else if (subject === 'monitors') setActivePreset('monitors');
    else if (subject === 'character') setActivePreset('character');
    else if (subject === 'tools') setActivePreset('left');
  };

  return (
    <div className="w-full h-full min-h-[520px] lg:min-h-[640px] relative flex flex-col select-none">
      {/* ================= TOP CONTROLS & CAMERA PRESETS TOOLBAR ================= */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Camera Preset Quick Buttons */}
        <div className="flex items-center gap-1 bg-zinc-950/85 backdrop-blur-md p-1 rounded-xl border border-zinc-800 shadow-xl pointer-events-auto">
          <div className="px-2 py-1 text-[10px] font-mono text-zinc-400 font-bold uppercase flex items-center gap-1 border-r border-zinc-800 mr-1">
            <Camera className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">Views</span>
          </div>

          {[
            { id: 'front', label: 'Front', icon: Eye },
            { id: 'pc', label: 'PC Rig', icon: Box },
            { id: 'monitors', label: 'Monitors', icon: Monitor },
            { id: 'character', label: 'Arth', icon: User },
            { id: 'top', label: 'Top', icon: Layers },
            { id: 'back', label: 'Rear', icon: RotateCw },
          ].map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setActivePreset(preset.id as CameraPreset)}
              className={`px-2 py-1 rounded-lg text-[11px] font-mono transition-all flex items-center gap-1 ${
                activePreset === preset.id
                  ? 'bg-cyan-500/25 border border-cyan-400 text-cyan-300 font-bold shadow-[0_0_10px_rgba(0,247,255,0.3)]'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80 border border-transparent'
              }`}
              title={`Switch camera to ${preset.label}`}
            >
              <preset.icon className="w-3 h-3" />
              <span>{preset.label}</span>
            </button>
          ))}
        </div>

        {/* Right: Mode & View Toggles */}
        <div className="flex items-center gap-1 bg-zinc-950/85 backdrop-blur-md p-1 rounded-xl border border-zinc-800 shadow-xl pointer-events-auto">
          {/* Exploded View Toggle */}
          <button
            type="button"
            onClick={() => setIsExploded(!isExploded)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all flex items-center gap-1.5 ${
              isExploded
                ? 'bg-purple-500/25 border border-purple-400 text-purple-300 font-bold shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80 border border-transparent'
            }`}
            title="Separate PC components in 3D space"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Exploded: {isExploded ? 'ON' : 'OFF'}</span>
          </button>

          {/* 360 Auto-Rotate Toggle */}
          <button
            type="button"
            onClick={() => {
              const next = !isAutoRotate;
              setIsAutoRotate(next);
              if (controlsRef.current) controlsRef.current.autoRotate = next;
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all flex items-center gap-1.5 ${
              isAutoRotate
                ? 'bg-cyan-500/25 border border-cyan-400 text-cyan-300 font-bold shadow-[0_0_10px_rgba(0,247,255,0.3)]'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80 border border-transparent'
            }`}
            title="Toggle continuous 360° turntable spin"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoRotate ? 'animate-spin' : ''}`} />
            <span>360° Spin</span>
          </button>

          {/* Quality Selector */}
          <div className="relative group">
            <button
              type="button"
              className="px-2 py-1 rounded-lg text-[11px] font-mono text-zinc-300 bg-zinc-900 border border-zinc-700 hover:border-cyan-400 transition-colors flex items-center gap-1"
              title="Manual quality mode"
            >
              <Sliders className="w-3 h-3 text-cyan-400" />
              <span className="uppercase">{quality}</span>
            </button>
            <div className="absolute top-full right-0 mt-1 hidden group-hover:flex flex-col gap-1 bg-zinc-950 border border-zinc-800 rounded-lg p-1 shadow-2xl z-50 min-w-[110px]">
              {(['cinematic', 'balanced', 'performance'] as WorkshopQuality[]).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQuality(q)}
                  className={`px-2 py-1 rounded text-left text-[10px] font-mono uppercase transition-colors ${
                    quality === q
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= 3D CANVAS VIEWPORT ================= */}
      <div className="flex-1 w-full h-full relative">
        <Canvas
          shadows={quality !== 'performance'}
          gl={{
            antialias: true,
            alpha: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.35,
            powerPreference: 'high-performance',
          }}
          className="w-full h-full"
        >
          <PerspectiveCamera makeDefault position={[0.2, 0.4, 3.2]} fov={42} />

          {/* Full 360 Orbit Controls */}
          <OrbitControls
            ref={controlsRef}
            enableZoom={true}
            minDistance={1.2}
            maxDistance={6.8}
            minPolarAngle={0.05}
            maxPolarAngle={Math.PI / 2 - 0.04} // Clamped above floor
            minAzimuthAngle={-Infinity} // Full 360° horizontal rotation
            maxAzimuthAngle={Infinity}
            enablePan={true}
            enableDamping={true}
            dampingFactor={0.05}
            autoRotate={isAutoRotate}
            autoRotateSpeed={1.0}
            onStart={handleUserInteracted}
          />

          {/* Camera Controller for animated fly-to transitions */}
          <CameraController
            activePreset={activePreset}
            controlsRef={controlsRef}
            isAutoRotate={isAutoRotate}
            onUserInteracted={handleUserInteracted}
            setCameraYaw={setCameraYaw}
          />

          {/* ================= LIGHTING & ATMOSPHERE ================= */}
          {/* Subtle Hemisphere light ensures shadows are never pitch-black */}
          <hemisphereLight color="#cbd5e1" groundColor="#0f172a" intensity={0.9} />

          {/* Warm Key Spotlight directly on the PC and workbench */}
          <spotLight
            position={[-0.4, 2.2, 1.2]}
            angle={0.75}
            penumbra={0.65}
            intensity={3.4}
            color="#fef3c7"
            castShadow={quality !== 'performance'}
            shadow-mapSize={[1024, 1024]}
          />

          {/* Soft Cool Fill Light */}
          <pointLight position={[2.0, 1.2, 0.8]} color="#38bdf8" intensity={1.6} distance={5.0} />

          {/* Neon Rim & Accent Lights */}
          <pointLight position={[-2.2, 0.6, -0.6]} color="#c084fc" intensity={1.4} distance={4.5} />
          <pointLight position={[0.4, 1.8, -1.2]} color="#00f7ff" intensity={1.8} distance={4.0} />
          {/* Rear Fill Light for 360 view */}
          <pointLight position={[0.2, 1.2, -2.2]} color="#38bdf8" intensity={2.0} distance={5.0} />

          {/* Environment Map for PBR specular reflections */}
          {quality !== 'performance' && <Environment preset="city" />}

          {/* ================= 3D SCENE OBJECTS ================= */}
          <ArthCharacter
            mousePos={mousePos}
            isWaving={isWaving}
            isTightening={isTightening}
            isCelebrating={isCelebrating}
            isTyping={isTyping}
          />

          <WorkshopWorkbench
            screwsTightened={screwsTightened}
            onScrewClick={onScrewClick}
            isBooted={isBooted}
            isAntiG={isAntiG}
            isExploded={isExploded}
            interactionMode={interactionMode}
            hoveredProp={hoveredProp}
            setHoveredProp={setHoveredProp}
            onFocusSubject={handleFocusSubject}
          />
        </Canvas>

        {/* ================= BOTTOM CANVAS OVERLAYS ================= */}
        {/* Compass / Orientation Gizmo */}
        <div className="absolute bottom-3 right-3 bg-zinc-950/85 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-zinc-800 shadow-xl flex items-center gap-2 pointer-events-none font-mono text-[11px] text-zinc-400">
          <div
            className="w-4 h-4 rounded-full border border-cyan-400/50 flex items-center justify-center text-[8px] font-bold text-cyan-300"
            style={{ transform: `rotate(${-cameraYaw}deg)` }}
          >
            ▲
          </div>
          <span>{Math.round((cameraYaw + 360) % 360)}° YAW</span>
        </div>

        {/* Orbit & Interaction Hint (Always 100% visible, never covered by HUD) */}
        <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-zinc-800 text-[11px] font-mono text-zinc-300 pointer-events-none flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Drag to orbit 360° &bull; Scroll to zoom &bull; Click screws to fasten</span>
        </div>
      </div>
    </div>
  );
};
