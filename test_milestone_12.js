/**
 * Тесты для Milestone 12: Доработки 90-97
 * 
 * Проверяет наличие и корректность следующих доработок:
 * - 90: Реальная стоимость Claude Code (L0)
 * - 91: Hooks система (L8)
 * - 92: Session Management (L8)
 * - 93: Distributed Tracing (L3)
 * - 94: Push Notifications (L3)
 * - 95: Read-Only Bash режим (L2)
 * - 96: 60-Second Quick Start (L1)
 * - 97: Mental Model (L1)
 */

const fs = require('fs');
const path = require('path');

// Цвета для вывода
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Счётчики тестов
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

// Функция для вывода результата теста
function test(description, condition) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`${colors.green}✓${colors.reset} ${description}`);
    return true;
  } else {
    failedTests++;
    console.log(`${colors.red}✗${colors.reset} ${description}`);
    return false;
  }
}

// Функция для проверки наличия текста в файле
function fileContains(filePath, searchText, caseSensitive = false) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    if (caseSensitive) {
      return content.includes(searchText);
    }
    return content.toLowerCase().includes(searchText.toLowerCase());
  } catch (error) {
    return false;
  }
}

// Функция для проверки наличия раздела в файле
function fileContainsSection(filePath, sectionTitle) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const regex = new RegExp(`##.*${sectionTitle}`, 'i');
    return regex.test(content);
  } catch (error) {
    return false;
  }
}

console.log(`\n${colors.blue}=== Тестирование Milestone 12: Доработки 90-97 ===${colors.reset}\n`);

// ============================================================================
// Доработка 90: Реальная стоимость Claude Code (L0)
// ============================================================================
console.log(`${colors.yellow}Доработка 90: Реальная стоимость Claude Code (L0)${colors.reset}`);

const l0Path = path.join(__dirname, 'docs', 'L0_fundamentals.md');

test('L0: Файл существует', fs.existsSync(l0Path));
test('L0: Раздел 10 "Реальная стоимость Claude Code" существует', 
  fileContainsSection(l0Path, 'Реальная стоимость Claude Code'));
test('L0: Упоминаются тарифные планы (Free, Pro, Team, Enterprise)', 
  fileContains(l0Path, 'Free') && fileContains(l0Path, 'Pro') && 
  fileContains(l0Path, 'Team') && fileContains(l0Path, 'Enterprise'));
test('L0: Упоминается стоимость Pro ($20/мес)', 
  fileContains(l0Path, '$20'));
test('L0: Упоминается экономия с Cline (10x по токенам)', 
  fileContains(l0Path, '10x') && fileContains(l0Path, 'токен'));

console.log('');

// ============================================================================
// Доработка 91: Hooks система (L8)
// ============================================================================
console.log(`${colors.yellow}Доработка 91: Hooks система (L8)${colors.reset}`);

const l8Path = path.join(__dirname, 'docs', 'L8_scaling_optimization.md');

test('L8: Файл существует', fs.existsSync(l8Path));
test('L8: Раздел 10 "Hooks система" существует', 
  fileContainsSection(l8Path, 'Hooks система'));
test('L8: Упоминаются Pre/Post hooks', 
  fileContains(l8Path, 'Pre') && fileContains(l8Path, 'Post') && fileContains(l8Path, 'hook'));
test('L8: Упоминается Security Hook', 
  fileContains(l8Path, 'Security Hook'));
test('L8: Упоминаются применения (pre-commit, security checks)', 
  fileContains(l8Path, 'pre-commit') || fileContains(l8Path, 'security check'));

console.log('');

// ============================================================================
// Доработка 92: Session Management (L8)
// ============================================================================
console.log(`${colors.yellow}Доработка 92: Session Management (L8)${colors.reset}`);

test('L8: Раздел 11 "Session Management" существует', 
  fileContainsSection(l8Path, 'Session Management'));
test('L8: Упоминается сохранение сессий', 
  fileContains(l8Path, 'сохранение') && fileContains(l8Path, 'сесси'));
test('L8: Упоминается восстановление контекста', 
  fileContains(l8Path, 'восстановление') && fileContains(l8Path, 'контекст'));
test('L8: Упоминается Session Recap (v2.1.108+)', 
  fileContains(l8Path, 'Session Recap') || fileContains(l8Path, 'v2.1.108'));

console.log('');

// ============================================================================
// Доработка 93: Distributed Tracing (L3)
// ============================================================================
console.log(`${colors.yellow}Доработка 93: Distributed Tracing (L3)${colors.reset}`);

const l3Path = path.join(__dirname, 'docs', 'L3_professional_environment.md');

test('L3: Файл существует', fs.existsSync(l3Path));
test('L3: Раздел 11 "Distributed Tracing" существует', 
  fileContainsSection(l3Path, 'Distributed Tracing'));
test('L3: Упоминается трассировка запросов', 
  fileContains(l3Path, 'трассировка') || fileContains(l3Path, 'tracing'));
test('L3: Упоминается отладка MCP', 
  fileContains(l3Path, 'отладка') && fileContains(l3Path, 'MCP'));
test('L3: Упоминается версия v2.1.110+', 
  fileContains(l3Path, 'v2.1.110'));

console.log('');

// ============================================================================
// Доработка 94: Push Notifications (L3)
// ============================================================================
console.log(`${colors.yellow}Доработка 94: Push Notifications (L3)${colors.reset}`);

test('L3: Раздел 12 "Push Notifications" существует', 
  fileContainsSection(l3Path, 'Push Notifications'));
test('L3: Упоминаются уведомления о завершении задач', 
  fileContains(l3Path, 'уведомлени') && fileContains(l3Path, 'завершени'));
test('L3: Упоминается работа с долгими задачами', 
  fileContains(l3Path, 'долг') && fileContains(l3Path, 'задач'));
test('L3: Упоминается версия v2.1.110+', 
  fileContains(l3Path, 'v2.1.110'));

console.log('');

// ============================================================================
// Доработка 95: Read-Only Bash режим (L2)
// ============================================================================
console.log(`${colors.yellow}Доработка 95: Read-Only Bash режим (L2)${colors.reset}`);

const l2Path = path.join(__dirname, 'docs', 'L2_vibecoding_principles.md');

test('L2: Файл существует', fs.existsSync(l2Path));
test('L2: Раздел 11 "Read-Only Bash режим" существует', 
  fileContainsSection(l2Path, 'Read-Only') || fileContainsSection(l2Path, 'Безопасный режим'));
test('L2: Упоминается безопасный режим выполнения', 
  fileContains(l2Path, 'безопасн') && fileContains(l2Path, 'режим'));
test('L2: Упоминается ограничение прав AI', 
  fileContains(l2Path, 'ограничени') && fileContains(l2Path, 'прав'));
test('L2: Упоминается защита от случайного удаления', 
  fileContains(l2Path, 'защита') && fileContains(l2Path, 'удален'));

console.log('');

// ============================================================================
// Доработка 96: 60-Second Quick Start (L1)
// ============================================================================
console.log(`${colors.yellow}Доработка 96: 60-Second Quick Start (L1)${colors.reset}`);

const l1Path = path.join(__dirname, 'docs', 'L1_planning.md');

test('L1: Файл существует', fs.existsSync(l1Path));
test('L1: Раздел 11 "60-Second Quick Start" существует', 
  fileContainsSection(l1Path, '60-Second') || fileContainsSection(l1Path, 'Quick Start'));
test('L1: Упоминается мгновенный старт проекта', 
  fileContains(l1Path, 'мгновенн') || fileContains(l1Path, '60 секунд'));
test('L1: Упоминается команда быстрого старта', 
  fileContains(l1Path, 'npx create-next-app') || fileContains(l1Path, 'команда'));
test('L1: Упоминается Next.js + TypeScript + Tailwind', 
  fileContains(l1Path, 'Next.js') && fileContains(l1Path, 'TypeScript') && 
  fileContains(l1Path, 'Tailwind'));

console.log('');

// ============================================================================
// Доработка 97: Mental Model (L1)
// ============================================================================
console.log(`${colors.yellow}Доработка 97: Mental Model (L1)${colors.reset}`);

test('L1: Раздел 12 "Mental Model" существует', 
  fileContainsSection(l1Path, 'Mental Model') || fileContainsSection(l1Path, 'Ментальная модель'));
test('L1: Упоминается ментальная модель vibecoding', 
  fileContains(l1Path, 'ментальн') && fileContains(l1Path, 'модель'));
test('L1: Упоминается смена роли разработчика', 
  fileContains(l1Path, 'роль') && fileContains(l1Path, 'разработчик'));
test('L1: Упоминается "Думай модулями, не файлами"', 
  fileContains(l1Path, 'модул') && fileContains(l1Path, 'файл'));
test('L1: Упоминается диаграмма или схема работы', 
  fileContains(l1Path, 'mermaid') || fileContains(l1Path, 'graph') || 
  fileContains(l1Path, 'схема'));

console.log('');

// ============================================================================
// Проверка отметок в IMPROVEMENTS_BACKLOG
// ============================================================================
console.log(`${colors.yellow}Проверка отметок в IMPROVEMENTS_BACKLOG${colors.reset}`);

const backlogPath = path.join(__dirname, 'research', 'IMPROVEMENTS_BACKLOG.md');

test('BACKLOG: Файл существует', fs.existsSync(backlogPath));
test('BACKLOG: Доработка 90 отмечена как выполненная', 
  fileContains(backlogPath, '#### 90. ✅'));
test('BACKLOG: Доработка 91 отмечена как выполненная', 
  fileContains(backlogPath, '#### 91. ✅'));
test('BACKLOG: Доработка 92 отмечена как выполненная', 
  fileContains(backlogPath, '#### 92. ✅'));
test('BACKLOG: Доработка 93 отмечена как выполненная', 
  fileContains(backlogPath, '#### 93. ✅'));
test('BACKLOG: Доработка 94 отмечена как выполненная', 
  fileContains(backlogPath, '#### 94. ✅'));
test('BACKLOG: Доработка 95 отмечена как выполненная', 
  fileContains(backlogPath, '#### 95. ✅'));
test('BACKLOG: Доработка 96 отмечена как выполненная', 
  fileContains(backlogPath, '#### 96. ✅'));
test('BACKLOG: Доработка 97 отмечена как выполненная', 
  fileContains(backlogPath, '#### 97. ✅'));

console.log('');

// ============================================================================
// Итоговая статистика
// ============================================================================
console.log(`${colors.blue}=== Итоговая статистика ===${colors.reset}`);
console.log(`Всего тестов: ${totalTests}`);
console.log(`${colors.green}Пройдено: ${passedTests}${colors.reset}`);
console.log(`${colors.red}Провалено: ${failedTests}${colors.reset}`);
console.log(`Процент успеха: ${((passedTests / totalTests) * 100).toFixed(1)}%\n`);

// Выход с кодом ошибки если есть проваленные тесты
if (failedTests > 0) {
  process.exit(1);
}
