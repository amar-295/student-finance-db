# 🎨 UniFlow Frontend Architecture

The frontend is a **Single Page Application (SPA)** built with **React 19** and **Vite**, focusing on performance, accessibility, and pixel-perfect design.

## 🌊 Frontend Data Flow

We use a layered architecture to separate UI from Data Logic.

```mermaid
graph TD
    User([User]) -->|Interacts| UI[React Components]
    UI -->|Triggers| Hook[Custom Hook]
    
    subgraph "Data Layer"
        Hook -->|Read/Write| Query[TanStack Query]
        Hook -->|Global State| Store[Zustand Store]
    end
    
    Query -->|Fetch| API[Axios Service]
    API -->|HTTPS| Backend[Backend API]
    
    Backend -->|JSON| API
    API -->|Data| Query
    Query -->|Cache Update| UI
```

1.  **UI Layer**: Components (e.g., `TransactionList`) only handle display and user events.
2.  **Logic Layer**: Custom hooks (e.g., `useTransactions`) abstract away the fetching logic.
3.  **Cache Layer**: `TanStack Query` manages loading states, caching, and background updates.
4.  **Service Layer**: `Axios` instances handle the raw HTTP communication (headers, auth tokens).

---

## 📂 Deep Codebase Structure

```
frontend/
├── src/
│   ├── assets/             # 🖼️ Static Images, Fonts
│   │
│   ├── components/         # 🧩 Reusable UI
│   │   ├── common/         # Buttons, Inputs, Cards
│   │   ├── layout/         # Sidebar, Header, Layout Wrappers
│   │   ├── transactions/   # Transaction-specific Widgets
│   │   └── styles/         # Shared tailwind classes
│   │
│   ├── features/           # 📦 Domain Modules
│   │   ├── auth/           # Login/Register Logic
│   │   ├── budgets/        # Budget Logic
│   │   └── transactions/   # Transaction Logic
│   │
│   ├── hooks/              # 🪝 Custom Hooks
│   │   ├── useAuth.ts
│   │   ├── useDebounce.ts
│   │   └── useTheme.ts
│   │
│   ├── pages/              # 📄 Route Views
│   │   ├── DashboardPage.tsx
│   │   ├── TransactionsPage.tsx
│   │   └── LoginPage.tsx
│   │
│   ├── services/           # 📡 API Connectors
│   │   ├── api.ts          # Axios Interceptors
│   │   ├── authService.ts
│   │   └── transactionService.ts
│   │
│   └── store/              # 🏪 Global State
│       └── useAuthStore.ts # User Session Store
```

---

## ⚡ State Management Strategy

We use a hybrid approach to state management for optimal performance:

1.  **Server State (**`@tanstack/react-query`**)**:
    *   Handles all async data (Transactions, User Profile).
    *   Provides automatic caching, background refetching (stale-while-revalidate), and optimistic updates.
    *   *Why?* Eliminates manual `useEffect` fetching and loading state boilerplate.

2.  **Client State (**`zustand`**)**:
    *   Handles global UI state that doesn't persist to the DB.
    *   Examples: `useAuthStore` (User session), `useSidebarStore` (Menu toggle).
    *   *Why?* Simpler and faster than Redux/Context API for global signals.

3.  **Form State (**`react-hook-form` + `zod`**)**:
    *   Manages uncontrolled form inputs and validation.
    *   *Why?* Renders only changed components (high performance) and shares validation logic with backend.

---

## 🎨 Design System & Styling

*   **Tailwind CSS 3.4**: Utility-first styling for rapid development.
*   **Radix UI / Headless UI**: Unstyled, accessible primitives for complex components (Dialogs, Dropdowns).
*   **Framer Motion**: Declarative animations for page transitions and micro-interactions.
*   **Responsive**: Mobile-first breakpoints (`sm`, `md`, `lg`, `xl`).

---

## 🧪 Testing & Quality Assurance

We maintain a high set of standards for code quality with automated verification.

*   **Framework**: Vitest + React Testing Library + MSW
*   **Total Tests**: 63
*   **Success Rate**: ✅ 100%

For a detailed breakdown of test suites and results, see:
👉 [**TESTING.md**](../docs/TESTING.md)

### Runtime Commands
```bash
# Run tests
npm test

# Open UI Dashboard for interactive testing
npm run test:ui
```

### Coverage
We cover all critical user flows including **Authentication**, **Transactions**, **Budgets**, **Analytics**, and **Reports**. All network requests are mocked using `msw` to ensure deterministic results.

