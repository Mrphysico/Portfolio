//! WASM Core Entry Point: 4D Mathematics, Polytopes, and Physics Engine

pub mod math4d;
pub mod polytopes;
pub mod julia4d;
pub mod physics;
pub mod noise;

use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn init_engine() {
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

/// Rotates and projects 4D polytope vertices into 3D space
#[wasm_bindgen]
pub fn transform_and_project_polytope(
    vertices_flat: &[f32],
    angle_xy: f32,
    angle_xz: f32,
    angle_yz: f32,
    angle_xw: f32,
    angle_yw: f32,
    angle_zw: f32,
    camera_d: f32,
) -> Vec<f32> {
    let rot = math4d::compute_rotation_4d(
        angle_xy, angle_xz, angle_yz, angle_xw, angle_yw, angle_zw,
    );

    let num_verts = vertices_flat.len() / 4;
    let mut out_3d = Vec::with_capacity(num_verts * 3);

    for i in 0..num_verts {
        let v4 = [
            vertices_flat[i * 4],
            vertices_flat[i * 4 + 1],
            vertices_flat[i * 4 + 2],
            vertices_flat[i * 4 + 3],
        ];
        let rotated = math4d::mat4_mul_vec4(&rot, &v4);
        let p3 = math4d::project_4d_to_3d(&rotated, camera_d);
        out_3d.push(p3[0]);
        out_3d.push(p3[1]);
        out_3d.push(p3[2]);
    }

    out_3d
}

/// Generates flattened vertex buffer for Tesseract (16 * 4 = 64 floats)
#[wasm_bindgen]
pub fn get_tesseract_vertices(size: f32) -> Vec<f32> {
    let poly = polytopes::generate_tesseract(size);
    let mut flat = Vec::with_capacity(poly.vertices.len() * 4);
    for v in poly.vertices {
        flat.extend_from_slice(&v);
    }
    flat
}

/// Generates flattened edge indices for Tesseract (32 * 2 = 64 u32s)
#[wasm_bindgen]
pub fn get_tesseract_edges(size: f32) -> Vec<u32> {
    let poly = polytopes::generate_tesseract(size);
    let mut flat = Vec::with_capacity(poly.edges.len() * 2);
    for e in poly.edges {
        flat.push(e[0] as u32);
        flat.push(e[1] as u32);
    }
    flat
}
