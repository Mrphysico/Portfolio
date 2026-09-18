import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { DimensionKey } from '../../hooks/useDimensionScroll';
import { TierConfig } from '../../hooks/useTierDetection';
import { ParticleSystem } from './ParticleSystem';
import { RigModel } from './RigModel';
import { TesseractScene } from '../tesseract/TesseractScene';
import { SingularityScene } from './SingularityScene';

interface DimensionCanvasProps {
  currentDimension: DimensionKey;
  dimensionProgress: number;
  overallProgress: number;
  tierConfig: TierConfig;
  isAntiGravity: boolean;
}

export const DimensionCanvas: React.FC<DimensionCanvasProps> = ({
  currentDimension,
  dimensionProgress,
  overallProgress,
  tierConfig,
  isAntiGravity,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalized coordinates (-1.0 to 1.0)
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        frameloop={currentDimension === 'Singularity' ? 'never' : 'always'}
        dpr={tierConfig.dpr}
        gl={{
          antialias: tierConfig.tier !== 'LITE' && tierConfig.tier !== 'STATIC',
          powerPreference: 'high-performance',
          alpha: true,
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 7.5]} fov={50} />

        {/* Cinematic Multi-Color Space Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} color="#00f7ff" />
        <directionalLight position={[-5, -8, -5]} intensity={1.0} color="#ff7700" />
        <pointLight position={[0, 0, 2]} intensity={2.0} color="#a855f7" distance={10} />

        {/* 1. GPU / Compute Particle System (0D to 4D to Singularity) */}
        <ParticleSystem
          currentDimension={currentDimension}
          dimensionProgress={dimensionProgress}
          tierConfig={tierConfig}
          mousePos={mousePos}
          isAntiGravity={isAntiGravity}
        />

        {/* 2. Hero 3D Gaming PC Rig (RigForge - Visible in 4D) */}
        <RigModel
          progress={dimensionProgress}
          visible={currentDimension === '4D'}
        />

        {/* 3. True 4D Tesseract & Polytopes (Visible in 4D) */}
        <TesseractScene
          progress={dimensionProgress}
          visible={currentDimension === '4D'}
        />

        {/* 4. Gravitational Lensing Singularity (Visible in Singularity chapter) */}
        <SingularityScene
          progress={dimensionProgress}
          visible={currentDimension === 'Singularity'}
        />
      </Canvas>
    </div>
  );
};
