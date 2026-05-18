# 📚 СПИСОК РЕСУРСОВ ДЛЯ ВАЙБКОДИНГА (КОНТЕКСТ-ЭФФЕКТИВНЫЙ)

Этот документ содержит сжатый перечень наиболее ценных внешних источников, посвященных вайбкодингу, работе с Claude Code CLI, Cursor, Windsurf и Model Context Protocol (MCP). Предназначен для передачи LLM с ограниченным окном контекста (Cline / CLN).

---

## 🌐 1. ПОДРАЗДЕЛЫ REDDIT (Гайды & Сообщества)

*   **r/ClaudeAI (Anthropic Claude)**
    *   *Фокус*: Инструкции по Claude Code CLI, мета-промптинг, лимиты контекста и prompt caching.
    *   *Основные топики*: Оптимальные конфигурации `CLAUDE.md`, обход лимитов API, стратегии очистки контекста.
*   **r/LocalLLaMA (Локальные модели для кода)**
    *   *Фокус*: Использование локальных LLM (Qwen-2.5-Coder, Llama-3-Code) в Cursor/Windsurf.
    *   *Основные топики*: Настройка Ollama/Llama.cpp, бенчмарки генерации кода, оптимизация задержки (latency).
*   **r/webdev & r/SaaS (Практическая разработка)**
    *   *Фокус*: Свежие стеки для быстрого запуска (Next.js, Supabase, Tailwind, Shadcn).
    *   *Основные топики*: Развертывание (Railway, Vercel), валидация гипотез и PMF-метрики.

---

## 🐙 2. GITHUB AWESOME LISTS (Списки лучших практик)

*   **Awesome AI Coding** (`github.com/topics/awesome-ai-coding`)
    *   *Фокус*: Общий навигатор по инструментам AI-разработки, редакторам и CLI-агентам.
*   **Awesome Code AI** (`github.com/sourcegraph/awesome-code-ai`)
    *   *Фокус*: Каталог инструментов анализа кода, автодополнения и интеллектуального рефакторинга.
*   **Awesome CursorRules & Awesome Cursor Rules MDC**
    *   `github.com/PatrickJS/awesome-cursorrules`
    *   `github.com/sanjeed5/awesome-cursor-rules-mdc`
    *   *Фокус*: База готовых файлов правил `.cursorrules` и `.mdc` для различных языков, фреймворков и архитектур.
*   **Awesome Claude Skills** (`github.com/ComposioHQ/awesome-claude-skills`)
    *   *Фокус*: Переиспользуемые пакеты навыков в формате `SKILL.md` для Claude Code и совместимых агентов.
*   **Awesome Claude Code** (`github.com/hesreallyhim/awesome-claude-code`)
    *   *Фокус*: Шаблоны конфигураций `CLAUDE.md`, полезные CLI-алиасы и интеграции для Claude Code.
*   **Awesome MCP Servers** (`mcpservers.org`)
    *   *Фокус*: Главный каталог серверов Model Context Protocol для расширения возможностей агентов (инструменты поиска, БД, браузеры).

---

## 📖 3. ОФИЦИАЛЬНЫЕ И АВТОРСКИЕ ГАЙДЫ

*   **Blake Crosley Guide to Claude Code** (`blakecrosley.com/guides/claude-code`)
    *   *Фокус*: Практический разбор CLI-ассистента от Anthropic: быстрый старт, горячие клавиши, управление правами выполнения команд.
*   **Anthropic Developer Documentation** (`docs.anthropic.com`)
    *   *Фокус*: Руководства по prompt caching (кеширование контекста), лимитам токенов и системным промптам.
