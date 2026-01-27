import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';
import { Keyboard, X } from 'lucide-react';
import { Button } from './button';

interface ShortcutsHelpProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ShortcutsHelp = ({ isOpen, onClose }: ShortcutsHelpProps) => {
    const shortcuts = [
        { label: 'Show this dialog', keys: ['?'] },
        { label: 'Open Command Menu', keys: ['/'] },
        { label: 'Go to Dashboard', keys: ['G', 'D'] },
        { label: 'Go to Transactions', keys: ['G', 'T'] },
        { label: 'Go to Budgets', keys: ['G', 'B'] },
        { label: 'Add Transaction', keys: ['N'] },
    ];

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-background p-6 text-left align-middle shadow-xl transition-all border border-border">
                                <div className="flex items-center justify-between mb-6">
                                    <DialogTitle as="h3" className="text-lg font-medium leading-6 text-foreground flex items-center gap-2">
                                        <Keyboard className="w-5 h-5 text-primary" />
                                        Keyboard Shortcuts
                                    </DialogTitle>
                                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {shortcuts.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center group hover:bg-muted/50 p-2 rounded-lg transition-colors">
                                            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{item.label}</span>
                                            <div className="flex gap-1">
                                                {item.keys.map((key, kIdx) => (
                                                    <kbd key={kIdx} className="px-2.5 py-1 bg-muted rounded-md border text-xs font-mono text-muted-foreground min-w-[24px] text-center shadow-sm">
                                                        {key}
                                                    </kbd>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 pt-4 border-t flex justify-end">
                                    <Button
                                        onClick={onClose}
                                        className="shadow-glow"
                                    >
                                        Got it!
                                    </Button>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
