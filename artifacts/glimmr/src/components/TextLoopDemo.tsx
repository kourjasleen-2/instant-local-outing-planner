/**
 * TextLoop Demo
 * 
 * Example integration of the React Bits TextLoop component.
 * This shows animated text flowing along various curve shapes.
 * 
 * Usage example for adding to a page:
 * 
 * import TextLoop from '@/components/TextLoop';
 * 
 * <TextLoop
 *   text="Glimmr ✦ Your Next Outing"
 *   shape="wave"
 *   speed={90}
 *   direction="forward"
 *   separator="✦"
 *   curviness={90}
 *   fontSize={46}
 *   fontWeight={800}
 *   color="#3B82F6"
 *   ribbon
 *   ribbonColor="#1E40AF"
 *   pauseOnHover
 * />
 */

import TextLoop from './TextLoop';

export default function TextLoopDemo() {
  return (
    <div style={{ padding: '2rem', background: '#0f172a' }}>
      <h2 style={{ color: 'white', marginBottom: '2rem' }}>TextLoop Examples</h2>
      
      {/* Wave Shape */}
      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>Wave Shape</h3>
        <TextLoop
          text="Glimmr ✦ Find Your Next Outing"
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
          ribbonWidth={86}
          pauseOnHover
        />
      </div>
      
      {/* Circle Shape */}
      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>Circle Shape</h3>
        <TextLoop
          text="Indiranagar ✦ Church Street ✦ Koramangala"
          shape="circle"
          speed={60}
          direction="forward"
          separator="✦"
          curviness={120}
          fontSize={36}
          fontWeight={700}
          color="#F59E0B"
          ribbon
          ribbonColor="#B45309"
          ribbonWidth={70}
          pauseOnHover
        />
      </div>
      
      {/* Infinity Shape */}
      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>Infinity Shape</h3>
        <TextLoop
          text="Coffee • Dinner • Drinks"
          shape="infinity"
          speed={75}
          direction="forward"
          separator="•"
          curviness={100}
          fontSize={40}
          fontWeight={800}
          color="#EC4899"
          ribbon
          ribbonColor="#BE185D"
          ribbonWidth={80}
          pauseOnHover
        />
      </div>
      
      {/* Arch Shape */}
      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>Arch Shape</h3>
        <TextLoop
          text="Plan Your Day ✦ Make Memories"
          shape="arch"
          speed={100}
          direction="forward"
          separator="✦"
          curviness={110}
          fontSize={42}
          fontWeight={800}
          color="#10B981"
          ribbon
          ribbonColor="#059669"
          ribbonWidth={75}
          pauseOnHover
        />
      </div>
      
      {/* Line Shape (Scrolling Ticker) */}
      <div>
        <h3 style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>Line Shape (Ticker)</h3>
        <TextLoop
          text="Bengaluru's Local Outing Planner"
          shape="line"
          speed={120}
          direction="forward"
          separator="•"
          curviness={0}
          fontSize={48}
          fontWeight={900}
          color="#8B5CF6"
          ribbon
          ribbonColor="#6D28D9"
          ribbonWidth={90}
          pauseOnHover
        />
      </div>
    </div>
  );
}
