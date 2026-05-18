const fs = require('fs');
const path = require('path');

const filesToVerify = [
  'research/resources_list_stage_7.md',
  'research/ui_ux_design_best_practices.md',
  'research/NEW_IMPROVEMENTS_BACKLOG_STAGE_7.md',
  'research/resources_list_stage_8.md',
  'research/swarm_and_agent_systems_analysis.md',
  'research/NEW_IMPROVEMENTS_BACKLOG_STAGE_8.md'
];

let failed = false;

console.log('🏁 Starting Milestone 17 (Stages 7 & 8) Auto-Verification...\n');

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
  
  if (!content.includes('Этап 7: Дизайн и UX best practices') || !content.includes('Завершен ✅')) {
    console.error('❌ Error: RESEARCH_ROADMAP.md does not show Stage 7 as Completed ✅!');
    failed = true;
  } else {
    console.log('✅ Success: Central RESEARCH_ROADMAP.md has Stage 7 correctly marked as Completed ✅.');
  }

  if (!content.includes('Этап 8: Агентные системы и Swarm (L8)') || !content.includes('Завершен ✅')) {
    console.error('❌ Error: RESEARCH_ROADMAP.md does not show Stage 8 as Completed ✅!');
    failed = true;
  } else {
    console.log('✅ Success: Central RESEARCH_ROADMAP.md has Stage 8 correctly marked as Completed ✅.');
  }

  if (!content.includes('Собрано доработок: **115**')) {
    console.error('❌ Error: RESEARCH_ROADMAP.md does not show updated 115 total improvements!');
    failed = true;
  } else {
    console.log('✅ Success: Central RESEARCH_ROADMAP.md statistics correctly show 115 total improvements.');
  }
}

if (failed) {
  console.error('\n🛑 Milestone 17 Auto-Verification FAILED!');
  process.exit(1);
} else {
  console.log('\n🌟 Milestone 17 Auto-Verification PASSED SUCCESSFULLY!');
  process.exit(0);
}
