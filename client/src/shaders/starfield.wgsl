struct Uniforms {
  resolution: vec2f,
  pointer: vec2f,
  time: f32,
  intensity: f32,
};

@group(0) @binding(0) var<uniform> u: Uniforms;

fn hash21(p: vec2f) -> f32 {
  var p3 = fract(vec3f(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

fn hash22(p: vec2f) -> vec2f {
  var p3 = fract(vec3f(p.xyx) * vec3f(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}

// Procedural star layer with gravitational repulsion
fn starLayer(uv: vec2f, scale: f32, timeOffset: f32, mousePos: vec2f) -> vec3f {
  var col = vec3f(0.0);
  let gv = fract(uv * scale) - 0.5;
  let id = floor(uv * scale);
  
  let p = hash22(id) - 0.5;
  
  // Gravitational repulsion from cursor
  let worldStar = (id + p + 0.5) / scale;
  let toMouse = mousePos - worldStar;
  let mouseDist = length(toMouse);
  var offset = vec2f(0.0);
  if (mouseDist < 0.25 && mouseDist > 0.001) {
    let force = (0.25 - mouseDist) * 0.4;
    offset = -normalize(toMouse) * force;
  }
  
  let d = length(gv - p - offset * scale);
  
  let starRand = hash21(id);
  let twinkle = sin(u.time * (2.0 + starRand * 4.0) + timeOffset + starRand * 6.28) * 0.5 + 0.5;
  let size = (0.015 + starRand * 0.035) * (0.6 + twinkle * 0.4);
  
  let brightness = smoothstep(size, 0.0, d);
  let glow = exp(-d * 35.0) * 0.4 * twinkle;
  
  // Starlight spectral tint (white, cyan, violet, gold)
  var starColor = vec3f(1.0, 1.0, 1.0);
  if (starRand < 0.25) {
    starColor = vec3f(0.55, 0.8, 1.0); // Cyan
  } else if (starRand < 0.5) {
    starColor = vec3f(0.85, 0.65, 1.0); // Violet
  } else if (starRand < 0.75) {
    starColor = vec3f(1.0, 0.85, 0.6); // Amber gold
  }
  
  col += (brightness + glow) * starColor;
  return col;
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let aspect = u.resolution.x / max(u.resolution.y, 1.0);
  let p = uv * vec2f(aspect, 1.0);
  let mouse = u.pointer * vec2f(aspect, 1.0);
  
  var color = vec3f(0.0);
  
  // 3 Parallax Star Layers (distant, mid-field, foreground)
  color += starLayer(p + vec2f(u.time * 0.001, 0.0), 35.0, 0.0, mouse) * 0.6;
  color += starLayer(p + vec2f(u.time * 0.003, u.time * 0.001), 60.0, 1.5, mouse) * 0.85;
  color += starLayer(p + vec2f(u.time * 0.006, 0.0), 100.0, 3.0, mouse) * 0.5;
  
  // Subtle deep-space cosmic nebula gradient
  let nebulaDist = length(uv - vec2f(0.5, 0.3));
  let nebulaGlow = exp(-nebulaDist * 2.0) * vec3f(0.06, 0.02, 0.12);
  color += nebulaGlow;
  
  return vec4f(color, 1.0);
}
