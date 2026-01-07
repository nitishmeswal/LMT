'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BreathOrbProps {
  intensity: number;
  colors: string[];
}

function BreathOrb({ intensity, colors }: BreathOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && glowRef.current) {
      const breathCycle = Math.sin(state.clock.elapsedTime * 0.5) * 0.5 + 0.5;
      const scale = 1 + breathCycle * 0.5 * (intensity / 10);
      
      meshRef.current.scale.set(scale, scale, scale);
      glowRef.current.scale.set(scale * 1.5, scale * 1.5, scale * 1.5);
      
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.3 + breathCycle * 0.3;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color={colors[0] || '#8b5cf6'}
          emissive={colors[1] || '#ec4899'}
          emissiveIntensity={0.5}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial
          color={colors[1] || '#ec4899'}
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

function BreathRings({ intensity, colors }: BreathOrbProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const breathCycle = Math.sin(state.clock.elapsedTime * 0.5 + i * 0.5) * 0.5 + 0.5;
        const scale = 2 + i * 0.5 + breathCycle * 0.3 * (intensity / 10);
        child.scale.set(scale, scale, 1);
        (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({
          color: colors[i % colors.length],
          transparent: true,
          opacity: 0.3 - i * 0.05,
          side: THREE.DoubleSide,
        });
      });
    }
  });

  return (
    <group ref={groupRef}>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.9, 1, 64]} />
          <meshBasicMaterial color={colors[i % colors.length]} transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

interface BreathVisualProps {
  intensity: number;
  colors: string[];
}

export default function BreathVisual({ intensity, colors }: BreathVisualProps) {
  return (
    <div className="absolute inset-0 bg-black">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <BreathOrb intensity={intensity} colors={colors} />
        <BreathRings intensity={intensity} colors={colors} />
      </Canvas>
    </div>
  );
}
