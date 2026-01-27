import { LandingNavbar } from '../components/layout/LandingNavbar';
import { LandingFooter } from '../components/layout/LandingFooter';
import { ScrollProgress } from '../components/ui/scroll-progress';
import { SEO } from '../components/common/SEO';
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
            <SEO
                title="UniFlow - Your College Life, Organized"
                description="UniFlow is the #1 finance app for students. Track expenses, split bills with roommates, and master your money with AI-powered budgeting."
            />
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
