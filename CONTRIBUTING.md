# Contributing to UniFlow Finance

First off, thanks for taking the time to contribute! 🎉

UniFlow is an open-source project dedicated to making student finance management easier. We welcome contributions from everyone.

## 🛠 Tech Stack

-   **Backend**: Node.js, Express, TypeScript, Prisma, PostgreSQL, Redis, Hugging Face AI.
-   **Frontend**: React 19, Vite 7, Tailwind CSS, TypeScript.

## 🚀 Getting Started

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally:
    ```bash
    git clone https://github.com/your-username/student-finance-db.git
    cd student-finance-db
    ```
3.  **Install Dependencies**:
    ```bash
    npm install --prefix backend
    npm install --prefix frontend
    ```
4.  **Create a Branch**:
    ```bash
    git checkout -b feat/my-new-feature
    ```
    *Naming Convention*: `feat/`, `fix/`, `docs/`, `chore/`.

## 🧑‍💻 Development Workflow

### Backend
1.  Ensure Docker is running (`docker-compose up -d`).
2.  Seed the database: `npx tsx prisma/seed.ts` (inside `backend/`).
3.  Start server: `npm run dev`.

### Frontend
1.  Start Vite server: `npm run dev` (inside `frontend/`).
2.  Login with `alex@demo.com` / `DemoPassword123`.

## 📮 Pull Requests

1.  Push to your fork: `git push origin feat/my-new-feature`.
2.  Open a Pull Request against the `main` branch.
3.  Please describe your changes clearly.
4.  Ensure all tests pass (CI will check this).

## 📝 Commit Messages

We follow **Conventional Commits**:

-   `feat: add new budget alert`
-   `fix: resolve crash on login`
-   `docs: update readme`
-   `style: format code`

## 🤝 Code of Conduct

Please note that we have a Code of Conduct. Please be respectful and inclusive.
