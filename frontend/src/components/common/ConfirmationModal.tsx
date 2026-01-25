import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { Button } from '../ui/button';

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmLabel, variant, isLoading }: any) {
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="mx-auto max-w-sm w-full rounded-xl bg-background p-6 shadow-xl border">
                    <DialogTitle className="text-xl font-bold mb-4">{title}</DialogTitle>
                    <p className="text-muted-foreground mb-4">{message}</p>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
                        <Button onClick={onConfirm} variant={variant === 'danger' ? 'destructive' : 'default'} disabled={isLoading}>
                            {confirmLabel || 'Confirm'}
                        </Button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
