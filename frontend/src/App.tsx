import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from './contexts/ThemeContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { Toaster } from 'sonner';
import { Suspense, lazy, useEffect } from 'react';
import { Skeleton } from './components/ui/skeleton';

// Lazy load pages
import LandingPage from './pages/LandingPage';

// Lazy load pages
// const LandingPage = lazy(() => import('./pages/LandingPage')); // Static import for LCP
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
  // Dynamic Meta: Simulation of high-engagement notifications
  useEffect(() => {
    const originalTitle = document.title;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = "UniFlow (1) - Your Finance";
      } else {
        document.title = originalTitle;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

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
        {import.meta.env.PROD && <Analytics />}
        <Toaster position="top-right" richColors closeButton expand={false} />
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;
