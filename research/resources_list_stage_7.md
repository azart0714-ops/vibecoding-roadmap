# 📘 ОПТИМИЗИРОВАННЫЙ СПИСОК РЕСУРСОВ: UI/UX И ДИЗАЙН-СИСТЕМЫ (ЭТАП 7)

Этот каталог ресурсов собран специально для ИИ-ассистентов с лимитом контекста (CLN). Он содержит только прямые, верифицированные источники и руководства по созданию высококачественных интерфейсов, адаптированных под генерацию кодом.

---

## 🎨 1. ТАЙЛВИНД И КОМПОНЕНТЫ: ТЕОРИЯ И ПРАКТИКА

*   **Tailwind CSS Official Docs**
    *   *Ссылка*: [tailwindcss.com/docs](https://tailwindcss.com/docs)
    *   *Для ИИ*: Главный справочник классов. ИИ должен использовать его для валидации названий классов (особенно в v3 vs v4).
*   **Shadcn/ui — Design System & Components**
    *   *Ссылка*: [ui.shadcn.com](https://ui.shadcn.com)
    *   *Для ИИ*: Основа копипаст-компонентов. Изучить структуру `components.json` и логику CLI-команд для автоматической установки атомарных блоков.
*   **Radix UI Primitives**
    *   *Ссылка*: [radix-ui.com/primitives](https://www.radix-ui.com/primitives)
    *   *Для ИИ*: Идеальные нестилизованные компоненты с полной поддержкой WAI-ARIA для построения сложных UI-элементов.

---

## ♿ 2. ДОСТУПНОСТЬ (ACCESSIBILITY / A11Y) И WCAG

*   **W3C WCAG 2.1 Guidelines**
    *   *Ссылка*: [w3.org/WAI/WCAG21/quickref](https://www.w3.org/WAI/WCAG21/quickref/)
    *   *Для ИИ*: Справочник стандартов WCAG 2.1 Level AA. ИИ должен обращать особое внимание на:
        *   Минимальный контраст текста (4.5:1 для обычного, 3:1 для крупного).
        *   Размер интерактивных элементов (минимальный touch-target — 44x44px).
        *   Семантическую верстку (aria-label, aria-expanded, role="dialog").
*   **WebAIM Checklist (WCAG 2.1 AA)**
    *   *Ссылка*: [webaim.org/standards/wcag/checklist](https://webaim.org/standards/wcag/checklist)
    *   *Для ИИ*: Контрольный список для тестирования экранных дикторов и навигации с клавиатуры.

---

## 🏎️ 3. UX, PERCEIVED PERFORMANCE & LAYOUT

*   **Core Web Vitals (web.dev)**
    *   *Ссылка*: [web.dev/vitals](https://web.dev/vitals/)
    *   *Для ИИ*: Руководства по оптимизации LCP (Largest Contentful Paint), FID (First Input Delay), CLS (Cumulative Layout Shift).
*   **Skeleton Screens vs Spinners (NN/g)**
    *   *Ссылка*: [nngroup.com/articles/skeleton-screens](https://www.nngroup.com/articles/skeleton-screens/)
    *   *Для ИИ*: Научное обоснование того, почему плейсхолдеры снижают субъективное время ожидания пользователя по сравнению со спиннерами.
*   **Optimistic UI Pattern Guide (Remix/Next.js Docs)**
    *   *Ссылка*: [nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#optimistic-updates](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#optimistic-updates)
    *   *Для ИИ*: Паттерн обновления интерфейса до получения ответа от сервера (хук `useOptimistic`).

---

## 🎬 4. АНИМАЦИЯ И ГЕНЕРАЦИЯ UI

*   **Framer Motion API Reference**
    *   *Ссылка*: [motion.dev](https://motion.dev/)
    *   *Для ИИ*: Декларативный синтаксис анимаций для React. ИИ должен использовать декларативные пропсы (`initial`, `animate`, `exit`, `variants`) вместо прямого манипулирования DOM.
*   **v0.dev by Vercel — AI Prompting Guide**
    *   *Ссылка*: [v0.dev](https://v0.dev)
    *   *Для ИИ*: Лучшие промпты для генерации UI. Использовать плоскую и модульную структуру кода для переноса интерфейсов из v0.dev в Next.js.
