'use client';

import dynamic from 'next/dynamic';
import { VisualType } from '@/data/doses';

const MandalaVisual = dynamic(() => import('./MandalaVisual'), { ssr: false });
const ParticlesVisual = dynamic(() => import('./ParticlesVisual'), { ssr: false });
const TunnelVisual = dynamic(() => import('./TunnelVisual'), { ssr: false });
const WavesVisual = dynamic(() => import('./WavesVisual'), { ssr: false });
const BreathVisual = dynamic(() => import('./BreathVisual'), { ssr: false });
const ChakraVisual = dynamic(() => import('./ChakraVisual'), { ssr: false });
const CosmicVisual = dynamic(() => import('./CosmicVisual'), { ssr: false });
const FractalsVisual = dynamic(() => import('./FractalsVisual'), { ssr: false });

interface VisualRendererProps {
  type: VisualType;
  intensity: number;
  colors: string[];
}

export default function VisualRenderer({ type, intensity, colors }: VisualRendererProps) {
  const props = { intensity, colors };

  switch (type) {
    case 'mandala':
      return <MandalaVisual {...props} />;
    case 'particles':
      return <ParticlesVisual {...props} />;
    case 'tunnel':
      return <TunnelVisual {...props} />;
    case 'waves':
      return <WavesVisual {...props} />;
    case 'breath':
      return <BreathVisual {...props} />;
    case 'chakra':
      return <ChakraVisual {...props} />;
    case 'cosmic':
      return <CosmicVisual {...props} />;
    case 'fractals':
      return <FractalsVisual {...props} />;
    default:
      return <MandalaVisual {...props} />;
  }
}
