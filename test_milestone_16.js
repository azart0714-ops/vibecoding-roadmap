const fs = require('fs');
const path = require('path');

const filesToVerify = [
  'research/resources_list_stage_6.md',
  'research/tech_stacks_and_tools_analysis.md',
  'research/NEW_IMPROVEMENTS_BACKLOG_STAGE_6.md'
];

let failed = false;

console.log('🏁 Starting Milestone 16 Auto-Verification...\n');

// 1. Verify existence of newly created research files
filesToVerify.forEach(relPath => {
  const fullPath = path.resolve(__dirname, relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Error: File is missing: ${relPath}`);
    failed = true;
  } else {
    const stats = fs.statSync(fullPath);
    if (stats.size === 0) {
      console.error(`❌ Error: File is empty: ${relPath}`);
      failed = true;
    } else {
      console.log(`✅ Success: ${relPath} verified successfully (${stats.size} bytes).`);
    }
  }
});

// 2. Verify central roadmap integration
const roadmapPath = path.resolve(__dirname, 'RESEARCH_ROADMAP.md');
if (!fs.existsSync(roadmapPath)) {
  console.error('❌ Error: RESEARCH_ROADMAP.md is missing!');
  failed = true;
} else {
  const content = fs.readFileSync(roadmapPath, 'utf8');
  
  if (!content.includes('Этап 6: Анализ технических стеков и инструментов') || !content.includes('Завершен ✅')) {
    console.error('❌ Error: RESEARCH_ROADMAP.md does not show Stage 6 as Completed ✅!');
    failed = true;
  } else {
    console.log('✅ Success: Central RESEARCH_ROADMAP.md has Stage 6 correctly marked as Completed ✅.');
  }

  if (!content.includes('Собрано доработок: **99**')) {
    console.error('❌ Error: RESEARCH_ROADMAP.md does not show updated 99 total improvements!');
    failed = true;
  } else {
    console.log('✅ Success: Central RESEARCH_ROADMAP.md statistics correctly show 99 total improvements.');
  }
}

if (failed) {
  console.error('\n🛑 Milestone 16 Auto-Verification FAILED!');
  process.exit(1);
} else {
  console.log('\n🌟 Milestone 16 Auto-Verification PASSED SUCCESSFULLY!');
  process.exit(0);
}
