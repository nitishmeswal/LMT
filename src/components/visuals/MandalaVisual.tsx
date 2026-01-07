'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MandalaRingProps {
  radius: number;
  segments: number;
  color: string;
  speed: number;
  intensity: number;
  direction: number;
}

function MandalaRing({ radius, segments, color, speed, intensity, direction }: MandalaRingProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const geometry = useMemo(() => {
    const geo = new THREE.RingGeometry(radius - 0.1, radius + 0.1, segments, 1);
    return geo;
  }, [radius, segments]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += speed * direction * 0.01 * intensity;
      const scale = 1 + Math.sin(state.clock.elapsedTime * speed) * 0.1 * intensity;
      meshRef.current.scale.set(scale, scale, 1);
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshBasicMaterial color={color} transparent opacity={0.6} side={THREE.DoubleSide} />
    </mesh>
  );
}

function MandalaCore({ intensity, colors }: { intensity: number; colors: string[] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += 0.002 * intensity;
    }
  });

  const rings = useMemo(() => {
    const ringConfigs = [];
    for (let i = 0; i < 8; i++) {
      ringConfigs.push({
        radius: 0.5 + i * 0.4,
        segments: 6 + i * 2,
        color: colors[i % colors.length],
        speed: 0.5 + Math.random() * 0.5,
        direction: i % 2 === 0 ? 1 : -1,
      });
    }
    return ringConfigs;
  }, [colors]);

  return (
    <group ref={groupRef}>
      {rings.map((ring, i) => (
        <MandalaRing
          key={i}
          radius={ring.radius}
          segments={ring.segments}
          color={ring.color}
          speed={ring.speed}
          intensity={intensity / 10}
          direction={ring.direction}
        />
      ))}
    </group>
  );
}

interface MandalaVisualProps {
  intensity: number;
  colors: string[];
}

export default function MandalaVisual({ intensity, colors }: MandalaVisualProps) {
  return (
    <div className="absolute inset-0 bg-black">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <MandalaCore intensity={intensity} colors={colors} />
      </Canvas>
    </div>
  );
}
