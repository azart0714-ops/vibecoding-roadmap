/**
 * Автотесты для Milestone 8: Доработки 56-60
 * 
 * Проверяет наличие критических предупреждений и примеров в документации
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

// Счетчики тестов
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

/**
 * Функция для запуска теста
 */
function test(description, testFn) {
  totalTests++;
  try {
    testFn();
    passedTests++;
    console.log(`${colors.green}✓${colors.reset} ${description}`);
  } catch (error) {
    failedTests++;
    console.log(`${colors.red}✗${colors.reset} ${description}`);
    console.log(`  ${colors.red}${error.message}${colors.reset}`);
  }
}

/**
 * Проверка наличия текста в файле
 */
function assertFileContains(filePath, searchText, errorMessage) {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Файл не найден: ${filePath}`);
  }
  
  const content = fs.readFileSync(fullPath, 'utf-8');
  
  if (!content.includes(searchText)) {
    throw new Error(errorMessage || `Текст не найден в файле ${filePath}: "${searchText}"`);
  }
}

/**
 * Проверка наличия регулярного выражения в файле
 */
function assertFileMatches(filePath, regex, errorMessage) {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Файл не найден: ${filePath}`);
  }
  
  const content = fs.readFileSync(fullPath, 'utf-8');
  
  if (!regex.test(content)) {
    throw new Error(errorMessage || `Паттерн не найден в файле ${filePath}: ${regex}`);
  }
}

console.log(`\n${colors.blue}=== Milestone 8: Автотесты для доработок 56-60 ===${colors.reset}\n`);

// ============================================================================
// Доработка 56: Предупреждение "AI создаёт костыли"
// ============================================================================

console.log(`${colors.yellow}Доработка 56: Предупреждение "AI создаёт костыли"${colors.reset}`);

test('56.1: Раздел "AI обманывает" существует в L2', () => {
  assertFileContains(
    'docs/L2_vibecoding_principles.md',
    '### Раздел 11: Критические ошибки AI',
    'Раздел 11 не найден в L2'
  );
});

test('56.2: Подраздел "AI обманывает - реальные примеры" существует', () => {
  assertFileContains(
    'docs/L2_vibecoding_principles.md',
    '#### 11.1. AI обманывает - реальные примеры',
    'Подраздел 11.1 не найден'
  );
});

test('56.3: Пример 1 "Костыль вместо правильного решения" присутствует', () => {
  assertFileContains(
    'docs/L2_vibecoding_principles.md',
    '**Пример 1: Костыль вместо правильного решения**',
    'Пример 1 не найден'
  );
});

test('56.4: Пример 2 "Технический долг в новом коде" присутствует', () => {
  assertFileContains(
    'docs/L2_vibecoding_principles.md',
    '**Пример 2: Технический долг в новом коде**',
    'Пример 2 не найден'
  );
});

test('56.5: Пример 3 "Катастрофа V2" присутствует', () => {
  assertFileContains(
    'docs/L2_vibecoding_principles.md',
    '**Пример 3: Катастрофа V2 - потеря коммитов**',
    'Пример 3 не найден'
  );
});

test('56.6: Критическое предупреждение CAUTION присутствует', () => {
  assertFileMatches(
    'docs/L2_vibecoding_principles.md',
    />\s*\[!CAUTION\][\s\S]*AI может создавать костыли/,
    'Критическое предупреждение CAUTION не найдено'
  );
});

// ============================================================================
// Доработка 57: Предупреждение "Вредоносные Skills"
// ============================================================================

console.log(`\n${colors.yellow}Доработка 57: Предупреждение "Вредоносные Skills"${colors.reset}`);

test('57.1: Раздел "Skills" существует в L8', () => {
  assertFileContains(
    'docs/L8_scaling_optimization.md',
    '### Раздел 12: Skills — Книга рецептов для AI',
    'Раздел Skills не найден в L8'
  );
});

test('57.2: Предупреждение о вредоносных Skills присутствует', () => {
  assertFileMatches(
    'docs/L8_scaling_optimization.md',
    />\s*\[!CAUTION\][\s\S]*Вредоносные Skills/,
    'Предупреждение о вредоносных Skills не найдено'
  );
});

test('57.3: Упоминание "100% будут вредоносные скилы" присутствует', () => {
  assertFileContains(
    'docs/L8_scaling_optimization.md',
    '**100% будут вредоносные скилы!**',
    'Текст о 100% вредоносных скилов не найден'
  );
});

test('57.4: Типичные угрозы перечислены', () => {
  assertFileContains(
    'docs/L8_scaling_optimization.md',
    '**Типичные угрозы**:',
    'Раздел "Типичные угрозы" не найден'
  );
});

test('57.5: Обязательные меры безопасности перечислены', () => {
  assertFileContains(
    'docs/L8_scaling_optimization.md',
    '**Обязательные меры безопасности**:',
    'Раздел "Обязательные меры безопасности" не найден'
  );
});

test('57.6: Красные флаги перечислены', () => {
  assertFileContains(
    'docs/L8_scaling_optimization.md',
    '**Красные флаги (не устанавливайте, если видите)**:',
    'Раздел "Красные флаги" не найден'
  );
});

// ============================================================================
// Доработка 58: Предупреждение "Git flow обязателен"
// ============================================================================

console.log(`\n${colors.yellow}Доработка 58: Предупреждение "Git flow обязателен"${colors.reset}`);

test('58.1: Раздел "Git: Машина времени для кода" существует', () => {
  assertFileContains(
    'docs/L2_vibecoding_principles.md',
    '#### 1.2. Git: Машина времени для кода',
    'Раздел Git не найден в L2'
  );
});

test('58.2: Критическое предупреждение об AI и Git присутствует', () => {
  assertFileMatches(
    'docs/L2_vibecoding_principles.md',
    />\s*\[!CAUTION\][\s\S]*AI может удалить код и коммиты/,
    'Критическое предупреждение об AI и Git не найдено'
  );
});

test('58.3: Упоминание Pull Requests обязательны', () => {
  assertFileContains(
    'docs/L2_vibecoding_principles.md',
    '**Pull Requests обязательны**',
    'Текст о Pull Requests не найден'
  );
});

test('58.4: Упоминание строгого Git Flow', () => {
  assertFileContains(
    'docs/L2_vibecoding_principles.md',
    '**Строгий Git Flow**',
    'Текст о строгом Git Flow не найден'
  );
});

test('58.5: Упоминание защиты master ветки', () => {
  assertFileContains(
    'docs/L2_vibecoding_principles.md',
    '**Защита master ветки**',
    'Текст о защите master ветки не найден'
  );
});

test('58.6: Обязательные меры защиты перечислены', () => {
  assertFileContains(
    'docs/L2_vibecoding_principles.md',
    '**Обязательные меры защиты**:',
    'Раздел "Обязательные меры защиты" не найден'
  );
});

// ============================================================================
// Доработка 59: Пример "Структура скила"
// ============================================================================

console.log(`\n${colors.yellow}Доработка 59: Пример "Структура скила"${colors.reset}`);

test('59.1: Заголовок "Пример полной структуры SKILL.md" присутствует', () => {
  assertFileContains(
    'docs/L8_scaling_optimization.md',
    '#### Пример полной структуры SKILL.md:',
    'Заголовок примера структуры скила не найден'
  );
});

test('59.2: Пример содержит название скила', () => {
  assertFileContains(
    'docs/L8_scaling_optimization.md',
    '# Skill: E2E Testing with Playwright',
    'Название скила не найдено'
  );
});

test('59.3: Пример содержит версию и автора', () => {
  assertFileContains(
    'docs/L8_scaling_optimization.md',
    '**Версия**: 1.2.0',
    'Версия скила не найдена'
  );
});

test('59.4: Пример содержит триггеры активации', () => {
  assertFileContains(
    'docs/L8_scaling_optimization.md',
    '## Триггеры активации / Use this skill when:',
    'Раздел триггеров не найден'
  );
});

test('59.5: Пример содержит алгоритм выполнения', () => {
  assertFileContains(
    'docs/L8_scaling_optimization.md',
    '## Алгоритм выполнения',
    'Раздел алгоритма выполнения не найден'
  );
});

test('59.6: Пример содержит критерии приемки (DoD)', () => {
  assertFileContains(
    'docs/L8_scaling_optimization.md',
    '## Критерии приемки (DoD)',
    'Раздел критериев приемки не найден'
  );
});

test('59.7: Пример содержит примеры использования', () => {
  assertFileContains(
    'docs/L8_scaling_optimization.md',
    '## Примеры использования',
    'Раздел примеров использования не найден'
  );
});

// ============================================================================
// Доработка 60: Пример "Триггеры агента"
// ============================================================================

console.log(`\n${colors.yellow}Доработка 60: Пример "Триггеры агента"${colors.reset}`);

test('60.1: Заголовок "Пример расширенных триггеров" присутствует', () => {
  assertFileContains(
    'docs/L8_scaling_optimization.md',
    '#### Пример расширенных триггеров для субагента:',
    'Заголовок примера триггеров не найден'
  );
});

test('60.2: Пример содержит раздел "Use this agent when"', () => {
  assertFileContains(
    'docs/L8_scaling_optimization.md',
    '## Use this agent when / Активировать агента если:',
    'Раздел "Use this agent when" не найден'
  );
});

test('60.3: Пример содержит триггеры на русском языке', () => {
  assertFileContains(
    'docs/L8_scaling_optimization.md',
    '### Тестирование (Testing):',
    'Триггеры на русском не найдены'
  );
});

test('60.4: Пример содержит триггеры на английском языке', () => {
  assertFileContains(
    'docs/L8_scaling_optimization.md',
    'write tests, create tests, add tests',
    'Триггеры на английском не найдены'
  );
});

test('60.5: Пример содержит триггеры для инструментов', () => {
  assertFileContains(
    'docs/L8_scaling_optimization.md',
    '### Инструменты (Tools):',
    'Раздел триггеров для инструментов не найден'
  );
});

test('60.6: Пример содержит ключевые фразы', () => {
  assertFileContains(
    'docs/L8_scaling_optimization.md',
    '### Ключевые фразы (Key phrases):',
    'Раздел ключевых фраз не найден'
  );
});

test('60.7: Пример содержит объяснение "Почему это важно"', () => {
  assertFileContains(
    'docs/L8_scaling_optimization.md',
    '**Почему это важно**:',
    'Раздел "Почему это важно" не найден'
  );
});

// ============================================================================
// Итоговая статистика
// ============================================================================

console.log(`\n${colors.blue}=== Итоговая статистика ===${colors.reset}`);
console.log(`Всего тестов: ${totalTests}`);
console.log(`${colors.green}Пройдено: ${passedTests}${colors.reset}`);
console.log(`${colors.red}Провалено: ${failedTests}${colors.reset}`);

if (failedTests === 0) {
  console.log(`\n${colors.green}✓ Все тесты пройдены успешно!${colors.reset}\n`);
  process.exit(0);
} else {
  console.log(`\n${colors.red}✗ Некоторые тесты провалены${colors.reset}\n`);
  process.exit(1);
}
