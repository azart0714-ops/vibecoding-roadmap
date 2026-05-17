# L2: Ключевые принципы vibecoding

## 🎯 Цель уровня

Освоить критически важные правила и принципы безопасной и эффективной разработки с AI. Этот уровень — основа vibecoding, без которой вы рискуете потерять данные, деньги или время.

**Ключевой принцип**: Безопасность и контроль важнее скорости.

**Философия уровня**: AI — мощный инструмент, но без правил он может навредить. Эти правила — ваша страховка.

---

## 🧠 Ключевые концепции

### 1. Git как машина времени
Каждый коммит — точка отката. AI сломал код? `git reset --hard HEAD`

### 2. Приватность по умолчанию
Публичный репозиторий = утечка секретов = тысячи долларов убытков.

### 3. Контекст — валюта AI
Чем лучше контекст, тем лучше результат. handoff.md — ваш банк контекста.

### 4. Staging перед Production
Никогда не деплой напрямую в production. Всегда через staging.

### 5. Документация в процессе
Документируй решения сразу, не откладывай на потом.

---

## 📚 Теоретическая база

### Раздел 1: Безопасность и контроль версий

#### 1.1. GitHub: Только приватные репозитории

**Почему критично**: Боты сканируют GitHub 24/7, один утекший ключ = $10,000+ убытков

**Правила**:
- ✅ Только private repositories
- ✅ Проверяй настройки перед первым push
- ❌ НИКОГДА не делай публичным, если там был .env

**Исправление утечки**:
```bash
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all
```

#### 1.2. Git: Машина времени для кода

**Базовые команды спасения**:
```bash
git reset --hard HEAD           # Откат к последнему коммиту
git reset --hard HEAD~5         # Откат на 5 коммитов назад
git log --oneline --graph       # История изменений
git checkout HEAD -- path/file  # Вернуть конкретный файл
```

**Правила коммитов**:
- ✅ Коммить после каждой завершенной фичи
- ✅ Понятные сообщения: "Add user authentication"
- ❌ Не коммитить console.log и отладочный код

#### 1.3. .gitignore: Защита секретов

**Критические файлы**:
```gitignore
.env
.env.local
.env.*.local
node_modules/
.next/
dist/
.DS_Store
*.log
```

**Правило первого push**:
```bash
git status                    # Проверь, что .env НЕ в списке
git rm --cached .env          # Если .env там есть
echo ".env" >> .gitignore
```

#### 1.4. .env файлы: Хранение секретов

**Правила**:
- ✅ Создай .env.example с пустыми значениями
- ✅ Добавь .env в .gitignore ДО первого коммита
- ❌ НИКОГДА не коммитить реальные ключи

**Пример .env.example**:
```env
DATABASE_URL=your_database_url_here
ANTHROPIC_API_KEY=your_key_here
STRIPE_SECRET_KEY=your_stripe_key_here
```

#### 1.5. Стратегии бэкапов

**Правило**: Если данные важны, у них должно быть минимум 3 копии

**Уровни бэкапов**:
1. **Код**: Локальный репозиторий + GitHub + GitLab
2. **БД**: Автоматические бэкапы + ручные перед миграциями
3. **Файлы**: Cloud storage + локальная копия

**Команды для бэкапа БД**:
```bash
pg_dump -U username -d database > backup_$(date +%Y%m%d).sql
psql -U username -d database < backup_20260517.sql
```

---

### Раздел 2: Работа с ветками и код-ревью

#### 2.1. Feature Branches Workflow

**Структура веток**:
```
main (production)
  ├── develop (staging)
  │   ├── feature/user-auth
  │   ├── fix/login-bug
  │   └── refactor/api-structure
```

**Workflow**:
```bash
git checkout develop
git pull origin develop
git checkout -b feature/user-profile
# Работай в ветке
git push -u origin feature/user-profile
# Создай Pull Request на GitHub
```

#### 2.2. Pull Requests и Diff-контроль

**Зачем нужны PR**: Видишь ВСЕ изменения, можешь откатить одной кнопкой

**Diff-контроль**:
```bash
git diff                              # Изменения перед коммитом
git diff path/to/file                 # Изменения в файле
git diff main..feature/user-profile   # Между ветками
```

#### 2.3. Защита main ветки

**Настройки на GitHub**:
- ✅ Require pull request before merging
- ✅ Require approvals (минимум 1)
- ✅ Require status checks to pass
- ❌ НИКОГДА не пушить напрямую в main

#### 2.4. Git Tags и релизы

**Semantic Versioning**: v1.0.0 (Major.Minor.Patch)

```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

#### 2.5. Работа с конфликтами

```bash
git checkout feature/my-feature
git fetch origin
git merge origin/main
# Реши конфликты в файлах
git add .
git commit -m "Resolve merge conflicts"
```

---

### Раздел 3: Архитектура и структура проекта

#### 3.1. Feature-based архитектура

**Хорошая структура**:
```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── api/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── utils/
│   ├── posts/
│   └── comments/
├── shared/
│   ├── components/
│   └── utils/
└── app/
```

**Преимущества**: Легко найти код фичи, легко удалить, изоляция изменений

#### 3.2. Модульная структура проекта

**Полная структура**:
```
project/
├── .claude/              # Память AI
├── src/
│   ├── app/
│   ├── features/
│   ├── shared/
│   └── lib/
├── public/
├── tests/
├── .env                  # В .gitignore!
├── .env.example
├── CLAUDE.md
├── handoff.md
└── README.md
```

#### 3.3. Design Systems

**Структура**:
```
src/shared/design-system/
├── tokens/
│   ├── colors.ts
│   ├── typography.ts
│   └── spacing.ts
├── components/
│   ├── Button/
│   ├── Input/
│   └── Modal/
└── index.ts
```

**Правило**: Создай Design System в начале проекта

#### 3.4. API контракты

**REST API структура**:
```
/api/
├── auth/
│   ├── login       POST
│   ├── register    POST
│   └── logout      POST
├── users/
│   ├── me          GET, PUT, DELETE
│   └── [id]        GET, PUT, DELETE
└── posts/
    ├── /           GET, POST
    └── [id]        GET, PUT, DELETE
```

---

### Раздел 4: Работа с базами данных

#### 4.1. Выбор базы данных

**PostgreSQL — рекомендуемый выбор**

**Провайдеры**:
- **Neon** — serverless PostgreSQL (бесплатный tier: 0.5 GB)
- **Supabase** — PostgreSQL + Auth + Storage (500 MB)
- **Railway** — PostgreSQL + deployment ($5/мес)

#### 4.2. SQL миграции

**Команды миграций (Prisma)**:
```bash
npx prisma migrate dev --name add_user_table
npx prisma migrate deploy
npx prisma migrate reset
```

**Правило**: ВСЕГДА делай бэкап перед миграцией в production

#### 4.3. Проверка SQL перед выполнением

**Чек-лист**:
- [ ] Есть WHERE условие?
- [ ] Есть LIMIT для UPDATE/DELETE?
- [ ] Протестировано на staging?
- [ ] Есть бэкап?

#### 4.4. Database Branching

**Neon Database Branching**:
```bash
neon branches create --name feature/user-profile
neon connection-string feature/user-profile
```

#### 4.5. Защита от SQL Injection

**Хорошо** (Parameterized queries):
```typescript
// ✅ Безопасно с Prisma
const user = await prisma.user.findUnique({
  where: { email: req.body.email }
});
```

**Правило**: НИКОГДА не конкатенируй пользовательский ввод в SQL

---

### Раздел 5: Deployment и staging

#### 5.1. Окружения: Development → Staging → Production

**Три обязательных окружения**:
1. **Development** (локально) — можно ломать
2. **Staging** (тестовый) — копия production
3. **Production** (боевой) — реальные пользователи

**Правило**: НИКОГДА не деплой напрямую в production

#### 5.2. Vercel: Рекомендуемый хостинг

**Настройка**:
```bash
npm i -g vercel
vercel login
vercel --prod
```

#### 5.3. Preview Deployments

**Workflow**: Каждый PR = отдельный URL для тестирования

#### 5.4. Rollback стратегия

```bash
vercel rollback              # Откат к предыдущему деплою
git revert HEAD && git push  # Откат коммита
```

#### 5.5. Health Checks

```typescript
// app/api/health/route.ts
export async function GET() {
  await db.query('SELECT 1');
  return Response.json({ status: 'ok' });
}
```

---

### Раздел 6: Работа с платежами

#### 6.1. Stripe: Безопасная интеграция

**Правила**:
- ✅ Используй Stripe Checkout (готовая форма)
- ✅ Обрабатывай webhooks
- ❌ НИКОГДА не храни карточные данные

**Test vs Live keys**:
```env
# Development
STRIPE_SECRET_KEY=sk_test_...

# Production
STRIPE_SECRET_KEY=sk_live_...
```

#### 6.2. Webhooks: Критическая важность

**Почему обязательны**: Пользователь может закрыть страницу после оплаты

#### 6.3. Тестирование платежей

**Test карты Stripe**:
```
Успешная: 4242 4242 4242 4242
Отклонена: 4000 0000 0000 0002
```

#### 6.4. PCI DSS Compliance

**Правило**: Используй Stripe Elements, не обрабатывай карточные данные на своем сервере

---

### Раздел 7: Промптинг и работа с AI

#### 7.1. Мета-промпты: Контекст для AI

**Структура**:
```markdown
# Контекст проекта
## Стек: Next.js 14, PostgreSQL, Tailwind
## Архитектура: Feature-based
## Правила: TypeScript strict, проверяй SQL
## Текущая задача: [детали]
## Acceptance Criteria: [чек-лист]
```

#### 7.2. Acceptance Criteria

**Пример**:
```markdown
Задача: Добавить страницу профиля

Acceptance Criteria:
- [ ] Страница доступна по /profile
- [ ] Показывает имя, email, аватар
- [ ] Форма редактирования работает
- [ ] Изменения сохраняются в БД
- [ ] Responsive на мобильных
```

#### 7.3. Итеративный промптинг

**Стратегия**: Дай общую задачу → Проверь → Уточни → Повтори

#### 7.4. Правило "Проверяй, не доверяй"

**Чек-лист после AI**:
- [ ] Код компилируется?
- [ ] Тесты проходят?
- [ ] Нет SQL injection?
- [ ] Нет хардкода секретов?

---

### Раздел 8: Управление контекстом

#### 8.1. handoff.md: Протокол передачи

**Обновляй каждые 10 действий**:
```markdown
# Handoff - 17.05.2026

## Что сделано (последние 10 шагов)
1. Создана таблица users
2. Добавлен API /api/auth/login
...

## Текущие проблемы
- Тест auth.test.ts падает

## Следующие шаги
1. Исправить тест
2. Добавить rate limiting
```

#### 8.2. SELECT → COMPRESS → WRITE

**Стратегия**:
1. **SELECT**: Выбери только нужные файлы
2. **COMPRESS**: Сожми контекст
3. **WRITE**: Пиши только изменения (diff)

#### 8.3. .claude/ папка: Память AI

**Обязательные файлы**:
1. **SNAPSHOT.md** — текущее состояние
2. **BACKLOG.md** — задачи
3. **ARCHITECTURE.md** — архитектурные решения

#### 8.4. Chunking: Разбивка больших задач

**Разбей на чанки по 30 минут**:
```markdown
Большая задача: Создать систему авторизации

Чанк 1 (30 мин): Схема БД + миграция
Чанк 2 (30 мин): API endpoints
Чанк 3 (30 мин): JWT логика
Чанк 4 (30 мин): UI компоненты
```

---

### Раздел 9: Тестирование и валидация

#### 9.1. Пирамида тестирования

**Соотношение**: 70% unit, 20% integration, 10% E2E

#### 9.2. Unit тесты

```typescript
import { validateEmail } from './validation';

describe('validateEmail', () => {
  it('should accept valid email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });
});
```

#### 9.3. E2E тесты (Playwright)

```typescript
test('user can login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
```

#### 9.4. CI/CD Pipeline

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

---

### Раздел 10: Оптимизация процессов

#### 10.1. Автоматизация рутины

**Скрипты в package.json**:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "test": "vitest",
    "lint": "eslint . --fix",
    "db:migrate": "prisma migrate dev"
  }
}
```

#### 10.2. Документация в процессе

**Правило**: Документируй сразу, не откладывай

**Когда документировать**:
- Принял решение → ARCHITECTURE.md
- Завершил фичу → SNAPSHOT.md
- Нашел баг → BACKLOG.md

---

## ✅ Чек-лист освоения L2

### Безопасность
- [ ] Все репозитории приватные
- [ ] .env в .gitignore
- [ ] Умею откатывать через Git
- [ ] Настроены бэкапы БД

### Git Workflow
- [ ] Работаю через feature branches
- [ ] Использую Pull Requests
- [ ] Защитил main ветку

### Архитектура
- [ ] Feature-based структура
- [ ] Design System создан
- [ ] Код разбит на модули (<200 строк/файл)

### База данных
- [ ] Использую миграции
- [ ] Настроены бэкапы
- [ ] Проверяю SQL перед выполнением

### Deployment
- [ ] Настроил staging
- [ ] Использую preview deployments
- [ ] Умею делать rollback

### Платежи
- [ ] Stripe интегрирован безопасно
- [ ] Webhooks настроены
- [ ] Протестировал на test keys

### AI Workflow
- [ ] Использую мета-промпты
- [ ] Пишу acceptance criteria
- [ ] Обновляю handoff.md

### Контекст
- [ ] Настроил .claude/ папку
- [ ] Использую SELECT→COMPRESS→WRITE
- [ ] Разбиваю задачи на чанки

### Тестирование
- [ ] Unit тесты написаны
- [ ] E2E тесты настроены
- [ ] CI/CD настроен

---

## 📖 Ресурсы для изучения

### Видео
- [Blake Crosley - Claude Code Guide](https://blakecrosley.com/guides/claude-code)
- [AI Jason - Vibecoding Streams](https://youtube.com/@aijason)

### Документация
- [Vercel Docs](https://vercel.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [Prisma Docs](https://prisma.io/docs)
- [Playwright Docs](https://playwright.dev)

### Сообщества
- Discord: Anthropic, AI Engineering
- Reddit: r/ClaudeAI, r/webdev

---

**Последнее обновление**: 17.05.2026  
**Статус**: ✅ Завершен  
**Предыдущий уровень**: [L1: Планирование](L1_planning.md)  
**Следующий уровень**: [L3: Профессиональная среда](L3_professional_environment.md)
