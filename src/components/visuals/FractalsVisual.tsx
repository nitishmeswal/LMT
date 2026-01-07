'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FractalPlaneProps {
  intensity: number;
  colors: string[];
}

function FractalPlane({ intensity, colors }: FractalPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: intensity / 10 },
        uZoom: { value: 1.0 },
        uColor1: { value: new THREE.Color(colors[0] || '#8b5cf6') },
        uColor2: { value: new THREE.Color(colors[1] || '#ec4899') },
        uColor3: { value: new THREE.Color(colors[2] || '#06b6d4') },
        uColor4: { value: new THREE.Color(colors[3] || '#f59e0b') },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uIntensity;
        uniform float uZoom;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        uniform vec3 uColor4;
        varying vec2 vUv;
        
        vec2 complexMul(vec2 a, vec2 b) {
          return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
        }
        
        void main() {
          vec2 uv = (vUv - 0.5) * 4.0 / uZoom;
          
          // Animate center point
          vec2 c = vec2(
            -0.8 + sin(uTime * 0.1) * 0.2,
            0.156 + cos(uTime * 0.1) * 0.1
          );
          
          vec2 z = uv;
          float iterations = 0.0;
          const float maxIter = 100.0;
          
          for (float i = 0.0; i < maxIter; i++) {
            z = complexMul(z, z) + c;
            if (length(z) > 2.0) {
              iterations = i;
              break;
            }
            iterations = i;
          }
          
          float t = iterations / maxIter;
          t = pow(t, 0.5); // Adjust contrast
          
          // Color based on iteration count
          vec3 color;
          if (t < 0.25) {
            color = mix(uColor1, uColor2, t * 4.0);
          } else if (t < 0.5) {
            color = mix(uColor2, uColor3, (t - 0.25) * 4.0);
          } else if (t < 0.75) {
            color = mix(uColor3, uColor4, (t - 0.5) * 4.0);
          } else {
            color = mix(uColor4, uColor1, (t - 0.75) * 4.0);
          }
          
          // Add glow effect
          float glow = 1.0 - t;
          color += glow * 0.2 * uIntensity;
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.DoubleSide,
    });
  }, [colors, intensity]);

  useFrame((state) => {
    if (shaderMaterial) {
      shaderMaterial.uniforms.uTime.value = state.clock.elapsedTime;
      shaderMaterial.uniforms.uIntensity.value = intensity / 10;
      // Zoom in slowly
      shaderMaterial.uniforms.uZoom.value = 1.0 + Math.sin(state.clock.elapsedTime * 0.2) * 0.5 * (intensity / 10);
    }
  });

  return (
    <mesh ref={meshRef} material={shaderMaterial}>
      <planeGeometry args={[10, 10]} />
    </mesh>
  );
}

interface FractalsVisualProps {
  intensity: number;
  colors: string[];
}

export default function FractalsVisual({ intensity, colors }: FractalsVisualProps) {
  return (
    <div className="absolute inset-0 bg-black">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <FractalPlane intensity={intensity} colors={colors} />
      </Canvas>
    </div>
  );
}
