import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BlackHoleLensingShader } from './Shaders/LensingShader';
import { TierConfig } from '../../hooks/useTierDetection';

interface SingularitySceneProps {
  progress: number;
  visible: boolean;
  tierConfig?: TierConfig;
}

export const SingularityScene: React.FC<SingularitySceneProps> = ({ progress, visible, tierConfig }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const elapsedRef = useRef(0);

  useFrame((_, delta) => {
    try {
      if (!visible || !materialRef.current) return;
      // Only pause uTime advancement if tier is explicitly STATIC
      if (tierConfig?.tier !== 'STATIC') {
        const clampedDelta = Math.min(delta, 0.1);
        elapsedRef.current += clampedDelta;
      }
      materialRef.current.uniforms.uTime.value = elapsedRef.current;
      materialRef.current.uniforms.uIntensity.value = Math.min(1.0, progress * 1.2);
    } catch (err) {
      console.error('[SingularityScene useFrame error]', err);
    }
  });

  if (!visible) return null;

  return (
    <group position={[0, 0, 0]}>
      {/* Gravitational Lensing & Accretion Disk Shader Quad */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <planeGeometry args={[7, 7]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={BlackHoleLensingShader.vertexShader}
          fragmentShader={BlackHoleLensingShader.fragmentShader}
          uniforms={BlackHoleLensingShader.uniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Central Black Hole Core Sphere (Pure Black Absorber) */}
      <mesh position={[0, 0, 0.05]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Outer Photon Sphere Ring */}
      <mesh position={[0, 0, 0.02]} rotation={[0, 0, 0]}>
        <ringGeometry args={[0.38, 0.46, 64]} />
        <meshBasicMaterial color="#00f7ff" transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};
