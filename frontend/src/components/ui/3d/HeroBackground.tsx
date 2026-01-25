import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
// @ts-ignore
import * as random from 'maath/random/dist/maath-random.esm';
import { useReducedMotion } from 'framer-motion';

export function HeroBackground(props: any) {
    const ref = useRef<any>(null);
    const shouldReduceMotion = useReducedMotion();

    // Generate 5000 random points in a sphere for higher density
    const sphere = useMemo(() => {
        const pts = new Float32Array(5000 * 3);
        const radius = 1.8;
        for (let i = 0; i < pts.length; i += 3) {
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);
            pts[i] = radius * Math.sin(phi) * Math.cos(theta);
            pts[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
            pts[i + 2] = radius * Math.cos(phi);
        }
        return pts;
    }, []);

    useFrame((state, delta) => {
        if (!ref.current || shouldReduceMotion) return;

        // 1. Ambient Rotation (Ultra-smooth base motion)
        ref.current.rotation.y += delta / 50;
        ref.current.rotation.x += delta / 70;

        // 2. Mouse Parallax & "Spread" (Expansion logic)
        const mouseX = state.mouse.x;
        const mouseY = state.mouse.y;

        // Calculate distance from center for "spread" effect
        const dist = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
        const targetScale = 1 + dist * 0.15; // Spread up to 15% on edges

        // Lerp position (Parallax)
        ref.current.position.x += (mouseX * 0.3 - ref.current.position.x) * 0.05;
        ref.current.position.y += (-mouseY * 0.3 - ref.current.position.y) * 0.05;

        // Lerp scale (The "Spread")
        ref.current.scale.x += (targetScale - ref.current.scale.x) * 0.05;
        ref.current.scale.y += (targetScale - ref.current.scale.y) * 0.05;
        ref.current.scale.z += (targetScale - ref.current.scale.z) * 0.05;

        // 3. Cinematic Opacity Breathing
        const time = state.clock.getElapsedTime();
        const pulse = 0.35 + Math.sin(time * 0.5) * 0.1;
        ref.current.material.opacity = pulse;
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#818CF8" // Brighter Indigo (Indigo-400)
                    size={0.02}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.5}
                />
            </Points>
        </group>
    );
}
