import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import confetti from 'canvas-confetti';

interface WorkshopWorkbenchProps {
  screwsTightened: boolean[];
  onScrewClick: (index: number) => void;
  isBooted: boolean;
  isAntiG: boolean;
  hoveredProp: string | null;
  setHoveredProp: (prop: string | null) => void;
}

export const WorkshopWorkbench: React.FC<WorkshopWorkbenchProps> = ({
  screwsTightened,
  onScrewClick,
  isBooted,
  isAntiG,
  hoveredProp,
  setHoveredProp,
}) => {
  // Animation refs
  const fanRef = useRef<THREE.Group>(null);
  const aioPumpRef = useRef<THREE.Group>(null);
  const smokeParticlesRef = useRef<THREE.Points>(null);
  const steamParticlesRef = useRef<THREE.Points>(null);
  const duckRef = useRef<THREE.Group>(null);
  const coffeeRef = useRef<THREE.Group>(null);
  const hddRef = useRef<THREE.Group>(null);

  // Particles setup for smoke and steam
  const [smokeGeo] = useState(() => {
    const geo = new THREE.BufferGeometry();
    const count = 15;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.05;
      positions[i * 3 + 1] = Math.random() * 0.3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  });

  const [steamGeo] = useState(() => {
    const geo = new THREE.BufferGeometry();
    const count = 12;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.04;
      positions[i * 3 + 1] = Math.random() * 0.25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.04;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  });

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // 1. PC Fans & AIO pump rotation
    if (fanRef.current) {
      fanRef.current.rotation.z += isBooted ? 0.35 : 0.08;
    }
    if (aioPumpRef.current) {
      aioPumpRef.current.rotation.z += isBooted ? 0.2 : 0.05;
    }

    // 2. Smoke Particles from Soldering Iron
    if (smokeParticlesRef.current) {
      const positions = smokeParticlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 15; i++) {
        positions[i * 3 + 1] += delta * 0.15;
        positions[i * 3] += Math.sin(time * 3 + i) * 0.001;
        if (positions[i * 3 + 1] > 0.4) {
          positions[i * 3 + 1] = 0;
          positions[i * 3] = (Math.random() - 0.5) * 0.03;
        }
      }
      smokeParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // 3. Steam Particles from Coffee
    if (steamParticlesRef.current) {
      const positions = steamParticlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 12; i++) {
        positions[i * 3 + 1] += delta * 0.12;
        positions[i * 3] += Math.cos(time * 2 + i) * 0.0008;
        if (positions[i * 3 + 1] > 0.3) {
          positions[i * 3 + 1] = 0;
          positions[i * 3] = (Math.random() - 0.5) * 0.02;
        }
      }
      steamParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // 4. Anti-Gravity Float Animations
    if (isAntiG) {
      if (duckRef.current) {
        duckRef.current.position.y = -0.42 + Math.sin(time * 2) * 0.15;
        duckRef.current.rotation.y = time * 0.8;
        duckRef.current.rotation.x = Math.sin(time) * 0.2;
      }
      if (coffeeRef.current) {
        coffeeRef.current.position.y = -0.48 + Math.sin(time * 1.8 + 1) * 0.12;
        coffeeRef.current.rotation.z = Math.cos(time * 1.2) * 0.1;
      }
      if (hddRef.current) {
        hddRef.current.position.y = -0.52 + Math.sin(time * 1.5 + 2) * 0.14;
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
      {/* Desk surface */}
      <mesh position={[0.3, -0.6, 0]} receiveShadow>
        <boxGeometry args={[4.2, 0.08, 2.0]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.2} />
      </mesh>
      {/* Desk neon accent trim */}
      <mesh position={[0.3, -0.64, 0.99]}>
        <boxGeometry args={[4.2, 0.02, 0.02]} />
        <meshBasicMaterial color="#00f7ff" />
      </mesh>
      {/* Desk metal legs */}
      <mesh position={[-1.7, -1.3, -0.8]}>
        <cylinderGeometry args={[0.04, 0.04, 1.4]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[2.3, -1.3, -0.8]}>
        <cylinderGeometry args={[0.04, 0.04, 1.4]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[-1.7, -1.3, 0.8]}>
        <cylinderGeometry args={[0.04, 0.04, 1.4]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[2.3, -1.3, 0.8]}>
        <cylinderGeometry args={[0.04, 0.04, 1.4]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Underglow LED strip */}
      <pointLight position={[0.3, -0.7, 0]} color="#00f7ff" intensity={0.8} distance={2.5} />

      {/* ================= HERO PROP: OPEN GAMING PC ================= */}
      <group
        position={[-0.2, -0.05, 0.1]}
        onPointerOver={() => setHoveredProp('RIG-01 (Open Test Bench)')}
        onPointerOut={() => setHoveredProp(null)}
      >
        {/* PC Case Chassis (Outer Frame) */}
        <mesh position={[-0.2, 0.05, 0]}>
          <boxGeometry args={[0.62, 0.72, 0.6]} />
          <meshStandardMaterial color="#020617" roughness={0.4} metalness={0.8} />
        </mesh>

        {/* Interior Motherboard Backplate */}
        <mesh position={[-0.2, 0.05, -0.26]}>
          <boxGeometry args={[0.56, 0.66, 0.02]} />
          <meshStandardMaterial color="#111827" roughness={0.8} />
        </mesh>

        {/* Motherboard Circuits & Traces */}
        <mesh position={[-0.2, 0.05, -0.245]}>
          <planeGeometry args={[0.54, 0.64]} />
          <meshBasicMaterial color="#065f46" wireframe />
        </mesh>

        {/* CPU AIO Cooler & Spinning RGB Pump */}
        <group position={[-0.2, 0.15, -0.15]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.04, 24]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} />
          </mesh>
          <group ref={aioPumpRef} position={[0, 0, 0.025]}>
            <mesh>
              <ringGeometry args={[0.05, 0.08, 24]} />
              <meshBasicMaterial color={isBooted ? '#00f7ff' : '#ec4899'} />
            </mesh>
          </group>
          {/* AIO Braided Tubing */}
          <mesh position={[-0.08, 0.12, 0]} rotation={[0, 0, -0.4]}>
            <cylinderGeometry args={[0.015, 0.015, 0.28]} />
            <meshStandardMaterial color="#020617" roughness={0.9} />
          </mesh>
          <mesh position={[0.08, 0.12, 0]} rotation={[0, 0, 0.4]}>
            <cylinderGeometry args={[0.015, 0.015, 0.28]} />
            <meshStandardMaterial color="#020617" roughness={0.9} />
          </mesh>
        </group>

        {/* RAM Sticks with RGB Lightbars */}
        <group position={[-0.05, 0.15, -0.15]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.015, 0.14, 0.04]} />
            <meshStandardMaterial color="#09090b" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.07, 0]}>
            <boxGeometry args={[0.015, 0.01, 0.04]} />
            <meshBasicMaterial color={isBooted ? '#3b82f6' : '#a855f7'} />
          </mesh>
          <mesh position={[0.03, 0, 0]}>
            <boxGeometry args={[0.015, 0.14, 0.04]} />
            <meshStandardMaterial color="#09090b" metalness={0.9} />
          </mesh>
          <mesh position={[0.03, 0.07, 0]}>
            <boxGeometry args={[0.015, 0.01, 0.04]} />
            <meshBasicMaterial color={isBooted ? '#00f7ff' : '#ec4899'} />
          </mesh>
        </group>

        {/* GPU (Graphics Card) */}
        <group position={[-0.2, -0.12, -0.05]}>
          {/* Main Shroud */}
          <mesh>
            <boxGeometry args={[0.5, 0.1, 0.22]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* GPU Backplate Accent */}
          <mesh position={[0, 0.052, 0]}>
            <boxGeometry args={[0.48, 0.005, 0.2]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} />
          </mesh>
          {/* Dual Fans */}
          <group ref={fanRef} position={[-0.12, 0, 0.115]}>
            <mesh>
              <circleGeometry args={[0.04, 16]} />
              <meshBasicMaterial color="#00f7ff" wireframe />
            </mesh>
          </group>
          <group position={[0.12, 0, 0.115]}>
            <mesh>
              <circleGeometry args={[0.04, 16]} />
              <meshBasicMaterial color="#00f7ff" wireframe />
            </mesh>
          </group>
          {/* GeForce/Radeon RGB Logo */}
          <mesh position={[0, -0.052, 0.05]}>
            <boxGeometry args={[0.16, 0.01, 0.03]} />
            <meshBasicMaterial color={isBooted ? '#22c55e' : '#f59e0b'} />
          </mesh>
        </group>

        {/* Acrylic / Tempered Glass Side Panel (Open / Angled off) */}
        <mesh position={[-0.1, 0.05, 0.35]} rotation={[0, 0.25, 0]}>
          <boxGeometry args={[0.6, 0.7, 0.01]} />
          <meshPhysicalMaterial
            transparent
            opacity={0.3}
            roughness={0.1}
            transmission={0.8}
            thickness={0.02}
            color="#94a3b8"
          />
        </mesh>

        {/* 4 Interactive Screws on Acrylic Panel */}
        {screwCoords.map((pos, idx) => {
          const tightened = screwsTightened[idx];
          return (
            <group
              key={idx}
              position={[pos[0], pos[1], tightened ? pos[2] : pos[2] + 0.08]}
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
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.024, 0.024, 0.015, 12]} />
                <meshStandardMaterial
                  color={tightened ? '#22c55e' : '#00f7ff'}
                  metalness={0.9}
                  roughness={0.1}
                />
              </mesh>
              {/* Screw Thread */}
              <mesh position={[0, 0, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.012, 0.012, 0.03, 8]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.8} />
              </mesh>
              {/* Loose Screw Glow Aura if untightened */}
              {!tightened && (
                <mesh position={[0, 0, 0]}>
                  <ringGeometry args={[0.03, 0.045, 16]} />
                  <meshBasicMaterial color="#f59e0b" />
                </mesh>
              )}
            </group>
          );
        })}

        {/* Internal PC Lighting */}
        <pointLight
          position={[-0.2, 0.1, 0]}
          color={isBooted ? '#00f7ff' : '#f43f5e'}
          intensity={isBooted ? 2.0 : 0.8}
          distance={1.5}
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
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.02, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.5, 8]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} />
        </mesh>
        {/* Bezel */}
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.92, 0.56, 0.03]} />
          <meshStandardMaterial color="#020617" roughness={0.3} metalness={0.9} />
        </mesh>
        {/* Display Screen */}
        <mesh position={[0, 0.15, 0.018]}>
          <planeGeometry args={[0.88, 0.52]} />
          <meshBasicMaterial color={isBooted ? '#04101e' : '#050505'} />
        </mesh>

        {/* Screen HTML Content */}
        <Html
          position={[0, 0.15, 0.022]}
          transform
          scale={0.065}
          style={{
            width: '380px',
            height: '220px',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          <div className="w-full h-full p-3 font-mono text-[11px] leading-tight bg-black/90 text-cyan-400 rounded flex flex-col justify-between border border-cyan-500/30 overflow-hidden shadow-inner">
            {isBooted ? (
              <div className="space-y-1 animate-pulse">
                <div className="text-emerald-400 font-bold flex items-center gap-1">
                  <span>●</span> SYSTEM BOOT: OK [100%]
                </div>
                <div className="text-zinc-400 text-[10px]">
                  &gt; CORE: 16x Dimensional Engine v4.0
                  <br />
                  &gt; GPU: RTX 5090 Creative Edition [ACTIVE]
                  <br />
                  &gt; LATENCY: 0.24ms | VRAM: 32GB NOMINAL
                  <br />
                  &gt; ALL SUBSYSTEMS ONLINE. READY FOR BUILD.
                </div>
                <div className="p-1 bg-emerald-950/60 border border-emerald-500/40 rounded text-[9px] text-emerald-300 text-center font-bold">
                  RIG STATUS: FULLY ASSEMBLED
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="text-amber-400 font-bold flex items-center gap-1">
                  <span>▲</span> AWAITING CHASSIS LOCK
                </div>
                <div className="text-zinc-500 text-[10px]">
                  &gt; Fasten 4x M3 screws on PC chassis
                  <br />
                  &gt; Progress: [{screwsTightened.filter(Boolean).length}/4] Fastened
                  <br />
                  &gt; Safety Interlock: DISENGAGED
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-zinc-700">
                  <div
                    className="bg-cyan-400 h-full transition-all duration-300"
                    style={{ width: `${(screwsTightened.filter(Boolean).length / 4) * 100}%` }}
                  />
                </div>
              </div>
            )}
            <div className="text-[9px] text-zinc-600 flex justify-between border-t border-zinc-800 pt-1">
              <span>ARTH-OS v4.2</span>
              <span>DIMENSIONAL_WORKBENCH</span>
            </div>
          </div>
        </Html>
      </group>

      {/* 2. Secondary Portrait Monitor */}
      <group
        position={[1.65, 0.22, -0.1]}
        rotation={[0, -0.6, 0]}
        onPointerOver={() => setHoveredProp('Secondary Portrait Display (Telemetry)')}
        onPointerOut={() => setHoveredProp(null)}
      >
        {/* Stand */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.02, 16]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.45, 8]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Bezel */}
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.42, 0.72, 0.03]} />
          <meshStandardMaterial color="#020617" roughness={0.3} metalness={0.9} />
        </mesh>
        {/* Screen */}
        <mesh position={[0, 0.15, 0.018]}>
          <planeGeometry args={[0.38, 0.68]} />
          <meshBasicMaterial color="#030712" />
        </mesh>

        {/* Portrait Screen HTML */}
        <Html
          position={[0, 0.15, 0.022]}
          transform
          scale={0.065}
          style={{
            width: '180px',
            height: '320px',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          <div className="w-full h-full p-2.5 font-mono text-[9px] leading-tight bg-black/95 text-violet-400 rounded flex flex-col justify-between border border-violet-500/30">
            <div>
              <div className="text-violet-300 font-bold border-b border-violet-800 pb-1 mb-2">
                HARDWARE TELEMETRY
              </div>
              <div className="text-zinc-400 space-y-1">
                <div>CPU: 38°C (Idle)</div>
                <div>GPU: 42°C (Fans 30%)</div>
                <div>CLK: 5.4 GHz Boost</div>
                <div>VOLT: 1.28V Stable</div>
                <div className="mt-2 text-cyan-400">FPS: 144 Locked</div>
                <div>DRAW: 340W / 850W</div>
              </div>
            </div>
            <div className="text-[8px] text-zinc-600">
              COMM_PORT: ACTIVE
              <br />
              PING: 12ms TO LOCALHOST
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
        <mesh>
          <cylinderGeometry args={[0.07, 0.08, 0.03, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Brass Wire Sponge */}
        <mesh position={[0, 0.025, 0]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial color="#d97706" roughness={0.9} />
        </mesh>
        {/* Coiled Iron Rest Spring */}
        <mesh position={[0.04, 0.06, 0]} rotation={[0, 0, -0.5]}>
          <cylinderGeometry args={[0.03, 0.03, 0.12, 12]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} wireframe />
        </mesh>
        {/* Soldering Iron Pen */}
        <group position={[0.06, 0.09, 0]} rotation={[0, 0, -0.5]}>
          {/* Grip */}
          <mesh>
            <cylinderGeometry args={[0.015, 0.015, 0.16, 12]} />
            <meshStandardMaterial color="#0284c7" roughness={0.4} />
          </mesh>
          {/* Heated Ceramic Tip */}
          <mesh position={[0, 0.11, 0]}>
            <cylinderGeometry args={[0.005, 0.012, 0.06, 8]} />
            <meshStandardMaterial color="#f97316" emissive="#ea580c" emissiveIntensity={0.8} />
          </mesh>
          {/* Tip Glow Light */}
          <pointLight position={[0, 0.14, 0]} color="#f97316" intensity={0.4} distance={0.4} />
          {/* Rising Smoke Particles */}
          <points ref={smokeParticlesRef} position={[0, 0.14, 0]} geometry={smokeGeo}>
            <pointsMaterial
              size={0.03}
              color="#94a3b8"
              transparent
              opacity={0.35}
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
        onPointerOver={() => setHoveredProp("Coffee Mug ('4D Brew - 100% Caffine')")}
        onPointerOut={() => setHoveredProp(null)}
      >
        {/* Mug Body */}
        <mesh>
          <cylinderGeometry args={[0.05, 0.045, 0.1, 16]} />
          <meshStandardMaterial color="#18181b" roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Cyan Accent Ring on Mug */}
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.051, 0.051, 0.015, 16]} />
          <meshBasicMaterial color="#00f7ff" />
        </mesh>
        {/* Handle */}
        <mesh position={[0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.025, 0.008, 8, 16]} />
          <meshStandardMaterial color="#18181b" />
        </mesh>
        {/* Coffee Liquid */}
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.046, 16]} />
          <meshStandardMaterial color="#3f2314" roughness={0.1} />
        </mesh>
        {/* Rising Steam */}
        <points ref={steamParticlesRef} position={[0, 0.06, 0]} geometry={steamGeo}>
          <pointsMaterial
            size={0.025}
            color="#e2e8f0"
            transparent
            opacity={0.3}
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
        scale={0.8}
        onPointerOver={() => setHoveredProp("Rubber Duck ('Quack Overflow' Senior Debugger)")}
        onPointerOut={() => setHoveredProp(null)}
      >
        {/* Duck Body */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshStandardMaterial color="#eab308" roughness={0.5} />
        </mesh>
        {/* Duck Head */}
        <mesh position={[0.03, 0.05, 0]}>
          <sphereGeometry args={[0.038, 16, 16]} />
          <meshStandardMaterial color="#eab308" roughness={0.5} />
        </mesh>
        {/* Duck Beak */}
        <mesh position={[0.065, 0.045, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.015, 0.03, 8]} />
          <meshStandardMaterial color="#ea580c" roughness={0.6} />
        </mesh>
        {/* Cyber Visor */}
        <mesh position={[0.045, 0.06, 0]}>
          <boxGeometry args={[0.015, 0.012, 0.05]} />
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
        {/* Yellow Body */}
        <mesh>
          <boxGeometry args={[0.11, 0.18, 0.04]} />
          <meshStandardMaterial color="#eab308" roughness={0.4} />
        </mesh>
        {/* LCD Screen */}
        <mesh position={[0, 0.045, 0.021]}>
          <planeGeometry args={[0.08, 0.045]} />
          <meshBasicMaterial color="#0284c7" />
        </mesh>
        {/* Rotary Dial */}
        <mesh position={[0, -0.02, 0.022]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.022, 0.022, 0.01, 16]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Probes Red & Black */}
        <mesh position={[-0.025, -0.08, 0.02]} rotation={[0, 0, -0.2]}>
          <cylinderGeometry args={[0.005, 0.005, 0.08]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        <mesh position={[0.025, -0.08, 0.02]} rotation={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.005, 0.005, 0.08]} />
          <meshStandardMaterial color="#0f172a" />
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
        {/* HDD Casing */}
        <mesh>
          <boxGeometry args={[0.18, 0.26, 0.02]} />
          <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Shiny Mirror Disc */}
        <mesh position={[0, -0.02, 0.012]}>
          <cylinderGeometry args={[0.07, 0.07, 0.005, 32]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.98} roughness={0.05} />
        </mesh>
        {/* Actuator Arm */}
        <mesh position={[0.05, 0.08, 0.015]} rotation={[0, 0, 0.7]}>
          <boxGeometry args={[0.015, 0.08, 0.004]} />
          <meshStandardMaterial color="#0ea5e9" metalness={0.9} />
        </mesh>
      </group>

      {/* 6. Sticky Notes on Monitor & Desk */}
      <group position={[0.42, -0.05, -0.25]} rotation={[0, -0.2, 0.05]}>
        <mesh>
          <planeGeometry args={[0.09, 0.09]} />
          <meshStandardMaterial color="#fef08a" roughness={0.8} />
        </mesh>
        <Html
          position={[0, 0, 0.005]}
          transform
          scale={0.04}
          style={{ width: '100px', pointerEvents: 'none' }}
        >
          <div className="text-[7px] font-sans font-bold text-amber-900 leading-tight">
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
      <group position={[0.4, 1.3, -1.2]}>
        {/* Backing metal plate */}
        <mesh>
          <boxGeometry args={[2.4, 0.28, 0.02]} />
          <meshStandardMaterial color="#020617" roughness={0.8} />
        </mesh>
        {/* Glowing Neon Outline */}
        <mesh position={[0, 0, 0.015]}>
          <planeGeometry args={[2.3, 0.24]} />
          <meshBasicMaterial color="#00f7ff" wireframe />
        </mesh>
        {/* Neon Text in HTML for crisp rendering */}
        <Html
          position={[0, 0, 0.02]}
          transform
          scale={0.08}
          style={{ width: '380px', pointerEvents: 'none' }}
        >
          <div className="text-center font-mono font-black tracking-widest text-[14px] text-cyan-300 drop-shadow-[0_0_12px_rgba(0,247,255,0.9)]">
            ⚡ BUILD • BREAK • REPEAT ⚡
          </div>
        </Html>
      </group>

      {/* Floating Hover Badge */}
      {hoveredProp && (
        <Html position={[0.3, 0.85, 0]} center style={{ pointerEvents: 'none' }}>
          <div className="px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-cyan-500/50 text-cyan-300 text-xs font-mono shadow-[0_0_15px_rgba(0,247,255,0.3)] animate-fadeIn whitespace-nowrap flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>{hoveredProp}</span>
          </div>
        </Html>
      )}
    </group>
  );
};
