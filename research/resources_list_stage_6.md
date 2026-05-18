# 🛠 DIRECTORY OF AI-FRIENDLY TECH STACKS & TOOLS (STAGE 6)

---

## ⚡ 1. FRONTEND FRAMEWORKS

*   **Next.js App Router & Server Actions** (`nextjs.org/docs`)
    *   *Фокус*: Двунаправленный сборщик, гибридный рендеринг (RSC/RCC). Server Actions убирают необходимость писать API-роуты.
    *   *AI DX*: Совместное размещение (co-location) серверного и клиентского кода сводит к минимуму переключение между файлами для LLM.
*   **Vite + React Single Page App** (`vite.dev`)
    *   *Фокус*: Ультра-быстрый бандлер для клиентских SPA.
    *   *AI DX*: Отсутствие серверной магии упрощает контекст, идеально для прототипов с нулевым backend-кодом.
*   **Astro Framework** (`astro.build`)
    *   *Фокус*: Идеальный фреймворк для контентных сайтов с нулевым JS по умолчанию.
    *   *AI DX*: Прекрасная семантика разметки, простота интеграции Markdown.

---

## 💾 2. DATABASES & ORMS

*   **Prisma ORM & AI Safety** (`prisma.io/docs/ai/tools/cursor`)
    *   *Фокус*: Декларативная Prisma Schema Language (PSL). CLI-инструмент имеет встроенные ограничители для AI-агентов (AI safety guardrails), защищающие бд от случайного удаления данных при командах `db push`.
    *   *AI DX*: Prisma Studio встроена в редакторы (Cursor/Windsurf). Отличная база обучающих данных LLM (2019-2025).
*   **Drizzle ORM** (`orm.drizzle.team/docs`)
    *   *Фокус*: TypeScript-native ORM без шага кодогенерации (generate).
    *   *AI DX*: Схемы и запросы описываются на чистом TS. Первоклассная интеграция с Edge Runtimes, поддержка row-level security Postgres (`crudPolicy()`).
*   **Neon Serverless Postgres** (`neon.tech/docs/guides/branching`)
    *   *Фокус*: База данных с поддержкой ветвления (database branching).
    *   *AI DX*: Позволяет AI-ассистентам мгновенно клонировать схему бд и тестовые данные для изолированных тестов и верификации.
*   **Supabase PostgreSQL** (`supabase.com/docs/guides/database`)
    *   *Фокус*: Open-source Firebase альтернатива на Postgres с PostgREST и PG-Vector.

---

## 🎨 3. UI, STYLING & COMPONENT DESIGN

*   **Tailwind CSS** (`tailwindcss.com/docs`)
    *   *Фокус*: Атомарный CSS на базе служебных классов (utility classes).
    *   *AI DX*: Самый предсказуемый стек стилизации для ИИ. LLM превосходно компонует и изменяет верстку без создания CSS-файлов.
*   **Shadcn/ui & Radix UI** (`ui.shadcn.com`)
    *   *Фокус*: Copy-paste интерфейсные компоненты прямо в исходный код проекта.
    *   *AI DX*: Модель может напрямую редактировать Tailwind-разметку внутри локального файла компонента, без сложного API абстрактных UI-библиотек (MUI / AntD).

---

## 🔌 4. INFRASTRUCTURE & BACKEND SERVICES

*   **Railway Infrastructure** (`docs.railway.app`)
    *   *Фокус*: Canvas UI для контейнерной инфраструктуры с авто-деплоем.
    *   *AI DX*: Автоматический мониторинг, простое управление переменными окружения, CLI-деплой, поддержка MCP.
*   **Vercel Hosting Platform** (`vercel.com/docs`)
    *   *Фокус*: Лучший деплой-хостинг для Next.js с мгновенными Preview Deployments.
*   **Zustand State Management** (`zustand.dev`)
    *   *Фокус*: Минималистичное стейт-хранилище на хуках для React.
    *   *AI DX*: Избавляет от токен-затратного boilerplate кода (Redux). ИИ пишет логику стейта в 2-3 раза лаконичнее.
*   **Clerk Authentication** (`clerk.com/docs`)
    *   *Фокус*: Полностью готовый, API-first сервис авторизации.
    *   *AI DX*: Быстрая настройка без необходимости ИИ писать сложные роуты шифрования паролей и хранения сессий.
