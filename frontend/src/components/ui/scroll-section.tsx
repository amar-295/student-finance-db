import { motion, type Variants } from "framer-motion";
import { useUserTiming } from "../../hooks/useUserTiming";

interface ScrollSectionProps {
    children: React.ReactNode;
    className?: string;
    animation?: "fade-up" | "slide-left" | "scale-up" | "mask-reveal";
    delay?: number;
}

export function ScrollSection({
    children,
    className,
    animation = "fade-up",
    delay = 0,
}: ScrollSectionProps) {
    useUserTiming("ScrollSection", className); // Use className as distinct ID if available, or just generic

    const variants: Record<string, Variants> = {
        "fade-up": {
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
        },
        "slide-left": {
            hidden: { opacity: 0, x: -30 },
            visible: { opacity: 1, x: 0 }
        },
        "scale-up": {
            hidden: { opacity: 0, scale: 0.96 },
            visible: { opacity: 1, scale: 1 }
        },
        "mask-reveal": {
            hidden: { opacity: 0, y: 60, scale: 0.95 },
            visible: { opacity: 1, y: 0, scale: 1 }
        }
    };

    const selectedVariant = variants[animation] || variants["fade-up"];

    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }} // Trigger a bit earlier/later depending on preference, margin -10% means trigger when 10% in view? No, margin affects viewport. Using default or 'once' mimics GSAP 'play none none none'.
            variants={selectedVariant}
            transition={{
                duration: 0.8,
                delay: delay,
                ease: [0.21, 0.47, 0.32, 0.98] // Smooth ease
            }}
        >
            {children}
        </motion.div>
    );
}
