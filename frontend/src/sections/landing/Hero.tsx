import { useLayoutEffect, useRef } from 'react';
import { Button } from '../../components/ui/button';
import { SceneContainer } from '../../components/ui/3d/SceneContainer';
import { HeroBackground } from '../../components/ui/3d/HeroBackground';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';

export function Hero() {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const orbiterRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            tl.from(orbiterRef.current, { opacity: 0, scale: 0.9, duration: 2 })
                .from(titleRef.current, { y: 100, opacity: 0, duration: 1 }, '-=1.5')
                .from(subtitleRef.current, { y: 50, opacity: 0, duration: 1 }, '-=0.8')
                .from(ctaRef.current, { scale: 0.8, opacity: 0, duration: 0.5 }, '-=0.5');
        });

        return () => ctx.revert();
    }, []);

    return (
        <section className="relative min-h-screen w-full flex flex-col items-center overflow-hidden pt-24 md:pt-24">
            {/* 3D Background */}
            <div ref={orbiterRef} className="absolute inset-0 z-0">
                <SceneContainer>
                    <HeroBackground />
                </SceneContainer>
            </div>

            {/* Content Container - Flex Gravity */}
            <div className="flex-1 flex flex-col justify-center w-full relative z-10 px-4 text-center pb-24 md:pb-32">
                <div className="max-w-4xl mx-auto space-y-6">
                    <h1
                        ref={titleRef}
                        className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter text-foreground"
                    >
                        Manage Student Finance <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/90 to-accent animate-gradient-x dark:from-primary/90 dark:to-accent/90">
                            Like a Pro
                        </span>
                    </h1>

                    <p
                        ref={subtitleRef}
                        className="mx-auto max-w-2xl text-xl text-muted-foreground md:text-2xl leading-relaxed"
                    >
                        Stop stressing about money. Track expenses, split bills, and save for your goals with the #1 finance app for students.
                    </p>

                    <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                        <Link to="/signup">
                            <Button variant="glow" size="lg" className="w-full sm:w-auto">
                                Start for Free
                            </Button>
                        </Link>
                        <Link to="#features">
                            <Button variant="glass" size="lg" className="w-full sm:w-auto">
                                See Features
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 animate-bounce">
                <span className="text-xs font-medium text-muted-foreground/80 tracking-widest uppercase">Scroll</span>
                <div className="w-10 h-10 rounded-full border border-primary/20 bg-background/50 backdrop-blur-sm flex items-center justify-center shadow-sm text-primary">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-chevron-down h-5 w-5"
                    >
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </div>
            </div>
        </section>
    );
}
