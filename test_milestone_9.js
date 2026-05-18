/**
 * Автотесты для Milestone 9: Доработки 61-71
 * 
 * Проверяет наличие дополнительных разделов, визуализаций и практических примеров
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

console.log(`\n${colors.blue}=== Milestone 9: Автотесты для доработок 61-71 ===${colors.reset}\n`);

// ============================================================================
// Доработка 61: Секция "Официальные гайды и ресурсы"
// ============================================================================

console.log(`${colors.yellow}Доработка 61: Секция "Официальные гайды и ресурсы"${colors.reset}`);

test('61.1: Раздел "Официальные гайды и ресурсы" существует в L3', () => {
  assertFileContains(
    'docs/L3_professional_environment.md',
    'Официальные гайды и ресурсы',
    'Раздел "Официальные гайды и ресурсы" не найден в L3'
  );
});

test('61.2: Blake Crosley Guide упоминается', () => {
  assertFileContains(
    'docs/L3_professional_environment.md',
    'Blake Crosley Guide',
    'Blake Crosley Guide не найден'
  );
});

test('61.3: URL Blake Crosley Guide присутствует', () => {
  assertFileContains(
    'docs/L3_professional_environment.md',
    'https://blakecrosley.com/guides/claude-code',
    'URL Blake Crosley Guide не найден'
  );
});

test('61.4: Anthropic Documentation упоминается', () => {
  assertFileContains(
    'docs/L3_professional_environment.md',
    'Anthropic Documentation',
    'Anthropic Documentation не найдена'
  );
});

// ============================================================================
// Доработка 62: Раздел "Контекстные окна и токены"
// ============================================================================

console.log(`\n${colors.yellow}Доработка 62: Раздел "Контекстные окна и токены"${colors.reset}`);

test('62.1: Раздел "Контекстные окна и токены" существует в L2', () => {
  assertFileContains(
    'docs/L2_vibecoding_principles.md',
    'Контекстные окна и токены',
    'Раздел "Контекстные окна и токены" не найден в L2'
  );
});

test('62.2: Упоминание 200,000 токенов контекста', () => {
  assertFileContains(
    'docs/L2_vibecoding_principles.md',
    '200,000 токенов',
    'Информация о 200,000 токенов не найдена'
  );
});

test('62.3: Формула токенов присутствует', () => {
  assertFileMatches(
    'docs/L2_vibecoding_principles.md',
    /1 токен.*0\.75 слова.*4 символа/,
    'Формула токенов не найдена'
  );
});

test('62.4: Упоминание Cline экономит 10x по токенам', () => {
  assertFileContains(
    'docs/L2_vibecoding_principles.md',
    '10x по токенам',
    'Информация об экономии токенов через Cline не найдена'
  );
});

// ============================================================================
// Доработка 63: "Формула успеха тестирования"
// ============================================================================

console.log(`\n${colors.yellow}Доработка 63: "Формула успеха тестирования"${colors.reset}`);

test('63.1: Формула успеха тестирования присутствует', () => {
  assertFileContains(
    'docs/L2_vibecoding_principles.md',
    'ФОРМУЛА',
    'Формула успеха не найдена'
  );
});

test('63.2: Упоминание "1 час на написание тестов"', () => {
  assertFileContains(
    'docs/L2_vibecoding_principles.md',
    '1 час на написание тестов',
    'Текст о 1 часе на тесты не найден'
  );
});

test('63.3: Упоминание "10 часов сэкономленного дебага"', () => {
  assertFileContains(
    'docs/L2_vibecoding_principles.md',
    '10 часов сэкономленного дебага',
    'Текст о 10 часах дебага не найден'
  );
});

test('63.4: Формула в разделе "Пирамида тестирования"', () => {
  assertFileContains(
    'docs/L2_vibecoding_principles.md',
    'Пирамида тестирования',
    'Раздел "Пирамида тестирования" не найден'
  );
});

// ============================================================================
// Доработка 64: "Пирамида тестирования - визуализация"
// ============================================================================

console.log(`\n${colors.yellow}Доработка 64: "Пирамида тестирования - визуализация"${colors.reset}`);

test('64.1: Раздел "Пирамида тестирования" существует в L4', () => {
  assertFileContains(
    'docs/L4_frontend_development.md',
    'Пирамида тестирования',
    'Раздел "Пирамида тестирования" не найден в L4'
  );
});

test('64.2: Mermaid диаграмма присутствует', () => {
  assertFileContains(
    'docs/L4_frontend_development.md',
    '```mermaid',
    'Mermaid диаграмма не найдена'
  );
});

test('64.3: Упоминание E2E Tests (10%)', () => {
  assertFileMatches(
    'docs/L4_frontend_development.md',
    /E2E.*10%/,
    'Информация о E2E Tests (10%) не найдена'
  );
});

test('64.4: Упоминание Unit Tests (70%)', () => {
  assertFileMatches(
    'docs/L4_frontend_development.md',
    /Unit.*70/,
    'Информация о Unit Tests (70%) не найдена'
  );
});

// ============================================================================
// Доработка 65: "Инструменты тестирования - полный стек"
// ============================================================================

console.log(`\n${colors.yellow}Доработка 65: "Инструменты тестирования - полный стек"${colors.reset}`);

test('65.1: Упоминание Vitest для Unit тестов', () => {
  assertFileContains(
    'docs/L4_frontend_development.md',
    'Vitest',
    'Vitest не найден'
  );
});

test('65.2: Упоминание MSW для Integration тестов', () => {
  assertFileContains(
    'docs/L4_frontend_development.md',
    'MSW',
    'MSW не найден'
  );
});

test('65.3: Упоминание Playwright для E2E тестов', () => {
  assertFileContains(
    'docs/L4_frontend_development.md',
    'Playwright',
    'Playwright не найден'
  );
});

test('65.4: Упоминание Storybook для Visual тестов', () => {
  assertFileContains(
    'docs/L4_frontend_development.md',
    'Storybook',
    'Storybook не найден'
  );
});

// ============================================================================
// Доработка 66: "Zustand vs Redux - сравнение"
// ============================================================================

console.log(`\n${colors.yellow}Доработка 66: "Zustand vs Redux - сравнение"${colors.reset}`);

test('66.1: Раздел "Zustand vs Redux" существует', () => {
  assertFileContains(
    'docs/L4_frontend_development.md',
    'Zustand vs Redux',
    'Раздел "Zustand vs Redux" не найден'
  );
});

test('66.2: Упоминание "в 2-3 раза меньше кода"', () => {
  assertFileMatches(
    'docs/L4_frontend_development.md',
    /2-3 раза меньше кода/,
    'Информация о меньшем количестве кода не найдена'
  );
});

test('66.3: Упоминание Redux boilerplate', () => {
  assertFileContains(
    'docs/L4_frontend_development.md',
    'boilerplate',
    'Информация о boilerplate не найдена'
  );
});

test('66.4: Рекомендация Zustand для новых проектов', () => {
  assertFileMatches(
    'docs/L4_frontend_development.md',
    /Zustand.*новых проектов/,
    'Рекомендация Zustand не найдена'
  );
});

// ============================================================================
// Доработка 67: Визуальное сравнение "Монолит vs Feature-based"
// ============================================================================

console.log(`\n${colors.yellow}Доработка 67: Визуальное сравнение "Монолит vs Feature-based"${colors.reset}`);

test('67.1: Раздел "Монолит vs Feature-based" существует', () => {
  assertFileContains(
    'docs/L4_frontend_development.md',
    'Монолит vs Feature-based',
    'Раздел "Монолит vs Feature-based" не найден'
  );
});

test('67.2: Упоминание "10 минут на кнопку" для монолита', () => {
  assertFileContains(
    'docs/L4_frontend_development.md',
    '10 минут',
    'Информация о 10 минутах не найдена'
  );
});

test('67.3: Упоминание "10 секунд" для Feature-based', () => {
  assertFileContains(
    'docs/L4_frontend_development.md',
    '10 секунд',
    'Информация о 10 секундах не найдена'
  );
});

test('67.4: Реальный кейс "Шеф, всё пропало"', () => {
  assertFileContains(
    'docs/L4_frontend_development.md',
    'Шеф, всё пропало',
    'Реальный кейс не найден'
  );
});

// ============================================================================
// Доработка 68: "5 переиспользуемых блоков"
// ============================================================================

console.log(`\n${colors.yellow}Доработка 68: "5 переиспользуемых блоков"${colors.reset}`);

test('68.1: Раздел "5 переиспользуемых блоков" существует', () => {
  assertFileContains(
    'docs/L4_frontend_development.md',
    '5 переиспользуемых блоков',
    'Раздел "5 переиспользуемых блоков" не найден'
  );
});

test('68.2: Формула "80% кода уже написано"', () => {
  assertFileContains(
    'docs/L4_frontend_development.md',
    '80% кода',
    'Формула 80% кода не найдена'
  );
});

test('68.3: Упоминание UI Дизайн-системы', () => {
  assertFileContains(
    'docs/L4_frontend_development.md',
    'Дизайн-система',
    'UI Дизайн-система не найдена'
  );
});

test('68.4: Упоминание всех 5 блоков', () => {
  const content = fs.readFileSync(path.join(__dirname, 'docs/L4_frontend_development.md'), 'utf-8');
  const hasAuth = content.includes('Авторизация');
  const hasNav = content.includes('Навигация');
  const hasAPI = content.includes('API слой');
  const hasUtils = content.includes('Утилиты');
  
  if (!hasAuth || !hasNav || !hasAPI || !hasUtils) {
    throw new Error('Не все 5 блоков упомянуты');
  }
});

// ============================================================================
// Доработка 69: "Шоукейсы (Showcases) - Must Have"
// ============================================================================

console.log(`\n${colors.yellow}Доработка 69: "Шоукейсы (Showcases) - Must Have"${colors.reset}`);

test('69.1: Раздел "Шоукейсы" или "Showcases" существует', () => {
  assertFileMatches(
    'docs/L4_frontend_development.md',
    /Шоукейсы|Showcases/,
    'Раздел "Шоукейсы" не найден'
  );
});

test('69.2: Упоминание "60 минут вместо дней"', () => {
  assertFileContains(
    'docs/L4_frontend_development.md',
    '60 минут',
    'Информация о 60 минутах не найдена'
  );
});

test('69.3: Упоминание "20 пунктов за 15 минут"', () => {
  assertFileMatches(
    'docs/L4_frontend_development.md',
    /20 пунктов.*15 минут/,
    'Реальный пример не найден'
  );
});

test('69.4: Описание преимуществ Showcases', () => {
  assertFileContains(
    'docs/L4_frontend_development.md',
    'Видно все варианты',
    'Описание преимуществ не найдено'
  );
});

// ============================================================================
// Доработка 70: "Стоимость инструментов - полный расчёт"
// ============================================================================

console.log(`\n${colors.yellow}Доработка 70: "Стоимость инструментов - полный расчёт"${colors.reset}`);

test('70.1: Раздел "Стоимость инструментов" существует в L3', () => {
  assertFileContains(
    'docs/L3_professional_environment.md',
    'Стоимость инструментов',
    'Раздел "Стоимость инструментов" не найден в L3'
  );
});

test('70.2: Упоминание Claude Pro $20/мес', () => {
  assertFileMatches(
    'docs/L3_professional_environment.md',
    /Claude Pro.*\$20/,
    'Информация о Claude Pro $20 не найдена'
  );
});

test('70.3: Упоминание Railway $5/мес', () => {
  assertFileMatches(
    'docs/L3_professional_environment.md',
    /Railway.*\$5/,
    'Информация о Railway $5 не найдена'
  );
});

test('70.4: Три уровня наборов (Минимальный, Оптимальный, Премиум)', () => {
  const content = fs.readFileSync(path.join(__dirname, 'docs/L3_professional_environment.md'), 'utf-8');
  const hasMin = content.includes('Минимальный') || content.includes('минимум');
  const hasOpt = content.includes('Оптимальный');
  const hasPrem = content.includes('Премиум');
  
  if (!hasMin || !hasOpt || !hasPrem) {
    throw new Error('Не все три уровня наборов упомянуты');
  }
});

// ============================================================================
// Доработка 71: "Railway - детальные характеристики"
// ============================================================================

console.log(`\n${colors.yellow}Доработка 71: "Railway - детальные характеристики"${colors.reset}`);

test('71.1: Упоминание 650+ шаблонов Railway', () => {
  assertFileContains(
    'docs/L3_professional_environment.md',
    '650',
    'Информация о 650+ шаблонах не найдена'
  );
});

test('71.2: Упоминание Canvas UI', () => {
  assertFileContains(
    'docs/L3_professional_environment.md',
    'Canvas',
    'Информация о Canvas UI не найдена'
  );
});

test('71.3: Упоминание Environments (prod, dev, staging)', () => {
  assertFileContains(
    'docs/L3_professional_environment.md',
    'Environments',
    'Информация о Environments не найдена'
  );
});

test('71.4: Вердикт "Лучшие $5"', () => {
  assertFileMatches(
    'docs/L3_professional_environment.md',
    /[Лл]учшие.*\$5/,
    'Вердикт о лучших $5 не найден'
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
