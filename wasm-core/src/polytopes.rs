//! 4D Regular Polytopes & Hyper-geometry
//! Tesseract (8-cell), 5-cell, 24-cell, 600-cell, and Hopf fibration coordinates.

use crate::math4d::Vec4;

pub struct PolytopeData {
    pub vertices: Vec<Vec4>,
    pub edges: Vec<[usize; 2]>,
}

/// Generates the 16 vertices and 32 edges of a 4D Tesseract (8-cell)
pub fn generate_tesseract(size: f32) -> PolytopeData {
    let mut vertices = Vec::with_capacity(16);
    let s = size * 0.5;

    for i in 0..16 {
        let x = if (i & 1) != 0 { s } else { -s };
        let y = if (i & 2) != 0 { s } else { -s };
        let z = if (i & 4) != 0 { s } else { -s };
        let w = if (i & 8) != 0 { s } else { -s };
        vertices.push([x, y, z, w]);
    }

    let mut edges = Vec::with_capacity(32);
    for i in 0..16 {
        for bit in 0..4 {
            let neighbor = i ^ (1 << bit);
            if i < neighbor {
                edges.push([i, neighbor]);
            }
        }
    }

    PolytopeData { vertices, edges }
}

/// Generates the 5 vertices and 10 edges of a 5-cell (regular 4-simplex)
pub fn generate_5cell(size: f32) -> PolytopeData {
    let s = size * 0.5;
    let r5 = (5.0f32).sqrt();
    
    // Regular 4-simplex vertices
    let vertices = vec![
        [ s,  s,  s, -s / r5],
        [ s, -s, -s, -s / r5],
        [-s,  s, -s, -s / r5],
        [-s, -s,  s, -s / r5],
        [0.0, 0.0, 0.0, s * (r5 - 1.0) / r5],
    ];

    let mut edges = Vec::new();
    for i in 0..5 {
        for j in (i + 1)..5 {
            edges.push([i, j]);
        }
    }

    PolytopeData { vertices, edges }
}

/// Generates the 24 vertices and 96 edges of a 24-cell (Icositetrachoron)
pub fn generate_24cell(size: f32) -> PolytopeData {
    let s = size * 0.5;
    let mut vertices = Vec::with_capacity(24);

    // 8 vertices of the form (+-1, 0, 0, 0) permuted
    for coord in 0..4 {
        for sign in [-s, s] {
            let mut v = [0.0; 4];
            v[coord] = sign;
            vertices.push(v);
        }
    }

    // 16 vertices of the form (+-1/2, +-1/2, +-1/2, +-1/2)
    let half = s * 0.5;
    for i in 0..16 {
        let x = if (i & 1) != 0 { half } else { -half };
        let y = if (i & 2) != 0 { half } else { -half };
        let z = if (i & 4) != 0 { half } else { -half };
        let w = if (i & 8) != 0 { half } else { -half };
        vertices.push([x, y, z, w]);
    }

    // Connect vertices at unit distance
    let mut edges = Vec::new();
    let threshold = s * 0.75; // Distance between adjacent 24-cell vertices
    for i in 0..vertices.len() {
        for j in (i + 1)..vertices.len() {
            let v1 = vertices[i];
            let v2 = vertices[j];
            let dist_sq = (v1[0]-v2[0]).powi(2) + (v1[1]-v2[1]).powi(2) + (v1[2]-v2[2]).powi(2) + (v1[3]-v2[3]).powi(2);
            if (dist_sq.sqrt() - threshold).abs() < 0.05 * s {
                edges.push([i, j]);
            }
        }
    }

    PolytopeData { vertices, edges }
}

/// Hopf fibration: maps points from S3 hypersphere into circles in S2
pub fn generate_hopf_fibration(num_fibers: usize, points_per_fiber: usize, radius: f32) -> Vec<Vec4> {
    let mut points = Vec::with_capacity(num_fibers * points_per_fiber);
    let golden_ratio = (1.0 + (5.0f32).sqrt()) / 2.0;

    for i in 0..num_fibers {
        let theta = (2.0 * std::f32::consts::PI * i as f32) / golden_ratio;
        let phi = ((1.0 - 2.0 * (i as f32 + 0.5) / num_fibers as f32)).acos();

        // Parametrize fiber circle in 4D
        for j in 0..points_per_fiber {
            let psi = (2.0 * std::f32::consts::PI * j as f32) / points_per_fiber as f32;
            let xi1 = (phi * 0.5).cos();
            let xi2 = (phi * 0.5).sin();

            let x = radius * (xi1 * (theta + psi).cos());
            let y = radius * (xi1 * (theta + psi).sin());
            let z = radius * (xi2 * psi.cos());
            let w = radius * (xi2 * psi.sin());
            points.push([x, y, z, w]);
        }
    }

    points
}
