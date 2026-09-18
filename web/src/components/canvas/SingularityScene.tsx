import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BlackHoleLensingShader } from './Shaders/LensingShader';

interface SingularitySceneProps {
  progress: number;
  visible: boolean;
}

export const SingularityScene: React.FC<SingularitySceneProps> = ({ progress, visible }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (!visible || !materialRef.current) return;
    materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    materialRef.current.uniforms.uIntensity.value = Math.min(1.0, progress * 1.2);
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
