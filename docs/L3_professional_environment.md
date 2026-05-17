# L3: Профессиональная рабочая среда

## 🎯 Цель уровня

Настроить профессиональную рабочую среду для эффективной разработки с AI. Правильные инструменты увеличивают продуктивность в 10x.

**Ключевой принцип**: Инструменты должны помогать, а не мешать.

**Философия уровня**: Один раз настроил правильно — работаешь быстро всегда.

---

## 🧠 Ключевые концепции

### 1. IDE как центр управления
Все инструменты интегрированы в одном месте. Современная IDE — это не просто текстовый редактор, а полноценная операционная система для разработки. Вместо переключения между десятками приложений, всё доступно из одного окна: редактор кода, терминал, Git, отладчик, база данных, API тестирование.

**Принцип**: Минимизация контекстных переключений = максимальная продуктивность.

### 2. AI-first подход
Расширения и инструменты для работы с AI. В 2026 году разработка без AI — как вождение без GPS. AI помогает на каждом этапе: генерация кода, рефакторинг, поиск багов, написание тестов, документация. Важно выбрать правильные AI инструменты и научиться эффективно с ними работать.

**Принцип**: AI — это не замена разработчика, а усилитель его возможностей.

### 3. Автоматизация рутины
Форматирование, линтинг, тесты — автоматически. Всё, что можно автоматизировать, должно быть автоматизировано. Форматирование кода при сохранении, проверка ошибок в реальном времени, автоматический запуск тестов перед коммитом — это освобождает мозг для решения реальных задач.

**Принцип**: Если делаешь что-то больше 3 раз — автоматизируй.

### 4. Быстрая навигация
Hotkeys и shortcuts для всего. Профессиональный разработчик использует клавиатуру в 10 раз чаще мыши. Знание горячих клавиш — это не просто удобство, это разница между 2 часами и 20 минутами на задачу.

**Принцип**: Каждое действие мышью — это потерянная секунда.

### 5. Визуальная обратная связь
Видишь ошибки и предупреждения сразу. Не нужно запускать компилятор или тесты, чтобы увидеть проблему. Ошибки подсвечиваются прямо в коде, типы проверяются на лету, неиспользуемые импорты выделяются серым.

**Принцип**: Чем раньше увидел ошибку, тем дешевле её исправить.

### 6. Workspace как единица работы
Не файлы, не папки, а workspace. Workspace содержит настройки, расширения, задачи, конфигурации для конкретного проекта. Переключился на другой проект — автоматически загрузились нужные настройки.

**Принцип**: Каждый проект — это отдельная вселенная со своими правилами.

### 7. Контекстная осведомлённость
IDE знает о твоём проекте всё. Она понимает структуру кода, зависимости между модулями, типы данных, используемые библиотеки. Это позволяет давать умные подсказки, автодополнение, рефакторинг.

**Принцип**: Чем больше IDE знает о проекте, тем лучше она помогает.

### 8. Расширяемость через плагины
Базовая IDE — это фундамент. Расширения — это надстройка под твои нужды. React разработчику нужны одни инструменты, backend разработчику — другие. Важно не перегружать IDE ненужными расширениями.

**Принцип**: Устанавливай только то, что реально используешь.

### 9. Синхронизация между устройствами
Настройки, расширения, сниппеты — всё синхронизируется. Работаешь на MacBook, потом переключаешься на десктоп — всё идентично. Это экономит часы на настройку новых машин.

**Принцип**: Настрой один раз, используй везде.

### 10. Производительность превыше красоты
Красивая IDE, которая тормозит — это плохая IDE. Скорость отклика, быстрый запуск, мгновенный поиск — это важнее анимаций и эффектов.

**Принцип**: Если IDE тормозит — что-то не так.

---

## 📚 Теоретическая база

### Раздел 1: Выбор и настройка IDE

#### 1.1. VS Code — базовая IDE

**Почему VS Code**: Бесплатная, 50,000+ расширений, быстрая, Git интеграция

**Установка**:
```bash
# macOS
brew install --cask visual-studio-code

# Windows
winget install Microsoft.VisualStudioCode

# Linux
sudo snap install code --classic
```

#### 1.2. Cursor — AI-first IDE

**Почему Cursor**: Встроенный AI, контекст проекта, быстрые правки

**Установка**:
```bash
# macOS
brew install --cask cursor

# Или скачай с cursor.sh
```

**Ключевые фичи**:
- `Cmd+K` — AI редактирование
- `Cmd+L` — AI чат с контекстом
- `Cmd+Shift+L` — Composer (мультифайловое редактирование)

#### 1.3. Windsurf (Codeium)

**Альтернатива Cursor**: Бесплатная AI IDE

📖 **Ресурс**: [windsurf.ai](https://windsurf.ai)

---

### Раздел 2: Обязательные расширения VS Code

#### 2.1. Для разработки

**Базовые**:
- **ESLint** — линтинг JavaScript/TypeScript
- **Prettier** — форматирование кода
- **GitLens** — расширенная Git интеграция
- **Error Lens** — ошибки прямо в коде

**Установка**:
```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension eamodio.gitlens
code --install-extension usernamehw.errorlens
```

#### 2.2. Для AI работы

- **GitHub Copilot** — AI автодополнение
- **Continue** — open-source AI assistant
- **Codeium** — бесплатная альтернатива Copilot

#### 2.3. Для продуктивности

- **Auto Rename Tag** — автоматическое переименование парных тегов
- **Path Intellisense** — автодополнение путей
- **Import Cost** — показывает размер импортов
- **Todo Tree** — управление TODO комментариями

---

### Раздел 3: Настройка терминала

#### 3.1. Современный терминал

**macOS**: iTerm2 + Oh My Zsh
```bash
brew install --cask iterm2
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

**Windows**: Windows Terminal + PowerShell
```bash
winget install Microsoft.WindowsTerminal
```

#### 3.2. Полезные алиасы

```bash
# ~/.zshrc или ~/.bashrc
alias gs="git status"
alias gp="git push"
alias gc="git commit -m"
alias gco="git checkout"
alias dev="npm run dev"
alias build="npm run build"
```

#### 3.3. Starship prompt

**Красивый и информативный prompt**:
```bash
brew install starship
echo 'eval "$(starship init zsh)"' >> ~/.zshrc
```

📖 **Ресурс**: [starship.rs](https://starship.rs)

---

### Раздел 4: Git клиенты

#### 4.1. Командная строка (основа)

**Базовые команды**:
```bash
git status
git add .
git commit -m "message"
git push
git pull
git log --oneline --graph
```

#### 4.2. GitKraken (GUI)

**Визуальный Git клиент**:
```bash
brew install --cask gitkraken
```

**Преимущества**: Визуализация веток, drag-and-drop, встроенный merge tool

#### 4.3. GitHub Desktop

**Простой клиент от GitHub**:
```bash
brew install --cask github
```

---

### Раздел 5: Инструменты для API

#### 5.1. Postman

**Тестирование API endpoints**:
```bash
brew install --cask postman
```

**Альтернативы**:
- **Insomnia** — легче и быстрее
- **Thunder Client** — расширение VS Code
- **curl** — командная строка

#### 5.2. Примеры использования curl

```bash
# GET запрос
curl https://api.example.com/users

# POST запрос
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com"}'

# С авторизацией
curl -H "Authorization: Bearer TOKEN" \
  https://api.example.com/protected
```

---

### Раздел 6: Database клиенты

#### 6.1. Prisma Studio

**Встроенный GUI для Prisma**:
```bash
npx prisma studio
```

#### 6.2. TablePlus

**Универсальный DB клиент**:
```bash
brew install --cask tableplus
```

**Поддержка**: PostgreSQL, MySQL, SQLite, Redis, MongoDB

#### 6.3. pgAdmin (для PostgreSQL)

```bash
brew install --cask pgadmin4
```

---

### Раздел 7: Productivity инструменты

#### 7.1. Raycast (macOS)

**Замена Spotlight с суперсилами**:
```bash
brew install --cask raycast
```

**Фичи**: Быстрый запуск, калькулятор, clipboard history, snippets

#### 7.2. Rectangle (управление окнами)

```bash
brew install --cask rectangle
```

**Hotkeys**: `Cmd+Opt+Left/Right/Up/Down` для размещения окон

#### 7.3. CleanShot X (скриншоты)

**Профессиональные скриншоты**:
```bash
brew install --cask cleanshot
```

---

### Раздел 8: Браузерные инструменты

#### 8.1. Chrome DevTools

**Основные панели**:
- **Elements** — инспектирование HTML/CSS
- **Console** — JavaScript консоль
- **Network** — мониторинг запросов
- **Application** — localStorage, cookies, cache

**Hotkeys**:
- `Cmd+Opt+I` — открыть DevTools
- `Cmd+Shift+C` — инспектор элементов
- `Cmd+Opt+J` — консоль

#### 8.2. React DevTools

**Расширение для React**:
- Инспектирование компонентов
- Просмотр props и state
- Профилирование производительности

#### 8.3. Полезные расширения

- **JSON Viewer** — красивое отображение JSON
- **Wappalyzer** — определение технологий сайта
- **ColorZilla** — пипетка для цветов
- **Lighthouse** — аудит производительности

---

### Раздел 9: Менеджеры пакетов

#### 9.1. npm (Node Package Manager)

**Базовые команды**:
```bash
npm init                    # Создать package.json
npm install package-name    # Установить пакет
npm install -D package-name # Dev dependency
npm uninstall package-name  # Удалить пакет
npm update                  # Обновить пакеты
npm run script-name         # Запустить скрипт
```

#### 9.2. pnpm (быстрее npm)

**Установка**:
```bash
npm install -g pnpm
```

**Преимущества**: Быстрее, экономит место на диске

#### 9.3. Homebrew (macOS/Linux)

**Установка**:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Команды**:
```bash
brew install package-name
brew install --cask app-name
brew update
brew upgrade
```

---

### Раздел 10: Автоматизация и скрипты

#### 10.1. package.json scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --fix",
    "format": "prettier --write .",
    "test": "vitest",
    "test:e2e": "playwright test",
    "db:push": "prisma db push",
    "db:studio": "prisma studio"
  }
}
```

#### 10.2. Husky (Git hooks)

**Автоматические проверки перед коммитом**:
```bash
npm install -D husky
npx husky init
```

**Пример pre-commit hook**:
```bash
#!/bin/sh
npm run lint
npm run test
```

#### 10.3. lint-staged

**Линтинг только измененных файлов**:
```bash
npm install -D lint-staged
```

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

---

## ✅ Чек-лист освоения L3

### IDE и редакторы
- [ ] Установил и настроил VS Code или Cursor
- [ ] Настроил обязательные расширения (ESLint, Prettier, GitLens, Error Lens)
- [ ] Изучил топ-20 hotkeys для быстрой навигации
- [ ] Настроил автосохранение и форматирование на сохранение
- [ ] Создал workspace для проектов
- [ ] Настроил синхронизацию настроек между устройствами
- [ ] Понимаю разницу между VS Code, Cursor и Windsurf

### Терминал и CLI
- [ ] Установил современный терминал (iTerm2/Windows Terminal)
- [ ] Настроил Oh My Zsh или Starship prompt
- [ ] Создал полезные алиасы для частых команд
- [ ] Умею работать с Git из командной строки
- [ ] Установил CLI инструменты (fzf, ripgrep, bat, exa)
- [ ] Настроил удобную навигацию по истории команд

### Инструменты разработки
- [ ] Установил Git клиент (GitKraken/GitHub Desktop)
- [ ] Установил API клиент (Postman/Insomnia/Thunder Client)
- [ ] Установил DB клиент (TablePlus/Prisma Studio)
- [ ] Настроил productivity инструменты (Raycast/Rectangle)
- [ ] Понимаю когда использовать GUI, а когда CLI

### Браузер и DevTools
- [ ] Умею пользоваться Chrome DevTools (Elements, Console, Network)
- [ ] Установил и использую React DevTools
- [ ] Установил полезные расширения (JSON Viewer, Wappalyzer, Lighthouse)
- [ ] Умею отлаживать JavaScript с breakpoints
- [ ] Понимаю как анализировать network requests
- [ ] Умею профилировать производительность

### Автоматизация и скрипты
- [ ] Настроил npm scripts для всех частых задач
- [ ] Настроил Husky для pre-commit hooks
- [ ] Настроил lint-staged для автоматического линтинга
- [ ] Автоматизировал форматирование и проверку кода
- [ ] Создал скрипты для деплоя и тестирования

### Workspace и организация
- [ ] Создал логичную структуру папок для проектов
- [ ] Настроил multi-root workspace для монорепозиториев
- [ ] Понимаю концепцию workspace-specific settings
- [ ] Использую recommended extensions для проектов
- [ ] Настроил tasks.json для автоматизации

### Debugging и отладка
- [ ] Умею использовать встроенный debugger VS Code
- [ ] Понимаю разницу между breakpoints, logpoints и watch expressions
- [ ] Умею отлаживать frontend код в Chrome DevTools
- [ ] Умею анализировать network requests и responses
- [ ] Использую структурированное логирование
- [ ] Понимаю как профилировать React компоненты

### Performance и оптимизация
- [ ] Проверил производительность установленных расширений
- [ ] Настроил exclude patterns для ускорения поиска
- [ ] Оптимизировал настройки IDE для производительности
- [ ] Понимаю как диагностировать проблемы с производительностью
- [ ] Использую профили расширений для разных типов проектов
- [ ] Регулярно очищаю неиспользуемые вкладки и файлы

### AI-инструменты и Skills
- [ ] Установил и настроил AI-ассистента (Copilot/Continue/Codeium)
- [ ] Понимаю концепцию Skills и MCP
- [ ] Умею использовать AI для генерации кода
- [ ] Использую AI для рефакторинга и code review
- [ ] Понимаю как создавать собственные Skills
- [ ] Знаю когда использовать AI, а когда писать код самому

### Мониторинг продуктивности
- [ ] Установил инструмент для трекинга времени (WakaTime)
- [ ] Отслеживаю метрики эффективности
- [ ] Регулярно анализирую свой workflow
- [ ] Выявляю и устраняю узкие места в процессе
- [ ] Понимаю на что уходит больше всего времени

---

## 📖 Ресурсы для изучения

### IDE
- [VS Code Documentation](https://code.visualstudio.com/docs)
- [Cursor Documentation](https://cursor.sh/docs)

### Терминал
- [Oh My Zsh](https://ohmyz.sh/)
- [Starship](https://starship.rs)

### Git
- [GitKraken](https://www.gitkraken.com/)
- [GitHub Desktop](https://desktop.github.com/)

### Инструменты
- [Postman](https://www.postman.com/)
- [TablePlus](https://tableplus.com/)
- [Raycast](https://www.raycast.com/)

---

## 💡 Pro Tips

### 1. Используй Cmd+P для быстрого поиска файлов
Вместо навигации по папкам — просто начни печатать имя файла.

### 2. Настрой snippets для повторяющегося кода
Создай свои сниппеты для часто используемых паттернов.

### 3. Используй Multi-cursor editing
`Cmd+D` для выделения следующего вхождения, `Cmd+Shift+L` для всех.

### 4. Изучи Emmet для HTML/CSS
`div.container>ul>li*5` → полная структура за секунду.

### 5. Используй Integrated Terminal
`Ctrl+` ` для открытия терминала прямо в VS Code.

### 6. Workspace Settings Sync
Синхронизируй настройки между устройствами через GitHub.

### 7. Создай свои snippets
Автоматизируй повторяющийся код через пользовательские сниппеты.

---

## ⚠️ Частые ошибки

### 1. Не настроил автосохранение
**Проблема**: Забываешь сохранять файлы перед запуском.

**Решение**:
```json
// settings.json
{
  "files.autoSave": "onFocusChange"
}
```

### 2. Не использует форматирование на сохранение
**Проблема**: Код не форматируется автоматически.

**Решение**:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

### 3. Слишком много расширений
**Проблема**: VS Code тормозит из-за множества расширений.

**Решение**: Отключи неиспользуемые расширения или используй профили.

### 4. Не использует Git интеграцию
**Проблема**: Переключается между терминалом и IDE.

**Решение**: Используй встроенный Source Control (`Cmd+Shift+G`).

### 5. Игнорирует keyboard shortcuts
**Проблема**: Медленная работа из-за использования мыши.

**Решение**: Изучи топ-20 shortcuts и используй их ежедневно.

---

---

## 📊 Сравнительная таблица AI IDE

| Фича | VS Code | Cursor | Windsurf | GitHub Copilot |
|------|---------|--------|----------|----------------|
| **Цена** | Бесплатно | $20/мес | Бесплатно | $10/мес |
| **AI Chat** | Через расширения | ✅ Встроенный | ✅ Встроенный | ❌ |
| **AI Edit** | ❌ | ✅ Cmd+K | ✅ | ❌ |
| **Composer** | ❌ | ✅ Multi-file | ✅ | ❌ |
| **Autocomplete** | Через Copilot | ✅ | ✅ | ✅ |
| **Context** | Ограниченный | ✅ Весь проект | ✅ Весь проект | Ограниченный |
| **Расширения** | 50,000+ | VS Code compatible | VS Code compatible | VS Code |
| **Скорость** | ⚡⚡⚡ | ⚡⚡ | ⚡⚡ | ⚡⚡⚡ |

**Рекомендация**: 
- **Начинающим**: Cursor (проще всего)
- **Опытным**: VS Code + Copilot (максимальная гибкость)
- **Бюджет**: Windsurf (бесплатно)

---

## 🛠 Расширенная настройка VS Code

### settings.json (рекомендуемые настройки)

```json
{
  // Редактор
  "editor.fontSize": 14,
  "editor.fontFamily": "JetBrains Mono, Menlo, Monaco, 'Courier New', monospace",
  "editor.lineHeight": 1.6,
  "editor.tabSize": 2,
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.minimap.enabled": false,
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": true,
  
  // Файлы
  "files.autoSave": "onFocusChange",
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  
  // Терминал
  "terminal.integrated.fontSize": 13,
  "terminal.integrated.fontFamily": "JetBrains Mono",
  
  // Git
  "git.autofetch": true,
  "git.confirmSync": false,
  
  // Emmet
  "emmet.includeLanguages": {
    "javascript": "javascriptreact",
    "typescript": "typescriptreact"
  },
  
  // TypeScript
  "typescript.updateImportsOnFileMove.enabled": "always",
  "javascript.updateImportsOnFileMove.enabled": "always"
}
```

### keybindings.json (кастомные shortcuts)

```json
[
  {
    "key": "cmd+shift+d",
    "command": "editor.action.duplicateSelection"
  },
  {
    "key": "cmd+shift+k",
    "command": "editor.action.deleteLines"
  },
  {
    "key": "cmd+shift+up",
    "command": "editor.action.moveLinesUpAction"
  },
  {
    "key": "cmd+shift+down",
    "command": "editor.action.moveLinesDownAction"
  }
]
```

---

## 🎨 Рекомендуемые темы

### Темные темы
- **One Dark Pro** — популярная тема от Atom
- **Dracula Official** — яркая и контрастная
- **Night Owl** — оптимизирована для ночной работы
- **Tokyo Night** — современная японская тема

### Светлые темы
- **GitHub Light** — чистая и минималистичная
- **Solarized Light** — классика
- **Atom One Light** — мягкая и приятная

### Иконки
- **Material Icon Theme** — самая популярная
- **Catppuccin Icons** — современные иконки
- **Symbols** — минималистичные иконки

---

## 🔧 CLI инструменты для продуктивности

### fzf — fuzzy finder
```bash
brew install fzf

# Добавь в .zshrc
[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh

# Использование
# Ctrl+R — поиск по истории команд
# Ctrl+T — поиск файлов
```

### ripgrep — быстрый grep
```bash
brew install ripgrep

# Поиск в файлах
rg "function" --type ts

# Игнорировать node_modules
rg "TODO" --glob "!node_modules"
```

### bat — cat с подсветкой
```bash
brew install bat

# Вместо cat
bat file.js

# С номерами строк
bat -n file.js
```

### exa — современный ls
```bash
brew install exa

# Вместо ls
exa --long --header --git

# Алиас в .zshrc
alias ls="exa"
alias ll="exa --long --header --git"
```

### tldr — упрощенный man
```bash
brew install tldr

# Быстрая справка
tldr git
tldr docker
```

---

## 📦 Package.json scripts best practices

```json
{
  "scripts": {
    // Development
    "dev": "next dev",
    "dev:turbo": "next dev --turbo",
    
    // Build
    "build": "next build",
    "build:analyze": "ANALYZE=true next build",
    
    // Start
    "start": "next start",
    
    // Linting
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "lint:strict": "next lint --max-warnings 0",
    
    // Formatting
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    
    // Type checking
    "type-check": "tsc --noEmit",
    
    // Testing
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    
    // Database
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts",
    "db:reset": "prisma migrate reset",
    
    // Utilities
    "clean": "rm -rf .next node_modules",
    "prepare": "husky install",
    "postinstall": "prisma generate"
  }
}
```

---

## 🎯 Workspace организация

### Концепция workspace
Workspace — это не просто папка с файлами. Это контейнер, который хранит настройки, расширения, задачи и конфигурации для конкретного проекта. Когда открываешь workspace, IDE автоматически применяет все нужные настройки.

**Зачем нужны workspace**:
- Разные проекты требуют разных настроек
- Автоматическая загрузка нужных расширений
- Изоляция конфигураций между проектами
- Быстрое переключение контекста

### Структура проектов
Организация файловой системы влияет на продуктивность. Логичная структура помогает быстро находить нужные проекты и понимать их назначение.

**Рекомендуемая организация**:
- `personal/` — личные проекты и эксперименты
- `work/` — рабочие проекты по клиентам
- `learning/` — обучающие материалы и туториалы
- `templates/` — шаблоны для быстрого старта

### Multi-root workspaces
Возможность работать с несколькими корневыми папками одновременно. Полезно для монорепозиториев или связанных проектов (frontend + backend + mobile).

**Преимущества**:
- Единое окно для всех частей проекта
- Общие настройки и расширения
- Удобная навигация между модулями
- Централизованное управление задачами

📖 **Ресурс**: [VS Code Workspaces](https://code.visualstudio.com/docs/editor/workspaces)

---

## 🐛 Раздел 11: Debugging и отладка

### 11.1. Концепция debugging в современной разработке
Debugging — это не просто поиск багов, это процесс понимания поведения кода. Современные инструменты позволяют останавливать выполнение, инспектировать переменные, отслеживать call stack и даже путешествовать во времени.

**Ключевые принципы**:
- Breakpoints вместо console.log
- Условные breakpoints для сложных случаев
- Watch expressions для отслеживания значений
- Call stack для понимания потока выполнения

### 11.2. Встроенный debugger VS Code
VS Code имеет мощный встроенный отладчик для JavaScript/TypeScript, который интегрируется с Node.js, браузерами и другими runtime.

**Основные возможности**:
- Breakpoints (обычные, условные, logpoints)
- Step over, step into, step out
- Watch expressions и variables panel
- Debug console для выполнения кода
- Call stack navigation

**Hotkeys для debugging**:
- `F5` — Start debugging
- `F9` — Toggle breakpoint
- `F10` — Step over
- `F11` — Step into
- `Shift+F11` — Step out
- `Shift+F5` — Stop debugging

### 11.3. Browser DevTools debugging
Chrome DevTools — это полноценная среда для отладки frontend кода. Позволяет отлаживать JavaScript, инспектировать DOM, анализировать network requests, профилировать производительность.

**Ключевые панели**:
- **Sources** — отладка JavaScript с breakpoints
- **Console** — выполнение кода и просмотр логов
- **Network** — анализ запросов и ответов
- **Performance** — профилирование производительности
- **Memory** — поиск утечек памяти

### 11.4. React DevTools
Специализированный инструмент для отладки React приложений. Показывает дерево компонентов, props, state, hooks, и позволяет профилировать рендеры.

**Возможности**:
- Инспектирование component tree
- Просмотр и редактирование props/state
- Профилирование рендеров
- Поиск по компонентам
- Highlight updates

### 11.5. Network debugging
Анализ сетевых запросов критически важен для понимания взаимодействия frontend и backend.

**Что анализировать**:
- Status codes (200, 404, 500)
- Request/Response headers
- Payload (body) запросов
- Timing (сколько времени занял запрос)
- Waterfall (последовательность запросов)

### 11.6. Логирование best practices
Правильное логирование помогает быстро находить проблемы в production.

**Уровни логирования**:
- `console.log()` — общая информация
- `console.info()` — информационные сообщения
- `console.warn()` — предупреждения
- `console.error()` — ошибки
- `console.debug()` — отладочная информация

**Структурированное логирование**:
Вместо простых строк используй объекты с контекстом.

📖 **Ресурсы**:
- [Chrome DevTools Documentation](https://developer.chrome.com/docs/devtools/)
- [VS Code Debugging](https://code.visualstudio.com/docs/editor/debugging)
- [React DevTools](https://react.dev/learn/react-developer-tools)

---

## ⚡ Раздел 12: Performance и оптимизация IDE

### 12.1. Почему производительность IDE важна
Медленная IDE убивает продуктивность. Каждая секунда задержки при открытии файла, поиске или автодополнении — это потерянное время и сбитый фокус.

**Признаки проблем с производительностью**:
- Долгий запуск IDE (>5 секунд)
- Задержки при печатании
- Медленный поиск файлов
- Зависания при автодополнении
- Высокое потребление памяти/CPU

### 12.2. Оптимизация расширений
Расширения — основная причина тормозов VS Code. Каждое расширение потребляет ресурсы.

**Стратегии оптимизации**:
- Устанавливай только необходимые расширения
- Используй профили для разных типов проектов
- Отключай расширения для конкретных workspace
- Регулярно проверяй производительность расширений

**Проверка производительности**:
`Cmd+Shift+P` → "Developer: Show Running Extensions"

### 12.3. Настройки для производительности
Некоторые настройки VS Code могут значительно улучшить производительность.

**Рекомендуемые настройки**:
- Отключи minimap если не используешь
- Ограничь количество открытых файлов
- Настрой exclude patterns для поиска
- Используй workspace trust для безопасности
- Отключи telemetry

### 12.4. Исключение файлов из индексации
IDE индексирует все файлы для поиска и автодополнения. Исключение ненужных файлов ускоряет работу.

**Что исключать**:
- `node_modules/`
- `.next/`, `dist/`, `build/`
- `.git/`
- Большие медиа файлы
- Логи и временные файлы

### 12.5. Управление памятью
VS Code может потреблять много памяти при работе с большими проектами.

**Стратегии**:
- Закрывай неиспользуемые вкладки
- Перезапускай IDE раз в день
- Используй workspace вместо открытия всей папки
- Ограничь количество одновременно открытых проектов

### 12.6. Профилирование IDE
Если IDE тормозит, нужно найти причину.

**Инструменты диагностики**:
- Developer Tools (`Cmd+Shift+P` → "Developer: Toggle Developer Tools")
- Process Explorer для просмотра потребления ресурсов
- Extension Bisect для поиска проблемного расширения

📖 **Ресурсы**:
- [VS Code Performance](https://code.visualstudio.com/docs/setup/setup-overview#_performance)
- [Optimizing VS Code](https://code.visualstudio.com/docs/getstarted/tips-and-tricks)

---

## 🎯 Раздел 13: Skills и MCP (Model Context Protocol)

### 13.1. Концепция Skills
Skills — это специализированные инструкции и возможности, которые расширяют функциональность AI-ассистентов. Это как плагины для AI, которые дают ему новые суперсилы.

**Что такое Skill**:
- Набор инструкций для выполнения специфической задачи
- Интеграция с внешними инструментами и API
- Специализированные знания в определённой области
- Автоматизация сложных workflow

**Примеры Skills**:
- Deep Research — глубокий анализ и исследование
- PDF/DOCX работа — чтение и создание документов
- Image Upscale — улучшение качества изображений
- Video Processing — работа с видео
- Data Analytics — анализ данных

### 13.2. MCP (Model Context Protocol)
MCP — это открытый протокол для подключения AI-ассистентов к внешним источникам данных и инструментам. Позволяет AI работать с базами данных, API, файловыми системами и другими сервисами.

**Архитектура MCP**:
- **MCP Host** — AI-ассистент (Claude, GPT)
- **MCP Client** — приложение (VS Code, Cursor)
- **MCP Server** — сервис, предоставляющий данные/инструменты

**Возможности MCP**:
- Доступ к базам данных
- Интеграция с API
- Работа с файловыми системами
- Подключение к внешним сервисам
- Расширение контекста AI

### 13.3. Типы MCP серверов
MCP серверы предоставляют разные типы функциональности.

**Категории**:
- **Data Sources** — доступ к данным (БД, файлы, API)
- **Tools** — выполнение действий (запуск команд, создание файлов)
- **Resources** — предоставление контекста (документация, примеры)
- **Prompts** — готовые промпты для задач

### 13.4. Создание собственных Skills
Можно создавать кастомные Skills для специфических задач проекта.

**Структура Skill**:
- Описание задачи и контекста
- Пошаговые инструкции
- Примеры использования
- Best practices и частые ошибки
- Ссылки на ресурсы

**Когда создавать Skill**:
- Повторяющиеся сложные задачи
- Специфические workflow проекта
- Интеграция с внутренними инструментами
- Передача знаний команде

### 13.5. Использование Skills в разработке
Skills интегрируются в повседневный workflow разработки.

**Практическое применение**:
- Генерация кода по паттернам проекта
- Автоматизация рутинных задач
- Анализ и рефакторинг кода
- Создание документации
- Тестирование и отладка

### 13.6. Экосистема Skills
Существует растущая экосистема готовых Skills для разных задач.

**Популярные категории**:
- **Разработка**: Code Review, Testing, Refactoring
- **Дизайн**: UI/UX, Design Systems, Prototyping
- **Контент**: Writing, Translation, SEO
- **Данные**: Analytics, Visualization, ETL
- **DevOps**: Deployment, Monitoring, CI/CD

📖 **Ресурсы**:
- [MCP Documentation](https://modelcontextprotocol.io/)
- [Anthropic MCP](https://www.anthropic.com/news/model-context-protocol)
- [Skills Repository](https://github.com/topics/mcp-server)

---

## 🔄 Раздел 14: Интеграция с AI-инструментами

### 14.1. Claude Code CLI
Командная строка для работы с Claude прямо из терминала. Позволяет выполнять задачи без переключения в браузер.

**Возможности**:
- Выполнение команд через AI
- Генерация кода
- Анализ файлов
- Автоматизация задач

### 14.2. GitHub Copilot
AI-ассистент для автодополнения кода. Предлагает целые функции и блоки кода на основе контекста.

**Фичи**:
- Inline suggestions
- Chat для объяснений
- Code review
- Test generation

### 14.3. Cursor Composer
Мультифайловое редактирование с AI. Позволяет вносить изменения сразу в несколько файлов.

**Когда использовать**:
- Рефакторинг across files
- Создание новых фич
- Миграция кода
- Обновление зависимостей

### 14.4. Continue (Open Source)
Бесплатная альтернатива Copilot с поддержкой разных моделей.

**Преимущества**:
- Выбор модели (GPT, Claude, Local)
- Кастомизация промптов
- Приватность данных
- Бесплатное использование

📖 **Ресурсы**:
- [GitHub Copilot](https://github.com/features/copilot)
- [Cursor](https://cursor.sh/)
- [Continue](https://continue.dev/)

---

## 📊 Раздел 15: Мониторинг и метрики продуктивности

### 15.1. Отслеживание времени разработки
Понимание, на что уходит время, помогает оптимизировать процессы.

**Инструменты**:
- **WakaTime** — автоматический трекинг времени в IDE
- **RescueTime** — анализ продуктивности
- **Toggl** — ручной трекинг задач

### 15.2. Метрики эффективности
Какие показатели отслеживать для понимания продуктивности.

**Ключевые метрики**:
- Время на задачу
- Количество коммитов
- Code review time
- Bug fix time
- Feature delivery time

### 15.3. Анализ workflow
Регулярный анализ рабочего процесса выявляет узкие места.

**Что анализировать**:
- Частые переключения контекста
- Повторяющиеся задачи
- Время на рутину
- Блокеры и задержки

📖 **Ресурсы**:
- [WakaTime](https://wakatime.com/)
- [RescueTime](https://www.rescuetime.com/)

---

## 🖥 Раздел 16: Terminal & CLI Мастерство

### 16.1. Oh My Zsh — профессиональный терминал

Oh My Zsh превращает стандартный терминал в мощный инструмент продуктивности.

**Установка**:
```bash
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

**Обязательные плагины** (добавить в `~/.zshrc`):
```bash
plugins=(
  git                    # Алиасы для git (gst, gcm, gp, gl)
  node                   # Алиасы для Node.js
  npm                    # Автодополнение npm команд
  zsh-autosuggestions    # Подсказки из истории
  zsh-syntax-highlighting # Подсветка команд
  z                      # Быстрая навигация по папкам
)
```

**Тема**: Powerlevel10k для красивый и информативный prompt с git-статусом в реальном времени.

### 16.2. Продуктивные алиасы для разработчика

Добавьте в `~/.zshrc`:
```bash
# Navigation
alias ..="cd .."
alias ...="cd ../.."

# Development
alias dev="npm run dev"
alias build="npm run build"
alias test="npm run test"
alias lint="npm run lint"

# Git shortcuts
alias gst="git status"
alias gcm="git commit -m"
alias gp="git push"
alias gl="git pull"
alias gco="git checkout"
alias gcb="git checkout -b"
alias gaa="git add ."
alias glog="git log --oneline --graph"

# Docker
alias dcu="docker-compose up"
alias dcd="docker-compose down"

# Quick project open
alias code.="code ."
alias cursor.="cursor ."
```

**Применить изменения**: `source ~/.zshrc`

### 16.3. pnpm — быстрый пакетный менеджер

pnpm в 2-3x быстрее npm за счёт глобального кеша и hard links.

**Установка**:
```bash
npm install -g pnpm
# или
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

**Ключевые команды**:
```bash
pnpm install          # Установка зависимостей
pnpm add package      # Добавить зависимость
pnpm add -D package   # Dev-зависимость
pnpm run dev          # Запуск dev-сервера
pnpm run build        # Сборка
pnpm dlx create-next-app@latest  # Создать проект (аналог npx)
```

### 16.4. fzf и ripgrep — навигация в терминале

**fzf** (fuzzy finder) — поиск по всему в терминале:
```bash
brew install fzf
$(brew --prefix)/opt/fzf/install  # Включить горячие клавиши

# Ctrl+R  — fuzzy поиск по истории команд
# Ctrl+T  — fuzzy поиск по файлам
```

**ripgrep** — молниеносный поиск по содержимому файлов:
```bash
brew install ripgrep

# Поиск во всём проекте
rg "useState" src/
rg "TODO" --type ts
rg "API_KEY" --hidden  # Включая скрытые файлы (проверка безопасности!)
```

📖 **Ресурсы**:
- [Oh My Zsh](https://ohmyz.sh/)
- [Powerlevel10k](https://github.com/romkatv/powerlevel10k)
- [pnpm Documentation](https://pnpm.io/motivation)
- [fzf GitHub](https://github.com/junegunn/fzf)

---

## 🤖 Раздел 17: Сравнение AI-IDE для Vibecoding

### 17.1. Матрица выбора IDE

| Критерий | VS Code + Claude CLI | Cursor | Windsurf |
|----------|---------------------|--------|----------|
| **AI интеграция** | Через CLI | Нативная (Claude/GPT) | Нативная (Cascade) |
| **Автономность агента** | Высокая (Claude Code) | Высокая (Agent Mode) | Очень высокая |
| **Мультифайловые правки** | Claude Code Codeflow | Composer (Cmd+I) | Cascade Flow |
| **Стоимость** | По токенам Claude | $20/мес Pro | Бесплатно + Pro |
| **Приватность** | Локально + Anthropic | Cursor серверы | Codeium серверы |
| **Лучше для** | Контроль + CLI | Ежедневная разработка | Крупный рефакторинг |

### 17.2. Cursor — детальная настройка

**Cursor Rules** (аналог CLAUDE.md):
Создайте `.cursor/rules` в корне проекта:
```
You are working on a Next.js 15 project with TypeScript.
Always use feature-based architecture under /src/features/.
Follow the existing design system in /src/styles/tokens.css.
Never modify production database schemas without explicit approval.
Write tests for every new API endpoint.
```

**Горячие клавиши**:
- `Cmd+K` — AI-редактирование выделенного блока
- `Cmd+I` — Composer (мультифайловые задачи)
- `Cmd+L` — AI-чат с контекстом файла
- `Tab` — принять AI-подсказку

### 17.3. Windsurf — режим Cascade

Cascade — главная фича Windsurf. Это агент, который:
1. Анализирует весь проект перед выполнением
2. Открывает нужные файлы самостоятельно
3. Вносит согласованные изменения
4. Объясняет каждое решение

**Идеальные сценарии для Windsurf**:
- Рефакторинг всей кодовой базы
- Миграция с одного фреймворка на другой
- Добавление TypeScript в JS-проект
- Обновление deprecated API по всему проекту

### 17.4. Минимальный профессиональный стандарт расширений

Независимо от IDE, установите:

```
✅ Error Lens         — ошибки прямо в строке кода
✅ GitLens            — история изменений и blame
✅ Prettier           — авто-форматирование при сохранении
✅ ESLint             — статический анализ кода
✅ Thunder Client     — тестирование API прямо в IDE
✅ DotENV             — подсветка .env файлов
✅ Import Cost        — отображение размера импортируемых пакетов
✅ Path Intellisense  — автодополнение путей к файлам
```

**settings.json** (общие настройки):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.tabSize": 2,
  "editor.wordWrap": "on",
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000,
  "terminal.integrated.defaultProfile.osx": "zsh"
}
```

📖 **Ресурсы**:
- [Cursor Documentation](https://docs.cursor.com/)
- [Windsurf Documentation](https://docs.codeium.com/windsurf)
- [VS Code Extensions Marketplace](https://marketplace.visualstudio.com/)

---

## 🎓 Практические задания

### Задание 1: Базовая настройка окружения (30 мин)
**Цель**: Настроить профессиональную рабочую среду с нуля.

**Шаги**:
1. Установите VS Code или Cursor
2. Установите Oh My Zsh с плагинами autosuggestions и syntax-highlighting
3. Добавьте в `~/.zshrc` минимум 10 алиасов для разработки
4. Установите pnpm глобально и создайте тестовый Next.js проект через `pnpm dlx create-next-app@latest ./test-project`
5. Настройте `settings.json` с formatOnSave и правильными размерами таба

**Критерий завершения**: `dev` запускает сервер, Git-операции работают через алиасы, код форматируется при сохранении.

### Задание 2: Структура воркспейса (20 мин)
**Цель**: Организовать проект по профессиональным стандартам.

**Шаги**:
1. Создайте структуру папок: `/src`, `/skills`, `/memory`, `/tests`, `/scripts`
2. Создайте `.claude/CLAUDE.md` с описанием проекта, командами запуска и архитектурными решениями
3. Создайте `.claude/SNAPSHOT.md` с текущим статусом разработки
4. Установите расширения: Error Lens, GitLens, Prettier, Thunder Client
5. Настройте `.vscode/settings.json` специфично для проекта

**Критерий завершения**: Структура готова, CLAUDE.md содержит актуальную информацию, все расширения работают.

### Задание 3: Terminal Power User (15 мин)
**Цель**: Освоить профессиональную навигацию в терминале.

**Шаги**:
1. Установите fzf и настройте горячие клавиши
2. Установите ripgrep
3. Найдите через `rg` все файлы с `console.log` в тестовом проекте
4. Используйте `Ctrl+R` для поиска по истории команд
5. Создайте алиас `cleanlog` для удаления всех console.log через ripgrep

**Критерий завершения**: Можете найти любой текст в проекте за 5 секунд.

### Задание 4: Cursor/Windsurf Workflow (45 мин)
**Цель**: Использовать AI-IDE для реального задания.

**Шаги**:
1. Откройте тестовый проект в Cursor или Windsurf
2. Используйте Composer/Cascade для создания компонента Header с навигацией
3. Используйте `Cmd+K` для добавления TypeScript типов к существующему коду
4. Добавьте `.cursor/rules` с правилами архитектуры проекта
5. Попросите AI рефакторнуть один компонент с объяснением каждого изменения

**Критерий завершения**: Компонент создан, типы добавлены, правила файл настроен.

---

## ⚠️ Частые ошибки

### 1. Смешивание проектов в одной папке
**Проблема**: Несколько проектов в одной директории — конфликты зависимостей, путаница в конфигурациях.  
**Решение**: Один проект = одна изолированная папка. Используйте структуру `~/Projects/project-name/`.

### 2. Отсутствие CLAUDE.md
**Проблема**: ИИ-агент начинает каждую сессию "с нуля", задаёт одни и те же вопросы, не знает архитектуры.  
**Решение**: `CLAUDE.md` — обязателен с первого дня. Он должен содержать команды запуска, стек технологий и архитектурные решения.

### 3. Использование npm вместо pnpm
**Проблема**: Медленная установка зависимостей, раздутый `node_modules`, конфликты версий.  
**Решение**: Мигрируйте на pnpm. Удалите `node_modules`, запустите `pnpm install`.

### 4. Не настроенный formatOnSave
**Проблема**: Разный стиль кода в разных файлах, конфликты при слиянии веток, ИИ генерирует несогласованный код.  
**Решение**: Настройте `"editor.formatOnSave": true` + Prettier в `settings.json`.

### 5. Слишком много расширений IDE
**Проблема**: IDE тормозит, конфликты между расширениями, долгий старт.  
**Решение**: Аудит расширений раз в квартал. Деактивируйте неиспользуемые. Правило: если не пользовался 2 недели — отключи.

### 6. Игнорирование горячих клавиш
**Проблема**: Постоянное использование мыши замедляет работу в 3-5 раз.  
**Решение**: Распечатайте Cheatsheet горячих клавиш IDE. Практикуйте 3 новых shortcut в день.

### 7. Работа без Oh My Zsh / без алиасов
**Проблема**: Печать полных команд каждый раз (`git status`, `npm run dev`) — потеря минут ежедневно.  
**Решение**: Настройте алиасы один раз. `gst` вместо `git status` — это 8 нажатий против 3.

### 8. Игнорирование Error Lens
**Проблема**: Ошибки видны только при наведении или в панели Problems — опаздываете на обнаружение.  
**Решение**: Error Lens показывает ошибку прямо в строке. Устанавливается за 30 секунд.

---

## 💡 Pro Tips

### 1. Workspace-специфичные настройки
Создайте `.vscode/settings.json` в каждом проекте для переопределения глобальных настроек. Например, разный размер отступа для Python (4) и JavaScript (2) проектов.

### 2. Snippets экономят время
Создайте пользовательские сниппеты для шаблонов, которые пишете чаще всего: React компонент, API endpoint, Zod схема. В VS Code: `Cmd+Shift+P` → "Configure User Snippets".

### 3. Multi-cursor редактирование
`Option+Click` — добавить курсор. `Cmd+D` — выделить следующее вхождение. `Cmd+Shift+L` — выделить все вхождения. Меняйте несколько мест одновременно без поиска-замены.

### 4. Integrated Terminal — не отрывайтесь от контекста
Используйте встроенный терминал IDE (`` Ctrl+` ``), а не переключайтесь в отдельное приложение. Разделите панель на несколько терминалов: один для dev-сервера, другой для git-операций.

### 5. Settings Sync через GitHub
Включите "Settings Sync" в VS Code/Cursor, привязав к GitHub аккаунту. Все расширения и настройки синхронизируются на новые машины за 30 секунд.

### 6. Git Graph для визуализации
Расширение "Git Graph" даёт наглядную визуализацию веток и коммитов прямо в IDE. Незаменимо при работе в команде и при разборе сложной истории коммитов.

### 7. Ripgrep для аудита безопасности
Перед коммитом запускайте `rg "console.log|TODO|FIXME|API_KEY|password|secret" --type ts` для поиска отладочного мусора и случайно попавших секретов в коде.

### 8. Настройте z для молниеносной навигации
После `brew install zoxide` и добавления `eval "$(zoxide init zsh)"` в `.zshrc` вы сможете переходить в любую папку по её части имени: `z myproject` → мгновенный переход в `~/Projects/my-project-name/`.

---

## ✅ Чек-лист освоения L3

### IDE и настройка
- [ ] Установлен VS Code или Cursor с базовыми настройками
- [ ] Настроен `formatOnSave` с Prettier
- [ ] Установлены Error Lens, GitLens, Thunder Client
- [ ] Настроен Settings Sync через GitHub

### Terminal & CLI
- [ ] Установлен Oh My Zsh с плагинами
- [ ] Настроены алиасы для git, npm/pnpm, навигации
- [ ] Установлен pnpm как основной пакетный менеджер
- [ ] Установлены fzf и ripgrep
- [ ] Работает fuzzy поиск по истории `Ctrl+R`

### Workspace организация
- [ ] Создана правильная структура папок проекта
- [ ] Создан и заполнен `.claude/CLAUDE.md`
- [ ] Создан `.claude/SNAPSHOT.md`
- [ ] Настроен `.vscode/settings.json` для проекта
- [ ] Весь текст в Markdown-формате

### AI IDE
- [ ] Настроен Cursor Rules или Windsurf правила
- [ ] Освоен Composer (Cmd+I) или Cascade для мультифайловых задач
- [ ] Настроена тема и шрифт (рекомендуем Fira Code с лигатурами)
- [ ] Claude Code CLI установлен и авторизован

### Продуктивность
- [ ] Знаю 20+ горячих клавиш IDE наизусть
- [ ] Время запуска dev-сервера: < 3 секунд
- [ ] Могу найти любой код в проекте за < 10 секунд
- [ ] Все повторяющиеся команды автоматизированы

---

## 📖 Ресурсы для изучения

### IDE
- [Cursor Documentation](https://docs.cursor.com/)
- [Windsurf — Cascade Guide](https://docs.codeium.com/windsurf/getting-started)
- [VS Code Tips & Tricks](https://code.visualstudio.com/docs/getstarted/tips-and-tricks)
- [VS Code Keyboard Shortcuts (macOS)](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-macos.pdf)

### Terminal
- [Oh My Zsh Wiki](https://github.com/ohmyzsh/ohmyzsh/wiki)
- [Powerlevel10k Setup](https://github.com/romkatv/powerlevel10k#installation)
- [pnpm Documentation](https://pnpm.io/)
- [fzf Examples](https://github.com/junegunn/fzf#examples)
- [ripgrep User Guide](https://github.com/BurntSushi/ripgrep/blob/master/GUIDE.md)

### Workspace
- [Claude Code CLI Docs](https://docs.anthropic.com/en/docs/claude-code)
- [Git Best Practices](https://www.gitguides.org/)

---

**Последнее обновление**: 17.05.2026  
**Статус**: ✅ Полностью завершён  
**Предыдущий уровень**: [L2: Принципы vibecoding](L2_vibecoding_principles.md)  
**Следующий уровень**: [L4: Frontend разработка](L4_frontend_development.md)
