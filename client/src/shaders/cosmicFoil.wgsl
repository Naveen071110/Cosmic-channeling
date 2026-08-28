struct Uniforms {
  resolution: vec2f,
  pointer: vec2f,
  time: f32,
  archetypeFrequency: f32,
  auraColor: vec3f,
};

@group(0) @binding(0) var<uniform> u: Uniforms;

// High-speed GPU hash for stardust particle sparkle
fn hash(p: vec2f) -> f32 {
  var p3 = fract(vec3f(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

// Thin-film optical interference spectrum
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
  let p = (uv - 0.5) * vec2f(aspect, 1.0);
  
  // Optical reflection vector derived from mouse position
  let dist = length(p);
  let angle = atan2(p.y, p.x);
  
  // Multi-layer thin-film wave interference
  let wave1 = sin(dist * 28.0 - u.time * 1.2) * 0.5 + 0.5;
  let wave2 = cos(angle * 5.0 + u.pointer.x * 4.0) * 0.5 + 0.5;
  let interference = (wave1 + wave2) * 0.5;
  
  // Iridescent rainbow sheen modulated by archetype frequency
  let freqOffset = (u.archetypeFrequency - 400.0) / 600.0;
  let foil = spectralPalette(interference * 1.3 + freqOffset + u.pointer.y * 0.3);
  
  // Stardust glitter particles
  let starNoise = pow(hash(uv * u.resolution * 0.4 + vec2f(u.time * 0.04)), 20.0) * 2.2;
  
  // Celestial Aura Glow radiating from center
  let aura = exp(-dist * 2.5) * u.auraColor;
  
  // Composite final iridescent layer
  let finalColor = mix(aura, foil, 0.38) + vec3f(starNoise);
  
  return vec4f(finalColor, 0.85);
}
