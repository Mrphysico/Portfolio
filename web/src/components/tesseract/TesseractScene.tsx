import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  generateTesseract,
  generate5Cell,
  generate24Cell,
  computeRotation4D,
  mat4MulVec4,
  project4Dto3D,
  Polytope,
} from '../../wasm/wasmEngine';

interface TesseractSceneProps {
  progress: number;
  visible: boolean;
}

export const TesseractScene: React.FC<TesseractSceneProps> = ({ progress, visible }) => {
  const lineSegmentsRef = useRef<THREE.LineSegments>(null);
  const [activePolytopeType, setActivePolytopeType] = useState<'tesseract' | '5cell' | '24cell'>('tesseract');

  const polytope: Polytope = useMemo(() => {
    if (activePolytopeType === '5cell') return generate5Cell(2.2);
    if (activePolytopeType === '24cell') return generate24Cell(2.0);
    return generateTesseract(2.0);
  }, [activePolytopeType]);

  // Buffer geometry for dynamic line segments
  const { linePositions, lineColors } = useMemo(() => {
    const numEdges = polytope.edges.length;
    const pos = new Float32Array(numEdges * 2 * 3);
    const col = new Float32Array(numEdges * 2 * 3);

    for (let i = 0; i < numEdges * 2; i++) {
      const i3 = i * 3;
      col[i3] = 0.0;     // R
      col[i3 + 1] = 0.97; // G
      col[i3 + 2] = 1.0;  // B (Cyan)
    }

    return { linePositions: pos, lineColors: col };
  }, [polytope]);

  useFrame((state, delta) => {
    if (!visible || !lineSegmentsRef.current) return;

    const time = state.clock.getElapsedTime();

    // 6-Plane 4D Rotation Angles (Driven by time and scroll progress)
    const angleXY = time * 0.4 + progress * 2.0;
    const angleXZ = time * 0.3;
    const angleYZ = time * 0.2;
    const angleXW = time * 0.6 + progress * 3.0; // 4D rotation!
    const angleYW = time * 0.5;                  // 4D rotation!
    const angleZW = time * 0.4;                  // 4D rotation!

    // Compute compound 4D rotation matrix
    const rotMat = computeRotation4D(angleXY, angleXZ, angleYZ, angleXW, angleYW, angleZW);

    // Transform and project 4D vertices into 3D
    const projectedVerts = polytope.vertices.map((v4) => {
      const rotV4 = mat4MulVec4(rotMat, v4);
      return project4Dto3D(rotV4, 3.2); // Camera distance d = 3.2
    });

    // Update edge line vertices in buffer
    const geo = lineSegmentsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const posArr = posAttr.array as Float32Array;

    for (let e = 0; e < polytope.edges.length; e++) {
      const [idxA, idxB] = polytope.edges[e];
      const pA = projectedVerts[idxA];
      const pB = projectedVerts[idxB];

      const base = e * 6;
      posArr[base] = pA[0];
      posArr[base + 1] = pA[1];
      posArr[base + 2] = pA[2];

      posArr[base + 3] = pB[0];
      posArr[base + 4] = pB[1];
      posArr[base + 5] = pB[2];
    }

    posAttr.needsUpdate = true;
  });

  if (!visible) return null;

  return (
    <group position={[0, 0, 0]}>
      {/* 4D Polytope Wireframe Edges */}
      <lineSegments ref={lineSegmentsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[lineColors, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.85}
          linewidth={2}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Internal central hyper-sphere glow */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#a855f7" wireframe transparent opacity={0.3} />
      </mesh>
    </group>
  );
};
