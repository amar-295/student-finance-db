# 🎓 UniFlow - Intelligent Student Finance Dashboard

![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Node](https://img.shields.io/badge/Node-20-339933?logo=node.js&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-Caching-DC382D?logo=redis&logoColor=white)
![AI](https://img.shields.io/badge/AI-Hugging%20Face-FFD21E?logo=huggingface&logoColor=black)

**UniFlow** is a next-generation personal finance platform designed specifically for the unique needs of university students. It combines **bank-grade security** with **cutting-edge AI** to automate transaction tracking, budgeting, and bill splitting.

> **Status**: 🚀 **MVP 85% Complete** (Active Development)

---

## ✨ Features at a Glance

### 🧠 **AI-Powered Intelligence**
*   **Zero-Shot Categorization**: Uses `facebook/bart-large-mnli` (via Hugging Face) to automatically categorize confusing transaction descriptions (e.g., "MCDONALDS WEB PYMT" → "Food & Dining") with >90% accuracy.
*   **Smart Fallbacks**: If the AI service is unreachable, a robust Regex engine takes over seamlessly.
*   **Optimization**: AI results are cached in **Redis** (24h TTL) to reduce API costs and latency.

### 💸 **Financial Management**
*   **Multi-Account Support**: Track Checking, Savings, and Cash accounts in one view.
*   **Real-Time Budgeting**: Set monthly limits per category with visual health indicators (Safe/Warning/Exceeded).
*   **Transaction Search**: Instant search and advanced filtering by date, amount, or merchant.
*   **Bill Splitting (Coming Soon)**: Split shared expenses (rent, utilities) with roommates automatically.

### 🎨 **Modern User Experience**
*   **Data Visualization**: Interactive, animated charts powered by **Recharts**.
*   **Responsive Design**: Mobile-first UI built with **Tailwind CSS 3.4**.
*   **Smooth Interactions**: buttery smooth 60fps animations using **Framer Motion**.
*   **Accessible**: Built with **Headless UI** for screen reader support.

### 🛡️ **Enterprise-Grade Security (Hardened)**
*   **Authentication**: 256-bit JWTs with Access (15m) + Refresh Tokens (7d) and strict issuer validation.
*   **Protection**: 
    *   **Rate Limiting**: Redis-backed limits (100 req/15m) guarding against DDoS/Brute Force.
    *   **Data Integrity**: Strong input validation (Zod) and SQL injection protection (Prisma).
    *   **Infrastructure**: HTTPS enforcement, HSTS headers (Helmet), and request timeouts.
*   **Resiliency**: Automated database backups and graceful degradation.

### ⚡ **Resilient Frontend**
*   **Reliability**: Automatic request retries (exponential backoff) and deduplication (2-minute cache).
*   **Stability**: Global Error Boundaries prevent white-screen crashes.
*   **Performance**: Route-based Code Splitting (Lazy Loading) for fast initial paint.

---

## 🛠 Tech Stack Details

We use a modern, type-safe stack optimized for performance and developer experience.

| Layer | Technology | Key Libraries/Tools |
| :--- | :--- | :--- |
| **Frontend** | React 19 (Vite 7) | `zustand` (State), `tanstack-query` (Caching), `react-hook-form` (Forms), `sonner` (Toasts) |
| **Backend** | Node.js 20 + Express | `zod` (Validation), `pino` (Logging), `helmet` (Security), `connect-timeout` (Resilience) |
| **Database** | PostgreSQL 15 | `prisma` (ORM), `redis` (Caching & Rate Limiting) |
| **DevOps** | Docker, GitHub Actions | CI/CD Pipelines, Husky (Pre-commit hooks), Dependabot |
| **Testing** | Vitest + Jest | `msw` (Network Mocks), `supertest` (API Testing) |

---

## 🚀 Getting Started

### Prerequisites
*   **Node.js**: v20 or higher
*   **Docker** (Recommended for DB/Redis) OR local PostgreSQL/Redis instances.

### Option 1: The Quick Way (Docker) 🐳
The easiest way to start the infrastructure.

1.  **Clone the repo**
    ```bash
    git clone https://github.com/amar-295/student-finance-db.git
    cd student-finance-db
    ```

2.  **Start Database & Redis**
    ```bash
    docker-compose up -d
    ```

3.  **Install & Run Backend**
    ```bash
    cd backend
    npm install
    # Setup .env (see below) or use default
    cp .env.example .env
    npm run prisma:migrate  # Create DB tables
    npm run prisma:seed     # 🌱 Populate test data (User: test@example.com / Password123!)
    npm run dev
    ```

4.  **Install & Run Frontend**
    ```bash
    cd ../frontend
    npm install
    npm run dev
    ```

5.  **Visit App**: `http://localhost:5173`

---

## 🔧 Environment Variables

### Backend (`/backend/.env`)

| Variable | Description | Default / Example | Required? |
| :--- | :--- | :--- | :--- |
| **Core** | | | |
| `PORT` | API Port | `5000` | No |
| `NODE_ENV` | Environment | `development` | No |
| **Database** | | | |
| `DATABASE_URL` | Postgres Connection String | `postgresql://user:pass@localhost:5432/db` | **YES** |
| `REDIS_URL` | Redis Connection String | `redis://localhost:6379` | No |
| **Security** | | | |
| `JWT_SECRET` | Secret for Access Token | `Use 256-bit generated secret` | **YES** |
| `JWT_REFRESH_SECRET` | Secret for Refresh Token | `Use 256-bit generated secret` | **YES** |
| `JWT_EXPIRES_IN` | Access Token Lifetime | `15m` | No |
| `JWT_REFRESH_EXPIRES_IN` | Refresh Token Lifetime | `7d` | No |

### Security Note
For production, always use `npm run generate-secrets` in the backend folder to create secure keys.

---

### Frontend (`/frontend/.env`)

| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |

---

## 📖 API Documentation

When the backend server is running, you can access the full interactive Swagger/OpenAPI documentation at:

👉 **http://localhost:5000/api-docs**

This includes:
-   Request/Response schemas (JSON models)
-   Auth headers testing
-   Live endpoint testing

---

## 📂 Project Structure

A high-level overview of the monolithic repository:

```
student-finance-db/
├── .github/              # ⚙️ CI/CD Workflows (GitHub Actions)
│
├── backend/              # 🔋 Node.js + Express API
│   ├── prisma/           # 💾 DB Schema & Seeds
│   ├── src/
│   │   ├── controllers/  # Route Handlers
│   │   ├── services/     # Business Logic (AI, Auth)
│   │   └── utils/        # Helpers
│   └── test/             # Integration Tests
│
├── frontend/             # 🎨 React + Vite SPA
│   ├── src/
│   │   ├── components/   # Reusable UI (Buttons, Inputs)
│   │   ├── features/     # Logic Modules (Auth, Budget)
│   │   └── services/     # API Clients
│   └── test/             # Setup & Mocks
│
└── docker-compose.yml    # 🐳 Infrastructure (Postgres + Redis)
```

---

## 👥 Authors

*   **Amarnath Sharma** - *Lead Developer*

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
