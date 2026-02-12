// export function liquidShader() {

//     const canvas = document.getElementById("hero-canvas");
//     const gl = canvas.getContext("webgl");
//     const heroSection = document.querySelector(".hero-section");

//     function resize() {
//       const displayWidth  = heroSection.clientWidth;
//       const displayHeight = heroSection.clientHeight;

//       // Only resize the drawing buffer if the size actually changed
//       if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
//         canvas.width  = displayWidth;
//         canvas.height = displayHeight;
//         gl.viewport(0, 0, canvas.width, canvas.height);
//       }
//     }

//     window.addEventListener("resize", resize);
//     resize();
    
//     const vertex = `
//     attribute vec2 position;
//     void main() {
//       gl_Position = vec4(position, 0.0, 1.0);
//     }
//     `;
    
//     const fragment = `
//     precision highp float;
    
//     uniform vec2 iResolution;
//     uniform float iTime;
    
//     void main() {
//       vec2 fragCoord = gl_FragCoord.xy;
    
//       float mr = min(iResolution.x, iResolution.y);
//       vec2 uv = (fragCoord * 2.0 - iResolution.xy) / mr;
    
//       float d = -iTime * 1.5;   // faster animation
//       float a = 0.0;
    
//       for (float i = 0.0; i < 12.0; ++i) { // more detail
//           a += cos(i - d - a * uv.x);
//           d += sin(uv.y * i + a);
//       }
    
//       d += iTime * 1.5;
    
//       vec3 col = vec3(
//           cos(uv * vec2(d, a)) * 0.6 + 0.4,
//           cos(a + d) * 0.5 + 0.5
//       );
    
//       col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5);
    
//       gl_FragColor = vec4(col, 1.0);
      
//       }
//     `;
      
//     //   float gray = dot(col, vec3(0.333)); // average RGB
//     //   gl_FragColor = vec4(vec3(gray), 1.0);
    
//     function compile(type, source) {
//       const s = gl.createShader(type);
//       gl.shaderSource(s, source);
//       gl.compileShader(s);
//       return s;
//     }
    
//     const program = gl.createProgram();
//     gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
//     gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
//     gl.linkProgram(program);
//     gl.useProgram(program);
    
//     const buffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
//     gl.bufferData(
//       gl.ARRAY_BUFFER,
//       new Float32Array([
//         -1, -1,
//          1, -1,
//         -1,  1,
//          1,  1
//       ]),
//       gl.STATIC_DRAW
//     );
    
//     const position = gl.getAttribLocation(program, "position");
//     gl.enableVertexAttribArray(position);
//     gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    
//     const resolutionLoc = gl.getUniformLocation(program, "iResolution");
//     const timeLoc = gl.getUniformLocation(program, "iTime");
    
//     let start = performance.now();
    
//     function render() {
//       const t = (performance.now() - start) / 1000;
    
//       gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
//       gl.uniform1f(timeLoc, t);
    
//       gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
//       requestAnimationFrame(render);
//     }
    
//     render();
// }


export function liquidShader() {
  const canvas = document.getElementById("hero-canvas");
  const gl = canvas.getContext("webgl");
  const heroSection = document.querySelector(".hero-section");

  function resize() {
    const displayWidth = heroSection.clientWidth;
    const displayHeight = heroSection.clientHeight;

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
  }

  window.addEventListener("resize", resize);
  resize();

  const vertex = `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const fragment = `
  precision highp float;
  uniform vec2 iResolution;
  uniform float iTime;

  void main() {
    vec2 fragCoord = gl_FragCoord.xy;
    float mr = min(iResolution.x, iResolution.y);
    vec2 uv = (fragCoord * 2.0 - iResolution.xy) / mr;

    float d = -iTime * 0.8; // Slightly slower for a more premium feel
    float a = 0.0;

    for (float i = 0.0; i < 12.0; ++i) {
      a += cos(i - d - a * uv.x);
      d += sin(uv.y * i + a);
    }

    // Calculate a base intensity from the interference pattern
    float intensity = cos(d + a) * 0.5 + 0.5;
    
    // Enhance the "dark" feel by squaring the intensity (levels adjustment)
    intensity = pow(intensity, 2.0);

    // Map intensity to shades of black/dark grey
    // 0.0 is pure black, 0.3 is a deep charcoal
    vec3 col = vec3(intensity * 0.25); 

    // Add a subtle 'sheen' using the 'd' variable for some specular-like highlights
    float sheen = smoothstep(0.4, 0.9, cos(d * 0.5) * 0.5 + 0.5);
    col += sheen * 0.05;

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

  let start = performance.now();

  function render() {
    const t = (performance.now() - start) / 1000;
    gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
    gl.uniform1f(timeLoc, t);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
  }

  render();
}