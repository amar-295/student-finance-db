# 🚀 Backend Quick Start Guide

## What You Have

A **production-ready Express + TypeScript + Prisma backend** with:

✅ **Authentication System** (JWT-based register/login)  
✅ **User Profile Management**  
✅ **Database Schema** (Prisma + PostgreSQL)  
✅ **Error Handling** (Comprehensive error middleware)  
✅ **Security** (Helmet, CORS, Rate Limiting)  
✅ **Validation** (Zod schemas)  
✅ **Testing Setup** (Jest configured)  

---

## 🏃 Run It Locally (Step-by-Step)

### Step 1: Install PostgreSQL

**On Mac** (using Homebrew):
```bash
brew install postgresql@15
brew services start postgresql@15
```

**On Windows**:
- Download from: https://www.postgresql.org/download/windows/
- Run installer and follow wizard

**On Linux**:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Step 2: Create Database

```bash
# Access PostgreSQL
psql postgres

# Inside psql:
CREATE DATABASE student_finance_db;
CREATE USER your_username WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE student_finance_db TO your_username;
\q
```

### Step 3: Set Up Backend

```bash
# Navigate to backend folder
cd student-finance-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

### Step 4: Configure .env

Edit `.env`:
```env
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/student_finance_db"
JWT_SECRET="change-this-to-a-long-random-string-minimum-32-characters"
JWT_REFRESH_SECRET="another-long-random-string-for-refresh-tokens-minimum-32"
FRONTEND_URL=http://localhost:3000
```

**Generate secure secrets:**
```bash
# On Mac/Linux:
openssl rand -base64 32

# Or use Node.js:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Step 5: Set Up Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations (creates tables)
npm run prisma:migrate

# Seed with demo data (optional)
npm run prisma:seed
```

### Step 6: Start Server

```bash
npm run dev
```

You should see:
```
╔════════════════════════════════════════════════════════════╗
║   🎓 Student Finance Dashboard API                        ║
║   Environment: development                                 ║
║   Port: 5000                                               ║
║   URL: http://localhost:5000                               ║
╚════════════════════════════════════════════════════════════╝
```

---

## 🧪 Test the API

### Using cURL

**Register a new user:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "name": "Test User",
    "university": "Test University"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

Save the `accessToken` from the response!

**Get your profile:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Using Postman/Insomnia

1. Import the API endpoints from `README.md`
2. Test each endpoint manually
3. See responses in real-time

---

## 🛠 Development Workflow

### View Database (Prisma Studio)

```bash
npm run prisma:studio
```

Opens http://localhost:5555 with a GUI to view/edit database.

### Watch Mode

```bash
npm run dev
```

Server auto-restarts when you change code.

### Run Tests

```bash
npm test
```

---

## ✅ What's Working

1. ✅ **POST /api/auth/register** - Create new user
2. ✅ **POST /api/auth/login** - Login and get tokens
3. ✅ **POST /api/auth/refresh** - Refresh access token
4. ✅ **GET /api/auth/me** - Get current user (protected)
5. ✅ **PUT /api/auth/me** - Update profile (protected)
6. ✅ **POST /api/auth/logout** - Logout
7. ✅ **GET /health** - Health check

---

## 🎯 Next Steps

### Week 1-2: Transaction Features

1. **Create Transaction Routes**
   ```
   POST   /api/transactions      - Add transaction
   GET    /api/transactions      - List transactions (with filters)
   GET    /api/transactions/:id  - Get single transaction
   PUT    /api/transactions/:id  - Update transaction
   DELETE /api/transactions/:id  - Delete transaction
   ```

2. **Add AI Categorization**
   - Integrate OpenAI API
   - Auto-categorize transactions
   - Cache common merchants

### Week 3-4: Budget Features

1. **Create Budget Routes**
   ```
   POST   /api/budgets      - Create budget
   GET    /api/budgets      - List budgets
   PUT    /api/budgets/:id  - Update budget
   DELETE /api/budgets/:id  - Delete budget
   ```

2. **Add Budget Alerts**
   - Check spending vs budget
   - Send notifications when over threshold

### Week 5-6: Bill Splitting

1. **Create Group & Split Routes**
   ```
   POST   /api/groups          - Create group
   POST   /api/groups/:id/members  - Add member
   POST   /api/splits          - Create split
   PUT    /api/splits/:id/pay  - Mark as paid
   ```

---

## 🐛 Troubleshooting

**Database connection error:**
- Check PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL in `.env`
- Check username/password

**Port already in use:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill it
kill -9 <PID>
```

**Prisma errors:**
```bash
# Reset database (WARNING: Deletes all data)
npm run prisma:migrate -- reset

# Regenerate client
npm run prisma:generate
```

---

## 📚 Resources

- **Prisma Docs**: https://www.prisma.io/docs
- **Express Docs**: https://expressjs.com
- **Zod Validation**: https://zod.dev
- **JWT Guide**: https://jwt.io/introduction

---

## 🎉 Success!

If you can register a user and get their profile, your backend is working! 🚀

**Demo credentials** (if you ran seed):
- Email: `alex@demo.com`
- Password: `DemoPassword123`

---

**Need help?** Check the main `README.md` for detailed API documentation.
