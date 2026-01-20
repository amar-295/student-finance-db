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
│   └── auth.controller.ts
├── middleware/       # Express middleware
│   ├── auth.ts       # Authentication middleware
│   └── errorHandler.ts
├── routes/           # API routes
│   └── auth.routes.ts
├── services/         # Business logic
│   └── auth.service.ts
├── types/            # TypeScript types
│   └── auth.types.ts
├── utils/            # Utility functions
│   ├── errors.ts     # Custom error classes
│   ├── jwt.ts        # JWT utilities
│   └── password.ts   # Password hashing
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

1. **Add Transactions API** - CRUD for financial transactions
2. **Implement AI Categorization** - Auto-categorize transactions
3. **Budget Management** - Create and track budgets
4. **Bill Splitting** - Roommate expense sharing
5. **AI Insights** - Generate spending insights

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
