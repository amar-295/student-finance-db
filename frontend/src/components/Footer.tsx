export default function Footer() {
    return (
        <footer className="bg-white dark:bg-dark-bg-primary border-t border-gray-100 dark:border-dark-border-primary pt-16 pb-8 transition-colors">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <img src="/images/logo.svg" alt="UniFlow Logo" className="w-10 h-10 object-contain" />
                            <span className="text-lg font-bold text-text-main dark:text-dark-text-primary">UniFlow</span>
                        </div>
                        <p className="text-sm text-text-muted pr-4">
                            The all-in-one productivity platform built specifically for the modern student lifestyle.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-text-main dark:text-dark-text-primary mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-text-muted">
                            <li><a className="hover:text-primary transition-colors" href="#">Features</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Integrations</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Pricing</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Changelog</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-text-main dark:text-dark-text-primary mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm text-text-muted">
                            <li><a className="hover:text-primary transition-colors" href="#">Student Discounts</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Blog</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Community</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Help Center</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-text-main dark:text-dark-text-primary mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-text-muted">
                            <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Terms of Service</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Security</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-100 dark:border-dark-border-primary pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-text-muted">© {new Date().getFullYear()} StudentLife Inc. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <a className="p-2 rounded-full text-text-muted hover:bg-[#1DA1F2] hover:text-white transition-all duration-300" href="#" aria-label="Follow us on Twitter">
                            <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path></svg>
                        </a>
                        <a className="p-2 rounded-full text-text-muted hover:bg-[#E1306C] hover:text-white transition-all duration-300" href="#" aria-label="Follow us on Instagram">
                            <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
