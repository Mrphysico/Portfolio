//! True 4D Euclidean Mathematics and Projections
//! Implements 4x4 rotation matrices in 6 canonical planes:
//! XY, XZ, YZ, XW, YW, ZW, plus 4D->3D perspective projection.

pub type Vec4 = [f32; 4];
pub type Vec3 = [f32; 3];
pub type Mat4 = [[f32; 4]; 4];

pub const IDENTITY_MAT4: Mat4 = [
    [1.0, 0.0, 0.0, 0.0],
    [0.0, 1.0, 0.0, 0.0],
    [0.0, 0.0, 1.0, 0.0],
    [0.0, 0.0, 0.0, 1.0],
];

/// Multiply two 4x4 matrices
pub fn mat4_mul(a: &Mat4, b: &Mat4) -> Mat4 {
    let mut out = [[0.0; 4]; 4];
    for i in 0..4 {
        for j in 0..4 {
            out[i][j] = a[i][0] * b[0][j]
                + a[i][1] * b[1][j]
                + a[i][2] * b[2][j]
                + a[i][3] * b[3][j];
        }
    }
    out
}

/// Multiply 4x4 matrix with 4D vector
pub fn mat4_mul_vec4(m: &Mat4, v: &Vec4) -> Vec4 {
    [
        m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2] + m[0][3] * v[3],
        m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2] + m[1][3] * v[3],
        m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2] + m[2][3] * v[3],
        m[3][0] * v[0] + m[3][1] * v[1] + m[3][2] * v[2] + m[3][3] * v[3],
    ]
}

/// Rotation matrix in XY plane
pub fn rot_xy(theta: f32) -> Mat4 {
    let (c, s) = (theta.cos(), theta.sin());
    [
        [c, -s, 0.0, 0.0],
        [s,  c, 0.0, 0.0],
        [0.0, 0.0, 1.0, 0.0],
        [0.0, 0.0, 0.0, 1.0],
    ]
}

/// Rotation matrix in XZ plane
pub fn rot_xz(theta: f32) -> Mat4 {
    let (c, s) = (theta.cos(), theta.sin());
    [
        [ c, 0.0, -s, 0.0],
        [0.0, 1.0, 0.0, 0.0],
        [ s, 0.0,  c, 0.0],
        [0.0, 0.0, 0.0, 1.0],
    ]
}

/// Rotation matrix in YZ plane
pub fn rot_yz(theta: f32) -> Mat4 {
    let (c, s) = (theta.cos(), theta.sin());
    [
        [1.0, 0.0, 0.0, 0.0],
        [0.0,  c, -s, 0.0],
        [0.0,  s,  c, 0.0],
        [0.0, 0.0, 0.0, 1.0],
    ]
}

/// Rotation matrix in XW plane (4th dimension rotation!)
pub fn rot_xw(theta: f32) -> Mat4 {
    let (c, s) = (theta.cos(), theta.sin());
    [
        [ c, 0.0, 0.0, -s],
        [0.0, 1.0, 0.0, 0.0],
        [0.0, 0.0, 1.0, 0.0],
        [ s, 0.0, 0.0,  c],
    ]
}

/// Rotation matrix in YW plane (4th dimension rotation!)
pub fn rot_yw(theta: f32) -> Mat4 {
    let (c, s) = (theta.cos(), theta.sin());
    [
        [1.0, 0.0, 0.0, 0.0],
        [0.0,  c, 0.0, -s],
        [0.0, 0.0, 1.0, 0.0],
        [0.0,  s, 0.0,  c],
    ]
}

/// Rotation matrix in ZW plane (4th dimension rotation!)
pub fn rot_zw(theta: f32) -> Mat4 {
    let (c, s) = (theta.cos(), theta.sin());
    [
        [1.0, 0.0, 0.0, 0.0],
        [0.0, 1.0, 0.0, 0.0],
        [0.0, 0.0,  c, -s],
        [0.0, 0.0,  s,  c],
    ]
}

/// Compound 4D rotation across all 6 planes
pub fn compute_rotation_4d(
    angle_xy: f32,
    angle_xz: f32,
    angle_yz: f32,
    angle_xw: f32,
    angle_yw: f32,
    angle_zw: f32,
) -> Mat4 {
    let mut m = IDENTITY_MAT4;
    if angle_xy != 0.0 { m = mat4_mul(&m, &rot_xy(angle_xy)); }
    if angle_xz != 0.0 { m = mat4_mul(&m, &rot_xz(angle_xz)); }
    if angle_yz != 0.0 { m = mat4_mul(&m, &rot_yz(angle_yz)); }
    if angle_xw != 0.0 { m = mat4_mul(&m, &rot_xw(angle_xw)); }
    if angle_yw != 0.0 { m = mat4_mul(&m, &rot_yw(angle_yw)); }
    if angle_zw != 0.0 { m = mat4_mul(&m, &rot_zw(angle_zw)); }
    m
}

/// 4D to 3D perspective projection with camera distance d
/// Formula: P_3d = (x, y, z) * (d / (d - w))
pub fn project_4d_to_3d(v: &Vec4, d: f32) -> Vec3 {
    let denom = (d - v[3]).max(0.0001);
    let factor = d / denom;
    [v[0] * factor, v[1] * factor, v[2] * factor]
}
