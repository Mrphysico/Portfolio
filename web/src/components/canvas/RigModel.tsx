import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RigModelProps {
  progress: number;
  visible: boolean;
}

export const RigModel: React.FC<RigModelProps> = ({ progress, visible }) => {
  const groupRef = useRef<THREE.Group>(null);
  const gpuFan1Ref = useRef<THREE.Mesh>(null);
  const gpuFan2Ref = useRef<THREE.Mesh>(null);
  const gpuFan3Ref = useRef<THREE.Mesh>(null);
  const cpuFanRef = useRef<THREE.Mesh>(null);

  // Inverted explosion factor: 1.0 = fully exploded, 0.0 = fully assembled
  // Progress 0.0 -> 1.0 in 4D chapter assembles the rig!
  const explodeFactor = Math.max(0, 1.0 - progress * 1.5);

  useFrame((state, delta) => {
    if (!visible || !groupRef.current) return;

    // Gentle floating rotation
    groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.25;

    // Rotate GPU & CPU cooler fans
    const fanSpeed = delta * 12.0;
    if (gpuFan1Ref.current) gpuFan1Ref.current.rotation.z += fanSpeed;
    if (gpuFan2Ref.current) gpuFan2Ref.current.rotation.z += fanSpeed;
    if (gpuFan3Ref.current) gpuFan3Ref.current.rotation.z += fanSpeed;
    if (cpuFanRef.current) cpuFanRef.current.rotation.z += fanSpeed * 1.4;
  });

  if (!visible) return null;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 1. PC Case Chassis Frame (Dark Brushed Aluminum) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.2, 3.6, 1.8]} />
        <meshStandardMaterial
          color="#0b132b"
          metalness={0.8}
          roughness={0.2}
          wireframe={explodeFactor > 0.4}
          transparent
          opacity={explodeFactor > 0.6 ? 0.3 : 0.85}
        />
      </mesh>

      {/* 2. Motherboard PCB (ATX with glowing circuit traces) */}
      <group position={[0, 0, -0.6 * (1.0 + explodeFactor * 2.0)]}>
        <mesh>
          <boxGeometry args={[2.4, 3.0, 0.08]} />
          <meshStandardMaterial color="#060b18" metalness={0.6} roughness={0.4} />
        </mesh>
        {/* Glowing PCB Traces */}
        <mesh position={[0, 0, 0.05]}>
          <planeGeometry args={[2.2, 2.8]} />
          <meshBasicMaterial color="#00f7ff" wireframe transparent opacity={0.4} />
        </mesh>
      </group>

      {/* 3. CPU Socket & Liquid Cooler Block (Explodes Forward) */}
      <group position={[0, 0.5 * (1.0 + explodeFactor * 1.5), -0.4 + explodeFactor * 1.5]}>
        {/* CPU IHS (Integrated Heat Spreader) */}
        <mesh position={[0, 0, -0.1]}>
          <boxGeometry args={[0.5, 0.5, 0.05]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* AIO Pump Block with RGB Mirror */}
        <mesh position={[0, 0, 0.1]}>
          <cylinderGeometry args={[0.35, 0.35, 0.25, 32]} />
          <meshStandardMaterial color="#1c2541" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Glowing RGB Ring */}
        <mesh position={[0, 0, 0.23]}>
          <ringGeometry args={[0.22, 0.32, 32]} />
          <meshBasicMaterial color="#00f7ff" />
        </mesh>
      </group>

      {/* 4. Dual DDR5 RGB RAM Sticks (Explodes Right) */}
      <group position={[0.7 + explodeFactor * 1.8, 0.5, -0.4 + explodeFactor * 0.5]}>
        {/* Stick 1 */}
        <mesh position={[-0.08, 0, 0]}>
          <boxGeometry args={[0.06, 1.2, 0.35]} />
          <meshStandardMaterial color="#111827" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[-0.08, 0.55, 0]}>
          <boxGeometry args={[0.08, 0.1, 0.36]} />
          <meshBasicMaterial color="#ff0055" />
        </mesh>
        {/* Stick 2 */}
        <mesh position={[0.08, 0, 0]}>
          <boxGeometry args={[0.06, 1.2, 0.35]} />
          <meshStandardMaterial color="#111827" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.08, 0.55, 0]}>
          <boxGeometry args={[0.08, 0.1, 0.36]} />
          <meshBasicMaterial color="#00f7ff" />
        </mesh>
      </group>

      {/* 5. Triple-Fan High-End GPU (Explodes Down/Forward) */}
      <group position={[0, -0.5 - explodeFactor * 2.2, 0.1 + explodeFactor * 1.5]}>
        {/* GPU Shroud */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.5, 0.4, 1.1]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Aluminum Heatsink Fins */}
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[2.3, 0.1, 0.9]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Fan 1 */}
        <mesh ref={gpuFan1Ref} position={[-0.7, -0.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.05, 12]} />
          <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.5} />
        </mesh>
        {/* Fan 2 */}
        <mesh ref={gpuFan2Ref} position={[0, -0.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.05, 12]} />
          <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.5} />
        </mesh>
        {/* Fan 3 */}
        <mesh ref={gpuFan3Ref} position={[0.7, -0.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.05, 12]} />
          <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.5} />
        </mesh>
        {/* GPU Backplate RGB Logo */}
        <mesh position={[0, 0.21, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.2, 0.3]} />
          <meshBasicMaterial color="#00f7ff" />
        </mesh>
      </group>

      {/* 6. Modular 850W Gold PSU (Explodes Bottom-Back) */}
      <group position={[0, -1.3 - explodeFactor * 1.5, -0.4 - explodeFactor * 1.0]}>
        <mesh>
          <boxGeometry args={[1.4, 0.7, 1.2]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Braided Cables running up */}
        <mesh position={[0.5, 0.4, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
          <meshStandardMaterial color="#1c2541" />
        </mesh>
      </group>

      {/* 7. Top 360mm AIO Radiator with Spinning Fan */}
      <group position={[0, 1.4 + explodeFactor * 1.8, 0]}>
        <mesh>
          <boxGeometry args={[2.6, 0.15, 1.0]} />
          <meshStandardMaterial color="#0b132b" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh ref={cpuFanRef} position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.05, 12]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      </group>
    </group>
  );
};
