/**
 * Test Suite: Milestone 13 - Доработки 98-105
 * Дата: 17.05.2026
 * Описание: Автотесты для проверки доработок 98-105
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

function fileContainsRegex(filePath, regex) {
  if (!fileExists(filePath)) return false;
  const content = fs.readFileSync(filePath, 'utf-8');
  return regex.test(content);
}

// Пути к файлам
const L3_PATH = path.join(__dirname, 'docs', 'L3_professional_environment.md');
const L0_PATH = path.join(__dirname, 'docs', 'L0_fundamentals.md');
const L4_PATH = path.join(__dirname, 'docs', 'L4_frontend_development.md');
const BACKLOG_PATH = path.join(__dirname, 'research', 'IMPROVEMENTS_BACKLOG.md');

console.log('\n🧪 Запуск тестов Milestone 13...\n');

// ============================================================================
// ТЕСТЫ ДЛЯ ДОРАБОТКИ 98: Platform Support Matrix (L3)
// ============================================================================

test('98.1: L3 содержит раздел Platform Support Matrix', () => {
  assert(fileExists(L3_PATH), 'Файл L3 не найден');
  assert(
    fileContains(L3_PATH, 'Platform Support Matrix') ||
    fileContains(L3_PATH, 'Поддерживаемые платформы'),
    'Раздел Platform Support Matrix не найден в L3'
  );
});

test('98.2: Platform Support Matrix содержит macOS', () => {
  assert(
    fileContains(L3_PATH, 'macOS') || fileContains(L3_PATH, 'Mac'),
    'Упоминание macOS не найдено'
  );
});

test('98.3: Platform Support Matrix содержит Linux', () => {
  assert(
    fileContains(L3_PATH, 'Linux'),
    'Упоминание Linux не найдено'
  );
});

test('98.4: Platform Support Matrix содержит Windows', () => {
  assert(
    fileContains(L3_PATH, 'Windows') || fileContains(L3_PATH, 'WSL'),
    'Упоминание Windows не найдено'
  );
});

test('98.5: Доработка 98 отмечена как выполненная в BACKLOG', () => {
  assert(
    fileContains(BACKLOG_PATH, '#### 98. [x]') ||
    fileContains(BACKLOG_PATH, '#### 98. ✅'),
    'Доработка 98 не отмечена как выполненная'
  );
});

// ============================================================================
// ТЕСТЫ ДЛЯ ДОРАБОТКИ 99: Стратегия обновлений (L3)
// ============================================================================

test('99.1: L3 содержит раздел о стратегии обновлений', () => {
  assert(
    fileContains(L3_PATH, 'обновлен') || fileContains(L3_PATH, 'update'),
    'Раздел о стратегии обновлений не найден в L3'
  );
});

test('99.2: Стратегия обновлений содержит рекомендации', () => {
  assert(
    fileContains(L3_PATH, 'changelog') || fileContains(L3_PATH, 'версии'),
    'Рекомендации по обновлениям не найдены'
  );
});

test('99.3: Доработка 99 отмечена как выполненная в BACKLOG', () => {
  assert(
    fileContains(BACKLOG_PATH, '#### 99. [x]') ||
    fileContains(BACKLOG_PATH, '#### 99. ✅'),
    'Доработка 99 не отмечена как выполненная'
  );
});

// ============================================================================
// ТЕСТЫ ДЛЯ ДОРАБОТКИ 100: Related Deep Dives (L0)
// ============================================================================

test('100.1: L0 содержит раздел Related Deep Dives', () => {
  assert(fileExists(L0_PATH), 'Файл L0 не найден');
  assert(
    fileContains(L0_PATH, 'Related Deep Dives') ||
    fileContains(L0_PATH, 'Углубленное изучение'),
    'Раздел Related Deep Dives не найден в L0'
  );
});

test('100.2: Related Deep Dives содержит ссылки на книги', () => {
  assert(
    fileContains(L0_PATH, 'Книги') || fileContains(L0_PATH, 'Books'),
    'Раздел с книгами не найден'
  );
});

test('100.3: Related Deep Dives содержит ссылки на ресурсы', () => {
  assert(
    fileContains(L0_PATH, 'Ресурсы') || fileContains(L0_PATH, 'Resources'),
    'Раздел с ресурсами не найден'
  );
});

test('100.4: Related Deep Dives содержит упоминание Y Combinator', () => {
  assert(
    fileContains(L0_PATH, 'Y Combinator') || fileContains(L0_PATH, 'YC'),
    'Упоминание Y Combinator не найдено'
  );
});

test('100.5: Доработка 100 отмечена как выполненная в BACKLOG', () => {
  assert(
    fileContains(BACKLOG_PATH, '#### 100. [x]') ||
    fileContains(BACKLOG_PATH, '#### 100. ✅'),
    'Доработка 100 не отмечена как выполненная'
  );
});

// ============================================================================
// ТЕСТЫ ДЛЯ ДОРАБОТКИ 101: Сравнительная таблица Frontend (L4)
// ============================================================================

test('101.1: L4 содержит сравнительную таблицу фреймворков', () => {
  assert(fileExists(L4_PATH), 'Файл L4 не найден');
  assert(
    fileContains(L4_PATH, 'Сравнительная таблица') ||
    fileContains(L4_PATH, 'React vs Vue'),
    'Сравнительная таблица фреймворков не найдена в L4'
  );
});

test('101.2: Таблица содержит React', () => {
  assert(
    fileContains(L4_PATH, 'React'),
    'React не найден в таблице'
  );
});

test('101.3: Таблица содержит Vue', () => {
  assert(
    fileContains(L4_PATH, 'Vue'),
    'Vue не найден в таблице'
  );
});

test('101.4: Таблица содержит Svelte', () => {
  assert(
    fileContains(L4_PATH, 'Svelte'),
    'Svelte не найден в таблице'
  );
});

test('101.5: Таблица содержит критерий AI-friendly', () => {
  assert(
    fileContains(L4_PATH, 'AI-friendly') || fileContains(L4_PATH, 'AI friendly'),
    'Критерий AI-friendly не найден'
  );
});

test('101.6: Доработка 101 отмечена как выполненная в BACKLOG', () => {
  assert(
    fileContains(BACKLOG_PATH, '#### 101. [x]') ||
    fileContains(BACKLOG_PATH, '#### 101. ✅'),
    'Доработка 101 не отмечена как выполненная'
  );
});

// ============================================================================
// ТЕСТЫ ДЛЯ ДОРАБОТКИ 102: Next.js vs Remix vs Astro (L4)
// ============================================================================

test('102.1: L4 содержит сравнение Next.js vs Remix vs Astro', () => {
  assert(
    fileContains(L4_PATH, 'Next.js') && 
    (fileContains(L4_PATH, 'Remix') || fileContains(L4_PATH, 'Astro')),
    'Сравнение мета-фреймворков не найдено в L4'
  );
});

test('102.2: Раздел содержит Next.js', () => {
  assert(
    fileContains(L4_PATH, 'Next.js'),
    'Next.js не найден'
  );
});

test('102.3: Раздел содержит Remix', () => {
  assert(
    fileContains(L4_PATH, 'Remix'),
    'Remix не найден'
  );
});

test('102.4: Раздел содержит Astro', () => {
  assert(
    fileContains(L4_PATH, 'Astro'),
    'Astro не найден'
  );
});

test('102.5: Раздел содержит рекомендации когда что использовать', () => {
  assert(
    fileContains(L4_PATH, 'когда') || fileContains(L4_PATH, 'выбирай'),
    'Рекомендации по выбору не найдены'
  );
});

test('102.6: Доработка 102 отмечена как выполненная в BACKLOG', () => {
  assert(
    fileContains(BACKLOG_PATH, '#### 102. [x]') ||
    fileContains(BACKLOG_PATH, '#### 102. ✅'),
    'Доработка 102 не отмечена как выполненная'
  );
});

// ============================================================================
// ТЕСТЫ ДЛЯ ДОРАБОТКИ 103: React 18+ возможности (L4)
// ============================================================================

test('103.1: L4 содержит раздел о React 18+', () => {
  assert(
    fileContains(L4_PATH, 'React 18') || fileContains(L4_PATH, 'Server Components'),
    'Раздел о React 18+ не найден в L4'
  );
});

test('103.2: Раздел содержит Server Components', () => {
  assert(
    fileContains(L4_PATH, 'Server Components'),
    'Server Components не найдены'
  );
});

test('103.3: Раздел содержит Suspense', () => {
  assert(
    fileContains(L4_PATH, 'Suspense'),
    'Suspense не найден'
  );
});

test('103.4: Раздел содержит Server Actions', () => {
  assert(
    fileContains(L4_PATH, 'Server Actions'),
    'Server Actions не найдены'
  );
});

test('103.5: Доработка 103 отмечена как выполненная в BACKLOG', () => {
  assert(
    fileContains(BACKLOG_PATH, '#### 103. [x]') ||
    fileContains(BACKLOG_PATH, '#### 103. ✅'),
    'Доработка 103 не отмечена как выполненная'
  );
});

// ============================================================================
// ТЕСТЫ ДЛЯ ДОРАБОТКИ 104: Почему Tailwind (L4)
// ============================================================================

test('104.1: L4 содержит раздел о Tailwind CSS', () => {
  assert(
    fileContains(L4_PATH, 'Tailwind'),
    'Раздел о Tailwind не найден в L4'
  );
});

test('104.2: Раздел объясняет преимущества Tailwind для AI', () => {
  assert(
    fileContains(L4_PATH, 'AI') && fileContains(L4_PATH, 'Tailwind'),
    'Объяснение преимуществ Tailwind для AI не найдено'
  );
});

test('104.3: Раздел содержит примеры кода Tailwind', () => {
  assert(
    fileContains(L4_PATH, 'className') || fileContains(L4_PATH, 'px-') || fileContains(L4_PATH, 'bg-'),
    'Примеры кода Tailwind не найдены'
  );
});

test('104.4: Доработка 104 отмечена как выполненная в BACKLOG', () => {
  assert(
    fileContains(BACKLOG_PATH, '#### 104. [x]') ||
    fileContains(BACKLOG_PATH, '#### 104. ✅'),
    'Доработка 104 не отмечена как выполненная'
  );
});

// ============================================================================
// ТЕСТЫ ДЛЯ ДОРАБОТКИ 105: Tailwind vs CSS Modules (L4)
// ============================================================================

test('105.1: L4 содержит сравнение Tailwind vs CSS Modules', () => {
  assert(
    fileContains(L4_PATH, 'Tailwind') && 
    (fileContains(L4_PATH, 'CSS Modules') || fileContains(L4_PATH, 'CSS-in-JS')),
    'Сравнение стилизации не найдено в L4'
  );
});

test('105.2: Сравнение содержит Tailwind', () => {
  assert(
    fileContains(L4_PATH, 'Tailwind'),
    'Tailwind не найден в сравнении'
  );
});

test('105.3: Сравнение содержит CSS Modules или CSS-in-JS', () => {
  assert(
    fileContains(L4_PATH, 'CSS Modules') || fileContains(L4_PATH, 'CSS-in-JS'),
    'CSS Modules/CSS-in-JS не найдены в сравнении'
  );
});

test('105.4: Сравнение содержит критерии оценки', () => {
  assert(
    fileContains(L4_PATH, 'AI-friendly') || fileContains(L4_PATH, 'Скорость'),
    'Критерии оценки не найдены'
  );
});

test('105.5: Доработка 105 отмечена как выполненная в BACKLOG', () => {
  assert(
    fileContains(BACKLOG_PATH, '#### 105. [x]') ||
    fileContains(BACKLOG_PATH, '#### 105. ✅'),
    'Доработка 105 не отмечена как выполненная'
  );
});

// ============================================================================
// ОБЩИЕ ТЕСТЫ
// ============================================================================

test('Все файлы документации существуют', () => {
  assert(fileExists(L0_PATH), 'L0 не найден');
  assert(fileExists(L3_PATH), 'L3 не найден');
  assert(fileExists(L4_PATH), 'L4 не найден');
  assert(fileExists(BACKLOG_PATH), 'BACKLOG не найден');
});

test('Все доработки 98-105 отмечены в BACKLOG', () => {
  for (let i = 98; i <= 105; i++) {
    assert(
      fileContains(BACKLOG_PATH, `#### ${i}. [x]`) ||
      fileContains(BACKLOG_PATH, `#### ${i}. ✅`),
      `Доработка ${i} не отмечена как выполненная`
    );
  }
});

// ============================================================================
// ВЫВОД РЕЗУЛЬТАТОВ
// ============================================================================

console.log('\n' + '='.repeat(70));
console.log('📊 РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ');
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

// Выход с кодом ошибки если есть провалившиеся тесты
process.exit(failed > 0 ? 1 : 0);
