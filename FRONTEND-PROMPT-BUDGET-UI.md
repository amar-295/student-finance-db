# 🎨 PROMPT: Build Budget Management UI for UniFlow

## 📋 Context & Requirements

You are building the **Budget Management** feature for UniFlow, a student finance dashboard. The backend API is 100% complete with 8 endpoints. Your task is to create a production-ready frontend implementation following the existing codebase patterns.

---

## 🏗️ Project Context

### **Tech Stack (Already Set Up)**
- React 19 with TypeScript 5.6
- Vite 7 (build tool)
- Tailwind CSS 3.4 (styling)
- Zustand (global auth state)
- TanStack Query (server state management)
- React Hook Form + Zod (forms & validation)
- Axios (HTTP client)
- Sonner (toast notifications)

### **Existing Codebase Structure**
```
frontend/src/
├── pages/              # Route-level components
│   ├── DashboardPage.tsx
│   ├── AccountsPage.tsx
│   ├── TransactionsPage.tsx
│   └── BudgetsPage.tsx    ← YOU WILL IMPLEMENT THIS
├── components/
│   ├── common/         # Reusable UI components
│   └── layout/         # Layout components
├── services/           # API interaction
│   ├── auth.service.ts
│   ├── transaction.service.ts
│   └── budget.service.ts  ← YOU WILL CREATE THIS
├── hooks/              # Custom React hooks
├── store/              # Zustand global state
└── lib/
    └── axios.ts        # Configured Axios instance
```

---

## 🎯 Your Mission

Build a complete Budget Management interface with:
1. ✅ Budget creation form
2. ✅ Budget list with progress bars
3. ✅ Real-time status indicators (safe/warning/danger/exceeded)
4. ✅ AI-generated budget recommendations
5. ✅ Alert notifications
6. ✅ Edit/delete functionality

---

## 📡 Backend API (Already Complete)

### **Available Endpoints:**

```typescript
// Base URL: /api/budgets

GET    /api/budgets              // List all budgets
POST   /api/budgets              // Create budget
GET    /api/budgets/:id          // Get single budget
PUT    /api/budgets/:id          // Update budget
DELETE /api/budgets/:id          // Delete budget
GET    /api/budgets/status       // Get real-time status
GET    /api/budgets/recommend    // Get AI recommendations
GET    /api/budgets/alerts       // Get budget alerts
```

### **TypeScript Types (From Backend):**

```typescript
// Budget Type
interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  period: 'monthly' | 'semester' | 'yearly';
  startDate: string;
  endDate: string;
  alertThreshold: number;  // Default: 80 (percentage)
  rollover: boolean;       // Default: false
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    color: string;
  };
}

// Budget Status (from GET /status)
interface BudgetStatus {
  budgetId: string;
  category: {
    id: string;
    name: string;
    color: string;
  };
  period: string;
  limit: number;
  spent: number;
  remaining: number;
  percentage: number;
  status: 'safe' | 'warning' | 'danger' | 'exceeded';
  daysLeft: number;
  projectedSpending?: number;
  onTrack: boolean;
}

// Budget Recommendation (from GET /recommend)
interface BudgetRecommendation {
  category: string;
  categoryId: string;
  currentSpending: number;
  recommendedBudget: number;
  reason: string;
  confidence: number;
}

// Budget Alert (from GET /alerts)
interface BudgetAlert {
  type: 'budget_exceeded' | 'budget_warning' | 'budget_projection';
  budgetId: string;
  category: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
}
```

---

## 🔧 Step 1: Create Budget Service

**File:** `src/services/budget.service.ts`

### **Requirements:**

1. **Import configured Axios instance** from `src/lib/axios.ts`
2. **Follow the pattern** used in `transaction.service.ts`
3. **Create type-safe functions** for all 8 endpoints
4. **Handle errors** consistently

### **Expected Implementation:**

```typescript
import api from '@/lib/axios'; // Use configured Axios instance

const BUDGET_BASE_URL = '/api/budgets';

// Type definitions
export interface CreateBudgetInput {
  categoryId: string;
  amount: number;
  period: 'monthly' | 'semester' | 'yearly';
  alertThreshold?: number;
  startDate?: string;
  endDate?: string;
  rollover?: boolean;
}

export interface UpdateBudgetInput {
  amount?: number;
  alertThreshold?: number;
  rollover?: boolean;
}

export interface BudgetFilters {
  categoryId?: string;
  period?: 'monthly' | 'semester' | 'yearly';
  active?: boolean;
}

// Service functions
export const budgetService = {
  // Get all budgets with optional filters
  getAll: async (filters?: BudgetFilters) => {
    const { data } = await api.get(BUDGET_BASE_URL, { params: filters });
    return data;
  },

  // Get single budget by ID
  getById: async (id: string) => {
    const { data } = await api.get(`${BUDGET_BASE_URL}/${id}`);
    return data;
  },

  // Create new budget
  create: async (input: CreateBudgetInput) => {
    const { data } = await api.post(BUDGET_BASE_URL, input);
    return data;
  },

  // Update budget
  update: async (id: string, input: UpdateBudgetInput) => {
    const { data } = await api.put(`${BUDGET_BASE_URL}/${id}`, input);
    return data;
  },

  // Delete budget
  delete: async (id: string) => {
    const { data } = await api.delete(`${BUDGET_BASE_URL}/${id}`);
    return data;
  },

  // Get real-time budget status
  getStatus: async () => {
    const { data } = await api.get(`${BUDGET_BASE_URL}/status`);
    return data;
  },

  // Get AI recommendations
  getRecommendations: async () => {
    const { data } = await api.get(`${BUDGET_BASE_URL}/recommend`);
    return data;
  },

  // Get budget alerts
  getAlerts: async () => {
    const { data } = await api.get(`${BUDGET_BASE_URL}/alerts`);
    return data;
  },
};
```

---

## 🪝 Step 2: Create React Query Hooks

**File:** `src/hooks/useBudgets.ts`

### **Requirements:**

1. **Use TanStack Query** for data fetching
2. **Handle loading/error states**
3. **Implement optimistic updates**
4. **Cache management** with automatic refetch

### **Expected Implementation:**

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetService } from '@/services/budget.service';
import { toast } from 'sonner';

// Query keys
const BUDGET_KEYS = {
  all: ['budgets'] as const,
  lists: () => [...BUDGET_KEYS.all, 'list'] as const,
  list: (filters?: BudgetFilters) => [...BUDGET_KEYS.lists(), filters] as const,
  details: () => [...BUDGET_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...BUDGET_KEYS.details(), id] as const,
  status: () => [...BUDGET_KEYS.all, 'status'] as const,
  recommendations: () => [...BUDGET_KEYS.all, 'recommendations'] as const,
  alerts: () => [...BUDGET_KEYS.all, 'alerts'] as const,
};

// Hook: Get all budgets
export const useBudgets = (filters?: BudgetFilters) => {
  return useQuery({
    queryKey: BUDGET_KEYS.list(filters),
    queryFn: () => budgetService.getAll(filters),
  });
};

// Hook: Get single budget
export const useBudget = (id: string) => {
  return useQuery({
    queryKey: BUDGET_KEYS.detail(id),
    queryFn: () => budgetService.getById(id),
    enabled: !!id,
  });
};

// Hook: Get budget status
export const useBudgetStatus = () => {
  return useQuery({
    queryKey: BUDGET_KEYS.status(),
    queryFn: () => budgetService.getStatus(),
    refetchInterval: 60000, // Refetch every minute
  });
};

// Hook: Get recommendations
export const useBudgetRecommendations = () => {
  return useQuery({
    queryKey: BUDGET_KEYS.recommendations(),
    queryFn: () => budgetService.getRecommendations(),
  });
};

// Hook: Get alerts
export const useBudgetAlerts = () => {
  return useQuery({
    queryKey: BUDGET_KEYS.alerts(),
    queryFn: () => budgetService.getAlerts(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

// Mutation: Create budget
export const useCreateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: budgetService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUDGET_KEYS.all });
      toast.success('Budget created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create budget');
    },
  });
};

// Mutation: Update budget
export const useUpdateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBudgetInput }) =>
      budgetService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUDGET_KEYS.all });
      toast.success('Budget updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update budget');
    },
  });
};

// Mutation: Delete budget
export const useDeleteBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: budgetService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUDGET_KEYS.all });
      toast.success('Budget deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete budget');
    },
  });
};
```

---

## 🎨 Step 3: Create Reusable Components

### **Component 1: BudgetCard**

**File:** `src/components/budget/BudgetCard.tsx`

**Purpose:** Display single budget with progress bar and status

**Requirements:**
- Show category name and color
- Progress bar (0-100%+)
- Status badge (safe/warning/danger/exceeded)
- Spent vs limit
- Days remaining
- Edit/delete actions

**Visual Design:**

```
┌─────────────────────────────────────────┐
│ 🍔 Food & Dining              [Edit][×] │
│ ────────────────────────────────────    │
│ $450 / $500                    [90%] ⚠️ │
│                                          │
│ ━━━━━━━━━━━━━━━━━━━━━━░░░░░░░░░  90%    │
│                                          │
│ 📊 Status: Danger  •  ⏰ 10 days left   │
│ 📈 Projected: $500 (On track)           │
└─────────────────────────────────────────┘
```

**Expected Structure:**

```tsx
import { BudgetStatus } from '@/types/budget';

interface BudgetCardProps {
  budget: BudgetStatus;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({
  budget,
  onEdit,
  onDelete,
}) => {
  // Determine status color
  const statusColors = {
    safe: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-orange-500',
    exceeded: 'bg-red-500',
  };

  // Determine progress bar color
  const progressColors = {
    safe: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-orange-600',
    exceeded: 'bg-red-600',
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: budget.category.color + '20' }}
          >
            <span style={{ color: budget.category.color }}>
              {/* Category icon */}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {budget.category.name}
            </h3>
            <p className="text-sm text-gray-500">{budget.period}</p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <button onClick={() => onEdit(budget.budgetId)}>Edit</button>
          <button onClick={() => onDelete(budget.budgetId)}>Delete</button>
        </div>
      </div>

      {/* Amount */}
      <div className="mb-3">
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-2xl font-bold text-gray-900">
            ${budget.spent.toFixed(2)}
          </span>
          <span className="text-gray-500">/ ${budget.limit.toFixed(2)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${
              progressColors[budget.status]
            }`}
            style={{ width: `${Math.min(budget.percentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-sm">
          <span className="text-gray-600">{budget.percentage.toFixed(1)}%</span>
          {budget.remaining > 0 ? (
            <span className="text-gray-600">
              ${budget.remaining.toFixed(2)} remaining
            </span>
          ) : (
            <span className="text-red-600">
              ${Math.abs(budget.remaining).toFixed(2)} over
            </span>
          )}
        </div>
      </div>

      {/* Status & Info */}
      <div className="flex items-center gap-4 text-sm">
        <span
          className={`px-3 py-1 rounded-full text-white ${
            statusColors[budget.status]
          }`}
        >
          {budget.status.charAt(0).toUpperCase() + budget.status.slice(1)}
        </span>
        <span className="text-gray-600">{budget.daysLeft} days left</span>
        {budget.projectedSpending && (
          <span
            className={
              budget.onTrack ? 'text-green-600' : 'text-orange-600'
            }
          >
            Projected: ${budget.projectedSpending.toFixed(2)}
          </span>
        )}
      </div>
    </div>
  );
};
```

---

### **Component 2: BudgetForm**

**File:** `src/components/budget/BudgetForm.tsx`

**Purpose:** Create/edit budget with validation

**Requirements:**
- Category selection (dropdown)
- Amount input (number)
- Period selection (monthly/semester/yearly)
- Alert threshold slider (0-100%)
- Form validation (React Hook Form + Zod)
- Submit with loading state

**Zod Schema:**

```typescript
import { z } from 'zod';

export const budgetFormSchema = z.object({
  categoryId: z.string().uuid('Please select a category'),
  amount: z.number().positive('Amount must be greater than 0'),
  period: z.enum(['monthly', 'semester', 'yearly']),
  alertThreshold: z.number().min(0).max(100).default(80),
  rollover: z.boolean().default(false),
});

export type BudgetFormValues = z.infer<typeof budgetFormSchema>;
```

**Expected Structure:**

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { budgetFormSchema } from './schema';

interface BudgetFormProps {
  defaultValues?: Partial<BudgetFormValues>;
  categories: Category[];
  onSubmit: (data: BudgetFormValues) => void;
  isSubmitting: boolean;
}

export const BudgetForm: React.FC<BudgetFormProps> = ({
  defaultValues,
  categories,
  onSubmit,
  isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      alertThreshold: 80,
      rollover: false,
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Category Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          {...register('categoryId')}
          className="w-full rounded-lg border-gray-300"
        >
          <option value="">Select a category...</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="text-red-600 text-sm mt-1">
            {errors.categoryId.message}
          </p>
        )}
      </div>

      {/* Amount Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Budget Amount ($)
        </label>
        <input
          type="number"
          step="0.01"
          {...register('amount', { valueAsNumber: true })}
          className="w-full rounded-lg border-gray-300"
        />
        {errors.amount && (
          <p className="text-red-600 text-sm mt-1">{errors.amount.message}</p>
        )}
      </div>

      {/* Period Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Period
        </label>
        <select {...register('period')} className="w-full rounded-lg">
          <option value="monthly">Monthly</option>
          <option value="semester">Semester (6 months)</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* Alert Threshold Slider */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alert Threshold: {/* Display value */}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          {...register('alertThreshold', { valueAsNumber: true })}
          className="w-full"
        />
        <p className="text-sm text-gray-500 mt-1">
          Get notified when you reach this percentage
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-teal-600 text-white py-3 rounded-lg"
      >
        {isSubmitting ? 'Creating...' : 'Create Budget'}
      </button>
    </form>
  );
};
```

---

### **Component 3: BudgetRecommendations**

**File:** `src/components/budget/BudgetRecommendations.tsx`

**Purpose:** Display AI-generated budget recommendations

**Visual Design:**

```
┌──────────────────────────────────────────┐
│ 🤖 AI Budget Recommendations             │
├──────────────────────────────────────────┤
│ Based on your 3-month spending history   │
│                                           │
│ ┌────────────────────────────────────┐   │
│ │ 🍔 Food & Dining                   │   │
│ │ Current avg: $450/month            │   │
│ │ ✨ Recommended: $495/month          │   │
│ │ 📊 Confidence: 100%                 │   │
│ │ [Create Budget]                    │   │
│ └────────────────────────────────────┘   │
└──────────────────────────────────────────┘
```

---

## 📄 Step 4: Build Main Page

**File:** `src/pages/BudgetsPage.tsx`

### **Page Structure:**

```tsx
import { useState } from 'react';
import { useBudgetStatus, useBudgetRecommendations, useBudgetAlerts } from '@/hooks/useBudgets';
import { BudgetCard } from '@/components/budget/BudgetCard';
import { BudgetForm } from '@/components/budget/BudgetForm';
import { BudgetRecommendations } from '@/components/budget/BudgetRecommendations';

export const BudgetsPage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Fetch data
  const { data: statusData, isLoading: statusLoading } = useBudgetStatus();
  const { data: recommendations } = useBudgetRecommendations();
  const { data: alerts } = useBudgetAlerts();

  if (statusLoading) {
    return <div>Loading...</div>; // Better: Use skeleton loaders
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-teal-600 text-white px-6 py-3 rounded-lg"
        >
          + Create Budget
        </button>
      </div>

      {/* Alerts Section */}
      {alerts && alerts.data.length > 0 && (
        <div className="mb-6">
          {/* Display alerts */}
        </div>
      )}

      {/* Recommendations Section */}
      {recommendations && recommendations.data.length > 0 && (
        <BudgetRecommendations recommendations={recommendations.data} />
      )}

      {/* Budget List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statusData?.data.map((budget) => (
          <BudgetCard
            key={budget.budgetId}
            budget={budget}
            onEdit={(id) => console.log('Edit', id)}
            onDelete={(id) => console.log('Delete', id)}
          />
        ))}
      </div>

      {/* Create Budget Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Create Budget</h2>
            <BudgetForm
              categories={[/* fetch from API */]}
              onSubmit={(data) => console.log(data)}
              isSubmitting={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};
```

---

## 🎨 Design System Requirements

### **Colors (Status-Based):**

```typescript
const statusConfig = {
  safe: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-200',
    progress: 'bg-green-600',
  },
  warning: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
    progress: 'bg-yellow-600',
  },
  danger: {
    bg: 'bg-orange-100',
    text: 'text-orange-700',
    border: 'border-orange-200',
    progress: 'bg-orange-600',
  },
  exceeded: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-200',
    progress: 'bg-red-600',
  },
};
```

### **Icons (Use Material Symbols):**

```tsx
// Import from Material Symbols
import { 
  TrendingUp, 
  Warning, 
  CheckCircle, 
  Error 
} from '@mui/icons-material';
```

---

## ✅ Acceptance Criteria

Your implementation is complete when:

1. ✅ User can create budgets with validation
2. ✅ Budget list displays with real-time status
3. ✅ Progress bars animate smoothly
4. ✅ Status colors match design system
5. ✅ Edit/delete functionality works
6. ✅ AI recommendations display correctly
7. ✅ Alerts show at top of page
8. ✅ Loading states use skeletons (not spinners)
9. ✅ Error handling with toast notifications
10. ✅ Mobile responsive (works on 375px+ screens)
11. ✅ TypeScript strict mode passes
12. ✅ No console errors or warnings

---

## 🧪 Testing Checklist

Before submitting:

- [ ] Create budget form validation works
- [ ] Budget cards display correctly
- [ ] Progress bars show accurate percentages
- [ ] Status badges match backend status
- [ ] Edit modal pre-fills data
- [ ] Delete shows confirmation
- [ ] Recommendations display with confidence
- [ ] Alerts show with correct severity
- [ ] Loading states don't flicker
- [ ] Mobile layout doesn't break
- [ ] Typescript compiles without errors
- [ ] Axios interceptors handle 401 errors

---

## 📚 Additional Resources

### **Refer to existing code:**
- `DashboardPage.tsx` - For layout patterns
- `TransactionsPage.tsx` - For list/filter patterns
- `transaction.service.ts` - For service structure
- `useTransactions.ts` - For React Query patterns

### **Backend API Testing:**
Use these curl commands to test backend:

```bash
# Get budget status
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/budgets/status

# Get recommendations
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/budgets/recommend
```

---

## 🚀 Implementation Order

1. **Day 1:** Create `budget.service.ts` and types
2. **Day 2:** Create `useBudgets.ts` hooks
3. **Day 3:** Build `BudgetCard.tsx` component
4. **Day 4:** Build `BudgetForm.tsx` with validation
5. **Day 5:** Build `BudgetsPage.tsx` and integrate
6. **Day 6:** Add recommendations and alerts
7. **Day 7:** Polish, test, and fix bugs

---

## 💡 Pro Tips

1. **Use React Query DevTools** to debug queries
2. **Extract magic numbers** to constants
3. **Create utility functions** for formatting
4. **Add loading skeletons** instead of spinners
5. **Test with real data** from backend
6. **Handle edge cases** (0 budgets, 0 categories)
7. **Add confirmation modals** for delete
8. **Debounce search inputs** if adding search

---

## 🎯 Expected Deliverables

When you finish, provide:

1. ✅ All source files (`services/`, `hooks/`, `components/`, `pages/`)
2. ✅ Type definitions
3. ✅ Screenshots of working UI
4. ✅ Brief documentation of any deviations from spec
5. ✅ List of known issues (if any)

---

**Ready to build? Ask me any questions before you start!**
