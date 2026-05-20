const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log("=== ЗАПУСК УПРОЩЕННЫХ ИНТЕГРАЦИОННЫХ ТЕСТОВ (PLAYWRIGHT) ===");
  
  // Launch isolated headless Chromium instance
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  // Redirect browser console logs and errors to terminal
  page.on('console', msg => console.log(`[BROWSER LOG] ${msg.text()}`));
  page.on('pageerror', err => console.error(`[BROWSER ERROR] ${err.toString()}`));

  // Support both local server and direct file access paths
  const fileUrl = 'file://' + path.resolve(__dirname, 'index.html');
  const serverUrl = 'http://localhost:8085';
  
  try {
    console.log(`Попытка подключения к локальному серверу: ${serverUrl}`);
    await page.goto(serverUrl, { timeout: 3000 });
  } catch (err) {
    console.log(`Сервер на порту 8085 не отвечает. Загружаем напрямую через файловую систему: ${fileUrl}`);
    await page.goto(fileUrl);
  }

  // 1. Verify Page Load
  const title = await page.title();
  console.log(`✅ Заголовок страницы успешно загружен: "${title}"`);

  // 2. Test Bento Grid rendering
  const bentoCardsCount = await page.locator('.bento-card').count();
  console.log(`✅ Найдено карточек в Bento сетке: ${bentoCardsCount}`);
  if (bentoCardsCount === 0) {
    throw new Error("Ошибка: На главной странице не отрендерились Bento карточки!");
  }

  // 3. Switch to Canvas Mind Map View
  console.log("Клик по вкладке 'Карта Связей' для переключения вида...");
  await page.click('#toggle-canvas');
  
  // Wait for canvas nodes to be visible
  await page.waitForSelector('.canvas-node');
  
  // 4. Verify Staggered Nodes Alignment
  const canvasNodes = await page.locator('.canvas-node');
  const nodeCount = await canvasNodes.count();
  console.log(`✅ Найдено узлов на интерактивной карте: ${nodeCount}`);
  
  const positions = [];
  for (let i = 0; i < Math.min(nodeCount, 6); i++) {
    const node = canvasNodes.nth(i);
    const box = await node.boundingBox();
    const id = await node.getAttribute('data-id');
    positions.push({ id, x: box.x, y: box.y, w: box.width, h: box.height });
  }

  // Check that nodes don't exactly overlap
  let overlapDetected = false;
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const a = positions[i];
      const b = positions[j];
      if (Math.abs(a.x - b.x) < 5 && Math.abs(a.y - b.y) < 5) {
        console.error(`❌ ОБНАРУЖЕНО НАЛОЖЕНИЕ: Карточка ${a.id} и ${b.id} слиплись на координатах (${a.x}, ${a.y})`);
        overlapDetected = true;
      }
    }
  }
  if (!overlapDetected) {
    console.log("✅ УСПЕШНО: Алгоритм Staggered-распределения работает! Узлы разделены и не слипаются.");
  } else {
    throw new Error("Ошибка: Обнаружены перекрытия узлов на холсте!");
  }

  // 5. Open Node Side Drawer details
  const firstNode = canvasNodes.first();
  const firstNodeTitle = await firstNode.locator('h4').textContent();
  console.log(`Клик на первый узел карты: "${firstNodeTitle}"`);
  
  await page.evaluate(() => {
    const node = document.querySelector('.canvas-node');
    if (node) node.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  });

  // Verify Side Drawer is open
  await page.waitForSelector('#side-drawer.active', { timeout: 2000 });
  console.log("✅ УСПЕШНО: Сайдбар плавно выдвинулся на экран.");

  // 6. Close Side Drawer
  console.log("Закрытие сайдбара...");
  await page.click('#close-drawer');
  await page.waitForTimeout(300);
  
  const isDrawerClosed = await page.locator('#side-drawer').evaluate(el => !el.classList.contains('active'));
  console.log(`Статус сайдбара: ${isDrawerClosed ? 'успешно закрыт' : 'остался открытым'}`);
  if (!isDrawerClosed) {
    throw new Error("Ошибка: Сайдбар не закрылся при клике на кнопку закрытия!");
  }

  // 7. Switch back to Bento view
  console.log("Возвращение к Bento сетке...");
  await page.click('#toggle-bento');
  await page.waitForSelector('.bento-card');
  console.log("✅ УСПЕШНО: Переключение видов Bento <-> Canvas работает безупречно.");

  // 8. Test UI Sandbox (showcase.html) Integration
  console.log("\n=== ТЕСТИРОВАНИЕ UI SANDBOX (SHOWCASE.HTML) ===");
  
  // Click sandbox navigation link
  console.log("Переход по ссылке 'UI Sandbox'...");
  await page.click('#btn-goto-showcase');
  await page.waitForSelector('#btn-back-to-home');
  
  const sandboxTitle = await page.title();
  console.log(`✅ УСПЕШНО: Загружена страница песочницы: "${sandboxTitle}"`);
  if (!sandboxTitle.includes("Песочница")) {
    throw new Error("Ошибка: Страница песочницы загрузилась некорректно!");
  }

  // 8.1. Test Bento Grid rendering in Sandbox
  const sandboxBentoCount = await page.locator('.bento-card').count();
  console.log(`✅ Найдено Bento карточек в песочнице: ${sandboxBentoCount}`);
  if (sandboxBentoCount < 4) {
    throw new Error("Ошибка: В песочнице не отрендерились тестовые Bento карточки!");
  }

  // 8.2. Test Button Sizing / Radius Modifier
  console.log("Тестирование переключателя скруглений кнопок...");
  await page.click('#rad-12');
  await page.waitForTimeout(300);
  const btnBorderRadius = await page.locator('#sb-btn-primary').evaluate(el => window.getComputedStyle(el).borderRadius);
  console.log(`✅ Бордер-радиус кнопок после модификации: ${btnBorderRadius}`);
  const parsedRadius = parseFloat(btnBorderRadius);
  if (isNaN(parsedRadius) || Math.abs(parsedRadius - 12) > 0.2) {
    throw new Error(`Ошибка: Радиус скругления кнопки не применился! Ожидалось ~12px, получено ${btnBorderRadius}`);
  }

  // 8.3. Test Input States Simulator
  console.log("Тестирование Input States Simulator...");
  
  // Switch to Error state
  await page.click('#state-btn-error');
  const isInputError = await page.locator('#sandbox-sim-input').evaluate(el => el.classList.contains('error'));
  const isErrorMsgVisible = await page.locator('#sandbox-error-msg').isVisible();
  console.log(`✅ Статус ошибки поля: класс error = ${isInputError}, подсказка видна = ${isErrorMsgVisible}`);
  if (!isInputError || !isErrorMsgVisible) {
    throw new Error("Ошибка: Input States Simulator не переключился корректно в состояние Error!");
  }

  // Switch to Loading state
  await page.click('#state-btn-loading');
  const isSpinnerVisible = await page.locator('#sandbox-input-spinner').isVisible();
  console.log(`✅ Статус загрузки поля: спиннер виден = ${isSpinnerVisible}`);
  if (!isSpinnerVisible) {
    throw new Error("Ошибка: Input States Simulator не переключился в состояние Loading!");
  }

  // 8.4. Test Focus Trap
  console.log("Тестирование A11y Focus Trap модального окна...");
  await page.click('#btn-open-modal');
  
  await page.waitForTimeout(200);
  
  const isModalActive = await page.locator('#sandbox-modal').evaluate(el => el.classList.contains('active'));
  const activeElementId = await page.evaluate(() => document.activeElement.id);
  console.log(`✅ Модальное окно открыто: ${isModalActive}, фокус на поле: #${activeElementId}`);
  if (!isModalActive || activeElementId !== 'modal-field-1') {
    throw new Error("Ошибка: Модальное окно с Focus Trap не открылось или фокус не установился на первое поле!");
  }

  // Close focus trap modal with Escape
  console.log("Закрытие модального окна по клавише Escape...");
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  const isModalClosed = await page.locator('#sandbox-modal').evaluate(el => !el.classList.contains('active'));
  console.log(`✅ Модальное окно успешно закрыто по Escape: ${isModalClosed}`);
  if (!isModalClosed) {
    throw new Error("Ошибка: Focus Trap не обработал нажатие Escape для закрытия окна!");
  }

  // 8.5. Test Error Recovery Simulator
  console.log("Тестирование Error Recovery (Graceful Degradation)...");
  await page.click('#btn-crash-boundary');
  
  const isFallbackVisible = await page.locator('#sb-boundary-fallback-state').isVisible();
  const isMainComponentHidden = await page.locator('#sb-boundary-active-state').evaluate(el => el.style.display === 'none');
  console.log(`✅ Сбой симулирован: fallback виден = ${isFallbackVisible}, основной компонент скрыт = ${isMainComponentHidden}`);
  if (!isFallbackVisible || !isMainComponentHidden) {
    throw new Error("Ошибка: Компонент не переключился в fallback состояние после сбоя!");
  }

  // Click retry recovery
  console.log("Запуск процесса восстановления (Retry)...");
  await page.click('#btn-recover-boundary');
  
  // Wait for recovery timeout (1.2s in JS)
  await page.waitForTimeout(1500);
  const isMainComponentRestored = await page.locator('#sb-boundary-active-state').isVisible();
  console.log(`✅ Компонент успешно восстановился: ${isMainComponentRestored}`);
  if (!isMainComponentRestored) {
    throw new Error("Ошибка: Семантическое восстановление (Retry) не восстановило исходное состояние компонента!");
  }

  // Return to home page
  console.log("Возвращение на главную страницу карты развития...");
  await page.click('#btn-back-to-home');
  await page.waitForSelector('.bento-card');
  console.log("✅ УСПЕШНО: Навигация назад работает безупречно.");

  console.log("\n⭐️ ВСЕ ИНТЕГРАЦИОННЫЕ И UI SANDBOX ТЕСТЫ УСПЕШНО ПРОЙДЕНЫ! 100% ФУНКЦИОНАЛ РАБОТАЕТ БЕЗУПРЕЧНО!");
  
  await browser.close();
  process.exit(0);
})().catch(err => {
  console.error("\n❌ ОШИБКА ПРИ ВЫПОЛНЕНИИ ТЕСТОВ:");
  console.error(err.message);
  process.exit(1);
});
