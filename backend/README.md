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

The API will be running at `http://localhost:5000`

---

## 📁 Project Structure

```
src/
├── config/           # Configuration files
│   ├── database.ts   # Prisma client
│   └── env.ts        # Environment validation
├── controllers/      # Route controllers
│   ├── auth.controller.ts
│   ├── password-reset.controller.ts
│   ├── account.controller.ts
│   ├── transaction.controller.ts
│   ├── budget.controller.ts
│   └── group.controller.ts
├── middleware/       # Express middleware
│   ├── auth.middleware.ts
│   ├── validateOwnership.ts # IDOR protection
│   └── errorHandler.middleware.ts
├── routes/           # API routes
│   ├── auth.routes.ts
│   ├── account.routes.ts
│   ├── transaction.routes.ts
│   ├── budget.routes.ts
│   └── group.routes.ts
├── services/         # Business logic
│   ├── auth.service.ts
│   ├── password-reset.service.ts
│   ├── account.service.ts
│   ├── transaction.service.ts
│   ├── budget.service.ts
│   ├── ai-categorization.service.ts
│   ├── email.service.ts
│   └── group.service.ts
├── types/            # TypeScript types & Zod schemas
│   ├── auth.types.ts
│   ├── password-reset.types.ts
│   └── ... types for all models
├── app.ts            # Express app setup
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

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "student@university.edu",
      "name": "John Doe",
      "university": "State University",
      "baseCurrency": "USD"
    },
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci..."
  }
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

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGci..."
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

#### Update Profile
```http
PUT /api/auth/me
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "university": "New University"
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <access_token>
```

#### Password Reset Flow
*   `POST /api/auth/forgot-password` - Send reset token to email (Prevention against user enumeration)
*   `POST /api/auth/verify-reset-token` - Validate if a hashed token is still valid/not expired
*   `POST /api/auth/reset-password` - Finalize password change (Invalidates all active sessions)

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

### Bill Splitting (`/api/groups`)
*   `POST /api/groups` - Create a group for roommates/shared expenses
*   `POST /api/groups/:id/splits` - Create a new bill split among members

### Email Integration (`/api/auth`)
The system uses **Nodemailer** for email delivery.
*   **Development**: Configured with **Ethereal Email** (mock service).
*   **Verification**: All emails sent in dev can be viewed at [ethereal.email/messages](https://ethereal.email/messages).
*   **Production**: Set `NODE_ENV=production` or `ENABLE_EMAIL=true` and provide real SMTP credentials.

---

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

---

## 📝 Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm start            # Start production server
npm test             # Run tests
npm run lint         # Lint code
npm run format       # Format code with Prettier
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio (database GUI)
```

---

## 🛠 Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 15+
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Password Hashing**: bcryptjs
- **Security**: Helmet, CORS, Rate Limiting
- **Testing**: Jest, Supertest
- **Logging**: Morgan

---

## 🔒 Security Features

- ✅ JWT-based authentication with refresh tokens
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Rate limiting on API endpoints
- ✅ Helmet for security headers
- ✅ CORS configuration
- ✅ Input validation with Zod
- ✅ SQL injection protection (Prisma ORM)
- ✅ XSS protection
- ✅ Environment variable validation

---

## 🐛 Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `422` - Validation Error
- `500` - Internal Server Error

---

## 📚 Next Steps

1. **Budget Frontend UI** - Build progress bars and status indicators
2. **Bill Splitting UI** - Group management and debt settlement screens
3. **AI Insights UI** - Display spending patterns and saving tips
4. **Recurring Transactions** - Implementation of automated scheduled tracking
5. **PDF Reports** - Generation of monthly/semester spending summaries

---

## 🤝 Contributing

1. Create a feature branch
2. Write tests for new features
3. Ensure all tests pass
4. Submit a pull request

---

## 📄 License

MIT License - see LICENSE file for details

---

## 💬 Support

For issues or questions, please open a GitHub issue.

---

**Built with ❤️ for college students**
