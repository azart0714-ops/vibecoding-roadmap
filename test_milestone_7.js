const fs = require('fs');
const path = require('path');

console.log("=== ЗАПУСК АВТОТЕСТОВ ДЛЯ MILESTONE 7 (Доработки 51-55) ===\n");

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
// ТЕСТ 1: Доработка 51 - Security Hook
// ============================================
console.log("🔍 Тестирование доработки 51: Security Hook\n");

test("Раздел 12.3 'Security Hook' существует", () => {
  if (!l2Content.includes("#### 12.3. Security Hook")) {
    throw new Error("Подраздел 12.3 не найден");
  }
});

test("Описание Security Hook присутствует", () => {
  if (!l2Content.includes("**Инструмент**: Автоматическая проверка кода на безопасность")) {
    throw new Error("Описание инструмента не найдено");
  }
});

test("Все 4 категории проверок Security Hook присутствуют", () => {
  const checks = [
    "1. **Секреты в коде**",
    "2. **SQL инъекции**",
    "3. **XSS уязвимости**",
    "4. **Небезопасные зависимости**"
  ];
  
  checks.forEach(check => {
    if (!l2Content.includes(check)) {
      throw new Error(`Категория проверки не найдена: ${check}`);
    }
  });
});

test("Пример промпта для создания Security Hook присутствует", () => {
  if (!l2Content.includes("**Пример промпта для создания Security Hook**:")) {
    throw new Error("Пример промпта не найден");
  }
  if (!l2Content.includes("Создай pre-commit hook для проверки безопасности кода")) {
    throw new Error("Текст промпта отсутствует");
  }
});

test("Инструкция по установке Security Hook присутствует", () => {
  if (!l2Content.includes("**Установка**:")) {
    throw new Error("Инструкция по установке не найдена");
  }
  if (!l2Content.includes(".git/hooks/pre-commit")) {
    throw new Error("Путь к hook не указан");
  }
});

test("Доработка 51 отмечена как выполненная в IMPROVEMENTS_BACKLOG", () => {
  if (!backlogContent.includes("#### 51. ✅ Добавить \"Security Hook\"")) {
    throw new Error("Доработка 51 не отмечена как выполненная");
  }
});

// ============================================
// ТЕСТ 2: Доработка 52 - Умная система тестирования
// ============================================
console.log("\n🔍 Тестирование доработки 52: Умная система тестирования\n");

test("Раздел 12.4 'Умная система тестирования' существует", () => {
  if (!l2Content.includes("#### 12.4. Умная система тестирования")) {
    throw new Error("Подраздел 12.4 не найден");
  }
});

test("Описание проблемы присутствует", () => {
  if (!l2Content.includes("**Проблема**: Запуск всех тестов занимает много времени")) {
    throw new Error("Описание проблемы не найдено");
  }
});

test("Решение с AI анализом описано", () => {
  if (!l2Content.includes("**Решение**: AI анализирует git diff")) {
    throw new Error("Решение не описано");
  }
});

test("Процесс работы умной системы описан (3 шага)", () => {
  const steps = [
    "1. **AI анализирует изменения**",
    "2. **AI определяет затронутые модули**",
    "3. **AI запускает только нужные тесты**"
  ];
  
  steps.forEach(step => {
    if (!l2Content.includes(step)) {
      throw new Error(`Шаг процесса не найден: ${step}`);
    }
  });
});

test("Пример промпта для умной системы присутствует", () => {
  if (!l2Content.includes("**Пример промпта**:")) {
    throw new Error("Пример промпта не найден");
  }
  if (!l2Content.includes("Проанализируй git diff между main и текущей веткой")) {
    throw new Error("Текст промпта отсутствует");
  }
});

test("Метрики экономии времени указаны", () => {
  if (!l2Content.includes("**Экономия времени**:")) {
    throw new Error("Метрики экономии не найдены");
  }
  if (!l2Content.includes("**Экономия: 85-90%**")) {
    throw new Error("Процент экономии не указан");
  }
});

test("Предупреждение о запуске всех тестов перед мержем присутствует", () => {
  if (!l2Content.includes("⚠️ Важно**: Перед мержем в main всё равно запускай все тесты!")) {
    throw new Error("Предупреждение не найдено");
  }
});

test("Доработка 52 отмечена как выполненная в IMPROVEMENTS_BACKLOG", () => {
  if (!backlogContent.includes("#### 52. ✅ Добавить \"Умная система тестирования\"")) {
    throw new Error("Доработка 52 не отмечена как выполненная");
  }
});

// ============================================
// ТЕСТ 3: Доработка 53 - Ночные тесты
// ============================================
console.log("\n🔍 Тестирование доработки 53: Ночные тесты\n");

test("Раздел 12.5 'Ночные тесты' существует", () => {
  if (!l2Content.includes("#### 12.5. Ночные тесты")) {
    throw new Error("Подраздел 12.5 не найден");
  }
});

test("Описание зачем нужны ночные тесты присутствует", () => {
  if (!l2Content.includes("**Зачем**:")) {
    throw new Error("Описание зачем не найдено");
  }
  const reasons = [
    "Полная проверка всего кода",
    "Обнаружение race conditions",
    "Проверка интеграций",
    "Не тратить время днём"
  ];
  
  reasons.forEach(reason => {
    if (!l2Content.includes(reason)) {
      throw new Error(`Причина не найдена: ${reason}`);
    }
  });
});

test("Вариант 1: Свой сервер описан", () => {
  if (!l2Content.includes("**Вариант 1: Свой сервер (рекомендуется)**")) {
    throw new Error("Вариант 1 не найден");
  }
  if (!l2Content.includes("crontab -e")) {
    throw new Error("Команда crontab не найдена");
  }
});

test("Вариант 2: GitHub Actions описан", () => {
  if (!l2Content.includes("**Вариант 2: GitHub Actions**")) {
    throw new Error("Вариант 2 не найден");
  }
  if (!l2Content.includes(".github/workflows/nightly-tests.yml")) {
    throw new Error("Путь к workflow не указан");
  }
});

test("Критическое предупреждение о стоимости GitHub Actions присутствует", () => {
  if (!l2Content.includes("⚠️ ВАЖНО: GitHub Actions дорого!")) {
    throw new Error("Предупреждение о стоимости не найдено");
  }
  if (!l2Content.includes("**Бесплатно**: 2000 минут/месяц")) {
    throw new Error("Информация о лимитах не найдена");
  }
});

test("Рекомендация использовать свой сервер присутствует", () => {
  if (!l2Content.includes("**Рекомендация**: Используй свой сервер или дешёвый VPS ($5/мес)")) {
    throw new Error("Рекомендация не найдена");
  }
});

test("Описание что делать с результатами присутствует", () => {
  if (!l2Content.includes("**Что делать с результатами**:")) {
    throw new Error("Раздел с результатами не найден");
  }
});

test("Доработка 53 отмечена как выполненная в IMPROVEMENTS_BACKLOG", () => {
  if (!backlogContent.includes("#### 53. ✅ Добавить \"Ночные тесты\"")) {
    throw new Error("Доработка 53 не отмечена как выполненная");
  }
});

// ============================================
// ТЕСТ 4: Доработка 54 - Реальная экономия с инструментами
// ============================================
console.log("\n🔍 Тестирование доработки 54: Реальная экономия с инструментами\n");

test("Раздел 12.6 'Реальная экономия с инструментами' существует", () => {
  if (!l2Content.includes("#### 12.6. Реальная экономия с инструментами")) {
    throw new Error("Подраздел 12.6 не найден");
  }
});

test("Статистика по Cline vs ChatGPT присутствует", () => {
  if (!l2Content.includes("**1. Cline vs ChatGPT**")) {
    throw new Error("Статистика Cline не найдена");
  }
  if (!l2Content.includes("**Экономия токенов**: 10x")) {
    throw new Error("Экономия токенов не указана");
  }
  if (!l2Content.includes("**Экономия времени**: 5x")) {
    throw new Error("Экономия времени не указана");
  }
});

test("Статистика по Design System присутствует", () => {
  if (!l2Content.includes("**2. Design System**")) {
    throw new Error("Статистика Design System не найдена");
  }
  if (!l2Content.includes("**Экономия**: 20-30x")) {
    throw new Error("Экономия не указана");
  }
});

test("Статистика по автоматическим тестам присутствует", () => {
  if (!l2Content.includes("**3. Автоматические тесты**")) {
    throw new Error("Статистика тестов не найдена");
  }
  if (!l2Content.includes("**Экономия**: 180x")) {
    throw new Error("Экономия не указана");
  }
});

test("Статистика по готовым блокам кода присутствует", () => {
  if (!l2Content.includes("**4. Готовые блоки кода**")) {
    throw new Error("Статистика готовых блоков не найдена");
  }
  if (!l2Content.includes("**Статистика**: 80% кода уже готов")) {
    throw new Error("Статистика 80% не найдена");
  }
});

test("Статистика по AI Code Review присутствует", () => {
  if (!l2Content.includes("**5. AI Code Review**")) {
    throw new Error("Статистика AI Code Review не найдена");
  }
  if (!l2Content.includes("**Экономия**: 100x+ по времени")) {
    throw new Error("Экономия не указана");
  }
});

test("Итоговая экономия указана", () => {
  if (!l2Content.includes("**Итоговая экономия**:")) {
    throw new Error("Итоговая экономия не найдена");
  }
  if (!l2Content.includes("**Время разработки**: 5-10x быстрее")) {
    throw new Error("Экономия времени не указана");
  }
});

test("Реальный пример проекта присутствует", () => {
  if (!l2Content.includes("**Реальный пример**:")) {
    throw new Error("Реальный пример не найден");
  }
  if (!l2Content.includes("**Экономия**: 10x по времени и деньгам")) {
    throw new Error("Итоговая экономия примера не указана");
  }
});

test("Доработка 54 отмечена как выполненная в IMPROVEMENTS_BACKLOG", () => {
  if (!backlogContent.includes("#### 54. ✅ Добавить \"Реальная экономия с инструментами\"")) {
    throw new Error("Доработка 54 не отмечена как выполненная");
  }
});

// ============================================
// ТЕСТ 5: Доработка 55 - Стоимость инструментов
// ============================================
console.log("\n🔍 Тестирование доработки 55: Стоимость инструментов\n");

test("Раздел 12.7 'Стоимость инструментов' существует", () => {
  if (!l2Content.includes("#### 12.7. Стоимость инструментов")) {
    throw new Error("Подраздел 12.7 не найден");
  }
});

test("Основные подписки описаны", () => {
  if (!l2Content.includes("**Основные подписки**:")) {
    throw new Error("Раздел основных подписок не найден");
  }
  
  const subscriptions = [
    "1. **Claude Pro**",
    "2. **Cursor Pro**",
    "3. **GitHub Copilot**"
  ];
  
  subscriptions.forEach(sub => {
    if (!l2Content.includes(sub)) {
      throw new Error(`Подписка не найдена: ${sub}`);
    }
  });
});

test("Хостинг и инфраструктура описаны", () => {
  if (!l2Content.includes("**Хостинг и инфраструктура**:")) {
    throw new Error("Раздел хостинга не найден");
  }
  
  const hosting = [
    "1. **Vercel**",
    "2. **Railway**",
    "3. **Supabase**"
  ];
  
  hosting.forEach(host => {
    if (!l2Content.includes(host)) {
      throw new Error(`Хостинг не найден: ${host}`);
    }
  });
});

test("Дополнительные инструменты описаны", () => {
  if (!l2Content.includes("**Дополнительные инструменты**:")) {
    throw new Error("Раздел дополнительных инструментов не найден");
  }
  
  const tools = [
    "1. **Gemini**",
    "2. **Midjourney**",
    "3. **Figma**"
  ];
  
  tools.forEach(tool => {
    if (!l2Content.includes(tool)) {
      throw new Error(`Инструмент не найден: ${tool}`);
    }
  });
});

test("Итоговая стоимость - минимальный набор присутствует", () => {
  if (!l2Content.includes("**Минимальный набор** (для старта):")) {
    throw new Error("Минимальный набор не найден");
  }
  if (!l2Content.includes("**Итого: $25/месяц**")) {
    throw new Error("Итоговая стоимость минимального набора не указана");
  }
});

test("Итоговая стоимость - оптимальный набор присутствует", () => {
  if (!l2Content.includes("**Оптимальный набор** (для продакшена):")) {
    throw new Error("Оптимальный набор не найден");
  }
  if (!l2Content.includes("**Итого: $80/месяц**")) {
    throw new Error("Итоговая стоимость оптимального набора не указана");
  }
});

test("Итоговая стоимость - премиум набор присутствует", () => {
  if (!l2Content.includes("**Премиум набор** (для профи):")) {
    throw new Error("Премиум набор не найден");
  }
  if (!l2Content.includes("**Итого: $132/месяц**")) {
    throw new Error("Итоговая стоимость премиум набора не указана");
  }
});

test("Инсайт об окупаемости присутствует", () => {
  if (!l2Content.includes("💡 Инсайт**: Даже премиум набор ($132/мес) окупается за 1-2 дня работы")) {
    throw new Error("Инсайт об окупаемости не найден");
  }
});

test("Сравнение с традиционной разработкой присутствует", () => {
  if (!l2Content.includes("**Сравнение с традиционной разработкой**:")) {
    throw new Error("Сравнение не найдено");
  }
  if (!l2Content.includes("**Экономия**: 50-400x")) {
    throw new Error("Экономия не указана");
  }
});

test("Доработка 55 отмечена как выполненная в IMPROVEMENTS_BACKLOG", () => {
  if (!backlogContent.includes("#### 55. ✅ Добавить \"Стоимость инструментов\"")) {
    throw new Error("Доработка 55 не отмечена как выполненная");
  }
});

// ============================================
// ДОПОЛНИТЕЛЬНЫЕ ТЕСТЫ
// ============================================
console.log("\n🔍 Дополнительные тесты структуры и качества\n");

test("Все разделы 12.3-12.7 находятся в правильном порядке", () => {
  const section123Index = l2Content.indexOf("#### 12.3. Security Hook");
  const section124Index = l2Content.indexOf("#### 12.4. Умная система тестирования");
  const section125Index = l2Content.indexOf("#### 12.5. Ночные тесты");
  const section126Index = l2Content.indexOf("#### 12.6. Реальная экономия с инструментами");
  const section127Index = l2Content.indexOf("#### 12.7. Стоимость инструментов");
  
  if (section123Index === -1 || section124Index === -1 || section125Index === -1 || 
      section126Index === -1 || section127Index === -1) {
    throw new Error("Не все подразделы раздела 12 найдены");
  }
  
  if (section123Index > section124Index || section124Index > section125Index ||
      section125Index > section126Index || section126Index > section127Index) {
    throw new Error("Подразделы раздела 12 расположены в неправильном порядке");
  }
});

test("Разделы 12.3-12.7 находятся перед чек-листом освоения L2", () => {
  const section127Index = l2Content.indexOf("#### 12.7. Стоимость инструментов");
  const checklistIndex = l2Content.indexOf("## ✅ Чек-лист освоения L2");
  
  if (section127Index === -1 || checklistIndex === -1) {
    throw new Error("Не все ключевые разделы найдены");
  }
  
  if (section127Index > checklistIndex) {
    throw new Error("Разделы 12.3-12.7 должны быть перед чек-листом");
  }
});

test("Файл L2 значительно увеличился в размере", () => {
  const lines = l2Content.split('\n').length;
  if (lines < 1500) {
    throw new Error(`Файл L2 недостаточно большой: ${lines} строк (ожидалось >1500)`);
  }
  console.log(`   Файл L2 содержит ${lines} строк`);
});

test("Все доработки 51-55 имеют статус ВЫПОЛНЕНО в backlog", () => {
  const completedCount = (backlogContent.match(/#### (51|52|53|54|55)\. ✅/g) || []).length;
  if (completedCount !== 5) {
    throw new Error(`Только ${completedCount} из 5 доработок отмечены как выполненные`);
  }
});

test("Все доработки 51-55 имеют информацию о реализации в backlog", () => {
  for (let i = 51; i <= 55; i++) {
    const hasImplementation = backlogContent.includes(`#### ${i}. ✅`) && 
                              backlogContent.includes(`**Реализация**: Добавлен раздел 12.${i-48}`);
    if (!hasImplementation) {
      throw new Error(`Доработка ${i} не имеет информации о реализации`);
    }
  }
});

// ============================================
// ИТОГОВЫЙ ОТЧЁТ
// ============================================
console.log("\n" + "=".repeat(60));
console.log("📊 ИТОГОВЫЙ ОТЧЁТ ТЕСТИРОВАНИЯ MILESTONE 7");
console.log("=".repeat(60));
console.log(`✅ Тестов пройдено: ${testsPassed}`);
console.log(`❌ Тестов провалено: ${testsFailed}`);
console.log(`📈 Процент успеха: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);
console.log("=".repeat(60));

if (testsFailed === 0) {
  console.log("\n🎉 ВСЕ ТЕСТЫ УСПЕШНО ПРОЙДЕНЫ!");
  console.log("✅ Milestone 7 (Доработки 51-55) полностью реализован и протестирован!");
  process.exit(0);
} else {
  console.log("\n⚠️  ОБНАРУЖЕНЫ ОШИБКИ В РЕАЛИЗАЦИИ!");
  console.log("❌ Необходимо исправить провалившиеся тесты.");
  process.exit(1);
}
