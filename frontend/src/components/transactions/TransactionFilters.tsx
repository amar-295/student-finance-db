import { Button } from '../ui/button';
import { X } from 'lucide-react';

export default function TransactionFiltersPanel({ onClose }: { filters: any, onChange: any, onClose: () => void }) {
    return (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-background border-l shadow-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-5 w-5" />
                </Button>
            </div>
            <div className="space-y-4">
                <p className="text-muted-foreground">Filter implementation coming soon.</p>
            </div>
        </div>
    );
}
