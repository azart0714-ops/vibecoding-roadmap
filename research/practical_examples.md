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

## 🔌 5. MCP КОНФИГУРАЦИЯ И БЕЗОПАСНОСТЬ

Model Context Protocol (MCP) — это универсальный стандарт подключения внешних инструментов к AI-ассистентам (Cursor, Claude Desktop, Claude CLI).

### Конфигурация 6 ключевых серверов в `claude_desktop_config.json`

```json
{
  "mcpServers": {
    "tavily": {
      "command": "npx",
      "args": ["-y", "@tavily/mcp-server"],
      "env": {
        "TAVILY_API_KEY": "tvly-your-api-key"
      }
    },
    "perplexity": {
      "command": "npx",
      "args": ["-y", "@perplexity/mcp-server"],
      "env": {
        "PERPLEXITY_API_KEY": "pplx-your-api-key"
      }
    },
    "exa": {
      "command": "npx",
      "args": ["-y", "@exa/mcp-server"],
      "env": {
        "EXA_API_KEY": "exa-your-api-key"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@github/mcp-server"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_pat"
      }
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp-server"]
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@postgres/mcp-server"],
      "env": {
        "DATABASE_URL": "postgresql://user:password@localhost:5432/mydb"
      }
    }
  }
}
```

### ⚠️ Риски безопасности при использовании MCP

Применение MCP дает AI-агенту прямой доступ к системе и сети. Это несет следующие критические риски:
1. **Неконтролируемое удаление/перезапись файлов**: Сервер файловой системы может стереть важный исходный код при некорректно поставленной задаче.
2. **Утечка секретов и API ключей**: Недобросовестные или взломанные MCP-серверы могут просканировать переменные окружения и отправить их на удаленный вебхук.
3. **Прямое выполнение SQL-запросов**: Доступ к базе данных позволяет агенту случайно или намеренно выполнить деструктивные `DROP TABLE` команды в неподходящей среде.

**Золотое правило безопасности**:
> [!IMPORTANT]
> Никогда не доверяйте MCP-серверам выполнение потенциально деструктивных команд (удаление файлов, пуш в основную ветку, миграции БД в prod) в фоновом режиме. Всегда требуйте ручного подтверждения (User Approval) и проводите независимый контроль изменений перед коммитом!

---

## 📚 6. SKILLS И КАСТОМИЗАЦИЯ КЛОДА

Кастомные навыки (Skills) позволяют тонко настраивать системный контекст Claude для специфических задач.

### Локальная структура папки проекта `.claude/skills/`

```
.claude/
└── skills/
    ├── skill-code-reviewer.md
    ├── skill-media-manager.md
    └── skill-db-verifier.md
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

## 🚀 8. RAILWAY DEPLOYMENT & STAGING

Деплой на Railway позволяет быстро развернуть бэкенд и базы данных в облаке.

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

### Настройка Staging окружения через CLI

1. **Авторизация и линковка**:
   ```bash
   railway login
   railway link # Выберите ваш проект из списка
   ```
2. **Создание и переключение на ветку staging**:
   ```bash
   railway environment create staging
   railway service staging # переключение контекста CLI на staging
   ```
3. **Ручной деплой текущего состояния**:
   ```bash
   railway up
   ```

### Переменные окружения (Environments)

```bash
# Production
NODE_ENV=production
DATABASE_URL=postgresql://postgres:prod-pass@prod-db.railway.app:5432/railway
REDIS_URL=redis://default:prod-pass@prod-redis.railway.app:6379
SENTRY_DSN=https://your-sentry-dsn

# Staging
NODE_ENV=staging
DATABASE_URL=postgresql://postgres:stage-pass@stage-db.railway.app:5432/railway
REDIS_URL=redis://default:stage-pass@stage-redis.railway.app:6379
```

### Автоматические превью-окружения для PR (Pull Requests)

Railway поддерживает функцию **PR Ephemeral Environments**:
- В панели управления проектом перейдите в настройки GitHub триггеров.
- Включите опцию **"Create environments for Pull Requests"**.
- При создании PR в `main` Railway автоматически развернет изолированную копию бэкенда и базы данных, прогонит миграции и добавит ссылку на тестовый сервер прямо в комментарии GitHub PR. Это идеальное место для автоматического E2E тестирования (Playwright) силами QA-агента!

### Работа с Базой Данных из CLI

Для проведения миграций структуры БД или сиддинга данных используйте Railway CLI в обертке:
```bash
# Выполнить миграции Prisma на staging-окружении
railway run npx prisma migrate deploy --environment staging

# Подключение к удаленному PostgreSQL в интерактивном режиме psql
railway connect db
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

## 🍽️ 11. РЕСТОРАННАЯ АНАЛОГИЯ API

Понимание принципов взаимодействия клиента и сервера через простой ресторанный пример.

### Схема ролей взаимодействия

```mermaid
graph TD
    subgraph "Зал (Фронтенд)"
        Guest["Гость (Клиент / UI)"]
    end
    
    subgraph "Интерфейс связи (API)"
        Waiter["Официант (API / Запросы & Ответы)"]
    end
    
    subgraph "Кухня (Бэкенд)"
        Chef["Шеф-повар (Сервер)"]
        Pantry["Кладовая (База Данных / DB)"]
    end
    
    Guest -- "1. Выбирает в меню и делает заказ (HTTP GET/POST)" --> Waiter
    Waiter -- "2. Передает заказ на кухню (Запрос к Серверу)" --> Chef
    Chef -- "3. Берет нужные ингредиенты (SQL Select)" --> Pantry
    Pantry -- "4. Возвращает продукты (Ответ DB)" --> Chef
    Chef -- "5. Готовит блюдо и передает официанту" --> Waiter
    Waiter -- "6. Приносит готовое блюдо Гостю (JSON Ответ)" --> Guest
```

### Подробное описание ролей

1. **Гость (Client / User Interface)**:
   - Хочет получить определенные данные (блюдо) или сохранить новые (попросить записать рецепт).
   - Взаимодействует только с Официантом и Меню. Он не знает, как устроена кухня, кто там работает и где хранятся продукты.
2. **Официант (API - Application Programming Interface)**:
   - Принимает запросы Гостя (HTTP Request).
   - Транспортирует заказ на кухню. Он строго валидирует заказ (нельзя заказать то, чего нет в меню).
   - Возвращает ответ кухни Гостю (HTTP Response с JSON-данными).
3. **Шеф-повар (Backend Server)**:
   - Мозг всей системы. Содержит бизнес-логику (рецепты блюд).
   - При получении заказа запускает процессы обработки, проверяет права Гостя на это блюдо (авторизацию).
   - При необходимости обращается к Кладовой (База данных).
4. **Кладовая (Database)**:
   - Место постоянного хранения сырых данных (ингредиенты).
   - Позволяет быстро находить, добавлять или удалять продукты по запросу Шеф-повара.

---

---

## 📦 12. ШАБЛОН SHOWCASE.HTML (ПЕСОЧНИЦА UI КОМПОНЕНТОВ)

Готовый самодостаточный HTML-файл для песочницы дизайн-системы. Позволяет визуально контролировать все состояния компонентов без запуска полного фронтенд-приложения.

```html
<!DOCTYPE html>
<html lang="ru" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UI Component Showcase Sandbox</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: {
              50: '#f5f3ff',
              500: '#8b5cf6',
              600: '#7c3aed',
              700: '#6d28d9',
            }
          }
        }
      }
    }
  </script>
</head>
<body class="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200">
  <div class="max-w-6xl mx-auto px-4 py-8">
    
    <!-- Header -->
    <header class="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-6 mb-8">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">UI Component Showcase</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1">Визуальная песочница и каталог стилей дизайн-системы.</p>
      </div>
      <button onclick="document.documentElement.classList.toggle('dark')" class="px-4 py-2 text-sm font-medium bg-slate-200 dark:bg-slate-800 rounded-lg hover:opacity-90 transition">
        🌓 Переключить тему
      </button>
    </header>

    <!-- Bento Grid Showcase -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      
      <!-- Section: Buttons -->
      <section class="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50">
        <h2 class="text-xl font-semibold mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">1. Buttons (Кнопки)</h2>
        <div class="flex flex-wrap gap-4 items-center">
          <button class="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg shadow-sm transition">
            Primary
          </button>
          <button class="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg shadow-sm transition opacity-50 cursor-not-allowed" disabled>
            Disabled
          </button>
          <button class="px-5 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-650 transition">
            Secondary
          </button>
          <button class="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg shadow-sm transition flex items-center gap-2">
            <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Загрузка...
          </button>
        </div>
      </section>

      <!-- Section: Inputs -->
      <section class="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50">
        <h2 class="text-xl font-semibold mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">2. Form Fields (Поля ввода)</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-400">Стандартное поле</label>
            <input type="text" placeholder="Введите текст..." class="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1 text-red-500">Поле с ошибкой валидации</label>
            <input type="email" value="invalid-email@" class="w-full px-4 py-2.5 rounded-lg border border-red-500 bg-transparent focus:ring-2 focus:ring-red-400 outline-none transition">
            <p class="text-xs text-red-500 mt-1">Неверный формат адреса электронной почты.</p>
          </div>
        </div>
      </section>

      <!-- Section: Cards / Containers -->
      <section class="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 col-span-1 md:col-span-2">
        <h2 class="text-xl font-semibold mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">3. Product Card (Пример карточки)</h2>
        <div class="max-w-sm rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/55 p-4">
          <div class="h-48 w-full bg-slate-350 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 font-medium mb-4">
            [ Изображение Продукта ]
          </div>
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">Smart Watch V2</h3>
            <span class="px-2.5 py-1 text-xs font-semibold bg-green-150 text-green-700 dark:bg-green-900/40 dark:text-green-400 rounded-full">В наличии</span>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">Умные часы с датчиком пульса, мониторингом сна и автономностью до 14 дней.</p>
          <div class="flex justify-between items-center">
            <span class="text-xl font-extrabold text-slate-950 dark:text-white">$199.00</span>
            <button class="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-lg transition">Купить</button>
          </div>
        </div>
      </section>

    </div>
  </div>
</body>
</html>
```

---

## 🧠 13. ШАБЛОН CLAUDE.MD (ПАМЯТЬ ПРОЕКТА)

Разместите этот файл с именем `claude.md` в корневом каталоге вашего проекта. Он служит единым источником правды для ИИ.

```markdown
# 📖 Память проекта: [Название Вашего Проекта]

> Этот файл считывается ИИ-агентом перед началом работы. Держите его в актуальном состоянии!

## 🛠️ 1. СТЕК ТЕХНОЛОГИЙ (Tech Stack)
* **Frontend**: React 18 (Next.js App Router), TypeScript, Tailwind CSS.
* **Backend**: NestJS, Node.js 20 LTS.
* **Database**: PostgreSQL 15, Prisma ORM.
* **State Manager**: Zustand (без Redux!).
* **Testing**: Vitest (Unit), Playwright (E2E), MSW (Mocking).

## 📂 2. СТРУКТУРА ПАПОК И КОМПОНЕНТОВ
* `/src/components/ui/` — чистые, презентационные компоненты без состояния (дизайн-система).
* `/src/features/` — функциональные модули по фичам (например, `/auth`, `/dashboard`). Каждый модуль содержит `/components`, `/hooks`, `/api`.
* `/src/store/` — глобальные стейты Zustand.
* `/src/utils/` — чистые утилитарные функции.

## 📝 3. СТАНДАРТЫ КОДИРОВАНИЯ (Coding Guidelines)
1. **TypeScript**: 
   - Никаких `any`. Используйте строгие интерфейсы и типы.
   - Используйте Zod для валидации API-ответов и пользовательских форм.
2. **React**:
   - Функциональные компоненты, объявленные через `const Component = () => {}`.
   - Props описываются через интерфейс `ComponentProps`.
3. **Tailwind CSS**:
   - Пишите стили инлайново в классах. 
   - Для условного рендеринга классов используйте утилиту `cn(...)` (clsx + tailwind-merge).

## 🌿 4. GIT FLOW & РАБОТА С ВЕТКАМИ
* Основная защищенная ветка: `main`.
* Ветки фич создаются от `main` по шаблону: `feature/short-desc` или `bugfix/short-desc`.
* Коммиты пишутся строго по стандарту **Conventional Commits**:
  - `feat: add Google Auth integration`
  - `fix: resolve auth crash on MFA reset`
  - `docs: update setup manual`

## 🚨 5. ПРАВИЛА БЕЗОПАСНОСТИ
* Никаких API-ключей и секретов в кодовой базе. Всегда используйте `process.env`.
* Все конфиденциальные API должны иметь активный Rate-Limiting.
* Пароли пользователей должны шифроваться с помощью `bcrypt` (10 rounds).
```

---

## ⚡ 14. ОПТИМИЗИРОВАННЫЕ ТРИГГЕРЫ СУБАГЕНТОВ

Пример системного файла настроек оркестрации, который определяет, какой субагент должен быть вызван в ответ на запросы пользователя.

```json
{
  "subagents": [
    {
      "name": "Frontend Agent",
      "prompt_file": ".gemini/prompts/frontend_agent.md",
      "triggers": [
        "сверстай", "дизайн", "ui", "tailwind", "компонент", "фронтенд", "css",
        "react", "state", "button", "input", "modal", "showcase", "form",
        "markup", "styles", "flexbox", "grid", "responsive", "view", "pages"
      ]
    },
    {
      "name": "QA Agent",
      "prompt_file": ".gemini/prompts/qa_agent.md",
      "triggers": [
        "тест", "напиши автотест", "vitest", "playwright", "msw", "coverage",
        "test", "assertion", "mocking", "e2e", "qa", "bug", "debugging",
        "упал тест", "ошибка в тесте", "c8", "istanbul", "storybook"
      ]
    },
    {
      "name": "DevOps Agent",
      "prompt_file": ".gemini/prompts/devops_agent.md",
      "triggers": [
        "деплой", "deploy", "railway", "ci/cd", "github actions", "workflow",
        "security headers", "sentry", "uptime", "docker", "dockerfile", "yaml",
        "staging", "production", "nginx", "dns", "domain", "ssl", "env"
      ]
    }
  ]
}
```

---

## 🔒 15. ТИПОВАЯ СХЕМА СТРОГОГО ТИПИРОВАНИЯ В TYPESCRIPT (АНТИ-NULLABLE)

Пример описания схемы данных с использованием библиотеки Zod и интерфейсов TypeScript, исключающий упрощение жизни ИИ за счет необоснованных optional/nullable свойств.

```typescript
import { z } from 'zod';

// Схема Zod со строгими правилами проверки входных данных
export const UserProfileSchema = z.object({
  id: z.string().uuid("Некорректный формат ID"),
  email: z.string().email("Некорректный формат email"),
  fullName: z.string().min(2, "ФИО должно содержать минимум 2 символа"),
  // Никаких необязательных полей без бизнес-обоснования!
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Некорректный формат телефона"),
  role: z.enum(["admin", "editor", "user"]),
  createdAt: z.date(),
  // nullable разрешается ТОЛЬКО если поле действительно может быть пустым по логике бизнеса
  billingAddress: z.object({
    street: z.string().min(1, "Улица обязательна"),
    city: z.string().min(1, "Город обязателен"),
    zipCode: z.string().min(3, "Индекс обязателен"),
    country: z.string().min(2, "Страна обязательна")
  }).nullable() // Адрес может отсутствовать до ввода биллинг-данных
});

// TypeScript тип, выведенный из Zod-схемы
export type UserProfile = z.infer<typeof UserProfileSchema>;
```

---

## 🏃‍♂️ 16. СКРИПТ УМНОЙ СИСТЕМЫ ТЕСТИРОВАНИЯ (SMART TESTING RUNNER)

Пример утилиты на Node.js (`test-smart.js`), которая использует `git diff` для обнаружения затронутых файлов проекта и запускает E2E тесты только для измененных компонентов.

```javascript
const { execSync } = require('child_process');

try {
  console.log('🔍 Запуск Smart Testing Runner...');
  
  // Получаем список измененных файлов в текущей рабочей директории относительно main
  const changedFiles = execSync('git diff --name-only main')
    .toString()
    .trim()
    .split('\n')
    .filter(Boolean);

  if (changedFiles.length === 0) {
    console.log('✅ Нет изменений по сравнению с веткой main. Пропуск тестов.');
    process.exit(0);
  }

  console.log(`📂 Обнаружено измененных файлов: ${changedFiles.length}`);
  
  // Ищем измененные тесты или файлы компонентов
  const testFiles = changedFiles.filter(file => file.includes('.test.') || file.includes('.spec.'));
  
  if (testFiles.length > 0) {
    console.log(`🎯 Запускаем точечные тесты для измененных файлов:`);
    testFiles.forEach(f => console.log(`  - ${f}`));
    
    // Запуск точечных тестов в Vitest/Playwright
    const testCommand = `npx playwright test ${testFiles.join(' ')}`;
    execSync(testCommand, { stdio: 'inherit' });
  } else {
    console.log('⚠️ Изменений в файлах тестов не найдено. Запуск общих интеграционных тестов...');
    execSync('npx playwright test --grep @integration', { stdio: 'inherit' });
  }

  console.log('✅ Умное тестирование успешно завершено!');
} catch (error) {
  console.error('❌ Ошибка при выполнении умного тестирования:', error.message);
  process.exit(1);
}
```

---

## 🕵️‍♂️ 17. ШАБЛОН ПРОМПТА ДЛЯ АГЕНТА ВАЛИДАЦИИ (VALIDATION AGENT CHECKS)

Промпт для выделенного ИИ-ассистента, выполняющего строгий технический аудит написанного кода на наличие костылей и nullable-ошибок.

```markdown
# РОЛЬ
Ты — ИИ-Агент Валидации (Validation Agent). Твоя единственная цель — находить скрытые ошибки, плохие практики программирования (костыли) и архитектурные нарушения в предложенном коде.

# ИНСТРУКЦИЯ ПО АУДИТУ
Изучи предложенные изменения (git diff или исходный код) и дай развернутый отчет по следующим пунктам:

1. **Strict Types & Nullable Bypasses**:
   - Обнаружил ли ты использование типа `any` или ослабление TypeScript-схем?
   - Сделал ли разработчик свойства полей необязательными (`?` или `| null`) без явного обоснования?

2. **Self-Audits & Race Conditions**:
   - Есть ли в коде состояния гонки (race conditions)? (Например, множественные асинхронные вызовы `useEffect` без cleanup-функций).
   - Присутствуют ли в коде жестко закодированные константы (hardcoded API keys, URLs)?

3. **Bypasses & Hacks**:
   - Не пытается ли код обойти схему базы данных, выполняя конвертацию типов прямо во фронтенд-адаптерах?
   - Не создаются ли временные хелперы для скрытия ошибок линтера вместо исправления первопричины?

# ФОРМАТ ОТЧЕТА
Для каждой найденной проблемы укажи:
- Файл и строку кода.
- Степень критичности (🚨 Critical, ⚠️ Warning, 💡 Info).
- Описание проблемы и предлагаемое правильное решение.
```

---

**Последнее обновление**: 17.05.2026, 21:00  
**Статус**: ✅ Расширен под новые стандарты Milestone 6  
**Источник**: Анализ 10+ часов видео + реальный опыт разработки с AI инструментами (Cline, Claude API, Railway)
