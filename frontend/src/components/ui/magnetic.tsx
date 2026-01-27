import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useRef, type ReactNode, type MouseEvent } from 'react';

interface MagneticProps {
    children: ReactNode;
    strength?: number;
}

/**
 * Magnetic Component
 * Creates a subtle "attraction" effect towards the cursor.
 * Best used for primary CTAs to enhance tactile feedback.
 */
export function Magnetic({ children, strength = 0.35 }: MagneticProps) {
    const ref = useRef<HTMLDivElement>(null);

    // Position state with motion values
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Spring physics for natural, fluid movement
    const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const handleMouseMove = (e: MouseEvent) => {
        if (!ref.current) return;

        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();

        // Calculate center of the element
        const centerX = left + width / 2;
        const centerY = top + height / 2;

        // Calculate distance from cursor to center
        const distanceX = clientX - centerX;
        const distanceY = clientY - centerY;

        // Apply magnetic strength
        x.set(distanceX * strength);
        y.set(distanceY * strength);
    };

    const handleMouseLeave = () => {
        // Snap back to original position
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: springX, y: springY }}
            className="inline-block"
        >
            {children}
        </motion.div>
    );
}
