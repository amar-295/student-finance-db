import { useRef, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { cn } from '../../lib/utils';

const calc = (x: number, y: number, rect: DOMRect) => [
    -(y - rect.top - rect.height / 2) / 20,
    (x - rect.left - rect.width / 2) / 20,
    1.05,
];

const trans = (x: number, y: number, s: number) =>
    `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string; // Add className prop explicit support
}

export function TiltCard({ children, className, ...props }: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [xys, set] = useState([0, 0, 1]);

    // Use React Spring for physics-based animation
    const styles = useSpring({
        xys,
        config: { mass: 1, tension: 350, friction: 40 },
    });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            set(calc(e.clientX, e.clientY, rect));
        }
    };

    return (
        <animated.div
            ref={ref}
            className={cn("will-change-transform", className)}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => set([0, 0, 1])}
            style={{ transform: styles.xys.to(trans) }}
            {...props}
        >
            {children}
        </animated.div>
    );
}
