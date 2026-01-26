import { Button } from '../../components/ui/button';
import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import ErrorBoundary from '../../components/common/ErrorBoundary';
import { lazy, Suspense } from 'react';

// Lazy load 3D components to avoid blocking initial render
const SceneContainer = lazy(() => import('../../components/ui/3d/SceneContainer').then(module => ({ default: module.SceneContainer })));
const HeroBackground = lazy(() => import('../../components/ui/3d/HeroBackground').then(module => ({ default: module.HeroBackground })));

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1, // Faster stagger
            delayChildren: 0.1,   // Reduced initial delay for faster LCP
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 50, damping: 20 }
    },
};

export function Hero() {
    return (
        <section className="relative min-h-screen w-full flex flex-col items-center overflow-hidden pt-24 md:pt-24">
            {/* 3D Background with Graceful Degradation & Lazy Loading */}
            <div className="absolute inset-0 z-0">
                <ErrorBoundary fallback={<div className="h-full w-full bg-gradient-to-br from-background via-muted/10 to-background" />}>
                    <Suspense fallback={<div className="h-full w-full bg-gradient-to-br from-background via-muted/10 to-background opacity-50" />}>
                        <SceneContainer>
                            <HeroBackground />
                        </SceneContainer>
                    </Suspense>
                </ErrorBoundary>
            </div>

            {/* Content Container - Flex Gravity */}
            <div className="flex-1 flex flex-col justify-center w-full relative z-10 px-4 text-center pb-24 md:pb-32">
                <motion.div
                    className="max-w-4xl mx-auto space-y-6"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >

                    <motion.h1
                        variants={itemVariants}
                        className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter text-foreground"
                    >
                        Master Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-primary/90 text-glow-lg tracking-tight">
                            Student Economy
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="mx-auto max-w-2xl text-xl text-muted-foreground md:text-2xl leading-relaxed font-medium"
                    >
                        Stop reacting to your balance. Take command with AI-powered insights, effortless bill splitting, and institutional-grade security designed for the modern student.
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                        <Link to="/signup">
                            <Button variant="glow" size="lg" className="w-full sm:w-auto">
                                Start for Free
                            </Button>
                        </Link>
                        <Button
                            variant="glass"
                            size="lg"
                            className="w-full sm:w-auto"
                            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            See Features
                        </Button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            {/* Premium Scroll Indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-3 cursor-pointer group"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                role="button"
                aria-label="Scroll to features"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
                <span className="text-[10px] font-black text-muted-foreground/60 tracking-[0.2em] uppercase transition-colors group-hover:text-primary">Scroll</span>
                <div className="w-6 h-10 rounded-full border-2 border-primary/20 flex justify-center p-1.5 transition-colors group-hover:border-primary/40 bg-background/50 backdrop-blur-sm">
                    <motion.div
                        className="w-1 h-2 rounded-full bg-primary"
                        animate={{
                            y: [0, 8, 0],
                            opacity: [1, 0.4, 1]
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </div>
            </motion.div>
        </section >
    );
}
