# 🛠 АНАЛИЗ ГРУППЫ D: Инструменты и CLI

> **Статус**: В процессе  
> **Источников**: 7  
> **Обработано**: 1/7 (14%)

---

## 📋 СПИСОК ИСТОЧНИКОВ

- [x] **D1**: Every AI Coding CLI in 2026: The Complete Map (30+ Tools) — https://dev.to/soulentheo/every-ai-coding-cli-in-2026-the-complete-map-30-tools-compared-4gob
  - ✅ Создан детальный анализ: `D1_cli_tools_2026_analysis.md`
  - 📊 Извлечено: 30+ инструментов, 5-tier классификация, SWE-bench метрики, Decision Matrix
  - 🎯 Для интеграции в: L0 (обновление таблицы CLI-агентов), L1 (выбор инструмента), L2 (token efficiency), L7 (local deployment)
- [ ] **D2**: Free AI CLI Tools: Gemini vs Codex vs Goose | Termdock — https://www.termdock.com/en/blog/free-ai-cli-tools-ranked
- [ ] **D3**: The 5 Best AI CLI Tools for Coding in 2026: Complete Guide — https://pasqualepillitteri.it/en/news/586/best-ai-cli-tools-coding-2026
- [ ] **D4**: Top 5 CLI coding agents in 2026 - Pinggy — https://pinggy.io/blog/top_cli_based_ai_coding_agents/
- [ ] **D5**: Best AI for Coding (2026): Every Model Ranked by Real Benchmarks - Morph — https://www.morphllm.com/
- [ ] **D6**: How to debug AI generated code? - DEV Community — ariana.dev
- [ ] **D7**: Top Cursor Rules for Coding Agents - PromptHub — https://www.prompthub.us/blog/top-cursor-rules-for-coding-agents

---

## 🎯 ПЛАН ОБРАБОТКИ

Для каждого источника извлечь:

### 1. Сравнительные таблицы инструментов
- Название инструмента
- Базовая модель
- Ключевые возможности
- Цена / лицензия
- Бенчмарки производительности
- Рекомендации по использованию

### 2. Практические команды
- Команды установки
- Примеры использования
- Конфигурация
- Интеграция с другими инструментами

### 3. Best Practices
- Когда использовать какой инструмент
- Оптимизация workflow
- Типичные ошибки
- Советы по отладке

### 4. Cursor Rules
- Примеры эффективных правил
- Структура .cursorrules
- Паттерны и антипаттерны
- Версионирование правил

---

## 📊 ОЖИДАЕМЫЕ РЕЗУЛЬТАТЫ

**Для роадмапа**:
- Обновлённая таблица CLI-агентов 2026
- Сравнение инструментов по категориям
- Рекомендации для каждого уровня L0-L8
- Практические примеры команд
- Чек-листы выбора инструмента

**Для data.js**:
- Новые ресурсы и ссылки
- Обновлённые метрики
- Актуальные цены и лимиты

---

## 📝 ПРИМЕЧАНИЯ

- Фокус на CLI-инструменты (не IDE)
- Приоритет на бесплатные/open-source решения
- Проверка актуальности версий и цен
- Извлечение реальных бенчмарков

---

**Создано**: 2026-05-18 12:12  
**Обновлено**: 2026-05-18 13:09  
**Статус**: В процессе (1/7 завершено)

---

## 📊 ПРОГРЕСС ОБРАБОТКИ

### ✅ D1: Every AI Coding CLI in 2026 (ЗАВЕРШЕНО)

**Ключевые находки**:
1. **5-tier классификация инструментов**:
   - Tier 1: Cloud Subscriptions (7 инструментов: Claude Code, Cursor, Windsurf, Codex, Antigravity, Mistral Vibe, Amp)
   - Tier 2: Genuinely Free (5 инструментов: Gemini CLI, GitHub Copilot CLI, Amazon Q, Kiro, Qwen Code)
   - Tier 3: Open Source BYOK (11 инструментов: OpenCode, Aider, Cline, Continue.dev, Goose, Roo Code, OpenClaw, Zed, iFlow, Kimi Code CLI, BLACKBOX)
   - Tier 4: Truly Local (5 runtimes + 6 моделей)
   - Tier 5: Model Routers (3 инструмента: 9router, CLIProxyAPI, OpenRouter)

2. **SWE-bench Performance**:
   - Claude Code: 80.9% (лучший платный)
   - GLM-5: 77.8% (лучший локальный)
   - Kimi K2.5: 76.8% (второй локальный)

3. **Token Efficiency**:
   - Claude Code: 5.5x меньше токенов vs Cursor
   - MiniMax M2: 8% от цены Claude, 2x скорость

4. **Free Tiers революция**:
   - Gemini CLI: 1,000 запросов/день (фактически unlimited)
   - Qwen Code: полностью бесплатный API
   - CLIProxyAPI: превращает free Gemini в OpenAI-compatible API

5. **Adoption Metrics**:
   - Aider: 4.1M installs, 15B tokens/week
   - Cline: 5M installs (самое популярное open-source расширение)
   - OpenCode: 140K+ GitHub stars

6. **Decision Matrix**: 10 сценариев использования с рекомендациями

**Метрики**: 30+ инструментов, апрель 2026, DEV Community

**Файл анализа**: `research/D1_cli_tools_2026_analysis.md`

---
