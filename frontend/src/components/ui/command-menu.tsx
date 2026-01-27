import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import {
    Calculator,
    CreditCard,
    LayoutDashboard,
    Settings,
    User,
    Search,
    Moon,
    Sun,
    Plus
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
// We can style cmdk using standard CSS or Tailwind classes on the primitives.

// We can style cmdk using standard CSS or Tailwind classes on the primitives.
// Since we don't have a pre-built shadcn "command" component yet, I will build a self-contained one 
// or use the raw cmdk primitives with tailwind classes.

export function CommandMenu() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
            // Smart Search shortcut
            if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
                e.preventDefault();
                setOpen(true);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    return (
        <div className="command-menu-container">
            {/* We use Command.Dialog which includes the overlay and content logic */}
            <Command.Dialog
                open={open}
                onOpenChange={setOpen}
                label="Global Command Menu"
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl p-0 overflow-hidden z-[100]"
                overlayClassName="fixed inset-0 bg-background/80 backdrop-blur-sm z-[99]"
            >
                <div className="flex items-center border-b border-border px-3" cmdk-input-wrapper="">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <Command.Input
                        placeholder="Type a command or search..."
                        className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>

                <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden py-2 px-2">
                    <Command.Empty className="py-6 text-center text-sm text-muted-foreground">No results found.</Command.Empty>

                    <Command.Group heading="Navigation" className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                        <Command.Item
                            onSelect={() => runCommand(() => navigate('/dashboard'))}
                            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                        >
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => navigate('/budgets'))}
                            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground"
                        >
                            <Calculator className="mr-2 h-4 w-4" />
                            <span>Budgets</span>
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => navigate('/transactions'))}
                            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground"
                        >
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>Transactions</span>
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => navigate('/profile'))}
                            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground"
                        >
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => navigate('/settings'))}
                            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground"
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </Command.Item>
                    </Command.Group>

                    <Command.Separator className="-mx-1 h-px bg-border my-1" />

                    <Command.Group heading="Actions" className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                        <Command.Item
                            onSelect={() => runCommand(() => navigate('/add'))}
                            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            <span>Add New Transaction</span>
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => setTheme(theme === 'dark' ? 'light' : 'dark'))}
                            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground"
                        >
                            {theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                            <span>Toggle Theme</span>
                        </Command.Item>
                    </Command.Group>
                </Command.List>
            </Command.Dialog>
        </div>
    );
}
