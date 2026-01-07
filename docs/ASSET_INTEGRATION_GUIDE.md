# 🎨 Asset Integration Guide
## How to Replace Icons, Borders & Backgrounds with Your Custom Assets

---

## 📁 File Structure

Create this folder structure in your `/public` directory:

```
public/
├── assets/
│   ├── icons/
│   │   ├── drugs/
│   │   │   ├── psilocybin.png
│   │   │   ├── dmt.png
│   │   │   ├── lsd.png
│   │   │   ├── mdma.png
│   │   │   ├── cannabis.png
│   │   │   ├── ketamine.png
│   │   │   ├── mescaline.png
│   │   │   ├── ayahuasca.png
│   │   │   ├── salvia.png
│   │   │   ├── 2cb.png
│   │   │   ├── nitrous.png
│   │   │   ├── adderall.png
│   │   │   ├── ambien.png
│   │   │   ├── ghb.png
│   │   │   ├── kratom.png
│   │   │   ├── dxm.png
│   │   │   ├── caffeine.png
│   │   │   ├── meditation.png
│   │   │   ├── runners-high.png
│   │   │   └── lean.png
│   │   ├── ui/
│   │   │   ├── play.png
│   │   │   ├── pause.png
│   │   │   ├── close.png
│   │   │   ├── volume.png
│   │   │   ├── intensity.png
│   │   │   └── visual.png
│   │   └── nav/
│   │       ├── dispensary.png
│   │       ├── discover.png
│   │       ├── journal.png
│   │       ├── builder.png
│   │       └── premium.png
│   ├── borders/
│   │   ├── psilocybin-border.png
│   │   ├── dmt-border.png
│   │   └── ... (all 20 drugs)
│   ├── backgrounds/
│   │   ├── main-bg.jpg
│   │   ├── hero-bg.jpg
│   │   └── visuals/
│   │       ├── mandala-bg.jpg
│   │       ├── particles-bg.jpg
│   │       ├── fractals-bg.jpg
│   │       ├── chakra-bg.jpg
│   │       ├── waves-bg.jpg
│   │       ├── breath-bg.jpg
│   │       ├── tunnel-bg.jpg
│   │       └── cosmic-bg.jpg
│   └── logo/
│       ├── logo-full.png
│       ├── logo-icon.png
│       └── logo-wordmark.png
```

---

## 🖼️ Step 1: Add Drug Icons to DoseCard

### Update `src/components/ui/DoseCard.tsx`:

Replace the emoji icon with an image:

```tsx
// Before (emoji):
<div 
  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
  style={{ backgroundColor: `${category?.color}20` }}
>
  {category?.icon}
</div>

// After (custom image):
<div 
  className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden"
  style={{ backgroundColor: `${category?.color}20` }}
>
  <img 
    src={`/assets/icons/drugs/${dose.id}.png`}
    alt={dose.name}
    className="w-10 h-10 object-contain"
    onError={(e) => {
      // Fallback to emoji if image not found
      e.currentTarget.style.display = 'none';
      e.currentTarget.parentElement!.innerHTML = category?.icon || '💊';
    }}
  />
</div>
```

---

## 🖼️ Step 2: Add Card Borders

### Update `src/components/ui/DoseCard.tsx`:

Wrap the card content with a border image:

```tsx
// Add this wrapper around the card
<div 
  className="relative"
  style={{
    backgroundImage: `url(/assets/borders/${dose.id}-border.png)`,
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    padding: '8px', // Adjust based on your border thickness
  }}
>
  {/* Existing card content */}
  <motion.div
    className="glass rounded-2xl p-5 cursor-pointer..."
  >
    ...
  </motion.div>
</div>

// OR use border-image CSS property:
<motion.div
  className="glass rounded-2xl p-5 cursor-pointer..."
  style={{
    borderImage: `url(/assets/borders/${dose.id}-border.png) 30 round`,
    borderWidth: '8px',
    borderStyle: 'solid',
  }}
>
```

---

## 🖼️ Step 3: Update Navigation Icons

### Update `src/components/ui/Navigation.tsx`:

```tsx
// Before (Lucide icons):
const NAV_ITEMS = [
  { id: 'dispensary', icon: Home, label: 'Dispensary' },
  ...
];

// After (custom images):
const NAV_ITEMS = [
  { id: 'dispensary', iconSrc: '/assets/icons/nav/dispensary.png', label: 'Dispensary' },
  { id: 'discover', iconSrc: '/assets/icons/nav/discover.png', label: 'Discover' },
  { id: 'journal', iconSrc: '/assets/icons/nav/journal.png', label: 'Journal' },
  { id: 'builder', iconSrc: '/assets/icons/nav/builder.png', label: 'Builder' },
  { id: 'premium', iconSrc: '/assets/icons/nav/premium.png', label: 'Premium' },
];

// In the render:
<img 
  src={item.iconSrc} 
  alt={item.label}
  className={`w-6 h-6 ${isActive ? 'brightness-125' : 'brightness-75'}`}
/>
```

---

## 🖼️ Step 4: Update Trip Experience UI Icons

### Update `src/components/TripExperience.tsx`:

```tsx
// Replace Lucide icons with custom images
// Before:
<Play className="w-10 h-10 text-white ml-1" />

// After:
<img 
  src="/assets/icons/ui/play.png" 
  alt="Play" 
  className="w-10 h-10"
/>
```

---

## 🖼️ Step 5: Add Visual Backgrounds

### Update `src/components/visuals/index.tsx`:

Add background images to visual renderers:

```tsx
// Add a background layer to each visual type
<div 
  className="absolute inset-0 z-0"
  style={{
    backgroundImage: `url(/assets/backgrounds/visuals/${visualType}-bg.jpg)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.3, // Blend with WebGL visuals
  }}
/>
```

---

## 🖼️ Step 6: Update Main App Background

### Update `src/app/globals.css`:

```css
body {
  background-image: url('/assets/backgrounds/main-bg.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

/* Or in Tailwind config */
.bg-neuro-deep {
  background-image: url('/assets/backgrounds/main-bg.jpg');
  background-size: cover;
}
```

---

## 🎯 Quick Copy-Paste Code

### Full DoseCard with Custom Assets:

```tsx
// In DoseCard.tsx, update the card wrapper:

<div className="relative">
  {/* Border Frame */}
  <div 
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: `url(/assets/borders/${dose.id}-border.png)`,
      backgroundSize: '100% 100%',
    }}
  />
  
  <motion.div
    whileHover={{ scale: 1.02, y: -4 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => !isLocked && onSelect(dose)}
    className="relative glass rounded-2xl p-5 cursor-pointer transition-all duration-300"
  >
    {/* Custom Drug Icon */}
    <div className="flex items-start justify-between mb-3">
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: `${category?.color}20` }}
      >
        <img 
          src={`/assets/icons/drugs/${dose.id}.png`}
          alt={dose.name}
          className="w-10 h-10 object-contain"
        />
      </div>
      {/* ... rest of header */}
    </div>
    {/* ... rest of card content */}
  </motion.div>
</div>
```

---

## 📋 Asset Checklist

### Drug Icons (20 total):
- [ ] psilocybin.png
- [ ] dmt.png
- [ ] lsd.png
- [ ] mdma.png
- [ ] cannabis.png
- [ ] ketamine.png
- [ ] mescaline.png
- [ ] ayahuasca.png
- [ ] salvia.png
- [ ] 2cb.png
- [ ] nitrous.png
- [ ] adderall.png
- [ ] ambien.png
- [ ] ghb.png
- [ ] kratom.png
- [ ] dxm.png
- [ ] caffeine.png
- [ ] meditation.png
- [ ] runners-high.png
- [ ] lean.png

### Card Borders (20 total):
- [ ] psilocybin-border.png
- [ ] dmt-border.png
- [ ] ... (same 20 drugs)

### UI Icons (6 total):
- [ ] play.png
- [ ] pause.png
- [ ] close.png
- [ ] volume.png
- [ ] intensity.png
- [ ] visual.png

### Nav Icons (5 total):
- [ ] dispensary.png
- [ ] discover.png
- [ ] journal.png
- [ ] builder.png
- [ ] premium.png

### Visual Backgrounds (8 total):
- [ ] mandala-bg.jpg
- [ ] particles-bg.jpg
- [ ] fractals-bg.jpg
- [ ] chakra-bg.jpg
- [ ] waves-bg.jpg
- [ ] breath-bg.jpg
- [ ] tunnel-bg.jpg
- [ ] cosmic-bg.jpg

### Other:
- [ ] main-bg.jpg
- [ ] hero-bg.jpg
- [ ] logo-full.png
- [ ] logo-icon.png

---

## 🔧 Recommended Image Specs

| Asset Type | Size | Format | Notes |
|------------|------|--------|-------|
| Drug Icons | 256x256 or 512x512 | PNG (transparent) | Square, centered |
| Card Borders | 600x800 | PNG (transparent) | 3:4 ratio, hollow center |
| Nav Icons | 64x64 or 128x128 | PNG (transparent) | Square, simple |
| UI Icons | 128x128 | PNG (transparent) | Square, glow effects |
| Visual BGs | 1920x1080 or 4K | JPG | Dark, atmospheric |
| Main BG | 1920x1080 or 4K | JPG | Dark purple gradient |

---

*Save this file and use it as a reference while integrating your custom assets!*
