struct Uniforms {
  resolution: vec2f,
  pointer: vec2f,
  time: f32,
  spinRate: f32,
  diskTemperature: f32, // 0.5 (Warm Amber) to 1.5 (Hot Blue)
  lensingStrength: f32,
};

@group(0) @binding(0) var<uniform> u: Uniforms;

fn hash3(p: vec3f) -> f32 {
  var p3 = fract(p * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

// Procedural 3D noise for accretion disk plasma
fn noise3d(p: vec3f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u_smooth = f * f * (3.0 - 2.0 * f);
  
  return mix(
    mix(
      mix(hash3(i + vec3f(0.0, 0.0, 0.0)), hash3(i + vec3f(1.0, 0.0, 0.0)), u_smooth.x),
      mix(hash3(i + vec3f(0.0, 1.0, 0.0)), hash3(i + vec3f(1.0, 1.0, 0.0)), u_smooth.x),
      u_smooth.y
    ),
    mix(
      mix(hash3(i + vec3f(0.0, 0.0, 1.0)), hash3(i + vec3f(1.0, 0.0, 1.0)), u_smooth.x),
      mix(hash3(i + vec3f(0.0, 1.0, 1.0)), hash3(i + vec3f(1.0, 1.0, 1.0)), u_smooth.x),
      u_smooth.y
    ),
    u_smooth.z
  );
}

fn fbm(p: vec3f) -> f32 {
  var v = 0.0;
  var a = 0.5;
  var shift = vec3f(100.0);
  var pos = p;
  for (var i = 0; i < 4; i++) {
    v += a * noise3d(pos);
    pos = pos * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

// Background distorted stars
fn backgroundStars(dir: vec3f) -> vec3f {
  let p = dir * 150.0;
  let h = hash3(floor(p));
  if (h > 0.985) {
    let brightness = pow((h - 0.985) / 0.015, 6.0);
    return vec3f(brightness * 1.5);
  }
  return vec3f(0.005, 0.008, 0.018); // Deep space cosmic void
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let aspect = u.resolution.x / max(u.resolution.y, 1.0);
  let p = (uv - 0.5) * vec2f(aspect, 1.0);
  
  // Camera angles derived from pointer
  let yaw = (u.pointer.x - 0.5) * 4.0;
  let pitch = clamp((u.pointer.y - 0.5) * 2.5 + 0.35, -1.2, 1.2);
  
  let camDist = 7.5;
  let camPos = vec3f(
    camDist * sin(yaw) * cos(pitch),
    camDist * sin(pitch),
    camDist * cos(yaw) * cos(pitch)
  );
  
  let target = vec3f(0.0, 0.0, 0.0);
  let forward = normalize(target - camPos);
  let right = normalize(cross(forward, vec3f(0.0, 1.0, 0.0)));
  let up = cross(right, forward);
  
  var rayDir = normalize(forward * 1.8 + right * p.x + up * p.y);
  var rayPos = camPos;
  
  let rs = 1.0; // Schwarzschild Radius
  let photonSphere = rs * 1.5;
  
  var diskAccum = vec3f(0.0);
  var diskAlpha = 0.0;
  var hitHorizon = false;
  
  let maxSteps = 90;
  let dt = 0.12;
  
  for (var i = 0; i < maxSteps; i++) {
    let r = length(rayPos);
    
    // Check Event Horizon collision (Singularity capture)
    if (r < rs) {
      hitHorizon = true;
      break;
    }
    
    // Gravitational light deflection (Einstein geodesic curve)
    let accel = -1.5 * u.lensingStrength * rs / (r * r * r) * rayPos;
    rayDir = normalize(rayDir + accel * dt);
    
    let prevPos = rayPos;
    rayPos += rayDir * dt;
    
    // Accretion Disk intersection (Y = 0 plane)
    if ((prevPos.y * rayPos.y) < 0.0) {
      let tPlane = -prevPos.y / (rayPos.y - prevPos.y);
      let hitPos = mix(prevPos, rayPos, tPlane);
      let distDisk = length(hitPos.xz);
      
      let innerR = rs * 2.2;
      let outerR = rs * 6.5;
      
      if (distDisk >= innerR && distDisk <= outerR) {
        let angle = atan2(hitPos.z, hitPos.x);
        
        // Keplerian angular velocity (plasma rotates faster near singularity)
        let omega = 1.8 / pow(distDisk, 1.5) * u.spinRate;
        let rotAngle = angle - u.time * omega;
        
        let samplePos = vec3f(cos(rotAngle) * distDisk, 0.0, sin(rotAngle) * distDisk);
        let plasmaDensity = fbm(samplePos * 1.8 + vec3f(0.0, u.time * 0.2, 0.0));
        
        let radialFade = smoothstep(innerR, innerR + 0.4, distDisk) * smoothstep(outerR, outerR - 1.2, distDisk);
        let intensity = plasmaDensity * radialFade * 2.2;
        
        // Relativistic Doppler Beaming: Approaching side (cross with ray) blue-shifted & amplified
        let orbitalVel = vec3f(-sin(angle), 0.0, cos(angle));
        let dopplerFactor = dot(orbitalVel, -rayDir) * 0.4 + 1.0;
        let beamedIntensity = intensity * pow(dopplerFactor, 3.0);
        
        // Temperature Color Palette: Hot inner white-cyan -> warm amber -> deep crimson
        let temp = (1.0 - (distDisk - innerR) / (outerR - innerR)) * u.diskTemperature;
        var plasmaColor = vec3f(1.0, 0.4, 0.1); // Warm orange
        if (temp > 0.6) {
          plasmaColor = mix(vec3f(1.0, 0.55, 0.2), vec3f(0.8, 0.95, 1.2), (temp - 0.6) / 0.4);
        } else {
          plasmaColor = mix(vec3f(0.8, 0.15, 0.05), vec3f(1.0, 0.55, 0.2), temp / 0.6);
        }
        
        let stepColor = plasmaColor * beamedIntensity;
        let stepAlpha = clamp(intensity * 0.65, 0.0, 1.0);
        
        diskAccum += stepColor * (1.0 - diskAlpha);
        diskAlpha += stepAlpha * (1.0 - diskAlpha);
      }
    }
  }
  
  var finalColor = diskAccum;
  
  if (!hitHorizon) {
    let starColor = backgroundStars(rayDir);
    finalColor += starColor * (1.0 - diskAlpha);
  }
  
  // Photon Ring Luminescence at r ~ 1.5 rs
  let minRayDist = length(cross(camPos, rayDir));
  if (minRayDist > rs && minRayDist < photonSphere * 1.35) {
    let ringGlow = exp(-pow(minRayDist - photonSphere, 2.0) * 120.0) * 1.8;
    finalColor += vec3f(1.0, 0.9, 0.7) * ringGlow;
  }
  
  return vec4f(finalColor, 1.0);
}
