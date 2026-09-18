import React, { useMemo, useRef, useEffect } from 'react';
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

const DIMENSION_MAP: Record<DimensionKey, number> = {
  '0D': 0,
  '1D': 1,
  '2D': 2,
  '3D': 3,
  '4D': 4,
  'Singularity': 5,
};

const vertexShader = /* glsl */ `
  attribute vec3 aRandom;
  uniform float uTime;
  uniform float uDimension;
  uniform float uDimensionProgress;
  uniform vec2 uMouse;
  uniform float uAntiGravity;
  uniform float uPointSize;

  varying vec3 vColor;

  void main() {
    vColor = color;
    vec3 bp = position;

    // 0D Point: collapse tightly to origin with slight quantum jitter
    vec3 p0 = (bp * 0.02) + vec3(
      sin(uTime * 5.0 + aRandom.x * 6.28318) * 0.05,
      cos(uTime * 5.0 + aRandom.y * 6.28318) * 0.05,
      bp.z * 0.02
    );

    // 1D Line: collapse Y and Z onto horizontal X-axis laser line
    vec3 p1 = vec3(
      bp.x * 1.8,
      sin(bp.x * 3.0 + uTime * 2.0) * 0.15,
      0.0
    );

    // 2D Plane: flatten Z onto XY origami plane with wave ripples
    vec3 p2 = vec3(
      bp.x * 1.2,
      bp.y * 1.2,
      sin(bp.x * 2.0 + bp.y * 2.0 + uTime * 1.5) * 0.2
    );

    // 3D Space: highway grid and street volume
    vec3 p3 = vec3(
      bp.x * 1.1,
      bp.y * 0.8,
      bp.z * 1.1
    );

    // 4D Hyperspace: hypercube cage rotation and rig particles
    float angle = uTime * 0.4;
    vec3 p4 = vec3(
      bp.x * cos(angle) - bp.z * sin(angle),
      bp.y + sin(uTime + bp.x) * 0.3,
      bp.x * sin(angle) + bp.z * cos(angle)
    );

    // Singularity: spiral into black hole event horizon
    float dist = length(bp.xy);
    float spiralAngle = uTime * 2.0 + (1.0 / (dist + 0.1)) * 3.0;
    float spiralRadius = max(0.1, dist * 0.4);
    vec3 p5 = vec3(
      cos(spiralAngle) * spiralRadius,
      sin(spiralAngle) * spiralRadius,
      (bp.z * 0.1) * sin(spiralAngle)
    );

    // Select target based on active dimension
    vec3 target = p0;
    if (uDimension < 0.5) {
      target = p0;
    } else if (uDimension < 1.5) {
      target = mix(p0, p1, uDimensionProgress);
    } else if (uDimension < 2.5) {
      target = mix(p1, p2, uDimensionProgress);
    } else if (uDimension < 3.5) {
      target = mix(p2, p3, uDimensionProgress);
    } else if (uDimension < 4.5) {
      target = mix(p3, p4, uDimensionProgress);
    } else {
      target = mix(p4, p5, uDimensionProgress);
    }

    // Cursor gravity well
    vec2 m = uMouse * 5.0;
    float distToMouse = length(m - target.xy);
    if (distToMouse < 2.5) {
      float force = (1.0 - distToMouse / 2.5) * 1.8 * uAntiGravity;
      vec2 dir = normalize(m - target.xy + vec2(0.0001));
      target.xy += dir * force;
    }

    vec4 mvPosition = modelViewMatrix * vec4(target, 1.0);
    gl_PointSize = uPointSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;

  void main() {
    // Soft circular particle shape
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;
    float alpha = smoothstep(0.5, 0.05, dist) * 0.85;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

const MAX_PARTICLES = 1_000_000;

// Stable helper to allocate maximum particle buffers once
const createParticleBuffers = (count: number) => {
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const rnd = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    // Random sphere distribution
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = Math.cbrt(Math.random()) * 8;

    pos[i3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i3 + 2] = r * Math.cos(phi);

    rnd[i3] = Math.random();
    rnd[i3 + 1] = Math.random();
    rnd[i3 + 2] = Math.random();

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

  return { positions: pos, colors: col, randoms: rnd };
};

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  currentDimension,
  dimensionProgress,
  tierConfig,
  mousePos,
  isAntiGravity,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const elapsedRef = useRef(0);

  // Allocate 1M particle buffers ONCE and keep them forever
  const buffers = useMemo(() => createParticleBuffers(MAX_PARTICLES), []);

  // Stable uniforms object created ONCE - never recreated on quality changes
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDimension: { value: 0 },
      uDimensionProgress: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uAntiGravity: { value: 1.0 },
      uPointSize: { value: tierConfig.tier === 'ULTRA' ? 0.035 : 0.045 },
    }),
    [] // Empty dependency array: NEVER recreated!
  );

  // Update drawRange dynamically whenever particleCount changes without recreating geometry
  useEffect(() => {
    if (geometryRef.current) {
      const activeCount = Math.min(tierConfig.particleCount, MAX_PARTICLES);
      geometryRef.current.setDrawRange(0, activeCount);
    }
  }, [tierConfig.particleCount]);

  // Update point size uniform when tier changes without recreating uniforms object
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uPointSize.value = tierConfig.tier === 'ULTRA' ? 0.035 : 0.045;
    }
  }, [tierConfig.tier]);

  // Fast uniform updates in RAF loop - 0 CPU math, 0 buffer re-uploads, smooth continuous time
  useFrame((_, delta) => {
    try {
      if (!materialRef.current) return;
      const u = materialRef.current.uniforms;

      // Only pause time advancement in STATIC mode (preserves time position)
      if (tierConfig.tier !== 'STATIC') {
        const clampedDelta = Math.min(delta, 0.1);
        elapsedRef.current += clampedDelta;
      }

      u.uTime.value = elapsedRef.current;
      u.uDimension.value = DIMENSION_MAP[currentDimension] ?? 0;
      u.uDimensionProgress.value = dimensionProgress;
      u.uMouse.value.set(mousePos.x, mousePos.y);
      u.uAntiGravity.value = isAntiGravity ? -1.0 : 1.0;
    } catch (err) {
      console.error('[ParticleSystem useFrame error]', err);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry
        ref={geometryRef}
        drawRange={{ start: 0, count: Math.min(tierConfig.particleCount, MAX_PARTICLES) }}
      >
        <bufferAttribute
          attach="attributes-position"
          args={[buffers.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[buffers.colors, 3]}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          args={[buffers.randoms, 3]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        vertexColors
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
