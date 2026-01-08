# NeuroNirvana

## Overview
NeuroNirvana is a digital consciousness dispensary app built with Next.js, React, and Supabase. It provides meditation/altered state experiences through binaural beats, visual effects, and audio. Users can explore various "dose" experiences themed around different states of consciousness.

## Key Features
- **Trial System**: 420 free uses per dose globally, tracked via Supabase `global_trials` table
- **Premium Tiers**: Some doses require premium subscription
- **Journal Entries**: Users can save and sync journal entries
- **Multiple Dose Experiences**: Psychedelic-themed experiences with binaural beats and visuals
- **Early Exit Feedback**: Users can provide feedback when exiting experiences early

## Tech Stack
- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **Database**: Supabase (PostgreSQL)
- **Audio**: Tone.js for binaural beats
- **3D Graphics**: Three.js with React Three Fiber
- **Animations**: Framer Motion

## Project Structure
```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes (trials, feedback, etc.)
│   └── page.tsx           # Main page component
├── components/
│   ├── screens/           # Main screen components (Dispensary, etc.)
│   ├── ui/                # Reusable UI components
│   │   ├── DoseCard.tsx   # Individual dose card with trial count
│   │   └── EarlyExitDialog.tsx  # Dialog for early exit feedback
│   ├── visuals/           # Visual effect components
│   └── TripExperience.tsx # Main trip experience component
├── context/               # React context providers
├── data/                  # Static data (doses definitions)
├── hooks/                 # Custom React hooks
│   └── useTrialCount.ts   # Hook for fetching per-dose trial counts
├── lib/                   # Utility libraries
│   ├── audioEngine.ts     # Binaural beat audio engine
│   ├── supabase.ts        # Supabase client and functions
│   └── utils.ts           # General utilities
└── store/                 # Zustand store
```

## Trial System Architecture
- Trial counts are stored per-dose in the `global_trials` table
- API endpoint `/api/trials` returns remaining trials for all doses
- Rate limited to 30 requests per 60 seconds per IP
- Trial is claimed via atomic RPC function `claim_trial` to prevent duplicates
- Trial is claimed once when trip starts (in Dispensary.handleCountdownComplete)
- Early exit does NOT double-claim (trial already claimed at trip start)

## Recent Changes (January 2026)
- Fixed trial count system to read from `global_trials` table
- Added per-dose trial count display on DoseCard components
- Implemented rate limiting on trials API
- Added PNG border overlays to dose cards
- Fixed hydration mismatch warning on search input

## Development
- Server runs on port 5000, bound to 0.0.0.0
- Workflow: `npm run dev -- -p 5000 -H 0.0.0.0`
