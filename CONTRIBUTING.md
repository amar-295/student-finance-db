# Contributing to UniFlow

First off, thank you for considering contributing to UniFlow! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)

---

## 📜 Code of Conduct

This project follows a simple code of conduct:

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what's best for the community
- Show empathy towards other contributors

---

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, Node version, etc.)

**Use this template:**

```markdown
**Description:**
A clear description of the bug.

**To Reproduce:**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior:**
What should happen.

**Screenshots:**
If applicable.

**Environment:**
- OS: [e.g., macOS 13.0]
- Node: [e.g., 20.10.0]
- Browser: [e.g., Chrome 120]
```

### Suggesting Features

Feature requests are welcome! Please include:

- **Use case** - Why is this needed?
- **Proposed solution** - How should it work?
- **Alternatives** - What other options did you consider?
- **Impact** - Who benefits from this?

### Contributing Code

We love pull requests! Here's what we're currently looking for:

**High Priority:**
- Budget UI implementation
- AI Insights display
- Bill splitting frontend
- Analytics dashboard

**Medium Priority:**
- Additional tests
- Performance improvements
- Documentation improvements
- Bug fixes

**Low Priority:**
- Code refactoring
- UI polish
- Additional features

---

## 🛠️ Development Setup

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- Git

### Local Setup

```bash
# 1. Fork and clone
git clone https://github.com/amar-295/student-finance-db.git
cd student-finance-db

# 2. Install backend dependencies
cd backend
npm install

# 3. Set up environment
cp .env.example .env
# Edit .env with your local credentials

# 4. Set up database
createdb uniflow_db
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# 5. Start backend
npm run dev  # http://localhost:5000

# 6. In new terminal, set up frontend
cd ../frontend
npm install
npm run dev  # http://localhost:5173
```

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Watch mode (recommended during development)
npm run test:watch

# Coverage report
npm run test:coverage
```

### Database Migrations

```bash
# Create new migration
npx prisma migrate dev --name your_migration_name

# Reset database (DEV ONLY - loses data)
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio
```

---

## 🔄 Pull Request Process

### Before Submitting

1. **Create a branch** from `main`
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Write tests** for new features
   - Backend: Integration tests in `backend/src/tests/`
   - Minimum 80% coverage for new code

3. **Run tests** locally
   ```bash
   npm test
   ```

4. **Lint your code**
   ```bash
   npm run lint
   npm run format
   ```

5. **Update documentation** if needed
   - README.md
   - API documentation
   - Code comments

### Submitting

1. **Commit with clear messages**
   ```bash
   git commit -m "feat: add budget progress bars"
   # or
   git commit -m "fix: resolve transaction date bug"
   ```

   **Commit Convention:**
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Formatting, missing semicolons, etc.
   - `refactor:` - Code restructuring
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks

2. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Open Pull Request** on GitHub

4. **Fill out PR template** completely

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings

## Screenshots (if applicable)
```

### Review Process

1. **Automated checks** must pass (tests, linting)
2. **Code review** by maintainer
3. **Requested changes** addressed
4. **Approval** and merge

---

## 📏 Coding Standards

### TypeScript

```typescript
// ✅ Good
export const createBudget = async (
  userId: string,
  input: CreateBudgetInput
): Promise<Budget> => {
  // Implementation
};

// ❌ Avoid
export const createBudget = async (userId, input) => {
  // Missing types
};
```

### Naming Conventions

```typescript
// Variables & Functions: camelCase
const userName = "John";
const fetchUserData = () => {};

// Classes & Types: PascalCase
class UserService {}
type UserProfile = {};

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = "http://...";

// Files: kebab-case
// user-service.ts, budget-controller.ts
```

### Code Style

```typescript
// ✅ Use async/await
const data = await fetchData();

// ❌ Avoid callbacks
fetchData((err, data) => {});

// ✅ Use arrow functions
const add = (a: number, b: number) => a + b;

// ✅ Destructure when possible
const { name, email } = user;

// ✅ Use optional chaining
const city = user?.address?.city;
```

### File Organization

```typescript
// 1. Imports (grouped)
import { Request, Response } from 'express';
import { createBudget } from '../services/budget.service';
import { CreateBudgetInput } from '../types/budget.types';

// 2. Types/Interfaces
interface BudgetControllerOptions {
  // ...
}

// 3. Constants
const DEFAULT_LIMIT = 20;

// 4. Main functions
export const create = async (req: Request, res: Response) => {
  // Implementation
};

// 5. Helper functions (if any)
const calculatePercentage = (spent: number, limit: number) => {
  return (spent / limit) * 100;
};
```

---

## 🧪 Testing Guidelines

### Backend Tests

```typescript
// backend/src/tests/integration/budgets.test.ts

describe('Budget API', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    // Setup: login and get token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'Test123' });
    
    authToken = loginRes.body.data.accessToken;
    userId = loginRes.body.data.user.id;
  });

  describe('POST /api/budgets', () => {
    it('should create budget with valid data', async () => {
      const res = await request(app)
        .post('/api/budgets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          categoryId: 'valid-uuid',
          amount: 500,
          period: 'monthly',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
    });

    it('should reject invalid amount', async () => {
      const res = await request(app)
        .post('/api/budgets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          categoryId: 'valid-uuid',
          amount: -100,
          period: 'monthly',
        });

      expect(res.status).toBe(400);
    });
  });
});
```

### Test Coverage Requirements

- **New Features:** Minimum 80% coverage
- **Bug Fixes:** Add test that reproduces the bug
- **Refactoring:** Maintain existing coverage

### What to Test

✅ **Do Test:**
- API endpoints (integration tests)
- Service functions (unit tests)
- Edge cases
- Error handling
- Validation logic

❌ **Don't Test:**
- Third-party libraries
- Prisma generated code
- Simple getters/setters

---

## 🎨 Frontend Guidelines

### React Components

```tsx
// ✅ Good: Functional component with TypeScript
import React from 'react';

interface BudgetCardProps {
  budget: Budget;
  onEdit: (id: string) => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({ budget, onEdit }) => {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-lg font-semibold">{budget.category.name}</h3>
      <button onClick={() => onEdit(budget.id)}>Edit</button>
    </div>
  );
};
```

### State Management

```tsx
// ✅ Use hooks
const [budgets, setBudgets] = useState<Budget[]>([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  fetchBudgets();
}, []);
```

### API Calls

```typescript
// ✅ Create service files
// src/services/budget.service.ts

import axios from 'axios';

const API_URL = '/api/budgets';

export const budgetService = {
  getAll: () => axios.get(API_URL),
  create: (data: CreateBudgetInput) => axios.post(API_URL, data),
  update: (id: string, data: UpdateBudgetInput) => 
    axios.put(`${API_URL}/${id}`, data),
};
```

---

## 📚 Documentation

### Code Comments

```typescript
// ✅ Good: Explain WHY, not WHAT
// Use cached value to avoid repeated API calls
const category = cache.get(merchantName);

// ❌ Bad: Obvious comments
// Get category from cache
const category = cache.get(merchantName);
```

### JSDoc for Functions

```typescript
/**
 * Creates a new budget for the specified category
 * 
 * @param userId - The user creating the budget
 * @param input - Budget creation data
 * @returns The created budget with generated ID
 * @throws {NotFoundError} If category doesn't exist
 */
export const createBudget = async (
  userId: string,
  input: CreateBudgetInput
): Promise<Budget> => {
  // Implementation
};
```

---

## 🐛 Debugging Tips

### Backend

```typescript
// Use console.log with context
console.log('[Budget Service] Creating budget:', { userId, input });

// Use debugger in development
if (process.env.NODE_ENV === 'development') {
  debugger;
}
```

### Frontend

```typescript
// React DevTools
// Install React Developer Tools browser extension

// Console logging
console.log('Budget state:', budgets);
```

---

## 📦 Dependencies

### Adding New Dependencies

1. **Check if really needed** - Can you use existing packages?
2. **Research alternatives** - Compare options
3. **Check bundle size** - Use bundlephobia.com
4. **Verify maintenance** - Last update, open issues
5. **Document why** - Add comment in package.json

```bash
# Add production dependency
npm install package-name

# Add dev dependency
npm install -D package-name

# Update package.json comments
# "package-name": "^1.0.0"  // Used for XYZ feature
```

---

## 🚀 Release Process

(For maintainers)

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create git tag
4. Push to GitHub
5. Create release notes
6. Deploy to production

---

## ❓ Questions?

- **General questions:** [GitHub Discussions](https://github.com/amar-295/student-finance-db/discussions)
- **Bug reports:** [GitHub Issues](https://github.com/amar-295/student-finance-db/issues)
- **Direct contact:** Open an issue tagged `question`

---

## 🎉 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Given credit in project documentation

---

**Thank you for contributing to UniFlow! Every contribution, no matter how small, is valuable.** 🙏
