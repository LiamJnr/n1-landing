// export function liquidShader() {
//   const canvas = document.getElementById("hero-canvas");
//   const gl = canvas.getContext("webgl");
//   const heroSection = document.querySelector(".hero-section");

//   if (!gl) {
//     console.error("WebGL not supported");
//     return;
//   }

//   function resize() {
//     const displayWidth = heroSection.clientWidth;
//     const displayHeight = heroSection.clientHeight;

//     if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
//       canvas.width = displayWidth;
//       canvas.height = displayHeight;
//       gl.viewport(0, 0, canvas.width, canvas.height);
//     }
//   }

//   window.addEventListener("resize", resize);
//   resize();

//   const vertex = `
//     attribute vec2 position;
//     void main() {
//       gl_Position = vec4(position, 0.0, 1.0);
//     }
//   `;

//   const fragment = `
//     precision highp float;

//     uniform vec2  iResolution;
//     uniform float iTime;

//     // --- hash & smooth noise helpers ---
//     vec2 hash2(vec2 p) {
//       p = vec2(dot(p, vec2(127.1, 311.7)),
//                dot(p, vec2(269.5, 183.3)));
//       return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
//     }

//     // Gradient noise (returns -1..1)
//     float gnoise(vec2 p) {
//       vec2 i = floor(p);
//       vec2 f = fract(p);
//       vec2 u = f * f * (3.0 - 2.0 * f);

//       return mix(mix(dot(hash2(i + vec2(0,0)), f - vec2(0,0)),
//                      dot(hash2(i + vec2(1,0)), f - vec2(1,0)), u.x),
//                  mix(dot(hash2(i + vec2(0,1)), f - vec2(0,1)),
//                      dot(hash2(i + vec2(1,1)), f - vec2(1,1)), u.x), u.y);
//     }

//     // Fractional Brownian Motion — stacks octaves of noise
//     float fbm(vec2 p) {
//       float v = 0.0;
//       float a = 0.5;
//       vec2  shift = vec2(100.0);
//       mat2  rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
//       for (int i = 0; i < 6; i++) {
//         v += a * gnoise(p);
//         p  = rot * p * 2.0 + shift;
//         a *= 0.5;
//       }
//       return v;
//     }

//     void main() {
//       vec2 uv = gl_FragCoord.xy / iResolution.xy;

//       // Aspect-correct centred coords
//       vec2 q = uv - 0.5;
//       q.x *= iResolution.x / iResolution.y;

//       float t = iTime * 0.18;

//       // Domain warping: feed fbm back into itself twice
//       vec2 p = q * 2.8;
//       vec2 r;

//       r.x = fbm(p + vec2(0.00, 0.00) + t);
//       r.y = fbm(p + vec2(5.20, 1.30) + t);

//       vec2 s;
//       s.x = fbm(p + 4.0 * r + vec2(1.70, 9.20) + 0.15 * t);
//       s.y = fbm(p + 4.0 * r + vec2(8.30, 2.80) + 0.15 * t);

//       float f = fbm(p + 4.0 * s);

//       // Map warp value to palette
//       float v = clamp((f * f * 4.0 + 0.7 * f + 0.2) * 0.6, 0.0, 1.0);

//       // Deep-ocean colour palette: midnight → teal → electric cyan → ghostly white
//       vec3 col = mix(
//         vec3(0.00, 0.02, 0.10),   // abyss black-blue
//         vec3(0.00, 0.24, 0.38),   // deep teal
//         clamp(v * 2.0, 0.0, 1.0)
//       );
//       col = mix(col,
//         vec3(0.00, 0.60, 0.75),   // bioluminescent cyan
//         clamp(v * 2.0 - 0.5, 0.0, 1.0)
//       );
//       col = mix(col,
//         vec3(0.38, 0.95, 1.00),   // bright cyan filament
//         clamp(v * 2.0 - 1.0, 0.0, 1.0)
//       );
//       col = mix(col,
//         vec3(0.85, 1.00, 1.00),   // ghostly white core
//         clamp(v * 3.5 - 2.8, 0.0, 1.0)
//       );

//       // Subtle violet bloom from the edges
//       float bloom = smoothstep(0.55, 0.0, length(q));
//       col += vec3(0.02, 0.00, 0.08) * (1.0 - bloom);

//       // Faint vignette
//       float vig = 1.0 - dot(q * 1.1, q * 1.1);
//       col *= clamp(vig, 0.0, 1.0);

//       // Soft luminance boost on bright areas
//       float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
//       col += col * lum * 0.4;

//       // Bottom prominence — glow concentrates at the bottom of the canvas
//       // uv.y = 0 at bottom in WebGL, so (1.0 - uv.y) = 1.0 at bottom
//       float bottomFade = pow(1.0 - uv.y, 1.5);
//       // Keep a tiny ambient at the top so it's not fully dead
//       float verticalMask = bottomFade * 0.94 + 0.06;
//       col *= verticalMask;

//       gl_FragColor = vec4(col, 1.0);
//     }
//   `;

//   function compile(type, source) {
//     const s = gl.createShader(type);
//     gl.shaderSource(s, source);
//     gl.compileShader(s);
//     if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
//       console.error(gl.getShaderInfoLog(s));
//     }
//     return s;
//   }

//   const program = gl.createProgram();
//   gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
//   gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
//   gl.linkProgram(program);
//   gl.useProgram(program);

//   const buffer = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

//   const position = gl.getAttribLocation(program, "position");
//   gl.enableVertexAttribArray(position);
//   gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

//   const resolutionLoc = gl.getUniformLocation(program, "iResolution");
//   const timeLoc = gl.getUniformLocation(program, "iTime");

//   let start = performance.now();

//   function render() {
//     const t = (performance.now() - start) / 1000;
//     gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
//     gl.uniform1f(timeLoc, t);
//     gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
//     requestAnimationFrame(render);
//   }

//   render();
// }



export function liquidShader() {
  const canvas = document.getElementById("hero-canvas");
  const gl = canvas.getContext("webgl", {
    alpha: false,          // no alpha compositing needed — skip blending
    antialias: false,      // fullscreen quad doesn't benefit from MSAA
    depth: false,          // 2D shader — no depth buffer needed
    stencil: false,
    preserveDrawingBuffer: false,
  });
  const heroSection = document.querySelector(".hero-section");

  if (!gl) {
    console.error("WebGL not supported");
    return;
  }

  // --- Resolution scaling ---
  // Cap pixel ratio to avoid rendering millions of extra pixels on hi-DPI displays.
  // 1.5 is a good sweet-spot: still looks sharp, but ~56% fewer pixels than dpr 2.
  const MAX_DPR = 1.5;
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

  function resize() {
    const displayWidth = (heroSection.clientWidth * dpr) | 0;
    const displayHeight = (heroSection.clientHeight * dpr) | 0;

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
  }

  // Debounce resize so we don't thrash during window drag
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 100);
  });
  resize();

  // --- Visibility control ---
  // Stop the render loop entirely when the canvas is off-screen.
  let isVisible = true;
  let rafId = null;

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && rafId === null) {
          rafId = requestAnimationFrame(render);
        }
      },
      { threshold: 0 }
    );
    observer.observe(canvas);
  }

  // Also pause when tab is hidden
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      isVisible = false;
    } else {
      isVisible = true;
      if (rafId === null) {
        rafId = requestAnimationFrame(render);
      }
    }
  });

  const vertex = `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const fragment = `
    precision mediump float;

    uniform vec2  iResolution;
    uniform float iTime;

    // --- Cheaper hash: avoids sin() entirely ---
    // Uses purely algebraic operations which are much faster on mobile GPUs.
    vec2 hash2(vec2 p) {
      vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
      q += dot(q, q.yxz + 33.33);
      return -1.0 + 2.0 * fract((q.xx + q.yz) * q.zy);
    }

    // Gradient noise (returns -1..1)
    float gnoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);

      return mix(mix(dot(hash2(i),              f),
                     dot(hash2(i + vec2(1, 0)), f - vec2(1, 0)), u.x),
                 mix(dot(hash2(i + vec2(0, 1)), f - vec2(0, 1)),
                     dot(hash2(i + vec2(1, 1)), f - vec2(1, 1)), u.x), u.y);
    }

    // FBM — reduced from 6 to 4 octaves.
    // Pre-computed rotation: cos(0.5)=0.8776, sin(0.5)=0.4794
    const mat2 ROT = mat2(0.8776, 0.4794, -0.4794, 0.8776);

    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 4; i++) {
        v += a * gnoise(p);
        p  = ROT * p * 2.0 + 100.0;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / iResolution.xy;

      // Aspect-correct centred coords
      vec2 q = uv - 0.5;
      q.x *= iResolution.x / iResolution.y;

      float t = iTime * 0.18;

      // Domain warping — simplified from two-pass to one-pass.
      // Instead of 5 fbm calls (r.x, r.y, s.x, s.y, f), we now use 3.
      vec2 p = q * 2.8;

      float r = fbm(p + t);
      float s = fbm(p + vec2(5.2, 1.3) + t);

      float f = fbm(p + 3.5 * vec2(r, s));

      // Map warp value to palette
      float v = clamp((f * f * 4.0 + 0.7 * f + 0.2) * 0.6, 0.0, 1.0);

      // Deep-ocean colour palette: midnight → teal → electric cyan → ghostly white
      float v2 = v * 2.0;
      vec3 col = mix(
        vec3(0.00, 0.02, 0.10),
        vec3(0.00, 0.24, 0.38),
        clamp(v2, 0.0, 1.0)
      );
      col = mix(col,
        vec3(0.00, 0.60, 0.75),
        clamp(v2 - 0.5, 0.0, 1.0)
      );
      col = mix(col,
        vec3(0.38, 0.95, 1.00),
        clamp(v2 - 1.0, 0.0, 1.0)
      );
      col = mix(col,
        vec3(0.85, 1.00, 1.00),
        clamp(v * 3.5 - 2.8, 0.0, 1.0)
      );

      // Subtle violet bloom from the edges
      float bloom = smoothstep(0.55, 0.0, length(q));
      col += vec3(0.02, 0.00, 0.08) * (1.0 - bloom);

      // Faint vignette
      vec2 qq = q * 1.1;
      col *= clamp(1.0 - dot(qq, qq), 0.0, 1.0);

      // Soft luminance boost on bright areas
      col *= 1.0 + dot(col, vec3(0.2126, 0.7152, 0.0722)) * 0.4;

      // Bottom prominence — glow concentrates at the bottom
      float bottomFade = (1.0 - uv.y);
      bottomFade *= bottomFade;       // cheaper than pow(x, 1.5), close visual result
      col *= bottomFade * 0.94 + 0.06;

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  function compile(type, source) {
    const s = gl.createShader(type);
    gl.shaderSource(s, source);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(s));
    }
    return s;
  }

  const program = gl.createProgram();
  gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
  gl.linkProgram(program);
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

  const position = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const resolutionLoc = gl.getUniformLocation(program, "iResolution");
  const timeLoc = gl.getUniformLocation(program, "iTime");

  const start = performance.now();

  function render() {
    if (!isVisible) {
      rafId = null;
      return;           // stop the loop — will restart via observer/visibilitychange
    }

    const t = (performance.now() - start) / 1000;
    gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
    gl.uniform1f(timeLoc, t);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    rafId = requestAnimationFrame(render);
  }

  render();
}

