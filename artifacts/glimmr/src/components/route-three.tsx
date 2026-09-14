import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line } from '@react-three/drei';
import * as THREE from 'three';
import { RouteVisual } from '@/components/glimmr-ui';
import { usePrefersReducedMotion } from '@/lib/motion';

const fullRoute: [number, number, number][] = [
  [-2.4, 0.85, 0],
  [-1.8, 0.35, 0],
  [-1.15, -0.1, 0],
  [-0.35, 0.45, 0],
  [0.45, 1.2, 0],
  [1.05, 0.8, 0],
  [1.45, -0.35, 0],
  [2.2, -0.65, 0],
];

const firstRoute = fullRoute.slice(0, 4);

function RouteScene() {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.z += delta * 0.012;
  });

  return (
    <group ref={group} rotation={[0, 0, -0.1]}>
      <ambientLight intensity={1.8} />
      <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.18}>
        <Line points={fullRoute} color="#3B82F6" lineWidth={2.2} dashed dashSize={0.12} gapSize={0.1} />
        <Line points={firstRoute} color="#FBBF24" lineWidth={4.2} />
        <mesh position={[-2.4, 0.85, 0.02]}>
          <sphereGeometry args={[0.2, 24, 24]} />
          <meshStandardMaterial color="#FBBF24" roughness={0.35} />
        </mesh>
        <mesh position={[-0.35, 0.45, 0.03]}>
          <sphereGeometry args={[0.22, 24, 24]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
        <mesh position={[2.2, -0.65, 0.02]}>
          <sphereGeometry args={[0.2, 24, 24]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.35} />
        </mesh>
      </Float>
    </group>
  );
}

function ReducedMotionRoute() {
  const reduced = usePrefersReducedMotion();

  if (reduced) return <RouteVisual />;

  return (
    <div className="route-art route-three" aria-label="Decorative route from coffee to dinner">
      <div className="route-three-fallback" aria-hidden="true">
        <RouteVisual />
      </div>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
        fallback={<RouteVisual />}
        gl={{ antialias: true, alpha: true }}
      >
        <RouteScene />
      </Canvas>
    </div>
  );
}

export default ReducedMotionRoute;