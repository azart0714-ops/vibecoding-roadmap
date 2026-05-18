/**
 * Test Suite: Milestone 14 - Доработки 106-113
 * Дата: 18.05.2026
 * Описание: Автотесты для проверки доработок 106-113 (Tailwind, Prisma, БД провайдеры, Vercel)
 */

const fs = require('fs');
const path = require('path');

// Утилиты для тестирования
const testResults = [];

function test(name, fn) {
  try {
    fn();
    testResults.push({ name, status: 'PASS' });
    console.log(`✅ PASS: ${name}`);
  } catch (error) {
    testResults.push({ name, status: 'FAIL', error: error.message });
    console.log(`❌ FAIL: ${name}`);
    console.log(`   Error: ${error.message}`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function fileContains(filePath, searchString) {
  if (!fileExists(filePath)) return false;
  const content = fs.readFileSync(filePath, 'utf-8');
  return content.includes(searchString);
}

// Пути к файлам
const L4_PATH = path.join(__dirname, 'docs', 'L4_frontend_development.md');
const L5_PATH = path.join(__dirname, 'docs', 'L5_backend_databases.md');
const L7_PATH = path.join(__dirname, 'docs', 'L7_deployment_production.md');
const DATA_PATH = path.join(__dirname, 'data.js');
const SCRIPT_PATH = path.join(__dirname, 'script.js');
const BACKLOG_PATH = path.join(__dirname, 'research', 'IMPROVEMENTS_BACKLOG.md');

console.log('\n🧪 Запуск тестов Milestone 14...\n');

// ============================================================================
// ОБЩИЕ ПРОВЕРКИ
// ============================================================================

test('Все файлы документации и исходного кода существуют', () => {
  assert(fileExists(L4_PATH), 'L4 не найден');
  assert(fileExists(L5_PATH), 'L5 не найден');
  assert(fileExists(L7_PATH), 'L7 не найден');
  assert(fileExists(DATA_PATH), 'data.js не найден');
  assert(fileExists(SCRIPT_PATH), 'script.js не найден');
  assert(fileExists(BACKLOG_PATH), 'BACKLOG не найден');
});

// ============================================================================
// ТЕСТЫ ДЛЯ ДОРАБОТКИ 106: Tailwind best practices (L4)
// ============================================================================

test('106.1: L4 содержит раздел лучших практик Tailwind', () => {
  assert(
    fileContains(L4_PATH, 'Tailwind Best Practices') || fileContains(L4_PATH, 'Лучшие практики Tailwind'),
    'Раздел лучших практик Tailwind не найден в L4'
  );
});

test('106.2: Раздел содержит упоминание @apply и clsx/cn', () => {
  assert(
    fileContains(L4_PATH, '@apply') && (fileContains(L4_PATH, 'clsx') || fileContains(L4_PATH, 'cn(')),
    'Упоминание @apply или clsx/cn не найдено в L4'
  );
});

// ============================================================================
// ТЕСТЫ ДЛЯ ДОРАБОТОК 107-109: Prisma ORM (L5)
// ============================================================================

test('107.1: L5 содержит глубокий разбор преимуществ Prisma ORM', () => {
  assert(
    fileContains(L5_PATH, 'Prisma ORM') && fileContains(L5_PATH, 'vibecoding'),
    'Раздел Prisma ORM и vibecoding не найден в L5'
  );
});

test('108.1: L5 содержит сравнительную таблицу Prisma vs Drizzle vs TypeORM', () => {
  assert(
    fileContains(L5_PATH, 'Prisma') && fileContains(L5_PATH, 'Drizzle') && fileContains(L5_PATH, 'TypeORM'),
    'Сравнительная таблица Prisma vs Drizzle vs TypeORM не найдена в L5'
  );
});

test('109.1: L5 содержит TypeScript паттерны (Repository, Extensions)', () => {
  assert(
    fileContains(L5_PATH, 'Repository Pattern') || fileContains(L5_PATH, 'Extensions') || fileContains(L5_PATH, 'Soft Delete'),
    'Продвинутые паттерны (Repository, Prisma Extensions, Soft Delete) не найдены в L5'
  );
});

// ============================================================================
// ТЕСТЫ ДЛЯ ДОРАБОТОК 110-112: Облачные БД провайдеры (L5)
// ============================================================================

test('110.1: L5 содержит матрицу Neon vs Supabase vs Railway', () => {
  assert(
    fileContains(L5_PATH, 'Neon') && fileContains(L5_PATH, 'Supabase') && fileContains(L5_PATH, 'Railway'),
    'Сравнение Neon vs Supabase vs Railway не найдено в L5'
  );
});

test('111.1: L5 раскрывает преимущества Database Branching', () => {
  assert(
    fileContains(L5_PATH, 'Database Branching') || fileContains(L5_PATH, 'Ветвление баз данных'),
    'Раздел о Database Branching не найден в L5'
  );
});

test('112.1: L5 описывает экосистему Supabase и pgvector', () => {
  assert(
    fileContains(L5_PATH, 'Supabase') && fileContains(L5_PATH, 'pgvector'),
    'Упоминание экосистемы Supabase или pgvector не найдено в L5'
  );
});

// ============================================================================
// ТЕСТЫ ДЛЯ ДОРАБОТКИ 113: Vercel и Next.js (L7)
// ============================================================================

test('113.1: L7 содержит детальный гайд по деплою на Vercel', () => {
  assert(
    fileContains(L7_PATH, 'Vercel') && fileContains(L7_PATH, 'Next.js'),
    'Раздел деплоя Next.js на Vercel не найден в L7'
  );
});

test('113.2: L7 раскрывает Preview Deployments и Core Web Vitals в Vercel', () => {
  assert(
    fileContains(L7_PATH, 'Preview') && (fileContains(L7_PATH, 'Core Web Vitals') || fileContains(L7_PATH, 'Analytics')),
    'Упоминание Preview окружений или Core Web Vitals/Analytics не найдено в L7'
  );
});

// ============================================================================
// ТЕСТЫ ДЛЯ ИНТЕРАКТИВНЫХ УЗЛОВ (data.js и script.js)
// ============================================================================

test('Интерактивность: Новые узлы добавлены в data.js', () => {
  assert(fileContains(DATA_PATH, 'l5_7_prisma_vibecoding'), 'Узел l5_7_prisma_vibecoding не найден в data.js');
  assert(fileContains(DATA_PATH, 'l5_8_db_providers'), 'Узел l5_8_db_providers не найден в data.js');
  assert(fileContains(DATA_PATH, 'l7_11_vercel_gold'), 'Узел l7_11_vercel_gold не найден в data.js');
});

test('Интерактивность: Настроены визуальные связи в script.js', () => {
  assert(fileContains(SCRIPT_PATH, 'l5_7_prisma_vibecoding'), 'Связи для l5_7_prisma_vibecoding не найдены в script.js');
  assert(fileContains(SCRIPT_PATH, 'l5_8_db_providers'), 'Связи для l5_8_db_providers не найдены в script.js');
  assert(fileContains(SCRIPT_PATH, 'l7_11_vercel_gold'), 'Связи для l7_11_vercel_gold не найдены в script.js');
});

test('Интерактивность: Заданы веса Bento-карт в script.js', () => {
  assert(fileContains(SCRIPT_PATH, 'l5_7_prisma_vibecoding: "weight-medium"'), 'Вес для l5_7_prisma_vibecoding не найден');
  assert(fileContains(SCRIPT_PATH, 'l5_8_db_providers: "weight-medium"'), 'Вес для l5_8_db_providers не найден');
  assert(fileContains(SCRIPT_PATH, 'l7_11_vercel_gold: "weight-medium"'), 'Вес для l7_11_vercel_gold не найден');
});

// ============================================================================
// ПРОВЕРКА БЭКЛОГА
// ============================================================================

test('Все доработки 106-113 отмечены как выполненные в IMPROVEMENTS_BACKLOG.md', () => {
  for (let i = 106; i <= 113; i++) {
    assert(
      fileContains(BACKLOG_PATH, `#### ${i}. [x]`) ||
      fileContains(BACKLOG_PATH, `#### ${i}. ✅`),
      `Доработка ${i} не отмечена как выполненная в бэклоге`
    );
  }
});

// ============================================================================
// ВЫВОД РЕЗУЛЬТАТОВ
// ============================================================================

console.log('\n' + '='.repeat(70));
console.log('📊 РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ MILESTONE 14');
console.log('='.repeat(70));

const passed = testResults.filter(t => t.status === 'PASS').length;
const failed = testResults.filter(t => t.status === 'FAIL').length;
const total = testResults.length;

console.log(`\nВсего тестов: ${total}`);
console.log(`✅ Пройдено: ${passed}`);
console.log(`❌ Провалено: ${failed}`);
console.log(`📈 Процент успеха: ${((passed / total) * 100).toFixed(1)}%`);

if (failed > 0) {
  console.log('\n❌ Провалившиеся тесты:');
  testResults
    .filter(t => t.status === 'FAIL')
    .forEach(t => {
      console.log(`   - ${t.name}`);
      console.log(`     ${t.error}`);
    });
}

console.log('\n' + '='.repeat(70));

// Выход с соответствующим кодом
process.exit(failed > 0 ? 1 : 0);
