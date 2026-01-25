import { ScrollSection } from '../../components/ui/scroll-section';

const faqs = [
    {
        q: "Is UniFlow really free?",
        a: "Yes! The core features—budgeting, expense tracking, and basic analytics—are 100% free for students. We only charge for advanced team collaboration and enterprise features."
    },
    {
        q: "Is my data safe?",
        a: "Absolutely. We use bank-grade AES-256 encryption for all sensitive data. We don't sell your data to advertisers, ever. Your privacy is our product."
    },
    {
        q: "Can I export my data?",
        a: "Yes, you can export your entire transaction history to CSV or JSON formats at any time. Your data portability is guaranteed with a single click in your settings."
    }
];

export function FAQ() {
    return (
        <section id="faq" className="py-24 md:py-32 relative overflow-hidden bg-muted/20">
            <div className="container px-4 md:px-6 max-w-3xl mx-auto">
                <ScrollSection animation="fade-up">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
                        <p className="text-xl text-muted-foreground">Everything you need to know about UniFlow. Can't find an answer? Our support team is here to help.</p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="group rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm px-6 py-5 transition-all duration-300 hover:border-primary/30 hover:bg-card/50 hover:shadow-md">
                                <details className="group/details [&_summary::-webkit-details-marker]:hidden">
                                    <summary className="flex cursor-pointer items-center justify-between text-xl font-bold tracking-tight text-foreground list-none">
                                        {faq.q}
                                        <span className="shrink-0 transition duration-300 group-open/details:-rotate-180 text-primary/60">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down w-5 h-5">
                                                <polyline points="6 9 12 15 18 9" />
                                            </svg>
                                        </span>
                                    </summary>
                                    <div className="mt-4 leading-relaxed text-muted-foreground text-lg border-t border-border/20 pt-4">
                                        {faq.a}
                                    </div>
                                </details>
                            </div>
                        ))}
                    </div>
                </ScrollSection>
            </div>
        </section>
    );
}
