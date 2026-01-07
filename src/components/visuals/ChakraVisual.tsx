'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CHAKRA_COLORS = [
  '#dc2626', // Root - Red
  '#f97316', // Sacral - Orange
  '#eab308', // Solar Plexus - Yellow
  '#22c55e', // Heart - Green
  '#06b6d4', // Throat - Cyan
  '#6366f1', // Third Eye - Indigo
  '#8b5cf6', // Crown - Violet
];

interface ChakraNodeProps {
  position: [number, number, number];
  color: string;
  index: number;
  intensity: number;
}

function ChakraNode({ position, color, index, intensity }: ChakraNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && ringRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2 + index) * 0.5 + 0.5;
      const scale = 0.3 + pulse * 0.1 * (intensity / 10);
      meshRef.current.scale.set(scale, scale, scale);
      
      ringRef.current.rotation.z += 0.02 * (index % 2 === 0 ? 1 : -1) * (intensity / 10);
      ringRef.current.rotation.x += 0.01 * (intensity / 10);
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
        />
      </mesh>
      <mesh ref={ringRef}>
        <torusGeometry args={[0.5, 0.02, 16, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function KundaliniSpine({ intensity }: { intensity: number }) {
  const curveRef = useRef<THREE.Line>(null);

  const curve = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 50; i++) {
      const t = i / 50;
      const y = t * 6 - 3;
      const x = Math.sin(t * Math.PI * 2) * 0.3;
      const z = Math.cos(t * Math.PI * 2) * 0.3;
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  useFrame((state) => {
    if (curveRef.current) {
      const positions = curveRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i <= 50; i++) {
        const t = i / 50;
        const y = t * 6 - 3;
        const offset = state.clock.elapsedTime * 2;
        const x = Math.sin(t * Math.PI * 2 + offset) * 0.3 * (intensity / 10);
        const z = Math.cos(t * Math.PI * 2 + offset) * 0.3 * (intensity / 10);
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
      }
      curveRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const points = curve.getPoints(50);

  return (
    <line ref={curveRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#f59e0b" linewidth={2} />
    </line>
  );
}

interface ChakraVisualProps {
  intensity: number;
  colors: string[];
}

export default function ChakraVisual({ intensity }: ChakraVisualProps) {
  const chakraPositions: [number, number, number][] = [
    [0, -2.5, 0],
    [0, -1.7, 0],
    [0, -0.8, 0],
    [0, 0, 0],
    [0, 0.8, 0],
    [0, 1.6, 0],
    [0, 2.5, 0],
  ];

  return (
    <div className="absolute inset-0 bg-black">
      <Canvas camera={{ position: [0, 0, 6], fov: 75 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={0.5} />
        <KundaliniSpine intensity={intensity} />
        {chakraPositions.map((pos, i) => (
          <ChakraNode
            key={i}
            position={pos}
            color={CHAKRA_COLORS[i]}
            index={i}
            intensity={intensity}
          />
        ))}
      </Canvas>
    </div>
  );
}
