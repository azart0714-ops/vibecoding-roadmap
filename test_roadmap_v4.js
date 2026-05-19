const fs = require('fs');
const path = require('path');

console.log("=== ЗАПУСК ВАЛИДАЦИОННЫХ ТЕСТОВ СЕМАНТИКИ (CYCLE 4) ===");

// Mock browser globals to prevent errors during execution
const mockWindow = {
  generateBookInsight: () => {},
  selectFigmaToken: () => {},
  enhanceV0Prompt: () => {},
  switchStoryState: () => {},
  updateGatesProgress: () => {},
  generateHandoffMD: () => {}
};
global.window = mockWindow;
global.document = {
  getElementById: () => ({ value: '', style: {}, innerText: '' })
};

const { nodes } = require('./data.js');
const roadmapData = nodes;

if (!Array.isArray(roadmapData)) {
  console.error("❌ Ошибка: roadmapData не является массивом!");
  process.exit(1);
}

console.log(`✅ Успешно загружено ${roadmapData.length} узлов из data.js`);

// 2. Validate the 6 new L1 nodes presence and structure
const targetIds = [
  'l1_9_ai_books',
  'l1_10_figma_workflow',
  'l1_11_v0_generation',
  'l1_12_storybook_docs',
  'l1_13_quality_gates',
  'l1_14_handoff_standard'
];

let failed = false;

targetIds.forEach(id => {
  const node = roadmapData.find(n => n.id === id);
  if (!node) {
    console.error(`❌ Ошибка: Узел ${id} не найден в data.js!`);
    failed = true;
    return;
  }
  
  console.log(`✅ Найдено описание для узла: ${id} ("${node.title}")`);
  
  if (node.level !== 'L1') {
    console.error(`❌ Ошибка: Узел ${id} имеет неверный уровень: ${node.level} (ожидался L1)`);
    failed = true;
  }
  
  if (!node.shortDesc || node.shortDesc.trim() === '') {
    console.error(`❌ Ошибка: Узел ${id} не имеет краткого описания shortDesc!`);
    failed = true;
  }
  
  if (!Array.isArray(node.steps) || node.steps.length === 0) {
    console.error(`❌ Ошибка: Узел ${id} не содержит шагов SOP (steps)!`);
    failed = true;
  } else {
    node.steps.forEach((step, idx) => {
      if (!step.text || step.text.trim() === '') {
        console.error(`❌ Ошибка: Шаг ${idx + 1} в узле ${id} не содержит названия!`);
        failed = true;
      }
      if (!step.details || step.details.trim() === '') {
        console.error(`❌ Ошибка: Шаг ${idx + 1} в узле ${id} не содержит детального описания details!`);
        failed = true;
      }
    });
  }
  
  if (!Array.isArray(node.tools) || node.tools.length === 0) {
    console.error(`❌ Ошибка: Узел ${id} не содержит инструментов (tools)!`);
    failed = true;
  }
});

// 3. Verify connections in script.js
const scriptPath = path.resolve(__dirname, 'script.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

const connectionRegex = /\{\s*from:\s*"([^"]+)",\s*to:\s*"([^"]+)"\s*\}/g;
let match;
const connections = [];
while ((match = connectionRegex.exec(scriptContent)) !== null) {
  connections.push({ from: match[1], to: match[2] });
}

console.log(`✅ Найдено ${connections.length} связей в script.js`);

const expectedConnections = [
  { from: 'l1_8_cli_tools_matrix', to: 'l1_9_ai_books' },
  { from: 'l1_9_ai_books', to: 'l1_10_figma_workflow' },
  { from: 'l1_10_figma_workflow', to: 'l1_11_v0_generation' },
  { from: 'l1_11_v0_generation', to: 'l1_12_storybook_docs' },
  { from: 'l1_12_storybook_docs', to: 'l1_13_quality_gates' },
  { from: 'l1_13_quality_gates', to: 'l1_14_handoff_standard' },
  { from: 'l1_14_handoff_standard', to: 'l2_1_human_ai_roles' }
];

expectedConnections.forEach(conn => {
  const found = connections.find(c => c.from === conn.from && c.to === conn.to);
  if (!found) {
    console.error(`❌ Ошибка: Отсутствует связь { from: "${conn.from}", to: "${conn.to}" } в script.js!`);
    failed = true;
  } else {
    console.log(`✅ Связь ${conn.from} -> ${conn.to} успешно найдена!`);
  }
});

// 4. Verify bentoWeights in script.js
targetIds.forEach(id => {
  const weightRegex = new RegExp(`${id}\\s*:\\s*["']weight-[a-z]+["']`);
  if (!weightRegex.test(scriptContent)) {
    console.error(`❌ Ошибка: Узел ${id} не зарегистрирован в bentoWeights в script.js!`);
    failed = true;
  } else {
    console.log(`✅ Узел ${id} успешно зарегистрирован в bentoWeights!`);
  }
});

// 5. Duplicate ID Check
const idMap = {};
roadmapData.forEach(n => {
  if (idMap[n.id]) {
    console.error(`❌ КРИТИЧЕСКАЯ ОШИБКА: Обнаружен дубликат ID в data.js: ${n.id}!`);
    failed = true;
  }
  idMap[n.id] = true;
});

if (failed) {
  console.log("❌ ТЕСТЫ ЗАВЕРШИЛИСЬ С ОШИБКАМИ!");
  process.exit(1);
} else {
  console.log("⭐️ ВСЕ СЕМАНТИЧЕСКИЕ ТЕСТЫ CYCLE 4 УСПЕШНО ПРОЙДЕНЫ!");
  process.exit(0);
}
