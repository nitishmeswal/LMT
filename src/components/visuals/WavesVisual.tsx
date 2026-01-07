'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WaveMeshProps {
  intensity: number;
  colors: string[];
}

function WaveMesh({ intensity, colors }: WaveMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: intensity / 10 },
        uColor1: { value: new THREE.Color(colors[0] || '#8b5cf6') },
        uColor2: { value: new THREE.Color(colors[1] || '#ec4899') },
        uColor3: { value: new THREE.Color(colors[2] || '#06b6d4') },
        uColor4: { value: new THREE.Color(colors[3] || '#f59e0b') },
      },
      vertexShader: `
        varying vec2 vUv;
        uniform float uTime;
        uniform float uIntensity;
        
        void main() {
          vUv = uv;
          vec3 pos = position;
          pos.z += sin(pos.x * 3.0 + uTime * 2.0) * 0.2 * uIntensity;
          pos.z += sin(pos.y * 2.0 + uTime * 1.5) * 0.15 * uIntensity;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uIntensity;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        uniform vec3 uColor4;
        varying vec2 vUv;
        
        void main() {
          float wave1 = sin(vUv.x * 10.0 + uTime * 2.0) * 0.5 + 0.5;
          float wave2 = sin(vUv.y * 8.0 + uTime * 1.5) * 0.5 + 0.5;
          float wave3 = sin((vUv.x + vUv.y) * 6.0 + uTime) * 0.5 + 0.5;
          
          vec3 color = mix(uColor1, uColor2, wave1);
          color = mix(color, uColor3, wave2 * 0.5);
          color = mix(color, uColor4, wave3 * 0.3);
          
          float alpha = 0.8 + sin(uTime + vUv.x * 5.0) * 0.2 * uIntensity;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, [colors, intensity]);

  useFrame((state) => {
    if (shaderMaterial) {
      shaderMaterial.uniforms.uTime.value = state.clock.elapsedTime;
      shaderMaterial.uniforms.uIntensity.value = intensity / 10;
    }
  });

  return (
    <mesh ref={meshRef} material={shaderMaterial} rotation={[-Math.PI / 4, 0, 0]}>
      <planeGeometry args={[12, 12, 64, 64]} />
    </mesh>
  );
}

interface WavesVisualProps {
  intensity: number;
  colors: string[];
}

export default function WavesVisual({ intensity, colors }: WavesVisualProps) {
  return (
    <div className="absolute inset-0 bg-black">
      <Canvas camera={{ position: [0, 3, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <WaveMesh intensity={intensity} colors={colors} />
      </Canvas>
    </div>
  );
}
