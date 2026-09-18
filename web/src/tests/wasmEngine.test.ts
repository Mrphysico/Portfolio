import { describe, it, expect } from 'vitest';
import {
  mat4Mul,
  mat4MulVec4,
  IDENTITY_MAT4,
  rotXY,
  rotXW,
  project4Dto3D,
  generateTesseract,
  generate5Cell,
  generate24Cell,
  Vec4,
} from '../wasm/wasmEngine';

describe('4D Mathematics & WASM Engine', () => {
  it('should maintain vector identity when multiplied by identity matrix', () => {
    const v: Vec4 = [1, 2, 3, 4];
    const res = mat4MulVec4(IDENTITY_MAT4, v);
    expect(res).toEqual(v);
  });

  it('should correctly rotate in 3D XY plane', () => {
    const v: Vec4 = [1, 0, 0, 0];
    const rot = rotXY(Math.PI / 2);
    const res = mat4MulVec4(rot, v);
    expect(res[0]).toBeCloseTo(0);
    expect(res[1]).toBeCloseTo(1);
    expect(res[2]).toBe(0);
    expect(res[3]).toBe(0);
  });

  it('should correctly rotate in 4D XW hyperplane', () => {
    const v: Vec4 = [1, 0, 0, 0];
    const rot = rotXW(Math.PI / 2);
    const res = mat4MulVec4(rot, v);
    expect(res[0]).toBeCloseTo(0);
    expect(res[1]).toBe(0);
    expect(res[2]).toBe(0);
    expect(res[3]).toBeCloseTo(1);
  });

  it('should project 4D vector to 3D perspective', () => {
    const v: Vec4 = [1, 2, 3, 0];
    const p3 = project4Dto3D(v, 2.0);
    expect(p3).toEqual([1, 2, 3]);
  });

  it('should generate Tesseract with exactly 16 vertices and 32 edges', () => {
    const tess = generateTesseract(2.0);
    expect(tess.vertices.length).toBe(16);
    expect(tess.edges.length).toBe(32);
  });

  it('should generate 5-cell with exactly 5 vertices and 10 edges', () => {
    const c5 = generate5Cell(2.0);
    expect(c5.vertices.length).toBe(5);
    expect(c5.edges.length).toBe(10);
  });

  it('should generate 24-cell with exactly 24 vertices', () => {
    const c24 = generate24Cell(2.0);
    expect(c24.vertices.length).toBe(24);
  });
});
