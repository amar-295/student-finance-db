import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Label } from '../ui/label';

export default function PreferencesSettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Customize your experience.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label>Dark Mode</Label>
                    {/* Toggle would go here */}
                    <div className="h-6 w-11 bg-muted rounded-full relative"><div className="h-5 w-5 bg-background rounded-full absolute top-0.5 left-0.5 shadow-sm" /></div>
                </div>
            </CardContent>
        </Card>
    );
}
