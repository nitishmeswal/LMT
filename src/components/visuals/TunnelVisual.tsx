'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TunnelProps {
  intensity: number;
  colors: string[];
}

function TunnelMesh({ intensity, colors }: TunnelProps) {
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
      },
      vertexShader: `
        varying vec2 vUv;
        varying float vZ;
        void main() {
          vUv = uv;
          vZ = position.z;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uIntensity;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        varying vec2 vUv;
        varying float vZ;
        
        void main() {
          float dist = length(vUv - 0.5);
          float ring = sin(dist * 30.0 - uTime * 3.0 * uIntensity) * 0.5 + 0.5;
          float spiral = sin(atan(vUv.y - 0.5, vUv.x - 0.5) * 8.0 + uTime * 2.0) * 0.5 + 0.5;
          
          vec3 color = mix(uColor1, uColor2, ring);
          color = mix(color, uColor3, spiral * 0.5);
          
          float alpha = smoothstep(0.5, 0.0, dist) * 0.8;
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
      meshRef.current.rotation.z += 0.005 * (intensity / 10);
    }
  });

  return (
    <mesh ref={meshRef} material={shaderMaterial}>
      <planeGeometry args={[10, 10, 32, 32]} />
    </mesh>
  );
}

function TunnelRings({ intensity, colors }: TunnelProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        mesh.position.z = ((state.clock.elapsedTime * intensity * 0.5 + i * 2) % 20) - 10;
        mesh.rotation.z += 0.01 * (i % 2 === 0 ? 1 : -1) * (intensity / 10);
      });
    }
  });

  const rings = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      position: [0, 0, i * 2 - 10] as [number, number, number],
      color: colors[i % colors.length],
    }));
  }, [colors]);

  return (
    <group ref={groupRef}>
      {rings.map((ring, i) => (
        <mesh key={i} position={ring.position}>
          <torusGeometry args={[2 + i * 0.2, 0.05, 16, 64]} />
          <meshBasicMaterial color={ring.color} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

interface TunnelVisualProps {
  intensity: number;
  colors: string[];
}

export default function TunnelVisual({ intensity, colors }: TunnelVisualProps) {
  return (
    <div className="absolute inset-0 bg-black">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <TunnelMesh intensity={intensity} colors={colors} />
        <TunnelRings intensity={intensity} colors={colors} />
      </Canvas>
    </div>
  );
}
