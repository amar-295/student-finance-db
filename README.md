# 🎓 UniFlow

> **Smart Finance for Students.**  
> Budget, Split Bills, and Track Expenses with AI-Powered Precision.


[![CI](https://github.com/amar-295/student-finance-db/actions/workflows/ci.yml/badge.svg)](https://github.com/amar-295/student-finance-db/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

---

## ⚡ Quick Pitch

UniFlow is the modern financial OS for university students.

Managing money in college is messy—random Venmo requests, forgotten subscriptions, and "guesstimated" budgets. **UniFlow fixes this.** It’s a full-stack platform that combines **AI-driven transaction categorization**, **real-time budget tracking**, and **automatic bill splitting** into one beautiful, tear-free interface.

Built with **Production-Grade TypeScript**, it leverages **Hugging Face AI** to understand your spending and **Redis** to keep it lightning fast.

---

## 🚀 Key Features

-   🤖 **AI-Powered Categorization**: Zero-shot classification automatically sorts messy bank descriptions (e.g., "STARBUCKS STORE #123") into clear categories like "Food" or "Coffee" using Hugging Face.
-   📊 **Smart Budgeting**: Set monthly limits and get predictive alerts before you overspend.
-   💸 **Seamless Bill Splitting**: Create groups with roommates, split essential bills (Rent, Utilities), and track who owes what instantly.
-   🛡️ **Enterprise-Level Security**: JWT authentication, bcrypt hashing, rate limiting, and full audit logging.
-   ⚡ **High Performance**: Redis caching for AI predictions and user-based rate limiting to prevent abuse.

---

## 🛠 Tech Stack

Designed for scalability and developer experience.

| Layer | Technology | Why we chose it |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite 7 | Blazing fast SPA with the latest React hooks. |
| **Styling** | Tailwind CSS 3 | Modern, utility-first design system. |
| **Backend** | Express + Node.js | Robust REST API architecture. |
| **Database** | PostgreSQL + Prisma | Type-safe ORM with powerful schema management. |
| **AI / ML** | Hugging Face API | Serverless NLP for zero-shot text classification. |
| **Caching** | Redis (ioredis) | High-speed cache for API responses and rate limits. |
| **DevOps** | Docker & CI/CD | Containerized local dev and automated testing pipelines. |

---

## 🏗 High-Level Architecture

UniFlow uses a decoupled client-server architecture to ensure flexibility and scale.

```mermaid
graph TD
    User([User]) -->|HTTPS| Frontend[React Client]
    Frontend -->|REST API| API[Express Backend]
    
    subgraph "Backend Services"
        API --> Auth[Auth Service]
        API --> Budget[Budget Engine]
        API --> AI[AI Service]
    end
    
    AI -->|HTTP| HF[Hugging Face API]
    AI -->|Read/Write| Redis[(Redis Cache)]
    
    API -->|Query| DB[(PostgreSQL)]
    API -->|Log| Audit[Audit Logger]
```

---

## 🚦 Project Status

**Current Stage:** `Beta Release Candidate`

-   ✅ **Backend**: 100% complete & verified (68+ Integration Tests passed).
-   ✅ **Frontend**: Core flows (Auth, Dashboard, Accounts, Transactions) are live.
-   🟡 **In Progress**: Budget UI Visualizations & Bill Splitting Group Views.
-   🟢 **Infrastructure**: Docker & CI/CD pipelines are fully operational.

---

## 🏃‍♂️ How to Run Locally

Get up and running in under 5 minutes.

### Prerequisites
-   Node.js v20+
-   PostgreSQL & Redis (or just Docker)

### 1. Clone & Install
```bash
git clone https://github.com/amar-295/student-finance-db.git
cd student-finance-db

# Install dependencies for both frontend and backend
npm install --prefix backend
npm install --prefix frontend
```

### 2. Configure Environment
Create `.env` files in both `backend/` and `frontend/`. 
*(See `.env.example` in respective folders for details)*.

**Quick Backend Config:**
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/uniflow"
REDIS_URL="redis://localhost:6379"
HUGGING_FACE_API_KEY="your_key_here" # Optional (falls back to rules)
```

### 3. Spin Up Infrastructure
```bash
# Start Postgres & Redis via Docker
docker-compose up -d db redis
```

### 4. Seed & Start
```bash
# Backend (Terminal 1)
cd backend
npx prisma migrate dev
npx tsx prisma/seed.ts # Seeds demo user: alex@demo.com / DemoPassword123
npm run dev

# Frontend (Terminal 2)
cd frontend
npm run dev
```

Visit **http://localhost:5173** and login with `alex@demo.com`.

---

## 🔮 Roadmap

-   [ ] **Q2 2026**: Mobile App (React Native)
-   [ ] **Q2 2026**: Bank Plaid Integration for auto-sync
-   [ ] **Q3 2026**: "UniFlow Social" - Share savings goals with friends

---

<p align="center">
  Built with ❤️ by Amarnath Sharma
</p>
