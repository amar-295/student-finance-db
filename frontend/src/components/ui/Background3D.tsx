import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Sphere } from '@react-three/drei';
import { useEffect, useState } from 'react';

const Background3D = () => {
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReducedMotion(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    return (
        <Canvas
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
            className="z-0"
        >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />

            {/* Floating geometric shapes */}
            <Float
                speed={reducedMotion ? 0 : 1.5}
                rotationIntensity={reducedMotion ? 0 : 1}
                floatIntensity={reducedMotion ? 0 : 2}
            >
                <Sphere args={[1, 32, 32]} position={[-3, 0, 0]}>
                    <meshStandardMaterial
                        color="#0A4D3C"
                        metalness={0.8}
                        roughness={0.2}
                    />
                </Sphere>
            </Float>

            <Float
                speed={reducedMotion ? 0 : 2}
                rotationIntensity={reducedMotion ? 0 : 0.5}
                floatIntensity={reducedMotion ? 0 : 1}
            >
                <Sphere args={[0.7, 32, 32]} position={[3, 1, -2]}>
                    <meshStandardMaterial
                        color="#F59E0B"
                        metalness={0.8}
                        roughness={0.2}
                    />
                </Sphere>
            </Float>

            <OrbitControls enableZoom={false} autoRotate={!reducedMotion} autoRotateSpeed={0.5} />
        </Canvas>
    );
};

export default Background3D;
