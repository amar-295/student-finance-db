import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';

export default function CategorySettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>Manage your spending categories.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg text-center text-muted-foreground">
                    No categories defined.
                </div>
                <Button variant="outline" className="w-full">Add Category</Button>
            </CardContent>
        </Card>
    );
}
