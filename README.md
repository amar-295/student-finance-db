# 🎓 UniFlow - Student Finance Dashboard
## Complete Project Overview & Context

---

## 📋 Project Summary

**UniFlow** is a comprehensive AI-powered personal finance management application designed specifically for college students. It combines budgeting, transaction tracking, AI categorization, and bill-splitting features into one cohesive platform.

**Target Users:** College students who need to manage limited budgets, track expenses, and split bills with roommates.

**Current Stage:** Backend 100% Verified - Frontend Integration in Progress

---

## 🏗️ Architecture Overview

### **Full-Stack TypeScript Application**

```
student-finance-db/
├── backend/           # Express.js REST API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic (AuditService added)
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth, Error, Audit, OptionalAuth
│   │   ├── types/          # TypeScript types & Zod schemas
│   │   ├── config/         # Environment config
│   │   ├── utils/          # Helper functions
│   │   ├── app.ts          # Express app setup (Rate limiting)
│   │   └── server.ts       # Server entry point
│   ├── prisma/
│   │   └── schema.prisma   # Database schema (AuditLog added)
│   ├── Dockerfile          # Production container config ✨ NEW
│   └── package.json
│
├── .github/worklows/       # CI/CD Pipeline ✨ NEW
│   └── ci.yml              # Automated testing & linting
├── docker-compose.yml      # Local stack orchestration ✨ NEW
└── frontend/          # React + Vite SPA
    ├── src/
    │   ├── pages/          # Route components
    │   ├── components/     # Reusable UI components
    │   ├── services/       # API client services
    │   ├── App.tsx         # Router setup
    │   └── main.tsx        # Entry point
    ├── public/             # Static assets (favicons, etc.)
    └── package.json
```

---

## 🛠️ Technology Stack

### **Backend**
| Category | Technology | Purpose |
|----------|-----------|---------|
| **Runtime** | Node.js v20+ | JavaScript runtime |
| **Framework** | Express.js | Web server framework |
| **Language** | TypeScript | Type-safe development |
| **Database** | PostgreSQL (via Prisma) | Relational data storage |
| **ORM** | Prisma | Type-safe database queries |
| **Cache** | Redis (via ioredis) | AI categorization cache |
| **Validation** | Zod | Schema validation |
| **Auth** | JWT (jsonwebtoken) | Authentication tokens |
| **Security** | bcryptjs, helmet, cors | Password hashing, security headers |
| **AI** | Hugging Face API | Transaction categorization |
| **Logging** | Audit & Audit Service | Per-action DB logging ✨ NEW |
| **Infrastructure**| Docker & Docker Compose| Containerization ✨ NEW |
| **CI/CD** | GitHub Actions | Automated tests & linting ✨ NEW |

### **Frontend**
| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | React 19 | UI library |
| **Build Tool** | Vite 7 | Fast dev server & bundler |
| **Language** | TypeScript | Type-safe development |
| **Routing** | React Router v7 | Client-side routing |
| **Styling** | Tailwind CSS 3 | Utility-first CSS |
| **HTTP Client** | Axios | API requests |
| **Validation** | Zod | Form validation |
| **Icons** | Material Symbols | Icon library |
| **Fonts** | Plus Jakarta Sans, Noto Sans | Typography |

---

## 📁 Detailed File Structure

### **Backend (src/) - 5 Controllers, 7 Services, 5 Routes**

```
backend/src/
├── controllers/               # API request handlers
│   ├── auth.controller.ts         (2.9 KB) - Login, signup, logout
│   ├── password-reset.controller.ts (2.5 KB) - Forgot & Reset password logic
│   ├── account.controller.ts      (1.8 KB) - Account CRUD
│   ├── transaction.controller.ts  (2.6 KB) - Transaction CRUD
│   ├── budget.controller.ts       (3.2 KB) - Budget CRUD + status/alerts
│   └── health.controller.ts       (1.2 KB) - Health checks
│
├── services/                  # Business logic layer
│   ├── auth.service.ts            (4.6 KB) - User registration, JWT
│   ├── password-reset.service.ts  (8.2 KB) - Secure token hashing & expiry
│   ├── account.service.ts         (2.7 KB) - Account management
│   ├── transaction.service.ts    (10.6 KB) - Transaction logic
│   ├── budget.service.ts         (13.1 KB) - Budget tracking, AI recommendations
│   ├── ai-categorization.service.ts (7.7 KB) - Hugging Face integration
│   ├── ai-insights.service.ts    (11.8 KB) - AI spending insights
│   ├── email.service.ts          (2.6 KB) - Nodemailer & Ethereal setup
│   └── tokenBlacklist.service.ts  (2.4 KB) - JWT blacklist (logout)
│
├── routes/                    # API endpoint definitions
│   ├── auth.routes.ts             (1.1 KB) - /api/auth/*
│   ├── account.routes.ts          (1.0 KB) - /api/accounts/*
│   ├── transaction.routes.ts      (1.3 KB) - /api/transactions/*
│   ├── budget.routes.ts           (1.6 KB) - /api/budgets/*
│   └── health.routes.ts           (0.5 KB) - /health
│
├── types/                     # TypeScript types & schemas
│   ├── auth.types.ts              (1.4 KB) - User, AuthResponse
│   ├── password-reset.types.ts    (1.2 KB) - Reset request validation
│   ├── account.types.ts           (1.1 KB) - Account types
│   ├── transaction.types.ts       (2.8 KB) - Transaction types
│   ├── budget.types.ts            (2.2 KB) - Budget types
│   └── express.d.ts               (0.3 KB) - Express type extensions
│
├── middleware/
│   ├── auth.middleware.ts         - JWT verification
│   ├── audit.middleware.ts        - Request logging ✨ NEW
│   ├── optionalAuthenticate.ts    - Rate limit helper ✨ NEW
│   ├── errorHandler.middleware.ts - Global error handling
│   └── index.ts                   - Middleware exports
│
├── config/
│   └── env.ts                     - Environment variables
│
├── utils/
│   └── Various helper functions
│
├── tests/                     # Jest Test Suite
│   ├── integration/               - API integration tests (68 tests)
│   ├── payloads/                  - JSON test data
│   └── setup.ts                   - Test environment setup
│
├── Dockerfile                  # Multi-stage production build ✨ NEW
├── app.ts                     (1.8 KB) - Express app configuration
└── server.ts                  (2.5 KB) - Server startup
```

### **Frontend (src/) - 7 Pages, 4 Components, 2 Services**

```
frontend/src/
├── pages/                     # Route components
│   ├── LandingPage.tsx           (15.4 KB) - Homepage (/)
│   ├── DashboardPage.tsx         (24.7 KB) - Main dashboard (/dashboard)
│   ├── TransactionsPage.tsx       (8.5 KB) - Transaction list (/transactions) ✨ NEW
│   ├── AccountsPage.tsx          (20.5 KB) - Accounts overview (/accounts)
│   ├── BudgetsPage.tsx            (0.7 KB) - Coming soon (/budgets)
│   ├── AnalyticsPage.tsx          (0.7 KB) - Coming soon (/analytics)
│   ├── SettingsPage.tsx           (0.7 KB) - Coming soon (/settings)
│   └── auth/
│       ├── LoginPage.tsx          - Login UI
│       ├── SignupPage.tsx         - Signup UI
│       ├── ForgotPasswordPage.tsx - Password reset
│       └── AboutPage.tsx          - About section
│
├── components/                # Reusable UI components
│   ├── Header.tsx                 (4.4 KB) - Navigation bar
│   ├── Footer.tsx                 (5.7 KB) - Footer
│   ├── ProtectedRoute.tsx         (0.3 KB) - Auth guard
│   └── layout/
│       └── DashboardLayout.tsx    - Dashboard shell with sidebar
│
├── services/                  # API client services
│   ├── auth.service.ts            (2.9 KB) - Authentication API
│   └── transaction.service.ts     (3.5 KB) - Transaction API ✨ NEW
│
├── App.tsx                    (1.8 KB) - Router configuration
├── main.tsx                   (0.2 KB) - App entry point
└── index.css                  (0.5 KB) - Global styles
```

### **Database Schema (Prisma) - 18 Tables**

```
prisma/schema.prisma
├── Core Tables (4)
│   ├── User             - User accounts
│   ├── Account          - Bank accounts (checking, savings, cash)
│   ├── Category         - Transaction categories
│   └── Transaction      - Financial transactions
│
├── Budget Tables (1)
│   └── Budget           - Spending limits per category
│
├── Bill Splitting (4)
│   ├── Group            - Roommate groups
│   ├── GroupMember      - Group membership
│   ├── BillSplit        - Shared expenses
│   └── SplitParticipant - Individual shares
│
├── AI & Insights (2)
│   ├── AiCategoryCache  - Cached AI categorizations
│   └── Insight          - AI-generated insights
│
├── Notifications (2)
│   ├── NotificationSetting - User preferences
│   └── Notification        - Notification queue
│
├── Reporting (3)
│   ├── Report           - Monthly/semester reports
│   ├── PaymentReminder  - Bill reminders
│   └── AuditLog         - Security & tracking
```

---

## 🎯 Feature Status Matrix

| Feature | Backend API | Frontend UI | Status |
|---------|-------------|-------------|--------|
| **Authentication** | ✅ Complete | ✅ Complete | 🟢 Live |
| **Password Reset** | ✅ Complete | ✅ Complete | 🟢 Live |
| **User Registration** | ✅ Complete | ✅ Complete | 🟢 Live |
| **Accounts Management** | ✅ Complete | ✅ Complete | 🟢 Live |
| **Transactions (CRUD)** | ✅ Complete | ✅ Complete | 🟢 Live |
| **AI Categorization** | ✅ Complete | 🟡 Partial | 🟡 Backend Ready |
| **Budget Tracking** | ✅ Complete | ⏳ Pending | 🟡 Backend Ready |
| **Budget Recommendations** | ✅ Complete | ⏳ Pending | 🟡 Backend Ready |
| **Dashboard Overview** | ✅ Complete | ✅ Complete | 🟢 Live |
| **AI Insights** | ✅ Complete | 🟡 Partial | 🟡 Backend Ready |
| **Bill Splitting** | ✅ Complete | ⏳ Pending | 🟡 Backend Ready |
| **Email Notifications** | ✅ Complete | ⏳ Pending | 🟡 Backend Ready |
| **Audit Logging** | ✅ Complete | ✅ Complete | 🟢 Infrastructure |
| **Dockerization** | ✅ Complete | ✅ Complete | 🟢 Infrastructure |
| **CI/CD Pipeline** | ✅ Complete | ✅ Complete | 🟢 Infrastructure |
| **Reports & Analytics** | ⏳ Pending | ⏳ Pending | 🔴 Not Started |

---

## 🚀 API Endpoints (Currently Active)

### **Authentication** (`/api/auth`)
```
POST   /api/auth/register      - Create new user account
POST   /api/auth/login         - Login & get JWT token
POST   /api/auth/forgot-password - Request password reset token
POST   /api/auth/verify-reset-token - Validate reset token
POST   /api/auth/reset-password - Update password with token
POST   /api/auth/logout        - Invalidate JWT token
GET    /api/auth/me            - Get current user info
POST   /api/auth/refresh       - Refresh access token
```

### **Accounts** (`/api/accounts`)
```
POST   /api/accounts           - Create new account
GET    /api/accounts           - List all accounts
GET    /api/accounts/:id       - Get single account
PUT    /api/accounts/:id       - Update account
DELETE /api/accounts/:id       - Delete account
GET    /api/accounts/summary   - Get balance summary
```

### **Transactions** (`/api/transactions`)
```
POST   /api/transactions       - Create transaction (AI categorizes)
GET    /api/transactions       - List transactions (filterable)
GET    /api/transactions/:id   - Get single transaction
PUT    /api/transactions/:id   - Update transaction
DELETE /api/transactions/:id   - Delete transaction
GET    /api/transactions/search - Search transactions
```

### **Budgets** (`/api/budgets`) ✨ **JUST ADDED**
```
POST   /api/budgets            - Create budget
GET    /api/budgets            - List budgets (filterable)
GET    /api/budgets/:id        - Get single budget
PUT    /api/budgets/:id        - Update budget
DELETE /api/budgets/:id        - Delete budget
GET    /api/budgets/status     - Get budget health status
GET    /api/budgets/recommend  - Get AI budget recommendations
GET    /api/budgets/alerts     - Get budget warnings & alerts
```

### **Health** (`/health`)
```
GET    /health                 - API health check
GET    /health/db              - Database connection check
```

---

## 🎨 UI Pages & Routes

### **Public Routes**
```
/                   - Landing page (hero, features, CTA)
/login              - Login form
/signup             - Registration form
/about              - About UniFlow
/forgot-password    - Password reset
```

### **Protected Routes** (Require Authentication)
```
/dashboard          - Main dashboard (summary cards, charts)
/accounts           - Accounts overview with balance cards
/transactions       - Transaction list with search/filters ✨ NEW
/budgets            - Budget management (Coming Soon)
/analytics          - Spending analytics (Coming Soon)
/settings           - User settings (Coming Soon)
```

---

## 🎨 Design System

### **Color Palette**
```css
Primary:    #2eb8b5  (Teal)
Primary Dark: #259694
Secondary:  #4F46E5  (Indigo)
Text Main:  #101919  (Dark)
Text Muted: #578e8d  (Muted Teal)
Background: #f6f8f8  (Light Gray)
```

### **Typography**
- **Display Font:** Plus Jakarta Sans (headings, buttons)
- **Body Font:** Noto Sans (paragraphs, labels)

### **Icons**
- Material Symbols (Outlined style)

---

## 🔐 Security Features

1. **Password Hashing:** bcrypt with salt rounds
2. **JWT Authentication:** Access & refresh tokens
3. **Token Blacklist:** Logout invalidation via Redis
4. **CORS Protection:** Configured origins
5. **Helmet.js:** Security headers
6. **Rate Limiting:** User-based request throttling ✨ UPGRADED
7. **Input Validation:** Zod schema validation
8. **SQL Injection Protection:** Prisma parameterized queries
9. **Audit Logging:** Action tracking in PostgreSQL ✨ NEW
10. **CI/CD Security:** Automated security scans & tests ✨ NEW

---

## 🤖 AI Integration

### **Hugging Face API** (`facebook/bart-large-mnli`)
- **Feature:** Zero-shot classification for transaction categorization
- **Cache:** Redis caches merchant → category mappings
- **Fallback:** Rule-based categorization if API unavailable
- **Categories:** Food, Transportation, Housing, Entertainment, Shopping, etc.

### **Budget Recommendations**
- Analyzes 3 months of spending history
- Calculates average spending per category
- Adds 10% buffer for recommended budget
- Confidence score based on data points

### **Spending Insights** (Implemented but not yet in UI)
- Detects unusual spending patterns
- Identifies spending increases
- Suggests optimization opportunities
- Projects future spending

---

## 📊 Database Statistics

**Total Tables:** 18  
**Total Controllers:** 6  
**Total Services:** 8  
**Total Routes:** 6 route files  
**Total API Endpoints:** ~40+

---

## 🚦 Current Development Status

### ✅ **Completed**
- Authentication & Authorization system
- User account management
- Transaction CRUD with AI categorization
- Budget tracking & recommendations API
- Dashboard UI with charts
- Transaction list UI with filtering
- Account overview UI
- Landing page
- Responsive navigation & layout
- Favicon implementation
- Password Reset Flow (Full verification)
- Backend System Stabilization (Type safety, Schema Sync)
- **User-Based Rate Limiting** ✨ NEW
- **Database Audit Logging** (Auth, Accounts, Transactions) ✨ NEW
- **Dockerization** (Dockerfile, Compose) ✨ NEW
- **CI/CD Pipeline Integration** ✨ NEW

### 🟡 **In Progress**
- Budget UI (Backend ready, Frontend pending)
- AI insights UI integration

### ⏳ **Planned (TODO.md)**
- Bill splitting features
- Recurring transactions
- Analytics & reports
- Email notifications
- Settings page
- User profile management

---

## 🔧 Environment Setup

### **Backend** (`backend/.env`)
```env
DATABASE_URL="postgresql://..."
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"
HUGGING_FACE_API_KEY="hf_..."
FRONTEND_URL="http://localhost:5173"
PORT=5000
NODE_ENV=development
```

### **Frontend** (Vite proxy)
```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': 'http://localhost:5000'
  }
}
```

---

## 📜 Scripts Reference

### **Backend**
```bash
npm run dev              # Start dev server (tsx watch)
npm run build            # Compile TypeScript
npm start                # Run production build
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio GUI
npm test                 # Run tests
```

### **Frontend**
```bash
npm run dev              # Start Vite dev server (http://localhost:5173)
npm run build            # Build for production
npm run preview          # Preview production build
```

---

## 📝 Key Conventions

### **Backend Patterns**
- **Controllers:** Handle HTTP requests, call services
- **Services:** Business logic, database queries
- **Middleware:** asyncHandler for error catching, authenticate for JWT
- **Types:** Zod schemas for validation, TypeScript interfaces for types
- **Error Handling:** Custom AppError class, global error handler

### **Frontend Patterns**
- **Pages:** Route-level components in `src/pages/`
- **Components:** Reusable UI in `src/components/`
- **Services:** API client logic in `src/services/`
- **Styling:** Tailwind utility classes, custom color palette
- **State:** React hooks (useState, useEffect), localStorage for auth

---

## 🎯 Next Implementation Steps

The priority order for remaining development is:

1. **Budget Frontend UI** ✨ READY TO BUILD
   - Budget creation form
   - Budget list with progress bars
   - Status indicators (safe/warning/danger)
   - Alerts & recommendations display

2. **Bill Splitting** (Backend + Frontend)
   - Group creation
   - Split calculation
   - Payment tracking

3. **Analytics & Reports** (Backend + Frontend)
   - Monthly reports
   - Category breakdowns
   - Trend charts

---

## 🔗 Important Links

- **Backend API:** http://localhost:5000
- **Frontend Dev:** http://localhost:5173
- **Prisma Studio:** `npm run prisma:studio`
- **Health Check:** http://localhost:5000/health
- **GitHub Repo:** (Connected to remote)

---

## 📅 Development Timeline

- **Week 1-2:** Backend Authentication + Accounts ✅
- **Week 3:** Transactions API + AI Integration ✅
- **Week 4:** Frontend Dashboard + Pages ✅
- **Week 5:** Budget API & Backend Verification ✅ (COMPLETED)
- **Week 6:** Frontend Integration (Dashboard & Budget UI) ⏳ (NEXT UP)
- **Week 7:** Bill Splitting UI
- **Week 8:** Analytics & Reports
- **Week 9:** Polish & Testing

---

## 💡 Project Highlights

1. **AI-Powered:** Automatic transaction categorization using Hugging Face
2. **Student-Focused:** Features designed for college life (semester budgets, roommate splits)
3. **Type-Safe:** Full TypeScript stack with Zod validation
4. **Modern Stack:** React 19, Vite 7, Prisma, Express
5. **Production-Ready:** Security, caching, rate limiting, error handling
6. **Beautiful UI:** Tailwind CSS with custom design system

---

**Current Progress:** ~80% MVP completion 🚀  
**Backend is 100% Verified (68 Tests Passed). Ready for Frontend Integration!**

---

© 2026 Amarnath Sharma. All rights reserved.

Licensed under the MIT License.
