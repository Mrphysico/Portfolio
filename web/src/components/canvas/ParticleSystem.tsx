import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DimensionKey } from '../../hooks/useDimensionScroll';
import { TierConfig } from '../../hooks/useTierDetection';

interface ParticleSystemProps {
  currentDimension: DimensionKey;
  dimensionProgress: number;
  tierConfig: TierConfig;
  mousePos: { x: number; y: number };
  isAntiGravity: boolean;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  currentDimension,
  dimensionProgress,
  tierConfig,
  mousePos,
  isAntiGravity,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = tierConfig.particleCount;

  // Initialize particle positions and target geometries
  const { positions, basePositions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const basePos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Random sphere distribution
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 8;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      pos[i3] = x;
      pos[i3 + 1] = y;
      pos[i3 + 2] = z;

      basePos[i3] = x;
      basePos[i3 + 1] = y;
      basePos[i3 + 2] = z;

      // High-tech Cyan/Purple/Orange spectrum
      const colorMix = Math.random();
      if (colorMix < 0.6) {
        col[i3] = 0.0;     // R
        col[i3 + 1] = 0.97; // G
        col[i3 + 2] = 1.0;  // B (Cyan)
      } else if (colorMix < 0.85) {
        col[i3] = 0.66;    // R
        col[i3 + 1] = 0.33; // G
        col[i3 + 2] = 0.97; // B (Purple)
      } else {
        col[i3] = 1.0;     // R
        col[i3 + 1] = 0.47; // G
        col[i3 + 2] = 0.0;  // B (Solar Flare)
      }
    }

    return { positions: pos, basePositions: basePos, colors: col };
  }, [count]);

  // Frame loop: compute curl-noise drift, shape morphing, and cursor gravity well
  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const geometry = pointsRef.current.geometry;
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const posArr = posAttr.array as Float32Array;

    const time = state.clock.getElapsedTime();
    const gravityFactor = isAntiGravity ? -1.0 : 1.0;
    const mx = mousePos.x * 5;
    const my = mousePos.y * 5;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      let bx = basePositions[i3];
      let by = basePositions[i3 + 1];
      let bz = basePositions[i3 + 2];

      // Dimensional Shape Morphing Targets
      let targetX = bx;
      let targetY = by;
      let targetZ = bz;

      if (currentDimension === '0D') {
        // 0D Point: collapse tightly to origin with slight quantum jitter
        targetX = (bx * 0.02) + Math.sin(time * 5 + i) * 0.05;
        targetY = (by * 0.02) + Math.cos(time * 5 + i) * 0.05;
        targetZ = (bz * 0.02);
      } else if (currentDimension === '1D') {
        // 1D Line: collapse Y and Z onto horizontal X-axis laser line
        targetX = bx * 1.8;
        targetY = Math.sin(bx * 3.0 + time * 2.0) * 0.15;
        targetZ = 0.0;
      } else if (currentDimension === '2D') {
        // 2D Plane: flatten Z onto XY origami plane with wave ripples
        targetX = bx * 1.2;
        targetY = by * 1.2;
        targetZ = Math.sin(bx * 2.0 + by * 2.0 + time * 1.5) * 0.2;
      } else if (currentDimension === '3D') {
        // 3D Space: highway grid and street volume
        targetX = bx * 1.1;
        targetY = by * 0.8;
        targetZ = bz * 1.1;
      } else if (currentDimension === '4D') {
        // 4D Hyperspace: hypercube cage rotation and rig particles
        const angle = time * 0.4;
        targetX = bx * Math.cos(angle) - bz * Math.sin(angle);
        targetY = by + Math.sin(time + bx) * 0.3;
        targetZ = bx * Math.sin(angle) + bz * Math.cos(angle);
      } else if (currentDimension === 'Singularity') {
        // Singularity: spiral into black hole event horizon
        const dist = Math.hypot(bx, by);
        const spiralAngle = time * 2.0 + (1.0 / (dist + 0.1)) * 3.0;
        const spiralRadius = Math.max(0.1, dist * 0.4);
        targetX = Math.cos(spiralAngle) * spiralRadius;
        targetY = Math.sin(spiralAngle) * spiralRadius;
        targetZ = (bz * 0.1) * Math.sin(spiralAngle);
      }

      // Cursor gravity well (attracts or repels)
      const dx = mx - posArr[i3];
      const dy = my - posArr[i3 + 1];
      const distToMouse = Math.hypot(dx, dy);

      let mouseForceX = 0;
      let mouseForceY = 0;
      if (distToMouse < 2.5) {
        const force = (1.0 - distToMouse / 2.5) * 1.8 * gravityFactor;
        mouseForceX = (dx / (distToMouse + 0.01)) * force;
        mouseForceY = (dy / (distToMouse + 0.01)) * force;
      }

      // Smooth lerp toward target position
      const lerpSpeed = Math.min(delta * 4.0, 0.2);
      posArr[i3] += (targetX + mouseForceX - posArr[i3]) * lerpSpeed;
      posArr[i3 + 1] += (targetY + mouseForceY - posArr[i3 + 1]) * lerpSpeed;
      posArr[i3 + 2] += (targetZ - posArr[i3 + 2]) * lerpSpeed;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={tierConfig.tier === 'ULTRA' ? 0.035 : 0.045}
        vertexColors
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
