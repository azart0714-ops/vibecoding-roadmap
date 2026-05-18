# L5: Backend и базы данных

## 🎯 Цель уровня

Создавать надежные backend системы с базами данных, API и аутентификацией.

**Ключевой принцип**: Безопасность и масштабируемость с первого дня.

**Философия уровня**: Backend — это фундамент приложения.

---

## 🧠 Ключевые концепции

### 1. REST API и HTTP
Стандартизированный способ общения frontend и backend через HTTP методы.

### 2. PostgreSQL и SQL
Реляционная база данных для хранения структурированных данных.

### 3. Prisma ORM
Type-safe ORM для работы с базой данных из TypeScript.

### 4. Аутентификация и авторизация
Безопасная идентификация пользователей и контроль доступа.

### 5. Serverless функции
Backend код, который выполняется по требованию без управления серверами.

### 6. Безопасность backend
Защита от SQL injection, XSS, CSRF и других атак.

---

## 📚 Теоретическая база

### Раздел 1: API Design и REST

#### 1.1. HTTP методы и REST принципы
**CRUD операции через HTTP**:
- `GET` — получить данные (список или по ID)
- `POST` — создать новый ресурс
- `PUT` — обновить ресурс полностью
- `PATCH` — обновить ресурс частично
- `DELETE` — удалить ресурс

#### 1.2. Status Codes
**Успешные (2xx)**:
- `200 OK` — успешный запрос
- `201 Created` — ресурс создан
- `204 No Content` — успешно, но нет контента

**Ошибки клиента (4xx)**:
- `400 Bad Request` — неверный запрос
- `401 Unauthorized` — не авторизован
- `403 Forbidden` — нет доступа
- `404 Not Found` — не найдено

**Ошибки сервера (5xx)**:
- `500 Internal Server Error` — ошибка сервера

#### 1.3. API Response Format
Структурированный формат ответа с данными и метаинформацией для консистентности.

📖 **Ресурс**: [REST API Tutorial](https://restfulapi.net/)

---

### Раздел 2: PostgreSQL и SQL

#### 2.1. Основы SQL
**Базовые операции**:
- SELECT — выборка данных
- INSERT — добавление данных
- UPDATE — обновление данных
- DELETE — удаление данных
- WHERE — фильтрация
- JOIN — объединение таблиц

#### 2.2. Отношения между таблицами
- **One-to-Many** — один пользователь → много постов
- **Many-to-Many** — много пользователей ↔ много ролей
- **One-to-One** — один пользователь → один профиль

#### 2.3. Провайдеры PostgreSQL

##### Neon vs Supabase vs Railway: Полное сравнение
Для ИИ-разработки (vibecoding) выбор провайдера базы данных критически влияет на скорость и удобство отладки.

| Критерий | Neon DB | Supabase | Railway |
| :--- | :--- | :--- | :--- |
| **Специализация** | Serverless Postgres с мгновенным ветвлением (Database Branching) | Open Source Firebase Alternative (БД + Auth + Storage) | Облачный хостинг полного цикла (App + Postgres + Redis) |
| **Free Tier лимит** | 1 проект, 0.5 GB хранилища, 1 вычислительный узел | 2 проекта, 500 MB хранилища, 50,000 MAU для Auth | Нет бесплатного тарифа (ранее были 500ч, сейчас $5 лимит) |
| **Ветвление (Branching)** | **Да (мгновенное через Copy-on-Write)** | Да (через Supabase CLI / migrations, но медленнее) | Да (через Environments, но поднимается новая БД) |
| **Доп. сервисы** | Нет (только чистый Postgres) | Auth, Storage, Edge Functions, Realtime, Vector (`pgvector`) | Шаблоны деплоя 650+ сервисов, Redis, Cron |
| **AI-Friendly Score** | **9.5/10** (Ветвление делает preview-сборки ИИ мгновенными) | **9.0/10** (Все сервисы из одной коробки облегчают промптинг) | **8.5/10** (Хорош для монолитов, но БД не имеет serverless-снапшотов) |
| **Вердикт** | **Идеален для Next.js + Vercel / Neon Integration** | **Идеален для комплексных мобильных и web-приложений** | **Идеален для Docker/Node.js бэкендов общего назначения** |

##### Database Branching — Game Changer для ИИ-разработки
Традиционный подход к миграциям баз данных ломается, когда код пишет ИИ-агент. Он может сгенерировать невалидную миграцию или испортить структуру таблиц. Ветвление баз данных (Database Branching), популяризированное Neon, полностью решает эту проблему:
1. **Изолированные Preview-окружения**: При создании PR или ветки в GitHub, Neon мгновенно (за 1 секунду) создает точную копию рабочей базы данных (структуру и данные) с помощью технологии Copy-on-Write.
2. **Безопасное тестирование миграций**: ИИ-агент применяется новые миграции на тестовой ветке базы данных. Если миграция ломает логику или падает с ошибкой, основная (production) база остается абсолютно нетронутой.
3. **Мгновенный откат (Rollback)**: В случае фатального бага на стейджинге, ветку базы данных можно просто удалить и пересоздать за секунду, не тратя часы на ручное восстановление из бэкапов.

##### Supabase — Всё-в-одном решение
Если Neon дает идеальную инфраструктуру для реляционных данных, то Supabase — это целая экосистема, которая сокращает время вывода MVP на рынок в 5 раз благодаря тому, что все компоненты бэкенда поставляются из единой консоли и управляются через один клиент:
- **PostgreSQL**: Полноценная БД с поддержкой расширений, включая `pgvector` для хранения векторных эмбеддингов ИИ.
- **Supabase Auth**: Встроенная система авторизации (Email, Google, GitHub, OAuth, MFA, Magic Links) с автоматической интеграцией в политики безопасности баз данных (Row Level Security - RLS).
- **Supabase Storage**: Облачное хранилище для медиафайлов и документов с оптимизацией изображений на лету.
- **Realtime Subscriptions**: Автоматическое прослушивание изменений в таблицах БД через WebSockets без необходимости писать свой сервер веб-сокетов.
- **Edge Functions**: Бессерверные функции на Deno для выполнения кастомной логики на границе сети (Edge) с минимальной задержкой.

📖 **Ресурсы**:
- [Neon Branching Guide](https://neon.tech/docs/introduction/branching)
- [Supabase Architecture](https://supabase.com/docs/guides/getting-started/architecture)
- [Railway Databases](https://docs.railway.app/databases/postgresql)

---

### Раздел 3: Prisma ORM

#### 3.1. Концепция
- **Декларативность схемы**: Вы описываете сущности и связи простым, интуитивно понятным языком в файле `schema.prisma`. ИИ-агенты превосходно считывают и генерируют такие схемы без ошибок в синтаксисе SQL.
- **Type-safe ORM**: Автоматическая кодогенерация типов TypeScript на основе вашей схемы. Если вы удалили колонку, TypeScript выдаст ошибку во всех файлах проекта, где она использовалась.
- **Prisma Client**: Удобный автодополняемый API для работы с БД с полной поддержкой связей, транзакций и вложенных выборок.
- **Формула Vibecoding**: *"Описываешь данные простым языком в схеме → Prisma генерирует всё остальное (миграции, типы, автодополнение, админку)"*. Это сводит ментальную нагрузку разработчика и ИИ к минимуму.

#### 3.2. Prisma vs Drizzle vs TypeORM
Каждая ORM имеет свои плюсы, но для AI-driven разработки Prisma остается безусловным лидером благодаря своей строгой декларативности.

| Критерий | Prisma ORM | Drizzle ORM | TypeORM |
| :--- | :--- | :--- | :--- |
| **Схема данных** | **Декларативный `.prisma` файл** (ИИ считывает его идеально) | Описание на TypeScript (ИИ часто путается в импортах и типах) | Классы и декораторы TypeScript (избыточный бойлерплейт) |
| **Type-Safety** | Отличная (генерируется автоматически при `prisma generate`) | Идеальная (нативная поддержка TS на этапе компиляции) | Средняя (декораторы могут не соответствовать реальной схеме) |
| **Миграции** | **Полностью автоматические** (`prisma migrate dev`) | Полуавтоматические (требуют запуска `drizzle-kit generate`) | Ручные или авто-генерация (часто генерирует невалидный SQL) |
| **Производительность**| Средняя (из-за Query Engine на Rust как промежуточного слоя) | **Максимальная** (тонкий слой над SQL-драйвером, без оверхеда) | Средняя (классический тяжелый ActiveRecord/DataMapper) |
| **AI-Friendly Score** | **10/10** (Спецификация схемы лаконична, ИИ легко рефакторит ее) | **7.5/10** (ИИ совершает ошибки в сложных SQL-операторах Drizzle) | **6.0/10** (Слишком много шаблонного кода отвлекает ИИ от бизнес-логики) |
| **Вердикт** | **Абсолютный лидер для быстрого прототипирования MVP с ИИ** | Отличный выбор для высоконагруженных систем вручную | Устаревший стандарт, не рекомендуется для vibecoding |

#### 3.3. Основные команды
- `prisma init` — инициализация Prisma в проекте
- `prisma migrate dev --name <migration_name>` — создание и применение безопасной миграции
- `prisma generate` — принудительная генерация Prisma Client для обновления типов TS
- `prisma studio` — запуск встроенного локального веб-интерфейса (GUI) для просмотра и редактирования таблиц
- `prisma db push` — прямая синхронизация схемы с БД без создания файлов миграций (удобно для быстрых прототипов)

#### 3.4. Prisma Client операции
- **create** — создание записи
- **findMany** — получение списка с фильтрами, сортировкой и пагинацией
- **findUnique** — получение одной записи по уникальному полю или первичному ключу
- **update** — безопасное обновление записи
- **delete** — удаление записи из БД (Hard Delete)
- **include** — жадная загрузка (Eager Loading) связанных сущностей за один запрос

#### 3.5. Продвинутые паттерны Prisma для ИИ-разработки
Чтобы ИИ-агенты писали масштабируемый код бэкенда, не плодили дубликаты и не перегружали контроллеры, используйте следующие архитектурные паттерны с готовыми примерами на TypeScript:

##### 1. Repository Pattern (Слой доступа к данным)
Изолирует работу с Prisma от бизнес-логики. ИИ-агент сможет легко менять методы БД, не затрагивая контроллеры API.

```typescript
// src/repositories/user.repository.ts
import { PrismaClient, User, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class UserRepository {
  // Получение пользователя по Email со всеми связями
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
      include: { profile: true, posts: true },
    });
  }

  // Создание пользователя с транзакционной инициализацией профиля
  async createUserWithProfile(
    userData: Prisma.UserCreateInput,
    bio: string
  ): Promise<User> {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: userData,
      });
      await tx.profile.create({
        data: {
          bio,
          userId: user.id,
        },
      });
      return user;
    });
  }
}
```

##### 2. Service Layer & DTO Pattern (Бизнес-логика и Валидация)
Разделяет транспортный уровень API, валидацию входных данных и бизнес-правила.

```typescript
// src/dtos/create-user.dto.ts
import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().email('Некорректный формат Email'),
  name: z.string().min(2, 'Имя должно быть не короче 2 символов'),
  bio: z.string().max(300, 'Биография не должна превышать 300 символов').optional(),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;

// src/services/user.service.ts
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '@prisma/client';

export class UserService {
  private userRepository = new UserRepository();

  async registerUser(dto: CreateUserDto): Promise<User> {
    // Проверка бизнес-логики: уникальность email
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error('Пользователь с таким email уже зарегистрирован');
    }

    // Сохранение пользователя в БД через репозиторий
    return this.userRepository.createUserWithProfile(
      {
        email: dto.email,
        name: dto.name,
      },
      dto.bio || ''
    );
  }
}
```

##### 3. Prisma Extensions & Soft Delete (Мягкое удаление и Логирование)
Использование современных Prisma Extensions для автоматизации мягкого удаления записей (Soft Delete) и логирования времени выполнения запросов.

```typescript
// src/lib/prisma-extended.ts
import { PrismaClient } from '@prisma/client';

const basePrisma = new PrismaClient();

export const prismaExtended = basePrisma
  // 1. Расширение для мягкого удаления (Soft Delete)
  .$extends({
    model: {
      user: {
        async softDelete(id: string) {
          return basePrisma.user.update({
            where: { id },
            data: { deletedAt: new Date() },
          });
        },
      },
    },
    // 2. Глобальный фильтр для исключения мягко удаленных записей при поиске
    query: {
      user: {
        async findMany({ args, query }) {
          args.where = { ...args.where, deletedAt: null };
          return query(args);
        },
        async findUnique({ args, query }) {
          args.where = { ...args.where, deletedAt: null };
          return query(args);
        },
      },
    },
  })
  // 3. Расширение для логирования производительности
  .$extends({
    query: {
      async $allOperations({ model, operation, args, query }) {
        const before = Date.now();
        const result = await query(args);
        const duration = Date.now() - before;
        console.log(`[PRISMA DB] Query ${model}.${operation} executed in ${duration}ms`);
        return result;
      },
    },
  });
```

📖 **Ресурсы**:
- [Prisma Client Advanced Patterns](https://www.prisma.io/docs/concepts/components/prisma-client)
- [Prisma Extensions Guide](https://www.prisma.io/docs/concepts/components/prisma-client/client-extensions)
- [Repository Pattern in NestJS/Prisma](https://docs.nestjs.com/recipes/prisma)

---

### Раздел 4: Next.js API Routes

#### 4.1. Создание API endpoint
- **route.ts** — файл для создания API endpoint
- **GET, POST, PUT, PATCH, DELETE** — экспортируемые функции для HTTP методов
- **NextResponse** — утилита для создания ответов
- **request.json()** — парсинг тела запроса

#### 4.2. Dynamic Routes
- **[id]** — динамические параметры в URL
- **params** — доступ к параметрам маршрута
- **searchParams** — query параметры из URL

📖 **Ресурс**: [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

### Раздел 5: Аутентификация

#### 5.1. NextAuth.js
- **Providers** — Google, GitHub, Email и другие способы входа
- **Session management** — управление сессиями пользователей
- **Callbacks** — кастомизация поведения аутентификации
- **JWT или Database sessions** — выбор способа хранения сессий

#### 5.2. JWT Authentication
- **Access token** — короткоживущий токен для доступа (15 мин)
- **Refresh token** — долгоживущий токен для обновления (7 дней)
- **jwt.sign** — создание токена
- **jwt.verify** — проверка токена

#### 5.3. Middleware для защиты роутов
- **middleware.ts** — файл для глобальных middleware
- **Проверка токена** — валидация перед доступом к защищенным роутам
- **Redirect** — перенаправление неавторизованных пользователей

📖 **Ресурсы**:
- [NextAuth.js](https://next-auth.js.org/)
- [JWT.io](https://jwt.io/)

---

### Раздел 6: Валидация данных

#### 6.1. Zod для валидации
- **Schema definition** — декларативное описание правил валидации
- **safeParse** — валидация с обработкой ошибок
- **Type inference** — автоматический вывод TypeScript типов
- **Композиция схем** — переиспользование и комбинирование правил

📖 **Ресурс**: [Zod Documentation](https://zod.dev/)

---

### Раздел 7: Безопасность

#### 7.1. Защита от SQL Injection
- **Всегда используй Prisma** — автоматическая защита через параметризованные запросы
- **Никогда не конкатенируй SQL** — избегай ручного построения запросов

#### 7.2. Rate Limiting
- **Ограничение запросов** — защита от DDoS и брутфорса
- **Upstash Rate Limit** — serverless решение для rate limiting
- **Sliding window** — алгоритм подсчета запросов

#### 7.3. CORS настройка
- **Access-Control-Allow-Origin** — разрешенные домены
- **Access-Control-Allow-Methods** — разрешенные HTTP методы
- **Credentials** — разрешение отправки cookies

---

### Раздел 8: Error Handling

#### 8.1. Обработка ошибок
- **try-catch блоки** — перехват ошибок
- **Правильные status codes** — 400 для клиентских, 500 для серверных ошибок
- **Структурированные ошибки** — понятные сообщения для клиента
- **Логирование** — запись ошибок для отладки

#### 8.2. Custom Error Classes
- **ApiError** — кастомный класс для API ошибок
- **statusCode и message** — структурированная информация об ошибке

---

### Раздел 9: Тестирование API

#### 9.1. Vitest для unit тестов
- **describe и it** — структура тестов
- **expect** — assertions для проверки результатов
- **Mock Prisma** — имитация БД для тестов

#### 9.2. Postman/Insomnia
- **Коллекции запросов** — организация API endpoints
- **Environment variables** — переключение между dev/prod
- **Автоматизация** — тестирование через скрипты

📖 **Ресурс**: [Vitest Documentation](https://vitest.dev/)

---

### Раздел 10: Deployment

#### 10.1. Environment Variables
- **DATABASE_URL** — строка подключения к БД
- **JWT_SECRET** — секрет для подписи токенов
- **NEXT_PUBLIC_*** — переменные доступные на клиенте
- **.env.local** — локальные переменные (не коммитить)

#### 10.2. Vercel Deployment
- **Автоматический deploy** — при push в GitHub
- **Environment Variables** — настройка через Dashboard
- **Edge Functions** — serverless функции на edge

📖 **Ресурс**: [Vercel Documentation](https://vercel.com/docs)

---

## ✅ Чек-лист освоения L5

### SQL и БД
- [ ] Понимаю основы SQL
- [ ] Знаю типы отношений (One-to-Many, Many-to-Many)
- [ ] Умею проектировать схему БД
- [ ] Настроил PostgreSQL (Neon/Supabase)

### Prisma
- [ ] Создал Prisma schema
- [ ] Умею делать миграции
- [ ] Использую Prisma Client
- [ ] Понимаю relations

### API
- [ ] Создаю REST API endpoints
- [ ] Использую правильные HTTP методы
- [ ] Возвращаю правильные status codes
- [ ] Валидирую данные (Zod)

### Аутентификация
- [ ] Настроил NextAuth.js или JWT
- [ ] Защитил приватные роуты
- [ ] Храню пароли безопасно (bcrypt)
- [ ] Использую httpOnly cookies

### Безопасность
- [ ] Защищен от SQL injection
- [ ] Настроил rate limiting
- [ ] Валидирую все входные данные
- [ ] Обрабатываю ошибки правильно

---

## 📖 Ресурсы для изучения

### Документация
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)

### Аутентификация
- [NextAuth.js](https://next-auth.js.org/)
- [JWT.io](https://jwt.io/)

### Валидация
- [Zod](https://zod.dev/)

### Провайдеры БД
- [Neon](https://neon.tech/)
- [Supabase](https://supabase.com/)
- [Railway](https://railway.app/)

---

## 💡 Pro Tips

### 1. Всегда используй Prisma для SQL запросов
Автоматическая защита от SQL injection и type safety из коробки.

### 2. Валидируй данные на backend
Никогда не доверяй данным от клиента — всегда проверяй на сервере.

### 3. Используй environment variables для секретов
Никогда не хардкодь API ключи и пароли в коде.

### 4. Делай бэкапы БД регулярно
Особенно перед миграциями и важными изменениями.

### 5. Логируй ошибки
Используй Sentry или аналоги для мониторинга ошибок в production.

---

## ⚠️ Частые ошибки

### 1. Не валидируют данные на backend
**Проблема**: Доверяют данным от клиента, что приводит к ошибкам и уязвимостям.

**Решение**: Всегда используй Zod или аналоги для валидации входных данных на сервере.

### 2. Хранят секреты в коде
**Проблема**: API ключи и пароли попадают в репозиторий и становятся публичными.

**Решение**: Используй environment variables и добавь .env в .gitignore.

### 3. Не обрабатывают ошибки
**Проблема**: Приложение падает при ошибке БД или внешнего API.

**Решение**: Оборачивай все операции в try-catch и возвращай понятные ошибки клиенту.

### 4. Не используют транзакции
**Проблема**: Данные могут быть в несогласованном состоянии при частичном выполнении операций.

**Решение**: Используй Prisma transactions для связанных операций (например, создание пользователя и профиля).

### 5. N+1 Query Problem
**Проблема**: Делают отдельный запрос для каждого элемента вместо одного запроса с join.

**Решение**: Используй Prisma include для загрузки связанных данных одним запросом.

---

## 🚀 Продвинутые темы PostgreSQL

### 1. Индексы для оптимизации
- **Обычные индексы** — ускорение поиска по полям
- **Уникальные индексы** — гарантия уникальности + ускорение
- **Составные индексы** — оптимизация запросов по нескольким полям
- **@@index в Prisma** — декларативное создание индексов

### 2. Транзакции и ACID
- **Atomicity** — все или ничего
- **Consistency** — данные всегда валидны
- **Isolation** — транзакции не мешают друг другу
- **Durability** — данные сохраняются после commit
- **Prisma $transaction** — выполнение нескольких операций атомарно

### 3. Views и Materialized Views
- **Views** — виртуальные таблицы для упрощения запросов
- **Materialized Views** — кешированные результаты для производительности

### 4. Full-Text Search
- **to_tsvector** — индексирование текста для поиска
- **to_tsquery** — поисковые запросы
- **GIN индексы** — оптимизация полнотекстового поиска

---

## 🔐 Продвинутая аутентификация

### 1. Bcrypt для хеширования паролей
- **Хеширование при регистрации** — bcrypt.hash с salt rounds
- **Проверка при логине** — bcrypt.compare для валидации
- **Никогда не храни пароли в открытом виде**

### 2. Role-Based Access Control (RBAC)
- **Роли** — USER, ADMIN, MODERATOR
- **Permissions** — что может делать каждая роль
- **Middleware** — проверка роли перед доступом к endpoint

### 3. Refresh Tokens
- **Access token** — короткий срок жизни (15 мин)
- **Refresh token** — длинный срок жизни (7 дней)
- **Rotation** — обновление refresh token при использовании
- **Хранение в БД** — возможность отзыва токенов

---

## 🎯 API Design Best Practices

### 1. Versioning
- **v1, v2** — версионирование API для обратной совместимости
- **/api/v1/users** — структура URL с версией

### 2. Pagination
- **page и limit** — параметры для постраничной навигации
- **total и totalPages** — метаинформация для UI
- **Cursor-based** — альтернатива для больших датасетов

### 3. Filtering и Sorting
- **Query параметры** — ?role=admin&sortBy=createdAt&order=desc
- **Динамическое построение запросов** — Prisma where и orderBy

### 4. Partial Updates (PATCH)
- **Обновление только переданных полей** — экономия трафика
- **Валидация optional полей** — Zod с .optional()

---

## 🤖 Backend с AI (Vibecoding)

### 1. Генерация API с AI
Опиши требования к API — получи полный CRUD с валидацией, error handling и правильными status codes.

### 2. Проектирование схемы БД
AI спроектирует Prisma schema с правильными отношениями, индексами и типами данных.

### 3. Оптимизация запросов
Покажи AI код с N+1 проблемой — получи оптимизированную версию с eager loading.

### 4. Генерация миграций
Опиши изменения в схеме — AI создаст SQL миграцию для безопасного применения.

### 5. Тестирование API
AI создаст тесты, покрывающие успешные сценарии, валидацию, ошибки и edge cases.

---

## 🎯 Vibecoding Workflow для Backend

### Этап 1: Проектирование схемы БД
Опиши AI требования проекта — получи Prisma schema с моделями, отношениями, индексами.

### Этап 2: Создание API endpoints
Итеративно создавай endpoints: базовый CRUD → валидация → аутентификация → авторизация → оптимизация.

### Этап 3: Оптимизация
AI проверит N+1 queries, отсутствие индексов, неэффективные запросы, кеширование.

### Этап 4: Безопасность
AI проверит защиту от SQL injection, XSS, CSRF, rate limiting, валидацию, secrets management.

---

## 🛠 Практические паттерны

### 1. Repository Pattern
Абстракция для работы с БД — вся логика запросов в одном месте.

### 2. Service Layer
Бизнес-логика отдельно от API routes — переиспользование и тестирование.

### 3. Middleware Chain
Композиция middleware для проверки аутентификации, авторизации, rate limiting.

### 4. Database Seeding
Скрипты для заполнения БД тестовыми данными для разработки.

---

## 💎 Pro Tips для Backend Vibecoding

### 1. Code review с AI
Проси AI проверить security vulnerabilities, performance issues, error handling, best practices.

### 2. Генерация документации API
AI создаст OpenAPI (Swagger) документацию с schemas, examples, error responses.

### 3. Автоматизация миграций
AI создаст GitHub Actions для автоматического запуска миграций при deploy.

### 4. Мониторинг и логирование
AI добавит structured logging, request ID tracking, performance metrics, error tracking.

### 5. Генерация типов из схемы
AI создаст Zod schemas, TypeScript types, DTOs, type guards из Prisma schema.

---

## 🚨 Частые ошибки в Backend Vibecoding

### 1. Не используют транзакции
AI может забыть обернуть связанные операции в транзакцию — проси явно.

### 2. Забывают про индексы
AI может не добавить индексы для часто используемых полей — проси проанализировать запросы.

### 3. Не кешируют данные
Повторные запросы к БД для одних данных — проси AI добавить Redis кеширование.

---

## 🐳 Раздел 11: Мультиконтейнерная архитектура Docker & Базы данных для соло-разработчиков

Для обеспечения стабильного production-окружения соло-разработчику крайне важно автоматизировать развертывание и мониторинг бэкенда с помощью Docker.

### 11.1. Мультиконтейнерная структура (Docker Compose)
Современный стандарт автономного деплоя для соло-разработчика включает 4 связанных сервиса, запускаемых одной командой `docker-compose up -d`:
1. **Приложение (Web App)**: API-сервер на Node.js (Next.js / Express) или Python, содержащий основную логику.
2. **База данных (PostgreSQL)**: Изолированный контейнер БД с персистентным томом (Volume) на хосте для сохранности данных.
3. **Nginx Proxy**: Легковесный обратный прокси (reverse proxy), который:
   - Слушает порты 80/443 и перенаправляет трафик на порт API-приложения.
   - Терминирует SSL (автоматически управляет сертификатами Let's Encrypt через Certbot).
   - Фильтрует нежелательные вредоносные запросы и ограничивает размер загружаемых файлов.
4. **Телеграм-мониторинг (Telebot Monitor)**:
   - Легковесный скрипт-сателлит, имеющий доступ к Docker Socket (`/var/run/docker.sock`).
   - Он слушает события демона Docker: если API-сервер или база данных падает, перезапускается или испытывает нехватку памяти (OOM), скрипт мгновенно отправляет уведомление в Telegram разработчику с логами падения.

#### Пример docker-compose.yml:
```yaml
version: '3.8'

services:
  web-app:
    build: .
    restart: always
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres-db:5432/mydb
    depends_on:
      - postgres-db
    networks:
      - app-network

  postgres-db:
    image: postgres:16-alpine
    restart: always
    volumes:
      - pg-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=mydb
    networks:
      - app-network

  nginx-proxy:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro
    depends_on:
      - web-app
    networks:
      - app-network

  telebot-monitor:
    build: ./monitor
    restart: always
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    environment:
      - TELEGRAM_BOT_TOKEN=12345:token
      - TELEGRAM_CHAT_ID=67890
    networks:
      - app-network

volumes:
  pg-data:

networks:
  app-network:
    driver: bridge
```

### 11.2. Сравнение баз данных для MVP: SQLite vs Serverless PostgreSQL
Для небольших проектов и быстрых тестов не всегда нужно разворачивать тяжелый кластер базы данных.

| Критерий | SQLite (Файловая БД) | Serverless PostgreSQL (Neon / Supabase) |
| :--- | :--- | :--- |
| **Инфраструктура** | **Нулевой оверхед** (БД хранится в одном локальном `.db` файле) | Требует облачного провайдера или Docker-контейнера |
| **Производительность** | Чтение: сверхбыстрое. Запись: блокировка всей БД при записи | Высокая, поддерживает тысячи конкурентных запросов |
| **Резервное копирование** | Мгновенно: скопируйте `.db` файл в облако или бэкап-папку | Требует настройки pg_dump, AWS S3 или встроенных бэкапов |
| **Ветвление баз данных** | Простым копированием файла на хосте | **Мгновенное (Neon Branching API)** |
| **Когда использовать** | Telegram-боты, легкие CLI-утилиты, MVP без высокой нагрузки | Крупные веб-сервисы, высокая конкурентная запись, API |

---

## 📚 AI Tools для Backend

1. **ChatGPT/Claude** — проектирование API и схем БД
2. **Cursor** — AI-powered IDE для backend разработки
3. **GitHub Copilot** — автодополнение кода
4. **Prisma AI** — помощь с Prisma queries

---

**Последнее обновление**: 17.05.2026  
**Статус**: ✅ Оптимизирован для Vibecoding (без практических заданий)  
**Предыдущий уровень**: [L4: Frontend разработка](L4_frontend_development.md)  
**Следующий уровень**: [L6: Интеграции и сервисы](L6_integrations_services.md)
