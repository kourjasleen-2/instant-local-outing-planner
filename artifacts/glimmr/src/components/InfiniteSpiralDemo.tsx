/**
 * InfiniteSpiral Demo
 * 
 * Example integration of the React Bits InfiniteSpiral component.
 * This shows how to use the spiral image carousel in the Glimmr app.
 * 
 * Usage example for adding to a page:
 * 
 * import InfiniteSpiral from '@/components/InfiniteSpiral';
 * 
 * const places = [
 *   { src: '/images/blue-tokai.jpg', alt: 'Blue Tokai Coffee Roasters', href: '/plan/123' },
 *   { src: '/images/toit.jpg', alt: 'Toit Brewpub' },
 *   // ... more places
 * ];
 * 
 * <div style={{ height: '600px', position: 'relative', overflow: 'hidden' }}>
 *   <InfiniteSpiral
 *     items={places}
 *     animationMode="all"
 *     speed={0.55}
 *     radius={170}
 *     cardWidth={120}
 *     cardHeight={160}
 *     pauseOnHover
 *   />
 * </div>
 */

import InfiniteSpiral from './InfiniteSpiral';

// Sample Indiranagar place images for demo purposes
const demoImages = [
  { src: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=500&fit=crop', alt: 'Coffee shop interior' },
  { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=500&fit=crop', alt: 'Restaurant ambiance' },
  { src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=500&fit=crop', alt: 'Brewery atmosphere' },
  { src: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&h=500&fit=crop', alt: 'Outdoor dining' },
  { src: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=500&fit=crop', alt: 'Dessert place' },
  { src: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=500&fit=crop', alt: 'Bar setting' },
  { src: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=500&fit=crop', alt: 'Park view' },
];

export default function InfiniteSpiralDemo() {
  return (
    <div style={{ 
      height: '600px', 
      position: 'relative', 
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <InfiniteSpiral
        items={demoImages}
        animationMode="all"
        speed={0.55}
        radius={170}
        cardWidth={120}
        cardHeight={160}
        verticalSpacing={60}
        perspective={1000}
        cardRadius={10}
        centerScale={1.2}
        edgeBlur={6}
        cardsPerTurn={7}
        pauseOnHover
      />
    </div>
  );
}
