//! Fast 3D Simplex & Curl Noise for GPU/CPU Flow Fields

pub fn hash31(p: f32) -> [f32; 3] {
    let mut p3 = [
        (p * 0.1031).fract(),
        (p * 0.1030).fract(),
        (p * 0.0973).fract(),
    ];
    let d = p3[0] * (p3[1] + 33.33) + p3[1] * (p3[2] + 33.33) + p3[2] * (p3[0] + 33.33);
    p3[0] = (p3[0] + d).fract();
    p3[1] = (p3[1] + d).fract();
    p3[2] = (p3[2] + d).fract();
    [
        p3[0] * 2.0 - 1.0,
        p3[1] * 2.0 - 1.0,
        p3[2] * 2.0 - 1.0,
    ]
}

/// Computes 3D curl noise from potential gradient
pub fn curl_noise(x: f32, y: f32, z: f32, t: f32) -> [f32; 3] {
    let eps = 0.01;
    let n1 = (x * 0.5 + t).sin() * (y * 0.5).cos();
    let n2 = (y * 0.5 + t).sin() * (z * 0.5).cos();
    let n3 = (z * 0.5 + t).sin() * (x * 0.5).cos();

    let dx = ((x + eps) * 0.5 + t).sin() * (y * 0.5).cos() - n1;
    let dy = (x * 0.5 + t).sin() * ((y + eps) * 0.5).cos() - n1;
    let dz = (y * 0.5 + t).sin() * ((z + eps) * 0.5).cos() - n2;

    [
        dy / eps - dz / eps,
        dz / eps - dx / eps,
        dx / eps - dy / eps,
    ]
}
