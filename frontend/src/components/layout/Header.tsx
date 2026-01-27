import { Bell, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ThemeToggle } from '../ui/ThemeToggle';

export function Header() {
    return (
        <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md">
            <div className="flex items-center gap-4">
                {/* Breadcrumb Placeholder */}
                <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="w-64 pl-9 md:w-80 lg:w-96 rounded-full bg-secondary/50"
                    />
                </div>
                <ThemeToggle />
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
                </Button>
            </div>
        </header>
    );
}
