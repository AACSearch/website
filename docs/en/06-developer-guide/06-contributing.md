# Contributing Guide

Руководство по внесению вклада в развитие AACSearch платформы.

## Содержание

- [Code of Conduct](#code-of-conduct)
- [Development Setup](#development-setup)
- [Git Workflow](#git-workflow)
- [Coding Standards](#coding-standards)
- [Commit Message Format](#commit-message-format)
- [Pull Request Process](#pull-request-process)
- [Code Review](#code-review)
- [Documentation Requirements](#documentation-requirements)
- [Testing Requirements](#testing-requirements)

---

## Code of Conduct

### Наши обязательства

Мы, как участники и maintainers проекта, обязуемся сделать участие в нашем проекте и сообществе свободным от harassment для всех, независимо от возраста, размера тела, инвалидности, этнической принадлежности, гендерной идентичности и выражения, уровня опыта, образования, социально-экономического статуса, национальности, личной внешности, расы, религии или сексуальной идентичности и ориентации.

### Наши стандарты

**Примеры приемлемого поведения:**

- Использование welcoming и inclusive языка
- Уважение различных точек зрения и опыта
- Принятие конструктивной критики
- Фокус на том, что лучше для сообщества
- Проявление empathy к другим участникам

**Примеры неприемлемого поведения:**

- Использование sexualized языка или imagery
- Trolling, оскорбительные комментарии, personal attacks
- Public или private harassment
- Публикация private информации без разрешения
- Другое поведение, которое можно считать inappropriate

### Enforcement

Случаи нарушения могут быть сообщены по адресу: **conduct@aacsearch.com**

---

## Development Setup

### Требования

- **Node.js**: >= 20.9.0
- **pnpm**: >= 9.7.0
- **Docker**: для локальных сервисов (PostgreSQL, Typesense, Redis)
- **Git**: >= 2.30

### Первоначальная настройка

```bash
# 1. Fork репозиторий на GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/aacsearch-platform.git
cd aacsearch-platform/platform

# 3. Add upstream remote
git remote add upstream https://github.com/aacsearch/platform.git

# 4. Enable pnpm
corepack enable

# 5. Install dependencies
pnpm install

# 6. Copy environment variables
cp .env.example .env.local

# 7. Start Docker services
pnpm docker:start

# 8. Run database migrations
pnpm db:migrate

# 9. Seed database (optional)
pnpm db:seed

# 10. Start development server
pnpm dev
```

### Environment Variables

Создайте `.env.local` со следующими переменными:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/aacsearch_dev

# Typesense
TYPESENSE_HOST=localhost
TYPESENSE_PORT=8108
TYPESENSE_PROTOCOL=http
TYPESENSE_API_KEY=dev-api-key

# Redis
REDIS_URL=redis://localhost:6379

# Auth
PAYLOAD_SECRET=your-secret-key-change-me-in-production
JWT_SECRET=another-secret-key

# Stripe (for billing tests)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# OpenAI (for NL search)
OPENAI_API_KEY=sk-...

# AWS S3 (for media storage)
S3_BUCKET=aacsearch-dev
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
```

### Docker Services

```bash
# Start all services
pnpm docker:start

# Stop all services
pnpm docker:stop

# Restart services
pnpm docker:restart

# View logs
pnpm docker:logs

# Clean volumes (⚠️ deletes all data)
pnpm docker:clean
```

---

## Git Workflow

### Branch Strategy

```
main (protected)
  ├── dev (default branch for PRs)
  │   ├── feature/add-semantic-search
  │   ├── fix/search-timeout-issue
  │   └── refactor/optimize-indexing
  └── release/v1.2.0
```

### Creating a Feature Branch

```bash
# 1. Sync with upstream
git checkout dev
git pull upstream dev

# 2. Create feature branch
git checkout -b feature/your-feature-name

# или для bugfix
git checkout -b fix/bug-description

# или для refactoring
git checkout -b refactor/what-you-refactor
```

### Branch Naming Convention

Format: `type/description`

**Types:**
- `feature/` - новая функциональность
- `fix/` - исправление бага
- `refactor/` - рефакторинг без изменения функциональности
- `docs/` - изменения только в документации
- `test/` - добавление или изменение тестов
- `chore/` - изменения в build process, dependencies, etc.
- `perf/` - оптимизация производительности

**Examples:**
```
feature/semantic-vector-search
fix/typesense-connection-timeout
refactor/search-algorithm-cleanup
docs/update-api-documentation
test/add-integration-tests-for-search
chore/upgrade-typescript-to-5.3
perf/optimize-indexing-pipeline
```

---

## Coding Standards

### TypeScript

#### Strict Mode

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

#### Type Annotations

```typescript
// ✅ Good: Explicit types
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0)
}

// ❌ Bad: Implicit any
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0)
}
```

#### Null Checks

```typescript
// ✅ Good: Proper null checking
function getUserName(user: User | null): string {
  if (!user) {
    return 'Anonymous'
  }
  return user.name ?? 'Anonymous'
}

// ❌ Bad: Assuming non-null
function getUserName(user: User): string {
  return user.name // может быть undefined
}
```

### ESLint Rules

**.eslintrc.js**:
```javascript
module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': ['warn', {
      allowExpressions: true,
    }],
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/await-thenable': 'error',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
}
```

### Prettier

**.prettierrc**:
```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### Naming Conventions

```typescript
// Files
myUtility.ts          // camelCase для utility files
MyComponent.tsx       // PascalCase для React components
my-endpoint.ts        // kebab-case для API endpoints

// Variables & Functions
const userName = 'John'               // camelCase
function getUserById(id: string) {}   // camelCase

// Types & Interfaces
type User = { ... }                   // PascalCase
interface SearchParams { ... }        // PascalCase

// Classes
class SearchService { ... }           // PascalCase

// Constants
const MAX_RESULTS = 100               // UPPER_SNAKE_CASE
const API_BASE_URL = '...'            // UPPER_SNAKE_CASE

// Enums
enum UserRole {                       // PascalCase
  Admin = 'admin',                    // PascalCase keys
  Editor = 'editor',
}

// Private properties/methods
class MyClass {
  private _internalState: string      // underscore prefix
  private _calculateValue(): number
}
```

### Code Organization

```typescript
// 1. Imports (grouped)
import type { FC } from 'react'
import { useState, useEffect } from 'react'

import type { User } from '@/payload-types'
import { Button } from '@/components/ui'

// 2. Types/Interfaces
export interface MyComponentProps {
  user: User
  onSave: (data: unknown) => void
}

// 3. Constants
const MAX_ITEMS = 10

// 4. Helper functions
function formatDate(date: Date): string {
  return date.toISOString()
}

// 5. Main component/function
export const MyComponent: FC<MyComponentProps> = ({ user, onSave }) => {
  // State
  const [isLoading, setIsLoading] = useState(false)

  // Effects
  useEffect(() => {
    // ...
  }, [])

  // Handlers
  const handleSave = (): void => {
    onSave(data)
  }

  // Render
  return <div>...</div>
}
```

---

## Commit Message Format

Следуем [Conventional Commits](https://www.conventionalcommits.org/).

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: Новая функциональность
- `fix`: Исправление бага
- `docs`: Изменения в документации
- `style`: Форматирование (не влияющее на код)
- `refactor`: Рефакторинг
- `perf`: Оптимизация производительности
- `test`: Добавление или изменение тестов
- `chore`: Изменения в build process, dependencies
- `ci`: Изменения в CI/CD конфигурации

### Scopes

- `search` - Search functionality
- `api` - API endpoints
- `ui` - User interface
- `db` - Database
- `typesense` - Typesense integration
- `auth` - Authentication
- `billing` - Billing & subscriptions
- `integrations` - External integrations
- `jobs` - Background jobs

### Examples

```
feat(search): add semantic vector search support

Implements semantic search using OpenAI embeddings.
Users can now search using natural language queries
that understand context and meaning.

Closes #123
```

```
fix(api): resolve timeout in search endpoint

Search requests were timing out for large result sets.
Added pagination and optimized query to fix the issue.

Fixes #456
```

```
docs(api): update search endpoint documentation

Added examples for all query parameters and
clarified filter syntax.
```

```
refactor(typesense): extract client initialization

Moved Typesense client initialization to separate
utility for better reusability and testing.
```

### Commit Best Practices

1. **Atomic commits**: Каждый commit должен быть логически завершенным
2. **Present tense**: "add feature" не "added feature"
3. **Imperative mood**: "fix bug" не "fixes bug"
4. **Lowercase subject**: начинайте с lowercase
5. **No period**: не ставьте точку в конце subject
6. **Body for context**: используйте body для объяснения "why", не "what"
7. **Reference issues**: используйте `Closes #123` или `Fixes #456`

---

## Pull Request Process

### Creating a Pull Request

```bash
# 1. Push your branch
git push origin feature/your-feature-name

# 2. Open PR on GitHub
# Go to: https://github.com/YOUR_USERNAME/aacsearch-platform/pull/new

# 3. Fill out PR template
```

### PR Title Format

Same as commit message format:

```
feat(search): add semantic vector search
fix(api): resolve search timeout issue
docs(contributing): update development setup guide
```

### PR Template

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Manual testing

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published

## Screenshots (if applicable)
Add screenshots to demonstrate changes.

## Related Issues
Closes #123
Fixes #456
```

### PR Size Guidelines

- **Small PR**: < 200 lines changed (preferred)
- **Medium PR**: 200-500 lines
- **Large PR**: > 500 lines (should be split if possible)

**Tips for smaller PRs:**
- Split features into multiple PRs
- Separate refactoring from feature implementation
- Use feature flags for incremental rollout

---

## Code Review

### Reviewer Guidelines

#### What to Check

1. **Correctness**
   - Does the code do what it's supposed to?
   - Are there edge cases not handled?
   - Are error cases handled properly?

2. **Tests**
   - Are there sufficient tests?
   - Do tests cover edge cases?
   - Do all tests pass?

3. **Code Quality**
   - Is the code easy to understand?
   - Are names clear and descriptive?
   - Is there unnecessary complexity?

4. **Performance**
   - Are there obvious performance issues?
   - Is pagination implemented for large datasets?
   - Are N+1 queries avoided?

5. **Security**
   - Is user input validated and sanitized?
   - Are authentication/authorization checks in place?
   - Are secrets handled properly?

6. **Documentation**
   - Are public APIs documented?
   - Are complex algorithms explained?
   - Is README updated if needed?

#### Review Process

```markdown
## Review Comments Example

### Critical Issues (Must Fix)
- 🚨 **Security**: User input not sanitized in line 42
- 🚨 **Bug**: Null pointer exception possible in line 56

### Suggestions (Should Fix)
- 💡 **Performance**: Consider adding index to `users.email`
- 💡 **Code Quality**: Extract complex logic into separate function (line 78-95)

### Nice to Have
- ✨ Add JSDoc comment for this function
- ✨ Consider using `const` instead of `let` here

### Questions
- ❓ Why was this approach chosen over X?
- ❓ Have you considered edge case Y?

### Praise
- ✅ Great test coverage!
- ✅ Clean and readable code
```

### Author Guidelines

#### Responding to Feedback

```markdown
✅ Fixed in abc1234
✅ Done
✅ Good catch! Updated.
🤔 I considered that but chose X because...
❓ Could you clarify what you mean by...?
```

#### Request Re-review

После внесения изменений:

```bash
git push origin feature/your-feature-name

# На GitHub: Request re-review from reviewers
```

---

## Documentation Requirements

### Code Documentation

```typescript
/**
 * Searches documents using semantic vector similarity
 *
 * @param query - The search query text
 * @param options - Search options
 * @param options.collection - Collection to search in
 * @param options.limit - Maximum number of results (default: 20)
 * @param options.threshold - Similarity threshold 0-1 (default: 0.7)
 * @returns Promise resolving to search results
 *
 * @example
 * ```typescript
 * const results = await semanticSearch('find similar articles', {
 *   collection: 'symbols',
 *   limit: 10,
 *   threshold: 0.8,
 * })
 * ```
 *
 * @throws {Error} If OpenAI API key is not configured
 * @throws {Error} If collection does not exist
 */
export async function semanticSearch(
  query: string,
  options: SemanticSearchOptions
): Promise<SearchResult[]> {
  // Implementation
}
```

### README Updates

При добавлении новой функциональности, обновите соответствующий README:

- `/docs/README.md` - основная документация
- `/docs/api/README.md` - API документация
- `/docs/integrations/README.md` - документация интеграций

### Changelog

Обновите `CHANGELOG.md`:

```markdown
## [Unreleased]

### Added
- Semantic vector search support (#123)
- Image search API endpoint (#124)

### Fixed
- Search timeout for large result sets (#125)
- Rate limiting bypass vulnerability (#126)

### Changed
- Upgraded Typesense to v0.29 (#127)

### Deprecated
- Old search API v1 (will be removed in v2.0)

### Removed
- Legacy sync job (replaced by new integration system)

### Security
- Fixed XSS vulnerability in search results (#128)
```

---

## Testing Requirements

### Required Tests

For every PR, you must include:

1. **Unit Tests** (if adding/modifying functions)
   ```typescript
   // tests/lib/myFunction.test.ts
   describe('myFunction', () => {
     it('should handle normal case', () => { ... })
     it('should handle edge case', () => { ... })
     it('should throw on invalid input', () => { ... })
   })
   ```

2. **Integration Tests** (if adding/modifying APIs)
   ```typescript
   // tests/endpoints/myEndpoint.test.ts
   describe('POST /api/my-endpoint', () => {
     it('should return 200 with valid data', async () => { ... })
     it('should return 400 with invalid data', async () => { ... })
     it('should return 401 without auth', async () => { ... })
   })
   ```

3. **E2E Tests** (if adding critical user flows)
   ```typescript
   // tests/e2e/myFeature.spec.ts
   test('user can complete flow', async ({ page }) => { ... })
   ```

### Running Tests Before PR

```bash
# Run all tests
pnpm test

# Specific test suites
pnpm test:unit
pnpm test:integration
pnpm test:e2e

# With coverage
pnpm test:coverage

# Lint
pnpm lint

# Type check
pnpm type-check
```

### Coverage Requirements

- **Unit tests**: 80%+ coverage for new code
- **Integration tests**: All new API endpoints must be tested
- **E2E tests**: Critical user flows must be covered

---

## Release Process

### Versioning

Follows [Semantic Versioning](https://semver.org/):

- **MAJOR**: Incompatible API changes (1.0.0 → 2.0.0)
- **MINOR**: Backward-compatible functionality (1.0.0 → 1.1.0)
- **PATCH**: Backward-compatible bug fixes (1.0.0 → 1.0.1)

### Release Workflow

1. **Create release branch**
   ```bash
   git checkout -b release/v1.2.0
   ```

2. **Update version**
   ```bash
   pnpm version minor  # or major/patch
   ```

3. **Update CHANGELOG**
   ```markdown
   ## [1.2.0] - 2024-01-15
   ### Added
   - Feature X
   ```

4. **Create PR to main**

5. **After merge, tag release**
   ```bash
   git tag v1.2.0
   git push origin v1.2.0
   ```

6. **GitHub Actions auto-deploys**

---

## Getting Help

- **Questions**: Open a [GitHub Discussion](https://github.com/aacsearch/platform/discussions)
- **Bugs**: Open a [GitHub Issue](https://github.com/aacsearch/platform/issues)
- **Security**: Email security@aacsearch.com
- **Community**: Join our [Discord](https://discord.gg/aacsearch)

---

## Recognition

Contributors будут добавлены в:
- `CONTRIBUTORS.md`
- GitHub contributors list
- Release notes (for significant contributions)

Thank you for contributing to AACSearch! 🎉
