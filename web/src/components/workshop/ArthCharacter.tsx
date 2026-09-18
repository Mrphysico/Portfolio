import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ArthCharacterProps {
  mousePos: { x: number; y: number };
  isWaving: boolean;
  isTightening: boolean;
  isCelebrating: boolean;
  isTyping: boolean;
}

export const ArthCharacter: React.FC<ArthCharacterProps> = ({
  mousePos,
  isWaving,
  isTightening,
  isCelebrating,
  isTyping,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // 1. Idle Breathing Loop
    if (torsoRef.current) {
      torsoRef.current.position.y = Math.sin(time * 2.0) * 0.02;
      torsoRef.current.scale.y = 1.0 + Math.sin(time * 2.0) * 0.015;
    }

    // 2. Head & Eye tracking visitor mouse or looking down at workbench when typing
    if (headRef.current) {
      if (isTyping) {
        // Look slightly up and directly at the visitor while typing
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -0.1, delta * 5);
        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, 0.0, delta * 5);
      } else {
        // Follow mouse cursor smoothly
        const targetRotY = mousePos.x * 0.4;
        const targetRotX = -mousePos.y * 0.25 - 0.15; // Slightly angled toward bench
        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRotY, delta * 4);
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRotX, delta * 4);
      }
    }

    // 3. Arm Gestures: Waving, Tightening Screws, Celebrating
    if (rightArmRef.current) {
      if (isCelebrating) {
        // Fist pump celebration!
        rightArmRef.current.rotation.x = -Math.PI / 2 + Math.sin(time * 12) * 0.3;
        rightArmRef.current.rotation.z = Math.sin(time * 12) * 0.2;
      } else if (isWaving) {
        // Friendly wave hello!
        rightArmRef.current.rotation.x = -Math.PI / 2.2;
        rightArmRef.current.rotation.z = Math.sin(time * 8) * 0.4 + 0.3;
      } else if (isTightening) {
        // Tightening screw with wrench/driver
        rightArmRef.current.rotation.x = -Math.PI / 3;
        rightArmRef.current.rotation.y = Math.sin(time * 15) * 0.35;
        rightArmRef.current.rotation.z = -0.2;
      } else {
        // Natural resting posture on workbench
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -0.4, delta * 3);
        rightArmRef.current.rotation.y = THREE.MathUtils.lerp(rightArmRef.current.rotation.y, -0.2, delta * 3);
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, 0.1, delta * 3);
      }
    }

    if (leftArmRef.current) {
      if (isCelebrating) {
        leftArmRef.current.rotation.x = -Math.PI / 2 + Math.cos(time * 12) * 0.3;
        leftArmRef.current.rotation.z = -Math.sin(time * 12) * 0.2;
      } else {
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, -0.35, delta * 3);
        leftArmRef.current.rotation.y = THREE.MathUtils.lerp(leftArmRef.current.rotation.y, 0.2, delta * 3);
      }
    }
  });

  return (
    <group ref={groupRef} position={[-1.2, -0.2, -0.4]} scale={0.95}>
      {/* Torso / Hoodie */}
      <group ref={torsoRef} position={[0, 0.8, 0]}>
        {/* Main hoodie body */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.38, 0.34, 0.9, 16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.7} metalness={0.1} />
        </mesh>

        {/* Hoodie pocket / pouch */}
        <mesh position={[0, -0.15, 0.26]}>
          <boxGeometry args={[0.36, 0.22, 0.1]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>

        {/* Cyan accent zipper line */}
        <mesh position={[0, 0.05, 0.3]}>
          <boxGeometry args={[0.02, 0.65, 0.02]} />
          <meshBasicMaterial color="#00f7ff" />
        </mesh>

        {/* Hoodie strings */}
        <mesh position={[-0.08, 0.15, 0.32]}>
          <cylinderGeometry args={[0.01, 0.01, 0.25, 8]} />
          <meshStandardMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[0.08, 0.15, 0.32]}>
          <cylinderGeometry args={[0.01, 0.01, 0.25, 8]} />
          <meshStandardMaterial color="#38bdf8" />
        </mesh>

        {/* Headphones around neck */}
        <group position={[0, 0.42, 0]}>
          {/* Headphone band */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.26, 0.03, 8, 24, Math.PI]} />
            <meshStandardMaterial color="#1e1e2e" roughness={0.3} metalness={0.6} />
          </mesh>
          {/* Left ear cup with cyan ring */}
          <mesh position={[-0.26, -0.05, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.06, 16]} />
            <meshStandardMaterial color="#0b0f19" roughness={0.4} />
          </mesh>
          <mesh position={[-0.29, -0.05, 0]}>
            <ringGeometry args={[0.04, 0.07, 16]} />
            <meshBasicMaterial color="#00f7ff" />
          </mesh>
          {/* Right ear cup with cyan ring */}
          <mesh position={[0.26, -0.05, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.06, 16]} />
            <meshStandardMaterial color="#0b0f19" roughness={0.4} />
          </mesh>
          <mesh position={[0.29, -0.05, 0]}>
            <ringGeometry args={[0.04, 0.07, 16]} />
            <meshBasicMaterial color="#00f7ff" />
          </mesh>
        </group>

        {/* Head & Face Group */}
        <group ref={headRef} position={[0, 0.65, 0]}>
          {/* Stylized Head */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.26, 24, 24]} />
            <meshStandardMaterial color="#ffdfc4" roughness={0.6} metalness={0.05} />
          </mesh>

          {/* Stylized Hair */}
          <mesh position={[0, 0.12, -0.04]}>
            <sphereGeometry args={[0.27, 16, 16]} />
            <meshStandardMaterial color="#18181b" roughness={0.9} />
          </mesh>

          {/* Tech Goggles pushed up on forehead */}
          <group position={[0, 0.14, 0.18]} rotation={[-0.2, 0, 0]}>
            {/* Goggle frame */}
            <mesh>
              <boxGeometry args={[0.34, 0.1, 0.08]} />
              <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.2} />
            </mesh>
            {/* Left glowing lens */}
            <mesh position={[-0.09, 0, 0.045]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
              <meshBasicMaterial color="#ff7700" />
            </mesh>
            {/* Right glowing lens */}
            <mesh position={[0.09, 0, 0.045]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
              <meshBasicMaterial color="#00f7ff" />
            </mesh>
            {/* Goggle elastic strap */}
            <mesh position={[0, 0, -0.15]}>
              <torusGeometry args={[0.26, 0.02, 8, 24]} />
              <meshStandardMaterial color="#0f172a" roughness={0.8} />
            </mesh>
          </group>

          {/* Stylized Eyes */}
          <mesh position={[-0.09, -0.02, 0.24]}>
            <sphereGeometry args={[0.025, 12, 12]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0.09, -0.02, 0.24]}>
            <sphereGeometry args={[0.025, 12, 12]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
        </group>

        {/* Right Arm & Hand */}
        <group ref={rightArmRef} position={[0.42, 0.35, 0]}>
          {/* Upper arm */}
          <mesh position={[0.08, -0.22, 0]}>
            <cylinderGeometry args={[0.09, 0.08, 0.45, 12]} />
            <meshStandardMaterial color="#0f172a" roughness={0.7} />
          </mesh>
          {/* Forearm & Hand */}
          <group position={[0.08, -0.45, 0]}>
            <mesh position={[0, -0.18, 0]}>
              <cylinderGeometry args={[0.075, 0.065, 0.38, 12]} />
              <meshStandardMaterial color="#0f172a" roughness={0.7} />
            </mesh>
            {/* Hand */}
            <mesh position={[0, -0.38, 0]}>
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshStandardMaterial color="#ffdfc4" roughness={0.5} />
            </mesh>
            {/* Precision screwdriver held in hand */}
            <group position={[0, -0.44, 0.08]} rotation={[Math.PI / 4, 0, 0]}>
              <mesh>
                <cylinderGeometry args={[0.02, 0.02, 0.32, 8]} />
                <meshStandardMaterial color="#00f7ff" metalness={0.9} roughness={0.1} />
              </mesh>
              <mesh position={[0, 0.12, 0]}>
                <cylinderGeometry args={[0.035, 0.035, 0.14, 8]} />
                <meshStandardMaterial color="#1e293b" roughness={0.6} />
              </mesh>
            </group>
          </group>
        </group>

        {/* Left Arm & Hand */}
        <group ref={leftArmRef} position={[-0.42, 0.35, 0]}>
          <mesh position={[-0.08, -0.22, 0]}>
            <cylinderGeometry args={[0.09, 0.08, 0.45, 12]} />
            <meshStandardMaterial color="#0f172a" roughness={0.7} />
          </mesh>
          <group position={[-0.08, -0.45, 0]}>
            <mesh position={[0, -0.18, 0]}>
              <cylinderGeometry args={[0.075, 0.065, 0.38, 12]} />
              <meshStandardMaterial color="#0f172a" roughness={0.7} />
            </mesh>
            <mesh position={[0, -0.38, 0]}>
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshStandardMaterial color="#ffdfc4" roughness={0.5} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};
