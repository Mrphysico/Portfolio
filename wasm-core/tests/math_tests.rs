#[cfg(test)]
mod tests {
    use wasm_core::math4d::*;
    use wasm_core::polytopes::*;

    #[test]
    fn test_identity_matrix() {
        let v = [1.0, 2.0, 3.0, 4.0];
        let res = mat4_mul_vec4(&IDENTITY_MAT4, &v);
        assert_eq!(res, v);
    }

    #[test]
    fn test_tesseract_vertex_and_edge_count() {
        let tess = generate_tesseract(2.0);
        assert_eq!(tess.vertices.len(), 16);
        assert_eq!(tess.edges.len(), 32);
    }

    #[test]
    fn test_5cell_vertex_and_edge_count() {
        let cell5 = generate_5cell(2.0);
        assert_eq!(cell5.vertices.len(), 5);
        assert_eq!(cell5.edges.len(), 10);
    }

    #[test]
    fn test_4d_perspective_projection() {
        let v = [1.0, 2.0, 3.0, 0.0];
        let p = project_4d_to_3d(&v, 2.0);
        assert_eq!(p, [1.0, 2.0, 3.0]);
    }
}
