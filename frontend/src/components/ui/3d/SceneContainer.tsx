import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';

interface SceneContainerProps {
    children: React.ReactNode;
    className?: string;
    cameraPosition?: [number, number, number];
}

export function SceneContainer({ children, className, cameraPosition = [0, 0, 5] }: SceneContainerProps) {
    return (
        <div className={className || "h-full w-full absolute inset-0 -z-10"}>
            <Canvas
                camera={{ position: cameraPosition, fov: 50 }}
                gl={{
                    antialias: true,
                    powerPreference: 'high-performance',
                    alpha: true,
                }}
                dpr={[1, 2]}
            >
                <Suspense fallback={null}>
                    {children}
                </Suspense>
            </Canvas>
        </div>
    );
}
