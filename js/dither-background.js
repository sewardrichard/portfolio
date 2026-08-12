// Dither Background Shader (React Bits Dither Component implementation in Vanilla WebGL)
// Custom tuned with Banya Labs Design System Colors: Ledger Amber (#E57A1A) & Midnight Base (#0A0A0A)

(function () {
  function initDitherHero() {
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;

    // Check if canvas already exists
    if (document.getElementById('dither-canvas')) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'dither-canvas';
    canvas.className = 'absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40';
    heroSection.insertBefore(canvas, heroSection.firstChild);

    const gl = canvas.getContext('webgl', { antialias: false, preserveDrawingBuffer: false });
    if (!gl) return;

    const vsSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform float u_waveSpeed;
      uniform float u_waveFrequency;
      uniform float u_waveAmplitude;
      uniform vec3 u_waveColor;
      uniform vec2 u_mousePos;
      uniform int u_enableMouseInteraction;
      uniform float u_mouseRadius;
      uniform float u_colorNum;
      uniform float u_pixelSize;

      vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
      vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

      float cnoise(vec2 P) {
        vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
        vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
        Pi = mod289(Pi);
        vec4 ix = Pi.xzxz;
        vec4 iy = Pi.yyww;
        vec4 fx = Pf.xzxz;
        vec4 fy = Pf.yyww;
        vec4 i = permute(permute(ix) + iy);
        vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
        vec4 gy = abs(gx) - 0.5;
        vec4 tx = floor(gx + 0.5);
        gx = gx - tx;
        vec2 g00 = vec2(gx.x, gy.x);
        vec2 g10 = vec2(gx.y, gy.y);
        vec2 g01 = vec2(gx.z, gy.z);
        vec2 g11 = vec2(gx.w, gy.w);
        vec4 norm = taylorInvSqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
        g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
        float n00 = dot(g00, vec2(fx.x, fy.x));
        float n10 = dot(g10, vec2(fx.y, fy.y));
        float n01 = dot(g01, vec2(fx.z, fy.z));
        float n11 = dot(g11, vec2(fx.w, fy.w));
        vec2 fade_xy = fade(Pf.xy);
        vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
        return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
      }

      float fbm(vec2 p) {
        float value = 0.0;
        float amp = 1.0;
        float freq = u_waveFrequency;
        for (int i = 0; i < 4; i++) {
          value += amp * abs(cnoise(p));
          p *= freq;
          amp *= u_waveAmplitude;
        }
        return value;
      }

      float pattern(vec2 p) {
        vec2 p2 = p - u_time * u_waveSpeed;
        return fbm(p + fbm(p2)); 
      }

      float bayerMatrix8x8(vec2 uv) {
        vec2 coord = floor(mod(uv, 8.0));
        int index = int(coord.y * 8.0 + coord.x);
        if (index == 0) return 0.0/64.0;   if (index == 1) return 48.0/64.0;  if (index == 2) return 12.0/64.0;  if (index == 3) return 60.0/64.0;
        if (index == 4) return 3.0/64.0;   if (index == 5) return 51.0/64.0;  if (index == 6) return 15.0/64.0;  if (index == 7) return 63.0/64.0;
        if (index == 8) return 32.0/64.0;  if (index == 9) return 16.0/64.0;  if (index == 10) return 44.0/64.0; if (index == 11) return 28.0/64.0;
        if (index == 12) return 35.0/64.0; if (index == 13) return 19.0/64.0; if (index == 14) return 47.0/64.0; if (index == 15) return 31.0/64.0;
        if (index == 16) return 8.0/64.0;  if (index == 17) return 56.0/64.0; if (index == 18) return 4.0/64.0;  if (index == 19) return 52.0/64.0;
        if (index == 20) return 11.0/64.0; if (index == 21) return 59.0/64.0; if (index == 22) return 7.0/64.0;  if (index == 23) return 55.0/64.0;
        if (index == 24) return 40.0/64.0; if (index == 25) return 24.0/64.0; if (index == 26) return 36.0/64.0; if (index == 27) return 20.0/64.0;
        if (index == 28) return 43.0/64.0; if (index == 29) return 27.0/64.0; if (index == 30) return 39.0/64.0; if (index == 31) return 23.0/64.0;
        if (index == 32) return 2.0/64.0;  if (index == 33) return 50.0/64.0; if (index == 34) return 14.0/64.0; if (index == 35) return 62.0/64.0;
        if (index == 36) return 1.0/64.0;  if (index == 37) return 49.0/64.0; if (index == 38) return 13.0/64.0; if (index == 39) return 61.0/64.0;
        if (index == 40) return 34.0/64.0; if (index == 41) return 18.0/64.0; if (index == 42) return 46.0/64.0; if (index == 43) return 30.0/64.0;
        if (index == 44) return 33.0/64.0; if (index == 45) return 17.0/64.0; if (index == 46) return 45.0/64.0; if (index == 47) return 29.0/64.0;
        if (index == 48) return 10.0/64.0; if (index == 49) return 58.0/64.0; if (index == 50) return 6.0/64.0;  if (index == 51) return 54.0/64.0;
        if (index == 52) return 9.0/64.0;  if (index == 53) return 57.0/64.0; if (index == 54) return 5.0/64.0;  if (index == 55) return 53.0/64.0;
        if (index == 56) return 42.0/64.0; if (index == 57) return 26.0/64.0; if (index == 58) return 38.0/64.0; if (index == 59) return 22.0/64.0;
        if (index == 60) return 41.0/64.0; if (index == 61) return 25.0/64.0; if (index == 62) return 37.0/64.0; return 21.0/64.0;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 st = uv - 0.5;
        st.x *= u_resolution.x / u_resolution.y;

        float f = pattern(st);

        if (u_enableMouseInteraction == 1) {
          vec2 mouseNDC = (u_mousePos / u_resolution - 0.5) * vec2(1.0, -1.0);
          mouseNDC.x *= u_resolution.x / u_resolution.y;
          float dist = length(st - mouseNDC);
          float effect = 1.0 - smoothstep(0.0, u_mouseRadius, dist);
          f -= 0.5 * effect;
        }

        vec3 col = mix(vec3(0.039, 0.039, 0.039), u_waveColor, f);

        // Apply Bayer 8x8 Dithering Pass
        vec2 scaledCoord = floor(gl_FragCoord.xy / u_pixelSize);
        float threshold = bayerMatrix8x8(scaledCoord) - 0.25;
        float stepVal = 1.0 / (u_colorNum - 1.0);
        col += threshold * stepVal;
        col = clamp(col - 0.15, 0.0, 1.0);
        col = floor(col * (u_colorNum - 1.0) + 0.5) / (u_colorNum - 1.0);

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function createShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Dither Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Dither Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Full screen quad buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const u_resolution = gl.getUniformLocation(program, 'u_resolution');
    const u_time = gl.getUniformLocation(program, 'u_time');
    const u_waveSpeed = gl.getUniformLocation(program, 'u_waveSpeed');
    const u_waveFrequency = gl.getUniformLocation(program, 'u_waveFrequency');
    const u_waveAmplitude = gl.getUniformLocation(program, 'u_waveAmplitude');
    const u_waveColor = gl.getUniformLocation(program, 'u_waveColor');
    const u_mousePos = gl.getUniformLocation(program, 'u_mousePos');
    const u_enableMouseInteraction = gl.getUniformLocation(program, 'u_enableMouseInteraction');
    const u_mouseRadius = gl.getUniformLocation(program, 'u_mouseRadius');
    const u_colorNum = gl.getUniformLocation(program, 'u_colorNum');
    const u_pixelSize = gl.getUniformLocation(program, 'u_pixelSize');

    // Design System Values (Ledger Amber: #E57A1A -> RGB [0.898, 0.478, 0.102])
    const waveColor = [0.898, 0.478, 0.102];
    const waveSpeed = 0.04;
    const waveFrequency = 2.5;
    const waveAmplitude = 0.3;
    const colorNum = 4.0;
    const pixelSize = 2.5;
    const mouseRadius = 0.8;

    let mouseX = 0, mouseY = 0;
    let enableMouse = 1;

    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = heroSection.clientWidth;
      const height = heroSection.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    window.addEventListener('resize', resize);
    resize();

    const startTime = performance.now();
    function render() {
      const now = performance.now();
      const elapsed = (now - startTime) * 0.001;

      gl.useProgram(program);
      gl.uniform2f(u_resolution, canvas.width, canvas.height);
      gl.uniform1f(u_time, elapsed);
      gl.uniform1f(u_waveSpeed, waveSpeed);
      gl.uniform1f(u_waveFrequency, waveFrequency);
      gl.uniform1f(u_waveAmplitude, waveAmplitude);
      gl.uniform3f(u_waveColor, waveColor[0], waveColor[1], waveColor[2]);
      gl.uniform2f(u_mousePos, mouseX * (canvas.width / heroSection.clientWidth), mouseY * (canvas.height / heroSection.clientHeight));
      gl.uniform1i(u_enableMouseInteraction, enableMouse);
      gl.uniform1f(u_mouseRadius, mouseRadius);
      gl.uniform1f(u_colorNum, colorNum);
      gl.uniform1f(u_pixelSize, pixelSize);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(initDitherHero, 300));
  } else {
    setTimeout(initDitherHero, 300);
  }
})();
