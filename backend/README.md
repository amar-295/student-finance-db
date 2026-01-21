# Student Finance Dashboard - Backend API

AI-powered personal finance management for college students. Combines budgeting, bill splitting, and smart insights in one platform.

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ installed
- PostgreSQL 15+ installed and running
- npm or yarn package manager

### Installation

1. **Clone and navigate to backend:**
```bash
cd student-finance-backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

Then edit `.env` with your actual values:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/student_finance_db"
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters-long"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-minimum-32-characters-long"

# Email Configuration (Ethereal for Dev)
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your-ethereal-user
SMTP_PASSWORD=your-ethereal-pass
EMAIL_FROM="Student Finance" <noreply@studentfinance.com>
ENABLE_EMAIL=true
```

4. **Set up database:**
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Seed with sample data
npm run prisma:seed
```

5. **Start development server:**
```bash
npm run dev
```

6. **Run with Docker (Recommended):**
```bash
docker-compose up -d
```
The API will be running at `http://localhost:5000` with PostgreSQL and Redis automatically configured.

---

## 📁 Project Structure

```
src/
├── config/           # Configuration files
├── controllers/      # Route controllers
│   ├── auth.controller.ts
│   ├── password-reset.controller.ts
│   ├── account.controller.ts
│   ├── transaction.controller.ts
│   ├── budget.controller.ts
│   └── group.controller.ts
├── middleware/       # Express middleware
│   ├── auth.middleware.ts
│   ├── audit.middleware.ts  # Automatic request logging ✨ NEW
│   ├── validateOwnership.ts # IDOR protection
│   └── errorHandler.middleware.ts
├── routes/           # API routes
├── services/         # Business logic
│   ├── auth.service.ts
│   ├── audit.service.ts      # Action logging ✨ NEW
│   ├── password-reset.service.ts
│   ├── account.service.ts
│   ├── transaction.service.ts
│   ├── budget.service.ts
│   ├── ai-categorization.service.ts
│   ├── email.service.ts
│   └── group.service.ts
├── types/            # TypeScript types & Zod schemas
├── app.ts            # Express app (User-based rate limiting)
└── server.ts         # Server entry point
```

---

## 🔐 API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "student@university.edu",
  "password": "SecurePass123",
  "name": "John Doe",
  "university": "State University",
  "baseCurrency": "USD"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@university.edu",
  "password": "SecurePass123"
}
```

#### Password Reset Flow
*   `POST /api/auth/forgot-password` - Send reset token to email
*   `POST /api/auth/verify-reset-token` - Validate if a hashed token is valid
*   `POST /api/auth/reset-password` - Finalize password change

### Accounts (`/api/accounts`)
*   `GET /api/accounts/summary` - Net balance across all accounts
*   `GET /api/accounts` - List all accounts
*   `POST /api/accounts` - Create checking/savings/cash account

### Transactions (`/api/transactions`) 🤖 **AI POWERED**
*   `POST /api/transactions` - Creates transaction with automatic AI categorization
*   `GET /api/transactions` - Search and filter spending history

### Budgets (`/api/budgets`)
*   `GET /api/budgets/status` - Real-time budget health (safe/warning/danger)
*   `GET /api/budgets/recommend` - AI-generated recommended spending limits

### Audit Logging (`AuditService`) ✨ **NEW**
The application tracks all critical actions in the `AuditLog` table.
*   **Tracked Actions**: Login, Logout, Profile Update, Account Create/Delete, Transaction Create/Delete.
*   **Data Captured**: User ID, Action, IP Address, User Agent, Metadata.
*   **Implementation**: `auditMiddleware` for requests + Controller logging for events.

### Docker & Infrastructure ✨ **NEW**
The backend is containerized for consistent deployment.
*   **Dockerfile**: Multi-stage build for small, secure production images.
*   **Docker Compose**: Orchestrates `backend`, `postgres`, and `redis`.
*   **Commands**:
    *   `docker-compose up -d`: Start all services (detached)
    *   `docker-compose down`: Stop all services

### CI/CD Pipeline ✨ **NEW**
Automated workflows via **GitHub Actions** (`.github/workflows/ci.yml`).
*   **Checks**: Linting, Type-checking, and Integration Testing on every PR.

---

## 🧪 Testing

Run the test suite:
```bash
npm test
```

---

## 🛠 Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 15+
- **ORM**: Prisma
- **Auth**: JWT (AccessToken + RefreshToken)
- **Containerization**: Docker, Docker Compose ✨ NEW
- **CI/CD**: GitHub Actions ✨ NEW
- **Logging**: Morgan, Audit Logger ✨ NEW

---

## 🔒 Security Features

- ✅ User-Based Rate Limiting ✨ UPGRADED
- ✅ Database Audit Logging ✨ NEW
- ✅ JWT-based authentication with refresh tokens
- ✅ Password hashing with bcrypt
- ✅ IDOR Protection (Resource Ownership Validation)
- ✅ Input validation with Zod
- ✅ SQL injection protection (Prisma)

---

## 🤝 Contributing

1. Create a feature branch
2. Ensure all tests pass (`npm test`)
3. Submit a pull request (verified by CI/CD)

---

**Built with ❤️ for college students**
