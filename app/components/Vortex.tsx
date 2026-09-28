"use client";

import { useEffect, useRef } from "react";

// Nested generations contract by LAMBDA every PERIOD seconds, spinning up as they shrink.
const LAMBDA = 4 - Math.SQRT2;
const PERIOD = 16;
const GENS = 3;

// Burgers-type vortex in similarity variables: radial inflow, axial outflow, swirl with a unit core.
const ALPHA = 0.5;
const GAMMA = 9;
const Y_MAX = 3.4;
const MAX_PTS = 520;
const STRIDE = 8; // x y z t | u speed axial seed

const VERT = `#version 300 es
precision highp float;
layout(location=0) in vec2 a_corner;
layout(location=1) in vec4 a_p0;
layout(location=2) in vec4 a_q0;
layout(location=3) in vec4 a_p1;
layout(location=4) in vec4 a_q1;

uniform mat4 u_proj;
uniform mat4 u_view;
uniform vec2 u_res;
uniform vec2 u_shift;
uniform float u_scale;
uniform float u_rot;
uniform float u_tau;
uniform float u_gain;
uniform float u_width;
uniform float u_dist;

out float v_side;
out vec3 v_rgb;

vec3 place(vec3 p) {
  float c = cos(u_rot), s = sin(u_rot);
  return vec3(c * p.x - s * p.z, p.y, s * p.x + c * p.z) * u_scale;
}

void main() {
  if (a_q1.x < a_q0.x) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }

  vec3 w0 = place(a_p0.xyz);
  vec3 w1 = place(a_p1.xyz);
  vec4 c0 = u_proj * u_view * vec4(w0, 1.0);
  vec4 c1 = u_proj * u_view * vec4(w1, 1.0);
  c0.xy += u_shift * c0.w;
  c1.xy += u_shift * c1.w;

  vec2 s0 = c0.xy / c0.w * u_res;
  vec2 s1 = c1.xy / c1.w * u_res;
  vec2 d = s1 - s0;
  float len = length(d);
  vec2 n = len > 1e-5 ? vec2(-d.y, d.x) / len : vec2(0.0, 1.0);

  vec4 c = mix(c0, c1, a_corner.x);
  c.xy += n * a_corner.y * u_width / u_res * c.w;
  gl_Position = c;
  v_side = a_corner.y;

  float t = mix(a_p0.w, a_p1.w, a_corner.x);
  vec4 q = mix(a_q0, a_q1, a_corner.x);
  float x = fract((u_tau - t) / 2.6 + q.w * 7.0);
  float comet = exp(-x * 11.0);

  float ends = smoothstep(0.0, 0.14, q.x) * (1.0 - smoothstep(0.8, 1.0, q.x));
  float vz = -(u_view * vec4(mix(w0, w1, a_corner.x), 1.0)).z;
  float depth = mix(1.0, 0.35, smoothstep(u_dist - 3.0, u_dist + 4.0, vz));

  vec3 teal = vec3(0.50, 0.80, 0.84);
  vec3 ember = vec3(0.96, 0.70, 0.46);
  vec3 col = mix(teal, ember, smoothstep(0.6, 0.97, q.z) * 0.85);
  col = mix(col, vec3(1.0), comet * 0.6);
  v_rgb = col * (0.035 + 0.95 * comet) * ends * depth * u_gain;
}`;

const FRAG = `#version 300 es
precision mediump float;
in float v_side;
in vec3 v_rgb;
out vec4 o;
void main() {
  vec3 c = v_rgb * (1.0 - abs(v_side));
  o = vec4(c, max(c.r, max(c.g, c.b)));
}`;

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function vel(x: number, y: number, z: number, out: Float64Array) {
  const r2 = x * x + z * z;
  const swirl = r2 > 1e-9 ? (GAMMA * (1 - Math.exp(-r2))) / r2 : GAMMA;
  out[0] = -ALPHA * x - swirl * z;
  out[1] = 2 * ALPHA * y;
  out[2] = -ALPHA * z + swirl * x;
}

function buildLines(count: number) {
  const rand = rng(11);
  const out = new Float32Array(count * MAX_PTS * STRIDE);
  const k1 = new Float64Array(3);
  const k2 = new Float64Array(3);
  const k3 = new Float64Array(3);
  const k4 = new Float64Array(3);
  let n = 0;

  for (let i = 0; i < count; i++) {
    const r0 = 3.6 + 1.6 * rand();
    const a0 = rand() * Math.PI * 2;
    let x = r0 * Math.cos(a0);
    let z = r0 * Math.sin(a0);
    const sheath = rand() < 0.2;
    let y = (rand() < 0.5 ? -1 : 1) * (sheath ? 0.05 + 0.15 * rand() : 0.002 + 0.04 * rand() ** 2);
    const seed = rand();
    const start = n;
    let t = 0;

    for (let k = 0; k < MAX_PTS; k++) {
      vel(x, y, z, k1);
      const sp = Math.hypot(k1[0], k1[1], k1[2]);
      const o = n * STRIDE;
      out[o] = x;
      out[o + 1] = y;
      out[o + 2] = z;
      out[o + 3] = t;
      out[o + 5] = sp;
      out[o + 6] = Math.abs(k1[1]) / sp;
      out[o + 7] = seed;
      n++;
      if (Math.abs(y) > Y_MAX) break;

      const h = (0.014 + 0.03 * Math.min(Math.hypot(x, z), 3)) / sp;
      vel(x + 0.5 * h * k1[0], y + 0.5 * h * k1[1], z + 0.5 * h * k1[2], k2);
      vel(x + 0.5 * h * k2[0], y + 0.5 * h * k2[1], z + 0.5 * h * k2[2], k3);
      vel(x + h * k3[0], y + h * k3[1], z + h * k3[2], k4);
      x += (h / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
      y += (h / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
      z += (h / 6) * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]);
      t += h;
    }

    const len = n - start;
    for (let k = 0; k < len; k++) out[(start + k) * STRIDE + 4] = k / Math.max(1, len - 1);
  }
  return out.subarray(0, n * STRIDE);
}

function perspective(fovy: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fovy / 2);
  const nf = 1 / (near - far);
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * nf, -1,
    0, 0, 2 * far * near * nf, 0,
  ]);
}

function lookAt(ex: number, ey: number, ez: number) {
  let zl = Math.hypot(ex, ey, ez);
  const zx = ex / zl, zy = ey / zl, zz = ez / zl;
  // x = normalize(up × z), up = (0, 1, 0)
  let xx = zz, xz = -zx;
  zl = Math.hypot(xx, xz);
  xx /= zl;
  xz /= zl;
  const yx = zy * xz, yy = zz * xx - zx * xz, yz = -zy * xx;
  return new Float32Array([
    xx, yx, zx, 0,
    0, yy, zy, 0,
    xz, yz, zz, 0,
    -(xx * ex + xz * ez), -(yx * ex + yy * ey + yz * ez), -(zx * ex + zy * ey + zz * ez), 1,
  ]);
}

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
  return s;
}

export default function Vortex() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = canvas.getContext("webgl2", { antialias: false, alpha: true, premultipliedAlpha: true });
    if (!gl) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 720;
    const data = buildLines(small ? 200 : 380);
    const points = data.length / STRIDE;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    const U = (name: string) => gl.getUniformLocation(prog, name);
    const u = {
      proj: U("u_proj"), view: U("u_view"), res: U("u_res"), shift: U("u_shift"),
      scale: U("u_scale"), rot: U("u_rot"), tau: U("u_tau"), gain: U("u_gain"),
      width: U("u_width"), dist: U("u_dist"),
    };

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, -1, 0, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    const bytes = STRIDE * 4;
    [0, 16, bytes, bytes + 16].forEach((offset, i) => {
      gl.enableVertexAttribArray(i + 1);
      gl.vertexAttribPointer(i + 1, 4, gl.FLOAT, false, bytes, offset);
      gl.vertexAttribDivisor(i + 1, 1);
    });

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.disable(gl.DEPTH_TEST);

    let dpr = 1;
    let aspect = 1;
    let shift = [0, 0];
    let dist = 11;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      aspect = w / h;
      const wide = aspect > 1.1;
      shift = wide ? [0.3, 0.1] : [0, 0.26];
      dist = wide ? 10.5 : 10.5 * Math.min(2.1, 0.95 / aspect);
      const glow = glowRef.current!;
      glow.style.left = `${(0.5 + shift[0] / 2) * 100}%`;
      glow.style.top = `${(0.5 - shift[1] / 2) * 100}%`;
    };

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const draw = (time: number) => {
      pointer.x += (pointer.tx - pointer.x) * 0.03;
      pointer.y += (pointer.ty - pointer.y) * 0.03;
      const az = time * ((Math.PI * 2) / 240) + 0.6 + pointer.x * 0.12;
      const el = 0.3 + pointer.y * 0.06;
      const eye = [dist * Math.cos(el) * Math.sin(az), dist * Math.sin(el), dist * Math.cos(el) * Math.cos(az)];

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniformMatrix4fv(u.proj, false, perspective(0.56, aspect, 0.1, 100));
      gl.uniformMatrix4fv(u.view, false, lookAt(eye[0], eye[1], eye[2]));
      gl.uniform2f(u.res, canvas.width / 2, canvas.height / 2);
      gl.uniform2f(u.shift, shift[0], shift[1]);
      gl.uniform1f(u.width, 0.85 * dpr);
      gl.uniform1f(u.dist, dist);

      const phase = time / PERIOD;
      const cycle = Math.floor(phase);
      const frac = phase - cycle;
      const K = PERIOD / Math.log(LAMBDA);
      for (let m = 0; m < GENS; m++) {
        const level = m + frac - 1;
        const g = m - cycle;
        const gain = smooth(-1, -0.35, level) * (1 - smooth(1.05, 2, level));
        if (gain <= 0.001) continue;
        const tau = 0.55 * K * Math.pow(LAMBDA, level) + g * 3.7;
        gl.uniform1f(u.scale, Math.pow(LAMBDA, -level));
        gl.uniform1f(u.rot, g * 2.39996 + tau * 0.04);
        gl.uniform1f(u.tau, tau);
        gl.uniform1f(u.gain, gain);
        gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, points - 1);
      }
    };

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    const t0 = PERIOD * 0.4;
    const start = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (visible) draw(t0 + (now - start) / 1000);
    };

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw(t0);
    });
    ro.observe(canvas);
    resize();

    if (reduce) draw(t0);
    else {
      window.addEventListener("pointermove", onPointer);
      raf = requestAnimationFrame(loop);
    }
    wrapRef.current!.classList.add("is-ready");

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} className="vortex" aria-hidden="true">
      <div ref={glowRef} className="vortex-glow" />
      <canvas ref={canvasRef} />
    </div>
  );
}

function smooth(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
