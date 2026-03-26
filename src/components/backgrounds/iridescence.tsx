'use client';

import { useEffect, useRef, type ComponentPropsWithoutRef } from 'react';
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';

const VERTEX = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const FRAGMENT = `
precision highp float;

uniform float uTime;
uniform vec3 uColor;
uniform vec3 uResolution;
uniform vec2 uMouse;
uniform float uAmplitude;
uniform float uSpeed;

varying vec2 vUv;

void main() {
  float mr = min(uResolution.x, uResolution.y);
  vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;

  uv += (uMouse - vec2(0.5)) * uAmplitude;

  float d = -uTime * 0.5 * uSpeed;
  float a = 0.0;
  for (float i = 0.0; i < 8.0; ++i) {
    a += cos(i - d - a * uv.x);
    d += sin(uv.y * i + a);
  }
  d += uTime * 0.5 * uSpeed;
  vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
  col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5) * uColor;
  gl_FragColor = vec4(col, 1.0);
}
`;

interface IridescenceProps extends Omit<ComponentPropsWithoutRef<'div'>, 'color'> {
  /** RGB color values [0–1] */
  color?: [number, number, number];
  /** Animation speed multiplier */
  speed?: number;
  /** Mouse influence amplitude */
  amplitude?: number;
  /** Enable mouse reactivity */
  mouseReact?: boolean;
}

/**
 * Full-screen iridescent WebGL shader background.
 * Renders a shimmering, mouse-reactive generative effect using OGL.
 *
 * Respects `prefers-reduced-motion` — pauses animation when reduced motion is preferred.
 */
export function Iridescence({
  color = [1, 1, 1],
  speed = 1.0,
  amplitude = 0.1,
  mouseReact = true,
  className,
  ...rest
}: IridescenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    if (!containerRef.current) return;
    const el: HTMLDivElement = containerRef.current;

    // Respect prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) return;

    const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2) });
    const gl = renderer.gl;
    gl.clearColor(1, 1, 1, 1);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: VERTEX,
      fragment: FRAGMENT,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new Color(...color) },
        uResolution: {
          value: new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height),
        },
        uMouse: { value: new Float32Array([mousePos.current.x, mousePos.current.y]) },
        uAmplitude: { value: amplitude },
        uSpeed: { value: speed },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    function resize() {
      renderer.setSize(el.offsetWidth, el.offsetHeight);
      program.uniforms.uResolution.value = new Color(
        gl.canvas.width,
        gl.canvas.height,
        gl.canvas.width / gl.canvas.height,
      );
    }

    function handleMouseMove(e: MouseEvent) {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      mousePos.current = { x, y };
      program.uniforms.uMouse.value[0] = x;
      program.uniforms.uMouse.value[1] = y;
    }

    window.addEventListener('resize', resize);
    if (mouseReact) el.addEventListener('mousemove', handleMouseMove);
    resize();

    let frameId: number;
    function update(t: number) {
      frameId = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001;
      renderer.render({ scene: mesh });
    }
    frameId = requestAnimationFrame(update);

    el.appendChild(gl.canvas);
    gl.canvas.style.display = 'block';
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      if (mouseReact) el.removeEventListener('mousemove', handleMouseMove);
      if (gl.canvas.parentElement === el) el.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [color, speed, amplitude, mouseReact]);

  return (
    <div
      ref={containerRef}
      className={className}
      aria-hidden
      {...rest}
    />
  );
}
