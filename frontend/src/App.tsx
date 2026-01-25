import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from './contexts/ThemeContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { Toaster } from 'sonner';
import { Suspense, lazy } from 'react';
import { Skeleton } from './components/ui/skeleton';

// Lazy load pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const DashboardLayout = lazy(() => import('./components/layout/DashboardLayout'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const BudgetsPage = lazy(() => import('./pages/BudgetsPage'));

// Fallback loader
const PageLoader = () => (
  <div className="p-8 space-y-4">
    <Skeleton className="h-12 w-1/3" />
    <Skeleton className="h-64 w-full" />
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />

              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/budgets" element={<BudgetsPage />} />
              </Route>
              {/* Add other routes back as they are rebuilt */}
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Analytics />
        <Toaster position="top-right" richColors closeButton expand={false} />
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;
