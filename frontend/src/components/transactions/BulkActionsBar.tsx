import { Button } from '../ui/button';
import { Trash } from 'lucide-react';

export default function BulkActionsBar({ selectedCount, onClearSelection, onDelete }: any) {
    if (selectedCount === 0) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-foreground text-background px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 animate-in slide-in-from-bottom-5">
            <span className="font-medium whitespace-nowrap">{selectedCount} selected</span>
            <div className="h-4 w-px bg-background/20" />
            <div className="flex items-center gap-2">
                <Button size="sm" variant="secondary" onClick={onDelete} className="h-8 px-3 text-xs">
                    <Trash className="mr-2 h-3 w-3" />
                    Delete
                </Button>
                <Button size="sm" variant="ghost" onClick={onClearSelection} className="h-8 px-3 text-xs text-background hover:bg-background/20 hover:text-background">
                    Cancel
                </Button>
            </div>
        </div>
    );
}
