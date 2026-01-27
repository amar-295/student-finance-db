import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { Button } from '../ui/button';

export default function SplitSettlementModal({ isOpen, onClose, amount, participantName }: any) {
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="mx-auto max-w-sm w-full rounded-xl bg-background p-6 shadow-xl border">
                    <DialogTitle className="text-xl font-bold mb-4">Settle up with {participantName}</DialogTitle>
                    <p className="text-muted-foreground mb-4">Record a payment of ${amount}?</p>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button onClick={onClose}>Confirm Payment</Button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
