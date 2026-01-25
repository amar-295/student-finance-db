import { LandingNavbar } from '../components/layout/LandingNavbar';
import { LandingFooter } from '../components/layout/LandingFooter';
import { ScrollProgress } from '../components/ui/scroll-progress';
import {
    Hero,
    Showcase,
    Features,
    HowItWorks,
    Security,
    Pricing,
    FAQ,
    CTA
} from '../sections/landing';

export default function LandingPage() {
    return (
        <div className="relative w-full overflow-x-hidden bg-background selection:bg-primary/30">
            <ScrollProgress />
            <LandingNavbar />

            <main>
                <Hero />
                <Showcase />
                <Features />
                <HowItWorks />
                <Security />
                <Pricing />
                <FAQ />
                <CTA />
            </main>

            <LandingFooter />
        </div>
    );
}
