'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
  count: number;
  intensity: number;
  colors: string[];
}

function ParticleField({ count, intensity, colors }: ParticleFieldProps) {
  const meshRef = useRef<THREE.Points>(null);
  
  const [positions, colorArray] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorObjects = colors.map(c => new THREE.Color(c));
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      const color = colorObjects[Math.floor(Math.random() * colorObjects.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    
    return [pos, col];
  }, [count, colors]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001 * intensity;
      meshRef.current.rotation.x += 0.0005 * intensity;
      
      const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.001 * intensity;
      }
      meshRef.current.geometry.attributes.position.needsUpdate = true;
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
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colorArray}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

interface ParticlesVisualProps {
  intensity: number;
  colors: string[];
}

export default function ParticlesVisual({ intensity, colors }: ParticlesVisualProps) {
  return (
    <div className="absolute inset-0 bg-black">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.3} />
        <ParticleField count={2000} intensity={intensity / 10} colors={colors} />
      </Canvas>
    </div>
  );
}
