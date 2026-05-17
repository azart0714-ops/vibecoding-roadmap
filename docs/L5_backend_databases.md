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
- **Neon** — serverless PostgreSQL (бесплатно 0.5 GB)
- **Supabase** — PostgreSQL + Auth + Storage (бесплатно 500 MB)
- **Railway** — PostgreSQL + deployment ($5/мес)

📖 **Ресурсы**:
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [Neon](https://neon.tech/)
- [Supabase](https://supabase.com/)

---

### Раздел 3: Prisma ORM

#### 3.1. Концепция
- **Type-safe ORM** — автоматическая генерация типов из схемы
- **Prisma Schema** — декларативное описание моделей БД
- **Prisma Client** — автоматически генерируемый клиент для запросов
- **Migrations** — версионирование изменений схемы БД

#### 3.2. Основные команды
- `prisma init` — инициализация Prisma в проекте
- `prisma migrate dev` — создать и применить миграцию
- `prisma generate` — генерировать Prisma Client
- `prisma studio` — GUI для просмотра данных
- `prisma db push` — синхронизировать схему (для dev)

#### 3.3. Prisma Client операции
- **create** — создание записи
- **findMany** — получение списка
- **findUnique** — получение по уникальному полю
- **update** — обновление записи
- **delete** — удаление записи
- **include** — загрузка связанных данных

📖 **Ресурс**: [Prisma Documentation](https://www.prisma.io/docs)

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
