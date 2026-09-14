# TextLoop Component

**Source:** [React Bits](https://reactbits.dev)  
**Variant:** JavaScript + CSS (converted to TypeScript)  
**Dependencies:** GSAP 3.x

An animated text component that flows along customizable curve paths. Perfect for decorative headers, animated banners, and dynamic branding elements.

## Files

- `TextLoop.tsx` — Main component with TypeScript types
- `TextLoop.css` — Component styles
- `TextLoopDemo.tsx` — Examples showing all shape variations
- `text-loop-simple.tsx` — Original simple rotating text component (preserved)

## Installation

GSAP is required and has been added to `package.json`:

```bash
pnpm install
```

## Quick Start

```tsx
import TextLoop from '@/components/TextLoop';

<TextLoop
  text="Glimmr ✦ Your Next Outing"
  shape="wave"
  speed={90}
  direction="forward"
  separator="✦"
  curviness={90}
  fontSize={46}
  fontWeight={800}
  color="#3B82F6"
  ribbon
  ribbonColor="#1E40AF"
  pauseOnHover
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | `"React ✦ Bits"` | The phrase repeated along the curve |
| `shape` | `"wave" \| "circle" \| "infinity" \| "arch" \| "line"` | `"wave"` | Built-in curve shape |
| `path` | `string` | `undefined` | Custom SVG path (overrides shape) |
| `speed` | `number` | `90` | Travel speed in units per second |
| `direction` | `"forward" \| "reverse"` | `"forward"` | Direction text scrolls |
| `separator` | `string` | `"✦"` | Glyph between repetitions |
| `curviness` | `number` | `90` | Amplitude of curve (wave) or radius (circle) |
| `fontSize` | `number` | `46` | Font size in pixels |
| `fontWeight` | `number` | `800` | Font weight (100-900) |
| `letterSpacing` | `number` | `2` | Extra letter spacing in pixels |
| `uppercase` | `boolean` | `true` | Convert text to uppercase |
| `color` | `string` | `"#ffffff"` | Text fill color |
| `ribbon` | `boolean` | `true` | Show background band behind text |
| `ribbonColor` | `string` | `"#5227FF"` | Ribbon background color |
| `ribbonWidth` | `number` | `86` | Ribbon thickness in pixels |
| `pauseOnHover` | `boolean` | `true` | Pause animation on hover |
| `className` | `string` | `""` | Additional CSS classes |
| `style` | `React.CSSProperties` | `{}` | Inline styles for wrapper |

## Shape Options

### Wave
Flowing wave pattern — ideal for dynamic headers
```tsx
<TextLoop text="Your text here" shape="wave" curviness={90} />
```

### Circle
Continuous circular loop
```tsx
<TextLoop text="Round and round" shape="circle" curviness={120} />
```

### Infinity
Figure-8 path
```tsx
<TextLoop text="Endless loop" shape="infinity" curviness={100} />
```

### Arch
Upward-curving arc
```tsx
<TextLoop text="Over the top" shape="arch" curviness={110} />
```

### Line
Straight horizontal ticker
```tsx
<TextLoop text="Scrolling ticker" shape="line" curviness={0} />
```

## Custom Path

Provide your own SVG path in a 1200×520 viewBox:

```tsx
<TextLoop
  text="Custom path"
  path="M 0 260 Q 300 100 600 260 Q 900 420 1200 260"
  speed={80}
/>
```

## Usage in Glimmr

### Example: Hero Banner

```tsx
import TextLoop from '@/components/TextLoop';

export default function Hero() {
  return (
    <div style={{ height: '300px', background: '#1e40af' }}>
      <TextLoop
        text="Find Your Perfect Outing ✦ Indiranagar to Church Street"
        shape="wave"
        speed={70}
        fontSize={54}
        fontWeight={900}
        color="#ffffff"
        ribbon
        ribbonColor="#3b82f6"
        ribbonWidth={100}
        curviness={80}
      />
    </div>
  );
}
```

### Example: Place Category Header

```tsx
<TextLoop
  text="Coffee ☕ Dinner 🍽️ Drinks 🍺 Activities 🎨"
  shape="circle"
  speed={50}
  fontSize={36}
  color="#f59e0b"
  ribbonColor="#b45309"
  curviness={100}
/>
```

### Example: Loading State

```tsx
<TextLoop
  text="Finding your perfect plan..."
  shape="line"
  speed={100}
  fontSize={28}
  fontWeight={600}
  color="#64748b"
  ribbon={false}
/>
```

## Accessibility

- Root element has `role="img"` and `aria-label` with the text content
- Actual animated text elements use `aria-hidden="true"` to prevent duplicate announcements
- Respects `prefers-reduced-motion` — animation pauses automatically
- Keyboard accessible when used with interactive elements

## Performance Notes

- Uses GSAP for smooth, GPU-accelerated animation
- SVG `textLength` and `lengthAdjust` for even spacing
- Automatically measures path length and text width
- Optimizes repetitions based on path length
- Single RAF loop handles all animation updates

## Migration from Simple TextLoop

The original `text-loop.tsx` has been renamed to `text-loop-simple.tsx` and is still used on the home page for rotating phrases. The new React Bits TextLoop is for animated path-based text.

**Before (Simple rotating phrases):**
```tsx
import TextLoop from '@/components/text-loop-simple';
<TextLoop /> // Shows rotating phrases
```

**Now (Animated path text):**
```tsx
import TextLoop from '@/components/TextLoop';
<TextLoop text="Your text" shape="wave" />
```

## Browser Support

Requires:
- SVG `textPath` support
- GSAP 3.x
- `matchMedia` API for reduced motion detection

All modern browsers are supported.

## Troubleshooting

### Text doesn't animate
- Ensure GSAP is installed: `pnpm install`
- Check `speed` prop is > 0
- Verify `prefers-reduced-motion` is not enabled in OS settings

### Text spacing looks off
- Component auto-measures after fonts load
- Allow a brief moment for initial measurement
- Adjust `letterSpacing` prop if needed

### Custom path not showing
- Ensure path is drawn in 1200×520 viewBox
- Path should use absolute coordinates
- Test path in SVG editor first
