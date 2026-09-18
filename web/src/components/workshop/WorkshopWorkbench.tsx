import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface WorkshopWorkbenchProps {
  screwsTightened: boolean[];
  onScrewClick: (index: number) => void;
  isBooted: boolean;
  isAntiG: boolean;
  isExploded: boolean;
  interactionMode: 'orbit' | 'interact';
  hoveredProp: string | null;
  setHoveredProp: (prop: string | null) => void;
  onFocusSubject?: (subject: 'pc' | 'monitors' | 'character' | 'tools') => void;
}

export const WorkshopWorkbench: React.FC<WorkshopWorkbenchProps> = ({
  screwsTightened,
  onScrewClick,
  isBooted,
  isAntiG,
  isExploded,
  interactionMode,
  hoveredProp,
  setHoveredProp,
  onFocusSubject,
}) => {
  // Animation refs
  const fanRef1 = useRef<THREE.Group>(null);
  const fanRef2 = useRef<THREE.Group>(null);
  const aioPumpRef = useRef<THREE.Group>(null);
  const smokeParticlesRef = useRef<THREE.Points>(null);
  const steamParticlesRef = useRef<THREE.Points>(null);
  const duckRef = useRef<THREE.Group>(null);
  const coffeeRef = useRef<THREE.Group>(null);
  const hddRef = useRef<THREE.Group>(null);

  // Exploded view component refs
  const glassPanelRef = useRef<THREE.Group>(null);
  const gpuRef = useRef<THREE.Group>(null);
  const aioCoolerRef = useRef<THREE.Group>(null);
  const ramRef = useRef<THREE.Group>(null);

  // Particles setup for smoke and steam
  const [smokeGeo] = useState(() => {
    const geo = new THREE.BufferGeometry();
    const count = 18;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.05;
      positions[i * 3 + 1] = Math.random() * 0.35;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  });

  const [steamGeo] = useState(() => {
    const geo = new THREE.BufferGeometry();
    const count = 14;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.04;
      positions[i * 3 + 1] = Math.random() * 0.28;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.04;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  });

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // 1. PC Fans & AIO pump rotation
    const fanSpeed = isBooted ? 0.45 : 0.12;
    if (fanRef1.current) fanRef1.current.rotation.z += fanSpeed;
    if (fanRef2.current) fanRef2.current.rotation.z += fanSpeed;
    if (aioPumpRef.current) aioPumpRef.current.rotation.z += isBooted ? 0.25 : 0.06;

    // 2. Exploded View Smooth Lerping
    if (glassPanelRef.current) {
      const targetZ = isExploded ? 0.85 : 0.32;
      glassPanelRef.current.position.z = THREE.MathUtils.lerp(glassPanelRef.current.position.z, targetZ, delta * 5);
    }
    if (gpuRef.current) {
      const targetZ = isExploded ? 0.35 : -0.05;
      const targetY = isExploded ? -0.28 : -0.12;
      gpuRef.current.position.z = THREE.MathUtils.lerp(gpuRef.current.position.z, targetZ, delta * 5);
      gpuRef.current.position.y = THREE.MathUtils.lerp(gpuRef.current.position.y, targetY, delta * 5);
    }
    if (aioCoolerRef.current) {
      const targetZ = isExploded ? 0.4 : -0.15;
      aioCoolerRef.current.position.z = THREE.MathUtils.lerp(aioCoolerRef.current.position.z, targetZ, delta * 5);
    }
    if (ramRef.current) {
      const targetY = isExploded ? 0.42 : 0.15;
      ramRef.current.position.y = THREE.MathUtils.lerp(ramRef.current.position.y, targetY, delta * 5);
    }

    // 3. Smoke Particles from Soldering Iron
    if (smokeParticlesRef.current) {
      const positions = smokeParticlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 18; i++) {
        positions[i * 3 + 1] += delta * 0.16;
        positions[i * 3] += Math.sin(time * 3 + i) * 0.001;
        if (positions[i * 3 + 1] > 0.4) {
          positions[i * 3 + 1] = 0;
          positions[i * 3] = (Math.random() - 0.5) * 0.03;
        }
      }
      smokeParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // 4. Steam Particles from Coffee
    if (steamParticlesRef.current) {
      const positions = steamParticlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 14; i++) {
        positions[i * 3 + 1] += delta * 0.14;
        positions[i * 3] += Math.cos(time * 2 + i) * 0.0008;
        if (positions[i * 3 + 1] > 0.32) {
          positions[i * 3 + 1] = 0;
          positions[i * 3] = (Math.random() - 0.5) * 0.02;
        }
      }
      steamParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // 5. Anti-Gravity Float Animations
    if (isAntiG) {
      if (duckRef.current) {
        duckRef.current.position.y = -0.42 + Math.sin(time * 2) * 0.16;
        duckRef.current.rotation.y = time * 0.8;
        duckRef.current.rotation.x = Math.sin(time) * 0.2;
      }
      if (coffeeRef.current) {
        coffeeRef.current.position.y = -0.48 + Math.sin(time * 1.8 + 1) * 0.13;
        coffeeRef.current.rotation.z = Math.cos(time * 1.2) * 0.1;
      }
      if (hddRef.current) {
        hddRef.current.position.y = -0.52 + Math.sin(time * 1.5 + 2) * 0.15;
        hddRef.current.rotation.y = time * 0.5;
      }
    } else {
      if (duckRef.current) {
        duckRef.current.position.y = THREE.MathUtils.lerp(duckRef.current.position.y, -0.47, delta * 4);
        duckRef.current.rotation.x = THREE.MathUtils.lerp(duckRef.current.rotation.x, 0, delta * 4);
      }
      if (coffeeRef.current) {
        coffeeRef.current.position.y = THREE.MathUtils.lerp(coffeeRef.current.position.y, -0.55, delta * 4);
        coffeeRef.current.rotation.z = THREE.MathUtils.lerp(coffeeRef.current.rotation.z, 0, delta * 4);
      }
      if (hddRef.current) {
        hddRef.current.position.y = THREE.MathUtils.lerp(hddRef.current.position.y, -0.57, delta * 4);
      }
    }
  });

  const screwCoords: [number, number, number][] = [
    [-0.46, 0.32, 0.32],
    [0.06, 0.32, 0.32],
    [-0.46, -0.22, 0.32],
    [0.06, -0.22, 0.32],
  ];

  return (
    <group position={[0, 0, 0]}>
      {/* ================= WORKBENCH DESK ================= */}
      {/* Desk surface (Rich industrial PBR finish) */}
      <mesh position={[0.3, -0.6, 0]} receiveShadow>
        <boxGeometry args={[4.4, 0.08, 2.2]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Desk neon accent trims */}
      <mesh position={[0.3, -0.64, 1.09]}>
        <boxGeometry args={[4.4, 0.02, 0.02]} />
        <meshBasicMaterial color="#00f7ff" />
      </mesh>
      <mesh position={[0.3, -0.64, -1.09]}>
        <boxGeometry args={[4.4, 0.02, 0.02]} />
        <meshBasicMaterial color="#6366f1" />
      </mesh>

      {/* Desk metal legs */}
      <mesh position={[-1.8, -1.3, -0.9]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 1.4]} />
        <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[2.4, -1.3, -0.9]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 1.4]} />
        <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[-1.8, -1.3, 0.9]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 1.4]} />
        <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[2.4, -1.3, 0.9]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 1.4]} />
        <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Extended Stitched Desk Mat */}
      <mesh position={[0.8, -0.555, 0.25]} receiveShadow>
        <boxGeometry args={[2.2, 0.006, 0.9]} />
        <meshStandardMaterial color="#0b0f19" roughness={0.8} />
      </mesh>
      <mesh position={[0.8, -0.554, 0.25]}>
        <planeGeometry args={[2.18, 0.88]} />
        <meshBasicMaterial color="#00f7ff" wireframe />
      </mesh>

      {/* Mechanical RGB Gaming Keyboard */}
      <group position={[0.6, -0.545, 0.35]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.7, 0.02, 0.22]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Glowing RGB Keycaps matrix */}
        <mesh position={[0, 0.015, 0]}>
          <planeGeometry args={[0.66, 0.18]} />
          <meshBasicMaterial color={isBooted ? '#00f7ff' : '#ec4899'} />
        </mesh>
      </group>

      {/* Ergonomic Gaming Mouse */}
      <group position={[1.35, -0.545, 0.35]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.035, 0.06, 8, 16]} />
          <meshStandardMaterial color="#090d16" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* RGB mouse wheel & logo */}
        <mesh position={[0, 0.03, 0.02]}>
          <cylinderGeometry args={[0.008, 0.008, 0.015, 12]} />
          <meshBasicMaterial color="#00f7ff" />
        </mesh>
      </group>

      {/* Desk Underglow LED Strip */}
      <pointLight position={[0.3, -0.7, 0]} color="#00f7ff" intensity={1.4} distance={3.0} />

      {/* Soft Glow Pool under the PC */}
      <mesh position={[-0.2, -0.558, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.65, 32]} />
        <meshBasicMaterial color={isBooted ? '#00f7ff' : '#a855f7'} transparent opacity={0.35} />
      </mesh>

      {/* ================= HERO PROP: REBUILT OPEN GAMING PC ================= */}
      <group
        position={[-0.2, -0.05, 0.1]}
        onPointerOver={() => setHoveredProp('RIG-01 (Custom Open-Air Test Bench)')}
        onPointerOut={() => setHoveredProp(null)}
      >
        {/* Rear Backplate with I/O Shield & Exhaust Fan */}
        <mesh position={[-0.2, 0.08, -0.3]} castShadow receiveShadow>
          <boxGeometry args={[0.68, 0.78, 0.02]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.8} />
        </mesh>
        {/* Motherboard I/O Shield */}
        <group position={[-0.15, 0.16, -0.315]}>
          <mesh>
            <boxGeometry args={[0.14, 0.28, 0.01]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.1} />
          </mesh>
          {/* USB Ports & Audio jacks */}
          <mesh position={[0, 0.06, 0.006]}>
            <boxGeometry args={[0.08, 0.04, 0.005]} />
            <meshBasicMaterial color="#00f7ff" />
          </mesh>
          <mesh position={[0, -0.04, 0.006]}>
            <boxGeometry args={[0.08, 0.04, 0.005]} />
            <meshBasicMaterial color="#00f7ff" />
          </mesh>
        </group>
        {/* Rear 120mm RGB Exhaust Fan */}
        <group position={[-0.38, 0.16, -0.315]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.085, 0.085, 0.015, 24]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0, -0.008]}>
            <ringGeometry args={[0.06, 0.08, 24]} />
            <meshBasicMaterial color={isBooted ? '#00f7ff' : '#ec4899'} />
          </mesh>
        </group>
        {/* GPU PCIe Rear Bracket */}
        <group position={[-0.2, -0.12, -0.315]}>
          <mesh>
            <boxGeometry args={[0.42, 0.06, 0.01]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
          </mesh>
          {/* 3x DisplayPort + HDMI */}
          {[-0.14, -0.05, 0.04, 0.13].map((x, i) => (
            <mesh key={i} position={[x, 0, 0.006]}>
              <boxGeometry args={[0.03, 0.016, 0.005]} />
              <meshBasicMaterial color="#1e293b" />
            </mesh>
          ))}
        </group>
        {/* PSU AC Power Inlet & Rocker Switch */}
        <group position={[-0.2, -0.26, -0.315]}>
          <mesh>
            <boxGeometry args={[0.16, 0.08, 0.01]} />
            <meshStandardMaterial color="#020617" />
          </mesh>
          <mesh position={[-0.04, 0, 0.006]}>
            <boxGeometry args={[0.04, 0.03, 0.006]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>
        </group>
        {/* Top Radiator Roof Panel */}
        <mesh position={[-0.2, 0.44, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.68, 0.02, 0.62]} />
          <meshStandardMaterial color="#090d16" roughness={0.3} metalness={0.85} />
        </mesh>
        {/* 4 Vertical Aluminum Corner Posts */}
        <mesh position={[-0.52, 0.06, 0.3]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.76, 8]} />
          <meshStandardMaterial color="#334155" metalness={0.95} />
        </mesh>
        <mesh position={[0.12, 0.06, 0.3]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.76, 8]} />
          <meshStandardMaterial color="#334155" metalness={0.95} />
        </mesh>
        <mesh position={[-0.52, 0.06, -0.3]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.76, 8]} />
          <meshStandardMaterial color="#334155" metalness={0.95} />
        </mesh>
        <mesh position={[0.12, 0.06, -0.3]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.76, 8]} />
          <meshStandardMaterial color="#334155" metalness={0.95} />
        </mesh>

        {/* PSU Shroud with stamped honeycomb mesh */}
        <group position={[-0.2, -0.26, 0]}>
          <mesh receiveShadow>
            <boxGeometry args={[0.64, 0.14, 0.6]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Illuminated PSU badge */}
          <mesh position={[0, 0, 0.305]}>
            <planeGeometry args={[0.2, 0.05]} />
            <meshBasicMaterial color={isBooted ? '#00f7ff' : '#6366f1'} />
          </mesh>
        </group>

        {/* Interior Motherboard Backplate */}
        <mesh position={[-0.2, 0.08, -0.27]}>
          <boxGeometry args={[0.6, 0.54, 0.02]} />
          <meshStandardMaterial color="#020617" roughness={0.9} />
        </mesh>

        {/* Motherboard Circuits & High-Tech Copper Traces */}
        <mesh position={[-0.2, 0.08, -0.255]}>
          <planeGeometry args={[0.58, 0.52]} />
          <meshBasicMaterial color="#059669" wireframe />
        </mesh>

        {/* Sleeved 24-Pin ATX Power Cable with Combs */}
        <group position={[0.08, 0.12, -0.18]}>
          {[-0.04, -0.02, 0, 0.02, 0.04].map((offset, i) => (
            <mesh key={i} position={[offset, 0, 0]} rotation={[0, 0, 0.2]}>
              <cylinderGeometry args={[0.007, 0.007, 0.24, 8]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#00f7ff' : '#334155'} roughness={0.7} />
            </mesh>
          ))}
          {/* Cable Comb */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.11, 0.015, 0.018]} />
            <meshStandardMaterial color="#020617" metalness={0.9} />
          </mesh>
        </group>

        {/* CPU AIO Cooler & Spinning RGB Pump Head */}
        <group ref={aioCoolerRef} position={[-0.2, 0.18, -0.15]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.045, 24]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.15} />
          </mesh>
          {/* Infinite Mirror Ring */}
          <group ref={aioPumpRef} position={[0, 0, 0.028]}>
            <mesh>
              <ringGeometry args={[0.055, 0.09, 24]} />
              <meshBasicMaterial color={isBooted ? '#00f7ff' : '#ec4899'} />
            </mesh>
          </group>
          {/* Braided Water Tubes */}
          <mesh position={[-0.09, 0.14, 0]} rotation={[0, 0, -0.38]}>
            <cylinderGeometry args={[0.016, 0.016, 0.32]} />
            <meshStandardMaterial color="#090d16" roughness={0.9} />
          </mesh>
          <mesh position={[0.09, 0.14, 0]} rotation={[0, 0, 0.38]}>
            <cylinderGeometry args={[0.016, 0.016, 0.32]} />
            <meshStandardMaterial color="#090d16" roughness={0.9} />
          </mesh>
          {/* Exploded View Label */}
          {isExploded && (
            <Html position={[0, 0.22, 0]} center style={{ pointerEvents: 'none' }}>
              <div className="px-2 py-0.5 rounded bg-black/85 border border-cyan-400 text-[10px] font-mono text-cyan-300 whitespace-nowrap shadow-lg">
                AIO Liquid Cooler (360mm Pump)
              </div>
            </Html>
          )}
        </group>

        {/* RAM Sticks with Multi-Zone RGB Lightbars */}
        <group ref={ramRef} position={[-0.04, 0.18, -0.15]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.016, 0.16, 0.045]} />
            <meshStandardMaterial color="#090d16" metalness={0.95} />
          </mesh>
          <mesh position={[0, 0.082, 0]}>
            <boxGeometry args={[0.016, 0.012, 0.045]} />
            <meshBasicMaterial color={isBooted ? '#3b82f6' : '#a855f7'} />
          </mesh>
          <mesh position={[0.035, 0, 0]}>
            <boxGeometry args={[0.016, 0.16, 0.045]} />
            <meshStandardMaterial color="#090d16" metalness={0.95} />
          </mesh>
          <mesh position={[0.035, 0.082, 0]}>
            <boxGeometry args={[0.016, 0.012, 0.045]} />
            <meshBasicMaterial color={isBooted ? '#00f7ff' : '#ec4899'} />
          </mesh>
          {isExploded && (
            <Html position={[0.02, 0.18, 0]} center style={{ pointerEvents: 'none' }}>
              <div className="px-2 py-0.5 rounded bg-black/85 border border-purple-400 text-[10px] font-mono text-purple-300 whitespace-nowrap shadow-lg">
                32GB DDR5 6400MHz RGB
              </div>
            </Html>
          )}
        </group>

        {/* GPU (Flagship Graphics Card with Dual Fans & Copper Pipes) */}
        <group ref={gpuRef} position={[-0.2, -0.12, -0.05]}>
          {/* Main Shroud */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.54, 0.11, 0.25]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Brushed Aluminum Backplate */}
          <mesh position={[0, 0.058, 0]}>
            <boxGeometry args={[0.52, 0.006, 0.23]} />
            <meshStandardMaterial color="#334155" metalness={0.95} roughness={0.1} />
          </mesh>
          {/* Exposed Copper Heatpipes */}
          <mesh position={[-0.22, 0.02, 0.13]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.008, 0.008, 0.08]} />
            <meshStandardMaterial color="#b45309" metalness={0.95} roughness={0.1} />
          </mesh>
          {/* Dual RGB Fans */}
          <group ref={fanRef1} position={[-0.14, 0, 0.13]}>
            <mesh>
              <circleGeometry args={[0.046, 16]} />
              <meshBasicMaterial color="#00f7ff" wireframe />
            </mesh>
          </group>
          <group ref={fanRef2} position={[0.14, 0, 0.13]}>
            <mesh>
              <circleGeometry args={[0.046, 16]} />
              <meshBasicMaterial color="#00f7ff" wireframe />
            </mesh>
          </group>
          {/* Illuminated Logo */}
          <mesh position={[0, -0.058, 0.06]}>
            <boxGeometry args={[0.18, 0.012, 0.035]} />
            <meshBasicMaterial color={isBooted ? '#22c55e' : '#f59e0b'} />
          </mesh>
          {isExploded && (
            <Html position={[0, -0.12, 0]} center style={{ pointerEvents: 'none' }}>
              <div className="px-2 py-0.5 rounded bg-black/85 border border-emerald-400 text-[10px] font-mono text-emerald-300 whitespace-nowrap shadow-lg">
                RTX 5090 Creative Edition (32GB VRAM)
              </div>
            </Html>
          )}
        </group>

        {/* Acrylic / Tempered Glass Side Panel (Open / Angled off) */}
        <group ref={glassPanelRef} position={[-0.1, 0.06, 0.32]} rotation={[0, isExploded ? 0 : 0.22, 0]}>
          <mesh>
            <boxGeometry args={[0.66, 0.74, 0.012]} />
            <meshPhysicalMaterial
              transparent
              opacity={0.35}
              roughness={0.08}
              transmission={0.85}
              thickness={0.03}
              color="#cbd5e1"
              reflectivity={0.9}
            />
          </mesh>
          {isExploded && (
            <Html position={[0, 0.42, 0]} center style={{ pointerEvents: 'none' }}>
              <div className="px-2 py-0.5 rounded bg-black/85 border border-zinc-400 text-[10px] font-mono text-zinc-300 whitespace-nowrap shadow-lg">
                Tempered Glass Panel (4x M3 Screws)
              </div>
            </Html>
          )}
        </group>

        {/* 4 Interactive Screws on Acrylic Panel */}
        {screwCoords.map((pos, idx) => {
          const tightened = screwsTightened[idx];
          return (
            <group
              key={idx}
              position={[pos[0], pos[1], tightened ? pos[2] : pos[2] + 0.09]}
              onClick={(e) => {
                e.stopPropagation();
                onScrewClick(idx);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredProp(`M3 Hex Screw #${idx + 1} (${tightened ? 'TIGHTENED' : 'CLICK TO FASTEN'})`);
              }}
              onPointerOut={() => setHoveredProp(null)}
            >
              {/* Screw Head */}
              <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.026, 0.026, 0.018, 12]} />
                <meshStandardMaterial
                  color={tightened ? '#22c55e' : '#00f7ff'}
                  metalness={0.95}
                  roughness={0.1}
                />
              </mesh>
              {/* Screw Thread */}
              <mesh position={[0, 0, -0.022]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.013, 0.013, 0.035, 8]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.9} />
              </mesh>
              {/* Loose Screw Glow Aura if untightened */}
              {!tightened && (
                <mesh position={[0, 0, 0]}>
                  <ringGeometry args={[0.032, 0.05, 16]} />
                  <meshBasicMaterial color="#f59e0b" />
                </mesh>
              )}
            </group>
          );
        })}

        {/* Internal PC Lighting: Powerful RGB Core */}
        <pointLight
          position={[-0.2, 0.12, 0]}
          color={isBooted ? '#00f7ff' : '#f43f5e'}
          intensity={isBooted ? 3.5 : 1.4}
          distance={2.0}
        />
      </group>

      {/* ================= DUAL MONITORS ================= */}
      {/* 1. Main Landscape Monitor */}
      <group
        position={[0.9, 0.15, -0.3]}
        rotation={[0, -0.25, 0]}
        onPointerOver={() => setHoveredProp('Primary OLED Display (Dev Terminal)')}
        onPointerOut={() => setHoveredProp(null)}
      >
        {/* Monitor Stand */}
        <mesh position={[0, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.13, 0.13, 0.025, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.028, 0.028, 0.52, 8]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} />
        </mesh>
        {/* Bezel */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[0.96, 0.58, 0.035]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* VESA Mount Bracket */}
        <mesh position={[0, 0.15, -0.022]} castShadow>
          <boxGeometry args={[0.16, 0.16, 0.015]} />
          <meshStandardMaterial color="#475569" metalness={0.95} />
        </mesh>
        {/* Rear Ambilight LED Strip */}
        <mesh position={[0, 0.15, -0.025]}>
          <planeGeometry args={[0.92, 0.54]} />
          <meshBasicMaterial color={isBooted ? '#00f7ff' : '#6366f1'} transparent opacity={0.65} />
        </mesh>
        {/* Display Screen */}
        <mesh position={[0, 0.15, 0.02]}>
          <planeGeometry args={[0.92, 0.54]} />
          <meshBasicMaterial color={isBooted ? '#020b14' : '#050505'} />
        </mesh>

        {/* Screen HTML Content */}
        <Html
          position={[0, 0.15, 0.024]}
          transform
          scale={0.065}
          style={{
            width: '395px',
            height: '230px',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          <div className="w-full h-full p-3 font-mono text-[11px] leading-tight bg-black/95 text-cyan-400 rounded-md flex flex-col justify-between border border-cyan-500/40 overflow-hidden shadow-2xl">
            {isBooted ? (
              <div className="space-y-1.5 animate-pulse">
                <div className="text-emerald-400 font-bold flex items-center gap-1.5 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>● SYSTEM BOOT: OK [100% ONLINE]</span>
                </div>
                <div className="text-zinc-300 text-[10.5px] leading-relaxed">
                  &gt; CORE: 16x Dimensional Engine v4.2 [OPTIMIZED]
                  <br />
                  &gt; GPU: RTX 5090 Creative Edition [ACTIVE &bull; 60 FPS]
                  <br />
                  &gt; LATENCY: 0.18ms &bull; VRAM: 32GB NOMINAL
                  <br />
                  &gt; ALL SUBSYSTEMS NOMINAL. READY FOR PRODUCTION.
                </div>
                <div className="p-1.5 bg-emerald-950/80 border border-emerald-500/50 rounded text-[9.5px] text-emerald-300 text-center font-bold tracking-wider">
                  ✓ HARDWARE RIG READY FOR WORK ORDER
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="text-amber-400 font-bold flex items-center gap-1.5 text-xs">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>▲ HARDWARE INTERLOCK: PENDING</span>
                </div>
                <div className="text-zinc-400 text-[10.5px] leading-relaxed">
                  &gt; Fasten 4x M3 screws on PC chassis
                  <br />
                  &gt; Progress: [{screwsTightened.filter(Boolean).length}/4] Fastened
                  <br />
                  &gt; Safety Interlock: AWAITING CHASSIS SEAL
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-zinc-700">
                  <div
                    className="bg-cyan-400 h-full transition-all duration-300 shadow-[0_0_8px_rgba(0,247,255,0.8)]"
                    style={{ width: `${(screwsTightened.filter(Boolean).length / 4) * 100}%` }}
                  />
                </div>
              </div>
            )}
            <div className="text-[9.5px] text-zinc-500 flex justify-between border-t border-zinc-800 pt-1">
              <span>ARTH-OS v4.2 // WORKBENCH</span>
              <span>120Hz OLED PRO</span>
            </div>
          </div>
        </Html>
      </group>

      {/* 2. Secondary Portrait Monitor */}
      <group
        position={[1.68, 0.22, -0.1]}
        rotation={[0, -0.6, 0]}
        onPointerOver={() => setHoveredProp('Secondary Portrait Display (Telemetry)')}
        onPointerOut={() => setHoveredProp(null)}
      >
        {/* Stand */}
        <mesh position={[0, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.095, 0.095, 0.025, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.9} />
        </mesh>
        <mesh position={[0, -0.1, 0]} castShadow>
          <cylinderGeometry args={[0.022, 0.022, 0.46, 8]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} />
        </mesh>
        {/* Bezel */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[0.44, 0.74, 0.035]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* VESA Mount Bracket */}
        <mesh position={[0, 0.15, -0.022]} castShadow>
          <boxGeometry args={[0.12, 0.12, 0.015]} />
          <meshStandardMaterial color="#475569" metalness={0.95} />
        </mesh>
        {/* Rear Ambilight LED Strip */}
        <mesh position={[0, 0.15, -0.025]}>
          <planeGeometry args={[0.42, 0.72]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.65} />
        </mesh>
        {/* Screen */}
        <mesh position={[0, 0.15, 0.02]}>
          <planeGeometry args={[0.4, 0.7]} />
          <meshBasicMaterial color="#020617" />
        </mesh>

        {/* Portrait Screen HTML */}
        <Html
          position={[0, 0.15, 0.024]}
          transform
          scale={0.065}
          style={{
            width: '185px',
            height: '330px',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          <div className="w-full h-full p-3 font-mono text-[9.5px] leading-tight bg-black/95 text-violet-400 rounded-md flex flex-col justify-between border border-violet-500/40 shadow-2xl">
            <div>
              <div className="text-violet-300 font-bold border-b border-violet-800 pb-1 mb-2 tracking-wider">
                HARDWARE TELEMETRY
              </div>
              <div className="text-zinc-300 space-y-1.5">
                <div>CPU TEMP: 36°C (Liquid)</div>
                <div>GPU TEMP: 40°C (Fans 35%)</div>
                <div>CORE CLK: 5.4 GHz Boost</div>
                <div>V-CORE: 1.26V Stable</div>
                <div className="mt-2 text-cyan-400 font-bold">FPS: 60 LOCKED</div>
                <div>POWER: 320W / 850W</div>
                <div>PCIE: Gen5 x16 Active</div>
              </div>
            </div>
            <div className="text-[8.5px] text-zinc-500 border-t border-zinc-800 pt-1">
              COMM: ACTIVE &bull; 0.18ms
            </div>
          </div>
        </Html>
      </group>

      {/* ================= CYBERPUNK WORKBENCH PROPS ================= */}

      {/* 1. Soldering Iron + Smoke Particles */}
      <group
        position={[-0.85, -0.48, 0.45]}
        onPointerOver={() => setHoveredProp('TS100 Precision Soldering Station (400°C)')}
        onPointerOut={() => setHoveredProp(null)}
      >
        {/* Metal Base Stand */}
        <mesh castShadow>
          <cylinderGeometry args={[0.075, 0.085, 0.035, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.95} roughness={0.15} />
        </mesh>
        {/* Brass Wire Sponge */}
        <mesh position={[0, 0.028, 0]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color="#d97706" roughness={0.9} />
        </mesh>
        {/* Coiled Iron Rest Spring */}
        <mesh position={[0.04, 0.065, 0]} rotation={[0, 0, -0.5]}>
          <cylinderGeometry args={[0.032, 0.032, 0.13, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.95} wireframe />
        </mesh>
        {/* Soldering Iron Pen */}
        <group position={[0.06, 0.095, 0]} rotation={[0, 0, -0.5]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.016, 0.016, 0.18, 12]} />
            <meshStandardMaterial color="#0284c7" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.006, 0.013, 0.065, 8]} />
            <meshStandardMaterial color="#f97316" emissive="#ea580c" emissiveIntensity={1.0} />
          </mesh>
          <pointLight position={[0, 0.15, 0]} color="#f97316" intensity={0.6} distance={0.5} />
          {/* Rising Smoke Particles */}
          <points ref={smokeParticlesRef} position={[0, 0.15, 0]} geometry={smokeGeo}>
            <pointsMaterial
              size={0.035}
              color="#cbd5e1"
              transparent
              opacity={0.4}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </points>
        </group>
      </group>

      {/* 2. Coffee Mug + Steam ("Arth's Debug Fuel") */}
      <group
        ref={coffeeRef}
        position={[-1.25, -0.55, 0.2]}
        onPointerOver={() => setHoveredProp("Coffee Mug ('4D Brew - 100% Caffeine')")}
        onPointerOut={() => setHoveredProp(null)}
      >
        <mesh castShadow>
          <cylinderGeometry args={[0.055, 0.05, 0.11, 16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.056, 0.056, 0.018, 16]} />
          <meshBasicMaterial color="#00f7ff" />
        </mesh>
        <mesh position={[0.065, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.028, 0.009, 8, 16]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.05, 16]} />
          <meshStandardMaterial color="#3f2314" roughness={0.1} />
        </mesh>
        <points ref={steamParticlesRef} position={[0, 0.07, 0]} geometry={steamGeo}>
          <pointsMaterial
            size={0.03}
            color="#f1f5f9"
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      </group>

      {/* 3. Cyberpunk Rubber Duck with Visor */}
      <group
        ref={duckRef}
        position={[-0.9, -0.47, -0.1]}
        rotation={[0, 0.5, 0]}
        scale={0.85}
        onPointerOver={() => setHoveredProp("Rubber Duck ('Quack Overflow' Senior Debugger)")}
        onPointerOut={() => setHoveredProp(null)}
      >
        <mesh position={[0, 0, 0]} castShadow>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#facc15" roughness={0.4} />
        </mesh>
        <mesh position={[0.035, 0.055, 0]} castShadow>
          <sphereGeometry args={[0.042, 16, 16]} />
          <meshStandardMaterial color="#facc15" roughness={0.4} />
        </mesh>
        <mesh position={[0.075, 0.05, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.016, 0.035, 8]} />
          <meshStandardMaterial color="#ea580c" roughness={0.5} />
        </mesh>
        <mesh position={[0.05, 0.065, 0]}>
          <boxGeometry args={[0.018, 0.014, 0.055]} />
          <meshBasicMaterial color="#00f7ff" />
        </mesh>
      </group>

      {/* 4. Digital Multimeter */}
      <group
        position={[0.55, -0.56, 0.6]}
        rotation={[-0.2, 0.4, 0]}
        onPointerOver={() => setHoveredProp('Fluke True-RMS Multimeter (12.04V 12V-Rail)')}
        onPointerOut={() => setHoveredProp(null)}
      >
        <mesh castShadow>
          <boxGeometry args={[0.12, 0.2, 0.045]} />
          <meshStandardMaterial color="#eab308" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.05, 0.024]}>
          <planeGeometry args={[0.09, 0.05]} />
          <meshBasicMaterial color="#0284c7" />
        </mesh>
        <mesh position={[0, -0.025, 0.025]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.012, 16]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>

      {/* 5. Scrap Hardware: HDD Platter with mirror shine */}
      <group
        ref={hddRef}
        position={[-0.6, -0.57, 0.7]}
        rotation={[-Math.PI / 2, 0, 0.8]}
        onPointerOver={() => setHoveredProp('Disassembled 10,000 RPM Enterprise HDD')}
        onPointerOut={() => setHoveredProp(null)}
      >
        <mesh castShadow>
          <boxGeometry args={[0.2, 0.28, 0.022]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0, -0.02, 0.013]}>
          <cylinderGeometry args={[0.075, 0.075, 0.006, 32]} />
          <meshStandardMaterial color="#ffffff" metalness={0.99} roughness={0.02} />
        </mesh>
      </group>

      {/* 6. Sticky Notes on Monitor */}
      <group position={[0.42, -0.05, -0.25]} rotation={[0, -0.2, 0.05]}>
        <mesh>
          <planeGeometry args={[0.1, 0.1]} />
          <meshStandardMaterial color="#fef08a" roughness={0.8} />
        </mesh>
        <Html
          position={[0, 0, 0.005]}
          transform
          scale={0.04}
          style={{ width: '100px', pointerEvents: 'none' }}
        >
          <div className="text-[7.5px] font-sans font-bold text-amber-950 leading-tight">
            TODO:
            <br />
            - Ship portfolio
            <br />
            - Buy thermal paste
            <br />- 4D &gt; 3D!
          </div>
        </Html>
      </group>

      {/* 7. Neon Wall Sign Behind Desk: "BUILD • BREAK • REPEAT" */}
      <group position={[0.4, 1.35, -1.2]}>
        <mesh>
          <boxGeometry args={[2.5, 0.3, 0.02]} />
          <meshStandardMaterial color="#020617" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0.016]}>
          <planeGeometry args={[2.4, 0.26]} />
          <meshBasicMaterial color="#00f7ff" wireframe />
        </mesh>
        <Html
          position={[0, 0, 0.022]}
          transform
          scale={0.08}
          style={{ width: '380px', pointerEvents: 'none' }}
        >
          <div className="text-center font-mono font-black tracking-widest text-[14px] text-cyan-300 drop-shadow-[0_0_15px_rgba(0,247,255,1)]">
            ⚡ BUILD • BREAK • REPEAT ⚡
          </div>
        </Html>
      </group>

      {/* ================= 3D CLICKABLE HOTSPOTS ================= */}
      {/* 1. Hotspot on PC */}
      <group
        position={[-0.2, 0.45, 0.1]}
        onClick={(e) => {
          e.stopPropagation();
          if (onFocusSubject) onFocusSubject('pc');
        }}
        onPointerOver={() => setHoveredProp('Click to focus PC Hero Setup')}
        onPointerOut={() => setHoveredProp(null)}
      >
        <mesh>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshBasicMaterial color="#00f7ff" />
        </mesh>
        <mesh>
          <ringGeometry args={[0.045, 0.065, 16]} />
          <meshBasicMaterial color="#00f7ff" />
        </mesh>
      </group>

      {/* 2. Hotspot on Monitors */}
      <group
        position={[0.9, 0.55, -0.3]}
        onClick={(e) => {
          e.stopPropagation();
          if (onFocusSubject) onFocusSubject('monitors');
        }}
        onPointerOver={() => setHoveredProp('Click to focus Dual Monitors')}
        onPointerOut={() => setHoveredProp(null)}
      >
        <mesh>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshBasicMaterial color="#a855f7" />
        </mesh>
        <mesh>
          <ringGeometry args={[0.045, 0.065, 16]} />
          <meshBasicMaterial color="#a855f7" />
        </mesh>
      </group>

      {/* 3. Hotspot on Character */}
      <group
        position={[-1.2, 0.95, -0.4]}
        onClick={(e) => {
          e.stopPropagation();
          if (onFocusSubject) onFocusSubject('character');
        }}
        onPointerOver={() => setHoveredProp('Click to focus Arth the Builder')}
        onPointerOut={() => setHoveredProp(null)}
      >
        <mesh>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
        <mesh>
          <ringGeometry args={[0.045, 0.065, 16]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
      </group>

      {/* Floating Hover Tooltip */}
      {hoveredProp && (
        <Html position={[0.3, 0.9, 0]} center style={{ pointerEvents: 'none' }}>
          <div className="px-3.5 py-1.5 rounded-full bg-black/90 backdrop-blur-md border border-cyan-500/60 text-cyan-300 text-xs font-mono shadow-[0_0_20px_rgba(0,247,255,0.4)] whitespace-nowrap flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>{hoveredProp}</span>
          </div>
        </Html>
      )}
    </group>
  );
};
