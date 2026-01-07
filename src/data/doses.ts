export type DoseCategory = 
  | 'euphoric' 
  | 'psychedelic' 
  | 'meditative' 
  | 'creative' 
  | 'sleep' 
  | 'focus' 
  | 'dissociative'
  | 'natural';

export type VisualType = 
  | 'mandala' 
  | 'particles' 
  | 'fractals' 
  | 'chakra' 
  | 'waves' 
  | 'breath'
  | 'tunnel'
  | 'cosmic';

export interface FrequencyLayer {
  name: string;
  baseFreq: number;
  beatFreq: number;
  type: 'binaural' | 'solfeggio' | 'isochronic';
}

export interface Dose {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: DoseCategory;
  frequencies: FrequencyLayer[];
  defaultDuration: number;
  intensity: number;
  visualType: VisualType;
  colors: string[];
  effects: string[];
  trialsRemaining: number;
  isPremium: boolean;
  price?: number;
}

export const DOSES: Dose[] = [
  {
    id: 'psilocybin',
    name: 'Psilocybin',
    slug: 'psilocybin',
    tagline: 'Mushroom Mysticism',
    description: 'Deep introspective journey with fractal visuals and ego dissolution. Experience interconnectedness.',
    category: 'psychedelic',
    frequencies: [
      { name: 'Theta Deep', baseFreq: 200, beatFreq: 6, type: 'binaural' },
      { name: '528Hz Love', baseFreq: 528, beatFreq: 0, type: 'solfeggio' },
    ],
    defaultDuration: 1800,
    intensity: 8,
    visualType: 'fractals',
    colors: ['#8b5cf6', '#3b82f6', '#f59e0b', '#22c55e'],
    effects: ['Ego dissolution', 'Visual fractals', 'Deep insight', 'Interconnectedness'],
    trialsRemaining: 500,
    isPremium: false,
  },
  {
    id: 'dmt',
    name: 'DMT Breakthrough',
    slug: 'dmt',
    tagline: 'Hyperspace Gateway',
    description: 'Intense geometric hyperspace breakthrough. Meet the machine elves. Not for beginners.',
    category: 'psychedelic',
    frequencies: [
      { name: 'Gamma Burst', baseFreq: 400, beatFreq: 40, type: 'binaural' },
      { name: '963Hz Crown', baseFreq: 963, beatFreq: 0, type: 'solfeggio' },
    ],
    defaultDuration: 900,
    intensity: 10,
    visualType: 'tunnel',
    colors: ['#ec4899', '#06b6d4', '#f59e0b', '#ffffff'],
    effects: ['Hyperspace', 'Entity contact', 'Time dissolution', 'Geometric visions'],
    trialsRemaining: 500,
    isPremium: true,
    price: 4.99,
  },
  {
    id: 'lsd',
    name: 'LSD Journey',
    slug: 'lsd',
    tagline: 'Reality Enhancement',
    description: 'Classic psychedelic experience with enhanced colors, breathing walls, and profound thoughts.',
    category: 'psychedelic',
    frequencies: [
      { name: 'Alpha Wave', baseFreq: 300, beatFreq: 10, type: 'binaural' },
      { name: 'Theta Layer', baseFreq: 250, beatFreq: 7, type: 'binaural' },
    ],
    defaultDuration: 2700,
    intensity: 7,
    visualType: 'waves',
    colors: ['#f97316', '#8b5cf6', '#22c55e', '#06b6d4'],
    effects: ['Enhanced colors', 'Breathing visuals', 'Synesthesia', 'Time dilation'],
    trialsRemaining: 500,
    isPremium: false,
  },
  {
    id: 'mdma',
    name: 'MDMA Euphoria',
    slug: 'mdma',
    tagline: 'Pure Love & Connection',
    description: 'Waves of euphoria, empathy, and connection. Feel the love radiating through you.',
    category: 'euphoric',
    frequencies: [
      { name: 'Alpha Bliss', baseFreq: 350, beatFreq: 10, type: 'binaural' },
      { name: '528Hz Heart', baseFreq: 528, beatFreq: 0, type: 'solfeggio' },
    ],
    defaultDuration: 2400,
    intensity: 8,
    visualType: 'particles',
    colors: ['#ec4899', '#f472b6', '#fbbf24', '#ffffff'],
    effects: ['Euphoria', 'Empathy', 'Sensory enhancement', 'Love waves'],
    trialsRemaining: 500,
    isPremium: false,
  },
  {
    id: 'cannabis',
    name: 'Cannabis Calm',
    slug: 'cannabis',
    tagline: 'Mellow Relaxation',
    description: 'Gentle relaxation with mild euphoria. Perfect for unwinding and creative thinking.',
    category: 'euphoric',
    frequencies: [
      { name: 'Alpha Chill', baseFreq: 220, beatFreq: 10, type: 'binaural' },
      { name: '432Hz Earth', baseFreq: 432, beatFreq: 0, type: 'solfeggio' },
    ],
    defaultDuration: 1800,
    intensity: 4,
    visualType: 'breath',
    colors: ['#22c55e', '#f59e0b', '#8b5cf6', '#fbbf24'],
    effects: ['Relaxation', 'Mild euphoria', 'Enhanced senses', 'Creativity'],
    trialsRemaining: 500,
    isPremium: false,
  },
  {
    id: 'ketamine',
    name: 'Ketamine Drift',
    slug: 'ketamine',
    tagline: 'Dissociative Float',
    description: 'Float outside your body through infinite voids. Experience ego death and rebirth.',
    category: 'dissociative',
    frequencies: [
      { name: 'Delta Deep', baseFreq: 150, beatFreq: 2, type: 'binaural' },
      { name: 'Theta Float', baseFreq: 180, beatFreq: 5, type: 'binaural' },
    ],
    defaultDuration: 1500,
    intensity: 9,
    visualType: 'cosmic',
    colors: ['#ffffff', '#6b7280', '#06b6d4', '#000000'],
    effects: ['Dissociation', 'Floating', 'Ego death', 'Infinite void'],
    trialsRemaining: 500,
    isPremium: true,
    price: 3.99,
  },
  {
    id: 'mescaline',
    name: 'Mescaline Vision',
    slug: 'mescaline',
    tagline: 'Desert Wisdom',
    description: 'Ancient shamanic journey through desert landscapes. Connect with ancestral spirits.',
    category: 'psychedelic',
    frequencies: [
      { name: 'Theta Vision', baseFreq: 280, beatFreq: 6, type: 'binaural' },
      { name: '396Hz Root', baseFreq: 396, beatFreq: 0, type: 'solfeggio' },
    ],
    defaultDuration: 2400,
    intensity: 7,
    visualType: 'mandala',
    colors: ['#f59e0b', '#92400e', '#06b6d4', '#dc2626'],
    effects: ['Shamanic visions', 'Earth connection', 'Ancestral wisdom', 'Desert beauty'],
    trialsRemaining: 500,
    isPremium: true,
    price: 3.99,
  },
  {
    id: 'ayahuasca',
    name: 'Ayahuasca Ceremony',
    slug: 'ayahuasca',
    tagline: 'Mother Vine Healing',
    description: 'Deep healing journey with mother ayahuasca. Face your shadows and emerge transformed.',
    category: 'psychedelic',
    frequencies: [
      { name: 'Delta Heal', baseFreq: 120, beatFreq: 3, type: 'binaural' },
      { name: 'Theta Spirit', baseFreq: 200, beatFreq: 7, type: 'binaural' },
      { name: '174Hz Pain', baseFreq: 174, beatFreq: 0, type: 'solfeggio' },
    ],
    defaultDuration: 3600,
    intensity: 10,
    visualType: 'chakra',
    colors: ['#22c55e', '#8b5cf6', '#f59e0b', '#dc2626'],
    effects: ['Deep healing', 'Shadow work', 'Purging', 'Rebirth'],
    trialsRemaining: 500,
    isPremium: true,
    price: 5.99,
  },
  {
    id: 'salvia',
    name: 'Salvia Trickster',
    slug: 'salvia',
    tagline: 'Reality Unzipped',
    description: 'Reality tears apart at the seams. Become one with objects. Meet the trickster entities.',
    category: 'dissociative',
    frequencies: [
      { name: 'Gamma Chaos', baseFreq: 450, beatFreq: 35, type: 'binaural' },
      { name: 'Theta Weird', baseFreq: 300, beatFreq: 5, type: 'binaural' },
    ],
    defaultDuration: 600,
    intensity: 10,
    visualType: 'fractals',
    colors: ['#22c55e', '#8b5cf6', '#6b7280', '#fbbf24'],
    effects: ['Reality dissolution', 'Object merging', 'Trickster entities', 'Bizarre visions'],
    trialsRemaining: 500,
    isPremium: true,
    price: 2.99,
  },
  {
    id: '2cb',
    name: '2C-B Sensual',
    slug: '2cb',
    tagline: 'Playful Psychedelia',
    description: 'Perfect balance of psychedelic visuals and euphoric warmth. Social and sensual.',
    category: 'euphoric',
    frequencies: [
      { name: 'Alpha Warm', baseFreq: 320, beatFreq: 10, type: 'binaural' },
      { name: '528Hz Heart', baseFreq: 528, beatFreq: 0, type: 'solfeggio' },
    ],
    defaultDuration: 1800,
    intensity: 6,
    visualType: 'waves',
    colors: ['#ec4899', '#06b6d4', '#8b5cf6', '#f59e0b'],
    effects: ['Sensuality', 'Mild visuals', 'Social warmth', 'Body high'],
    trialsRemaining: 500,
    isPremium: false,
  },
  {
    id: 'nitrous',
    name: 'Nitrous Whomp',
    slug: 'nitrous',
    tagline: 'Brief Cosmic Glimpse',
    description: 'Quick wah-wah-wah journey to brief enlightenment. The cosmic joke revealed.',
    category: 'dissociative',
    frequencies: [
      { name: 'Theta Flash', baseFreq: 400, beatFreq: 7, type: 'binaural' },
      { name: 'Beta Wobble', baseFreq: 380, beatFreq: 20, type: 'binaural' },
    ],
    defaultDuration: 120,
    intensity: 7,
    visualType: 'tunnel',
    colors: ['#e5e7eb', '#ffffff', '#f97316', '#8b5cf6'],
    effects: ['Wah-wah', 'Brief enlightenment', 'Cosmic laughter', 'Quick peak'],
    trialsRemaining: 500,
    isPremium: false,
  },
  {
    id: 'adderall',
    name: 'Adderall Focus',
    slug: 'adderall',
    tagline: 'Laser Sharp Mind',
    description: 'Crystal clear focus and productivity. Everything becomes achievable and organized.',
    category: 'focus',
    frequencies: [
      { name: 'Beta Focus', baseFreq: 350, beatFreq: 18, type: 'binaural' },
      { name: 'Gamma Sharp', baseFreq: 400, beatFreq: 32, type: 'binaural' },
    ],
    defaultDuration: 3600,
    intensity: 6,
    visualType: 'breath',
    colors: ['#ffffff', '#3b82f6', '#f59e0b', '#6b7280'],
    effects: ['Hyperfocus', 'Productivity', 'Clarity', 'Drive'],
    trialsRemaining: 500,
    isPremium: false,
  },
  {
    id: 'ambien',
    name: 'Ambien Dreams',
    slug: 'ambien',
    tagline: 'Hypnagogic Portal',
    description: 'Slip into surreal dreamlike states. Reality becomes soft and malleable.',
    category: 'sleep',
    frequencies: [
      { name: 'Delta Sleep', baseFreq: 100, beatFreq: 2, type: 'binaural' },
      { name: 'Theta Dream', baseFreq: 150, beatFreq: 5, type: 'binaural' },
    ],
    defaultDuration: 1800,
    intensity: 5,
    visualType: 'cosmic',
    colors: ['#1e1b4b', '#8b5cf6', '#fbbf24', '#c084fc'],
    effects: ['Drowsiness', 'Surreal visions', 'Hypnagogia', 'Dream entry'],
    trialsRemaining: 500,
    isPremium: true,
    price: 2.99,
  },
  {
    id: 'ghb',
    name: 'GHB Waves',
    slug: 'ghb',
    tagline: 'Euphoric Relaxation',
    description: 'Waves of warm euphoria wash over you. Social confidence and sensory bliss.',
    category: 'euphoric',
    frequencies: [
      { name: 'Alpha Warm', baseFreq: 280, beatFreq: 10, type: 'binaural' },
      { name: 'Theta Bliss', baseFreq: 220, beatFreq: 6, type: 'binaural' },
    ],
    defaultDuration: 1500,
    intensity: 7,
    visualType: 'waves',
    colors: ['#f59e0b', '#8b5cf6', '#ec4899', '#fbbf24'],
    effects: ['Euphoria', 'Social warmth', 'Relaxation', 'Sensuality'],
    trialsRemaining: 500,
    isPremium: true,
    price: 3.99,
  },
  {
    id: 'kratom',
    name: 'Kratom Balance',
    slug: 'kratom',
    tagline: 'Natural Harmony',
    description: 'Gentle natural uplift with pain relief. Balanced energy and calm.',
    category: 'natural',
    frequencies: [
      { name: 'Alpha Balance', baseFreq: 260, beatFreq: 10, type: 'binaural' },
      { name: '432Hz Earth', baseFreq: 432, beatFreq: 0, type: 'solfeggio' },
    ],
    defaultDuration: 2400,
    intensity: 4,
    visualType: 'breath',
    colors: ['#22c55e', '#f59e0b', '#92400e', '#fbbf24'],
    effects: ['Mood lift', 'Pain relief', 'Energy', 'Calm focus'],
    trialsRemaining: 500,
    isPremium: false,
  },
  {
    id: 'dxm',
    name: 'DXM Plateaus',
    slug: 'dxm',
    tagline: 'Robotic Transcendence',
    description: 'Ascend through dissociative plateaus. Music becomes transcendently meaningful.',
    category: 'dissociative',
    frequencies: [
      { name: 'Theta Robo', baseFreq: 200, beatFreq: 6, type: 'binaural' },
      { name: 'Delta Plat', baseFreq: 120, beatFreq: 3, type: 'binaural' },
    ],
    defaultDuration: 2400,
    intensity: 8,
    visualType: 'tunnel',
    colors: ['#8b5cf6', '#6b7280', '#06b6d4', '#000000'],
    effects: ['Dissociation', 'Music enhancement', 'Plateaus', 'Robotripping'],
    trialsRemaining: 500,
    isPremium: false,
  },
  {
    id: 'caffeine',
    name: 'Caffeine Rush',
    slug: 'caffeine',
    tagline: 'Clean Energy',
    description: 'Pure focused energy without the jitters. Crystal clear alertness.',
    category: 'focus',
    frequencies: [
      { name: 'Beta Alert', baseFreq: 380, beatFreq: 16, type: 'binaural' },
      { name: 'Gamma Clear', baseFreq: 420, beatFreq: 30, type: 'binaural' },
    ],
    defaultDuration: 1200,
    intensity: 5,
    visualType: 'breath',
    colors: ['#78350f', '#fbbf24', '#ffffff', '#f59e0b'],
    effects: ['Alertness', 'Focus', 'Energy', 'Clarity'],
    trialsRemaining: 500,
    isPremium: false,
  },
  {
    id: 'meditation',
    name: 'Deep Meditation',
    slug: 'meditation',
    tagline: 'Natural Transcendence',
    description: 'Access deep meditative states naturally. Third eye activation and inner peace.',
    category: 'meditative',
    frequencies: [
      { name: 'Theta Zen', baseFreq: 200, beatFreq: 7, type: 'binaural' },
      { name: 'Alpha Peace', baseFreq: 250, beatFreq: 10, type: 'binaural' },
      { name: '963Hz Crown', baseFreq: 963, beatFreq: 0, type: 'solfeggio' },
    ],
    defaultDuration: 2400,
    intensity: 3,
    visualType: 'chakra',
    colors: ['#6366f1', '#8b5cf6', '#f59e0b', '#ffffff'],
    effects: ['Inner peace', 'Third eye', 'Transcendence', 'Stillness'],
    trialsRemaining: 500,
    isPremium: false,
  },
  {
    id: 'runners-high',
    name: "Runner's High",
    slug: 'runners-high',
    tagline: 'Endorphin Rush',
    description: 'Natural endorphin and endocannabinoid release. Feel triumphant and alive.',
    category: 'natural',
    frequencies: [
      { name: 'Alpha Flow', baseFreq: 300, beatFreq: 10, type: 'binaural' },
      { name: 'Beta Energy', baseFreq: 350, beatFreq: 18, type: 'binaural' },
    ],
    defaultDuration: 1800,
    intensity: 6,
    visualType: 'particles',
    colors: ['#f97316', '#fbbf24', '#22c55e', '#06b6d4'],
    effects: ['Euphoria', 'Energy', 'Achievement', 'Clarity'],
    trialsRemaining: 500,
    isPremium: false,
  },
  {
    id: 'lean',
    name: 'Lean Purple',
    slug: 'lean',
    tagline: 'Slow Motion Waves',
    description: 'Everything slows down to half speed. Heavy sedation and warm comfort.',
    category: 'euphoric',
    frequencies: [
      { name: 'Delta Slow', baseFreq: 100, beatFreq: 2, type: 'binaural' },
      { name: 'Theta Nod', baseFreq: 140, beatFreq: 5, type: 'binaural' },
    ],
    defaultDuration: 2400,
    intensity: 7,
    visualType: 'waves',
    colors: ['#7c3aed', '#a855f7', '#c084fc', '#ffffff'],
    effects: ['Time dilation', 'Sedation', 'Warmth', 'Music enhancement'],
    trialsRemaining: 500,
    isPremium: true,
    price: 3.99,
  },
];

export const CATEGORIES: { id: DoseCategory; name: string; icon: string; color: string }[] = [
  { id: 'euphoric', name: 'Euphoric', icon: '✨', color: '#ec4899' },
  { id: 'psychedelic', name: 'Psychedelic', icon: '🍄', color: '#8b5cf6' },
  { id: 'meditative', name: 'Meditative', icon: '🧘', color: '#06b6d4' },
  { id: 'creative', name: 'Creative', icon: '🎨', color: '#f97316' },
  { id: 'sleep', name: 'Sleep', icon: '🌙', color: '#6366f1' },
  { id: 'focus', name: 'Focus', icon: '🎯', color: '#22c55e' },
  { id: 'dissociative', name: 'Dissociative', icon: '🌀', color: '#6b7280' },
  { id: 'natural', name: 'Natural', icon: '🌿', color: '#84cc16' },
];

export function getDoseById(id: string): Dose | undefined {
  return DOSES.find(d => d.id === id);
}

export function getDosesByCategory(category: DoseCategory): Dose[] {
  return DOSES.filter(d => d.category === category);
}
