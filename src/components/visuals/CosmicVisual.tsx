'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StarsProps {
  count: number;
}

function Stars({ count }: StarsProps) {
  const meshRef = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 20 + Math.random() * 30;
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0002;
      meshRef.current.rotation.x += 0.0001;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#ffffff" transparent opacity={0.8} />
    </points>
  );
}

interface NebulaProps {
  intensity: number;
  colors: string[];
}

function Nebula({ intensity, colors }: NebulaProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: intensity / 10 },
        uColor1: { value: new THREE.Color(colors[0] || '#8b5cf6') },
        uColor2: { value: new THREE.Color(colors[1] || '#06b6d4') },
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
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        varying vec2 vUv;
        
        float noise(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }
        
        void main() {
          vec2 uv = vUv - 0.5;
          float dist = length(uv);
          
          float n = noise(uv * 5.0 + uTime * 0.1);
          float nebula = smoothstep(0.5, 0.0, dist + n * 0.3 * uIntensity);
          
          vec3 color = mix(uColor1, uColor2, n);
          float alpha = nebula * 0.6;
          
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
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.001 * (intensity / 10);
    }
  });

  return (
    <mesh ref={meshRef} material={shaderMaterial}>
      <planeGeometry args={[15, 15]} />
    </mesh>
  );
}

function BlackHole({ intensity }: { intensity: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime) * 0.1 * (intensity / 10);
      meshRef.current.scale.set(scale, scale, scale);
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 3;
      ringRef.current.rotation.z += 0.01 * (intensity / 10);
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh ref={ringRef}>
        <torusGeometry args={[1.2, 0.1, 16, 64]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

interface CosmicVisualProps {
  intensity: number;
  colors: string[];
}

export default function CosmicVisual({ intensity, colors }: CosmicVisualProps) {
  return (
    <div className="absolute inset-0 bg-black">
      <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
        <ambientLight intensity={0.2} />
        <Stars count={3000} />
        <Nebula intensity={intensity} colors={colors} />
        <BlackHole intensity={intensity} />
      </Canvas>
    </div>
  );
}
