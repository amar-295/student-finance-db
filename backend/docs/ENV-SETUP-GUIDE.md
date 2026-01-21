# 🔧 Environment Setup Guide

## ✅ Your `.env` file is ready!

I've created a `.env` file with **secure, auto-generated JWT secrets**.

---

## ⚠️ What You MUST Change

### 1. Database URL

**Current:**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/student_finance_db?schema=public"
```

**Change to your PostgreSQL credentials:**

#### If you're using default PostgreSQL setup:
```env
DATABASE_URL="postgresql://postgres:your_postgres_password@localhost:5432/student_finance_db?schema=public"
```

#### If you created a custom user:
```env
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/student_finance_db?schema=public"
```

**Example:**
```env
DATABASE_URL="postgresql://john:mypassword123@localhost:5432/student_finance_db?schema=public"
```

---

## ✅ What's Already Configured (No Changes Needed)

### 1. JWT Secrets (Auto-Generated - Secure!)
```env
JWT_SECRET=P6OAceBYXPCvHvQFp0Kax3+84oNlBATIy+9hNEdLFn4=
JWT_REFRESH_SECRET=aDwUh0HPFOnh3RYqJS7Y9xQTb8+SiRLvp43MH4bBaDs=
```
✅ These are cryptographically secure random values  
✅ Safe for development  
⚠️ **Change these before production deployment!**

### 2. Server Settings
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
```
✅ Perfect for local development

### 3. Rate Limiting
```env
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100  # 100 requests per 15 min
```
✅ Reasonable defaults

---

## 🗄️ How to Find Your PostgreSQL Credentials

### Method 1: Check Your PostgreSQL Installation

**On Mac (Homebrew):**
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Default user is usually your Mac username
# Default password might be empty or 'postgres'
whoami  # This shows your username
```

**On Windows:**
- Username: Usually `postgres`
- Password: What you set during installation
- If you forgot, you may need to reset it

**On Linux:**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Default user is usually 'postgres'
sudo -u postgres psql
```

### Method 2: Create a New Database User

```bash
# Access PostgreSQL as superuser
psql postgres

# Inside psql, create a user:
CREATE USER myuser WITH PASSWORD 'mypassword';
GRANT ALL PRIVILEGES ON DATABASE student_finance_db TO myuser;
\q
```

Then use:
```env
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/student_finance_db?schema=public"
```

---

## 🧪 Test Your Database Connection

### Step 1: Create the Database

```bash
# Using default postgres user
createdb student_finance_db

# OR if you need to specify user
createdb -U your_username student_finance_db
```

### Step 2: Test Connection

```bash
# Navigate to backend
cd student-finance-backend

# Try to connect with Prisma
npm run prisma:generate
```

If it works, you'll see:
```
✔ Generated Prisma Client
```

If you get an error like:
```
Error: P1001: Can't reach database server
```

Your DATABASE_URL is wrong. Check:
- Is PostgreSQL running?
- Are username/password correct?
- Does the database exist?

---

## 📝 Complete Setup Checklist

- [ ] **PostgreSQL installed and running**
  ```bash
  # Check if running
  pg_isready
  ```

- [ ] **Database created**
  ```bash
  createdb student_finance_db
  ```

- [ ] **`.env` file updated with correct DATABASE_URL**
  ```env
  DATABASE_URL="postgresql://YOUR_USER:YOUR_PASS@localhost:5432/student_finance_db?schema=public"
  ```

- [ ] **Dependencies installed**
  ```bash
  npm install
  ```

- [ ] **Prisma client generated**
  ```bash
  npm run prisma:generate
  ```

- [ ] **Database migrated**
  ```bash
  npm run prisma:migrate
  ```

- [ ] **Server starts without errors**
  ```bash
  npm run dev
  ```

---

## 🔒 Security Notes

### For Development (Current Setup) ✅
- Auto-generated JWT secrets are **secure enough**
- Database on localhost is **safe**
- CORS allows localhost:3000 (your frontend)

### For Production ⚠️
**Before deploying, change these:**

1. **JWT Secrets** - Generate new ones:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

2. **DATABASE_URL** - Use production database (Railway, Render, etc.)

3. **NODE_ENV** - Set to `production`

4. **FRONTEND_URL** - Your actual frontend domain

5. **Add to `.gitignore`** - NEVER commit `.env` to git!
   ✅ Already in `.gitignore`

---

## 🆘 Common Issues & Fixes

### Issue: "P1001: Can't reach database server"
**Fix:**
```bash
# Check PostgreSQL is running
brew services list  # Mac
sudo systemctl status postgresql  # Linux

# Start it if stopped
brew services start postgresql@15  # Mac
sudo systemctl start postgresql  # Linux
```

### Issue: "password authentication failed"
**Fix:**
- Double-check username/password in DATABASE_URL
- Try connecting manually: `psql -U your_user student_finance_db`

### Issue: "database does not exist"
**Fix:**
```bash
createdb student_finance_db
```

### Issue: "Port 5000 already in use"
**Fix:**
```bash
# Find what's using it
lsof -i :5000

# Kill it
kill -9 <PID>

# OR change PORT in .env to 5001
```

---

## ✅ Final Check

Run this to verify everything works:

```bash
cd student-finance-backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

You should see:
```
╔════════════════════════════════════════════════════════════╗
║   🎓 Student Finance Dashboard API                        ║
║   Environment: development                                 ║
║   Port: 5000                                               ║
╚════════════════════════════════════════════════════════════╝
✅ Database connected successfully
```

If you see that, **you're ready to code!** 🚀

---

## 🎯 Next Steps

Once the server is running:

1. **Test the API:**
   ```bash
   curl http://localhost:5000/health
   ```

2. **Try registering a user:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"Test123","name":"Test User"}'
   ```

3. **Come back here and say:**
   - *"Backend is running! Let's add transactions"*
   - *"Show me how to test with Postman"*
   - *"Let's build the frontend"*

---

**Need help with PostgreSQL setup?** Let me know your OS and I'll give specific instructions!
