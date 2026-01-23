import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { Suspense, lazy } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { Toaster } from 'sonner';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary'; // Fixed path
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy load pages - Implements Code Splitting (Issue 30)
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const SignupPage = lazy(() => import('./pages/auth/SignupPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AccountsPage = lazy(() => import('./pages/AccountsPage'));
const TransactionsPage = lazy(() => import('./pages/TransactionsPage'));
const BudgetsPage = lazy(() => import('./pages/BudgetsPage'));
const BudgetDetailsPage = lazy(() => import('./pages/BudgetDetailsPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const BillSplitsPage = lazy(() => import('./pages/BillSplitsPage'));
const SplitDetailsPage = lazy(() => import('./pages/SplitDetailsPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const InsightsPage = lazy(() => import('./pages/InsightsPage'));

function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <ErrorBoundary>
          <BrowserRouter>
            <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><LoadingSpinner /></div>}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/accounts" element={<AccountsPage />} />
                    <Route path="/transactions" element={<TransactionsPage />} />
                    <Route path="/budgets" element={<BudgetsPage />} />
                    <Route path="/budgets/:id" element={<BudgetDetailsPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/splits" element={<BillSplitsPage />} />
                    <Route path="/splits/:id" element={<SplitDetailsPage />} />
                    <Route path="/insights" element={<InsightsPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Route>
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
          <Analytics />
          <Toaster position="top-right" richColors closeButton expand={false} />
        </ErrorBoundary>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;
