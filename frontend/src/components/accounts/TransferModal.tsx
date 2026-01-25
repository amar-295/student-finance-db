import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export default function TransferModal({ isOpen, onClose }: any) {
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="mx-auto max-w-sm w-full rounded-xl bg-background p-6 shadow-xl border">
                    <DialogTitle className="text-xl font-bold mb-4">Transfer Funds</DialogTitle>
                    <div className="space-y-4">
                        <div>
                            <Label>Amount</Label>
                            <Input type="number" placeholder="0.00" />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={onClose}>Cancel</Button>
                            <Button onClick={onClose}>Transfer</Button>
                        </div>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
