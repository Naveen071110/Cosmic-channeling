struct Uniforms {
  resolution: vec2f,
  time: f32,
  frequency: f32,
  audioEnergy: f32,
  modalN: f32,
  modalM: f32,
  paletteAura: vec3f,
};

@group(0) @binding(0) var<uniform> u: Uniforms;

fn spectralPalette(t: f32) -> vec3f {
  let a = vec3f(0.5, 0.5, 0.5);
  let b = vec3f(0.5, 0.5, 0.5);
  let c = vec3f(1.0, 1.0, 1.0);
  let d = vec3f(0.0, 0.33, 0.67);
  return a + b * cos(6.28318 * (c * t + d));
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let aspect = u.resolution.x / max(u.resolution.y, 1.0);
  let p = (uv - 0.5) * vec2f(aspect, 1.0) * 2.2;
  
  let r = length(p);
  let theta = atan2(p.y, p.x);
  
  // Circular Chladni boundary mask
  if (r > 1.05) {
    let edgeFade = smoothstep(1.15, 1.05, r);
    return vec4f(0.02, 0.03, 0.06, edgeFade * 0.4);
  }
  
  let n = u.modalN;
  let m = u.modalM;
  let pi = 3.14159265;
  
  // 2D Chladni Plate Vibration Field
  let term1 = cos(n * pi * p.x * 0.5) * cos(m * pi * p.y * 0.5);
  let term2 = cos(m * pi * p.x * 0.5) * cos(n * pi * p.y * 0.5);
  let chladniCartesian = term1 - term2;
  
  // Polar Cymatics Harmonic Ring Mode
  let radialMode = cos(r * pi * (n + 1.0) - u.time * 0.8) * sin(theta * m);
  
  // Combine Cartesian Grid & Radial Circular Modes
  let combinedField = mix(chladniCartesian, radialMode, 0.45);
  
  // Audio Energy Modulation
  let energyPulse = 1.0 + u.audioEnergy * 2.5;
  let nodalDistance = abs(combinedField);
  
  // Fine sacred geometry nodal lines (where sand/particles accumulate at zero vibration)
  let nodalLine = smoothstep(0.12 * energyPulse, 0.0, nodalDistance);
  let secondaryHarmonic = smoothstep(0.28, 0.05, nodalDistance) * 0.4;
  
  // Frequency phase color mapping
  let freqNorm = (u.frequency - 300.0) / 700.0;
  let colorSheen = spectralPalette(nodalDistance * 0.8 + freqNorm + u.time * 0.05);
  
  // Blend with Chakra Aura Color Theme
  let auraGlow = u.paletteAura * (nodalLine + secondaryHarmonic);
  let finalColor = mix(auraGlow, colorSheen, 0.3) + vec3f(pow(nodalLine, 3.0) * 0.8);
  
  // Outer brass plate boundary ring
  let plateRim = smoothstep(0.015, 0.0, abs(r - 1.0)) * 0.9;
  let rimColor = vec3f(0.85, 0.7, 0.4) * plateRim;
  
  let alpha = smoothstep(1.05, 0.98, r);
  return vec4f(finalColor + rimColor, alpha);
}
