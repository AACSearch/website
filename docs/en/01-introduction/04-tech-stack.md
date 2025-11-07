# Технологический стек AACSearch

## Содержание

- [Технологический стек AACSearch](#технологический-стек-aacsearch)
  - [Содержание](#содержание)
  - [1. Backend технологии](#1-backend-технологии)
    - [1.1. Runtime и язык программирования](#11-runtime-и-язык-программирования)
    - [1.2. Framework](#12-framework)
    - [1.3. CMS Platform](#13-cms-platform)
  - [2. Frontend технологии](#2-frontend-технологии)
    - [2.1. Core библиотеки](#21-core-библиотеки)
    - [2.2. UI компоненты](#22-ui-компоненты)
    - [2.3. Стилизация](#23-стилизация)
    - [2.4. Иконки и графика](#24-иконки-и-графика)
  - [3. Database и хранение данных](#3-database-и-хранение-данных)
    - [3.1. PostgreSQL](#31-postgresql)
    - [3.2. Redis](#32-redis)
    - [3.3. Search Engine (Typesense)](#33-search-engine-typesense)
  - [4. Платежи и биллинг](#4-платежи-и-биллинг)
    - [4.1. Stripe](#41-stripe)
  - [5. Формы и валидация](#5-формы-и-валидация)
    - [5.1. React Hook Form](#51-react-hook-form)
    - [5.2. Zod](#52-zod)
  - [6. Визуализация и графики](#6-визуализация-и-графики)
    - [6.1. Recharts](#61-recharts)
  - [7. Build tools и инфраструктура](#7-build-tools-и-инфраструктура)
    - [7.1. Package Manager](#71-package-manager)
    - [7.2. TypeScript](#72-typescript)
    - [7.3. Компиляция и сборка](#73-компиляция-и-сборка)
  - [8. Testing](#8-testing)
    - [8.1. Unit Testing](#81-unit-testing)
    - [8.2. E2E Testing](#82-e2e-testing)
    - [8.3. Component Testing](#83-component-testing)
  - [9. DevOps и deployment](#9-devops-и-deployment)
    - [9.1. Контейнеризация](#91-контейнеризация)
    - [9.2. Orchestration](#92-orchestration)
    - [9.3. CI/CD](#93-cicd)
  - [10. Monitoring и observability](#10-monitoring-и-observability)
    - [10.1. Logging](#101-logging)
    - [10.2. Metrics](#102-metrics)
    - [10.3. APM](#103-apm)
  - [11. Полный список зависимостей](#11-полный-список-зависимостей)
    - [11.1. Production Dependencies](#111-production-dependencies)
    - [11.2. Development Dependencies](#112-development-dependencies)
  - [12. Системные требования](#12-системные-требования)
    - [12.1. Runtime версии](#121-runtime-версии)
    - [12.2. Минимальные требования к серверу](#122-минимальные-требования-к-серверу)
    - [12.3. Рекомендуемые требования для production](#123-рекомендуемые-требования-для-production)

---

## 1. Backend технологии

### 1.1. Runtime и язык программирования

#### Node.js 20+

```json
{
  "engines": {
    "node": "^18.20.2 || >=20.9.0"
  }
}
```

**Назначение:**
- JavaScript/TypeScript runtime на базе V8
- Асинхронное событийно-ориентированное I/O
- Высокая производительность для I/O-bound операций

**Почему Node.js 20+:**
- **Встроенный Test Runner**: Нативное тестирование без сторонних библиотек
- **Fetch API**: Стандартизированный HTTP клиент
- **Performance Improvements**: До 30% быстрее в некоторых операциях
- **ECMAScript 2023**: Поддержка новейших JavaScript features
- **V8 11.3+**: Улучшенная производительность и оптимизации
- **Single Executable Applications**: Возможность компиляции в standalone binary

**Использование в проекте:**
```typescript
// package.json scripts используют NODE_OPTIONS
{
  "scripts": {
    "dev": "cross-env NODE_OPTIONS=--no-deprecation next dev",
    "build": "cross-env NODE_OPTIONS=--no-deprecation next build"
  }
}
```

#### TypeScript 5.7.3

```json
{
  "devDependencies": {
    "typescript": "5.7.3"
  }
}
```

**Назначение:**
- Статическая типизация для JavaScript
- Compile-time проверка типов
- Improved IDE support и автодополнение

**Конфигурация (tsconfig.json):**
```json
{
  "compilerOptions": {
    "strict": true,                    // Строгий режим
    "target": "ES2022",                // Целевой стандарт ECMAScript
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "esModuleInterop": true,           // Совместимость с CommonJS
    "skipLibCheck": true,              // Пропуск проверки .d.ts файлов
    "noEmit": true,                    // Не генерировать .js файлы
    "incremental": true,               // Инкрементальная компиляция
    "jsx": "preserve",                 // Сохранять JSX для Next.js
    "module": "esnext",                // ES модули
    "moduleResolution": "bundler",     // Разрешение модулей через bundler
    "resolveJsonModule": true,         // Поддержка JSON импортов
    "sourceMap": true,                 // Source maps для отладки
    "isolatedModules": true,           // Каждый файл - отдельный модуль
    "paths": {
      "@payload-config": ["./src/payload.config.ts"],
      "@/*": ["./src/*"]
    }
  }
}
```

**Ключевые особенности TypeScript 5.7:**
- **Decorator Metadata**: Полная поддержка декораторов
- **const Type Parameters**: Типизация для const generics
- **Improved Inference**: Лучший вывод типов
- **Better Error Messages**: Более понятные сообщения об ошибках

**Примеры использования в проекте:**
```typescript
// Strict typing для API endpoints
import type { NextRequest } from 'next/server'
import type { Payload } from 'payload'

export async function POST(req: NextRequest): Promise<Response> {
  const payload = await getPayload({ config })
  // Type-safe API calls
}

// Generic типы для коллекций
interface CollectionSchema<T extends Record<string, unknown>> {
  slug: string
  fields: FieldConfig<T>[]
  access: AccessControl<T>
}
```

### 1.2. Framework

#### Next.js 15.4.4

```json
{
  "dependencies": {
    "next": "15.4.4"
  }
}
```

**Назначение:**
- React framework для production
- Server-side rendering (SSR)
- Static site generation (SSG)
- API routes
- App Router (новая архитектура)

**Ключевые возможности Next.js 15:**

**1. App Router (React Server Components):**
```typescript
// app/page.tsx - Server Component по умолчанию
import { getPayload } from 'payload'

export default async function HomePage() {
  const payload = await getPayload({ config })
  const posts = await payload.find({ collection: 'posts' })

  return <div>{/* Рендеринг на сервере */}</div>
}
```

**2. Server Actions:**
```typescript
// app/actions.ts
'use server'

export async function createDocument(formData: FormData) {
  const payload = await getPayload({ config })
  return await payload.create({
    collection: 'documents',
    data: Object.fromEntries(formData)
  })
}
```

**3. Streaming и Suspense:**
```typescript
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <SlowComponent />
    </Suspense>
  )
}
```

**4. API Routes:**
```typescript
// app/api/search/route.ts
export async function POST(req: NextRequest) {
  const body = await req.json()
  const results = await searchEngine.search(body)
  return Response.json(results)
}
```

**5. Middleware:**
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // Rate limiting, auth, etc.
  return NextResponse.next()
}
```

**6. Image Optimization:**
```typescript
import Image from 'next/image'

<Image
  src="/product.jpg"
  width={800}
  height={600}
  alt="Product"
  priority // LCP optimization
/>
```

**Производительность Next.js 15:**
- **Turbopack**: До 700x быстрее холодного старта
- **Optimized Bundling**: Меньший размер bundle
- **Automatic Code Splitting**: Загрузка только необходимого кода
- **Partial Prerendering (PPR)**: Комбинация статики и динамики

**Конфигурация (next.config.js):**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true, // SWC минификация
  images: {
    domains: ['cdn.aacsearch.com'],
    formats: ['image/avif', 'image/webp']
  },
  experimental: {
    serverActions: true,
    ppr: true // Partial Prerendering
  }
}
```

### 1.3. CMS Platform

#### Payload CMS 3.62.0

```json
{
  "dependencies": {
    "payload": "3.62.0",
    "@payloadcms/next": "3.62.0",
    "@payloadcms/db-postgres": "3.62.0",
    "@payloadcms/richtext-lexical": "3.62.0"
  }
}
```

**Назначение:**
- Headless CMS для управления контентом
- Admin UI из коробки
- Type-safe API
- Multi-tenant architecture
- Расширяемая платформа

**Основные модули:**

**1. Core (@payloadcms/next):**
```typescript
import { getPayload } from '@payloadcms/next'
import config from '@payload-config'

const payload = await getPayload({ config })
```

**2. Database Adapter (@payloadcms/db-postgres):**
```typescript
import { postgresAdapter } from '@payloadcms/db-postgres'

export default buildConfig({
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI
    }
  })
})
```

**3. Rich Text Editor (@payloadcms/richtext-lexical):**
```typescript
import { lexicalEditor } from '@payloadcms/richtext-lexical'

{
  name: 'content',
  type: 'richText',
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      // Custom features
    ]
  })
}
```

**4. Плагины:**
```json
{
  "dependencies": {
    "@payloadcms/plugin-form-builder": "3.62.0",
    "@payloadcms/plugin-nested-docs": "3.62.0",
    "@payloadcms/plugin-redirects": "3.62.0",
    "@payloadcms/plugin-search": "3.62.0",
    "@payloadcms/plugin-seo": "3.62.0"
  }
}
```

**Архитектура коллекций:**
```typescript
import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: { useAsTitle: 'name' },
  access: {
    read: ({ req: { user } }) => isPlatformAdmin(user),
    create: ({ req: { user } }) => isPlatformAdmin(user),
    update: ({ req: { user } }) => isPlatformAdmin(user),
    delete: ({ req: { user } }) => isPlatformAdmin(user)
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    {
      name: 'plan',
      type: 'relationship',
      relationTo: 'plans',
      required: true
    }
  ]
}
```

**Возможности Payload 3.x:**
- **TypeScript-First**: Полная типизация из коробки
- **Server Components**: Нативная интеграция с Next.js 15
- **GraphQL API**: Автоматическая генерация GraphQL схемы
- **REST API**: CRUD операции для всех коллекций
- **Access Control**: Гранулярный контроль доступа
- **Hooks System**: Lifecycle hooks для всех операций
- **Live Preview**: Предпросмотр изменений в реальном времени
- **Localization**: Мультиязычный контент
- **File Upload**: Встроенное управление медиа
- **Custom Components**: Расширяемый UI

---

## 2. Frontend технологии

### 2.1. Core библиотеки

#### React 19.1.0

```json
{
  "dependencies": {
    "react": "19.1.0",
    "react-dom": "19.1.0"
  }
}
```

**Назначение:**
- UI библиотека для создания интерфейсов
- Component-based архитектура
- Virtual DOM для производительности
- Declarative programming model

**Новое в React 19:**

**1. React Compiler (автоматическая мемоизация):**
```typescript
// Раньше: ручная мемоизация
const MemoComponent = memo(({ data }) => {
  const processed = useMemo(() => processData(data), [data])
  return <div>{processed}</div>
})

// React 19: автоматическая оптимизация
function Component({ data }) {
  const processed = processData(data) // Компилятор сам оптимизирует
  return <div>{processed}</div>
}
```

**2. Actions (замена useTransition):**
```typescript
// Раньше
const [isPending, startTransition] = useTransition()
const handleSubmit = () => {
  startTransition(async () => {
    await submitForm()
  })
}

// React 19: useActionState
function Component() {
  const [state, formAction] = useActionState(submitForm)
  return <form action={formAction}>...</form>
}
```

**3. use() Hook:**
```typescript
import { use } from 'react'

function Component({ dataPromise }) {
  const data = use(dataPromise) // Await в компоненте
  return <div>{data.title}</div>
}
```

**4. Metadata Support:**
```typescript
function Page() {
  return (
    <>
      <title>Page Title</title>
      <meta name="description" content="..." />
      <div>Content</div>
    </>
  )
}
```

**5. ref as prop:**
```typescript
// Раньше: forwardRef
const Input = forwardRef((props, ref) => <input ref={ref} />)

// React 19: просто prop
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />
}
```

**Использование в проекте:**
```typescript
// Server Component
export default async function SearchPage() {
  const results = await fetchSearchResults()
  return <SearchResults data={results} />
}

// Client Component
'use client'
import { useState } from 'react'

export function SearchInput() {
  const [query, setQuery] = useState('')
  return <input value={query} onChange={(e) => setQuery(e.target.value)} />
}
```

### 2.2. UI компоненты

#### Radix UI

```json
{
  "dependencies": {
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-slot": "^1.2.3"
  }
}
```

**Назначение:**
- Unstyled, accessible UI primitives
- WAI-ARIA совместимость
- Keyboard navigation
- Focus management
- Composable components

**Примеры использования:**

**1. Checkbox:**
```typescript
import * as Checkbox from '@radix-ui/react-checkbox'
import { CheckIcon } from 'lucide-react'

export function CheckboxDemo() {
  return (
    <Checkbox.Root className="checkbox">
      <Checkbox.Indicator>
        <CheckIcon />
      </Checkbox.Indicator>
    </Checkbox.Root>
  )
}
```

**2. Select:**
```typescript
import * as Select from '@radix-ui/react-select'

export function SelectDemo() {
  return (
    <Select.Root>
      <Select.Trigger>
        <Select.Value placeholder="Select..." />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content>
          <Select.Item value="option1">Option 1</Select.Item>
          <Select.Item value="option2">Option 2</Select.Item>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}
```

**Преимущества Radix UI:**
- **Accessibility-First**: WCAG 2.1 Level AA
- **Unstyled**: Полный контроль над стилями
- **Composable**: Гибкая композиция компонентов
- **TypeScript**: Полная типизация
- **SSR-Safe**: Работает с Server Components
- **Animation-Ready**: Поддержка анимаций через data-attributes

#### shadcn/ui (паттерн, не библиотека)

**Назначение:**
- Copy-paste компоненты на базе Radix UI
- Customizable и модифицируемые
- Интеграция с Tailwind CSS

**Структура:**
```
src/components/ui/
├── button.tsx
├── input.tsx
├── select.tsx
├── checkbox.tsx
└── ...
```

**Пример компонента:**
```typescript
// src/components/ui/button.tsx
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input",
        ghost: "hover:bg-accent"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
```

**Использование:**
```typescript
import { Button } from '@/components/ui/button'

<Button variant="outline" size="lg">Click me</Button>
```

### 2.3. Стилизация

#### TailwindCSS 3.4.18

```json
{
  "devDependencies": {
    "tailwindcss": "^3.4.18",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.6",
    "@tailwindcss/typography": "^0.5.19"
  }
}
```

**Назначение:**
- Utility-first CSS framework
- Быстрая разработка UI
- Design tokens из коробки
- JIT компилятор
- Responsive design

**Конфигурация (tailwind.config.ts):**
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate')
  ]
}
```

**Примеры использования:**
```typescript
// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Dark mode
<div className="bg-white dark:bg-slate-900">

// Hover effects
<button className="hover:bg-blue-600 transition-colors">

// Custom animations
<div className="animate-accordion-down">
```

#### Утилиты для стилей

**class-variance-authority (^0.7.1):**
```typescript
import { cva } from 'class-variance-authority'

const button = cva('button', {
  variants: {
    intent: {
      primary: 'bg-blue-500',
      secondary: 'bg-gray-500'
    },
    size: {
      sm: 'text-sm',
      md: 'text-base'
    }
  }
})

button({ intent: 'primary', size: 'md' })
// => "button bg-blue-500 text-base"
```

**clsx (^2.1.1):**
```typescript
import clsx from 'clsx'

const classes = clsx(
  'base-class',
  condition && 'conditional-class',
  { 'object-class': true }
)
```

**tailwind-merge (^2.6.0):**
```typescript
import { cn } from '@/lib/utils'

// Объединение и дедупликация классов
cn('px-2 py-1', 'px-4') // => "py-1 px-4"
```

**tailwindcss-animate (^1.0.7):**
```json
{
  "devDependencies": {
    "tailwindcss-animate": "^1.0.7"
  }
}
```

Добавляет готовые анимации:
```html
<div class="animate-spin">Loading...</div>
<div class="animate-pulse">Skeleton</div>
<div class="animate-bounce">Attention</div>
```

### 2.4. Иконки и графика

#### Lucide React (^0.378.0)

```json
{
  "dependencies": {
    "lucide-react": "^0.378.0"
  }
}
```

**Назначение:**
- Beautiful & consistent icon pack
- Tree-shakeable
- Customizable
- React-specific оптимизация

**Использование:**
```typescript
import {
  Search,
  Settings,
  User,
  ChevronRight,
  Check,
  X
} from 'lucide-react'

export function SearchButton() {
  return (
    <button>
      <Search className="w-4 h-4 mr-2" />
      Search
    </button>
  )
}

// Кастомизация
<Settings
  size={24}
  color="blue"
  strokeWidth={2}
  className="rotate-45"
/>
```

**Доступные иконки (1000+):**
- UI элементы: Menu, X, ChevronDown, ArrowRight
- Actions: Edit, Trash, Save, Download
- Media: Play, Pause, Volume, Camera
- Files: File, Folder, FileText, Image
- Social: Github, Twitter, Linkedin
- И многие другие...

**Преимущества:**
- **Tree-shaking**: Только используемые иконки попадают в bundle
- **TypeScript**: Полная типизация props
- **Accessibility**: Правильные ARIA attributes
- **Performance**: Оптимизированные SVG
- **Consistency**: Единый стиль всех иконок

---

## 3. Database и хранение данных

### 3.1. PostgreSQL

**Версия:** PostgreSQL 15+

**Назначение:**
- Primary database для всех данных
- ACID транзакции
- Relational data model
- Row-Level Security (RLS)
- Full-text search
- JSONB для гибких структур

**Adapter:** @payloadcms/db-postgres (3.62.0)

**Конфигурация подключения:**
```typescript
import { postgresAdapter } from '@payloadcms/db-postgres'

export default buildConfig({
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
      max: 20,              // Максимум соединений в пуле
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000
    },
    push: false,            // Не auto-migrate в production
    migrationDir: './migrations'
  })
})
```

**Основные коллекции (таблицы):**
```sql
-- Tenants
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  domain TEXT UNIQUE NOT NULL,
  plan_id UUID REFERENCES plans(id),
  settings JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL,
  profile JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Memberships (multi-tenant user association)
CREATE TABLE memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  user_id UUID REFERENCES users(id),
  role TEXT NOT NULL,
  permissions JSONB,
  invited_at TIMESTAMP,
  accepted_at TIMESTAMP,
  UNIQUE(tenant_id, user_id)
);

-- API Keys
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  label TEXT,
  key_hash TEXT UNIQUE NOT NULL,
  scoped_search_key TEXT,
  scopes JSONB,
  expires_at TIMESTAMP,
  last_used_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  plan_id UUID REFERENCES plans(id),
  status TEXT NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  canceled_at TIMESTAMP
);

-- Usage Counters
CREATE TABLE usage_counters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  period TEXT NOT NULL,
  counters JSONB NOT NULL,
  limits JSONB,
  overage JSONB,
  UNIQUE(tenant_id, period)
);
```

**Индексы для производительности:**
```sql
-- Tenants
CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_domain ON tenants(domain);

-- Users
CREATE INDEX idx_users_email ON users(email);

-- Memberships
CREATE INDEX idx_memberships_tenant ON memberships(tenant_id);
CREATE INDEX idx_memberships_user ON memberships(user_id);
CREATE INDEX idx_memberships_tenant_user ON memberships(tenant_id, user_id);

-- API Keys
CREATE INDEX idx_api_keys_tenant ON api_keys(tenant_id);
CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_active ON api_keys(tenant_id, is_active)
  WHERE is_active = TRUE;

-- GIN indexes для JSONB
CREATE INDEX idx_tenants_settings ON tenants USING GIN(settings);
CREATE INDEX idx_api_keys_scopes ON api_keys USING GIN(scopes);
```

**Row-Level Security (RLS):**
```sql
-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Policy для tenant isolation
CREATE POLICY tenant_isolation_select ON api_keys
  FOR SELECT
  TO authenticated
  USING (tenant_id = current_setting('app.current_tenant')::uuid);

CREATE POLICY tenant_isolation_insert ON api_keys
  FOR INSERT
  TO authenticated
  WITH CHECK (tenant_id = current_setting('app.current_tenant')::uuid);
```

**Типы данных:**
- `UUID`: Первичные ключи и relationships
- `TEXT`: Строки переменной длины
- `JSONB`: Гибкие структуры данных
- `TIMESTAMP`: Даты и время
- `BOOLEAN`: Флаги

**Расширения:**
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- UUID generation
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- Trigram search
CREATE EXTENSION IF NOT EXISTS "btree_gin";      -- GIN indexes for btree types
```

### 3.2. Redis

**Версия:** Redis 7+

**Библиотека:** redis (^5.9.0)

```json
{
  "dependencies": {
    "redis": "^5.9.0"
  }
}
```

**Назначение:**
- In-memory cache для search results
- Session storage
- Rate limiting counters
- Job queues
- Pub/Sub для real-time events

**Конфигурация клиента:**
```typescript
// src/lib/cache.ts
import { createClient, RedisClientType } from 'redis'

export class RedisCache {
  private client: RedisClientType | null = null

  async connect(): Promise<void> {
    this.client = createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379')
      },
      password: process.env.REDIS_PASSWORD || undefined,
      database: parseInt(process.env.REDIS_DB || '0')
    }) as RedisClientType

    this.client.on('error', (err) => console.error('Redis error:', err))
    this.client.on('connect', () => console.log('✓ Redis connected'))

    await this.client.connect()
  }
}
```

**Использование в проекте:**

**1. Cache для search results:**
```typescript
async function getCachedSearchResults(
  query: string,
  collection: string,
  tenantId: string
): Promise<SearchResults | null> {
  const cache = getCache()
  const key = `search:${tenantId}:${collection}:${query}`
  return await cache.get<SearchResults>(key)
}

async function cacheSearchResult(
  query: string,
  collection: string,
  tenantId: string,
  result: SearchResults
): Promise<void> {
  const cache = getCache()
  const key = `search:${tenantId}:${collection}:${query}`
  await cache.set(key, result, 300) // TTL: 5 минут
}
```

**2. Rate Limiting:**
```typescript
async function checkRateLimit(
  apiKeyId: string,
  limit: number,
  window: number
): Promise<{allowed: boolean; remaining: number}> {
  const key = `ratelimit:apikey:${apiKeyId}`
  const now = Date.now()
  const windowStart = now - window

  // Remove old entries
  await redis.zremrangebyscore(key, 0, windowStart)

  // Count requests in window
  const count = await redis.zcount(key, windowStart, now)

  if (count >= limit) {
    return {allowed: false, remaining: 0}
  }

  // Add current request
  await redis.zadd(key, now, `${now}-${crypto.randomBytes(8).toString('hex')}`)
  await redis.expire(key, Math.ceil(window / 1000))

  return {allowed: true, remaining: limit - count - 1}
}
```

**3. Session Storage:**
```typescript
interface Session {
  userId: string
  tenantId: string
  expiresAt: number
}

async function saveSession(
  sessionId: string,
  session: Session
): Promise<void> {
  const key = `session:${sessionId}`
  const ttl = Math.floor((session.expiresAt - Date.now()) / 1000)
  await redis.setex(key, ttl, JSON.stringify(session))
}

async function getSession(sessionId: string): Promise<Session | null> {
  const key = `session:${sessionId}`
  const data = await redis.get(key)
  return data ? JSON.parse(data) : null
}
```

**4. Analytics Counters:**
```typescript
async function trackSearchEvent(tenantId: string): Promise<void> {
  const dailyKey = `stats:${tenantId}:daily`
  await redis.hincrby(dailyKey, 'totalSearches', 1)
  await redis.expire(dailyKey, 86400) // 24 hours
}
```

**Возможности Redis 7:**
- **Redis Functions**: Serverless функции в Redis
- **Sharded Pub/Sub**: Масштабируемые pub/sub каналы
- **ACL**: Расширенный контроль доступа
- **Redis Stack**: Встроенные модули (JSON, Search, TimeSeries)
- **Cluster Mode**: Автоматический sharding

**Стратегии кэширования:**
- **Cache-Aside**: Приложение управляет кэшем
- **Write-Through**: Обновление кэша при записи
- **TTL-Based**: Автоматическое истечение по времени
- **Tag-Based Invalidation**: Инвалидация по тегам

### 3.3. Search Engine (Typesense)

**Версия:** 2.1.0 (клиент), 26+ (сервер)

**Библиотека:** typesense (^2.1.0)

```json
{
  "dependencies": {
    "typesense": "^2.1.0"
  }
}
```

**Назначение:**
- Высокопроизводительный поисковый движок
- Typo tolerance
- Faceted search
- Geo search
- Vector search
- Real-time indexing

**Конфигурация клиента:**
```typescript
// src/typesense/client.ts
import Typesense from 'typesense'

export const typesense = new Typesense.Client({
  nodes: [{
    host: process.env.TYPESENSE_HOST || 'localhost',
    port: Number(process.env.TYPESENSE_PORT ?? 8108),
    protocol: process.env.TYPESENSE_PROTOCOL ?? 'http'
  }],
  apiKey: process.env.TYPESENSE_ADMIN_API_KEY!,
  connectionTimeoutSeconds: 5
})
```

**Создание коллекции:**
```typescript
interface ProductSchema {
  name: string
  fields: Array<{
    name: string
    type: 'string' | 'int32' | 'float' | 'bool' | 'string[]' | 'float[]' | 'geopoint'
    facet?: boolean
    index?: boolean
    optional?: boolean
    sort?: boolean
    infix?: boolean
    stem?: boolean
  }>
  default_sorting_field?: string
  token_separators?: string[]
  symbols_to_index?: string[]
}

const schema: ProductSchema = {
  name: 'products',
  fields: [
    {name: 'title', type: 'string', index: true, infix: true, stem: true},
    {name: 'description', type: 'string', index: true, stem: true},
    {name: 'sku', type: 'string', index: true, facet: true},
    {name: 'price', type: 'float', facet: true, sort: true},
    {name: 'category', type: 'string[]', facet: true},
    {name: 'brand', type: 'string', facet: true},
    {name: 'stock', type: 'int32', sort: true},
    {name: 'rating', type: 'float', sort: true},
    {name: 'location', type: 'geopoint'},
    {
      name: 'embedding',
      type: 'float[]',
      num_dim: 384  // Размерность вектора
    }
  ],
  default_sorting_field: 'popularity',
  token_separators: ['-', '_'],
  symbols_to_index: ['#', '@']
}

await typesense.collections().create(schema)
```

**Индексация документа:**
```typescript
const document = {
  id: '123',
  title: 'MacBook Pro 16"',
  description: 'Powerful laptop for professionals',
  sku: 'MBP16-001',
  price: 2499.99,
  category: ['Electronics', 'Computers', 'Laptops'],
  brand: 'Apple',
  stock: 15,
  rating: 4.8,
  location: [37.7749, -122.4194], // San Francisco
  embedding: [...] // 384-dim vector
}

await typesense.collections('products')
  .documents()
  .create(document)
```

**Поиск:**
```typescript
interface SearchParams {
  q: string                 // Query
  query_by: string         // Поля для поиска
  filter_by?: string       // Фильтры
  sort_by?: string         // Сортировка
  facet_by?: string        // Фасеты
  per_page?: number        // Результатов на странице
  page?: number            // Номер страницы
  prefix?: boolean         // Prefix search
  num_typos?: number       // Typo tolerance
  min_len_1typo?: number   // Мин длина для 1 опечатки
  min_len_2typo?: number   // Мин длина для 2 опечаток
  split_join_tokens?: 'off' | 'fallback' | 'always'
  infix?: 'off' | 'always' | 'fallback'
}

const results = await typesense.collections('products')
  .documents()
  .search({
    q: 'macbook',
    query_by: 'title,description',
    filter_by: 'price:[1000..3000] && stock:>0',
    sort_by: 'rating:desc,price:asc',
    facet_by: 'category,brand',
    per_page: 20,
    page: 1,
    num_typos: 2,
    prefix: true,
    infix: 'fallback'
  })
```

**Vector Search (семантический поиск):**
```typescript
const vectorResults = await typesense.collections('products')
  .documents()
  .search({
    q: '*', // Пустой query для vector search
    vector_query: `embedding:([], k:10)`, // Top 10 ближайших векторов
    filter_by: 'category:=Electronics',
    exclude_fields: 'embedding' // Не возвращать векторы в результатах
  })
```

**Geo Search:**
```typescript
const geoResults = await typesense.collections('products')
  .documents()
  .search({
    q: 'laptop',
    query_by: 'title',
    filter_by: 'location:(37.7749, -122.4194, 10 km)', // 10km radius
    sort_by: 'location(37.7749, -122.4194):asc' // Sort by distance
  })
```

**Faceted Search:**
```typescript
const facetedResults = await typesense.collections('products')
  .documents()
  .search({
    q: 'laptop',
    query_by: 'title,description',
    facet_by: 'category,brand,price',
    max_facet_values: 20
  })

// Response includes facet counts:
// {
//   "facet_counts": [
//     {
//       "field_name": "brand",
//       "counts": [
//         {"value": "Apple", "count": 45},
//         {"value": "Dell", "count": 32},
//         ...
//       ]
//     }
//   ]
// }
```

**Возможности Typesense:**
- **Typo Tolerance**: Автоматическая коррекция опечаток
- **Synonyms**: Поддержка синонимов
- **Stopwords**: Игнорирование стоп-слов
- **Stemming**: Морфологический анализ
- **Highlighting**: Подсветка совпадений
- **Grouping**: Группировка результатов
- **Curation**: Ручное управление топом результатов
- **Analytics**: Автоматический сбор популярных запросов

---

## 4. Платежи и биллинг

### 4.1. Stripe

**Версия:** 19.2.0

```json
{
  "dependencies": {
    "stripe": "^19.2.0"
  }
}
```

**Назначение:**
- Обработка платежей
- Управление подписками
- Биллинг и инвойсы
- Webhook события
- Usage-based billing

**Инициализация:**
```typescript
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
  appInfo: {
    name: 'AACSearch Platform',
    version: '1.0.0'
  }
})
```

**Использование:**

**1. Создание Checkout Session:**
```typescript
async function createCheckoutSession(
  tenantId: string,
  priceId: string
): Promise<Stripe.Checkout.Session> {
  return await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{
      price: priceId,
      quantity: 1
    }],
    success_url: `${process.env.NEXT_PUBLIC_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/billing`,
    metadata: {
      tenant_id: tenantId
    }
  })
}
```

**2. Customer Portal:**
```typescript
async function createPortalSession(
  customerId: string
): Promise<Stripe.BillingPortal.Session> {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_URL}/billing`
  })
}
```

**3. Webhook Handling:**
```typescript
export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return Response.json({error: 'Webhook signature verification failed'}, {status: 400})
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session
      await activateSubscription(session)
      break

    case 'invoice.payment_succeeded':
      const invoice = event.data.object as Stripe.Invoice
      await recordPayment(invoice)
      break

    case 'customer.subscription.updated':
      const subscription = event.data.object as Stripe.Subscription
      await updateSubscription(subscription)
      break

    case 'customer.subscription.deleted':
      const canceledSub = event.data.object as Stripe.Subscription
      await cancelSubscription(canceledSub)
      break
  }

  return Response.json({received: true})
}
```

**4. Usage-Based Billing (Metered):**
```typescript
// Report usage to Stripe
async function reportUsage(
  subscriptionItemId: string,
  quantity: number
): Promise<void> {
  await stripe.subscriptionItems.createUsageRecord(
    subscriptionItemId,
    {
      quantity,
      timestamp: Math.floor(Date.now() / 1000),
      action: 'increment'
    }
  )
}

// Or using Billing Meters (новое API)
await stripe.billing.meterEvents.create({
  event_name: 'search_count',
  payload: {
    stripe_customer_id: customerId,
    value: String(searchCount)
  },
  timestamp: Math.floor(Date.now() / 1000)
})
```

**5. Создание продуктов и цен:**
```typescript
// Create Product
const product = await stripe.products.create({
  name: 'Pro Plan',
  description: 'Professional search platform',
  metadata: {
    plan_slug: 'pro'
  }
})

// Create Price (recurring)
const price = await stripe.prices.create({
  product: product.id,
  unit_amount: 9900, // $99.00
  currency: 'usd',
  recurring: {
    interval: 'month'
  }
})

// Create Metered Price
const meteredPrice = await stripe.prices.create({
  product: product.id,
  currency: 'usd',
  recurring: {
    interval: 'month',
    usage_type: 'metered'
  },
  billing_scheme: 'per_unit',
  unit_amount: 1, // $0.01 per search
  metadata: {
    event_type: 'search'
  }
})
```

**Возможности Stripe 19:**
- **TypeScript Support**: Полная типизация API
- **Webhook Signing**: Верификация webhook событий
- **Idempotency**: Автоматическая защита от дублирования запросов
- **Retry Logic**: Встроенная логика повторных попыток
- **Tax Calculation**: Автоматический расчет налогов
- **Payment Methods**: Поддержка карт, ACH, SEPA, и др.
- **3D Secure**: Встроенная поддержка SCA
- **Fraud Prevention**: Radar для защиты от мошенничества

---

## 5. Формы и валидация

### 5.1. React Hook Form

**Версия:** 7.45.4

```json
{
  "dependencies": {
    "react-hook-form": "7.45.4"
  }
}
```

**Назначение:**
- Управление состоянием форм
- Валидация форм
- Performance optimization (uncontrolled components)
- TypeScript integration

**Использование:**
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

// Схема валидации
const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
})

type FormData = z.infer<typeof formSchema>

export function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  })

  const onSubmit = async (data: FormData) => {
    await createUser(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('email')}
        type="email"
        placeholder="Email"
      />
      {errors.email && <p>{errors.email.message}</p>}

      <input
        {...register('password')}
        type="password"
        placeholder="Password"
      />
      {errors.password && <p>{errors.password.message}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing up...' : 'Sign up'}
      </button>
    </form>
  )
}
```

**Продвинутые возможности:**

**1. Field Arrays:**
```typescript
import { useFieldArray } from 'react-hook-form'

function DynamicForm() {
  const { control, register } = useForm()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  })

  return (
    <>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input {...register(`items.${index}.name`)} />
          <button onClick={() => remove(index)}>Remove</button>
        </div>
      ))}
      <button onClick={() => append({ name: '' })}>Add Item</button>
    </>
  )
}
```

**2. Watch (реактивные значения):**
```typescript
const watchedValue = watch('fieldName')

useEffect(() => {
  console.log('Field changed:', watchedValue)
}, [watchedValue])
```

**3. Controller (для custom компонентов):**
```typescript
import { Controller } from 'react-hook-form'

<Controller
  name="customField"
  control={control}
  render={({ field }) => (
    <CustomInput
      value={field.value}
      onChange={field.onChange}
    />
  )}
/>
```

### 5.2. Zod

**Версия:** 4.1.12

```json
{
  "dependencies": {
    "zod": "^4.1.12"
  }
}
```

**Назначение:**
- TypeScript-first schema validation
- Runtime type checking
- Type inference
- Error messages
- Data transformation

**Примеры схем:**

**1. Базовая валидация:**
```typescript
import { z } from 'zod'

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  age: z.number().int().positive().max(120),
  role: z.enum(['admin', 'user', 'guest']),
  isActive: z.boolean().default(true)
})

type User = z.infer<typeof userSchema>

// Валидация
const result = userSchema.safeParse(data)
if (!result.success) {
  console.error(result.error.issues)
} else {
  console.log(result.data) // Type-safe!
}
```

**2. Сложные схемы:**
```typescript
const apiKeySchema = z.object({
  label: z.string(),
  scopes: z.array(z.enum([
    'search',
    'documents:read',
    'documents:write',
    'analytics:read'
  ])),
  expiresAt: z.date().optional(),
  rateLimit: z.object({
    requests: z.number().int().positive(),
    period: z.enum(['minute', 'hour', 'day'])
  }).optional()
})
```

**3. Трансформация данных:**
```typescript
const searchParamsSchema = z.object({
  q: z.string(),
  page: z.string().transform(val => parseInt(val, 10)).pipe(z.number().int().positive()),
  limit: z.string().transform(val => parseInt(val, 10)).pipe(z.number().int().min(1).max(100))
})

const params = searchParamsSchema.parse({
  q: 'laptop',
  page: '2',
  limit: '20'
})
// params.page is number, not string!
```

**4. Refinements (кастомная валидация):**
```typescript
const passwordSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
}).refine((data) => {
  // Password strength check
  const hasUppercase = /[A-Z]/.test(data.password)
  const hasLowercase = /[a-z]/.test(data.password)
  const hasNumber = /[0-9]/.test(data.password)
  return hasUppercase && hasLowercase && hasNumber
}, {
  message: 'Password must contain uppercase, lowercase, and number',
  path: ['password']
})
```

**5. Discriminated Unions:**
```typescript
const eventSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('search'),
    query: z.string(),
    filters: z.record(z.unknown())
  }),
  z.object({
    type: z.literal('index'),
    documentId: z.string(),
    data: z.record(z.unknown())
  }),
  z.object({
    type: z.literal('delete'),
    documentId: z.string()
  })
])

type Event = z.infer<typeof eventSchema>
```

**Возможности Zod 4:**
- **TypeScript 5.7 Support**: Полная совместимость
- **Better Error Messages**: Улучшенные сообщения об ошибках
- **Coercion**: Автоматическое преобразование типов
- **Brand Types**: Номинальные типы для compile-time безопасности
- **Async Validation**: Поддержка асинхронной валидации
- **JSON Schema**: Генерация JSON Schema из Zod схем

---

## 6. Визуализация и графики

### 6.1. Recharts

**Версия:** 3.3.0

```json
{
  "dependencies": {
    "recharts": "^3.3.0"
  },
  "devDependencies": {
    "@types/recharts": "^2.0.1"
  }
}
```

**Назначение:**
- Composable charting library для React
- D3-based rendering
- Responsive charts
- Declarative API
- TypeScript support

**Примеры графиков:**

**1. Line Chart (поисковые запросы по времени):**
```typescript
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

interface SearchData {
  date: string
  searches: number
  uniqueQueries: number
}

export function SearchTrendsChart({ data }: { data: SearchData[] }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="searches"
          stroke="#8884d8"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="uniqueQueries"
          stroke="#82ca9d"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
```

**2. Bar Chart (популярные запросы):**
```typescript
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

interface QueryData {
  query: string
  count: number
}

export function TopQueriesChart({ data }: { data: QueryData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="query" angle={-45} textAnchor="end" height={100} />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )
}
```

**3. Pie Chart (распределение по категориям):**
```typescript
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

interface CategoryData {
  name: string
  value: number
}

export function CategoryDistributionChart({ data }: { data: CategoryData[] }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
```

**4. Area Chart (usage over time):**
```typescript
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

interface UsageData {
  date: string
  searches: number
  documents: number
  apiCalls: number
}

export function UsageChart({ data }: { data: UsageData[] }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="searches"
          stackId="1"
          stroke="#8884d8"
          fill="#8884d8"
        />
        <Area
          type="monotone"
          dataKey="documents"
          stackId="1"
          stroke="#82ca9d"
          fill="#82ca9d"
        />
        <Area
          type="monotone"
          dataKey="apiCalls"
          stackId="1"
          stroke="#ffc658"
          fill="#ffc658"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
```

**5. Composed Chart (комбинированный):**
```typescript
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'

interface PerformanceData {
  date: string
  searches: number
  avgLatency: number
}

export function PerformanceChart({ data }: { data: PerformanceData[] }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey="searches" fill="#8884d8" />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="avgLatency"
          stroke="#ff7300"
          strokeWidth={2}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
```

**Возможности Recharts:**
- **Responsive**: Адаптивные графики
- **Animations**: Плавные анимации
- **Customizable**: Полная кастомизация
- **Composable**: Компонуемая архитектура
- **TypeScript**: Полная типизация
- **Accessibility**: Screen reader support

---

## 7. Build tools и инфраструктура

### 7.1. Package Manager

#### pnpm

**Версия:** 9+ или 10+

```json
{
  "engines": {
    "pnpm": "^9 || ^10"
  }
}
```

**Назначение:**
- Fast, disk space efficient package manager
- Strict dependency resolution
- Monorepo support
- Better security

**Конфигурация (.npmrc):**
```ini
# Use pnpm
engine-strict=true

# Hoisting settings
shamefully-hoist=false
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=*prettier*

# Registry
registry=https://registry.npmjs.org/

# Auth (для private packages)
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```

**package.json pnpm config:**
```json
{
  "pnpm": {
    "onlyBuiltDependencies": [
      "sharp",
      "esbuild",
      "unrs-resolver"
    ]
  }
}
```

**Преимущества pnpm:**
- **Скорость**: До 2x быстрее npm/yarn
- **Disk Space**: Shared storage для всех проектов
- **Strict**: Строгое разрешение зависимостей
- **Monorepo**: Нативная поддержка workspaces
- **Security**: Автоматическая проверка integrity

**Основные команды:**
```bash
# Install dependencies
pnpm install

# Add package
pnpm add react@19

# Add dev dependency
pnpm add -D typescript

# Run script
pnpm run build

# Update all dependencies
pnpm update

# Why is this package installed?
pnpm why typescript

# Prune unused packages
pnpm prune
```

### 7.2. TypeScript

**Версия:** 5.7.3

**Конфигурация уже описана выше в разделе 1.1**

**Дополнительные возможности:**

**Path Mapping:**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@payload-config": ["./src/payload.config.ts"],
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"]
    }
  }
}
```

**Использование:**
```typescript
// Вместо: import { Button } from '../../../components/ui/button'
import { Button } from '@/components/ui/button'

// Вместо: import config from '../../payload.config'
import config from '@payload-config'
```

**Project References (для monorepo):**
```json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "declarationMap": true
  },
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/ui" }
  ]
}
```

### 7.3. Компиляция и сборка

#### cross-env (^7.0.3)

```json
{
  "dependencies": {
    "cross-env": "^7.0.3"
  }
}
```

**Назначение:**
- Cross-platform environment variables
- Windows/Unix совместимость

**Использование в scripts:**
```json
{
  "scripts": {
    "dev": "cross-env NODE_OPTIONS=--no-deprecation next dev",
    "build": "cross-env NODE_OPTIONS=--no-deprecation next build",
    "test": "cross-env NODE_ENV=test vitest run"
  }
}
```

#### dotenv (16.4.7)

```json
{
  "dependencies": {
    "dotenv": "16.4.7"
  }
}
```

**Назначение:**
- Load environment variables from .env file
- Configuration management

**Использование:**
```typescript
import 'dotenv/config'

const dbUrl = process.env.DATABASE_URI
const stripeKey = process.env.STRIPE_SECRET_KEY
```

**.env structure:**
```env
# Database
DATABASE_URI=postgresql://user:pass@localhost:5432/aacsearch
POSTGRES_MAX_CONNECTIONS=20

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=secret
REDIS_DB=0

# Typesense
TYPESENSE_HOST=localhost
TYPESENSE_PORT=8108
TYPESENSE_PROTOCOL=http
TYPESENSE_ADMIN_API_KEY=xyz

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Next.js
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

#### Sharp (0.34.2)

```json
{
  "dependencies": {
    "sharp": "0.34.2"
  }
}
```

**Назначение:**
- High-performance image processing
- Resize, crop, optimize images
- Used by Next.js Image Optimization

**Возможности:**
- **Fast**: libvips-based, до 10x быстрее ImageMagick
- **Format Conversion**: JPEG, PNG, WebP, AVIF, TIFF, GIF, SVG
- **Resize**: Smart cropping, letterboxing
- **Optimize**: Compression, quality adjustment
- **Metadata**: EXIF, XMP, IPTC
- **Compositing**: Overlays, watermarks

---

## 8. Testing

### 8.1. Unit Testing

#### Vitest (3.2.3)

```json
{
  "devDependencies": {
    "vitest": "3.2.3",
    "@vitejs/plugin-react": "4.5.2",
    "vite-tsconfig-paths": "5.1.4",
    "jsdom": "26.1.0"
  }
}
```

**Назначение:**
- Vite-powered unit test framework
- Jest-compatible API
- Fast execution
- TypeScript support

**Конфигурация (vitest.config.mts):**
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData'
      ]
    }
  }
})
```

**Пример теста:**
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('handles click events', async () => {
    let clicked = false
    render(<Button onClick={() => { clicked = true }}>Click</Button>)

    await userEvent.click(screen.getByText('Click'))
    expect(clicked).toBe(true)
  })

  it('applies variant classes', () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByText('Delete')
    expect(button).toHaveClass('bg-destructive')
  })
})
```

**API testing:**
```typescript
import { describe, it, expect } from 'vitest'
import { POST } from '@/app/api/search/route'

describe('Search API', () => {
  it('returns search results', async () => {
    const request = new Request('http://localhost/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'test-key'
      },
      body: JSON.stringify({
        q: 'laptop',
        collection: 'products'
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('results')
    expect(Array.isArray(data.results)).toBe(true)
  })
})
```

**Scripts:**
```json
{
  "scripts": {
    "test": "pnpm run test:int && pnpm run test:e2e",
    "test:int": "cross-env NODE_OPTIONS=--no-deprecation vitest run --config ./vitest.config.mts",
    "test:watch": "vitest watch",
    "test:coverage": "vitest run --coverage"
  }
}
```

### 8.2. E2E Testing

#### Playwright (1.54.1)

```json
{
  "devDependencies": {
    "@playwright/test": "1.54.1",
    "playwright": "1.54.1",
    "playwright-core": "1.54.1"
  }
}
```

**Назначение:**
- End-to-end testing
- Browser automation
- Cross-browser testing
- Screenshot/video recording

**Конфигурация (playwright.config.ts):**
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
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    }
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI
  }
})
```

**Пример E2E теста:**
```typescript
import { test, expect } from '@playwright/test'

test.describe('Search Flow', () => {
  test('user can perform search', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/')

    // Enter search query
    await page.fill('[data-testid="search-input"]', 'laptop')

    // Click search button
    await page.click('[data-testid="search-button"]')

    // Wait for results
    await page.waitForSelector('[data-testid="search-results"]')

    // Verify results are displayed
    const results = await page.locator('[data-testid="search-result"]')
    await expect(results).toHaveCount.greaterThan(0)

    // Verify first result contains query
    const firstResult = results.first()
    await expect(firstResult).toContainText('laptop', { ignoreCase: true })
  })

  test('user can filter results', async ({ page }) => {
    await page.goto('/search?q=laptop')

    // Apply price filter
    await page.click('[data-testid="filter-price"]')
    await page.fill('[data-testid="price-min"]', '1000')
    await page.fill('[data-testid="price-max"]', '2000')
    await page.click('[data-testid="apply-filters"]')

    // Verify URL updated
    await expect(page).toHaveURL(/price=1000-2000/)

    // Verify filtered results
    const prices = await page.locator('[data-testid="product-price"]').allTextContents()
    prices.forEach(price => {
      const value = parseFloat(price.replace(/[^0-9.]/g, ''))
      expect(value).toBeGreaterThanOrEqual(1000)
      expect(value).toBeLessThanOrEqual(2000)
    })
  })
})
```

**Scripts:**
```json
{
  "scripts": {
    "test:e2e": "cross-env NODE_OPTIONS=\"--no-deprecation --no-experimental-strip-types\" pnpm exec playwright test --config=playwright.config.ts",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

### 8.3. Component Testing

#### React Testing Library (16.3.0)

```json
{
  "devDependencies": {
    "@testing-library/react": "16.3.0"
  }
}
```

**Назначение:**
- Testing React components
- User-centric testing
- Accessibility-focused
- Works with Vitest

**Пример:**
```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchInput } from '@/components/SearchInput'

describe('SearchInput', () => {
  it('calls onSearch when user submits', async () => {
    const onSearch = vi.fn()
    render(<SearchInput onSearch={onSearch} />)

    const user = userEvent.setup()
    const input = screen.getByRole('textbox')

    await user.type(input, 'laptop')
    await user.click(screen.getByRole('button', { name: /search/i }))

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith('laptop')
    })
  })

  it('shows suggestions on input', async () => {
    render(<SearchInput />)

    const user = userEvent.setup()
    await user.type(screen.getByRole('textbox'), 'lap')

    await waitFor(() => {
      expect(screen.getByText('laptop')).toBeInTheDocument()
      expect(screen.getByText('laptop bag')).toBeInTheDocument()
    })
  })
})
```

---

## 9. DevOps и deployment

### 9.1. Контейнеризация

#### Docker

**Dockerfile для production:**
```dockerfile
# Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build application
RUN pnpm build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "server.js"]
```

**docker-compose.yml для development:**
```yaml
version: '3.9'

services:
  app:
    build:
      context: .
      target: builder
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    environment:
      - DATABASE_URI=postgresql://postgres:postgres@postgres:5432/aacsearch
      - REDIS_HOST=redis
      - TYPESENSE_HOST=typesense
    depends_on:
      - postgres
      - redis
      - typesense
    command: pnpm dev

  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: aacsearch
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

  typesense:
    image: typesense/typesense:26.0
    ports:
      - "8108:8108"
    environment:
      TYPESENSE_API_KEY: xyz
      TYPESENSE_DATA_DIR: /data
    volumes:
      - typesense_data:/data
    command: --data-dir /data --api-key=xyz --enable-cors

volumes:
  postgres_data:
  redis_data:
  typesense_data:
```

### 9.2. Orchestration

#### Kubernetes

**Deployment manifest:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aacsearch-app
  labels:
    app: aacsearch
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: aacsearch
  template:
    metadata:
      labels:
        app: aacsearch
    spec:
      containers:
      - name: app
        image: aacsearch/platform:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URI
          valueFrom:
            secretKeyRef:
              name: aacsearch-secrets
              key: database-uri
        - name: REDIS_HOST
          value: redis-service
        - name: TYPESENSE_HOST
          value: typesense-service
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: aacsearch-service
spec:
  type: LoadBalancer
  selector:
    app: aacsearch
  ports:
  - port: 80
    targetPort: 3000
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: aacsearch-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: aacsearch-app
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### 9.3. CI/CD

#### GitHub Actions

**.github/workflows/ci.yml:**
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, dev]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test
        ports:
          - 5432:5432

      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run TypeScript check
        run: pnpm tsc --noEmit

      - name: Run linter
        run: pnpm lint

      - name: Run unit tests
        run: pnpm test:int
        env:
          DATABASE_URI: postgresql://postgres:postgres@localhost:5432/test
          REDIS_HOST: localhost

      - name: Run E2E tests
        run: pnpm test:e2e

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  build:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            aacsearch/platform:latest
            aacsearch/platform:${{ github.sha }}
          cache-from: type=registry,ref=aacsearch/platform:buildcache
          cache-to: type=registry,ref=aacsearch/platform:buildcache,mode=max

  deploy:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Deploy to Kubernetes
        uses: azure/k8s-deploy@v4
        with:
          manifests: |
            k8s/deployment.yaml
            k8s/service.yaml
          images: |
            aacsearch/platform:${{ github.sha }}
          kubectl-version: 'latest'
```

---

## 10. Monitoring и observability

### 10.1. Logging

**Winston или Pino для structured logging**

**Рекомендуемая конфигурация:**
```typescript
import winston from 'winston'

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'aacsearch-api',
    version: process.env.APP_VERSION
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: 'logs/combined.log'
    })
  ]
})
```

### 10.2. Metrics

**Prometheus Client для метрик**

```bash
npm install prom-client
```

```typescript
import { register, Counter, Histogram } from 'prom-client'

// Counters
export const searchRequestsTotal = new Counter({
  name: 'search_requests_total',
  help: 'Total number of search requests',
  labelNames: ['tenant', 'collection', 'status']
})

// Histograms
export const searchDuration = new Histogram({
  name: 'search_duration_seconds',
  help: 'Search request duration',
  labelNames: ['tenant', 'collection'],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5]
})

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType)
  res.end(await register.metrics())
})
```

### 10.3. APM

**Sentry для error tracking**

```bash
npm install @sentry/nextjs
```

**sentry.client.config.ts:**
```typescript
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  beforeSend(event, hint) {
    // Filter out sensitive data
    if (event.request?.headers) {
      delete event.request.headers['authorization']
      delete event.request.headers['x-api-key']
    }
    return event
  }
})
```

---

## 11. Полный список зависимостей

### 11.1. Production Dependencies

Из `package.json`:

```json
{
  "dependencies": {
    "@payloadcms/admin-bar": "3.62.0",
    "@payloadcms/db-postgres": "3.62.0",
    "@payloadcms/live-preview-react": "3.62.0",
    "@payloadcms/next": "3.62.0",
    "@payloadcms/payload-cloud": "3.62.0",
    "@payloadcms/plugin-form-builder": "3.62.0",
    "@payloadcms/plugin-nested-docs": "3.62.0",
    "@payloadcms/plugin-redirects": "3.62.0",
    "@payloadcms/plugin-search": "3.62.0",
    "@payloadcms/plugin-seo": "3.62.0",
    "@payloadcms/richtext-lexical": "3.62.0",
    "@payloadcms/ui": "3.62.0",
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-slot": "^1.2.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cross-env": "^7.0.3",
    "dotenv": "16.4.7",
    "geist": "^1.5.1",
    "graphql": "^16.12.0",
    "jsonwebtoken": "^9.0.2",
    "lucide-react": "^0.378.0",
    "next": "15.4.4",
    "next-sitemap": "^4.2.3",
    "p-limit": "^7.2.0",
    "payload": "3.62.0",
    "prism-react-renderer": "^2.4.1",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-hook-form": "7.45.4",
    "recharts": "^3.3.0",
    "redis": "^5.9.0",
    "sharp": "0.34.2",
    "stripe": "^19.2.0",
    "tailwind-merge": "^2.6.0",
    "tailwindcss-animate": "^1.0.7",
    "typesense": "^2.1.0",
    "zod": "^4.1.12"
  }
}
```

**Дополнительные библиотеки (описание):**

- **@payloadcms/admin-bar** (3.62.0): Admin bar для live preview
- **@payloadcms/live-preview-react** (3.62.0): React hooks для live preview
- **@payloadcms/payload-cloud** (3.62.0): Интеграция с Payload Cloud
- **geist** (^1.5.1): Шрифт от Vercel (San Francisco style)
- **graphql** (^16.12.0): GraphQL runtime для API
- **jsonwebtoken** (^9.0.2): JWT генерация и верификация
- **next-sitemap** (^4.2.3): Автоматическая генерация sitemap.xml
- **p-limit** (^7.2.0): Ограничение параллельных Promise
- **prism-react-renderer** (^2.4.1): Syntax highlighting для кода

### 11.2. Development Dependencies

```json
{
  "devDependencies": {
    "@eslint/eslintrc": "^3.3.1",
    "@playwright/test": "1.54.1",
    "@tailwindcss/typography": "^0.5.19",
    "@testing-library/react": "16.3.0",
    "@types/escape-html": "^1.0.4",
    "@types/jsonwebtoken": "^9.0.10",
    "@types/node": "22.5.4",
    "@types/react": "19.1.8",
    "@types/react-dom": "19.1.6",
    "@types/recharts": "^2.0.1",
    "@vitejs/plugin-react": "4.5.2",
    "autoprefixer": "^10.4.21",
    "copyfiles": "^2.4.1",
    "eslint": "^9.39.0",
    "eslint-config-next": "15.4.4",
    "jsdom": "26.1.0",
    "playwright": "1.54.1",
    "playwright-core": "1.54.1",
    "postcss": "^8.5.6",
    "prettier": "^3.6.2",
    "tailwindcss": "^3.4.18",
    "typescript": "5.7.3",
    "vite-tsconfig-paths": "5.1.4",
    "vitest": "3.2.3"
  }
}
```

**Описание dev dependencies:**

- **@eslint/eslintrc** (^3.3.1): ESLint конфигурация
- **@tailwindcss/typography** (^0.5.19): Prose styling для контента
- **@types/*** : TypeScript definitions
- **autoprefixer** (^10.4.21): Автоматическое добавление CSS префиксов
- **copyfiles** (^2.4.1): Копирование файлов в build
- **eslint** (^9.39.0): JavaScript linter
- **eslint-config-next** (15.4.4): ESLint правила для Next.js
- **jsdom** (26.1.0): DOM implementation для тестов
- **postcss** (^8.5.6): CSS обработка
- **prettier** (^3.6.2): Code formatter

---

## 12. Системные требования

### 12.1. Runtime версии

```json
{
  "engines": {
    "node": "^18.20.2 || >=20.9.0",
    "pnpm": "^9 || ^10"
  }
}
```

**Node.js:**
- Минимум: 18.20.2
- Рекомендуется: 20.9.0 или выше
- LTS версии предпочтительны

**pnpm:**
- Версия 9 или 10
- Необходим для правильного разрешения зависимостей

### 12.2. Минимальные требования к серверу

**Development:**
- CPU: 2 cores
- RAM: 4 GB
- Disk: 20 GB SSD
- Network: 100 Mbps

**Production (single server):**
- CPU: 4 cores
- RAM: 8 GB
- Disk: 50 GB SSD
- Network: 1 Gbps

**Database Server (PostgreSQL):**
- CPU: 2-4 cores
- RAM: 4-8 GB
- Disk: 100 GB SSD (IOPS: 3000+)

**Cache Server (Redis):**
- CPU: 2 cores
- RAM: 4 GB
- Disk: 20 GB SSD

**Search Engine (Typesense):**
- CPU: 4 cores
- RAM: 8 GB
- Disk: 100 GB SSD (NVMe preferred)

### 12.3. Рекомендуемые требования для production

**Application Servers (load balanced):**
- Количество: 3+ instances
- CPU: 8 cores per instance
- RAM: 16 GB per instance
- Disk: 100 GB SSD
- Network: 10 Gbps

**Database Cluster (PostgreSQL):**
- Primary: 8 cores, 32 GB RAM, 500 GB SSD
- Replicas: 2x (4 cores, 16 GB RAM, 500 GB SSD)
- Connection pooling: PgBouncer

**Cache Cluster (Redis):**
- Masters: 3x (4 cores, 16 GB RAM, 50 GB SSD)
- Replicas: 3x (4 cores, 16 GB RAM, 50 GB SSD)
- Configuration: Redis Cluster mode

**Search Cluster (Typesense):**
- Nodes: 3+ (8 cores, 32 GB RAM, 500 GB NVMe)
- Shards: 9
- Replication: 3x

**Load Balancer:**
- Nginx или AWS ALB/ELB
- SSL/TLS termination
- Rate limiting
- DDoS protection

**Monitoring Stack:**
- Prometheus: 4 cores, 8 GB RAM
- Grafana: 2 cores, 4 GB RAM
- Loki: 4 cores, 8 GB RAM
- Alertmanager: 2 cores, 4 GB RAM

---

## Заключение

Технологический стек платформы AACSearch построен на современных и проверенных технологиях:

**Backend:**
- Node.js 20+ с TypeScript 5.7
- Next.js 15 для SSR и API routes
- Payload CMS 3 для headless CMS
- PostgreSQL 15 для надежного хранения данных

**Frontend:**
- React 19 с Server Components
- Radix UI для доступных компонентов
- TailwindCSS для быстрой разработки
- Lucide React для иконок

**Infrastructure:**
- Redis 7 для кэширования
- Typesense 2.1 для мощного поиска
- Stripe 19 для платежей
- Docker/Kubernetes для deployment

**Development:**
- pnpm для быстрого управления пакетами
- Vitest для unit тестов
- Playwright для E2E тестов
- TypeScript для type safety

Этот стек обеспечивает:
- ✅ Высокую производительность
- ✅ Масштабируемость
- ✅ Type safety
- ✅ Developer experience
- ✅ Production-ready solutions

Следующий раздел: [Сценарии использования](./05-use-cases.md)
