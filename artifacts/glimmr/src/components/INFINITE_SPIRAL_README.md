# InfiniteSpiral Component

**Source:** [React Bits](https://reactbits.dev)  
**Variant:** JavaScript + CSS (converted to TypeScript)

An interactive 3D image carousel that arranges items in a helical spiral. Supports automatic animation, drag interaction, and scroll control.

## Files

- `InfiniteSpiral.tsx` — Main component with TypeScript types
- `InfiniteSpiral.css` — Component styles
- `InfiniteSpiralDemo.tsx` — Example usage with sample images

## Quick Start

```tsx
import InfiniteSpiral from '@/components/InfiniteSpiral';

const images = [
  { src: '/images/place-1.jpg', alt: 'Blue Tokai Coffee' },
  { src: '/images/place-2.jpg', alt: 'Toit Brewpub' },
  // ... more items
];

<div style={{ height: '600px', position: 'relative' }}>
  <InfiniteSpiral
    items={images}
    animationMode="all"
    speed={0.55}
    radius={170}
    cardWidth={120}
    cardHeight={160}
    pauseOnHover
  />
</div>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `(string \| SpiralItem)[]` | `[]` | Images or item objects with `src`, `alt`, `href`, etc. |
| `speed` | `number` | `0.55` | Animation speed in cards per second |
| `direction` | `"up" \| "down"` | `"up"` | Vertical travel direction |
| `animationMode` | `"auto" \| "drag" \| "scroll" \| "all"` | `"auto"` | Interaction mode |
| `radius` | `number` | `170` | Helix depth radius in pixels |
| `cardWidth` | `number` | `100` | Card width in pixels |
| `cardHeight` | `number` | `100` | Card height in pixels |
| `verticalSpacing` | `number` | `60` | Vertical spacing between cards |
| `perspective` | `number` | `1000` | CSS 3D perspective |
| `cardsPerTurn` | `number` | `7` | Cards per complete revolution |
| `rotation` | `number` | `0` | Global angular offset in degrees |
| `cardTilt` | `number` | `0` | Card tilt in degrees |
| `cardRadius` | `number` | `10` | Corner radius in pixels |
| `centerScale` | `number` | `1.2` | Scale multiplier for center cards |
| `edgeFade` | `number` | `0.3` | Fade range fraction (0-1) |
| `edgeBlur` | `number` | `6` | Maximum blur at edges in pixels |
| `pauseOnHover` | `boolean` | `true` | Pause auto animation on hover |
| `imageFit` | `"cover" \| "contain"` | `"cover"` | Image object-fit |
| `grayscale` | `number` | `0` | Grayscale amount (0-1) |
| `className` | `string` | `""` | Additional CSS classes |

## TypeScript Types

```typescript
interface SpiralItem {
  src: string;
  alt?: string;
  href?: string;
  target?: string;
  label?: string;
  id?: string;
}
```

## Usage in Glimmr

### Example: Place Gallery

Show Indiranagar places in a 3D spiral carousel:

```tsx
import InfiniteSpiral from '@/components/InfiniteSpiral';
import { places } from '@/data/places';

const placeImages = places.map(place => ({
  src: `/images/places/${place.id}.jpg`,
  alt: place.name,
  href: `/place/${place.id}`,
  label: `${place.name} — ${place.category}`
}));

<InfiniteSpiral
  items={placeImages}
  animationMode="all"
  cardWidth={140}
  cardHeight={180}
  speed={0.4}
/>
```

### Example: Plan Preview

Show plan stops as an animated preview:

```tsx
const planImages = plan.steps.map(step => ({
  src: step.place.imageUrl,
  alt: step.place.name,
  id: step.id
}));

<InfiniteSpiral
  items={planImages}
  animationMode="auto"
  direction="up"
  speed={0.3}
  pauseOnHover
/>
```

## Accessibility

- Uses semantic HTML with `role="list"` and `role="listitem"`
- Supports `aria-label` on items
- Respects `prefers-reduced-motion`
- Keyboard accessible (when interactive)

## Browser Support

Requires:
- CSS 3D transforms
- Intersection Observer API
- Resize Observer API
- Pointer Events API

All modern browsers are supported. No polyfills needed for recent versions.
