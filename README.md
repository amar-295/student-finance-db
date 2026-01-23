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

### 🛡️ **Enterprise-Grade Architecture**
*   **Authentication**: Secure JWT layout with Access (15m) + Refresh Tokens (7d).
*   **Security**: Rate limiting, Helmet headers, SQL injection protection (Prisma), and encrypted passwords (Bcrypt).
*   **Performance**: Server-side caching (Redis), Database indexing, and Gzip compression.
*   **Resiliency**: Comprehensive error handling and **Prometheus** metrics for monitoring.

---

## 🛠 Tech Stack Details

We use a modern, type-safe stack optimized for performance and developer experience.

| Layer | Technology | Key Libraries/Tools |
| :--- | :--- | :--- |
| **Frontend** | React 19 (Vite 7) | `zustand` (State), `tanstack-query` (Fetching), `react-hook-form` (Forms), `sonner` (Toasts) |
| **Backend** | Node.js 20 + Express | `zod` (Validation), `pino` (Logging), `swagger-jsdoc` (Docs), `nodemailer` (Email) |
| **Database** | PostgreSQL 15 | `prisma` (ORM/Schema Management) |
| **Cache** | Redis 7 | `ioredis` (Client), `express-rate-limit` (Storage) |
| **Testing** | Vitest + Jest | `msw` (Network Mocks), `supertest` (API Testing), `react-testing-library` |
| **DevOps** | Docker, GitHub Actions | CI/CD Pipelines, Multi-stage builds |

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
    npm run prisma:seed     # (Optional) Add dummy data
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
| `JWT_SECRET` | Secret for Access Token | `super_secret_key_change_me` | **YES** |
| `JWT_REFRESH_SECRET` | Secret for Refresh Token | `another_super_secret_key` | **YES** |
| `JWT_EXPIRES_IN` | Access Token Lifetime | `15m` | No |
| `JWT_REFRESH_EXPIRES_IN` | Refresh Token Lifetime | `7d` | No |
| **Services** | | | |
| `HUGGING_FACE_API_KEY` | Hugging Face API Token | `hf_...` | No* |
| `FRONTEND_URL` | Allowed CORS Origin | `http://localhost:5173` | No |

*> Note: If `HUGGING_FACE_API_KEY` is missing, the backend defaults to basic regex categorization.*

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

## 🧪 Testing

We practice **Test-Driven Development (TDD)** where possible.

### Backend Tests (Jest)
Runs 68+ integration tests covering Auth, Transactions, and Budgets.
```bash
cd backend
npm test
```

### Frontend Tests (Vitest)
Runs unit tests for components and hooks using a simulated browser environment.
```bash
cd frontend
npm test
```

---

## 📂 Project Structure

```
student-finance-db/
├── .github/              # CI/CD Workflows
├── backend/              # Express API
│   ├── prisma/           # DB Schema & Seeds
│   ├── src/
│   │   ├── config/       # Env & Constants
│   │   ├── controllers/  # Route Handlers
│   │   ├── middleware/   # Auth, Validation, Error
│   │   ├── routes/       # API Route Definitions
│   │   ├── services/     # Business Logic (AI, Auth)
│   │   └── utils/        # Helpers
│   └── test/             # Integration Tests
│
├── frontend/             # React App
│   ├── src/
│   │   ├── components/   # Reusable UI (Buttons, Inputs)
│   │   ├── features/     # Domain Logic (Auth, Budget)
│   │   ├── hooks/        # Custom React Hooks
│   │   ├── lib/          # Utils (Axios, ClassNames)
│   │   └── pages/        # Page Views
│   └── test/             # Setup & Mocks
│
└── docker-compose.yml    # Infrastructure
```

---

## 👥 Authors

*   **Amarnath Sharma** - *Lead Developer*

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
