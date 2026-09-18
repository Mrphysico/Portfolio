import * as THREE from 'three';

export const BlackHoleLensingShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0.0 },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    uBlackHolePos: { value: new THREE.Vector2(0.5, 0.5) },
    uMass: { value: 0.04 },
    uAccretionRadius: { value: 0.18 },
    uEventHorizon: { value: 0.05 },
    uIntensity: { value: 1.0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec2 uBlackHolePos;
    uniform float uMass;
    uniform float uAccretionRadius;
    uniform float uEventHorizon;
    uniform float uIntensity;
    varying vec2 vUv;

    void main() {
      vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
      vec2 diff = (vUv - uBlackHolePos) * aspect;
      float dist = length(diff);

      // Event horizon: pure black
      if (dist < uEventHorizon) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
      }

      // Gravitational light deflection
      vec2 dir = normalize(diff);
      float deflection = uMass / max(dist, 0.01);
      vec2 warpedUv = vUv - dir * deflection;

      // Accretion disk glow
      float diskDist = abs(dist - uAccretionRadius);
      float diskGlow = exp(-diskDist * 28.0) * (0.8 + 0.2 * sin(uTime * 4.0 + dist * 30.0));
      vec3 diskColor = mix(vec3(1.0, 0.55, 0.15), vec3(1.0, 0.94, 0.82), sin(dist * 20.0 + uTime * 1.5) * 0.5 + 0.5);

      // Outer photon ring
      float photonRing = exp(-abs(dist - uEventHorizon * 1.3) * 60.0) * 1.5;

      vec3 finalColor = diskColor * diskGlow * 1.8 + vec3(1.0, 0.92, 0.80) * photonRing;
      gl_FragColor = vec4(finalColor * uIntensity, clamp(diskGlow + photonRing, 0.0, 1.0));
    }
  `
};
