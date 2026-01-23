# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-01-23

### Performance
-   **AI Insights**: Implemented Redis caching for AI insights to reduce latency (#14).
-   **Budgets**: Fixed N+1 query issues in budget status retrieval (#11) and optimized recommendations aggregation (#9).
-   **Transactions**: Added debouncing to transaction search for smoother UX (#7).
-   **Bill Split**: Optimized participant payment checks (#6).
-   **Server**: Enabled Gzip/Brotli compression for faster response times (#2).

### Features
-   **Analytics**: Integrated Vercel Web Analytics (#5).
-   **UX**: Enhanced Transaction Form with loading states and accessible labels (#13).

### Fixed
-   **Backend**: Resolved startup DB connection issue and root 404 error (#15).

## [0.1.0] - 2026-01-21

### Added
-   **Auth**: Full JWT authentication system (Login, Register, Password Reset).
-   **Transactions**: Transaction CRUD with AI-powered categorization via Hugging Face.
-   **Budget**: Backend engine for budget tracking and alerts.
-   **Frontend**: React + Vite dashboard with real-time charts.
-   **Infrastructure**: Docker Compose setup for PostgreSQL and Redis.
-   **CI/CD**: GitHub Actions pipeline for automated testing.
