const fs = require('fs');
const path = require('path');

console.log("=== ЗАПУСК ВАЛИДАЦИОННЫХ ТЕСТОВ СЕМАНТИКИ (CYCLE 7) ===");

// Robust mock for browser globals to prevent errors during Node execution
const mockWindow = new Proxy({
  generateBookInsight: () => {},
  selectFigmaToken: () => {},
  enhanceV0Prompt: () => {},
  switchStoryState: () => {},
  updateGatesProgress: () => {},
  generateHandoffMD: () => {},
  selectRulesPlatform: () => {},
  selectRulesStack: () => {},
  selectSkillBlueprint: () => {},
  selectRailwayNode: () => {}
}, {
  get: (target, prop) => {
    if (prop in target) return target[prop];
    return () => {};
  }
});
global.window = mockWindow;

global.document = {
  getElementById: () => ({ value: '', style: {}, innerText: '', className: '', addEventListener: () => {} }),
  querySelectorAll: () => []
};

const { nodes } = require('./data.js');
const roadmapData = nodes;

if (!Array.isArray(roadmapData)) {
  console.error("❌ Ошибка: roadmapData не является массивом!");
  process.exit(1);
}

console.log(`✅ Успешно загружено ${roadmapData.length} узлов из data.js`);

// Validate the new Level 3 nodes presence and structure
const targetIds = [
  'l3_19_rules_files',
  'l3_20_reusable_skills'
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
  
  if (node.level !== 'L3') {
    console.error(`❌ Ошибка: Узел ${id} имеет неверный уровень: ${node.level} (ожидался L3)`);
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

// Verify connections in script.js
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
  { from: 'l3_18_env_vars', to: 'l3_19_rules_files' },
  { from: 'l3_19_rules_files', to: 'l3_20_reusable_skills' },
  { from: 'l3_20_reusable_skills', to: 'l4_1_private_git' }
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

// Verify bentoWeights in script.js
targetIds.forEach(id => {
  const weightRegex = new RegExp(`${id}\\s*:\\s*["']weight-[a-z]+["']`);
  if (!weightRegex.test(scriptContent)) {
    console.error(`❌ Ошибка: Узел ${id} не зарегистрирован в bentoWeights в script.js!`);
    failed = true;
  } else {
    console.log(`✅ Узел ${id} успешно зарегистрирован в bentoWeights!`);
  }
});

// Duplicate ID Check
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
  console.log("⭐️ ВСЕ СЕМАНТИЧЕСКИЕ ТЕСТЫ CYCLE 7 УСПЕШНО ПРОЙДЕНЫ!");
  process.exit(0);
}
