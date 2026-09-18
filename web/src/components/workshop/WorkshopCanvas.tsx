import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { ArthCharacter } from './ArthCharacter';
import { WorkshopWorkbench } from './WorkshopWorkbench';

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="w-full h-full min-h-[500px] lg:min-h-[620px] relative">
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        className="w-full h-full"
      >
        <PerspectiveCamera makeDefault position={[0.2, 0.4, 3.4]} fov={42} />

        {/* Orbit controls with careful constraints so visitor can inspect but not clip */}
        <OrbitControls
          enableZoom={true}
          minDistance={1.8}
          maxDistance={5.0}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2 + 0.05}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
          enablePan={false}
          dampingFactor={0.05}
        />

        {/* Ambient & Atmosphere Lights */}
        <ambientLight intensity={0.4} color="#0f172a" />

        {/* Warm Desk Overhead Lamp */}
        <spotLight
          position={[-0.8, 1.6, 0.8]}
          angle={0.7}
          penumbra={0.6}
          intensity={2.8}
          color="#fed7aa"
          castShadow
        />

        {/* Neon Cyberpunk Fill Lights */}
        <pointLight position={[1.5, 0.8, 0.5]} color="#00f7ff" intensity={1.5} distance={4} />
        <pointLight position={[-1.8, 0.2, -0.5]} color="#818cf8" intensity={1.2} distance={3.5} />
        <pointLight
          position={[0, 0.2, 0.2]}
          color={isBooted ? '#00f7ff' : '#ec4899'}
          intensity={isBooted ? 2.5 : 1.0}
          distance={2}
        />

        {/* 3D Stylized Character: Arth */}
        <ArthCharacter
          mousePos={mousePos}
          isWaving={isWaving}
          isTightening={isTightening}
          isCelebrating={isCelebrating}
          isTyping={isTyping}
        />

        {/* Cyberpunk Workbench & Props */}
        <WorkshopWorkbench
          screwsTightened={screwsTightened}
          onScrewClick={onScrewClick}
          isBooted={isBooted}
          isAntiG={isAntiG}
          hoveredProp={hoveredProp}
          setHoveredProp={setHoveredProp}
        />
      </Canvas>

      {/* Orbit Hint Helper */}
      <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm border border-zinc-800 text-[10px] font-mono text-zinc-400 pointer-events-none flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
        <span>Drag to rotate scene &bull; Click screws to assemble</span>
      </div>
    </div>
  );
};
