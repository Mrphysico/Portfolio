//! Quaternion Julia Set 4D Slice Mathematics
//! Computes 4D quaternion iterations and 3D slice distance estimators for raymarching.

use crate::math4d::Vec4;

/// Quaternion multiplication: q1 * q2
pub fn quat_mul(q1: &Vec4, q2: &Vec4) -> Vec4 {
    let (x1, y1, z1, w1) = (q1[0], q1[1], q1[2], q1[3]);
    let (x2, y2, z2, w2) = (q2[0], q2[1], q2[2], q2[3]);

    [
        x1 * x2 - y1 * y2 - z1 * z2 - w1 * w2,
        x1 * y2 + y1 * x2 + z1 * w2 - w1 * z2,
        x1 * z2 - y1 * w2 + z1 * x2 + w1 * y2,
        x1 * w2 + y1 * z2 - z1 * y2 + w1 * x2,
    ]
}

/// Quaternion square: q^2
pub fn quat_sq(q: &Vec4) -> Vec4 {
    let (x, y, z, w) = (q[0], q[1], q[2], q[3]);
    let v_dot_v = y * y + z * z + w * w;
    [
        x * x - v_dot_v,
        2.0 * x * y,
        2.0 * x * z,
        2.0 * x * w,
    ]
}

/// Distance estimator for 4D Quaternion Julia set at point p with constant c
pub fn julia4d_distance_estimator(p: &Vec4, c: &Vec4, max_iter: usize) -> f32 {
    let mut z = *p;
    let mut dz_len = 1.0f32;
    let mut r = 0.0f32;

    for _ in 0..max_iter {
        r = (z[0] * z[0] + z[1] * z[1] + z[2] * z[2] + z[3] * z[3]).sqrt();
        if r > 4.0 {
            break;
        }

        // Derivative: dz = 2.0 * z * dz
        dz_len = 2.0 * r * dz_len;

        // z = z^2 + c
        let z_sq = quat_sq(&z);
        z = [
            z_sq[0] + c[0],
            z_sq[1] + c[1],
            z_sq[2] + c[2],
            z_sq[3] + c[3],
        ];
    }

    if dz_len == 0.0 {
        0.0
    } else {
        0.5 * r * r.ln() / dz_len
    }
}
