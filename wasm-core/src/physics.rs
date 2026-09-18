//! Physics Engine: N-Body Gravity and Zero-G Rig Assembly Dynamics

pub struct Particle3D {
    pub pos: [f32; 3],
    pub vel: [f32; 3],
    pub mass: f32,
}

pub struct PhysicsWorld {
    pub particles: Vec<Particle3D>,
    pub gravity_center: [f32; 3],
    pub gravity_strength: f32,
    pub damping: f32,
}

impl PhysicsWorld {
    pub fn new(gravity_strength: f32, damping: f32) -> Self {
        Self {
            particles: Vec::new(),
            gravity_center: [0.0, 0.0, 0.0],
            gravity_strength,
            damping,
        }
    }

    pub fn add_particle(&mut self, pos: [f32; 3], vel: [f32; 3], mass: f32) {
        self.particles.push(Particle3D { pos, vel, mass });
    }

    pub fn step(&mut self, dt: f32) {
        for p in &mut self.particles {
            // Vector to gravity center
            let dx = self.gravity_center[0] - p.pos[0];
            let dy = self.gravity_center[1] - p.pos[1];
            let dz = self.gravity_center[2] - p.pos[2];
            let dist_sq = (dx * dx + dy * dy + dz * dz).max(0.1);
            let force = (self.gravity_strength * p.mass) / dist_sq;
            let dist = dist_sq.sqrt();

            let ax = force * (dx / dist);
            let ay = force * (dy / dist);
            let az = force * (dz / dist);

            p.vel[0] = (p.vel[0] + ax * dt) * self.damping;
            p.vel[1] = (p.vel[1] + ay * dt) * self.damping;
            p.vel[2] = (p.vel[2] + az * dt) * self.damping;

            p.pos[0] += p.vel[0] * dt;
            p.pos[1] += p.vel[1] * dt;
            p.pos[2] += p.vel[2] * dt;
        }
    }
}
