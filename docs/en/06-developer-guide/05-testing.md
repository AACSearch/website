# Тестирование

Полное руководство по тестированию AACSearch: unit, integration, e2e, performance и security тесты.

## Содержание

- [Обзор стратегии тестирования](#обзор-стратегии-тестирования)
- [Unit Tests](#unit-tests)
- [Integration Tests](#integration-tests)
- [E2E Tests](#e2e-tests)
- [Performance Testing](#performance-testing)
- [Security Testing](#security-testing)
- [Test Utilities](#test-utilities)
- [CI/CD Integration](#cicd-integration)
- [Coverage Requirements](#coverage-requirements)

---

## Обзор стратегии тестирования

### Test Pyramid

```
        /\
       /  \          E2E Tests (Playwright)
      /----\         ~5% tests, critical user flows
     /      \
    /--------\       Integration Tests
   /          \      ~35% tests, API + DB + Search
  /------------\
 /   Unit Tests \    ~60% tests, functions, utils, hooks
/________________\
```

### Test Framework Stack

- **Unit & Integration**: Vitest (fast, modern, ESM support)
- **E2E**: Playwright (cross-browser, reliable)
- **Performance**: k6 (load testing)
- **Security**: OWASP ZAP, Snyk

### Coverage Goals

| Test Type | Coverage Target |
|-----------|----------------|
| Unit | 80%+ |
| Integration | 70%+ |
| E2E | Critical paths (100%) |
| Performance | All public APIs |
| Security | OWASP Top 10 |

---

## Unit Tests

### Setup (Vitest)

**vitest.config.ts**:
```typescript
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/dist/**',
      ],
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80,
    },
    mockReset: true,
    restoreMocks: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Example: Testing Utility Functions

**tests/lib/slugify.test.ts**:
```typescript
import { describe, it, expect } from 'vitest'
import { slugify } from '@/lib/utils/slugify'

describe('slugify', () => {
  it('should convert text to slug', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('should remove special characters', () => {
    expect(slugify('Hello @ World!')).toBe('hello-world')
  })

  it('should handle multiple spaces', () => {
    expect(slugify('Hello    World')).toBe('hello-world')
  })

  it('should handle accents', () => {
    expect(slugify('Café résumé')).toBe('cafe-resume')
  })

  it('should handle empty string', () => {
    expect(slugify('')).toBe('')
  })

  it('should trim leading/trailing dashes', () => {
    expect(slugify('-Hello World-')).toBe('hello-world')
  })
})
```

### Example: Testing Hooks

**tests/hooks/autoSlug.test.ts**:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { autoSlugHook } from '@/hooks/autoSlug'
import type { CollectionBeforeChangeHook } from 'payload'

// Mock payload
const mockPayload = {
  find: vi.fn(),
}

describe('autoSlugHook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should generate slug on create', async () => {
    mockPayload.find.mockResolvedValue({ docs: [] })

    const data = {
      title: 'My New Post',
    }

    const result = await autoSlugHook({
      data,
      req: { payload: mockPayload } as any,
      operation: 'create',
      originalDoc: {},
    } as Parameters<CollectionBeforeChangeHook>[0])

    expect(result.slug).toBe('my-new-post')
  })

  it('should ensure uniqueness', async () => {
    // First call returns existing slug
    mockPayload.find.mockResolvedValueOnce({ docs: [{ id: '123' }] })
    // Second call returns no conflict
    mockPayload.find.mockResolvedValueOnce({ docs: [] })

    const data = {
      title: 'Existing Post',
    }

    const result = await autoSlugHook({
      data,
      req: { payload: mockPayload } as any,
      operation: 'create',
      originalDoc: {},
    } as Parameters<CollectionBeforeChangeHook>[0])

    expect(result.slug).toBe('existing-post-1')
    expect(mockPayload.find).toHaveBeenCalledTimes(2)
  })

  it('should not regenerate slug on update if title unchanged', async () => {
    const data = {
      title: 'My Post',
      slug: 'my-post',
    }

    const result = await autoSlugHook({
      data,
      req: { payload: mockPayload } as any,
      operation: 'update',
      originalDoc: { title: 'My Post', slug: 'my-post' },
    } as Parameters<CollectionBeforeChangeHook>[0])

    expect(result.slug).toBe('my-post')
    expect(mockPayload.find).not.toHaveBeenCalled()
  })
})
```

### Example: Testing Search Algorithms

**tests/lib/fuzzySearch.test.ts**:
```typescript
import { describe, it, expect } from 'vitest'
import { FuzzySearchAlgorithm } from '@/lib/search/fuzzy'

describe('FuzzySearchAlgorithm', () => {
  const algorithm = new FuzzySearchAlgorithm({
    maxDistance: 2,
    threshold: 0.7,
  })

  it('should find exact matches', async () => {
    const docs = [
      { id: '1', name: 'JavaScript' },
      { id: '2', name: 'TypeScript' },
    ]

    const results = await algorithm.search('JavaScript', docs, ['name'])

    expect(results).toHaveLength(1)
    expect(results[0]!.doc.id).toBe('1')
    expect(results[0]!.score).toBe(1)
  })

  it('should handle typos', async () => {
    const docs = [
      { id: '1', name: 'JavaScript' },
    ]

    const results = await algorithm.search('Javascrpt', docs, ['name'])

    expect(results).toHaveLength(1)
    expect(results[0]!.score).toBeGreaterThan(0.8)
  })

  it('should respect threshold', async () => {
    const docs = [
      { id: '1', name: 'JavaScript' },
    ]

    const results = await algorithm.search('Python', docs, ['name'])

    expect(results).toHaveLength(0)
  })

  it('should search multiple fields', async () => {
    const docs = [
      { id: '1', name: 'React', description: 'JavaScript library' },
    ]

    const results = await algorithm.search('JavaScript', docs, ['name', 'description'])

    expect(results).toHaveLength(1)
  })
})
```

### Running Unit Tests

```bash
# Run all tests
pnpm test:unit

# Watch mode
pnpm test:unit:watch

# Coverage
pnpm test:unit:coverage

# Specific file
pnpm test:unit tests/lib/slugify.test.ts
```

---

## Integration Tests

Тесты, проверяющие взаимодействие компонентов: API + DB + Typesense.

### Setup

**tests/setup.ts**:
```typescript
import { beforeAll, afterAll, afterEach } from 'vitest'
import { getPayload } from 'payload'
import { getTypesenseClient } from '@/lib/typesense-api-complete'

let payload: Payload

beforeAll(async () => {
  // Initialize test database
  payload = await getPayload({
    config: await import('@/payload.config'),
  })

  // Initialize test Typesense collections
  const client = getTypesenseClient()
  await client.collections('test_symbols').delete()
  await client.collections().create({
    name: 'test_symbols',
    fields: [
      { name: 'name', type: 'string' },
      { name: 'description', type: 'string' },
    ],
  })
})

afterEach(async () => {
  // Clean up after each test
  await payload.delete({
    collection: 'symbols',
    where: {},
  })
})

afterAll(async () => {
  // Cleanup
  await payload.db.destroy()
  const client = getTypesenseClient()
  await client.collections('test_symbols').delete()
})

export { payload }
```

### Example: API Endpoint Tests

**tests/endpoints/search.test.ts**:
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { payload } from '../setup'

describe('Search Endpoint', () => {
  beforeEach(async () => {
    // Create test data
    await payload.create({
      collection: 'symbols',
      data: {
        name: 'JavaScript',
        description: 'Programming language',
        tenant: 'test-tenant',
      },
    })
  })

  it('should search and return results', async () => {
    const response = await fetch('http://localhost:3000/api/search?q=JavaScript', {
      headers: {
        'Authorization': `Bearer ${process.env.TEST_API_KEY}`,
      },
    })

    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.hits).toHaveLength(1)
    expect(data.hits[0]!.document.name).toBe('JavaScript')
  })

  it('should respect filters', async () => {
    const response = await fetch(
      'http://localhost:3000/api/search?q=*&filters={"category":"language"}',
      {
        headers: {
          'Authorization': `Bearer ${process.env.TEST_API_KEY}`,
        },
      }
    )

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.hits.length).toBeGreaterThanOrEqual(0)
  })

  it('should handle pagination', async () => {
    // Create 25 documents
    for (let i = 0; i < 25; i++) {
      await payload.create({
        collection: 'symbols',
        data: {
          name: `Item ${i}`,
          tenant: 'test-tenant',
        },
      })
    }

    const response = await fetch(
      'http://localhost:3000/api/search?q=*&page=2&limit=10',
      {
        headers: {
          'Authorization': `Bearer ${process.env.TEST_API_KEY}`,
        },
      }
    )

    const data = await response.json()
    expect(data.hits).toHaveLength(10)
    expect(data.page).toBe(2)
  })

  it('should return 401 without auth', async () => {
    const response = await fetch('http://localhost:3000/api/search?q=test')

    expect(response.status).toBe(401)
  })
})
```

### Example: Integration Sync Tests

**tests/integrations/wordpress.test.ts**:
```typescript
import { describe, it, expect, vi } from 'vitest'
import { WordPressConnector } from '@/integrations/wordpress/connector'
import { payload } from '../setup'

describe('WordPress Integration', () => {
  const mockContext = {
    payload,
    tenantId: 'test-tenant',
    config: {
      provider: 'wordpress' as const,
      credentials: {
        baseUrl: 'https://example.com',
        username: 'admin',
        password: 'password',
      },
      settings: {},
    },
    logger: {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    },
  }

  it('should test connection', async () => {
    const connector = new WordPressConnector(mockContext)

    // Mock fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ([]),
    })

    const result = await connector.testConnection()

    expect(result.success).toBe(true)
  })

  it('should fetch posts', async () => {
    const connector = new WordPressConnector(mockContext)

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          title: { rendered: 'Test Post' },
          content: { rendered: 'Content' },
        },
      ],
      headers: new Headers({
        'X-WP-Total': '1',
        'X-WP-TotalPages': '1',
      }),
    })

    const result = await connector.fetchResources('posts')

    expect(result.data).toHaveLength(1)
    expect(result.hasMore).toBe(false)
  })

  it('should sync post to Payload', async () => {
    const connector = new WordPressConnector(mockContext)

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 1,
        title: { rendered: 'Test Post' },
        content: { rendered: 'Content' },
        slug: 'test-post',
      }),
    })

    const result = await connector.syncResource('posts', '1', mockContext)

    expect(result.success).toBe(true)
    expect(result.operation).toBe('create')

    // Verify created in Payload
    const doc = await payload.find({
      collection: 'symbols',
      where: {
        slug: { equals: 'test-post' },
      },
    })

    expect(doc.docs).toHaveLength(1)
  })
})
```

### Running Integration Tests

```bash
# Run all integration tests
pnpm test:integration

# Run specific suite
pnpm test:integration tests/endpoints/search.test.ts

# With debugging
DEBUG=* pnpm test:integration
```

---

## E2E Tests

End-to-end тесты critical user flows с Playwright.

### Setup

**playwright.config.ts**:
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: process.env.TEST_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### Example: Search Flow

**tests/e2e/search.spec.ts**:
```typescript
import { test, expect } from '@playwright/test'

test.describe('Search Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should perform basic search', async ({ page }) => {
    // Find search input
    const searchInput = page.locator('input[name="search"]')
    await expect(searchInput).toBeVisible()

    // Type query
    await searchInput.fill('JavaScript')
    await searchInput.press('Enter')

    // Wait for results
    await page.waitForURL('**/search?q=JavaScript')
    await expect(page.locator('.search-results')).toBeVisible()

    // Verify results
    const results = page.locator('.search-result')
    await expect(results).toHaveCountGreaterThan(0)

    // Check first result
    const firstResult = results.first()
    await expect(firstResult).toContainText('JavaScript')
  })

  test('should use autocomplete', async ({ page }) => {
    const searchInput = page.locator('input[name="search"]')

    await searchInput.fill('Java')

    // Wait for suggestions
    await expect(page.locator('.autocomplete-suggestions')).toBeVisible()

    const suggestions = page.locator('.suggestion-item')
    await expect(suggestions).toHaveCountGreaterThan(0)

    // Click first suggestion
    await suggestions.first().click()

    // Should navigate to search results
    await page.waitForURL('**/search?q=*')
  })

  test('should apply filters', async ({ page }) => {
    await page.goto('/search?q=*')

    // Open filters
    await page.click('button:has-text("Filters")')

    // Select category filter
    await page.click('input[name="category"][value="language"]')

    // Click apply
    await page.click('button:has-text("Apply")')

    // Verify URL updated
    await expect(page).toHaveURL(/.*filters.*category.*language/)

    // Verify results filtered
    const results = page.locator('.search-result')
    await expect(results.first()).toContainText('Language')
  })

  test('should handle no results', async ({ page }) => {
    const searchInput = page.locator('input[name="search"]')

    await searchInput.fill('xyzabc123nonexistent')
    await searchInput.press('Enter')

    // Wait for results page
    await page.waitForURL('**/search?q=*')

    // Should show no results message
    await expect(page.locator('.no-results')).toBeVisible()
    await expect(page.locator('.no-results')).toContainText('No results found')

    // Should show suggestions
    await expect(page.locator('.search-suggestions')).toBeVisible()
  })
})
```

### Example: Authentication Flow

**tests/e2e/auth.spec.ts**:
```typescript
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/login')

    // Fill login form
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')

    // Submit
    await page.click('button[type="submit"]')

    // Should redirect to dashboard
    await page.waitForURL('**/dashboard')

    // Verify user is logged in
    await expect(page.locator('.user-menu')).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[name="email"]', 'invalid@example.com')
    await page.fill('input[name="password"]', 'wrongpassword')

    await page.click('button[type="submit"]')

    // Should show error message
    await expect(page.locator('.error-message')).toBeVisible()
    await expect(page.locator('.error-message')).toContainText('Invalid credentials')
  })

  test('should logout', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/dashboard')

    // Logout
    await page.click('.user-menu')
    await page.click('button:has-text("Logout")')

    // Should redirect to login
    await page.waitForURL('**/login')
  })
})
```

### Running E2E Tests

```bash
# Run all e2e tests
pnpm test:e2e

# Run in headed mode (see browser)
pnpm test:e2e:headed

# Run in debug mode
pnpm test:e2e:debug

# Run specific test
pnpm test:e2e tests/e2e/search.spec.ts

# Generate report
pnpm playwright show-report
```

---

## Performance Testing

Load testing с k6.

### Setup k6

**tests/performance/search-load.js**:
```javascript
import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate } from 'k6/metrics'

const errorRate = new Rate('errors')

export const options = {
  stages: [
    { duration: '30s', target: 20 },  // Ramp up to 20 users
    { duration: '1m', target: 20 },   // Stay at 20 users
    { duration: '30s', target: 50 },  // Ramp up to 50 users
    { duration: '2m', target: 50 },   // Stay at 50 users
    { duration: '30s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.01'],   // Less than 1% errors
    errors: ['rate<0.1'],
  },
}

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'
const API_KEY = __ENV.API_KEY

export default function () {
  const queries = ['JavaScript', 'Python', 'TypeScript', 'React', 'Node.js']
  const query = queries[Math.floor(Math.random() * queries.length)]

  const res = http.get(`${BASE_URL}/api/search?q=${query}`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
    },
  })

  const success = check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
    'has results': (r) => JSON.parse(r.body).hits.length > 0,
  })

  errorRate.add(!success)

  sleep(1)
}
```

### Running Performance Tests

```bash
# Install k6
brew install k6

# Run test
k6 run tests/performance/search-load.js

# With custom options
k6 run --vus 100 --duration 5m tests/performance/search-load.js

# Output to InfluxDB
k6 run --out influxdb=http://localhost:8086/k6 tests/performance/search-load.js
```

---

## Security Testing

### OWASP ZAP

**tests/security/zap-scan.sh**:
```bash
#!/bin/bash

# Start ZAP in daemon mode
docker run -d --name zap \
  -u zap \
  -p 8080:8080 \
  owasp/zap2docker-stable \
  zap.sh -daemon -host 0.0.0.0 -port 8080 -config api.addrs.addr.name=.* -config api.addrs.addr.regex=true

# Wait for ZAP to start
sleep 10

# Run baseline scan
docker exec zap zap-baseline.py \
  -t http://localhost:3000 \
  -r zap-report.html

# Stop ZAP
docker stop zap
docker rm zap
```

### Dependency Scanning (Snyk)

```bash
# Install Snyk
npm install -g snyk

# Authenticate
snyk auth

# Test for vulnerabilities
snyk test

# Monitor project
snyk monitor
```

---

## Test Utilities

### Test Data Factories

**tests/factories/user.ts**:
```typescript
import { Factory } from 'fishery'
import type { User } from '@/payload-types'

export const userFactory = Factory.define<User>(({ sequence }) => ({
  id: sequence,
  email: `user${sequence}@example.com`,
  password: 'password123',
  role: 'user',
  firstName: `User`,
  lastName: `${sequence}`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}))

// Usage
const user = userFactory.build()
const admin = userFactory.build({ role: 'admin' })
const users = userFactory.buildList(10)
```

### Mock Services

**tests/mocks/typesense.ts**:
```typescript
import { vi } from 'vitest'

export const mockTypesenseClient = {
  collections: vi.fn(() => ({
    create: vi.fn(),
    delete: vi.fn(),
    retrieve: vi.fn(),
    documents: vi.fn(() => ({
      upsert: vi.fn(),
      delete: vi.fn(),
      search: vi.fn().mockResolvedValue({
        hits: [],
        found: 0,
      }),
    })),
  })),
}
```

---

## CI/CD Integration

### GitHub Actions

**.github/workflows/test.yml**:
```yaml
name: Tests

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'

      - run: pnpm install
      - run: pnpm test:unit:coverage

      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

      typesense:
        image: typesense/typesense:latest
        env:
          TYPESENSE_API_KEY: test-api-key
        options: >-
          --health-cmd "curl -f http://localhost:8108/health"
          --health-interval 10s

    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'

      - run: pnpm install
      - run: pnpm test:integration
        env:
          DATABASE_URL: postgres://postgres:postgres@localhost:5432/test
          TYPESENSE_API_KEY: test-api-key

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'

      - run: pnpm install
      - run: npx playwright install --with-deps
      - run: pnpm test:e2e

      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Coverage Requirements

### Coverage Report

```bash
# Generate coverage
pnpm test:unit:coverage

# Open HTML report
open coverage/index.html
```

### Minimum Coverage

- **Lines**: 80%
- **Functions**: 80%
- **Branches**: 75%
- **Statements**: 80%

### Critical Paths (100%)

- Authentication
- Payment processing
- API key validation
- Search indexing
- Data synchronization

---

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Clear Names**: Use descriptive test names
3. **AAA Pattern**: Arrange, Act, Assert
4. **Mock External Services**: Don't rely on external APIs in tests
5. **Fast Tests**: Unit tests should be < 100ms
6. **Deterministic**: Tests should always produce same results
7. **Clean Up**: Always clean up test data

## Заключение

Comprehensive testing strategy обеспечивает качество и стабильность платформы AACSearch. Следуйте guidelines для надежных тестов!
