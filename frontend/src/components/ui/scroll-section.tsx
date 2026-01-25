import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollSectionProps {
    children: React.ReactNode;
    className?: string;
    animation?: "fade-up" | "slide-left" | "scale-up";
    delay?: number;
}

export function ScrollSection({
    children,
    className,
    animation = "fade-up",
    delay = 0,
}: ScrollSectionProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        let fromVars: gsap.TweenVars = { opacity: 0, y: 30 };
        let toVars: gsap.TweenVars = { opacity: 1, y: 0, duration: 1, ease: "sine.out", delay };

        if (animation === "slide-left") {
            fromVars = { opacity: 0, x: -30 };
            toVars = { opacity: 1, x: 0, duration: 1, ease: "sine.out", delay };
        } else if (animation === "scale-up") {
            fromVars = { opacity: 0, scale: 0.96 };
            toVars = { opacity: 1, scale: 1, duration: 0.8, ease: "sine.out", delay };
        }

        gsap.fromTo(
            el,
            fromVars,
            {
                ...toVars,
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none none",
                },
            }
        );

        return () => {
            // Cleanup if needed, though ScrollTrigger handles most
        };
    }, [animation, delay]);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}
