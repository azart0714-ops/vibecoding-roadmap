document.addEventListener("DOMContentLoaded", () => {
  // 1. Initial State & Elements
  let activeView = "bento"; // 'bento' or 'canvas'
  let currentLevelFilter = "all";
  let currentTrackFilter = "all";
  let searchQuery = "";
  
  // State persistence (Custom Checkbox and progress)
  const completedNodes = new Set(JSON.parse(localStorage.getItem("completedNodes") || "[]"));
  const completedSteps = new Set(JSON.parse(localStorage.getItem("completedSteps") || "[]"));
  
  // Canvas zoom & pan state
  let scale = 0.8;
  let panX = 100;
  let panY = 50;
  let isDragging = false;
  let startX, startY;

  // DOM Elements
  const bentoGrid = document.getElementById("bento-grid-content");
  const canvasNodesContainer = document.getElementById("canvas-nodes-container");
  const svgConnections = document.getElementById("canvas-connections");
  const mapViewport = document.getElementById("map-viewport");
  const mapCanvas = document.getElementById("map-canvas");
  
  const searchInput = document.getElementById("search-input");
  const clearSearchBtn = document.getElementById("clear-search");
  
  const toggleBentoBtn = document.getElementById("toggle-bento");
  const toggleCanvasBtn = document.getElementById("toggle-canvas");
  const bentoView = document.getElementById("bento-view-container");
  const canvasView = document.getElementById("canvas-view-container");
  
  const levelFilters = document.getElementById("level-filters");
  const trackFilters = document.getElementById("track-filters");
  
  const zoomInBtn = document.getElementById("zoom-in");
  const zoomOutBtn = document.getElementById("zoom-out");
  const zoomFitBtn = document.getElementById("zoom-fit");
  
  const sideDrawer = document.getElementById("side-drawer");
  const drawerOverlay = document.getElementById("drawer-overlay");
  const closeDrawerBtn = document.getElementById("close-drawer");
  const resetBtn = document.getElementById("reset-progress-btn");

  // Create dynamic global tooltip element in body
  let tooltipEl = document.getElementById("tool-tooltip");
  let tooltipTimeout = null;
  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.id = "tool-tooltip";
    tooltipEl.className = "tool-tooltip";
    document.body.appendChild(tooltipEl);
  }

  // Hover events on the tooltip itself to support persistent interaction
  tooltipEl.addEventListener("mouseenter", () => {
    clearTimeout(tooltipTimeout);
  });

  tooltipEl.addEventListener("mouseleave", () => {
    tooltipTimeout = setTimeout(() => {
      tooltipEl.classList.remove("show");
    }, 150);
  });

  // Dynamic outside click dismissal for tooltip (crucial for mobile tap-to-open)
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".tool-pill") && !e.target.closest("#tool-tooltip")) {
      tooltipEl.classList.remove("show");
    }
  });

  // Track coordinates configuration for Canvas View
  // Vertical offsets based on tracks to avoid overlaps
  const trackYOffsets = {
    fundamentals: 80,   // Top area - new
    research: 200,      // Upper area - new
    planning: 320,      // Mid-upper area - new
    stack: 440,         // Mid area
    engineering: 560,   // Mid-lower area
    workflow: 680,      // Lower-mid area
    product: 800        // Bottom area
  };

  // Horizontal offsets based on levels
  const levelXOffsets = {
    L_Insights: 150,
    L0: 580,
    L1: 1010,
    L2: 1440,
    L3: 1870,
    L4: 2300,
    L5: 2730,
    L6: 3160,
    L7: 3590,
    L8: 4020
  };

  // Define connection paths (relationships)
  const connectionsList = [
    // L_Insights -> L0 / L1 (Theoretical Insights into Product validation)
    { from: "lkey_philosophy", to: "l0_3_mvp_philosophy" },
    { from: "lkey_philosophy", to: "l0_5_early_adoption" },
    { from: "lkey_security", to: "l0_1_pmf_basics" },
    { from: "lkey_architecture", to: "l1_2_value_proposition" },
    { from: "lkey_prompting", to: "l0_2_custdev" },
    { from: "lkey_context", to: "l1_3_user_stories" },
    { from: "lkey_design", to: "l0_3_mvp_philosophy" },

    // L0 -> L1 (Fundamentals & Product Validation)
    { from: "l0_1_pmf_basics", to: "l1_1_market_research" },
    { from: "l0_1_pmf_basics", to: "l1_2_value_proposition" },
    { from: "l0_2_custdev", to: "l1_1_market_research" },
    { from: "l0_2_custdev", to: "l1_3_user_stories" },
    { from: "l0_3_mvp_philosophy", to: "l1_2_value_proposition" },
    { from: "l0_3_mvp_philosophy", to: "l1_4_roadmap_planning" },
    { from: "l0_4_do_things_not_scale", to: "l1_4_roadmap_planning" },
    { from: "l0_5_early_adoption", to: "l1_2_value_proposition" },

    // L1 -> L2 (Research and Roadmap to AI Roles/Quality)
    { from: "l1_1_market_research", to: "l2_1_human_ai_roles" },
    { from: "l1_2_value_proposition", to: "l2_1_human_ai_roles" },
    { from: "l1_2_value_proposition", to: "l2_9_database_safety" },
    { from: "l1_3_user_stories", to: "l2_3_iterative_development" },
    { from: "l1_3_user_stories", to: "l2_6_golden_rule_prompting" },
    { from: "l1_3_user_stories", to: "l2_7_prompt_types" },
    { from: "l1_3_user_stories", to: "l2_8_prompt_language" },
    { from: "l1_4_roadmap_planning", to: "l2_4_context_preservation" },
    { from: "l1_4_roadmap_planning", to: "l2_2_anti_slop" },
    { from: "l1_4_roadmap_planning", to: "l2_5_project_architecture" },

    // L2 -> L3 (Human-AI loop to Local Workspace Setup)
    { from: "l2_1_human_ai_roles", to: "l3_1_vscode" },
    { from: "l2_1_human_ai_roles", to: "l3_4_skills" },
    { from: "l2_1_human_ai_roles", to: "l3_8_ai_models" },
    { from: "l2_2_anti_slop", to: "l3_2_claude_cli" },
    { from: "l2_3_iterative_development", to: "l3_3_project_memory" },
    { from: "l2_4_context_preservation", to: "l3_3_project_memory" },
    { from: "l2_4_context_preservation", to: "l3_5_prompt_caching" },
    { from: "l2_5_project_architecture", to: "l3_3_project_memory" },
    { from: "l2_6_golden_rule_prompting", to: "l3_1_vscode" },
    { from: "l2_7_prompt_types", to: "l3_5_prompt_caching" },
    { from: "l2_8_prompt_language", to: "l3_6_terminal_cli" },
    { from: "l2_9_database_safety", to: "l3_6_terminal_cli" },

    // L3 -> L4 (Local Environment to Control & Git Versioning)
    { from: "l3_1_vscode", to: "l4_1_private_git" },
    { from: "l3_2_claude_cli", to: "l4_4_diff_control" },
    { from: "l3_2_claude_cli", to: "l4_2_gitignore" },
    { from: "l3_3_project_memory", to: "l4_3_feature_branches" },
    { from: "l3_4_skills", to: "l4_3_feature_branches" },
    { from: "l3_5_prompt_caching", to: "l4_5_release_tags" },
    { from: "l3_8_ai_models", to: "l4_1_private_git" },

    // L4 -> L5 (Git Controls to Executive Autonomous Planning)
    { from: "l4_1_private_git", to: "l5_1_autonomous_planning" },
    { from: "l4_2_gitignore", to: "l5_3_claude_md_auto" },
    { from: "l4_3_feature_branches", to: "l5_6_handoff_protocol" },
    { from: "l4_4_diff_control", to: "l5_1_autonomous_planning" },
    { from: "l4_4_diff_control", to: "l5_4_context_management" },
    { from: "l4_5_release_tags", to: "l5_2_meta_prompting" },
    { from: "l4_5_release_tags", to: "l5_5_persona_testing" },

    // L5 -> L6 (Autonomous Planning to Rapid No-Code Prototyping)
    { from: "l5_1_autonomous_planning", to: "l6_1_bolt_lovable" },
    { from: "l5_2_meta_prompting", to: "l6_1_bolt_lovable" },
    { from: "l5_3_claude_md_auto", to: "l6_3_nocode_integrations" },
    { from: "l5_4_context_management", to: "l6_2_sheets_db" },
    { from: "l5_5_persona_testing", to: "l6_4_pmf_validation" },
    { from: "l5_6_handoff_protocol", to: "l6_1_bolt_lovable" },
    { from: "l5_6_handoff_protocol", to: "l6_4_pmf_validation" },

    // L6 -> L7 (No-code / Prototype to Professional Code Stack)
    { from: "l6_1_bolt_lovable", to: "l7_1_porting_vsc" },
    { from: "l6_1_bolt_lovable", to: "l7_2_modular_architecture" },
    { from: "l6_1_bolt_lovable", to: "l7_7_design_systems" },
    { from: "l6_2_sheets_db", to: "l7_3_postgres_neon" },
    { from: "l6_3_nocode_integrations", to: "l7_4_staging_railway" },
    { from: "l6_4_pmf_validation", to: "l7_5_sandbox_payments" },
    { from: "l6_4_pmf_validation", to: "l7_6_api_standards" },

    // L7 -> L8 (Professional Coding to Multi-Agent Orchestration)
    { from: "l7_1_porting_vsc", to: "l8_1_swarm_workflow" },
    { from: "l7_2_modular_architecture", to: "l8_1_swarm_workflow" },
    { from: "l7_3_postgres_neon", to: "l8_4_rag_memory" },
    { from: "l7_4_staging_railway", to: "l8_3_subagents_orchestration" },
    { from: "l7_5_sandbox_payments", to: "l8_2_playwright_testing" },
    { from: "l7_6_api_standards", to: "l8_3_subagents_orchestration" },
    { from: "l7_7_design_systems", to: "l8_2_playwright_testing" },

    // New Custom Connections for updates
    { from: "l3_8_ai_models", to: "l3_10_skills_customization" },
    { from: "l3_8_ai_models", to: "l3_11_github_prompts" },
    { from: "l3_9_railway", to: "l7_4_staging_railway" },
    { from: "l3_10_skills_customization", to: "l4_3_feature_branches" },
    { from: "l4_8_api_restaurant", to: "l7_6_api_standards" },
    { from: "l4_8_api_restaurant", to: "l4_9_stack_selection" },
    { from: "l7_4_staging_railway", to: "l8_8_mcp" },
    { from: "l7_6_api_standards", to: "l8_8_mcp" },
    { from: "l8_8_mcp", to: "l8_9_skills_cookbook" },
    { from: "l4_9_stack_selection", to: "l4_10_reusable_blocks" },
    { from: "l7_9_security_headers", to: "l7_10_testing_principles" },
    { from: "l8_9_skills_cookbook", to: "l8_10_agent_customization" },

    // Milestone 6 Connections
    { from: "l2_9_database_safety", to: "l2_10_ai_lies" },
    { from: "l2_10_ai_lies", to: "l2_11_nullable_fields" },
    { from: "l2_11_nullable_fields", to: "l2_12_validation_agent" },
    { from: "l2_8_prompt_language", to: "l2_13_decomposition" },
    { from: "l2_13_decomposition", to: "l2_14_ai_books" },
    { from: "l2_12_validation_agent", to: "l2_15_security_hook" },
    { from: "l2_15_security_hook", to: "l2_16_smart_testing" },
    { from: "l2_16_smart_testing", to: "l2_17_nightly_tests" },
    { from: "l0_5_early_adoption", to: "l0_6_savings_metrics" },
    { from: "l0_6_savings_metrics", to: "l0_7_tools_cost" },

    // Milestone 14 Connections (Prisma, DB Providers, Vercel)
    { from: "l5_6_handoff_protocol", to: "l5_7_prisma_vibecoding" },
    { from: "l5_7_prisma_vibecoding", to: "l5_8_db_providers" },
    { from: "l5_8_db_providers", to: "l7_3_postgres_neon" },
    { from: "l7_4_staging_railway", to: "l7_11_vercel_gold" },
    { from: "l7_11_vercel_gold", to: "l8_1_swarm_workflow" }
  ];

  // Specific visual weights for Bento cards
  const bentoWeights = {
    l3_2_claude_cli: "weight-medium",
    l3_4_skills: "weight-medium",
    l3_9_railway: "weight-medium",
    l3_10_skills_customization: "weight-medium",
    l3_11_github_prompts: "weight-medium",
    l4_4_diff_control: "weight-medium",
    l4_8_api_restaurant: "weight-medium",
    l4_9_stack_selection: "weight-medium",
    l5_1_autonomous_planning: "weight-medium",
    l5_5_persona_testing: "weight-medium",
    l6_1_bolt_lovable: "weight-large",
    l7_2_modular_architecture: "weight-medium",
    l7_3_postgres_neon: "weight-large",
    l7_4_staging_railway: "weight-medium",
    l8_1_swarm_workflow: "weight-large",
    l8_4_rag_memory: "weight-medium",
    l8_8_mcp: "weight-medium",
    l8_9_skills_cookbook: "weight-medium",
    l4_10_reusable_blocks: "weight-medium",
    l7_10_testing_principles: "weight-medium",
    l8_10_agent_customization: "weight-medium",

    // Milestone 6 Bento weights
    l2_10_ai_lies: "weight-medium",
    l2_11_nullable_fields: "weight-medium",
    l2_12_validation_agent: "weight-medium",
    l2_13_decomposition: "weight-medium",
    l2_14_ai_books: "weight-medium",
    l2_15_security_hook: "weight-medium",
    l2_16_smart_testing: "weight-medium",
    l2_17_nightly_tests: "weight-medium",
    l0_6_savings_metrics: "weight-medium",
    l0_7_tools_cost: "weight-medium",

    // Milestone 14 Bento Weights
    l5_7_prisma_vibecoding: "weight-medium",
    l5_8_db_providers: "weight-medium",
    l7_11_vercel_gold: "weight-medium"
  };

  // 2. Initialize Renders
  function init() {
    renderBentoGrid();
    renderCanvasNodes();
    drawCanvasConnections();
    setupCanvasTransforms();
    setupEventListeners();
    
    // Restore state from LocalStorage
    updateProgressTracker();
    updateNodeVisualStates();
    
    // Trigger Lucide icons init
    lucide.createIcons();
  }

  // 3. Render Bento Grid
  function renderBentoGrid() {
    bentoGrid.innerHTML = "";
    
    // Group nodes by Level
    const nodesByLevel = {};
    Object.keys(levels).forEach(lvl => {
      nodesByLevel[lvl] = nodes.filter(n => n.level === lvl);
    });

    Object.keys(levels).forEach(levelId => {
      const levelInfo = levels[levelId];
      const levelNodes = nodesByLevel[levelId];
      
      if (!levelNodes || levelNodes.length === 0) return;

      // Calculate progress for this level
      const lvlNodes = nodesByLevel[levelId];
      const totalInLevel = lvlNodes.length;
      const completedInLevel = lvlNodes.filter(n => completedNodes.has(n.id)).length;
      const levelPercentage = totalInLevel > 0 ? Math.round((completedInLevel / totalInLevel) * 100) : 0;

      // Add Level Section Header
      const headerDiv = document.createElement("div");
      headerDiv.className = "bento-level-header clickable-header";
      headerDiv.dataset.level = levelId;
      headerDiv.innerHTML = `
        <div class="level-header-content">
          <div class="level-header-left">
            <h2><i data-lucide="award"></i> <span>${levelInfo.title}</span></h2>
            <p>${levelInfo.desc}</p>
          </div>
          <div class="level-header-right">
            <div class="level-progress-indicator">
              <img src="docs/hand.png" alt="Touch" class="finger-tap-animated-icon" />
              <div class="level-progress-compact">
                <span class="progress-text">${completedInLevel}/${totalInLevel} (${levelPercentage}%)</span>
                <div class="progress-bar-mini">
                  <div class="progress-bar-mini-fill" style="width: ${levelPercentage}%;"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      headerDiv.addEventListener("click", () => openLevelDrawer(levelId));
      bentoGrid.appendChild(headerDiv);

      // Add Nodes in Level
      levelNodes.forEach(node => {
        const trackInfo = tracks[node.track];
        const weightClass = bentoWeights[node.id] || "";
        const isCompleted = completedNodes.has(node.id);
        
        const card = document.createElement("div");
        card.className = `bento-card ${weightClass}`;
        card.id = `bento-card-${node.id}`;
        card.dataset.id = node.id;
        card.dataset.level = node.level;
        card.dataset.track = node.track;
        card.style.setProperty("--track-color", trackInfo.color);
        card.style.setProperty("--card-glow", `rgba(${hexToRgb(trackInfo.color)}, 0.05)`);
        card.style.setProperty("--card-glow-shadow", `rgba(${hexToRgb(trackInfo.color)}, 0.12)`);
        card.style.setProperty("--border-color-glow", `rgba(${hexToRgb(trackInfo.color)}, 0.3)`);

        card.innerHTML = `
          <div class="card-top">
            <div class="card-meta">
              <span class="card-level">${node.level}</span>
              <label class="custom-checkbox-container" onclick="event.stopPropagation();">
                <input type="checkbox" class="node-checkbox" data-id="${node.id}" ${isCompleted ? 'checked' : ''}>
                <span class="checkbox-checkmark"></span>
              </label>
            </div>
            <h3>${node.title}</h3>
            <p class="card-desc">${node.shortDesc}</p>
          </div>
          <div class="card-footer">
            <span class="card-track-title">${trackInfo.title}</span>
            <span class="card-action-icon">
              <i data-lucide="arrow-up-right"></i>
            </span>
          </div>
        `;

        card.addEventListener("click", () => openDrawer(node.id));
        bentoGrid.appendChild(card);

        const checkbox = card.querySelector(".node-checkbox");
        checkbox.addEventListener("change", (e) => {
          toggleNodeCompletion(node.id, e.target.checked);
        });
      });
    });
  }

  // Helper for colors
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
      `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` 
      : '255, 255, 255';
  }

  // 4. Render Canvas Nodes
  function renderCanvasNodes() {
    canvasNodesContainer.innerHTML = "";
    
    // Group and sort nodes by level to determine vertical alignment
    const levelNodesMap = {};
    Object.keys(levels).forEach(lvl => {
      levelNodesMap[lvl] = nodes.filter(n => n.level === lvl);
      // Sort nodes inside the level so that they flow from top to bottom by track sequence
      const trackOrder = ["stack", "engineering", "workflow", "product"];
      levelNodesMap[lvl].sort((a, b) => trackOrder.indexOf(a.track) - trackOrder.indexOf(b.track));
    });

    Object.keys(levels).forEach(lvl => {
      const levelNodes = levelNodesMap[lvl];
      const count = levelNodes.length;
      
      // Calculate vertical spacing with a clean, compact gap to keep vertical distances small
      const startY = 55;
      const gap = 160;

      // Add column header above the column
      if (count > 0) {
         const headerEl = document.createElement("div");
        headerEl.className = "canvas-column-header";
        headerEl.dataset.level = lvl;
        
        // Position at: x center of column = levelXOffsets[lvl] - 20; y = 15;
        const leftPos = levelXOffsets[lvl] - 20;
        headerEl.style.left = `${leftPos}px`;
        headerEl.style.top = `15px`;
        
        headerEl.innerHTML = `
          <div class="column-header-content">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="header-icon"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
            <h3>${levels[lvl].title}</h3>
          </div>
        `;
        canvasNodesContainer.appendChild(headerEl);
      }

      levelNodes.forEach((node, idx) => {
        const trackInfo = tracks[node.track];
        const isCompleted = completedNodes.has(node.id);
        
        let x = levelXOffsets[node.level];
        // Calculate smooth staggered vertical position
        let y = startY + idx * gap;

        // Apply a subtle premium horizontal stagger (alternating +/- 25px) to make the connection paths flow organically
        if (idx % 2 === 1) {
          x += 25;
        } else {
          x -= 15;
        }

        // Store resolved coords back to node object for path drawing
        node.canvasX = x;
        node.canvasY = y;

        const nodeEl = document.createElement("div");
        nodeEl.className = "canvas-node";
        nodeEl.id = `canvas-node-${node.id}`;
        nodeEl.dataset.id = node.id;
        nodeEl.dataset.level = node.level;
        nodeEl.dataset.track = node.track;
        
        nodeEl.style.left = `${x}px`;
        nodeEl.style.top = `${y}px`;
        nodeEl.style.setProperty("--track-color", trackInfo.color);
        nodeEl.style.setProperty("--glow-color", `rgba(${hexToRgb(trackInfo.color)}, 0.12)`);
        nodeEl.style.setProperty("--glow-color-solid", trackInfo.color);

        nodeEl.innerHTML = `
          <div class="node-header-canvas">
            <span class="node-level-canvas">${node.level}</span>
            <label class="custom-checkbox-container" onclick="event.stopPropagation();">
              <input type="checkbox" class="node-checkbox" data-id="${node.id}" ${isCompleted ? 'checked' : ''}>
              <span class="checkbox-checkmark"></span>
            </label>
          </div>
          <h4>${node.title}</h4>
          <p>${node.shortDesc}</p>
        `;

        nodeEl.addEventListener("click", (e) => {
          e.stopPropagation();
          openDrawer(node.id);
          
          // Select visually
          document.querySelectorAll(".canvas-node").forEach(n => n.classList.remove("selected"));
          nodeEl.classList.add("selected");
        });

        canvasNodesContainer.appendChild(nodeEl);

        const checkbox = nodeEl.querySelector(".node-checkbox");
        checkbox.addEventListener("change", (e) => {
          toggleNodeCompletion(node.id, e.target.checked);
        });
      });
    });
  }

  // 5. Draw Canvas connections
  function drawCanvasConnections() {
    svgConnections.innerHTML = "";
    
    // Inject SVG marker defs so arrowheads render correctly
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = `
      <marker id="arrow-incomplete" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="rgba(249, 115, 22, 0.65)" />
      </marker>
      <marker id="arrow-completed" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="rgba(16, 185, 129, 0.85)" />
      </marker>
    `;
    svgConnections.appendChild(defs);
    
    connectionsList.forEach((conn) => {
      const fromNode = nodes.find(n => n.id === conn.from);
      const toNode = nodes.find(n => n.id === conn.to);
      
      if (!fromNode || !toNode) return;

      // Card size in canvas: width: 240px, approx height: 90px
      // Pin connectors: right center of 'from' -> left center of 'to'
      const startX = fromNode.canvasX + 240;
      const startY = fromNode.canvasY + 45;
      
      const endX = toNode.canvasX - 6; // pull back slightly so arrowhead points exactly to the border!
      const endY = toNode.canvasY + 45;

      // Draw gorgeous horizontal bezier curve (Figma-like)
      const dx = Math.abs(endX - startX) * 0.5;
      const pathData = `M ${startX} ${startY} C ${startX + dx} ${startY}, ${endX - dx} ${endY}, ${endX} ${endY}`;

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", pathData);
      path.setAttribute("class", "connection-path");
      path.setAttribute("id", `conn-path-${fromNode.id}-${toNode.id}`);
      path.dataset.from = fromNode.id;
      path.dataset.to = toNode.id;
      
      const isFromCompleted = completedNodes.has(fromNode.id);
      
      if (isFromCompleted) {
        path.style.stroke = "rgba(16, 185, 129, 0.8)";
        path.style.strokeWidth = "2.5px";
        path.setAttribute("marker-end", "url(#arrow-completed)");
      } else {
        path.style.stroke = "rgba(249, 115, 22, 0.5)";
        path.style.strokeWidth = "2px";
        path.setAttribute("marker-end", "url(#arrow-incomplete)");
      }
      
      svgConnections.appendChild(path);
    });
  }

  // 6. Setup Zoom and Pan on Canvas
  function setupCanvasTransforms() {
    updateCanvasTransforms();

    // Mouse drag pan logic
    mapViewport.addEventListener("mousedown", (e) => {
      // Allow dragging only when clicking viewport directly or connection line area
      if (e.target !== mapViewport && e.target !== svgConnections && !e.target.classList.contains("map-canvas")) return;
      isDragging = true;
      startX = e.clientX - panX;
      startY = e.clientY - panY;
      mapViewport.style.cursor = "grabbing";
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      panX = e.clientX - startX;
      panY = e.clientY - startY;
      updateCanvasTransforms();
    });

    window.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        mapViewport.style.cursor = "grab";
      }
    });

    // Zoom on mouse wheel
    mapViewport.addEventListener("wheel", (e) => {
      e.preventDefault();
      const zoomFactor = 1.033;
      
      // Rect of viewport
      const rect = mapViewport.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Coordinates relative to canvas before zoom
      const canvasMouseX = (mouseX - panX) / scale;
      const canvasMouseY = (mouseY - panY) / scale;

      if (e.deltaY < 0) {
        // Zoom In
        scale = Math.min(scale * zoomFactor, 2.0);
      } else {
        // Zoom Out
        scale = Math.max(scale / zoomFactor, 0.4);
      }

      // New pan offsets to keep cursor point fixed
      panX = mouseX - canvasMouseX * scale;
      panY = mouseY - canvasMouseY * scale;

      updateCanvasTransforms();
    });
  }

  function updateCanvasTransforms() {
    mapCanvas.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
    window.panX = panX;
    window.panY = panY;
    window.scale = scale;
  }

  // Fit/Zoom Actions
  zoomInBtn.addEventListener("click", () => {
    scale = Math.min(scale * 1.2, 2.0);
    updateCanvasTransforms();
  });

  zoomOutBtn.addEventListener("click", () => {
    scale = Math.max(scale / 1.2, 0.4);
    updateCanvasTransforms();
  });

  zoomFitBtn.addEventListener("click", () => {
    // Reset view
    scale = 0.8;
    panX = 50;
    panY = 60;
    updateCanvasTransforms();
  });

  // 7. Filters & Search Logic
  function applyFilters() {
    const query = searchQuery.toLowerCase().trim();
    
    // 1. Filter nodes
    nodes.forEach(node => {
      const matchSearch = 
        node.title.toLowerCase().includes(query) || 
        node.shortDesc.toLowerCase().includes(query) ||
        node.tools.some(t => t.toLowerCase().includes(query)) ||
        node.steps.some(s => s.toLowerCase().includes(query));
      
      const matchLevel = currentLevelFilter === "all" || node.level === currentLevelFilter;
      const matchTrack = currentTrackFilter === "all" || node.track === currentTrackFilter;
      
      const isVisible = matchSearch && matchLevel && matchTrack;
      const isDimmed = !isVisible && query.length > 0; // dim if search does not match

      // Update Bento Cards
      const bentoCard = document.getElementById(`bento-card-${node.id}`);
      if (bentoCard) {
        if (isVisible) {
          bentoCard.classList.remove("hidden", "dimmed");
        } else if (isDimmed) {
          bentoCard.classList.add("dimmed");
          bentoCard.classList.remove("hidden");
        } else {
          bentoCard.classList.add("hidden");
        }
      }

      // Update Canvas Nodes
      const canvasNode = document.getElementById(`canvas-node-${node.id}`);
      if (canvasNode) {
        if (isVisible) {
          canvasNode.classList.remove("hidden", "dimmed");
        } else if (isDimmed) {
          canvasNode.classList.add("dimmed");
          canvasNode.classList.remove("hidden");
        } else {
          canvasNode.classList.add("hidden");
        }
      }
    });

    // 2. Dim Level Header Blocks in Bento View if they have no visible child nodes
    document.querySelectorAll(".bento-level-header").forEach(header => {
      const lvl = header.dataset.level;
      const visibleChild = document.querySelector(`.bento-card[data-level="${lvl}"]:not(.hidden)`);
      if (!visibleChild) {
        header.style.display = "none";
      } else {
        header.style.display = "block";
      }
    });

    // Dim Canvas Column Headers if they have no visible child nodes
    document.querySelectorAll(".canvas-column-header").forEach(header => {
      const lvl = header.dataset.level;
      const visibleChild = document.querySelector(`.canvas-node[data-level="${lvl}"]:not(.hidden)`);
      if (!visibleChild) {
        header.style.display = "none";
      } else {
        header.style.display = "block";
      }
    });

    // 3. Highlight/Dim SVG Connection lines
    document.querySelectorAll(".connection-path").forEach(path => {
      const fromId = path.dataset.from;
      const toId = path.dataset.to;

      const fromNodeEl = document.getElementById(`canvas-node-${fromId}`);
      const toNodeEl = document.getElementById(`canvas-node-${toId}`);

      const fromVisible = fromNodeEl && !fromNodeEl.classList.contains("hidden") && !fromNodeEl.classList.contains("dimmed");
      const toVisible = toNodeEl && !toNodeEl.classList.contains("hidden") && !toNodeEl.classList.contains("dimmed");

      if (fromVisible && toVisible) {
        path.style.opacity = "1";
        // Highlight active connections during active searches
        if (query.length > 0) {
          path.classList.add("active");
          const fromNode = nodes.find(n => n.id === fromId);
          const isFromCompleted = completedNodes.has(fromNode.id);
          path.style.stroke = isFromCompleted ? "#10b981" : "#f97316";
          path.style.strokeWidth = "3";
        } else {
          path.classList.remove("active");
          const fromNode = nodes.find(n => n.id === fromId);
          const isFromCompleted = completedNodes.has(fromNode.id);
          path.style.stroke = isFromCompleted ? "rgba(16, 185, 129, 0.8)" : "rgba(249, 115, 22, 0.5)";
          path.style.strokeWidth = "2";
        }
      } else {
        path.style.opacity = "0.05";
        path.classList.remove("active");
        path.style.strokeWidth = "2";
      }
    });

    // Auto-center canvas on filtered/searched nodes
    centerCanvasOnFilteredNodes();
  }

  // 8. Event Listeners Setup
  function setupEventListeners() {
    // Search input (guarded for safety if search elements are removed)
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        if (clearSearchBtn) {
          if (searchQuery.length > 0) {
            clearSearchBtn.style.display = "block";
          } else {
            clearSearchBtn.style.display = "none";
          }
        }
        applyFilters();
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener("click", () => {
        if (searchInput) searchInput.value = "";
        searchQuery = "";
        clearSearchBtn.style.display = "none";
        applyFilters();
      });
    }

    // Level filters
    levelFilters.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      
      levelFilters.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      currentLevelFilter = btn.dataset.level;
      applyFilters();
    });

    // Track filters
    trackFilters.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      
      trackFilters.querySelectorAll(".filter-btn").forEach(b => {
        b.classList.remove("active");
        b.style.removeProperty("--btn-active-bg");
        b.style.removeProperty("--btn-active-border");
      });
      
      btn.classList.add("active");
      currentTrackFilter = btn.dataset.track;

      if (currentTrackFilter !== "all") {
        const color = btn.dataset.color;
        btn.style.setProperty("--btn-active-bg", `rgba(${hexToRgb(color)}, 0.25)`);
        btn.style.setProperty("--btn-active-border", color);
      }
      
      applyFilters();
    });

    // View toggling
    toggleBentoBtn.addEventListener("click", () => {
      if (activeView === "bento") return;
      activeView = "bento";
      toggleBentoBtn.classList.add("active");
      toggleCanvasBtn.classList.remove("active");
      
      bentoView.classList.add("active");
      canvasView.classList.remove("active");
      
      applyFilters();
    });

    toggleCanvasBtn.addEventListener("click", () => {
      if (activeView === "canvas") return;
      activeView = "canvas";
      toggleCanvasBtn.classList.add("active");
      toggleBentoBtn.classList.remove("active");
      
      canvasView.classList.add("active");
      bentoView.classList.remove("active");
      
      // Redraw SVG lines on display since display:block is now active
      setTimeout(() => {
        drawCanvasConnections();
        applyFilters();
      }, 50);
    });

    // Close drawer actions
    closeDrawerBtn.addEventListener("click", closeDrawer);
    drawerOverlay.addEventListener("click", closeDrawer);
    
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeDrawer();
    });

    // Reset progress action
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("Вы уверены, что хотите сбросить весь прогресс обучения?")) {
          completedNodes.clear();
          completedSteps.clear();
          saveState();
          
          // Re-render views
          renderBentoGrid();
          renderCanvasNodes();
          
          // Sync drawer if open
          if (sideDrawer.classList.contains("active")) {
            const activeDrawerNodeId = document.getElementById("drawer-title").dataset.activeNodeId;
            const activeNode = nodes.find(n => n.id === activeDrawerNodeId);
            if (activeNode) {
              renderDrawerSteps(activeNode);
            }
          }
        }
      });
    }

    // Master checkbox action
    const masterCheckbox = document.getElementById("master-steps-checkbox");
    if (masterCheckbox) {
      masterCheckbox.addEventListener("change", (e) => {
        const activeDrawerNodeId = document.getElementById("drawer-title").dataset.activeNodeId;
        const node = nodes.find(n => n.id === activeDrawerNodeId);
        if (!node) return;

        const isChecked = e.target.checked;
        
        // Update completedSteps status for all steps in the current node
        node.steps.forEach((_, idx) => {
          const stepId = `${node.id}_step_${idx}`;
          if (isChecked) {
            completedSteps.add(stepId);
          } else {
            completedSteps.delete(stepId);
          }
        });

        // Toggle the node completion status
        if (isChecked) {
          completedNodes.add(node.id);
        } else {
          completedNodes.delete(node.id);
        }

        saveState();

        // Refresh steps inside the drawer
        renderDrawerSteps(node);

        // Sync node checkboxes across Bento Grid and Canvas Mindmap
        const syncCheckboxes = document.querySelectorAll(`.node-checkbox[data-id="${node.id}"]`);
        syncCheckboxes.forEach(cb => {
          cb.checked = isChecked;
        });
      });
    }
  }

  function openDrawer(nodeId) {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    // Toggle container display
    document.getElementById("drawer-content-node").style.display = "block";
    document.getElementById("drawer-content-level").style.display = "none";

    const trackInfo = tracks[node.track];

    // Populate drawer elements
    const drawerTitle = document.getElementById("drawer-title");
    drawerTitle.innerText = node.title;
    drawerTitle.dataset.activeNodeId = nodeId;
    
    document.getElementById("drawer-description").innerText = node.shortDesc;
    document.getElementById("drawer-level").innerText = `УРОВЕНЬ ${node.level}`;

    // Track badge styling
    const trackTag = document.getElementById("drawer-track-tag");
    trackTag.innerText = trackInfo.title;
    trackTag.style.borderColor = trackInfo.color;
    trackTag.style.color = trackInfo.color;
    trackTag.style.background = `rgba(${hexToRgb(trackInfo.color)}, 0.05)`;

    // Steps list rendering
    renderDrawerSteps(node);

    // Tools list rendering
    const toolsContainer = document.getElementById("drawer-tools");
    toolsContainer.innerHTML = "";
    node.tools.forEach(tool => {
      // Only add if we have tooltip data for this tool
      const toolData = toolsDatabase[tool];
      if (toolData) {
        const toolPill = document.createElement("div");
        toolPill.className = "tool-pill";

        const nameSpan = document.createElement("span");
        nameSpan.className = "tool-pill-name";
        nameSpan.innerText = tool;

        toolPill.appendChild(nameSpan);

        // Function to populate and show tooltip
        const showTooltip = () => {
          clearTimeout(tooltipTimeout);

          tooltipEl.innerHTML = `
            <h4>${tool}</h4>
            <div class="tool-tooltip-desc">${toolData.desc}</div>
            <div class="tool-tooltip-section">
              <div class="tool-tooltip-section-title">Установка / Подготовка</div>
              <div class="tool-tooltip-section-content">${toolData.setup}</div>
            </div>
            <div class="tool-tooltip-section">
              <div class="tool-tooltip-section-title">Запуск / Применение</div>
              <div class="tool-tooltip-section-content">${toolData.run}</div>
            </div>
          `;

          tooltipEl.classList.add("show");
          positionTooltipBelow(toolPill);
        };

        // Bind hover events to show tooltip
        toolPill.addEventListener("mouseenter", (e) => {
          showTooltip();
        });

        toolPill.addEventListener("mouseleave", () => {
          tooltipTimeout = setTimeout(() => {
            tooltipEl.classList.remove("show");
          }, 150);
        });

        // Click / Touch support (especially for mobile)
        toolPill.addEventListener("click", (e) => {
          e.stopPropagation();
          showTooltip();
        });

        toolsContainer.appendChild(toolPill);
      }
    });

    // Draw visual highlighter on canvas connections
    highlightNodeConnections(nodeId);

    // Open side panel
    sideDrawer.classList.add("active");
    drawerOverlay.classList.add("active");
  }

  function openLevelDrawer(levelId) {
    const lvl = levels[levelId];
    if (!lvl) return;

    // Toggle container display
    document.getElementById("drawer-content-node").style.display = "none";
    const levelContainer = document.getElementById("drawer-content-level");
    levelContainer.style.display = "block";

    // Set drawer header tag
    const trackTag = document.getElementById("drawer-track-tag");
    trackTag.innerText = "📚 ОБЗОР УРОВНЯ";
    trackTag.style.borderColor = "var(--accent-purple)";
    trackTag.style.color = "var(--accent-purple)";
    trackTag.style.background = "rgba(139, 92, 246, 0.05)";

    // Set level container inner HTML to a gorgeous premium template
    // Build Concepts List
    let conceptsHtml = "";
    lvl.concepts.forEach(concept => {
      conceptsHtml += `
        <div class="level-concept-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-purple)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="concept-icon"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <span>${concept}</span>
        </div>
      `;
    });

    // Build Checklist Items (with completion status per level!)
    const lvlNodes = nodes.filter(n => n.level === levelId);
    const totalNodes = lvlNodes.length;
    const completedInLvl = lvlNodes.filter(n => completedNodes.has(n.id)).length;
    const percentage = totalNodes > 0 ? Math.round((completedInLvl / totalNodes) * 100) : 0;

    let checklistHtml = "";
    lvl.checklist.forEach((item, index) => {
      const storageKey = `lvl_check_${levelId}_${index}`;
      const isChecked = localStorage.getItem(storageKey) === "true" ? "checked" : "";
      
      checklistHtml += `
        <li class="level-checklist-item">
          <label class="custom-checkbox-container">
            <input type="checkbox" class="level-checklist-checkbox" data-key="${storageKey}" ${isChecked}>
            <span class="checkbox-checkmark" style="--card-accent: var(--accent-emerald);"></span>
          </label>
          <span class="checklist-text">${item}</span>
        </li>
      `;
    });

    // Build Pro-Tips grid
    let tipsHtml = "";
    lvl.tips.forEach(tip => {
      tipsHtml += `
        <div class="level-tip-card">
          <div class="tip-card-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-emerald)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="tip-icon"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .5 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
            <strong>СОВЕТ ЭКСПЕРТА</strong>
          </div>
          <p>${tip}</p>
        </div>
      `;
    });

    // Build resources list
    let resourcesHtml = "";
    lvl.resources.forEach(res => {
      resourcesHtml += `
        <a href="${res.link}" target="_blank" class="level-resource-link">
          <div class="resource-info">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="resource-icon"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            <span>${res.text}</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="external-icon"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
      `;
    });

    levelContainer.innerHTML = `
      <div class="drawer-title-area">
        <h2 class="drawer-title">${lvl.title}</h2>
      </div>

      <p class="drawer-desc" style="margin-bottom: 24px;">${lvl.desc}</p>

      <!-- Goal & Philosophy Card -->
      <div class="level-card level-goal-card">
        <div class="level-card-inner">
          <div class="level-goal-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-emerald)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="goal-icon"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
            <span>ГЛАВНАЯ ЦЕЛЬ УРОВНЯ</span>
          </div>
          <p class="level-goal-text">${lvl.goal}</p>
          
          <div class="level-divider"></div>
          
          <div class="level-goal-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-emerald)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="goal-icon"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .5 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
            <span>ФИЛОСОФИЯ</span>
          </div>
          <p class="level-goal-text italic-text">${lvl.philosophy}</p>
        </div>
      </div>


      <!-- Key Concepts Grid -->
      <div class="level-drawer-section">
        <h3>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="section-icon"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-4.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-4.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2Z"/></svg>
          Ключевые концепции уровня
        </h3>
        <div class="level-concepts-grid">
          ${conceptsHtml}
        </div>
      </div>

      <!-- Level Completion Checklist -->
      <div class="level-drawer-section">
        <h3>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="section-icon"><polyline points="9 11 12 14 22 4"/><path d="M21-12v7a5 5 0 0 1-5 5H4a5 5 0 0 1-5-5V4a5 5 0 0 1 5-5h12"/></svg>
          Требования к освоению
        </h3>
        <ul class="level-checklist">
          ${checklistHtml}
        </ul>
      </div>

      <!-- Pro Tips & Warnings -->
      <div class="level-drawer-section">
        <h3>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="section-icon"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Рекомендации и Лайфхаки
        </h3>
        <div class="level-tips-container">
          ${tipsHtml}
        </div>
      </div>

      <!-- Study Resources -->
      <div class="level-drawer-section" style="margin-bottom: 40px;">
        <h3>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="section-icon"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>
          Учебные материалы и ссылки
        </h3>
        <div class="level-resources-grid">
          ${resourcesHtml}
        </div>
      </div>
    `;

    // Process checkboxes dynamically to store checked states
    levelContainer.querySelectorAll(".level-checklist-checkbox").forEach(chk => {
      chk.addEventListener("change", (e) => {
        localStorage.setItem(e.target.dataset.key, e.target.checked);
      });
    });

    // Re-initialize Lucide Icons for dynamic content
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Open side panel
    sideDrawer.classList.add("active");
    drawerOverlay.classList.add("active");
  }

  function positionTooltipBelow(target) {
    const rect = target.getBoundingClientRect();
    tooltipEl.style.top = "-9999px";
    tooltipEl.style.left = "-9999px";
    // Read size after forced reflow
    const tooltipRect = tooltipEl.getBoundingClientRect();

    // Position BELOW the target (opens downwards, sticking to target bottom)
    let top = rect.bottom + 6;
    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);

    // Clamp horizontal within viewport
    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
      left = window.innerWidth - tooltipRect.width - 10;
    }

    // Check if it overflows the bottom of the viewport
    let isFlipped = false;
    if (top + tooltipRect.height > window.innerHeight - 10) {
      top = rect.top - tooltipRect.height - 6;
      isFlipped = true;
    }

    // Set position
    tooltipEl.style.top = `${top}px`;
    tooltipEl.style.left = `${left}px`;

    // Dynamic arrow class toggling
    if (isFlipped) {
      tooltipEl.classList.add("flipped");
    } else {
      tooltipEl.classList.remove("flipped");
    }

    // Adjust arrow horizontal position to align exactly with the center of the tool pill!
    const relativeTargetCenter = (rect.left + rect.width / 2) - left;
    tooltipEl.style.setProperty("--arrow-left", `${relativeTargetCenter}px`);
  }

  function renderDrawerSteps(node) {
    const stepsUl = document.getElementById("drawer-steps");
    stepsUl.innerHTML = "";
    
    const trackColors = {
      'tech-core': 'var(--accent-cyan)',
      'ai-swarm': 'var(--accent-orange)',
      'platform-db': 'var(--accent-emerald)',
      'railway-stage': 'var(--accent-purple)',
      'payments': 'var(--accent-amber)',
      'course': 'var(--accent-purple)'
    };
    const cardAccent = trackColors[node.track] || 'var(--accent-emerald)';

    // Update master checkbox status and styling
    const masterCheckbox = document.getElementById("master-steps-checkbox");
    if (masterCheckbox) {
      const allStepsCompleted = node.steps.every((_, idx) => {
        return completedSteps.has(`${node.id}_step_${idx}`);
      });
      masterCheckbox.checked = allStepsCompleted;
      
      const checkmark = masterCheckbox.parentNode.querySelector(".checkbox-checkmark");
      if (checkmark) {
        checkmark.style.setProperty("--card-accent", cardAccent);
      }
    }

    node.steps.forEach((step, idx) => {
      const li = document.createElement("li");
      const stepId = `${node.id}_step_${idx}`;
      const stepCompleted = completedSteps.has(stepId);
      li.className = `step-card${stepCompleted ? ' completed' : ''}`;
      
      const stepText = typeof step === "object" ? step.text : step;
      const stepDetails = typeof step === "object" ? step.details : "Детали выполнения задачи.";
      
      li.innerHTML = `
        <div class="step-card-header">
          <label class="custom-checkbox-container" onclick="event.stopPropagation();">
            <input type="checkbox" class="step-checkbox" data-node-id="${node.id}" data-step-idx="${idx}" ${stepCompleted ? 'checked' : ''}>
            <span class="checkbox-checkmark" style="--card-accent: ${cardAccent};"></span>
          </label>
          <span class="step-text" style="flex-grow: 1; padding-top: 1px;">${stepText}</span>
          <div class="step-card-chevron">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
        <div class="step-details">
          <div class="step-details-inner">
            ${stepDetails}
          </div>
        </div>
      `;
      
      // Accordion click event to toggle collapse/expand (multi-accordion!)
      li.addEventListener("click", () => {
        const isExpanded = li.classList.contains("expanded");
        const detailsEl = li.querySelector(".step-details");
        
        if (isExpanded) {
          li.classList.remove("expanded");
          detailsEl.style.maxHeight = null;
        } else {
          li.classList.add("expanded");
          detailsEl.style.maxHeight = detailsEl.scrollHeight + "px";
        }
      });
      
      stepsUl.appendChild(li);
      
      const checkbox = li.querySelector(".step-checkbox");
      checkbox.addEventListener("change", (e) => {
        toggleStepCompletion(node.id, idx, e.target.checked);
      });
    });
  }

  function closeDrawer() {
    sideDrawer.classList.remove("active");
    drawerOverlay.classList.remove("active");
    
    // Clear path highlights
    document.querySelectorAll(".connection-path").forEach(path => {
      path.classList.remove("active");
      const fromNode = nodes.find(n => n.id === path.dataset.from);
      const isFromCompleted = completedNodes.has(fromNode.id);
      path.style.stroke = isFromCompleted ? "rgba(16, 185, 129, 0.8)" : "rgba(249, 115, 22, 0.5)";
      path.style.strokeWidth = "2";
    });
    
    document.querySelectorAll(".canvas-node").forEach(n => n.classList.remove("selected"));
  }

  function highlightNodeConnections(nodeId) {
    if (activeView !== "canvas") return;
    
    // Clear old active classes
    document.querySelectorAll(".connection-path").forEach(path => {
      path.classList.remove("active");
      const fromNode = nodes.find(n => n.id === path.dataset.from);
      const isFromCompleted = completedNodes.has(fromNode.id);
      path.style.stroke = isFromCompleted ? "rgba(16, 185, 129, 0.8)" : "rgba(249, 115, 22, 0.5)";
      path.style.strokeWidth = "2";
    });

    // Highlight lines leading to or from the selected node
    document.querySelectorAll(`.connection-path[data-from="${nodeId}"], .connection-path[data-to="${nodeId}"]`).forEach(path => {
      path.classList.add("active");
      const fromNode = nodes.find(n => n.id === path.dataset.from);
      const isFromCompleted = completedNodes.has(fromNode.id);
      path.style.stroke = isFromCompleted ? "#10b981" : "#f97316";
      path.style.strokeWidth = "3.5";
    });
  }

  // 10. State Management & Interaction
  function toggleNodeCompletion(nodeId, isChecked) {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    if (isChecked) {
      completedNodes.add(nodeId);
      // Auto-check all steps of this node
      node.steps.forEach((_, idx) => {
        completedSteps.add(`${nodeId}_step_${idx}`);
      });
    } else {
      completedNodes.delete(nodeId);
      // Auto-uncheck all steps of this node
      node.steps.forEach((_, idx) => {
        completedSteps.delete(`${nodeId}_step_${idx}`);
      });
    }

    saveState();

    // If drawer is currently showing this node, refresh steps inside drawer
    const activeDrawerNodeId = document.getElementById("drawer-title").dataset.activeNodeId;
    if (activeDrawerNodeId === nodeId) {
      renderDrawerSteps(node);
    }
  }

  function toggleStepCompletion(nodeId, stepIdx, isChecked) {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const stepId = `${nodeId}_step_${stepIdx}`;
    if (isChecked) {
      completedSteps.add(stepId);
      // If all steps are completed, mark node as completed
      const allStepsChecked = node.steps.every((_, idx) => {
        return completedSteps.has(`${nodeId}_step_${idx}`);
      });
      if (allStepsChecked) {
        completedNodes.add(nodeId);
      }
    } else {
      completedSteps.delete(stepId);
      // Unmark node as completed since not all steps are completed
      completedNodes.delete(nodeId);
    }

    saveState();

    // Toggle completed class on the step card in drawer if active
    const activeDrawerNodeId = document.getElementById("drawer-title").dataset.activeNodeId;
    if (activeDrawerNodeId === nodeId) {
      const stepCheckbox = document.querySelector(`.step-checkbox[data-node-id="${nodeId}"][data-step-idx="${stepIdx}"]`);
      if (stepCheckbox) {
        const stepCard = stepCheckbox.closest(".step-card");
        if (stepCard) {
          if (isChecked) {
            stepCard.classList.add("completed");
          } else {
            stepCard.classList.remove("completed");
          }
        }
      }
    }

    // Sync node checkboxes across Bento Grid and Canvas Mindmap
    const syncCheckboxes = document.querySelectorAll(`.node-checkbox[data-id="${nodeId}"]`);
    syncCheckboxes.forEach(cb => {
      cb.checked = completedNodes.has(nodeId);
    });

    // Sync master steps checkbox
    const masterCheckbox = document.getElementById("master-steps-checkbox");
    if (masterCheckbox) {
      const activeDrawerNodeId = document.getElementById("drawer-title").dataset.activeNodeId;
      if (activeDrawerNodeId === nodeId) {
        const allStepsChecked = node.steps.every((_, idx) => {
          return completedSteps.has(`${nodeId}_step_${idx}`);
        });
        masterCheckbox.checked = allStepsChecked;
      }
    }
  }

  function updateNodeVisualStates() {
    nodes.forEach(node => {
      const isCompleted = completedNodes.has(node.id);
      
      // Check if node is partially completed (some steps done, but not all)
      const completedStepsCount = node.steps.filter((_, idx) => {
        return completedSteps.has(`${node.id}_step_${idx}`);
      }).length;
      const isPartiallyCompleted = !isCompleted && completedStepsCount > 0;
      
      const bentoCard = document.getElementById(`bento-card-${node.id}`);
      if (bentoCard) {
        bentoCard.classList.remove("completed", "partially-completed");
        if (isCompleted) {
          bentoCard.classList.add("completed");
        } else if (isPartiallyCompleted) {
          bentoCard.classList.add("partially-completed");
        }
        
        // Sync checkbox state
        const checkbox = bentoCard.querySelector(".node-checkbox");
        if (checkbox) {
          checkbox.checked = isCompleted;
        }
      }

      const canvasNode = document.getElementById(`canvas-node-${node.id}`);
      if (canvasNode) {
        canvasNode.classList.remove("completed", "partially-completed");
        if (isCompleted) {
          canvasNode.classList.add("completed");
        } else if (isPartiallyCompleted) {
          canvasNode.classList.add("partially-completed");
        }
        
        // Sync checkbox state
        const checkbox = canvasNode.querySelector(".node-checkbox");
        if (checkbox) {
          checkbox.checked = isCompleted;
        }
      }
    });

    // Redraw connections with correct markers and styling
    drawCanvasConnections();
  }

  function updateProgressTracker() {
    const total = nodes.length;
    const completed = completedNodes.size;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    const progressBar = document.getElementById("overall-progress-bar");
    const progressText = document.getElementById("overall-progress-text");

    if (progressBar) progressBar.style.width = `${percentage}%`;
    if (progressText) progressText.innerText = `${completed} / ${total} пройденных (${percentage}%)`;
  }

  function saveState() {
    localStorage.setItem("completedNodes", JSON.stringify([...completedNodes]));
    localStorage.setItem("completedSteps", JSON.stringify([...completedSteps]));
    
    updateProgressTracker();
    updateNodeVisualStates();
    updateLevelProgressBars();
  }

  function updateLevelProgressBars() {
    // Group nodes by Level
    const nodesByLevel = {};
    Object.keys(levels).forEach(lvl => {
      nodesByLevel[lvl] = nodes.filter(n => n.level === lvl);
    });

    // Update each level header's progress bar
    Object.keys(levels).forEach(levelId => {
      const lvlNodes = nodesByLevel[levelId];
      if (!lvlNodes || lvlNodes.length === 0) return;

      const totalInLevel = lvlNodes.length;
      const completedInLevel = lvlNodes.filter(n => completedNodes.has(n.id)).length;
      const levelPercentage = totalInLevel > 0 ? Math.round((completedInLevel / totalInLevel) * 100) : 0;

      // Find the header element
      const headerEl = document.querySelector(`.bento-level-header[data-level="${levelId}"]`);
      if (headerEl) {
        const progressText = headerEl.querySelector('.progress-text');
        const progressBarFill = headerEl.querySelector('.progress-bar-mini-fill');

        if (progressText) {
          progressText.textContent = `${completedInLevel}/${totalInLevel} (${levelPercentage}%)`;
        }
        if (progressBarFill) {
          progressBarFill.style.width = `${levelPercentage}%`;
        }
      }
    });
  }

  // Center Canvas Mindmap on currently filtered/visible nodes
  function centerCanvasOnFilteredNodes() {
    if (activeView !== "canvas") return;
    
    // Find all visible canvas nodes
    const visibleCanvasNodes = nodes.filter(node => {
      const el = document.getElementById(`canvas-node-${node.id}`);
      return el && !el.classList.contains("hidden");
    });
    
    if (visibleCanvasNodes.length === 0) return;
    
    // Calculate bounding box
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    
    visibleCanvasNodes.forEach(node => {
      minX = Math.min(minX, node.canvasX);
      maxX = Math.max(maxX, node.canvasX + 240);
      minY = Math.min(minY, 15); // Factor in column headers (which start at y = 15px) so they are never cut off
      maxY = Math.max(maxY, node.canvasY + 90);
    });
    
    const boxWidth = maxX - minX;
    const boxHeight = maxY - minY;
    
    const viewportRect = mapViewport.getBoundingClientRect();
    const viewportWidth = viewportRect.width || window.innerWidth;
    const viewportHeight = viewportRect.height || window.innerHeight;
    
    // Calculate perfect scale to fit
    const padding = 120;
    const scaleX = (viewportWidth - padding) / boxWidth;
    const scaleY = (viewportHeight - padding) / boxHeight;
    
    let targetScale = Math.min(scaleX, scaleY);
    
    // Cap scale between 0.45 and 1.0 (to avoid over-zooming or making it too tiny)
    targetScale = Math.max(0.45, Math.min(targetScale, 1.0));
    
    // If all nodes are visible, set a comfortable default full-view scale
    if (visibleCanvasNodes.length === nodes.length) {
      targetScale = 0.6;
    }
    
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    
    // Center bounding box center in viewport center
    const targetPanX = (viewportWidth / 2) - (centerX * targetScale);
    const targetPanY = (viewportHeight / 2) - (centerY * targetScale);
    
    // Apply class for smooth transition animation
    mapCanvas.classList.add("smooth-transform");
    
    scale = targetScale;
    panX = targetPanX;
    panY = targetPanY;
    
    updateCanvasTransforms();
    
    // Remove smooth transform class after animation finishes (0.6s) to allow lag-free panning again
    setTimeout(() => {
      mapCanvas.classList.remove("smooth-transform");
    }, 600);
  }

  // Start initialization
  init();
});
