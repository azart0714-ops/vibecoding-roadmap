# 💡 Практические примеры из исследования

**Дата создания**: 17.05.2026  
**Источник**: Анализ серии "400 часов вайбкодинга"

---

## 🎯 Цель документа

Этот документ содержит готовые к использованию примеры, шаблоны и чек-листы на основе реального опыта разработки с AI.

---

## 📝 1. ПРОМПТИНГ

### Мета-промпт (Роль + Цель + Контекст)

```markdown
Ты опытный iOS-разработчик с 7+ годами опыта.

Твоя цель: создать детальный план реализации функции экспорта ресурсов 
из IPA-файла в ZIP-архив на бэкенде.

Контекст проекта:
- Telegram мини-приложение для поиска работы
- Backend: NestJS + Prisma + PostgreSQL
- Frontend: React 18 + TypeScript + Tailwind
- Deployment: Railway.app

Требования:
1. Проанализируй текущую архитектуру
2. Предложи оптимальное решение
3. Разбей на атомарные шаги
4. Укажи потенциальные проблемы
5. В конце добавь TODO-лист
```

### Task-промпт (План + Ссылки + Атомарные шаги)

```markdown
Задача: Вынести ресурсы из IPA в Zip на бэкэнд

План реализации:
1. Создать endpoint для загрузки IPA
2. Распаковать IPA на сервере
3. Извлечь ресурсы (images, assets)
4. Упаковать в ZIP
5. Вернуть ссылку на скачивание

Ссылки на документацию:
- NestJS File Upload: [ссылка]
- Prisma File Storage: [ссылка]

Атомарные шаги:
- [ ] Создать DTO для загрузки файла
- [ ] Настроить multer middleware
- [ ] Реализовать сервис распаковки IPA
- [ ] Создать утилиту извлечения ресурсов
- [ ] Реализовать ZIP-архивацию
- [ ] Настроить временное хранилище
- [ ] Добавить очистку старых файлов
- [ ] Написать тесты

Разбей всё на TODO с оценкой времени.
```

### Системный промпт (для Claude Projects)

```markdown
# Роль
Ты senior fullstack разработчик, специализирующийся на TypeScript, React и NestJS.

# Стек проекта
- Frontend: React 18, TypeScript, Tailwind CSS, Zustand
- Backend: NestJS, Prisma ORM, PostgreSQL
- Testing: Vitest, Playwright, MSW
- Deployment: Railway.app
- MCP: Cline, Context7, Sentry

# Принципы работы
1. Всегда используй TypeScript с строгой типизацией
2. Следуй feature-based модульной архитектуре
3. Пиши тесты для критичного функционала
4. Используй Tailwind для стилей
5. Декомпозируй большие задачи
6. Проверяй код на костыли и технический долг

# Правила кодирования
- Избегай nullable полей без необходимости
- Не создавай костыли - исправляй источник проблемы
- Всегда обновляй данные в БД, а не на лету
- Используй готовые компоненты из дизайн-системы
- Документируй сложную логику

# Workflow
1. Проанализируй задачу
2. Предложи решение
3. Разбей на шаги
4. Реализуй с тестами
5. Проведи code review
```

---

## 🏗️ 2. АРХИТЕКТУРА ПРОЕКТА

### Feature-based структура (правильно)

```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   ├── jobs/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   └── leagues/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── types/
│       └── index.ts
├── shared/
│   ├── ui/           # Дизайн-система
│   ├── api/          # API клиент
│   ├── utils/        # Утилиты
│   └── types/        # Общие типы
└── app/
    ├── routes/
    ├── providers/
    └── main.tsx
```

### Монолитная структура (неправильно)

```
src/
├── components/       # 200+ компонентов вперемешку
├── services/         # Все сервисы в одной папке
├── utils/            # Хаотичные утилиты
├── types/            # Все типы в одном месте
└── App.tsx           # 1000+ строк
```

**Проблема**: AI тратит 10 минут вместо 10 секунд на добавление кнопки

---

## 🎨 3. ДИЗАЙН-СИСТЕМА

### Структура UI Kit

```
src/shared/ui/
├── Button/
│   ├── Button.tsx
│   ├── Button.test.tsx
│   ├── Button.stories.tsx
│   └── index.ts
├── Input/
│   ├── Input.tsx
│   ├── Input.test.tsx
│   ├── Input.stories.tsx
│   └── index.ts
├── Card/
├── Badge/
├── Modal/
└── index.ts          # Экспорт всех компонентов
```

### Пример компонента Button

```typescript
// Button.tsx
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles = 'rounded-lg font-medium transition-colors';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'bg-transparent hover:bg-gray-100',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        (disabled || isLoading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Загрузка...' : children}
    </button>
  );
};
```

### Шоукейс (showcase.html)

```html
<!DOCTYPE html>
<html>
<head>
  <title>UI Showcase - Leagues Feature</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="p-8 bg-gray-50">
  <h1 class="text-3xl font-bold mb-8">Leagues Feature Showcase</h1>
  
  <!-- Сценарий 1: Новый пользователь -->
  <section class="mb-12 bg-white p-6 rounded-lg">
    <h2 class="text-xl font-semibold mb-4">1. Новый пользователь</h2>
    <div class="space-y-4">
      <div class="flex items-center gap-4">
        <span class="px-3 py-1 bg-gray-200 rounded-full text-sm">Новичок</span>
        <div class="flex-1 bg-gray-200 rounded-full h-2">
          <div class="bg-blue-600 h-2 rounded-full" style="width: 10%"></div>
        </div>
        <span class="text-sm text-gray-600">1/10 вопросов</span>
      </div>
      <button class="px-4 py-2 bg-blue-600 text-white rounded-lg">
        Начать квест
      </button>
    </div>
  </section>
  
  <!-- Сценарий 2: Активный пользователь -->
  <section class="mb-12 bg-white p-6 rounded-lg">
    <h2 class="text-xl font-semibold mb-4">2. Активный пользователь</h2>
    <div class="space-y-4">
      <div class="flex items-center gap-4">
        <span class="px-3 py-1 bg-yellow-200 rounded-full text-sm">Синьор</span>
        <div class="flex-1 bg-gray-200 rounded-full h-2">
          <div class="bg-yellow-500 h-2 rounded-full" style="width: 75%"></div>
        </div>
        <span class="text-sm text-gray-600">75/100 вопросов</span>
      </div>
      <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
        <p class="text-green-800">🎉 Бонус выходного дня доступен!</p>
      </div>
    </div>
  </section>
  
  <!-- Сценарий 3: Топ пользователь -->
  <section class="mb-12 bg-white p-6 rounded-lg">
    <h2 class="text-xl font-semibold mb-4">3. Топ пользователь</h2>
    <div class="space-y-4">
      <div class="flex items-center gap-4">
        <span class="px-3 py-1 bg-purple-200 rounded-full text-sm">Легенда</span>
        <div class="flex-1 bg-gray-200 rounded-full h-2">
          <div class="bg-purple-600 h-2 rounded-full" style="width: 100%"></div>
        </div>
        <span class="text-sm text-gray-600">500/500 вопросов</span>
      </div>
      <div class="p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <p class="text-purple-800">👑 Вы в топ-10 лиги!</p>
      </div>
    </div>
  </section>
</body>
</html>
```

---

## 🧪 4. ТЕСТИРОВАНИЕ

### Unit тест (Vitest)

```typescript
// calculateTotal.test.ts
import { describe, it, expect } from 'vitest';
import { calculateTotal } from './calculateTotal';

describe('calculateTotal', () => {
  it('должен правильно считать сумму', () => {
    const items = [
      { price: 100, quantity: 2 },
      { price: 50, quantity: 1 },
    ];
    
    expect(calculateTotal(items)).toBe(250);
  });
  
  it('должен возвращать 0 для пустого массива', () => {
    expect(calculateTotal([])).toBe(0);
  });
  
  it('должен игнорировать отрицательные цены', () => {
    const items = [
      { price: -100, quantity: 2 },
      { price: 50, quantity: 1 },
    ];
    
    expect(calculateTotal(items)).toBe(50);
  });
});
```

### Integration тест (MSW)

```typescript
// api.test.ts
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { fetchUser } from './api';

const server = setupServer(
  http.get('/api/users/:id', ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      name: 'Test User',
      email: 'test@example.com',
    });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('fetchUser', () => {
  it('должен получить данные пользователя', async () => {
    const user = await fetchUser('123');
    
    expect(user).toEqual({
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
    });
  });
  
  it('должен обработать ошибку 404', async () => {
    server.use(
      http.get('/api/users/:id', () => {
        return new HttpResponse(null, { status: 404 });
      })
    );
    
    await expect(fetchUser('999')).rejects.toThrow('User not found');
  });
});
```

### E2E тест (Playwright)

```typescript
// login.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Авторизация', () => {
  test('успешный вход', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Добро пожаловать');
  });
  
  test('ошибка при неверном пароле', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('.error')).toContainText('Неверный пароль');
  });
});
```

---

## 🔌 5. MCP КОНФИГУРАЦИЯ

### Claude Desktop Config

```json
{
  "mcpServers": {
    "cline": {
      "command": "npx",
      "args": ["-y", "@cline/mcp-server"],
      "env": {
        "CLINE_API_KEY": "your-api-key"
      }
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp-server"]
    },
    "sentry": {
      "command": "npx",
      "args": ["-y", "@sentry/mcp-server"],
      "env": {
        "SENTRY_DSN": "your-sentry-dsn",
        "SENTRY_ORG": "your-org",
        "SENTRY_PROJECT": "your-project"
      }
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp-server"]
    }
  }
}
```

---

## 📚 6. SKILLS

### Структура скила

```
skills/
└── code-reviewer/
    ├── SKILL.md
    ├── scripts/
    │   └── analyze.sh
    └── resources/
        ├── checklist.md
        └── examples.md
```

### SKILL.md

```markdown
# Code Reviewer Skill

## Описание
Проводит детальный code review с фокусом на:
- Костыли и технический долг
- Nullable поля
- Race conditions
- Архитектурные проблемы

## Когда использовать
- код review
- проверь код
- code review
- посмотри код quality
- проверь качество
- check code
- review this
- найди проблемы в коде

## Процесс

### 1. Анализ структуры
- Проверить модульность
- Найти дублирование
- Оценить связанность

### 2. Проверка типов
- Найти избыточные nullable
- Проверить type safety
- Валидировать интерфейсы

### 3. Поиск костылей
- Обработка данных на лету вместо БД
- Временные решения
- Хардкод значений

### 4. Безопасность
- SQL injection
- XSS уязвимости
- Утечки данных

## Примеры

### ❌ Плохо (костыль)
```typescript
// Получаем неправильные данные из БД и исправляем на лету
function getUser(id: string) {
  const user = db.users.findOne(id);
  return {
    ...user,
    name: user.name || 'Unknown', // Костыль!
  };
}
```

### ✅ Хорошо (правильное решение)
```typescript
// Исправляем данные в БД
async function fixUserNames() {
  await db.users.updateMany(
    { name: null },
    { $set: { name: 'Unknown' } }
  );
}

function getUser(id: string) {
  return db.users.findOne(id); // Данные уже правильные
}
```

## Чек-лист

- [ ] Нет костылей
- [ ] Минимум nullable полей
- [ ] Нет race conditions
- [ ] Нет хардкода
- [ ] Есть обработка ошибок
- [ ] Есть тесты для критичного кода
- [ ] Документация для сложной логики
```

---

## 🎭 7. СУБАГЕНТЫ

### Code Reviewer Agent

```markdown
# Code Reviewer

## Role
Senior code reviewer с фокусом на качество и безопасность.

## Use this agent when
- код review
- проверь код
- code review
- посмотри код quality
- проверь качество
- check code
- review this
- найди проблемы
- technical debt
- технический долг

## Instructions
1. Проанализируй код на:
   - Костыли и временные решения
   - Избыточные nullable поля
   - Race conditions
   - Циклические зависимости
   - Хардкод
   - Проблемы безопасности

2. Для каждой проблемы укажи:
   - Уровень критичности (🚨 Critical / ⚠️ Warning / ℹ️ Info)
   - Описание проблемы
   - Правильное решение
   - Пример кода

3. Предложи план исправления

## Model
Claude 3.5 Sonnet

## Temperature
0.3 (для точности)
```

---

## 🚀 8. RAILWAY DEPLOYMENT

### railway.json

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm run start:prod",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Environments

```bash
# Production
NODE_ENV=production
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
SENTRY_DSN=https://...

# Development
NODE_ENV=development
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
```

---

## ✅ 9. ЧЕК-ЛИСТЫ

### Перед началом проекта

- [ ] Выбран правильный стек (React, TypeScript, Tailwind)
- [ ] Настроена feature-based архитектура
- [ ] Создана дизайн-система
- [ ] Настроены MCP плагины (Cline, Context7, Sentry)
- [ ] Установлены Skills
- [ ] Настроены субагенты
- [ ] Настроен Railway
- [ ] Настроен Git flow с защитой master
- [ ] Настроены автоматические бэкапы БД

### Перед коммитом

- [ ] Код проревьюен (вручную или агентом)
- [ ] Нет костылей
- [ ] Минимум nullable полей
- [ ] Тесты написаны и проходят
- [ ] Нет технического долга
- [ ] Документация обновлена
- [ ] Claude.md обновлен

### Перед деплоем

- [ ] Все тесты проходят
- [ ] Code review пройден
- [ ] Нет критических ошибок в Sentry
- [ ] Бэкап БД создан
- [ ] Changelog обновлен
- [ ] Rollback план готов

---

## 📖 10. КНИГИ ДЛЯ AI

### Промпт для AI

```markdown
Найди топовые книги по следующим темам:
1. TypeScript
2. React
3. Архитектура приложений
4. Тестирование
5. DevOps

Критерии:
- Высокие рейтинги (4.5+)
- Много отзывов (1000+)
- Актуальные (2020+)
- Признаны комьюнити

Для каждой книги укажи:
- Название и автора
- Ключевые темы
- Почему стоит изучить

После этого изучи эти книги и примени знания в нашем проекте.
Обнови Claude.md с ключевыми инсайтами.
```

---

**Последнее обновление**: 17.05.2026, 19:34  
**Статус**: ✅ Готово к использованию  
**Источник**: Анализ 6+ часов видео + реальный опыт разработки
