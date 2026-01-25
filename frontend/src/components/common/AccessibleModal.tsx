import { useEffect, useRef } from 'react';
import FocusTrap from 'focus-trap-react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';

interface AccessibleModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    confirmLabel?: string;
    onConfirm?: () => void;
    variant?: 'default' | 'destructive';
}

const AccessibleModal = ({
    isOpen,
    onClose,
    title,
    children,
    confirmLabel = 'Confirm',
    onConfirm,
    variant = 'default'
}: AccessibleModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            // Announce modal opening to screen readers
            const announcement = document.createElement('div');
            announcement.setAttribute('role', 'status');
            announcement.setAttribute('aria-live', 'polite');
            announcement.textContent = `${title} dialog opened`;
            announcement.classList.add('sr-only');
            document.body.appendChild(announcement);

            const timer = setTimeout(() => {
                if (document.body.contains(announcement)) {
                    document.body.removeChild(announcement);
                }
            }, 1000);

            return () => {
                clearTimeout(timer);
                if (document.body.contains(announcement)) {
                    document.body.removeChild(announcement);
                }
            };
        }
    }, [isOpen, title]);

    if (!isOpen) return null;

    return (
        <FocusTrap focusTrapOptions={{ initialFocus: false }}>
            <div
                className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={onClose}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <div
                    ref={modalRef}
                    className="bg-card text-card-foreground rounded-2xl p-6 md:p-8 max-w-2xl w-full shadow-lg border border-border relative animate-in fade-in zoom-in-95 duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close button - keyboard accessible */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-lg opacity-70 hover:opacity-100 ring-offset-background transition-opacity hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        aria-label="Close dialog"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Title - linked to aria-labelledby */}
                    <h2 id="modal-title" className="text-2xl font-bold mb-6 tracking-tight">
                        {title}
                    </h2>

                    {/* Content */}
                    <div className="mb-8 overflow-y-auto max-h-[60vh]">
                        {children}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 sm:justify-end">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        {onConfirm && (
                            <Button
                                variant={variant === 'destructive' ? 'destructive' : 'default'}
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className="w-full sm:w-auto"
                                autoFocus // Focus primary action
                            >
                                {confirmLabel}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </FocusTrap>
    );
};

export default AccessibleModal;
