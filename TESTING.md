# Testing Guide

This project is configured with a robust testing architecture comprising Unit, Integration, and End-to-End (E2E) tests.

## 🚀 Quick Start

- **Run Unit Tests:** `npm run test`
- **Run E2E Tests:** `npm run test:e2e`
- **Run All Checks (CI-like):** `npm run lint && npm run test -- --run && npm run test:e2e`

## 🛠 Tools Used

- **Unit & Integration:** [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/)
  - *Why?* Faster than Jest, native ESM support, shared configuration with Vite.
- **End-to-End:** [Playwright](https://playwright.dev/)
  - *Why?* Reliable, handles multiple tabs/origins, powerful debugging tools.
- **Backend Mocking:** Firebase Emulators
  - *Why?* Tests run against a local instance of Firestore/Auth/Functions, ensuring safety and speed.

## 📂 Folder Structure

```
d:/xlance/
├── .github/workflows/test.yml  # CI/CD Pipeline
├── e2e/                        # Playwright E2E Tests
│   └── example.spec.js
├── src/
│   ├── components/             # Components & co-located tests
│   │   └── Button.test.jsx
│   ├── utils/                  # Utility functions & tests
│   │   └── helpers.test.js
│   └── setupTests.js           # Test environment setup
├── vitest.config.js            # Unit test configuration
└── playwright.config.js        # E2E test configuration
```

## 🧪 Writing Tests

### Unit Tests
Create files ending in `.test.jsx` or `.test.js` next to the file you are testing.

```javascript
// src/components/Button.test.jsx
import { render, screen } from '@testing-library/react';
import Button from './Button';

test('renders button with text', () => {
  render(<Button>Click Me</Button>);
  expect(screen.getByText('Click Me')).toBeInTheDocument();
});
```

### E2E Tests
Create files ending in `.spec.js` inside the `e2e/` folder.

```javascript
// e2e/auth.spec.js
import { test, expect } from '@playwright/test';

test('user can sign in', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'test@example.com');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
```

## 🔄 CI/CD

Tests run automatically on every Push and Pull Request to `main` via GitHub Actions.
- **Linting**: Checks for code style issues.
- **Unit Tests**: Verifies logic correctness.
- **E2E Tests**: Verifies critical user flows.
