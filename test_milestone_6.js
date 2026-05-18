const fs = require('fs');
const path = require('path');

console.log("=== ЗАПУСК АВТОТЕСТОВ ДЛЯ MILESTONE 6 (Доработки 46-50) ===\n");

let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ТЕСТ ПРОЙДЕН: ${name}`);
    testsPassed++;
  } catch (error) {
    console.error(`❌ ТЕСТ ПРОВАЛЕН: ${name}`);
    console.error(`   Ошибка: ${error.message}`);
    testsFailed++;
  }
}

// Читаем файл L2_vibecoding_principles.md
const l2FilePath = path.join(__dirname, 'docs', 'L2_vibecoding_principles.md');
const l2Content = fs.readFileSync(l2FilePath, 'utf-8');

// Читаем файл IMPROVEMENTS_BACKLOG.md
const backlogPath = path.join(__dirname, 'research', 'IMPROVEMENTS_BACKLOG.md');
const backlogContent = fs.readFileSync(backlogPath, 'utf-8');

console.log("📄 Файлы загружены успешно\n");

// ============================================
// ТЕСТ 1: Доработка 46 - "AI обманывает - реальные примеры"
// ============================================
console.log("🔍 Тестирование доработки 46: AI обманывает - реальные примеры\n");

test("Раздел 11.1 'AI обманывает - реальные примеры' существует", () => {
  if (!l2Content.includes("### Раздел 11: Критические ошибки AI")) {
    throw new Error("Раздел 11 'Критические ошибки AI' не найден");
  }
  if (!l2Content.includes("#### 11.1. AI обманывает - реальные примеры")) {
    throw new Error("Подраздел 11.1 не найден");
  }
});

test("Пример 1: Костыль вместо правильного решения присутствует", () => {
  if (!l2Content.includes("**Пример 1: Костыль вместо правильного решения**")) {
    throw new Error("Пример 1 не найден");
  }
  if (!l2Content.includes("AI решение: создал функцию, которая исправляет данные на лету")) {
    throw new Error("Описание проблемы AI не найдено");
  }
  if (!l2Content.includes("Правильное решение: исправить данные в БД")) {
    throw new Error("Правильное решение не описано");
  }
});

test("Пример 2: Технический долг в новом коде присутствует", () => {
  if (!l2Content.includes("**Пример 2: Технический долг в новом коде**")) {
    throw new Error("Пример 2 не найден");
  }
  if (!l2Content.includes("Race conditions")) {
    throw new Error("Race conditions не упомянуты");
  }
  if (!l2Content.includes("Циклические зависимости")) {
    throw new Error("Циклические зависимости не упомянуты");
  }
  if (!l2Content.includes("Хардкод")) {
    throw new Error("Хардкод не упомянут");
  }
});

test("Пример 3: Катастрофа V2 - потеря коммитов присутствует", () => {
  if (!l2Content.includes("**Пример 3: Катастрофа V2 - потеря коммитов**")) {
    throw new Error("Пример 3 не найден");
  }
  if (!l2Content.includes("Cline отформатировал весь проект")) {
    throw new Error("Описание катастрофы не найдено");
  }
  if (!l2Content.includes("История изменений потеряна")) {
    throw new Error("Последствия не описаны");
  }
});

test("Доработка 46 отмечена как выполненная в IMPROVEMENTS_BACKLOG", () => {
  if (!backlogContent.includes("#### 46. ✅ Создать раздел \"AI обманывает - реальные примеры\"")) {
    throw new Error("Доработка 46 не отмечена как выполненная");
  }
  if (!backlogContent.includes("**Статус**: ✅ ВЫПОЛНЕНО")) {
    throw new Error("Статус выполнения не установлен");
  }
  if (!backlogContent.includes("**Реализация**: Добавлен раздел 11.1 в L2_vibecoding_principles.md")) {
    throw new Error("Информация о реализации отсутствует");
  }
});

// ============================================
// ТЕСТ 2: Доработка 47 - "AI делает опциональные поля везде"
// ============================================
console.log("\n🔍 Тестирование доработки 47: AI делает опциональные поля везде\n");

test("Раздел 11.2 'AI делает опциональные поля везде' существует", () => {
  if (!l2Content.includes("#### 11.2. AI делает опциональные поля везде")) {
    throw new Error("Подраздел 11.2 не найден");
  }
});

test("Проблема с nullable полями описана", () => {
  if (!l2Content.includes("⚠️ Проблема")) {
    throw new Error("Warning о проблеме не найден");
  }
  if (!l2Content.includes("делает поля `nullable` или `optional`")) {
    throw new Error("Описание проблемы отсутствует");
  }
});

test("Пример плохого кода с optional полями присутствует", () => {
  if (!l2Content.includes("**Пример плохого кода**:")) {
    throw new Error("Пример плохого кода не найден");
  }
  if (!l2Content.includes("id?: string;")) {
    throw new Error("Пример optional полей отсутствует");
  }
});

test("Правильный подход с обязательными полями описан", () => {
  if (!l2Content.includes("**Правильный подход**:")) {
    throw new Error("Правильный подход не описан");
  }
  if (!l2Content.includes("id: string;           // Обязательное")) {
    throw new Error("Пример правильной типизации отсутствует");
  }
});

test("Решение с промптом для AI присутствует", () => {
  if (!l2Content.includes("Проанализируй все поля в интерфейсе")) {
    throw new Error("Промпт для AI не найден");
  }
});

test("Доработка 47 отмечена как выполненная в IMPROVEMENTS_BACKLOG", () => {
  if (!backlogContent.includes("#### 47. ✅ Добавить \"AI делает опциональные поля везде\"")) {
    throw new Error("Доработка 47 не отмечена как выполненная");
  }
});

// ============================================
// ТЕСТ 3: Доработка 48 - "Решение: Агент валидации"
// ============================================
console.log("\n🔍 Тестирование доработки 48: Решение: Агент валидации\n");

test("Раздел 11.3 'Решение: Агент валидации' существует", () => {
  if (!l2Content.includes("#### 11.3. Решение: Агент валидации")) {
    throw new Error("Подраздел 11.3 не найден");
  }
});

test("Концепция агента валидации описана", () => {
  if (!l2Content.includes("**Концепция**: Создать специализированного агента")) {
    throw new Error("Концепция не описана");
  }
});

test("Все 4 категории проверок присутствуют", () => {
  const checks = [
    "1. **Костыли вместо правильных решений**",
    "2. **Технический долг**",
    "3. **Проблемы типизации**",
    "4. **Архитектурные проблемы**"
  ];
  
  checks.forEach(check => {
    if (!l2Content.includes(check)) {
      throw new Error(`Категория проверки не найдена: ${check}`);
    }
  });
});

test("Пример промпта для агента валидации присутствует", () => {
  if (!l2Content.includes("**Пример промпта для агента валидации**:")) {
    throw new Error("Пример промпта не найден");
  }
  if (!l2Content.includes("# Агент валидации кода")) {
    throw new Error("Заголовок промпта отсутствует");
  }
});

test("Указано когда использовать агента валидации", () => {
  if (!l2Content.includes("**Когда использовать**:")) {
    throw new Error("Рекомендации по использованию отсутствуют");
  }
  if (!l2Content.includes("После завершения крупной фичи")) {
    throw new Error("Сценарии использования не описаны");
  }
});

test("Доработка 48 отмечена как выполненная в IMPROVEMENTS_BACKLOG", () => {
  if (!backlogContent.includes("#### 48. ✅ Добавить \"Решение: Агент валидации\"")) {
    throw new Error("Доработка 48 не отмечена как выполненная");
  }
});

// ============================================
// ТЕСТ 4: Доработка 49 - "Декомпозиция - ключ к успеху"
// ============================================
console.log("\n🔍 Тестирование доработки 49: Декомпозиция - ключ к успеху\n");

test("Раздел 12 'Лайфхаки и Pro Tips' существует", () => {
  if (!l2Content.includes("### Раздел 12: Лайфхаки и Pro Tips")) {
    throw new Error("Раздел 12 не найден");
  }
});

test("Раздел 12.1 'Декомпозиция - ключ к успеху' существует", () => {
  if (!l2Content.includes("#### 12.1. Декомпозиция - ключ к успеху")) {
    throw new Error("Подраздел 12.1 не найден");
  }
});

test("Принцип декомпозиции описан", () => {
  if (!l2Content.includes("**Принцип**: Разбивай всё на маленькие части")) {
    throw new Error("Принцип не описан");
  }
});

test("Все 4 применения декомпозиции присутствуют", () => {
  const applications = [
    "**1. Файлы**",
    "**2. Результаты AI**",
    "**3. Документация**",
    "**4. UI компоненты**"
  ];
  
  applications.forEach(app => {
    if (!l2Content.includes(app)) {
      throw new Error(`Применение декомпозиции не найдено: ${app}`);
    }
  });
});

test("Правило 100-200 строк упомянуто", () => {
  if (!l2Content.includes("**Правило 100-200 строк**")) {
    throw new Error("Правило 100-200 строк не найдено");
  }
});

test("Преимущества декомпозиции перечислены", () => {
  if (!l2Content.includes("**Преимущества**:")) {
    throw new Error("Преимущества не перечислены");
  }
  if (!l2Content.includes("AI лучше понимает контекст")) {
    throw new Error("Преимущества для AI не описаны");
  }
});

test("Доработка 49 отмечена как выполненная в IMPROVEMENTS_BACKLOG", () => {
  if (!backlogContent.includes("#### 49. ✅ Добавить \"Декомпозиция - ключ к успеху\"")) {
    throw new Error("Доработка 49 не отмечена как выполненная");
  }
});

// ============================================
// ТЕСТ 5: Доработка 50 - "Книги для AI"
// ============================================
console.log("\n🔍 Тестирование доработки 50: Книги для AI\n");

test("Раздел 12.2 'Книги для AI' существует", () => {
  if (!l2Content.includes("#### 12.2. Книги для AI")) {
    throw new Error("Подраздел 12.2 не найден");
  }
});

test("Лайфхак описан", () => {
  if (!l2Content.includes("**Лайфхак**: Попроси AI изучить лучшие книги")) {
    throw new Error("Лайфхак не описан");
  }
});

test("Процесс работы с книгами описан", () => {
  if (!l2Content.includes("**Как это работает**:")) {
    throw new Error("Процесс не описан");
  }
  const steps = [
    "1. AI находит топовые книги",
    "2. AI читает и анализирует",
    "3. AI применяет best practices"
  ];
  
  steps.forEach(step => {
    if (!l2Content.includes(step)) {
      throw new Error(`Шаг процесса не найден: ${step}`);
    }
  });
});

test("Рекомендуемые книги перечислены", () => {
  if (!l2Content.includes("**Рекомендуемые книги**:")) {
    throw new Error("Список книг не найден");
  }
  
  const books = [
    "Programming TypeScript",
    "Effective TypeScript",
    "Clean Architecture"
  ];
  
  books.forEach(book => {
    if (!l2Content.includes(book)) {
      throw new Error(`Книга не найдена: ${book}`);
    }
  });
});

test("Пример использования с промптом присутствует", () => {
  if (!l2Content.includes("**Пример использования**:")) {
    throw new Error("Пример использования не найден");
  }
  if (!l2Content.includes("Изучи книгу \"Effective TypeScript\"")) {
    throw new Error("Пример промпта отсутствует");
  }
});

test("Результат применения описан", () => {
  if (!l2Content.includes("**Результат**: AI будет писать код")) {
    throw new Error("Результат не описан");
  }
});

test("Доработка 50 отмечена как выполненная в IMPROVEMENTS_BACKLOG", () => {
  if (!backlogContent.includes("#### 50. ✅ Добавить \"Книги для AI\"")) {
    throw new Error("Доработка 50 не отмечена как выполненная");
  }
});

// ============================================
// ДОПОЛНИТЕЛЬНЫЕ ТЕСТЫ
// ============================================
console.log("\n🔍 Дополнительные тесты структуры и качества\n");

test("Все разделы 11.1, 11.2, 11.3 находятся в правильном порядке", () => {
  const section111Index = l2Content.indexOf("#### 11.1. AI обманывает");
  const section112Index = l2Content.indexOf("#### 11.2. AI делает опциональные поля");
  const section113Index = l2Content.indexOf("#### 11.3. Решение: Агент валидации");
  
  if (section111Index === -1 || section112Index === -1 || section113Index === -1) {
    throw new Error("Не все подразделы раздела 11 найдены");
  }
  
  if (section111Index > section112Index || section112Index > section113Index) {
    throw new Error("Подразделы раздела 11 расположены в неправильном порядке");
  }
});

test("Все разделы 12.1, 12.2 находятся в правильном порядке", () => {
  const section121Index = l2Content.indexOf("#### 12.1. Декомпозиция");
  const section122Index = l2Content.indexOf("#### 12.2. Книги для AI");
  
  if (section121Index === -1 || section122Index === -1) {
    throw new Error("Не все подразделы раздела 12 найдены");
  }
  
  if (section121Index > section122Index) {
    throw new Error("Подразделы раздела 12 расположены в неправильном порядке");
  }
});

test("Разделы 11 и 12 находятся перед чек-листом освоения L2", () => {
  const section11Index = l2Content.indexOf("### Раздел 11: Критические ошибки AI");
  const section12Index = l2Content.indexOf("### Раздел 12: Лайфхаки и Pro Tips");
  const checklistIndex = l2Content.indexOf("## ✅ Чек-лист освоения L2");
  
  if (section11Index === -1 || section12Index === -1 || checklistIndex === -1) {
    throw new Error("Не все ключевые разделы найдены");
  }
  
  if (section11Index > checklistIndex || section12Index > checklistIndex) {
    throw new Error("Разделы 11 и 12 должны быть перед чек-листом");
  }
});

test("Файл L2 содержит корректное количество строк (увеличился)", () => {
  const lines = l2Content.split('\n').length;
  if (lines < 1000) {
    throw new Error(`Файл L2 слишком короткий: ${lines} строк (ожидалось >1000)`);
  }
  console.log(`   Файл L2 содержит ${lines} строк`);
});

test("Все доработки 46-50 имеют статус ВЫПОЛНЕНО в backlog", () => {
  const completedCount = (backlogContent.match(/#### (46|47|48|49|50)\. ✅/g) || []).length;
  if (completedCount !== 5) {
    throw new Error(`Только ${completedCount} из 5 доработок отмечены как выполненные`);
  }
});

// ============================================
// ИТОГОВЫЙ ОТЧЁТ
// ============================================
console.log("\n" + "=".repeat(60));
console.log("📊 ИТОГОВЫЙ ОТЧЁТ ТЕСТИРОВАНИЯ MILESTONE 6");
console.log("=".repeat(60));
console.log(`✅ Тестов пройдено: ${testsPassed}`);
console.log(`❌ Тестов провалено: ${testsFailed}`);
console.log(`📈 Процент успеха: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);
console.log("=".repeat(60));

if (testsFailed === 0) {
  console.log("\n🎉 ВСЕ ТЕСТЫ УСПЕШНО ПРОЙДЕНЫ!");
  console.log("✅ Milestone 6 (Доработки 46-50) полностью реализован и протестирован!");
  process.exit(0);
} else {
  console.log("\n⚠️  ОБНАРУЖЕНЫ ОШИБКИ В РЕАЛИЗАЦИИ!");
  console.log("❌ Необходимо исправить провалившиеся тесты.");
  process.exit(1);
}
