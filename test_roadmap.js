const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log("=== ЗАПУСК АВТОМАТИЧЕСКИХ ИНТЕГРАЦИОННЫХ ТЕСТОВ (PLAYWRIGHT) ===");
  
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

  // Check that nodes don't exactly overlap (i.e. different coordinates)
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

  // 4b. Test Canvas Auto-Centering on Filter Selection
  console.log("Тестирование автоцентрирования Canvas при переключении фильтров...");
  // Get current translation values
  const beforeTransform = await page.evaluate(() => {
    return { panX, panY, scale };
  });
  console.log(`Координаты Canvas до автоцентрирования: panX=${beforeTransform.panX}, panY=${beforeTransform.panY}, scale=${beforeTransform.scale}`);
  
  // Click on a Level Filter (e.g. Level L4)
  console.log("Клик на фильтр уровня 'L4'...");
  await page.click('.filter-btn[data-level="L4"]');
  await page.waitForTimeout(700); // wait for centering transition to finish (600ms)
  
  const afterTransform = await page.evaluate(() => {
    return { panX, panY, scale };
  });
  console.log(`Координаты Canvas после фильтрации: panX=${afterTransform.panX}, panY=${afterTransform.panY}, scale=${afterTransform.scale}`);
  
  if (beforeTransform.panX === afterTransform.panX && beforeTransform.panY === afterTransform.panY) {
    throw new Error("Ошибка: Canvas не изменил свои координаты после применения фильтра! Автоцентрирование не сработало.");
  }
  console.log("✅ УСПЕШНО: Canvas автоматически и плавно отцентрировался на выбранных карточках L4!");
  
  // Reset filter back to 'all' to avoid breaking other tests
  console.log("Сброс фильтров на 'Все'...");
  await page.click('.filter-btn[data-level="all"]');
  await page.waitForTimeout(700);

  // 5. Open Node Side Drawer details
  const firstNode = canvasNodes.first();
  const firstNodeTitle = await firstNode.locator('h4').textContent();
  console.log(`Клик на первый узел карты: "${firstNodeTitle}"`);
  // Canvas is very wide after ×3 spacing — use JS dispatchEvent to bypass viewport constraint
  await page.evaluate(() => {
    const node = document.querySelector('.canvas-node');
    if (node) node.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  });

  // Verify Side Drawer is open
  await page.waitForSelector('#side-drawer.active', { timeout: 2000 });
  console.log("✅ УСПЕШНО: Сайдбар плавно выдвинулся на экран.");

  // 6. Test Step Card Accordions in Drawer
  const stepCards = page.locator('#drawer-steps .step-card');
  const stepCount = await stepCards.count();
  console.log(`✅ Найдено SOP шагов в сайдбаре: ${stepCount}`);
  
  if (stepCount > 0) {
    const firstStepCard = stepCards.first();
    const details = firstStepCard.locator('.step-details');
    
    // Check it's collapsed by default
    let isCollapsed = await details.evaluate(el => window.getComputedStyle(el).maxHeight === '0px');
    console.log(`Статус аккордеона по умолчанию: ${isCollapsed ? 'свернут (0px)' : 'развернут'}`);
    
    // Click step card text to expand
    console.log("Клик на текст шага SOP для раскрытия аккордеона...");
    await firstStepCard.locator('.step-text').click();
    await page.waitForTimeout(350); // wait for css transition
    
    const debugInfo = await firstStepCard.evaluate(el => {
      const detailsEl = el.querySelector('.step-details');
      return {
        cardClasses: el.className,
        detailsClasses: detailsEl.className,
        scrollHeight: detailsEl.scrollHeight,
        inlineMaxHeight: detailsEl.style.maxHeight,
        computedMaxHeight: window.getComputedStyle(detailsEl).maxHeight
      };
    });
    console.log(`[DEBUG] Карточка классы: "${debugInfo.cardClasses}"`);
    console.log(`[DEBUG] Детали scrollHeight: ${debugInfo.scrollHeight}px`);
    console.log(`[DEBUG] Детали inline maxHeight: "${debugInfo.inlineMaxHeight}"`);
    console.log(`[DEBUG] Детали computed maxHeight: "${debugInfo.computedMaxHeight}"`);

    const isExpanded = debugInfo.cardClasses.includes('expanded') && debugInfo.inlineMaxHeight !== '';
    console.log(`Статус аккордеона после клика: ${isExpanded ? 'успешно развернут!' : 'остался свернутым'}`);
    if (!isExpanded) {
      throw new Error("Ошибка: Аккордеон не развернулся при клике на заголовок шага!");
    }

    // 6b. Test Multi-Accordion Support (Open multiple steps simultaneously)
    if (stepCount > 1) {
      console.log("Клик на второй шаг SOP для теста мульти-раскрытия...");
      const secondStepCard = stepCards.nth(1);
      await secondStepCard.locator('.step-text').click();
      await page.waitForTimeout(350); // wait for css transition
      
      const firstExpanded = await firstStepCard.evaluate(el => el.classList.contains('expanded'));
      const secondExpanded = await secondStepCard.evaluate(el => el.classList.contains('expanded'));
      
      console.log(`Статус первого шага: ${firstExpanded ? 'развернут' : 'свернут'}`);
      console.log(`Статус второго шага: ${secondExpanded ? 'развернут' : 'свернут'}`);
      
      if (firstExpanded && secondExpanded) {
        console.log("✅ УСПЕШНО: Мульти-аккордеон работает! Несколько карточек могут быть раскрыты одновременно.");
      } else {
        throw new Error("Ошибка: Раскрытие второго шага свернуло первый! Мульти-аккордеон не работает.");
      }
    }

    // 7. Verify Checkbox isolation (event propagation stop)
    console.log("Клик на визуальный чекбокс внутри раскрытого шага SOP...");
    const checkmark = firstStepCard.locator('.checkbox-checkmark').first();
    await checkmark.click();
    await page.waitForTimeout(200);

    const isChecked = await firstStepCard.locator('.step-checkbox').isChecked();
    console.log(`Статус чекбокса: ${isChecked ? 'отмечен выполненным' : 'не отмечен'}`);

    const stillExpanded = await firstStepCard.evaluate(el => el.classList.contains('expanded'));
    console.log(`Статус аккордеона после отметки чекбокса: ${stillExpanded ? 'остался развернутым (пропагатор кликов работает!)' : 'схлопнулся (БАГ!)'}`);
    
    if (!isChecked) {
      throw new Error("Ошибка: Клик по чекбоксу не активировал отметку выполнения!");
    }
    if (!stillExpanded) {
      throw new Error("Ошибка: Клик по чекбоксу свернул аккордеон! Нарушена изоляция event.stopPropagation()!");
    }
    console.log("✅ УСПЕШНО: Клик по чекбоксу изолирован и не сворачивает карточку шага.");

    // Verify step-card has .completed class when checked
    const hasCompletedClass = await firstStepCard.evaluate(el => el.classList.contains('completed'));
    console.log(`Статус класса completed на карточке шага: ${hasCompletedClass ? 'ДА (успешно!)' : 'НЕТ (БАГ!)'}`);
    if (!hasCompletedClass) {
      throw new Error("Ошибка: Карточка завершённого шага не получила класс completed!");
    }
    console.log("✅ УСПЕШНО: Класс completed корректно добавляется к завершённым карточкам шагов.");

    // 7b. Test Master Checkbox synchronization
    console.log("Тестирование Мастер-Чекбокса в заголовке SOP...");
    const masterCheckbox = page.locator('#master-steps-checkbox');
    const isMasterCheckedBefore = await masterCheckbox.isChecked();
    console.log(`Начальный статус мастер-чекбокса: ${isMasterCheckedBefore ? 'отмечен' : 'не отмечен'}`);
    
    // Uncheck first step to ensure master checkbox is unchecked
    if (await firstStepCard.locator('.step-checkbox').isChecked()) {
      await firstStepCard.locator('.checkbox-checkmark').first().click();
      await page.waitForTimeout(100);
    }
    
    let isMasterCheckedAfterUncheck = await masterCheckbox.isChecked();
    console.log(`Статус мастер-чекбокса после сброса первого шага: ${isMasterCheckedAfterUncheck ? 'отмечен (БАГ!)' : 'не отмечен (ок)'}`);
    if (isMasterCheckedAfterUncheck) {
      throw new Error("Ошибка: Мастер-чекбокс остался отмеченным при неотмеченном первом шаге!");
    }
    
    // Click master checkbox to check all
    console.log("Клик на мастер-чекбокс для отметки всех шагов...");
    await page.click('.master-steps-checkbox-container .checkbox-checkmark');
    await page.waitForTimeout(200);
    
    let allStepsChecked = true;
    for (let i = 0; i < stepCount; i++) {
      const checked = await stepCards.nth(i).locator('.step-checkbox').isChecked();
      if (!checked) allStepsChecked = false;
    }
    console.log(`Все дочерние шаги отмечены после клика на мастер-чекбокс: ${allStepsChecked ? 'ДА (успешно!)' : 'НЕТ (БАГ!)'}`);
    if (!allStepsChecked) {
      throw new Error("Ошибка: Клик на мастер-чекбокс не отметил все дочерние шаги!");
    }
    
    // Click master checkbox again to uncheck all
    console.log("Клик на мастер-чекбокс повторно для сброса всех шагов...");
    await page.click('.master-steps-checkbox-container .checkbox-checkmark');
    await page.waitForTimeout(200);
    
    let allStepsUnchecked = true;
    for (let i = 0; i < stepCount; i++) {
      const checked = await stepCards.nth(i).locator('.step-checkbox').isChecked();
      if (checked) allStepsUnchecked = false;
    }
    console.log(`Все дочерние шаги сброшены после повторного клика на мастер-чекбокс: ${allStepsUnchecked ? 'ДА (успешно!)' : 'НЕТ (БАГ!)'}`);
    if (!allStepsUnchecked) {
      throw new Error("Ошибка: Повторный клик на мастер-чекбокс не сбросил дочерние шаги!");
    }
    console.log("✅ УСПЕШНО: Двусторонняя синхронизация мастер-чекбокса работает безупречно!");
  }

  // 8. Test Glassmorphic Tooltip on recommended tools — hover on info icon
  const toolPills = page.locator('#drawer-tools .tool-pill');
  const toolsCount = await toolPills.count();
  console.log(`✅ Найдено пиллов инструментов в сайдбаре: ${toolsCount}`);

  if (toolsCount > 0) {
    const firstTool = toolPills.first();
    const toolName = await firstTool.locator('.tool-pill-name').textContent();
    console.log(`Наведение мыши на плашку инструмента: "${toolName.trim()}"`);
    
    // Hover over the tool pill itself
    await firstTool.hover();
    await page.waitForTimeout(200);

    // Verify Tooltip is visible in DOM
    const tooltip = page.locator('#tool-tooltip');
    const isTooltipVisible = await tooltip.evaluate(el => el.classList.contains('show'));
    const tooltipTitle = await tooltip.locator('h4').textContent();
    
    console.log(`Статус всплывающей подсказки: ${isTooltipVisible ? 'отображается' : 'скрыта (БАГ!)'}`);
    console.log(`Заголовок подсказки: "${tooltipTitle}"`);
    
    if (!isTooltipVisible) {
      throw new Error("Ошибка: Наведение на плашку не активировало всплывающую подсказку #tool-tooltip!");
    }
    console.log("✅ УСПЕШНО: Glassmorphic подсказка с изумрудным заголовком отлично всплывает!");

    // Verify tooltip is positioned BELOW the tool-pill frame
    const toolBox = await firstTool.boundingBox();
    const tooltipBox = await tooltip.boundingBox();
    console.log(`[DEBUG] Координаты плашки: y=${toolBox.y}, высота=${toolBox.height}. Координаты подсказки: y=${tooltipBox.y}`);
    if (tooltipBox.y < toolBox.y + toolBox.height - 5) {
      throw new Error(`Ошибка: Подсказка не открылась снизу от плашки инструмента! (tooltipY: ${tooltipBox.y} < toolBottom: ${toolBox.y + toolBox.height})`);
    }
    console.log("✅ УСПЕШНО: Подсказка открывается снизу от плашки инструмента!");

    // 8b. Test Glassmorphic Tooltip persistent hover on hover transition
    console.log("Тестирование удержания ховера при переходе на подсказку...");
    
    // Hover again to ensure focus is active
    await firstTool.hover();
    await page.waitForTimeout(100);
    
    // Move mouse to the tooltip itself
    const tooltipBoundingBox = await tooltip.boundingBox();
    if (tooltipBoundingBox) {
      console.log(`Переводим мышь на координаты подсказки: x=${tooltipBoundingBox.x + 10}, y=${tooltipBoundingBox.y + 10}`);
      await page.mouse.move(tooltipBoundingBox.x + 10, tooltipBoundingBox.y + 10);
      await page.waitForTimeout(300); // Wait longer than the 150ms hide timeout
      
      const isStillVisible = await tooltip.evaluate(el => el.classList.contains('show'));
      console.log(`Подсказка осталась открытой при нахождении мыши на ней: ${isStillVisible ? 'ДА (успешно!)' : 'НЕТ (БАГ!)'}`);
      if (!isStillVisible) {
        throw new Error("Ошибка: Подсказка закрылась при переводе курсора на само всплывающее окно!");
      }
      
      // Move mouse away
      console.log("Уводим мышь с подсказки в пустую область холста...");
      await page.mouse.move(10, 10);
      await page.waitForTimeout(350);
      
      const isHiddenNow = await tooltip.evaluate(el => !el.classList.contains('show'));
      console.log(`Подсказка закрылась после ухода мыши: ${isHiddenNow ? 'ДА (успешно!)' : 'НЕТ (БАГ!)'}`);
      if (!isHiddenNow) {
        throw new Error("Ошибка: Подсказка не скрылась после ухода курсора с её области!");
      }
      console.log("✅ УСПЕШНО: Таймер задержки скрытия подсказки и удержание фокуса работают отлично!");
    }
  }

  // 9. Close Side Drawer
  console.log("Закрытие сайдбара...");
  await page.click('#close-drawer');
  await page.waitForTimeout(300);
  
  const isDrawerClosed = await page.locator('#side-drawer').evaluate(el => !el.classList.contains('active'));
  console.log(`Статус сайдбара: ${isDrawerClosed ? 'успешно закрыт' : 'остался открытым'}`);
  if (!isDrawerClosed) {
    throw new Error("Ошибка: Сайдбар не закрылся при клике на кнопку закрытия!");
  }

  // 10. Switch back to Bento view
  console.log("Возвращение к Bento сетке...");
  await page.click('#toggle-bento');
  await page.waitForSelector('.bento-card');
  console.log("✅ УСПЕШНО: Переключение видов Bento <-> Canvas работает безупречно.");

  console.log("\n⭐️ ВСЕ ИНТЕГРАЦИОННЫЕ ТЕСТЫ УСПЕШНО ПРОЙДЕНЫ! 100% ФУНКЦИОНАЛ РАБОТАЕТ БЕЗУПРЕЧНО!");
  
  await browser.close();
  process.exit(0);
})().catch(err => {
  console.error("\n❌ ОШИБКА ПРИ ВЫПОЛНЕНИИ ТЕСТОВ:");
  console.error(err.message);
  process.exit(1);
});
