/**
 * Автотесты для Milestone 10: Доработки 72-80
 * 
 * Проверяет наличие всех добавленных разделов и контента
 */

const fs = require('fs');
const path = require('path');

// Цвета для вывода
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

let passedTests = 0;
let failedTests = 0;
const errors = [];

function test(description, fn) {
  try {
    fn();
    console.log(`${colors.green}✓${colors.reset} ${description}`);
    passedTests++;
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} ${description}`);
    console.log(`  ${colors.red}${error.message}${colors.reset}`);
    errors.push({ description, error: error.message });
    failedTests++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function fileContains(filePath, searchString) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return content.includes(searchString);
}

function fileContainsRegex(filePath, regex) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return regex.test(content);
}

console.log(`\n${colors.blue}=== Milestone 10 Tests ===${colors.reset}\n`);

// Тест 1: Проверка существования файлов
test('Файл L1_planning.md существует', () => {
  assert(
    fileExists('vibecoding-roadmap/docs/L1_planning.md'),
    'Файл L1_planning.md не найден'
  );
});

test('Файл L8_scaling_optimization.md существует', () => {
  assert(
    fileExists('vibecoding-roadmap/docs/L8_scaling_optimization.md'),
    'Файл L8_scaling_optimization.md не найден'
  );
});

test('Файл handoff_milestone_10.md создан', () => {
  assert(
    fileExists('vibecoding-roadmap/research/handoff_milestone_10.md'),
    'Файл handoff_milestone_10.md не найден'
  );
});

// Тест 2: Доработка 72 - Claude Projects
test('Доработка 72: Раздел "Claude Projects" добавлен в L8', () => {
  assert(
    fileContains('vibecoding-roadmap/docs/L8_scaling_optimization.md', 'Claude Projects'),
    'Раздел "Claude Projects" не найден'
  );
});

test('Доработка 72: Упоминание "Custom Instructions" присутствует', () => {
  assert(
    fileContains('vibecoding-roadmap/docs/L8_scaling_optimization.md', 'Custom Instructions'),
    'Упоминание "Custom Instructions" не найдено'
  );
});

test('Доработка 72: Упоминание "Project Knowledge" присутствует', () => {
  assert(
    fileContains('vibecoding-roadmap/docs/L8_scaling_optimization.md', 'Project Knowledge'),
    'Упоминание "Project Knowledge" не найдено'
  );
});

test('Доработка 72: Упоминание "5 проектов на Free" присутствует', () => {
  assert(
    fileContainsRegex('vibecoding-roadmap/docs/L8_scaling_optimization.md', /5\s+проект/i),
    'Упоминание "5 проектов" не найдено'
  );
});

// Тест 3: Доработка 73 - Примеры ролей агентов
test('Доработка 73: Раздел "Примеры специализированных ролей" добавлен', () => {
  assert(
    fileContains('vibecoding-roadmap/docs/L8_scaling_optimization.md', 'Примеры специализированных ролей'),
    'Раздел о ролях агентов не найден'
  );
});

test('Доработка 73: Tech Lead Agent описан', () => {
  assert(
    fileContains('vibecoding-roadmap/docs/L8_scaling_optimization.md', 'Tech Lead'),
    'Tech Lead Agent не описан'
  );
});

test('Доработка 73: Frontend Engineer Agent описан', () => {
  assert(
    fileContains('vibecoding-roadmap/docs/L8_scaling_optimization.md', 'Frontend Engineer'),
    'Frontend Engineer Agent не описан'
  );
});

test('Доработка 73: Backend Engineer Agent описан', () => {
  assert(
    fileContains('vibecoding-roadmap/docs/L8_scaling_optimization.md', 'Backend Engineer'),
    'Backend Engineer Agent не описан'
  );
});

test('Доработка 73: QA Engineer Agent описан', () => {
  assert(
    fileContains('vibecoding-roadmap/docs/L8_scaling_optimization.md', 'QA Engineer'),
    'QA Engineer Agent не описан'
  );
});

test('Доработка 73: DevOps Engineer Agent описан', () => {
  assert(
    fileContains('vibecoding-roadmap/docs/L8_scaling_optimization.md', 'DevOps Engineer'),
    'DevOps Engineer Agent не описан'
  );
});

test('Доработка 73: Security Auditor Agent описан', () => {
  assert(
    fileContains('vibecoding-roadmap/docs/L8_scaling_optimization.md', 'Security Auditor'),
    'Security Auditor Agent не описан'
  );
});

// Тест 4: Доработка 74 - Книги для AI
test('Доработка 74: Раздел "Книги для AI" добавлен в L1', () => {
  assert(
    fileContains('vibecoding-roadmap/docs/L1_planning.md', 'Книги для AI'),
    'Раздел "Книги для AI" не найден в L1'
  );
});

test('Доработка 74: Упоминание "Project Knowledge" в L1', () => {
  assert(
    fileContains('vibecoding-roadmap/docs/L1_planning.md', 'Project Knowledge'),
    'Упоминание "Project Knowledge" не найдено в L1'
  );
});

test('Доработка 74: Упоминание "best practices" в контексте книг', () => {
  assert(
    fileContains('vibecoding-roadmap/docs/L1_planning.md', 'best practices'),
    'Упоминание "best practices" не найдено'
  );
});

// Тест 5: Доработка 75 - Security Hook
test('Доработка 75: Раздел "Security Hook" добавлен', () => {
  assert(
    fileContains('vibecoding-roadmap/docs/L8_scaling_optimization.md', 'Security Hook'),
    'Раздел "Security Hook" не найден'
  );
});

test('Доработка 75: Упоминание "SQL injection" присутствует', () => {
  assert(
    fileContains('vibecoding-roadmap/docs/L8_scaling_optimization.md', 'SQL injection'),
    'Упоминание "SQL injection" не найдено'
  );
});

test('Доработка 75: Упоминание "XSS" присутствует', () => {
  assert(
    fileContains('vibecoding-roadmap/docs/L8_scaling_optimization.md', 'XSS'),
    'Упоминание "XSS" не найдено'
  );
});

test('Доработка 75: Упоминание "hardcoded secrets" присутствует', () => {
  assert(
    fileContainsRegex('vibecoding-roadmap/docs/L8_scaling_optimization.md', /hardcoded\s+secrets|secrets/i),
    'Упоминание "secrets" не найдено'
  );
});

test('Доработка 75: Пример установки Security Hook присутствует', () => {
  assert(
    fileContains('vibecoding-roadmap/docs/L8_scaling_optimization.md', 'curl'),
    'Пример установки не найден'
  );
});

test('Доработка 75: Упоминание "Anthropic" в контексте Security Hook', () => {
  assert(
    fileContains('vibecoding-roadmap/docs/L8_scaling_optimization.md', 'Anthropic'),
    'Упоминание "Anthropic" не найдено'
  );
});

// Тест 6: Доработка 76 - Умная система тестирования
test('Доработка 76: Концепция умного тестирования упомянута', () => {
  assert(
    fileContainsRegex('vibecoding-roadmap/docs/L8_scaling_optimization.md', /умн\w+\s+систем\w+\s+тестирования|AI.*тест/i),
    'Концепция умного тестирования не найдена'
  );
});

// Тест 7: Доработка 77 - Ночные тесты
test('Доработка 77: Упоминание "cron" для scheduled тестов', () => {
  assert(
    fileContains('vibecoding-roadmap/docs/L8_scaling_optimization.md', 'cron'),
    'Упоминание "cron" не найдено'
  );
});

test('Доработка 77: Упоминание "GitHub Actions" для CI/CD', () => {
  assert(
    fileContains('vibecoding-roadmap/docs/L8_scaling_optimization.md', 'GitHub Actions'),
    'Упоминание "GitHub Actions" не найдено'
  );
});

// Тест 8: Доработка 78 - Дашборд для тестов
test('Доработка 78: Упоминание "Grafana" для визуализации', () => {
  assert(
    fileContains('vibecoding-roadmap/docs/L8_scaling_optimization.md', 'Grafana'),
    'Упоминание "Grafana" не найдено'
  );
});

test('Доработка 78: Упоминание "k6 Cloud" присутствует', () => {
  assert(
    fileContains('vibecoding-roadmap/docs/L8_scaling_optimization.md', 'k6'),
    'Упоминание "k6" не найдено'
  );
});

// Тест 9: Доработка 79 - Реальные метрики экономии
test('Доработка 79: Упоминание "10x" экономии по токенам', () => {
  assert(
    fileContains('vibecoding-roadmap/docs/L8_scaling_optimization.md', '10x'),
    'Упоминание "10x" не найдено'
  );
});

test('Доработка 79: Упоминание "5x" экономии по времени', () => {
  assert(
    fileContains('vibecoding-roadmap/docs/L8_scaling_optimization.md', '5x'),
    'Упоминание "5x" не найдено'
  );
});

test('Доработка 79: Упоминание "Cline" в контексте экономии', () => {
  assert(
    fileContains('vibecoding-roadmap/docs/L8_scaling_optimization.md', 'Cline'),
    'Упоминание "Cline" не найдено'
  );
});

// Тест 10: Доработка 80 - Готовые примеры кода
test('Доработка 80: Примеры SKILL.md структуры присутствуют', () => {
  assert(
    fileContains('vibecoding-roadmap/docs/L8_scaling_optimization.md', 'SKILL.md'),
    'Примеры SKILL.md не найдены'
  );
});

test('Доработка 80: Примеры кода Playwright присутствуют', () => {
  assert(
    fileContains('vibecoding-roadmap/docs/L8_scaling_optimization.md', 'Playwright'),
    'Примеры Playwright не найдены'
  );
});

test('Доработка 80: Примеры триггеров агентов присутствуют', () => {
  assert(
    fileContainsRegex('vibecoding-roadmap/docs/L8_scaling_optimization.md', /Use this agent when|триггер/i),
    'Примеры триггеров не найдены'
  );
});

test('Доработка 80: Примеры кода в markdown блоках присутствуют', () => {
  assert(
    fileContainsRegex('vibecoding-roadmap/docs/L8_scaling_optimization.md', /```[\w]*\n/),
    'Примеры кода в markdown блоках не найдены'
  );
});

// Тест 11: Проверка handoff_milestone_10.md
test('Handoff содержит все 8 доработок', () => {
  const handoffContent = fs.readFileSync('vibecoding-roadmap/research/handoff_milestone_10.md', 'utf-8');
  const dorabotkaCount = (handoffContent.match(/Доработка \d+:/g) || []).length;
  assert(
    dorabotkaCount >= 8,
    `Handoff содержит только ${dorabotkaCount} доработок вместо 8`
  );
});

test('Handoff содержит статус "ЗАВЕРШЕНО"', () => {
  assert(
    fileContains('vibecoding-roadmap/research/handoff_milestone_10.md', 'ЗАВЕРШЕНО'),
    'Статус "ЗАВЕРШЕНО" не найден в handoff'
  );
});

test('Handoff содержит статистику', () => {
  assert(
    fileContains('vibecoding-roadmap/research/handoff_milestone_10.md', 'Статистика'),
    'Раздел статистики не найден в handoff'
  );
});

test('Handoff содержит список измененных файлов', () => {
  assert(
    fileContains('vibecoding-roadmap/research/handoff_milestone_10.md', 'Файлы изменены'),
    'Список измененных файлов не найден в handoff'
  );
});

// Итоговая статистика
console.log(`\n${colors.blue}=== Результаты ===${colors.reset}`);
console.log(`${colors.green}Пройдено: ${passedTests}${colors.reset}`);
console.log(`${colors.red}Провалено: ${failedTests}${colors.reset}`);
console.log(`Всего тестов: ${passedTests + failedTests}`);

if (failedTests > 0) {
  console.log(`\n${colors.red}=== Ошибки ===${colors.reset}`);
  errors.forEach(({ description, error }) => {
    console.log(`\n${colors.yellow}${description}${colors.reset}`);
    console.log(`  ${error}`);
  });
  process.exit(1);
} else {
  console.log(`\n${colors.green}✓ Все тесты пройдены успешно!${colors.reset}\n`);
  process.exit(0);
}
