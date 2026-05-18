# 📊 АНАЛИЗ D1: Every AI Coding CLI in 2026 (30+ Tools)

> **Источник**: https://dev.to/soulentheo/every-ai-coding-cli-in-2026-the-complete-map-30-tools-compared-4gob  
> **Автор**: David Van Assche (S.L)  
> **Дата**: 15 апреля 2026  
> **Статус**: ✅ Обработано

---

## 🎯 КЛЮЧЕВЫЕ ТЕЗИСЫ

1. **Взрывной рост рынка**: За 6 месяцев рынок AI-инструментов перешёл от "нескольких опций" к "overwhelming" — новые CLI каждую неделю
2. **Ценовые войны**: Free-тиры, которые были немыслимы год назад
3. **Китайские модели**: Достигли 77%+ на SWE-bench, конкурируют с западными
4. **30+ инструментов**: Полная карта разбита на 5 уровней (Tiers)

---

## 📊 TIER 1: CLOUD SUBSCRIPTIONS (Платные подписки)

### Топ-7 инструментов с подпиской

| Инструмент | Цена/мес | Модель | Тип | SWE-bench | Особенности |
|------------|----------|--------|-----|-----------|-------------|
| **Claude Code** | $17-20 (Pro)<br>$100-200 (Max) | Claude 4.6 Opus/Sonnet | Terminal agent | **80.9%** | 🏆 1M контекст<br>🏆 5.5x меньше токенов vs Cursor<br>🏆 Hook/plugin система |
| **Cursor** | $16/мес | Multi-model | VS Code fork | Varies | 🏆 Крупнейшее комьюнити<br>🏆 Лучшие tab completions<br>🏆 Самый полированный UX |
| **Windsurf** | $20/мес | Multi-model | IDE | Varies | "Flows" persistent context<br>Подорожал с $15 (март 2026) |
| **Codex CLI** | $20 (ChatGPT Plus) | GPT-5 series | CLI + Desktop | — | Cloud sandbox execution<br>Autonomous agent |
| **Antigravity** | $20 (Pro)<br>$250 (Ultra) | Gemini | Agent IDE | — | Google's entry<br>Parallel agents<br>Built-in Chrome |
| **Mistral Vibe** | $15 (Le Chat Pro) | Devstral 2 | CLI | — | Apache 2.0 source code |
| **Amp** (Sourcegraph) | Free tier ($10/day cap) | Multi-model | CLI + IDE | — | "Deep mode" research<br>No markup на API |

### 💡 Вердикт автора

- **Claude Code** — лучшая capability (1M контекст, лучший SWE-bench, hook-система)
- **Cursor** — лучший UX
- **Windsurf & Antigravity** — ставка на параллельных агентов
- **Codex** — ставка на cloud sandboxing

**Важно**: Token efficiency важнее цены подписки. Claude Code использует 5.5x меньше токенов → реальная разница в стоимости больше, чем $1-4/мес.

---

## 📊 TIER 2: GENUINELY FREE (Реально бесплатные)

| Инструмент | Free Tier | Что получаешь | Upgrade |
|------------|-----------|---------------|---------|
| **Gemini CLI** | **1,000 запросов/день** | Gemini 2.5 Pro/Flash routing<br>Просто логин через Google | Pay-as-you-go |
| **GitHub Copilot CLI** | 50 premium запросов/мес | Deep GitHub integration | $10/мес |
| **Amazon Q Developer** | Free tier | Лучше для AWS-heavy workflows | AWS pricing |
| **Kiro** (Amazon) | Free tier | Spec-driven: генерирует требования до кода<br>Auditable trail | TBD |
| **Qwen Code** | **FREE API (!)** | Alibaba's CLI agent<br>Apache 2.0<br>Полностью бесплатный API | — |

### 💡 Вердикт автора

- **Gemini CLI** — 1,000 бесплатных запросов/день = фактически unlimited для многих
- **Qwen Code** — недооценённый, Alibaba субсидирует для market share

---

## 📊 TIER 3: OPEN SOURCE BYOK (Bring Your Own Key)

Самая большая категория. $0 за подписку — платишь только за API inference.

### Топ-11 инструментов

| Инструмент | GitHub Stars | Тип | Модели | Особенности |
|------------|--------------|-----|--------|-------------|
| **OpenCode** | 140K+ | CLI | 75+ providers | Universal adapter — если модель существует, OpenCode её поддерживает |
| **Aider** | 39K+ | CLI | Any (вкл. local) | 🏆 Git-native<br>🏆 Auto-commits<br>🏆 4.1M installs, 15B tokens/week<br>🏆 Самый зрелый |
| **Cline** | — (5M installs) | VS Code ext | Any | Самое популярное open-source расширение |
| **Continue.dev** | 26K | IDE ext | Any | 🏆 Единственный с полной поддержкой VS Code + JetBrains |
| **Goose** | — | CLI + Desktop | Any + MCP | Block/Square's agent<br>Apache 2.0<br>Native MCP integration |
| **Roo Code** | — | VS Code ext | Any | "When other agents break down"<br>Репутация надёжности на больших multi-file changes |
| **OpenClaw** | — | CLI | GLM, MiniMax, Qwen | Gateway к китайской экосистеме моделей |
| **Zed** | — | Editor | BYOK | Rust-native<br>Fastest editor в категории |
| **iFlow** | — | CLI | Any OpenAI-compatible | SubAgents<br>Controlled file permissions |
| **Kimi Code CLI** | — | CLI | Kimi K2.5 | Moonshot's agent<br>100-agent swarm capability |
| **BLACKBOX** | — | Multi | Proprietary + BYOK | Completions + chat + search |

### 💰 Реальная стоимость BYOK

- **Claude Sonnet**: $3/$15 за миллион токенов
- **Умеренное использование**: $10-15/мес
- **OpenRouter**: сравнение цен 100+ моделей
- **Local модели**: $0

### 💡 Вердикт автора

**Aider** — золотой стандарт для terminal pair-programming. Git-native workflows, чистая история коммитов, работает со всем от GPT до local Ollama.

---

## 📊 TIER 4: TRULY LOCAL (Полностью локальные)

### Inference Runtimes

| Runtime | Лучше для | Усилия | Скорость |
|---------|-----------|--------|----------|
| **Ollama** | Самый простой старт<br>`ollama pull qwen2.5-coder` | Minimal | Good |
| **llama.cpp** | Максимальный контроль<br>Custom compilation для вашего железа | High | Best (tuned) |
| **LM Studio** | Visual model management<br>Side-by-side comparison<br>GUI sliders | Minimal | Good |
| **vLLM** | Production serving<br>PagedAttention (50%+ меньше памяти)<br>2-4x throughput | Medium | Production-grade |
| **Tabby** | Self-hosted copilot<br>Full IDE integration на своей инфре | Medium | Good |

### Лучшие локальные модели (апрель 2026)

| Модель | Параметры | SWE-bench | Лицензия | Запускается на |
|--------|-----------|-----------|----------|----------------|
| **GLM-5** (Zhipu) | 744B MoE (40B active) | **77.8%** | MIT | vLLM / llama.cpp (нужно 80GB+ VRAM) |
| **Kimi K2.5** (Moonshot) | 1T MoE | **76.8%** | Open | Enterprise hardware |
| **Devstral 2** (Mistral) | — | — | Apache 2.0 | Ollama, llama.cpp |
| **Qwen 2.5 Coder** (Alibaba) | 7B-72B | — | Apache 2.0 | Ollama (7B на ноутбуке, 32B на десктопе) |
| **MiniMax M2** | 230B MoE (10B active) | — | Open | 8% от цены Claude, 2x скорость |
| **DeepSeek Coder V2** | Various | — | MIT | Ollama, llama.cpp |

### 💡 Рекомендации автора

- **Для ноутбука**: Qwen 2.5 Coder 7B или DeepSeek Coder V2 7B через Ollama (работает на 16GB RAM)
- **Для десктопа с GPU**: Qwen 2.5 Coder 32B через Ollama (RTX 3060 12GB)
- **Для сервера**: GLM-5 или Kimi K2.5 через vLLM (конкурируют с Claude на coding benchmarks)

---

## 📊 TIER 5: MODEL ROUTERS (Роутеры моделей)

| Router | Что делает |
|--------|------------|
| **9router** | Подключает 40+ провайдеров к Claude Code, Cursor, Copilot, Antigravity |
| **CLIProxyAPI** | Оборачивает Gemini CLI, Codex, Claude Code как OpenAI-compatible API<br>🔥 Используй бесплатные Gemini модели через любой инструмент |
| **OpenRouter** | Universal API gateway<br>Сравнение цен 100+ моделей<br>Pay-per-token |

### 💡 Вердикт автора

**CLIProxyAPI — дикая штука**: оборачивает free tier Gemini CLI как OpenAI-compatible API → можно использовать Gemini 2.5 Pro через Aider, Cline или любой OpenAI-compatible инструмент — **бесплатно**.

---

## 🎯 QUICK DECISION MATRIX

| Если хочешь... | Используй |
|----------------|-----------|
| Лучшая capability, цена не важна | **Claude Code (Max)** |
| Лучший бесплатный опыт | **Gemini CLI** |
| Лучший open-source CLI | **Aider** |
| Лучший IDE опыт | **Cursor** |
| Лучше для команд | **Continue.dev** (VS Code + JetBrains) |
| Zero cloud dependency | **Ollama + Qwen 2.5 Coder** |
| Доступ к китайским моделям | **OpenClaw** |
| Planning перед кодингом | **Kiro** |
| Git-native workflows | **Aider** |
| Параллельные агенты | **Antigravity** или **Windsurf** |

---

## 📈 КЛЮЧЕВЫЕ МЕТРИКИ И ЦИФРЫ

### SWE-bench Performance
- **Claude Code**: 80.9% (лучший результат среди платных)
- **GLM-5**: 77.8% (лучший локальный)
- **Kimi K2.5**: 76.8% (второй локальный)

### Adoption Metrics
- **Aider**: 4.1M installs, 15B tokens/week
- **Cline**: 5M installs (самое популярное open-source расширение)
- **OpenCode**: 140K+ GitHub stars

### Token Efficiency
- **Claude Code**: 5.5x меньше токенов vs Cursor
- **MiniMax M2**: 8% от цены Claude, 2x скорость

### Free Tiers
- **Gemini CLI**: 1,000 запросов/день (фактически unlimited)
- **Qwen Code**: Полностью бесплатный API (!)
- **GitHub Copilot CLI**: 50 premium запросов/мес

---

## 🔑 КРИТИЧЕСКИЕ ИНСАЙТЫ

### 1. Token Efficiency > Subscription Price
Claude Code дороже Cursor на $1-4/мес, но использует 5.5x меньше токенов → реальная экономия больше.

### 2. Китайские модели конкурируют с западными
GLM-5 (77.8%) и Kimi K2.5 (76.8%) на SWE-bench близки к Claude Code (80.9%).

### 3. Free Tiers стали реально usable
Gemini CLI (1,000 req/day) и Qwen Code (free API) — не "trial", а полноценные рабочие инструменты.

### 4. BYOK — самая большая категория
Open-source инструменты с BYOK доминируют по количеству опций.

### 5. CLIProxyAPI — game changer
Превращает free Gemini CLI в OpenAI-compatible API → бесплатный доступ к Gemini 2.5 Pro через любой инструмент.

---

## 🎯 ДЛЯ ИНТЕГРАЦИИ В РОАДМАП

### L0: Fundamentals
- ✅ Обновить таблицу CLI-агентов 2026 (30+ инструментов)
- ✅ Добавить 5-tier классификацию
- ✅ Метрики: SWE-bench, adoption, token efficiency

### L1: Planning
- Добавить раздел "Выбор инструмента" с Decision Matrix
- Сравнение BYOK vs Subscription vs Local

### L2: Vibecoding Principles
- Token efficiency как принцип (Claude Code 5.5x)
- Git-native workflows (Aider как эталон)

### L3-L4: Advanced Techniques
- Model routers (9router, CLIProxyAPI, OpenRouter)
- Multi-agent setups (Antigravity, Windsurf)

### L7: Deployment & Production
- Local deployment (Ollama, vLLM, Tabby)
- Self-hosted solutions для enterprise

---

## 📝 ЦИТАТЫ ДЛЯ ИСПОЛЬЗОВАНИЯ

> "The AI coding tool market went from 'a few options' to 'overwhelming' in about six months."

> "Token efficiency matters more than subscription price. Claude Code using 5.5x fewer tokens than Cursor means the real cost difference is bigger than the $1-4/mo subscription gap suggests."

> "Gemini CLI at 1,000 free requests/day is the story here. For many developers, this is effectively unlimited."

> "Aider remains the gold standard for terminal pair-programming. Git-native workflows, clean commit history, works with everything from GPT to local Ollama models."

> "CLIProxyAPI is wild: it wraps Gemini CLI's free tier as an OpenAI-compatible API, which means you can use Gemini 2.5 Pro through Aider, Cline, or any OpenAI-compatible tool — for free."

---

## 🔗 СВЯЗАННЫЕ ИСТОЧНИКИ

- Sequel к: [The best (free - cheap) AI friendly CLI and Coding environments](https://dev.to/soulentheo/the-best-free-cheap-ai-friendly-cli-and-coding-environments-16m6)
- Анонсированы продолжения:
  - Part 2: Running AI Coding Agents for Free (deep dive в BYOK, local models)
  - Part 3: What Every AI Coding Tool Gets Wrong (measurement gap)

---

**Создано**: 2026-05-18 13:08  
**Статус**: ✅ Готово к интеграции  
**Приоритет**: 🔥 Высокий (актуальные данные апреля 2026)
