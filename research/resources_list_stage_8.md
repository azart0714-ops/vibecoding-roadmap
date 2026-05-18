# 📘 ОПТИМИЗИРОВАННЫЙ СПИСОК РЕСУРСОВ: АГЕНТНЫЕ СИСТЕМЫ И SWARM (ЭТАП 8)

Этот справочник ресурсов собран для ИИ-разработчиков и системных архитекторов с ограничением памяти контекста. Он содержит верифицированные ссылки на библиотеки оркестрации, фреймворки автоматического тестирования и паттерны долговременной памяти ИИ-агентов.

---

## 🐝 1. ОРКЕСТРАЦИЯ РОЕВЫХ СИСТЕМ (SWARM ORCHESTRATION)

*   **LangGraph by LangChain**
    *   *Ссылка*: [langchain-ai.github.io/langgraph](https://langchain-ai.github.io/langgraph/)
    *   *Для ИИ*: Справочник по построению циклических мультиагентных графов, систем с обратной связью (feedback loops) и сложной маршрутизации задач (routing).
*   **CrewAI Framework**
    *   *Ссылка*: [docs.crewai.com](https://docs.crewai.com)
    *   *Для ИИ*: Документация по распределению ролей (Role-playing), делегированию задач между агентами (task delegation) и конвейерному выполнению (sequential & hierarchical workflows).
*   **OpenAI Swarm (Experimental)**
    *   *Ссылка*: [github.com/openai/swarm](https://github.com/openai/swarm)
    *   *Для ИИ*: Архитектурный паттерн легких агентов с чистыми функциями передачи управления (handoffs) и вызова инструментов (tool calls).

---

## 🧠 2. АГЕНТНАЯ ПАМЯТЬ И ЗНАНИЯ (RAG & LONG-TERM MEMORY)

*   **Mem0 — The Memory Layer for AI**
    *   *Ссылка*: [github.com/mem0ai/mem0](https://github.com/mem0ai/mem0)
    *   *Для ИИ*: Паттерны долговременной персонализированной памяти, запоминания предпочтений пользователя и истории прошлых сессий.
*   **Temporal Knowledge Graphs in RAG**
    *   *Ссылка*: [arxiv.org/abs/2309.04632](https://arxiv.org/abs/2309.04632)
    *   *Для ИИ*: Академическое исследование построения графов знаний, привязанных ко времени (temporal KGs), для исключения галлюцинаций в исторических данных.

---

## 🎭 3. АВТОМАТИЗАЦИЯ И ТЕСТИРОВАНИЕ (AUTOMATED QUALITY GATES)

*   **Playwright Library Official Docs**
    *   *Ссылка*: [playwright.dev](https://playwright.dev)
    *   *Для ИИ*: API для управления браузерами. ИИ должен использовать Playwright для написания автономных сквозных тестов (E2E), проверяющих реальный UI после генерации кода.
*   **GitHub Actions CI/CD Guides**
    *   *Ссылка*: [docs.github.com/actions](https://docs.github.com/actions)
    *   *Для ИИ*: Паттерны настройки автоматических воркфлоу для проверки тестов, линтинга (`eslint`), сборки (`npm run build`) и автоматической блокировки слияния невалидного кода (branch protection rules).
