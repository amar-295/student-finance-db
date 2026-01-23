# UniFlow Frontend

The frontend application for UniFlow, built with **React 19**, **Vite**, **TypeScript**, and **Tailwind CSS**.

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Backend server running on port 5000

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

## 🏗 Architecture

### Tech Stack
-   **Build Tool**: Vite 7
-   **Framework**: React 19
-   **Styling**: Tailwind CSS 3.4
-   **State Management**: Zustand (Global Auth), TanStack Query (Server State)
-   **Routing**: React Router 7
-   **Forms**: React Hook Form + Zod
-   **HTTP Client**: Axios
-   **Testing**: Vitest + React Testing Library

### Directory Structure
```
src/
├── components/     # Reusable UI components
├── contexts/       # React Context providers (Auth, Theme)
├── features/       # Feature-based modules (Auth, Budgets, etc.)
├── hooks/          # Custom React hooks
├── layouts/        # Page layouts (Dashboard, Auth)
├── pages/          # Route components
├── services/       # API integration services
├── store/          # Global state stores
└── test/           # Test utilities and setup
```

## 🧪 Testing

```bash
# Run unit and integration tests
npm test

# Run tests with UI coverage
npm run test:ui
```

## 🌐 Environment Variables

Check `.env.example` for required variables.

```env
VITE_API_URL=http://localhost:5000/api
```
