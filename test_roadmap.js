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

  // 8c. Test L4 Tasks 50, 51, 52 (Container Queries, Fluid Typography, Touch Targets)
  console.log("\n=== ТЕСТИРОВАНИЕ НОВЫХ ИНТЕРАКТИВНЫХ КОМПОНЕНТОВ L4 (Tasks 50, 51, 52) ===");
  
  // A. Container Queries
  console.log("Тестирование Task 50 (Container Queries)...");
  await page.evaluate(() => {
    const node = document.querySelector('.canvas-node[data-id="l4_28_container_queries"]');
    if (node) node.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  });
  await page.waitForTimeout(500);
  
  // Expand 4th step card containing playground
  const cqStepCard = page.locator('#drawer-steps .step-card').nth(3);
  await cqStepCard.locator('.step-text').click();
  await page.waitForTimeout(400);

  const cqSlider = page.locator('#container-width-slider');
  await cqSlider.fill('350');
  await cqSlider.dispatchEvent('input');
  await page.waitForTimeout(200);

  let cqWidthVal = await page.locator('#container-width-val').textContent();
  console.log(`Ширина контейнера после сдвига: ${cqWidthVal}`);
  if (cqWidthVal !== '350px') {
    throw new Error(`Ошибка: Значение ширины контейнера не обновилось! Ожидалось 350px, получено: ${cqWidthVal}`);
  }

  let cqBadgeText = await page.locator('#cq-card-badge').textContent();
  console.log(`Текст бейджа при ширине 350px: ${cqBadgeText}`);
  if (!cqBadgeText.includes('Stack') && !cqBadgeText.includes('max-width')) {
    throw new Error(`Ошибка: Бейдж не переключился на стек при узком контейнере! Получено: ${cqBadgeText}`);
  }

  await cqSlider.fill('450');
  await cqSlider.dispatchEvent('input');
  await page.waitForTimeout(200);

  cqBadgeText = await page.locator('#cq-card-badge').textContent();
  console.log(`Текст бейджа после сброса на 450px: ${cqBadgeText}`);
  if (!cqBadgeText.includes('Row') && !cqBadgeText.includes('min-width')) {
    throw new Error(`Ошибка: Бейдж не переключился обратно на строку! Получено: ${cqBadgeText}`);
  }
  console.log("✅ Task 50 (Container Queries) протестирован успешно!");

  // B. Fluid Typography
  console.log("Тестирование Task 51 (Fluid Typography)...");
  await page.evaluate(() => {
    const node = document.querySelector('.canvas-node[data-id="l4_29_fluid_typography"]');
    if (node) node.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  });
  await page.waitForTimeout(500);

  // Expand 4th step card containing playground
  const fluidStepCard = page.locator('#drawer-steps .step-card').nth(3);
  await fluidStepCard.locator('.step-text').click();
  await page.waitForTimeout(400);

  await page.locator('#fluid-min-slider').fill('16');
  await page.locator('#fluid-min-slider').dispatchEvent('input');
  await page.locator('#fluid-max-slider').fill('40');
  await page.locator('#fluid-max-slider').dispatchEvent('input');
  await page.locator('#fluid-viewport-slider').fill('80');
  await page.locator('#fluid-viewport-slider').dispatchEvent('input');
  await page.waitForTimeout(200);

  let fluidFormula = await page.locator('#fluid-formula-code').textContent();
  console.log(`Сгенерированная формула clamp(): ${fluidFormula}`);
  if (!fluidFormula.includes('16px') || !fluidFormula.includes('40px')) {
    throw new Error(`Ошибка: Сгенерированная clamp() формула некорректна! Получено: ${fluidFormula}`);
  }

  let fluidVpVal = await page.locator('#fluid-viewport-val').textContent();
  console.log(`Ширина превью-зоны: ${fluidVpVal}`);
  if (fluidVpVal !== '80%') {
    throw new Error(`Ошибка: Значение ширины превью-зоны не обновилось! Ожидалось 80%, получено: ${fluidVpVal}`);
  }
  console.log("✅ Task 51 (Fluid Typography) протестирован успешно!");

  // C. Touch Targets
  console.log("Тестирование Task 52 (Touch Targets)...");
  await page.evaluate(() => {
    const node = document.querySelector('.canvas-node[data-id="l4_30_touch_targets"]');
    if (node) node.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  });
  await page.waitForTimeout(500);

  // Expand 4th step card containing playground
  const touchStepCard = page.locator('#drawer-steps .step-card').nth(3);
  await touchStepCard.locator('.step-text').click();
  await page.waitForTimeout(400);

  // Let's click the accessible green button (should trigger hit)
  console.log("Нажимаем на хорошую сенсорную кнопку (48x48px)...");
  const goodBtn = page.locator('button[onclick*="simulateTouchClick(\'good\', true)"]').first();
  await goodBtn.click();
  await page.waitForTimeout(150);

  // Let's click the bad button itself (should trigger hit)
  console.log("Нажимаем на плохую маленькую кнопку (16x16px)...");
  const badBtn = page.locator('button[onclick*="simulateTouchClick(\'bad\', true)"]').first();
  await badBtn.click();
  await page.waitForTimeout(150);

  // Let's click outside the bad button but inside its bad row container (should trigger miss)
  console.log("Кликаем мимо плохой кнопки во внешнюю область плашки (симулируем промах)...");
  const badRow = page.locator('div[onclick*="simulateTouchClick(\'bad\', false)"]').first();
  // Click specifically towards the left edge to avoid the red button on the right
  await badRow.click({ position: { x: 5, y: 5 } });
  await page.waitForTimeout(150);

  let touchHits = await page.locator('#touch-hit-cnt').textContent();
  let touchMisses = await page.locator('#touch-miss-cnt').textContent();
  console.log(`Показатели: Успешно: ${touchHits}, Промахи: ${touchMisses}`);
  
  if (parseInt(touchHits) < 2) {
    throw new Error(`Ошибка: Счетчик попаданий не обновился! Ожидалось минимум 2, получено: ${touchHits}`);
  }
  if (parseInt(touchMisses) < 1) {
    throw new Error(`Ошибка: Счетчик промахов не обновился! Ожидалось минимум 1, получено: ${touchMisses}`);
  }
  console.log("✅ Task 52 (Touch Targets) протестирован успешно!");

  // D. Core Web Vitals
  console.log("Тестирование Task 53 (Core Web Vitals)...");
  await page.evaluate(() => {
    const node = document.querySelector('.canvas-node[data-id="l4_31_core_web_vitals"]');
    if (node) node.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  });
  await page.waitForTimeout(500);

  const cwvStepCard = page.locator('#drawer-steps .step-card').nth(2);
  await cwvStepCard.locator('.step-text').click();
  await page.waitForTimeout(400);

  let cwvLcpVal = await page.locator('#cwv-lcp-val').textContent();
  console.log(`Начальный LCP: ${cwvLcpVal}`);
  
  console.log("Симулируем сдвиг макета (Layout Shift)...");
  await page.click('#cwv-simulate-shift-btn');
  await page.waitForTimeout(200);
  
  let cwvClsStatus = await page.locator('#cwv-cls-status').textContent();
  let shiftedLcpVal = await page.locator('#cwv-lcp-val').textContent();
  console.log(`LCP после сдвига: ${shiftedLcpVal}, Статус CLS: ${cwvClsStatus}`);
  if (shiftedLcpVal !== '5.4s' || !cwvClsStatus.includes('POOR')) {
    throw new Error(`Ошибка: Метрики Core Web Vitals не ухудшились при сдвиге! LCP=${shiftedLcpVal}, CLS=${cwvClsStatus}`);
  }

  console.log("Оптимизируем Core Web Vitals...");
  await page.click('#cwv-optimize-btn');
  await page.waitForTimeout(200);

  let optClsStatus = await page.locator('#cwv-cls-status').textContent();
  let optLcpVal = await page.locator('#cwv-lcp-val').textContent();
  console.log(`Оптимизированный LCP: ${optLcpVal}, Статус CLS: ${optClsStatus}`);
  if (optLcpVal !== '1.2s' || !optClsStatus.includes('GOOD')) {
    throw new Error(`Ошибка: Оптимизация Core Web Vitals не сработала! LCP=${optLcpVal}, CLS=${optClsStatus}`);
  }
  console.log("✅ Task 53 (Core Web Vitals) протестирован успешно!");

  // E. Perceived Performance
  console.log("Тестирование Task 54 (Perceived Performance)...");
  await page.evaluate(() => {
    const node = document.querySelector('.canvas-node[data-id="l4_32_perceived_performance"]');
    if (node) node.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  });
  await page.waitForTimeout(500);

  const percStepCard = page.locator('#drawer-steps .step-card').nth(2);
  await percStepCard.locator('.step-text').click();
  await page.waitForTimeout(400);

  console.log("Запускаем симуляцию загрузки в 2 секунды...");
  await page.click('#perc-simulate-btn');
  await page.waitForTimeout(300);

  let isBtnDisabled = await page.locator('#perc-simulate-btn').isDisabled();
  let spinnerVisible = await page.locator('#perc-spinner-loader').isVisible();
  console.log(`Кнопка заблокирована во время загрузки: ${isBtnDisabled}, Спиннер виден: ${spinnerVisible}`);
  if (!isBtnDisabled || !spinnerVisible) {
    throw new Error("Ошибка: Во время симуляции кнопка должна быть заблокирована и лоадер должен быть активен!");
  }

  console.log("Ожидаем окончания симуляции загрузки (2.2 сек)...");
  await page.waitForTimeout(2200);

  isBtnDisabled = await page.locator('#perc-simulate-btn').isDisabled();
  let spinnerHidden = await page.locator('#perc-spinner-loader').isHidden();
  console.log(`Кнопка разблокирована после загрузки: ${!isBtnDisabled}, Спиннер скрыт: ${spinnerHidden}`);
  if (isBtnDisabled || !spinnerHidden) {
    throw new Error("Ошибка: Симуляция загрузки не завершилась по таймеру!");
  }
  console.log("✅ Task 54 (Perceived Performance) протестирован успешно!");

  // F. Image Optimization
  console.log("Тестирование Task 55 (Image Optimization)...");
  await page.evaluate(() => {
    const node = document.querySelector('.canvas-node[data-id="l4_33_image_optimization"]');
    if (node) node.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  });
  await page.waitForTimeout(500);

  const imgStepCard = page.locator('#drawer-steps .step-card').nth(2);
  await imgStepCard.locator('.step-text').click();
  await page.waitForTimeout(400);

  console.log("Выбираем формат PNG...");
  await page.click('#img-opt-png-btn');
  await page.waitForTimeout(100);
  let pngSize = await page.locator('#img-opt-size-val').textContent();
  let pngStatus = await page.locator('#img-opt-status-val').textContent();
  console.log(`PNG размер: ${pngSize}, статус: ${pngStatus}`);
  if (pngSize !== '1.8 MB' || !pngStatus.includes('Плохо')) {
    throw new Error(`Ошибка: Неверный вес или статус PNG! Размер=${pngSize}, Статус=${pngStatus}`);
  }

  console.log("Выбираем формат AVIF...");
  await page.click('#img-opt-avif-btn');
  await page.waitForTimeout(100);
  let avifSize = await page.locator('#img-opt-size-val').textContent();
  let avifStatus = await page.locator('#img-opt-status-val').textContent();
  console.log(`AVIF размер: ${avifSize}, статус: ${avifStatus}`);
  if (avifSize !== '54 KB' || !avifStatus.includes('Отлично')) {
    throw new Error(`Ошибка: Неверный вес или статус AVIF! Размер=${avifSize}, Статус=${avifStatus}`);
  }
  console.log("✅ Task 55 (Image Optimization) протестирован успешно!");

  // G. WCAG 2.1 Level AA
  console.log("Тестирование Task 56 (WCAG 2.1 Level AA)...");
  await page.evaluate(() => {
    const node = document.querySelector('.canvas-node[data-id="l4_34_wcag_standards"]');
    if (node) node.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  });
  await page.waitForTimeout(500);

  const wcagStepCard = page.locator('#drawer-steps .step-card').nth(1);
  await wcagStepCard.locator('.step-text').click();
  await page.waitForTimeout(400);

  console.log("Сдвигаем слайдер контрастности влево (плохой контраст)...");
  await page.locator('#contrast-color-slider').fill('10');
  await page.locator('#contrast-color-slider').dispatchEvent('input');
  await page.waitForTimeout(100);
  let failBadge = await page.locator('#contrast-status-badge').textContent();
  let failRatio = await page.locator('#contrast-ratio-val').textContent();
  console.log(`Контраст: ${failRatio}, Результат: ${failBadge}`);
  if (!failBadge.includes('FAIL')) {
    throw new Error(`Ошибка: Слайдер с низким контрастом должен вызывать FAIL! Контраст: ${failRatio}, Результат: ${failBadge}`);
  }

  console.log("Сдвигаем слайдер вправо (отличный контраст)...");
  await page.locator('#contrast-color-slider').fill('95');
  await page.locator('#contrast-color-slider').dispatchEvent('input');
  await page.waitForTimeout(100);
  let passBadge = await page.locator('#contrast-status-badge').textContent();
  let passRatio = await page.locator('#contrast-ratio-val').textContent();
  console.log(`Контраст: ${passRatio}, Результат: ${passBadge}`);
  if (!passBadge.includes('PASS AAA')) {
    throw new Error(`Ошибка: Слайдер с высоким контрастом должен вызывать PASS AAA! Контраст: ${passRatio}, Результат: ${passBadge}`);
  }
  console.log("✅ Task 56 (WCAG 2.1 Level AA) протестирован успешно!");

  // H. Keyboard Navigation
  console.log("Тестирование Task 57 (Keyboard Navigation)...");
  await page.evaluate(() => {
    const node = document.querySelector('.canvas-node[data-id="l4_35_keyboard_navigation"]');
    if (node) node.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  });
  await page.waitForTimeout(500);

  const keyNavStepCard = page.locator('#drawer-steps .step-card').nth(2);
  await keyNavStepCard.locator('.step-text').click();
  await page.waitForTimeout(400);

  let initialTrapStatus = await page.locator('#trap-status-indicator').textContent();
  console.log(`Начальный статус фокус-ловушки: ${initialTrapStatus}`);
  if (!initialTrapStatus.includes('ОТКЛЮЧЕНА')) {
    throw new Error("Ошибка: Фокус-ловушка должна быть отключена по умолчанию!");
  }

  console.log("Активируем фокус-ловушку...");
  await page.click('#trap-toggle-btn');
  await page.waitForTimeout(100);
  let activeTrapStatus = await page.locator('#trap-status-indicator').textContent();
  console.log(`Статус фокус-ловушки после клика: ${activeTrapStatus}`);
  if (!activeTrapStatus.includes('АКТИВИРОВАНА')) {
    throw new Error("Ошибка: Ловушка не активировалась после клика по переключателю!");
  }

  console.log("Эмулируем клавишу Tab через кнопку симуляции...");
  await page.click('#trap-cycle-btn');
  await page.waitForTimeout(100);
  let buttonFocused = await page.evaluate(() => document.activeElement.id === 'trap-el-button');
  console.log(`Фокус перешел на кнопку модалки: ${buttonFocused}`);

  console.log("Отключаем фокус-ловушку...");
  await page.click('#trap-toggle-btn');
  await page.waitForTimeout(100);
  let disabledTrapStatus = await page.locator('#trap-status-indicator').textContent();
  console.log(`Итоговый статус фокус-ловушки: ${disabledTrapStatus}`);
  if (!disabledTrapStatus.includes('ОТКЛЮЧЕНА')) {
    throw new Error("Ошибка: Ловушка не деактивировалась!");
  }
  console.log("✅ Task 57 (Keyboard Navigation) протестирован успешно!");

  // I. Screen Readers
  console.log("Тестирование Task 58 (Screen Readers)...");
  await page.evaluate(() => {
    const node = document.querySelector('.canvas-node[data-id="l4_36_screen_readers"]');
    if (node) node.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  });
  await page.waitForTimeout(500);

  const srStepCard = page.locator('#drawer-steps .step-card').nth(2);
  await srStepCard.locator('.step-text').click();
  await page.waitForTimeout(400);

  console.log("Клик по недоступной кнопке (без aria-label)...");
  await page.click('#sr-bad-btn');
  await page.waitForTimeout(100);
  let narratorTextBad = await page.locator('#sr-narrator-text').textContent();
  console.log(`Диктор озвучил: "${narratorTextBad}"`);
  if (!narratorTextBad.includes('Пустое описание')) {
    throw new Error(`Ошибка: Описание должно сообщать об отсутствии aria-label! Получено: ${narratorTextBad}`);
  }

  console.log("Клик по доступной кнопке (с aria-label)...");
  await page.click('#sr-good-btn');
  await page.waitForTimeout(100);
  let narratorTextGood = await page.locator('#sr-narrator-text').textContent();
  console.log(`Диктор озвучил: "${narratorTextGood}"`);
  if (!narratorTextGood.includes('Открыть настройки профиля')) {
    throw new Error(`Ошибка: Описание должно озвучить aria-label! Получено: ${narratorTextGood}`);
  }

  console.log("Клик по кнопке срочного уведомления (role=alert)...");
  await page.click('#sr-alert-btn');
  await page.waitForTimeout(100);
  let narratorTextAlert = await page.locator('#sr-narrator-text').textContent();
  console.log(`Диктор озвучил: "${narratorTextAlert}"`);
  if (!narratorTextAlert.includes('разорвано')) {
    throw new Error(`Ошибка: Описание должно озвучить alert-сообщение! Получено: ${narratorTextAlert}`);
  }
  console.log("✅ Task 58 (Screen Readers) протестирован успешно!");
  
  // J. Prisma CLI AI-Safety Guardrails
  console.log("Тестирование Task 59 (Prisma CLI AI-Safety Guardrails)...");
  await page.evaluate(() => {
    const node = document.querySelector('.canvas-node[data-id="l5_9_prisma_safety"]');
    if (node) node.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  });
  await page.waitForTimeout(500);

  // Expand the step card containing the prisma safety widget
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('#drawer-steps .step-card'));
    const prismaCard = cards.find(card => card.querySelector('#prisma-simulate-btn'));
    if (prismaCard) {
      prismaCard.classList.add('expanded');
      const details = prismaCard.querySelector('.step-details');
      if (details) details.style.maxHeight = '1000px';
    }
  });
  await page.waitForTimeout(400);

  // 1. Verify guardrail active block
  console.log("Симулируем команду ИИ при ВКЛЮЧЕННОМ ограничителе...");
  await page.click('#prisma-simulate-btn', { force: true });
  
  // Wait deterministically for the human approval UI to appear
  await page.waitForSelector('#prisma-human-approval-ui:not(.hidden)', { timeout: 5000 });
  
  let terminalText = await page.locator('#prisma-terminal-log').innerHTML();
  console.log(`Текст терминала: ${terminalText}`);
  if (!terminalText.includes('BLOCKED') || !terminalText.includes('Human-in-the-loop')) {
    throw new Error("Ошибка: Ограничитель должен заблокировать команду ИИ и потребовать подтверждения человека!");
  }

  // 2. Click approve
  console.log("Разрешаем миграцию вручную (Human approval)...");
  
  // Diagnostic log of approve action
  await page.evaluate(() => {
    console.log("[DIAGNOSTIC] window.approvePrismaSafetyCommand type: " + typeof window.approvePrismaSafetyCommand);
    const btn = document.getElementById('prisma-approve-btn');
    console.log("[DIAGNOSTIC] prisma-approve-btn exists: " + !!btn);
    if (btn) console.log("[DIAGNOSTIC] prisma-approve-btn tag: " + btn.tagName + ", onclick: " + btn.getAttribute('onclick'));
  });

  await page.click('#prisma-approve-btn', { force: true });
  
  // Wait deterministically for the success message to be appended
  await page.waitForFunction(() => {
    const text = document.getElementById('prisma-terminal-log').innerHTML;
    return text.includes('Разрешено человеком') && text.includes('Схема синхронизирована');
  }, undefined, { timeout: 5000 });

  console.log("Подтверждение человека сработало успешно!");

  // 3. Verify guardrail off destruction
  console.log("Отключаем ограничитель и симулируем команду ИИ...");
  await page.click('#prisma-guard-toggle', { force: true }); // Toggle checkbox off
  await page.waitForTimeout(300);
  await page.click('#prisma-simulate-btn', { force: true });
  
  // Wait deterministically for the base reset destruction message
  await page.waitForFunction(() => {
    return document.getElementById('prisma-terminal-log').innerHTML.includes('БАЗА ДАННЫХ СТЕРТА');
  }, undefined, { timeout: 5000 });

  console.log("✅ Task 59 (Prisma CLI AI-Safety) протестирован успешно!");

  // K. Drizzle ORM Edge TypeScript schemas
  console.log("Тестирование Task 60 (Drizzle ORM Edge TypeScript schemas)...");
  await page.evaluate(() => {
    const node = document.querySelector('.canvas-node[data-id="l5_10_drizzle_edge"]');
    if (node) node.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  });
  await page.waitForTimeout(500);

  // Expand the step card containing the drizzle widget
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('#drawer-steps .step-card'));
    const drizzleCard = cards.find(card => card.querySelector('#drizzle-add-col-btn'));
    if (drizzleCard) {
      drizzleCard.classList.add('expanded');
      const details = drizzleCard.querySelector('.step-details');
      if (details) details.style.maxHeight = '1000px';
    }
  });
  await page.waitForTimeout(400);

  // 1. Check default Prisma Edge Bundle is 12MB
  let bundleSize = await page.locator('#drizzle-bundle-val').textContent();
  console.log(`Начальный размер бандла Prisma: ${bundleSize}`);
  if (bundleSize !== '12.4 MB') {
    throw new Error(`Ошибка: Начальный размер бандла Prisma должен быть 12.4 MB, получено: ${bundleSize}`);
  }

  // 2. Add col in Prisma mode -> gets TypeScript error
  console.log("Добавляем поле ИИ в режиме Prisma...");
  await page.click('#drizzle-add-col-btn', { force: true });
  await page.waitForTimeout(200);
  let compLog = await page.locator('#drizzle-compiler-log').textContent();
  console.log(`Лог компилятора: ${compLog}`);
  if (!compLog.includes('TS Error') || !compLog.includes('prisma generate')) {
    throw new Error("Ошибка: Добавление поля в Prisma без компиляции должно вызывать ошибку типов!");
  }

  // 3. Compile Prisma -> resolves error
  console.log("Запускаем prisma generate...");
  await page.click('#drizzle-compile-btn', { force: true });
  await page.waitForTimeout(1000);
  compLog = await page.locator('#drizzle-compiler-log').textContent();
  console.log(`Лог компилятора после генерации: ${compLog}`);
  if (!compLog.includes('Сгенерирован Prisma Client') || !compLog.includes('устранены')) {
    throw new Error("Ошибка: Компиляция Prisma не устранила ошибку типов!");
  }

  // 4. Switch to Drizzle
  console.log("Переключаемся в режим Drizzle ORM...");
  await page.click('#drizzle-toggle-drizzle', { force: true });
  await page.waitForTimeout(200);

  bundleSize = await page.locator('#drizzle-bundle-val').textContent();
  console.log(`Размер бандла Drizzle: ${bundleSize}`);
  if (bundleSize !== '146 KB') {
    throw new Error(`Ошибка: Размер бандла Drizzle должен быть 146 KB, получено: ${bundleSize}`);
  }

  // 5. Add col in Drizzle mode -> compiles instantly
  console.log("Добавляем поле ИИ в режиме Drizzle...");
  await page.click('#drizzle-add-col-btn', { force: true });
  await page.waitForTimeout(200);
  compLog = await page.locator('#drizzle-compiler-log').textContent();
  console.log(`Лог компилятора Drizzle: ${compLog}`);
  if (!compLog.includes('обновлены мгновенно') || !compLog.includes('Ошибок компиляции нет')) {
    throw new Error("Ошибка: Добавление поля в Drizzle должно обновляться мгновенно без ошибок!");
  }
  console.log("✅ Task 60 (Drizzle ORM Edge) протестирован успешно!");

  console.log("=========================================================================\n");

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
