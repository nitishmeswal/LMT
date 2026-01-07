# 🧠 NeuroNirvana - Digital Consciousness Dispensary

A production-ready web application that simulates altered states of consciousness through binaural beats and immersive WebGL visuals.

![NeuroNirvana](https://img.shields.io/badge/version-1.0.0-purple)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)

## ✨ Features

### 🎧 Real Binaural Beats
- Web Audio API oscillators generating actual binaural frequencies
- Multiple frequency layers (Delta, Theta, Alpha, Beta, Gamma)
- Solfeggio frequencies (174Hz, 396Hz, 432Hz, 528Hz, 963Hz)
- Real-time volume and intensity control

### 🌀 GPU-Accelerated Visuals
- 8 unique WebGL shader patterns
- Mandala Flow, Particle Field, Fractal Journey
- Chakra Spirals, Color Waves, Minimal Breath
- Hyperspace Tunnel, Cosmic Void
- All visuals respond to intensity settings

### 💊 20 Crafted Doses
- Psilocybin, DMT, LSD, MDMA, Cannabis
- Ketamine, Mescaline, Ayahuasca, Salvia
- 2C-B, Nitrous, Adderall, Ambien, GHB
- Kratom, DXM, Caffeine, Meditation
- Runner's High, Lean

### 🎨 Minimalist UI
- Auto-hiding controls during sessions
- Glass morphism design
- Smooth Framer Motion animations
- Mobile-first responsive layout

### 💰 Monetization Ready
- 500 free trials per dose (global counter)
- 3-tier subscription model
- Premium feature gating
- Stripe integration ready

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS |
| Animations | Framer Motion |
| State | Zustand |
| Audio | Tone.js (Web Audio API) |
| Visuals | Three.js / React Three Fiber |
| Icons | Lucide React |

## 📁 Project Structure

```
neuronirvana/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── screens/
│   │   │   ├── Dispensary.tsx
│   │   │   ├── Journal.tsx
│   │   │   ├── TripBuilder.tsx
│   │   │   └── Premium.tsx
│   │   ├── ui/
│   │   │   ├── DoseCard.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── PaywallModal.tsx
│   │   ├── visuals/
│   │   │   ├── MandalaVisual.tsx
│   │   │   ├── ParticlesVisual.tsx
│   │   │   ├── TunnelVisual.tsx
│   │   │   ├── WavesVisual.tsx
│   │   │   ├── BreathVisual.tsx
│   │   │   ├── ChakraVisual.tsx
│   │   │   ├── CosmicVisual.tsx
│   │   │   ├── FractalsVisual.tsx
│   │   │   └── index.tsx
│   │   └── TripExperience.tsx
│   ├── data/
│   │   └── doses.ts
│   ├── lib/
│   │   ├── audioEngine.ts
│   │   └── utils.ts
│   └── store/
│       └── useAppStore.ts
├── docs/
│   └── DRUG_VISUAL_PROMPTS.md
└── package.json
```

## 🎯 Adding New Doses

1. Open `src/data/doses.ts`
2. Add a new dose object to the `DOSES` array:

```typescript
{
  id: 'your-dose-id',
  name: 'Dose Name',
  slug: 'dose-slug',
  tagline: 'Short tagline',
  description: 'Full description',
  category: 'psychedelic', // or euphoric, meditative, etc.
  frequencies: [
    { name: 'Layer Name', baseFreq: 200, beatFreq: 6, type: 'binaural' }
  ],
  defaultDuration: 1800, // seconds
  intensity: 7, // 1-10
  visualType: 'fractals', // or mandala, particles, etc.
  colors: ['#8b5cf6', '#ec4899'],
  effects: ['Effect 1', 'Effect 2'],
  trialsRemaining: 500,
  isPremium: false,
}
```

## 🎬 Generating Custom Visuals

See `docs/DRUG_VISUAL_PROMPTS.md` for AI video generation prompts for each dose. Use these with:
- Runway Gen-3
- Pika Labs
- Kling AI
- OpenAI Sora

## 🔒 Environment Variables

Create a `.env.local` file:

```env
# Stripe (for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_xxx
STRIPE_SECRET_KEY=sk_xxx

# Analytics (optional)
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
```

## 📱 Screens

1. **Dispensary** - Browse and select doses
2. **Trip Experience** - Full-screen immersive session
3. **Journal** - Record and reflect on experiences
4. **Trip Builder** - Create custom doses (Premium)
5. **Premium** - Subscription plans

## ⚠️ Disclaimer

NeuroNirvana is for **entertainment and wellness purposes only**. It does not promote or condone illegal drug use. All experiences are simulated through legal binaural audio and visual stimulation. Consult a healthcare professional before use if you have epilepsy or other conditions.

## 📄 License

MIT License - feel free to use for personal or commercial projects.

---

Built with 💜 for consciousness explorers everywhere.
