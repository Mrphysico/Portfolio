/**
 * ============================================================================
 * 4D MATHEMATICS & WASM BRIDGE
 * ============================================================================
 * Mirrors the exact Rust /wasm-core implementation.
 * Provides 4x4 rotation across all 6 planes (XY, XZ, YZ, XW, YW, ZW)
 * and perspective projection 4D -> 3D.
 */

export type Vec4 = [number, number, number, number];
export type Vec3 = [number, number, number];
export type Mat4 = [
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number]
];

export const IDENTITY_MAT4: Mat4 = [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1],
];

export function mat4Mul(a: Mat4, b: Mat4): Mat4 {
  const out: Mat4 = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      out[i][j] =
        a[i][0] * b[0][j] +
        a[i][1] * b[1][j] +
        a[i][2] * b[2][j] +
        a[i][3] * b[3][j];
    }
  }
  return out;
}

export function mat4MulVec4(m: Mat4, v: Vec4): Vec4 {
  return [
    m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2] + m[0][3] * v[3],
    m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2] + m[1][3] * v[3],
    m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2] + m[2][3] * v[3],
    m[3][0] * v[0] + m[3][1] * v[1] + m[3][2] * v[2] + m[3][3] * v[3],
  ];
}

export function rotXY(theta: number): Mat4 {
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  return [
    [c, -s, 0, 0],
    [s,  c, 0, 0],
    [0,  0, 1, 0],
    [0,  0, 0, 1],
  ];
}

export function rotXZ(theta: number): Mat4 {
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  return [
    [ c, 0, -s, 0],
    [ 0, 1,  0, 0],
    [ s, 0,  c, 0],
    [ 0, 0,  0, 1],
  ];
}

export function rotYZ(theta: number): Mat4 {
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  return [
    [1,  0,  0, 0],
    [0,  c, -s, 0],
    [0,  s,  c, 0],
    [0,  0,  0, 1],
  ];
}

export function rotXW(theta: number): Mat4 {
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  return [
    [ c, 0, 0, -s],
    [ 0, 1, 0,  0],
    [ 0, 0, 1,  0],
    [ s, 0, 0,  c],
  ];
}

export function rotYW(theta: number): Mat4 {
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  return [
    [1, 0, 0,  0],
    [0, c, 0, -s],
    [0, 0, 1,  0],
    [0, s, 0,  c],
  ];
}

export function rotZW(theta: number): Mat4 {
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  return [
    [1, 0,  0,  0],
    [0, 1,  0,  0],
    [0, 0,  c, -s],
    [0, 0,  s,  c],
  ];
}

export function computeRotation4D(
  angleXY: number,
  angleXZ: number,
  angleYZ: number,
  angleXW: number,
  angleYW: number,
  angleZW: number
): Mat4 {
  let m = IDENTITY_MAT4;
  if (angleXY !== 0) m = mat4Mul(m, rotXY(angleXY));
  if (angleXZ !== 0) m = mat4Mul(m, rotXZ(angleXZ));
  if (angleYZ !== 0) m = mat4Mul(m, rotYZ(angleYZ));
  if (angleXW !== 0) m = mat4Mul(m, rotXW(angleXW));
  if (angleYW !== 0) m = mat4Mul(m, rotYW(angleYW));
  if (angleZW !== 0) m = mat4Mul(m, rotZW(angleZW));
  return m;
}

export function project4Dto3D(v: Vec4, d: number = 2.5): Vec3 {
  const denom = Math.max(d - v[3], 0.001);
  const factor = d / denom;
  return [v[0] * factor, v[1] * factor, v[2] * factor];
}

export interface Polytope {
  name: string;
  vertices: Vec4[];
  edges: [number, number][];
}

/** Generates the 16 vertices and 32 edges of a 4D Tesseract (8-cell) */
export function generateTesseract(size: number = 1.6): Polytope {
  const s = size * 0.5;
  const vertices: Vec4[] = [];
  for (let i = 0; i < 16; i++) {
    vertices.push([
      (i & 1) ? s : -s,
      (i & 2) ? s : -s,
      (i & 4) ? s : -s,
      (i & 8) ? s : -s,
    ]);
  }

  const edges: [number, number][] = [];
  for (let i = 0; i < 16; i++) {
    for (let bit = 0; bit < 4; bit++) {
      const neighbor = i ^ (1 << bit);
      if (i < neighbor) {
        edges.push([i, neighbor]);
      }
    }
  }

  return { name: 'Tesseract (8-Cell)', vertices, edges };
}

/** Generates 5-cell (regular 4-simplex) */
export function generate5Cell(size: number = 1.8): Polytope {
  const s = size * 0.5;
  const r5 = Math.sqrt(5.0);
  const vertices: Vec4[] = [
    [ s,  s,  s, -s / r5],
    [ s, -s, -s, -s / r5],
    [-s,  s, -s, -s / r5],
    [-s, -s,  s, -s / r5],
    [ 0,  0,  0, s * (r5 - 1.0) / r5],
  ];

  const edges: [number, number][] = [];
  for (let i = 0; i < 5; i++) {
    for (let j = i + 1; j < 5; j++) {
      edges.push([i, j]);
    }
  }

  return { name: '5-Cell (4-Simplex)', vertices, edges };
}

/** Generates 24-cell (Icositetrachoron) */
export function generate24Cell(size: number = 1.6): Polytope {
  const s = size * 0.5;
  const vertices: Vec4[] = [];

  // 8 permutations of (+-s, 0, 0, 0)
  for (let coord = 0; coord < 4; coord++) {
    for (const sign of [-s, s]) {
      const v: Vec4 = [0, 0, 0, 0];
      v[coord] = sign;
      vertices.push(v);
    }
  }

  // 16 permutations of (+-half, +-half, +-half, +-half)
  const half = s * 0.5;
  for (let i = 0; i < 16; i++) {
    vertices.push([
      (i & 1) ? half : -half,
      (i & 2) ? half : -half,
      (i & 4) ? half : -half,
      (i & 8) ? half : -half,
    ]);
  }

  const edges: [number, number][] = [];
  const threshold = s * 0.75;
  for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
      const v1 = vertices[i];
      const v2 = vertices[j];
      const dist = Math.hypot(v1[0]-v2[0], v1[1]-v2[1], v1[2]-v2[2], v1[3]-v2[3]);
      if (Math.abs(dist - threshold) < 0.08 * s) {
        edges.push([i, j]);
      }
    }
  }

  return { name: '24-Cell (Icositetrachoron)', vertices, edges };
}
