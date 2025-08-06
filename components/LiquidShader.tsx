import React, { useRef, useEffect } from 'react';

interface LiquidShaderProps {
  className?: string;
  intensity?: number;
  speed?: number;
  colors?: string[];
}

const LiquidShader: React.FC<LiquidShaderProps> = ({ 
  className = "", 
  intensity = 1.0,
  speed = 1.0,
  colors = ["#3b82f6", "#2563eb", "#1d4ed8", "#1e40af"]
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') as WebGLRenderingContext | null;
    if (!gl) {
      console.warn('WebGL not supported, falling back to canvas');
      return;
    }

    // Vertex shader source
    const vertexShaderSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment shader source with liquid effect
    const fragmentShaderSource = `
      precision mediump float;
      
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform float u_intensity;
      uniform float u_speed;
      
      varying vec2 v_uv;
      
      vec3 hsb2rgb(in vec3 c) {
        vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0);
        rgb = rgb*rgb*(3.0-2.0*rgb);
        return c.z * mix(vec3(1.0), rgb, c.y);
      }
      
      float noise(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }
      
      float smoothNoise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        
        float a = noise(i);
        float b = noise(i + vec2(1.0, 0.0));
        float c = noise(i + vec2(0.0, 1.0));
        float d = noise(i + vec2(1.0, 1.0));
        
        vec2 u = f * f * (3.0 - 2.0 * f);
        
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }
      
      float fbm(vec2 st) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 0.0;
        
        for (int i = 0; i < 6; i++) {
          value += amplitude * smoothNoise(st);
          st *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }
      
      void main() {
        vec2 st = v_uv;
        
        // Animate the coordinates
        float time = u_time * u_speed * 0.001;
        
        // Create flowing liquid motion
        vec2 flow1 = vec2(
          fbm(st * 3.0 + vec2(time * 0.1, time * 0.2)),
          fbm(st * 3.0 + vec2(time * 0.15, -time * 0.1))
        );
        
        vec2 flow2 = vec2(
          fbm(st * 2.0 + flow1 * 2.0 + vec2(-time * 0.05, time * 0.1)),
          fbm(st * 2.0 + flow1 * 2.0 + vec2(time * 0.1, time * 0.08))
        );
        
        // Create liquid distortion
        float liquid = fbm(st * 4.0 + flow2 * u_intensity);
        
        // Add some turbulence
        liquid += fbm(st * 8.0 + time * 0.2) * 0.3;
        
        // Create color based on liquid flow
        float hue = liquid * 0.1 + time * 0.02;
        float saturation = 0.6 + liquid * 0.2;
        float brightness = 0.7 + liquid * 0.3;
        
        // Blue ocean theme colors
        vec3 color1 = vec3(0.231, 0.510, 0.965); // #3b82f6
        vec3 color2 = vec3(0.149, 0.388, 0.918); // #2563eb
        vec3 color3 = vec3(0.114, 0.306, 0.847); // #1d4ed8
        
        // Mix colors based on liquid flow
        vec3 finalColor = mix(color1, color2, smoothstep(0.3, 0.7, liquid));
        finalColor = mix(finalColor, color3, smoothstep(0.6, 1.0, liquid));
        
        // Add some shimmer
        float shimmer = sin(liquid * 10.0 + time * 3.0) * 0.1 + 0.9;
        finalColor *= shimmer;
        
        // Add transparency for overlay effect
        float alpha = 0.3 + liquid * 0.2;
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    // Compile shader
    function compileShader(gl: WebGLRenderingContext, source: string, type: number): WebGLShader | null {
      const shader = gl.createShader(type);
      if (!shader) return null;
      
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      
      return shader;
    }

    // Create shader program
    const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
    
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    // Set up geometry
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    // Get attribute and uniform locations
    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    const timeUniformLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
    const intensityUniformLocation = gl.getUniformLocation(program, 'u_intensity');
    const speedUniformLocation = gl.getUniformLocation(program, 'u_speed');

    // Resize canvas
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation loop
    const animate = () => {
      const currentTime = Date.now() - startTimeRef.current;
      
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      
      gl.useProgram(program);
      
      // Set uniforms
      gl.uniform1f(timeUniformLocation, currentTime);
      gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
      gl.uniform1f(intensityUniformLocation, intensity);
      gl.uniform1f(speedUniformLocation, speed);
      
      // Set up attributes
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
      
      // Enable blending for transparency
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      
      // Draw
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [intensity, speed, colors]);

  return (
    <canvas
      ref={canvasRef}
      className={`liquid-shader ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
};

export default LiquidShader;
