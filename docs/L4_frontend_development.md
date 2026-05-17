# L4: Frontend разработка

## 🎯 Цель уровня

Освоить современный frontend стек для создания интерактивных веб-приложений с AI.

**Ключевой принцип**: Компонентный подход и переиспользование кода.

**Философия уровня**: Пиши один раз, используй везде.

---

## 🧠 Ключевые концепции

### 1. Компонентная архитектура
Все UI разбивается на переиспользуемые компоненты.

### 2. Декларативный подход
Описываешь что хочешь видеть, а не как это сделать.

### 3. Server-first рендеринг
Максимум работы на сервере, минимум JavaScript на клиенте.

### 4. Типобезопасность
TypeScript ловит ошибки до запуска кода.

### 5. Utility-first стилизация
Tailwind CSS вместо написания CSS вручную.

### 6. Accessibility-first
Доступность для всех пользователей с самого начала.

---

## 📚 Теоретическая база

### Раздел 1: HTML/CSS/JavaScript фундамент

#### 1.1. Современный HTML5
- **Семантические теги** — используй `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>` для правильной структуры
- **Accessibility атрибуты** — `aria-label`, `aria-describedby`, `role` для доступности

📖 **Ресурс**: [MDN HTML Reference](https://developer.mozilla.org/en-US/docs/Web/HTML)

#### 1.2. CSS основы
- **Flexbox** — для одномерных layouts (строка или колонка)
- **Grid** — для двумерных layouts (строки и колонки одновременно)
- **Custom Properties** — CSS переменные для переиспользования значений

📖 **Ресурс**: [CSS Tricks Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

#### 1.3. JavaScript ES6+
**Ключевые фичи для освоения**:
- Arrow functions — краткий синтаксис функций
- Destructuring — извлечение значений из объектов и массивов
- Spread operator — копирование и объединение данных
- Template literals — строки с интерполяцией
- Async/await — работа с асинхронным кодом
- Modules — import/export для организации кода

📖 **Ресурс**: [JavaScript.info](https://javascript.info/)

---

### Раздел 2: React основы

#### 2.1. Компоненты и JSX
- **Функциональные компоненты** — основа современного React
- **Props** — передача данных между компонентами
- **Children** — вложенные элементы для композиции

📖 **Ресурс**: [React Documentation](https://react.dev/)

#### 2.2. Hooks
**Основные hooks для управления состоянием и эффектами**:
- `useState` — локальное состояние компонента
- `useEffect` — побочные эффекты (API calls, subscriptions)
- `useContext` — доступ к глобальному состоянию
- `useRef` — ссылки на DOM элементы
- `useMemo` — мемоизация вычислений для оптимизации
- `useCallback` — мемоизация функций для предотвращения ре-рендеров

#### 2.3. Server Components (React 18+)
- **RSC** — компоненты, которые рендерятся только на сервере
- **Преимущества** — меньше JavaScript на клиенте, быстрее загрузка, прямой доступ к БД

📖 **Ресурс**: [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)

---

### Раздел 3: Next.js 14

#### 3.1. App Router
- **File-based routing** — структура папок определяет URL
- **page.tsx** — файл для создания страницы
- **layout.tsx** — общий layout для группы страниц
- **[slug]** — динамические параметры в URL
- **route.ts** — API endpoints

#### 3.2. Ключевые фичи
- **Server Components по умолчанию** — оптимальная производительность
- **API Routes** — backend в том же проекте
- **Image Optimization** — автоматическая оптимизация изображений
- **Font Optimization** — встроенная оптимизация шрифтов
- **Metadata API** — управление SEO

📖 **Ресурс**: [Next.js Documentation](https://nextjs.org/docs)

---

### Раздел 4: TypeScript

#### 4.1. Основы типов
- **Примитивные типы** — `string`, `number`, `boolean`, `null`, `undefined`
- **Объекты и массивы** — `interface`, `type`, `Array<T>`
- **Union types** — `string | number` для нескольких возможных типов
- **Generics** — `Array<T>`, `Promise<T>` для переиспользуемых типов

#### 4.2. React + TypeScript
- **Типизация props** — определяй интерфейсы для props компонентов
- **Типизация событий** — правильные типы для onClick, onChange и т.д.
- **Типизация hooks** — useState<T>, useRef<T> для type safety

📖 **Ресурс**: [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

---

### Раздел 5: Tailwind CSS

#### 5.1. Utility-first подход
- **Spacing** — `p-4`, `m-2`, `px-6`, `py-3` для отступов
- **Colors** — `bg-blue-500`, `text-gray-900` для цветов
- **Flexbox** — `flex`, `justify-center`, `items-center` для выравнивания
- **Grid** — `grid`, `grid-cols-3`, `gap-4` для сеток
- **Responsive** — `md:flex`, `lg:grid-cols-4` для адаптивности

#### 5.2. Преимущества
- Не нужно писать CSS вручную
- Консистентный дизайн из коробки
- Responsive дизайн с префиксами
- Автоматическое удаление неиспользуемых стилей

📖 **Ресурс**: [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

### Раздел 6: Shadcn/ui

#### 6.1. Концепция
- **Copy-paste компоненты** — не npm пакет, а копируются в проект
- **Полностью кастомизируемые** — можешь менять как угодно
- **Accessibility из коробки** — ARIA атрибуты и keyboard navigation
- **Построены на Radix UI** — надежные примитивы

#### 6.2. Основные компоненты
- Button, Input, Dialog, Dropdown Menu, Select, Tabs, Toast и другие
- Все компоненты типизированы и доступны

📖 **Ресурс**: [Shadcn/ui Documentation](https://ui.shadcn.com/)

---

### Раздел 7: State Management

#### 7.1. React Context
- **Для простых случаев** — глобальное состояние без библиотек
- **Подходит для** — темы, локализации, данных пользователя

#### 7.2. Zustand
- **Легкий state manager** — минимальный boilerplate
- **Преимущества** — простой API, TypeScript support, хорошая производительность

#### 7.3. React Query (TanStack Query)
- **Для server state** — данные с API
- **Преимущества** — кеширование, автоматическое обновление, оптимистичные обновления, retry логика

📖 **Ресурсы**:
- [Zustand](https://zustand-demo.pmnd.rs/)
- [TanStack Query](https://tanstack.com/query/latest)

---

### Раздел 8: Forms и валидация

#### 8.1. React Hook Form
- **Минимальные ре-рендеры** — оптимальная производительность
- **Простой API** — легко использовать
- **TypeScript support** — полная типизация

#### 8.2. Zod
- **Schema validation** — декларативное описание правил
- **TypeScript-first** — автоматический вывод типов
- **Композируемые схемы** — переиспользование валидации
- **Отличные error messages** — понятные сообщения об ошибках

📖 **Ресурсы**:
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

---

### Раздел 9: Routing и Navigation

#### 9.1. Next.js Router
- **Link компонент** — декларативная навигация с prefetching
- **useRouter hook** — программная навигация
- **Dynamic Routes** — параметры в URL через [slug]
- **Catch-all routes** — [...slug] для вложенных путей

📖 **Ресурс**: [Next.js Routing](https://nextjs.org/docs/app/building-your-application/routing)

---

### Раздел 10: Performance оптимизация

#### 10.1. Code Splitting
- **Dynamic import** — загрузка компонентов по требованию
- **Автоматический splitting** — Next.js делает это за тебя

#### 10.2. Image Optimization
- **next/image** — автоматическая оптимизация, lazy loading, responsive images
- **Priority** — для above-the-fold изображений

#### 10.3. Мемоизация
- **React.memo** — предотвращает ре-рендеры компонентов
- **useMemo** — кеширует результаты вычислений
- **useCallback** — кеширует функции для стабильных ссылок

📖 **Ресурс**: [React Performance](https://react.dev/learn/render-and-commit)

---

## ✅ Чек-лист освоения L4

### Основы
- [ ] Знаю HTML5 семантические теги
- [ ] Понимаю Flexbox и Grid
- [ ] Умею работать с JavaScript ES6+
- [ ] Понимаю async/await

### React
- [ ] Создаю функциональные компоненты
- [ ] Использую основные hooks
- [ ] Понимаю props и state
- [ ] Знаю lifecycle компонентов

### Next.js
- [ ] Создал проект с App Router
- [ ] Понимаю file-based routing
- [ ] Использую Server Components
- [ ] Создаю API routes

### TypeScript
- [ ] Типизирую компоненты
- [ ] Создаю interfaces и types
- [ ] Использую generics
- [ ] Понимаю union types

### Стилизация
- [ ] Использую Tailwind CSS
- [ ] Установил Shadcn/ui
- [ ] Создаю responsive layouts
- [ ] Понимаю utility-first подход

### Продвинутое
- [ ] Использую state management (Zustand/Context)
- [ ] Работаю с формами (React Hook Form + Zod)
- [ ] Оптимизирую производительность
- [ ] Понимаю accessibility

---

## 📖 Ресурсы для изучения

### Документация
- [React Documentation](https://react.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Компоненты
- [Shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Headless UI](https://headlessui.com/)

### Инструменты
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://zustand-demo.pmnd.rs/)

---

## 💡 Pro Tips

### 1. Используй Server Components по умолчанию
Добавляй `'use client'` только когда нужна интерактивность (hooks, события).

### 2. Создай Design System рано
Определи цвета, шрифты, spacing в начале проекта для консистентности.

### 3. Используй TypeScript strict mode
Ловит больше ошибок на этапе разработки, экономит время на отладке.

### 4. Оптимизируй изображения
Всегда используй `next/image` вместо `<img>` для автоматической оптимизации.

### 5. Тестируй accessibility
Используй keyboard navigation и screen readers для проверки доступности.

### 6. Используй React DevTools Profiler
Находи узкие места в производительности компонентов.

---

## ⚠️ Частые ошибки

### 1. Использование 'use client' везде
**Проблема**: Все компоненты становятся клиентскими, теряется преимущество SSR.

**Решение**: Используй Server Components по умолчанию, добавляй `'use client'` только когда нужны hooks или интерактивность.

### 2. Не используют TypeScript strict mode
**Проблема**: Пропускаются ошибки типов, которые проявляются в runtime.

**Решение**: Включи `"strict": true` в tsconfig.json для максимальной проверки типов.

### 3. Inline styles вместо Tailwind
**Проблема**: Нет консистентности, сложно поддерживать, нет переиспользования.

**Решение**: Используй Tailwind classes или CSS modules для стилизации.

### 4. Не мемоизируют тяжелые вычисления
**Проблема**: Компоненты пересчитывают данные при каждом рендере, замедляя UI.

**Решение**: Используй `useMemo` для кеширования результатов дорогих вычислений.

### 5. Забывают про loading и error states
**Проблема**: Плохой UX при загрузке или ошибках, пользователь не понимает что происходит.

**Решение**: Всегда обрабатывай loading, error и empty states в компонентах.

---

## 🔧 Продвинутые паттерны

### 1. Compound Components
Компоненты, которые работают вместе через общий контекст (например, Tabs с TabsList, TabsTrigger, TabsContent).

### 2. Render Props
Паттерн для переиспользования логики через функцию в props.

### 3. Custom Hooks
Извлечение переиспользуемой логики в отдельные hooks (например, useLocalStorage, useDebounce).

### 4. Higher-Order Components (HOC)
Функции, которые принимают компонент и возвращают новый компонент с дополнительной функциональностью.

---

## 🎨 Advanced Tailwind

### 1. Custom Design Tokens
Расширяй tailwind.config.js своими цветами, spacing, анимациями для уникального дизайна.

### 2. Component Variants с CVA
Используй class-variance-authority для создания компонентов с вариантами (size, variant).

---

## 🚀 Next.js 14 Advanced Features

### 1. Server Actions
Функции, которые выполняются на сервере и могут быть вызваны из форм без API routes.

### 2. Parallel Routes
Одновременный рендеринг нескольких страниц в одном layout (например, dashboard с analytics и team).

### 3. Intercepting Routes
Перехват навигации для показа модальных окон без изменения URL.

### 4. Route Groups
Организация routes в группы без влияния на URL структуру.

---

## 📊 Performance Optimization

### 1. Bundle Analysis
Анализируй размер бандла с @next/bundle-analyzer для поиска больших зависимостей.

### 2. React Compiler (Experimental)
Автоматическая оптимизация компонентов без ручной мемоизации.

### 3. Streaming SSR
Постепенная отправка HTML с сервера с использованием Suspense.

### 4. Partial Prerendering (PPR)
Комбинация статического и динамического контента на одной странице.

---

## ♿ Accessibility Best Practices

### 1. Semantic HTML
Используй правильные HTML элементы (button вместо div с onClick).

### 2. ARIA Attributes
Добавляй aria-label, aria-expanded, aria-controls для screen readers.

### 3. Keyboard Navigation
Обеспечь полную навигацию с клавиатуры (Tab, Enter, Escape, стрелки).

### 4. Focus Management
Управляй фокусом при открытии модальных окон и навигации.

---

## 🧪 Testing Frontend

### 1. Vitest для Unit тестов
Быстрый test runner для компонентов и функций.

### 2. Playwright для E2E
End-to-end тестирование пользовательских сценариев в браузере.

---

## 📱 Responsive Design

### 1. Mobile-First Approach
Начинай дизайн с мобильной версии, затем расширяй для больших экранов.

### 2. Container Queries (Experimental)
Адаптивность на основе размера контейнера, а не viewport.

### 3. Responsive Images
Используй sizes и srcset для оптимальной загрузки изображений на разных устройствах.

---

## 🤖 Frontend с AI (Vibecoding)

### 1. Генерация компонентов
Описывай AI что нужно: структуру, props, стилизацию, accessibility — получай готовый компонент.

### 2. Рефакторинг
Проси AI оптимизировать производительность, улучшить accessibility, найти ошибки.

### 3. Design System
AI может создать полный набор design tokens и базовых компонентов по описанию.

### 4. Отладка
Показывай AI ошибки и код — получай объяснение причины и решение.

### 5. Генерация тестов
AI создаст тесты для компонента, покрывая разные сценарии и edge cases.

---

## 🎯 Vibecoding Workflow

### Этап 1: Планирование
Опиши AI дизайн или требования — получи структуру компонентов, props, состояние.

### Этап 2: Создание
Итеративно создавай компоненты: структура → стилизация → интерактивность → валидация → оптимизация.

### Этап 3: Интеграция
AI поможет правильно соединить компоненты, настроить data flow и state management.

### Этап 4: Оптимизация
Проверь с AI: bundle size, images, lazy loading, caching, Core Web Vitals.

---

## 💎 Pro Tips для Vibecoding

### 1. Code review с AI
После написания проси AI проверить best practices, performance, security, accessibility.

### 2. Генерация вариантов
Проси AI создать несколько вариантов дизайна компонента для выбора лучшего.

### 3. Автоматизация
AI может создать скрипты для генерации новых компонентов с нужной структурой.

### 4. Документация
AI создаст документацию с описанием, props таблицей, примерами использования.

### 5. Типы из API
Покажи AI API response — получи TypeScript типы и Zod схемы.

---

## 🚨 Частые ошибки в Vibecoding

### 1. Слишком большие компоненты
AI может создать монолитный компонент — проси разбить на более мелкие части.

### 2. Отсутствие error boundaries
Один сломанный компонент не должен ронять всё приложение — добавляй error boundaries.

### 3. Игнорирование loading states
Всегда добавляй skeleton screens для лучшего UX при загрузке.

### 4. Неоптимизированные изображения
Используй next/image вместо обычного img для автоматической оптимизации.

---

## 📚 AI Tools для Frontend

1. **v0.dev** — генерация UI компонентов от Vercel
2. **Cursor** — AI-powered IDE для разработки
3. **GitHub Copilot** — code completion в реальном времени
4. **ChatGPT/Claude** — архитектурные решения и консультации
5. **Midjourney/DALL-E** — генерация изображений для прототипов

---

**Последнее обновление**: 17.05.2026  
**Статус**: ✅ Оптимизирован для Vibecoding (без практических заданий)  
**Предыдущий уровень**: [L3: Профессиональная среда](L3_professional_environment.md)  
**Следующий уровень**: [L5: Backend и БД](L5_backend_databases.md)
