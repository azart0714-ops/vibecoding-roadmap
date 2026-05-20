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

    // Claude Code CLI Ecosystem flows
    { from: "l3_2_claude_cli", to: "l3_13_claude_code_guide" },
    { from: "l3_12_git_worktrees", to: "l3_13_claude_code_guide" },
    { from: "l3_13_claude_code_guide", to: "l3_14_claude_code_modes" },
    { from: "l3_14_claude_code_modes", to: "l3_15_model_selection" },
    { from: "l3_8_ai_models", to: "l3_15_model_selection" },
    { from: "l3_15_model_selection", to: "l3_16_new_features_v2" },
    { from: "l3_16_new_features_v2", to: "l3_17_config_hierarchy" },
    { from: "l3_17_config_hierarchy", to: "l3_18_env_vars" },
    { from: "l3_18_env_vars", to: "l3_19_rules_files" },
    { from: "l3_19_rules_files", to: "l3_20_reusable_skills" },
    { from: "l3_20_reusable_skills", to: "l4_1_private_git" },

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
    { from: "l5_8_db_providers", to: "l5_11_semantic_api" },
    { from: "l5_11_semantic_api", to: "l5_12_anti_nullable" },
    { from: "l5_12_anti_nullable", to: "l7_3_postgres_neon" },
    { from: "l6_7_analytics_monitoring", to: "l6_8_vercel_analytics" },
    { from: "l6_8_vercel_analytics", to: "l6_9_clerk_auth" },
    { from: "l6_9_clerk_auth", to: "l7_1_porting_vsc" },

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
    { from: "l5_7_prisma_vibecoding", to: "l5_9_prisma_safety" },
    { from: "l5_9_prisma_safety", to: "l5_10_drizzle_edge" },
    { from: "l5_10_drizzle_edge", to: "l5_8_db_providers" },
    { from: "l5_8_db_providers", to: "l7_3_postgres_neon" },
    { from: "l7_4_staging_railway", to: "l7_11_vercel_gold" },
    { from: "l7_11_vercel_gold", to: "l8_1_swarm_workflow" },

    // C1/C2 paradigm connections
    { from: "l0_6_savings_metrics", to: "l0_9_keyray_economics" },
    { from: "l0_9_keyray_economics", to: "l0_7_tools_cost" },
    { from: "l1_5_project_checklists", to: "l1_6_vibepming" },
    { from: "l1_6_vibepming", to: "l1_7_backend_first" },
    { from: "l1_7_backend_first", to: "l2_19_prompt_refinement" },
    { from: "l2_18_commit_checklist", to: "l2_19_prompt_refinement" },
    { from: "l2_19_prompt_refinement", to: "l2_20_future_editing" },
    { from: "l2_20_future_editing", to: "l3_12_cursor_commands" },
    { from: "l3_11_github_prompts", to: "l3_12_cursor_commands" },
    { from: "l3_12_cursor_commands", to: "l4_11_webflow_figma" },
    { from: "l4_10_reusable_blocks", to: "l4_11_webflow_figma" },
    { from: "l4_11_webflow_figma", to: "l5_9_docker_multicontainer" },
    { from: "l5_8_db_providers", to: "l5_9_docker_multicontainer" },
    { from: "l5_9_docker_multicontainer", to: "l6_8_yookassa_brevo" },
    { from: "l6_7_analytics_monitoring", to: "l6_8_yookassa_brevo" },
    { from: "l6_8_yookassa_brevo", to: "l7_13_apple_dev" },
    { from: "l7_12_deploy_checklist", to: "l7_13_apple_dev" },
    { from: "l7_14_test_isolation", to: "l8_1_swarm_workflow" },
    { from: "l0_8_guides_resources", to: "l0_11_context_engineering" },
    { from: "l0_11_context_engineering", to: "l0_12_reward_hacking" },
    { from: "l0_12_reward_hacking", to: "l0_13_a11y_audit" },
    { from: "l0_13_a11y_audit", to: "l0_14_svg_migration" },
    { from: "l0_14_svg_migration", to: "l1_5_project_checklists" },

    // L1 Sequential Flow
    { from: "l1_5_project_checklists", to: "l1_6_prompt_formula" },
    { from: "l1_6_prompt_formula", to: "l1_7_six_prompt_techniques" },
    { from: "l1_7_six_prompt_techniques", to: "l1_8_cli_tools_matrix" },
    { from: "l1_8_cli_tools_matrix", to: "l1_9_ai_books" },
    { from: "l1_9_ai_books", to: "l1_10_figma_workflow" },
    { from: "l1_10_figma_workflow", to: "l1_11_v0_generation" },
    { from: "l1_11_v0_generation", to: "l1_12_storybook_docs" },
    { from: "l1_12_storybook_docs", to: "l1_13_quality_gates" },
    { from: "l1_13_quality_gates", to: "l1_14_handoff_standard" },
    { from: "l1_14_handoff_standard", to: "l2_1_human_ai_roles" },

    // L2 Cycle 5 Sequential Flow
    { from: "l2_20_cursorrules_hygiene", to: "l2_21_five_critical_mistakes" },
    { from: "l2_21_five_critical_mistakes", to: "l2_22_claude_projects" },
    { from: "l2_22_claude_projects", to: "l2_23_agent_roles" },
    { from: "l2_23_agent_roles", to: "l2_24_context_reset" },
    { from: "l2_24_context_reset", to: "l2_25_thinking_budget" },
    { from: "l2_25_thinking_budget", to: "l2_26_claude_prompt_templates" },
    { from: "l2_26_claude_prompt_templates", to: "l3_1_vscode" },

    // Cycle 7 - L4 Deploy & Shadcn Connections
    { from: "l4_10_reusable_blocks", to: "l4_11_deploy_strategy" },
    { from: "l4_11_deploy_strategy", to: "l4_12_shadcn_revolution" },
    { from: "l4_12_shadcn_revolution", to: "l4_13_ui_libraries_comparison" },
    { from: "l4_13_ui_libraries_comparison", to: "l4_14_radix_primitives" },
    { from: "l4_14_radix_primitives", to: "l4_15_ai_design_system" },
    { from: "l4_15_ai_design_system", to: "l4_16_mobile_first_tailwind" },
    { from: "l4_16_mobile_first_tailwind", to: "l4_17_accessibility_a11y" },
    { from: "l4_17_accessibility_a11y", to: "l4_18_zustand_state" },
    { from: "l4_18_zustand_state", to: "l4_19_state_decision_tree" },
    { from: "l4_19_state_decision_tree", to: "l4_20_ux_principles" },
    { from: "l4_20_ux_principles", to: "l4_21_loading_states" },
    { from: "l4_21_loading_states", to: "l4_22_error_states" },
    { from: "l4_22_error_states", to: "l4_23_empty_states" },
    { from: "l4_23_empty_states", to: "l4_24_micro_interactions" },
    { from: "l4_24_micro_interactions", to: "l4_25_component_composition" },
    { from: "l4_25_component_composition", to: "l4_26_react_devtools" },
    { from: "l4_26_react_devtools", to: "l4_27_typography_scale" },
    { from: "l4_27_typography_scale", to: "l4_28_container_queries" },
    { from: "l4_28_container_queries", to: "l4_29_fluid_typography" },
    { from: "l4_29_fluid_typography", to: "l4_30_touch_targets" },
    { from: "l4_30_touch_targets", to: "l4_31_core_web_vitals" },
    { from: "l4_31_core_web_vitals", to: "l4_32_perceived_performance" },
    { from: "l4_32_perceived_performance", to: "l4_33_image_optimization" },
    { from: "l4_33_image_optimization", to: "l4_34_wcag_standards" },
    { from: "l4_35_keyboard_navigation", to: "l4_36_screen_readers" },
    { from: "l4_36_screen_readers", to: "l4_43_input_states" },
    { from: "l4_43_input_states", to: "l4_44_autocomplete_autofill" },
    { from: "l4_44_autocomplete_autofill", to: "l4_45_bottom_navigation" },
    { from: "l4_45_bottom_navigation", to: "l4_46_pull_to_refresh" },
    { from: "l4_46_pull_to_refresh", to: "l4_47_swipe_gestures" },
    { from: "l4_47_swipe_gestures", to: "l4_48_pwa_integration" },
    { from: "l4_48_pwa_integration", to: "l4_49_colocation_actions" },
    { from: "l4_49_colocation_actions", to: "l4_50_tailwind_standard" },
    { from: "l4_50_tailwind_standard", to: "l4_51_shadcn_components" },
    { from: "l4_51_shadcn_components", to: "l4_52_zustand_state" },
    { from: "l4_52_zustand_state", to: "l4_53_skeleton_screens" },
    { from: "l4_53_skeleton_screens", to: "l4_54_use_optimistic" },
    { from: "l4_54_use_optimistic", to: "l4_55_focus_traps" },
    { from: "l4_55_focus_traps", to: "l4_56_framer_motion" },
    { from: "l4_56_framer_motion", to: "l4_57_error_recovery" },
    { from: "l4_57_error_recovery", to: "l5_1_autonomous_planning" }
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
    l4_11_deploy_strategy: "weight-medium",
    l4_12_shadcn_revolution: "weight-medium",
    l4_13_ui_libraries_comparison: "weight-medium",
    l4_14_radix_primitives: "weight-medium",
    l4_15_ai_design_system: "weight-medium",
    l4_16_mobile_first_tailwind: "weight-medium",
    l4_17_accessibility_a11y: "weight-medium",
    l4_18_zustand_state: "weight-medium",
    l4_19_state_decision_tree: "weight-medium",
    l4_20_ux_principles: "weight-medium",
    l4_21_loading_states: "weight-medium",
    l4_22_error_states: "weight-medium",
    l4_23_empty_states: "weight-medium",
    l4_24_micro_interactions: "weight-medium",
    l4_25_component_composition: "weight-wide",
    l4_26_react_devtools: "weight-medium",
    l4_27_typography_scale: "weight-wide",

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
    l0_11_context_engineering: "weight-medium",
    l0_12_reward_hacking: "weight-medium",
    l0_13_a11y_audit: "weight-medium",
    l0_14_svg_migration: "weight-medium",

    // Milestone 14 Bento Weights
    l5_7_prisma_vibecoding: "weight-medium",
    l5_9_prisma_safety: "weight-medium",
    l5_10_drizzle_edge: "weight-medium",
    l5_8_db_providers: "weight-medium",
    l5_11_semantic_api: "weight-medium",
    l5_12_anti_nullable: "weight-medium",
    l6_8_vercel_analytics: "weight-medium",
    l6_9_clerk_auth: "weight-medium",
    l7_11_vercel_gold: "weight-medium",

    // C1/C2 Bento Weights
    l0_9_keyray_economics: "weight-medium",
    l1_6_vibepming: "weight-medium",
    l1_7_backend_first: "weight-medium",
    l2_19_prompt_refinement: "weight-medium",
    l2_20_future_editing: "weight-medium",
    l3_12_cursor_commands: "weight-medium",
    l4_11_webflow_figma: "weight-medium",
    l5_9_docker_multicontainer: "weight-medium",
    l6_8_yookassa_brevo: "weight-medium",
    l7_13_apple_dev: "weight-medium",
    l7_14_test_isolation: "weight-medium",

    // L1 New Nodes Bento Weights
    l1_6_prompt_formula: "weight-medium",
    l1_7_six_prompt_techniques: "weight-medium",
    l1_8_cli_tools_matrix: "weight-medium",
    l1_9_ai_books: "weight-medium",
    l1_10_figma_workflow: "weight-medium",
    l1_11_v0_generation: "weight-medium",
    l1_12_storybook_docs: "weight-medium",
    l1_13_quality_gates: "weight-medium",
    l1_14_handoff_standard: "weight-medium",

    // L2 Cycle 5 New Nodes Bento Weights
    l2_20_cursorrules_hygiene: "weight-medium",
    l2_21_five_critical_mistakes: "weight-medium",
    l2_22_claude_projects: "weight-medium",
    l2_23_agent_roles: "weight-medium",
    l2_24_context_reset: "weight-medium",
    l2_25_thinking_budget: "weight-medium",
    l2_26_claude_prompt_templates: "weight-medium",

    // L3 Cycle 6 New Nodes Bento Weights (Claude Code CLI)
    l3_13_claude_code_guide: "weight-large",
    l3_14_claude_code_modes: "weight-medium",
    l3_15_model_selection: "weight-medium",
    l3_16_new_features_v2: "weight-medium",
    l3_17_config_hierarchy: "weight-medium",
    l3_18_env_vars: "weight-medium",
    l3_20_reusable_skills: "weight-medium",

    // Level 4 new interactive nodes bento weights
    l4_43_input_states: "weight-medium",
    l4_44_autocomplete_autofill: "weight-medium",
    l4_45_bottom_navigation: "weight-medium",
    l4_46_pull_to_refresh: "weight-medium",
    l4_47_swipe_gestures: "weight-medium",
    l4_48_pwa_integration: "weight-large",
    l4_49_colocation_actions: "weight-medium",
    l4_50_tailwind_standard: "weight-medium",
    l4_51_shadcn_components: "weight-medium",
    l4_53_skeleton_screens: "weight-medium",
    l4_54_use_optimistic: "weight-large",
    l4_55_focus_traps: "weight-medium",
    l4_56_framer_motion: "weight-medium",
    l4_57_error_recovery: "weight-large"
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
        node.steps.some(s => {
          const stepText = typeof s === "object" ? s.text : s;
          return stepText.toLowerCase().includes(query);
        });
      
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
      li.querySelector(".step-card-header").addEventListener("click", () => {
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
    if (window.updateZustandUI) window.updateZustandUI();
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

  // --- Zustand Store Simulator ---
  let zustandCounter = 0;
  window.incrementZustandCounter = function() {
    zustandCounter++;
    window.updateZustandUI();
  };
  window.decrementZustandCounter = function() {
    zustandCounter--;
    window.updateZustandUI();
  };
  window.updateZustandUI = function() {
    const el = document.getElementById("zustand-counter-val");
    if (el) {
      el.innerText = zustandCounter;
      // Premium interactive scale bounce micro-animation
      el.style.transform = "scale(1.15)";
      el.style.color = zustandCounter >= 0 ? "#a78bfa" : "#f87171";
      el.style.transition = "transform 0.08s cubic-bezier(0.175, 0.885, 0.32, 1.275), color 0.15s ease";
      setTimeout(() => {
        el.style.transform = "scale(1)";
        el.style.color = "#fff";
      }, 80);
    }
  };

  // --- Decision Tree Simulator ---
  let decisionScale = null;
  window.selectDecisionScale = function(scale) {
    decisionScale = scale;
    const step1 = document.getElementById("dec-step-1");
    const step2 = document.getElementById("dec-step-2");
    if (step1 && step2) {
      step1.style.display = "none";
      step2.style.display = "block";
    }
  };
  window.selectDecisionFrequency = function(freq) {
    const step2 = document.getElementById("dec-step-2");
    const result = document.getElementById("dec-result");
    const recommendation = document.getElementById("dec-recommendation");
    if (step2 && result && recommendation) {
      step2.style.display = "none";
      result.style.display = "block";
      
      // Decision tree logic
      if (decisionScale === "small" && freq === "low") {
        recommendation.innerText = "REACT CONTEXT";
        recommendation.style.color = "#60a5fa"; // Blue
      } else if (decisionScale === "large") {
        recommendation.innerText = "REDUX TOOLKIT (RTK)";
        recommendation.style.color = "#f472b6"; // Pink
      } else {
        recommendation.innerText = "ZUSTAND";
        recommendation.style.color = "#34d399"; // Green
      }
    }
  };
  window.resetDecisionTree = function() {
    decisionScale = null;
    const step1 = document.getElementById("dec-step-1");
    const step2 = document.getElementById("dec-step-2");
    const result = document.getElementById("dec-result");
    if (step1 && step2 && result) {
      step1.style.display = "block";
      step2.style.display = "none";
      result.style.display = "none";
    }
  };

  // --- Loading States Simulator ---
  window.runLoadingSim = function(type) {
    const container = document.getElementById("load-sandbox-content");
    if (!container) return;

    if (type === "optimistic") {
      // Optimistic UI updates instantly!
      container.innerHTML = `
        <div style="width: 100%; text-align: center; font-family: monospace;">
          <div style="font-size: 13px; color: #34d399; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 6px;">
            <svg class="animate-bounce" width="16" height="16" fill="currentColor" viewBox="0 0 20 20" style="animation: tap-press 1s infinite;"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 10.067A1.99 1.99 0 006 10.333z"/></svg>
            Лайк добавлен! (Мгновенно)
          </div>
          <div style="font-size: 10px; color: #64748b; margin-top: 4px;">Запрос к серверу отправлен в фоновом режиме...</div>
        </div>
      `;
      return;
    }

    // Spinner or Skeleton showing 2s delay simulation
    let secondsLeft = 2.0;
    container.innerHTML = getLoadingSimMarkup(type, secondsLeft);

    const timerInterval = setInterval(() => {
      secondsLeft -= 0.1;
      if (secondsLeft <= 0) {
        clearInterval(timerInterval);
        container.innerHTML = `
          <div style="width: 100%; text-align: center; font-family: monospace; animation: fadeIn 0.3s ease;">
            <div style="font-size: 13px; color: #10b981; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 6px;">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Данные успешно загружены!
            </div>
            <div style="font-size: 10px; color: #64748b; margin-top: 4px;">Задержка сети: 2.0 сек</div>
          </div>
        `;
      } else {
        const timerVal = document.getElementById("loading-sim-timer");
        if (timerVal) {
          timerVal.innerText = secondsLeft.toFixed(1) + "s";
        }
      }
    }, 100);

    // Keep track of the active interval on container to clear it if another button is pressed
    if (container.activeInterval) {
      clearInterval(container.activeInterval);
    }
    container.activeInterval = timerInterval;
  };

  function getLoadingSimMarkup(type, initialSec) {
    if (type === "spinner") {
      return `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; font-family: monospace; width: 100%;">
          <div style="width: 24px; height: 24px; border: 3px solid rgba(139, 92, 246, 0.2); border-top-color: #8b5cf6; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
          <div style="font-size: 11px; color: #e2e8f0;">Загрузка списка... <span id="loading-sim-timer">${initialSec.toFixed(1)}s</span></div>
        </div>
      `;
    } else {
      // Skeleton Screen
      return `
        <div style="width: 100%; display: flex; flex-direction: column; gap: 8px; font-family: monospace;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="font-size: 10px; color: #8b5cf6; font-weight: bold;">Имитация макета... <span id="loading-sim-timer">${initialSec.toFixed(1)}s</span></div>
          </div>
          <div style="display: flex; gap: 10px; align-items: center;">
            <div class="skeleton-shimmer" style="width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.08); position: relative; overflow: hidden;"></div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
              <div class="skeleton-shimmer" style="width: 60%; height: 10px; border-radius: 4px; background: rgba(255,255,255,0.08); position: relative; overflow: hidden;"></div>
              <div class="skeleton-shimmer" style="width: 40%; height: 8px; border-radius: 4px; background: rgba(255,255,255,0.05); position: relative; overflow: hidden;"></div>
            </div>
          </div>
        </div>
      `;
    }
  }

  // ================= SIMULATORS FOR NEW L4 NODES =================
  window.errorRecoveryInterval = null;

  // Global simulator for L4_22 Error States
  window.simulateError = function(action) {
    const container = document.getElementById("error-sandbox-content");
    if (!container) return;

    // Clear any existing error recovery timers
    if (window.errorRecoveryInterval) {
      clearInterval(window.errorRecoveryInterval);
      window.errorRecoveryInterval = null;
    }

    if (action === 'reset') {
      container.style.borderColor = 'rgba(255,255,255,0.1)';
      container.style.background = 'rgba(0,0,0,0.2)';
      container.innerHTML = `<div style="color: #64748b; font-size: 11px; font-family: monospace; text-align: center;">Нажмите «Сгенерировать ошибку» для симуляции сбоя</div>`;
      adjustStepDetailsHeight();
      return;
    }

    if (action === 'trigger') {
      container.style.borderColor = 'rgba(248, 113, 113, 0.4)';
      container.style.background = 'rgba(248, 113, 113, 0.05)';
      
      let timeLeft = 3.0;
      
      const renderErrorState = () => {
        container.innerHTML = `
          <div style="width: 100%; display: flex; flex-direction: column; gap: 8px; font-family: monospace; text-align: left;">
            <div style="display: flex; align-items: center; gap: 6px; color: #f87171; font-size: 11px; font-weight: bold;">
              <span style="font-size: 12px;">⚠️</span>
              <span>API Error (503 Service Unavailable)</span>
            </div>
            <div style="font-size: 10px; color: #94a3b8; line-height: 1.4;">
              Временный сбой соединения. Авто-восстановление через <span style="color: #fca5a5; font-weight: bold;">${timeLeft.toFixed(1)}s</span>...
            </div>
            <div style="display: flex; gap: 6px; margin-top: 4px;">
              <button id="error-sim-copy-btn" onclick="event.stopPropagation(); window.simulateError('copy');" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: #fff; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 10px; transition: all 0.2s;">Скопировать дамп для ИИ</button>
            </div>
          </div>
        `;
        adjustStepDetailsHeight();
      };

      renderErrorState();

      window.errorRecoveryInterval = setInterval(() => {
        timeLeft -= 0.1;
        if (timeLeft <= 0) {
          clearInterval(window.errorRecoveryInterval);
          window.errorRecoveryInterval = null;
          // Show recovery success
          container.style.borderColor = 'rgba(52, 211, 153, 0.4)';
          container.style.background = 'rgba(52, 211, 153, 0.05)';
          container.innerHTML = `
            <div style="width: 100%; display: flex; flex-direction: column; gap: 4px; font-family: monospace; text-align: center; color: #34d399; animation: fadeIn 0.3s ease;">
              <div style="font-size: 16px;">✅</div>
              <div style="font-size: 11px; font-weight: bold;">Соединение успешно восстановлено!</div>
              <div style="font-size: 9px; color: #64748b;">Данные перезагружены из фонового повтора.</div>
            </div>
          `;
          adjustStepDetailsHeight();
        } else {
          renderErrorState();
        }
      }, 100);
      return;
    }

    if (action === 'copy') {
      const errorLog = {
        timestamp: new Date().toISOString(),
        error: "API_503_SERVICE_UNAVAILABLE",
        statusCode: 503,
        requestUrl: "https://api.vibecoder.dev/v1/projects",
        component: "ProjectGridWidget",
        aiMetadata: {
          context: "SOP Node L4_22 Error States Sandbox Simulation",
          suggestedAction: "Implement exponential backoff retry. Provide structured copyable log format to AI to fix the state boundary if code fails."
        }
      };

      navigator.clipboard.writeText(JSON.stringify(errorLog, null, 2))
        .then(() => {
          const btn = document.getElementById("error-sim-copy-btn");
          if (btn) {
            btn.textContent = "Скопировано! ✓";
            btn.style.color = "#34d399";
            btn.style.borderColor = "rgba(52, 211, 153, 0.4)";
            setTimeout(() => {
              if (btn) {
                btn.textContent = "Скопировать дамп для ИИ";
                btn.style.color = "#fff";
                btn.style.borderColor = "rgba(255,255,255,0.12)";
              }
            }, 1500);
          }
        })
        .catch(err => {
          console.error("Failed to copy error dump: ", err);
        });
    }
  };

  // Global simulator for L4_23 Empty States
  window.simulateEmptyAction = function(action) {
    const container = document.getElementById("empty-sandbox-content");
    if (!container) return;

    if (action === 'clear') {
      container.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px; font-family: monospace; width: 100%; animation: fadeIn 0.25s ease;">
          <div class="bounce-icon" style="font-size: 24px; color: #a78bfa;">📂</div>
          <div>
            <div style="font-size: 11px; color: #e2e8f0; font-weight: bold;">Список документов пуст</div>
            <div style="font-size: 9px; color: #64748b; margin-top: 2px;">Создайте первый документ или загрузите демо-данные</div>
          </div>
          <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.18); padding: 6px 8px; border-radius: 4px; font-size: 9px; color: #c084fc; max-width: 90%;">
            💡 <b>ИИ-Совет:</b> Кликните кнопку «Добавить шаблон» выше для наполнения базы.
          </div>
        </div>
      `;
    } else if (action === 'fill') {
      container.innerHTML = `
        <div style="width: 100%; display: flex; flex-direction: column; gap: 6px; font-family: monospace; text-align: left; animation: fadeIn 0.25s ease;">
          <div style="font-size: 10px; color: #34d399; font-weight: bold; margin-bottom: 2px; display: flex; justify-content: space-between; align-items: center;">
            <span>НАЙДЕНО ДОКУМЕНТОВ: 3</span>
            <button onclick="event.stopPropagation(); window.simulateEmptyAction('clear');" style="background: none; border: none; color: #f87171; font-size: 9px; cursor: pointer; text-decoration: underline; padding: 0;">Очистить все</button>
          </div>
          <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 4px; padding: 6px 8px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 10px; color: #e2e8f0;">📄 Resume_Vibecoder.pdf</span>
            <span style="font-size: 8px; color: #64748b;">12 KB</span>
          </div>
          <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 4px; padding: 6px 8px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 10px; color: #e2e8f0;">📄 Portfolio_Mockup.sketch</span>
            <span style="font-size: 8px; color: #64748b;">240 KB</span>
          </div>
          <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 4px; padding: 6px 8px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 10px; color: #e2e8f0;">📄 Design_System.md</span>
            <span style="font-size: 8px; color: #64748b;">18 KB</span>
          </div>
        </div>
      `;
    }
    adjustStepDetailsHeight();
  };

  // Global simulator for L4_24 Micro-interactions
  window.simulateMicroAction = function(action, event) {
    if (action === 'ripple' && event) {
      const btn = event.currentTarget;
      
      // Visual click effect
      btn.style.transform = 'scale(0.96)';
      setTimeout(() => { btn.style.transform = 'scale(1)'; }, 80);

      // Create ripple element
      const circle = document.createElement('span');
      circle.classList.add('ripple-circle');
      
      const rect = btn.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      const diameter = Math.max(rect.width, rect.height);
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${x - diameter / 2}px`;
      circle.style.top = `${y - diameter / 2}px`;
      
      btn.appendChild(circle);
      setTimeout(() => circle.remove(), 500);
      return;
    }

    if (action === 'toast') {
      const container = document.getElementById("micro-sandbox-toast-container");
      if (!container) return;

      const toast = document.createElement("div");
      toast.classList.add("toast-notification");
      toast.innerHTML = `
        <svg width="14" height="14" fill="none" stroke="#34d399" stroke-width="2.5" viewBox="0 0 24 24" style="flex-shrink: 0;"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <span>Успешно сохранено в облако!</span>
      `;

      container.appendChild(toast);
      
      // Max 2 toast items to avoid crowding
      if (container.children.length > 2) {
        container.children[0].remove();
      }

      setTimeout(() => {
        toast.remove();
      }, 3000);
    }
  };

  // Simulators for Component Composition
  window.toggleComposition = function(mode) {
    const area = document.getElementById("composition-preview-area");
    const btnMonolith = document.getElementById("comp-btn-monolith");
    const btnComposed = document.getElementById("comp-btn-composed");
    if (!area) return;

    if (mode === 'monolith') {
      if (btnMonolith) {
        btnMonolith.style.background = "#ef4444";
        btnMonolith.style.color = "#fff";
        btnMonolith.style.border = "none";
        btnMonolith.classList.add("active-toggle-btn");
      }
      if (btnComposed) {
        btnComposed.style.background = "rgba(255,255,255,0.06)";
        btnComposed.style.border = "1px solid rgba(255,255,255,0.12)";
        btnComposed.style.color = "#e2e8f0";
        btnComposed.classList.remove("active-toggle-btn");
      }

      area.innerHTML = `
        <div class="comp-monolith-view" style="background: rgba(239, 68, 68, 0.05); border: 1px dashed rgba(239, 68, 68, 0.3); padding: 10px; border-radius: 6px; animation: fadeIn 0.2s ease-in-out;">
          <div style="font-size: 10px; font-weight: bold; color: #f87171; margin-bottom: 6px; display: flex; justify-content: space-between;">
            <span>MonolithicCard.jsx (580 строк кода)</span>
            <span style="background: rgba(239,68,68,0.2); padding: 1px 4px; border-radius: 3px; font-size: 8px;">Тяжелый контекст</span>
          </div>
          <div style="font-size: 9px; color: #a1a1aa; line-height: 1.3; font-family: monospace; max-height: 50px; overflow: hidden; mask-image: linear-gradient(to bottom, black 50%, transparent 100%);">
            function MonolithicCard({ title, desc, user, comments, tags, isLiked, onLike, onShare, onComment, isAuth, isLoading, apiEndpoint }) { ... logic ... API calls ... useEffect ... }
          </div>
          <div style="margin-top: 8px; font-size: 10px; display: flex; align-items: center; justify-content: space-between;">
            <span style="color: #fca5a5;">AI Token Waste / Context Weight:</span>
            <span style="font-weight: bold; color: #ef4444; font-family: monospace;">92% (CRITICAL)</span>
          </div>
          <div style="background: rgba(255,255,255,0.05); height: 5px; border-radius: 3px; margin-top: 4px; overflow: hidden;">
            <div style="background: #ef4444; width: 92%; height: 100%;"></div>
          </div>
        </div>
      `;
    } else {
      if (btnComposed) {
        btnComposed.style.background = "#8b5cf6";
        btnComposed.style.color = "#fff";
        btnComposed.style.border = "none";
        btnComposed.classList.add("active-toggle-btn");
      }
      if (btnMonolith) {
        btnMonolith.style.background = "rgba(255,255,255,0.06)";
        btnMonolith.style.border = "1px solid rgba(255,255,255,0.12)";
        btnMonolith.style.color = "#e2e8f0";
        btnMonolith.classList.remove("active-toggle-btn");
      }

      area.innerHTML = `
        <div class="comp-composed-view" style="background: rgba(139, 92, 246, 0.05); border: 1px dashed rgba(139, 92, 246, 0.3); padding: 10px; border-radius: 6px; display: flex; flex-direction: column; gap: 6px; animation: fadeIn 0.2s ease-in-out;">
          <div style="font-size: 10px; font-weight: bold; color: #c084fc; display: flex; justify-content: space-between;">
            <span>Декомпозиция на 3 файла:</span>
            <span style="background: rgba(139,92,246,0.2); padding: 1px 4px; border-radius: 3px; font-size: 8px;">Легкий контекст</span>
          </div>
          <div style="display: flex; gap: 4px;">
            <span style="font-size: 8px; color: #c084fc; background: rgba(139,92,246,0.15); border: 1px solid rgba(139,92,246,0.25); padding: 2px 4px; border-radius: 4px; font-family: monospace;">Card.jsx (45 l)</span>
            <span style="font-size: 8px; color: #a78bfa; background: rgba(139,92,246,0.15); border: 1px solid rgba(139,92,246,0.25); padding: 2px 4px; border-radius: 4px; font-family: monospace;">CardHeader.jsx (20 l)</span>
            <span style="font-size: 8px; color: #c084fc; background: rgba(139,92,246,0.15); border: 1px solid rgba(139,92,246,0.25); padding: 2px 4px; border-radius: 4px; font-family: monospace;">useCardActions.js (30 l)</span>
          </div>
          <div style="margin-top: 2px; font-size: 10px; display: flex; align-items: center; justify-content: space-between;">
            <span style="color: #c084fc;">AI Token Waste / Context Weight:</span>
            <span style="font-weight: bold; color: #10b981; font-family: monospace;">12% (EXCELLENT)</span>
          </div>
          <div style="background: rgba(255,255,255,0.05); height: 5px; border-radius: 3px; margin-top: 4px; overflow: hidden;">
            <div style="background: #10b981; width: 12%; height: 100%;"></div>
          </div>
        </div>
      `;
    }
    adjustStepDetailsHeight();
  };

  // Simulators for React DevTools
  let isProfilerOptimized = false;
  let reRenderWasteCount = 0;
  window.toggleProfilerOptimization = function(checked) {
    isProfilerOptimized = checked;
    const statusVal = document.getElementById("profiler-status-val");
    const aiOptim = document.getElementById("profiler-ai-optim");
    if (statusVal) {
      statusVal.innerText = isProfilerOptimized ? "Optimized" : "Unoptimized";
      statusVal.style.color = isProfilerOptimized ? "#10b981" : "#f59e0b";
    }
    if (aiOptim) {
      aiOptim.innerText = isProfilerOptimized ? "Мемоизация активна" : "Отсутствует";
      aiOptim.style.color = isProfilerOptimized ? "#10b981" : "#f87171";
    }
  };

  window.triggerProfileRender = function() {
    const node1 = document.getElementById("prof-node-1");
    const node2 = document.getElementById("prof-node-2");
    const wasteCounter = document.getElementById("profiler-waste-counter");

    if (isProfilerOptimized) {
      if (node1) {
        node1.style.borderColor = "#10b981";
        node1.style.backgroundColor = "rgba(16, 185, 129, 0.05)";
        setTimeout(() => {
          node1.style.borderColor = "rgba(255,255,255,0.15)";
          node1.style.backgroundColor = "transparent";
        }, 300);
      }
      if (node2) {
        node2.style.borderColor = "#10b981";
        node2.style.backgroundColor = "rgba(16, 185, 129, 0.05)";
        setTimeout(() => {
          node2.style.borderColor = "rgba(255,255,255,0.15)";
          node2.style.backgroundColor = "transparent";
        }, 300);
      }
    } else {
      reRenderWasteCount += 2;
      if (wasteCounter) {
        wasteCounter.innerText = reRenderWasteCount;
      }
      if (node1) {
        node1.style.borderColor = "#ef4444";
        node1.style.backgroundColor = "rgba(239, 68, 68, 0.15)";
        setTimeout(() => {
          node1.style.borderColor = "rgba(255,255,255,0.15)";
          node1.style.backgroundColor = "transparent";
        }, 300);
      }
      if (node2) {
        node2.style.borderColor = "#ef4444";
        node2.style.backgroundColor = "rgba(239, 68, 68, 0.15)";
        setTimeout(() => {
          node2.style.borderColor = "rgba(255,255,255,0.15)";
          node2.style.backgroundColor = "transparent";
        }, 300);
      }
    }
  };

  // Simulators for Typography Scale
  window.updateTypographyScale = function(ratioStr) {
    const ratio = parseFloat(ratioStr) || 1.25;
    const base = 12;
    const captionSz = Math.round(base / ratio);
    const bodySz = base;
    const h3Sz = Math.round(base * ratio);
    const h1Sz = Math.round(base * ratio * ratio);
    const displaySz = Math.round(base * ratio * ratio * ratio);

    const tsDisplay = document.getElementById("ts-preview-display");
    const tsH1 = document.getElementById("ts-preview-h1");
    const tsH3 = document.getElementById("ts-preview-h3");
    const tsBody = document.getElementById("ts-preview-body");
    const tsCaption = document.getElementById("ts-preview-caption");

    if (tsDisplay) {
      tsDisplay.style.fontSize = `${displaySz}px`;
      tsDisplay.innerText = `Display (${displaySz}px)`;
    }
    if (tsH1) {
      tsH1.style.fontSize = `${h1Sz}px`;
      tsH1.innerText = `H1 Heading (${h1Sz}px)`;
    }
    if (tsH3) {
      tsH3.style.fontSize = `${h3Sz}px`;
      tsH3.innerText = `H3 Subtitle (${h3Sz}px)`;
    }
    if (tsBody) {
      tsBody.style.fontSize = `${bodySz}px`;
      tsBody.innerText = `Body Copy (${bodySz}px)`;
    }
    if (tsCaption) {
      tsCaption.style.fontSize = `${captionSz}px`;
      tsCaption.innerText = `Caption (${captionSz}px)`;
    }
    adjustStepDetailsHeight();
  };

  // Simulators for Container Queries
  window.updateContainerQueryWidth = function(widthStr) {
    const width = parseInt(widthStr) || 450;
    const widthVal = document.getElementById("container-width-val");
    const parentContainer = document.getElementById("cq-parent-container");
    const card = document.getElementById("cq-card");
    const badge = document.getElementById("cq-card-badge");

    if (widthVal) {
      widthVal.innerText = `${width}px`;
    }
    if (parentContainer) {
      parentContainer.style.width = `${width}px`;
    }
    if (card && badge) {
      if (width < 380) {
        card.style.flexDirection = "column";
        card.style.alignItems = "stretch";
        badge.innerText = "@container (max-width: 379px) -> Stack";
        badge.style.color = "#f43f5e";
        badge.style.background = "rgba(244,63,94,0.15)";
        badge.style.borderColor = "rgba(244,63,94,0.25)";
      } else {
        card.style.flexDirection = "row";
        card.style.alignItems = "center";
        badge.innerText = "@container (min-width: 380px) -> Row";
        badge.style.color = "#3b82f6";
        badge.style.background = "rgba(59,130,246,0.15)";
        badge.style.borderColor = "rgba(59,130,246,0.25)";
      }
    }
    adjustStepDetailsHeight();
  };

  // Simulators for Fluid Typography
  window.updateFluidTypography = function() {
    const minSlider = document.getElementById("fluid-min-slider");
    const maxSlider = document.getElementById("fluid-max-slider");
    const vpSlider = document.getElementById("fluid-viewport-slider");

    const vpVal = document.getElementById("fluid-viewport-val");
    const previewContainer = document.getElementById("fluid-preview-container");
    const previewText = document.getElementById("fluid-preview-text");
    const formulaCode = document.getElementById("fluid-formula-code");

    if (!minSlider || !maxSlider || !vpSlider) return;

    const min = parseInt(minSlider.value) || 14;
    const max = parseInt(maxSlider.value) || 32;
    const vpPercent = parseInt(vpSlider.value) || 100;

    if (vpVal) {
      vpVal.innerText = `${vpPercent}%`;
    }
    if (previewContainer) {
      previewContainer.style.width = `${vpPercent}%`;
    }

    // Interpolate fluid font size based on viewport width (50% to 100%)
    const currentSize = Math.round(min + (max - min) * ((vpPercent - 50) / 50));
    if (previewText) {
      previewText.style.fontSize = `${currentSize}px`;
      previewText.innerText = `Fluid Text (${currentSize}px)`;
    }
    if (formulaCode) {
      const preferredRem = (min / 16).toFixed(2);
      const preferredVw = ((max - min) / 8).toFixed(1);
      formulaCode.innerText = `clamp(${min}px, ${preferredRem}rem + ${preferredVw}vw, ${max}px)`;
    }
    adjustStepDetailsHeight();
  };

  // Simulators for Touch Targets
  window.touchHits = 0;
  window.touchMisses = 0;
  window.simulateTouchClick = function(type, success) {
    if (success) {
      window.touchHits++;
      const hitEl = document.getElementById("touch-hit-cnt");
      if (hitEl) {
        hitEl.innerText = window.touchHits;
        hitEl.style.color = "#10b981";
        hitEl.style.textShadow = "0 0 10px rgba(16, 185, 129, 0.6)";
        setTimeout(() => {
          hitEl.style.textShadow = "none";
        }, 300);
      }
    } else {
      window.touchMisses++;
      const missEl = document.getElementById("touch-miss-cnt");
      if (missEl) {
        missEl.innerText = window.touchMisses;
        missEl.style.color = "#f43f5e";
        missEl.style.textShadow = "0 0 10px rgba(244, 63, 94, 0.6)";
        setTimeout(() => {
          missEl.style.textShadow = "none";
        }, 300);
      }
    }
  };

  // Simulators for Core Web Vitals
  window.simulateLayoutShift = function() {
    const zone = document.getElementById("cwv-shifting-zone");
    const content = document.getElementById("cwv-shifted-content");
    if (zone && content) {
      zone.style.paddingTop = "25px";
      zone.style.background = "rgba(239, 68, 68, 0.12)";
      zone.style.borderColor = "rgba(239, 68, 68, 0.4)";
      content.innerText = "⚠️ ВНИМАНИЕ: Сдвиг макета! Текст сместился вниз.";
      content.style.color = "#f87171";
    }
    
    // Update metric cards to poor
    const lcpCard = document.getElementById("cwv-lcp-card");
    const lcpVal = document.getElementById("cwv-lcp-val");
    const lcpStatus = document.getElementById("cwv-lcp-status");
    if (lcpCard && lcpVal && lcpStatus) {
      lcpCard.style.background = "rgba(239, 68, 68, 0.15)";
      lcpCard.style.borderColor = "rgba(239, 68, 68, 0.3)";
      lcpVal.innerText = "5.4s";
      lcpVal.style.color = "#f87171";
      lcpStatus.innerText = "POOR ❌";
      lcpStatus.style.background = "#ef4444";
    }

    const clsCard = document.getElementById("cwv-cls-card");
    const clsVal = document.getElementById("cwv-cls-val");
    const clsStatus = document.getElementById("cwv-cls-status");
    if (clsCard && clsVal && clsStatus) {
      clsCard.style.background = "rgba(239, 68, 68, 0.15)";
      clsCard.style.borderColor = "rgba(239, 68, 68, 0.3)";
      clsVal.innerText = "0.45";
      clsVal.style.color = "#f87171";
      clsStatus.innerText = "POOR ❌";
      clsStatus.style.background = "#ef4444";
    }

    const inpCard = document.getElementById("cwv-inp-card");
    const inpVal = document.getElementById("cwv-inp-val");
    const inpStatus = document.getElementById("cwv-inp-status");
    if (inpCard && inpVal && inpStatus) {
      inpCard.style.background = "rgba(239, 68, 68, 0.15)";
      inpCard.style.borderColor = "rgba(239, 68, 68, 0.3)";
      inpVal.innerText = "240ms";
      inpVal.style.color = "#f87171";
      inpStatus.innerText = "POOR ❌";
      inpStatus.style.background = "#ef4444";
    }
  };

  window.optimizeCoreWebVitals = function() {
    const zone = document.getElementById("cwv-shifting-zone");
    const content = document.getElementById("cwv-shifted-content");
    if (zone && content) {
      zone.style.paddingTop = "4px";
      zone.style.background = "rgba(16, 185, 129, 0.1)";
      zone.style.borderColor = "rgba(16, 185, 129, 0.4)";
      content.innerText = "✅ Место под контент зарезервировано (CLS = 0)";
      content.style.color = "#34d399";
    }

    // Update metric cards to optimized
    const lcpCard = document.getElementById("cwv-lcp-card");
    const lcpVal = document.getElementById("cwv-lcp-val");
    const lcpStatus = document.getElementById("cwv-lcp-status");
    if (lcpCard && lcpVal && lcpStatus) {
      lcpCard.style.background = "rgba(16, 185, 129, 0.15)";
      lcpCard.style.borderColor = "rgba(16, 185, 129, 0.3)";
      lcpVal.innerText = "1.2s";
      lcpVal.style.color = "#34d399";
      lcpStatus.innerText = "GOOD 🟢";
      lcpStatus.style.background = "#10b981";
    }

    const clsCard = document.getElementById("cwv-cls-card");
    const clsVal = document.getElementById("cwv-cls-val");
    const clsStatus = document.getElementById("cwv-cls-status");
    if (clsCard && clsVal && clsStatus) {
      clsCard.style.background = "rgba(16, 185, 129, 0.15)";
      clsCard.style.borderColor = "rgba(16, 185, 129, 0.3)";
      clsVal.innerText = "0.01";
      clsVal.style.color = "#34d399";
      clsStatus.innerText = "GOOD 🟢";
      clsStatus.style.background = "#10b981";
    }

    const inpCard = document.getElementById("cwv-inp-card");
    const inpVal = document.getElementById("cwv-inp-val");
    const inpStatus = document.getElementById("cwv-inp-status");
    if (inpCard && inpVal && inpStatus) {
      inpCard.style.background = "rgba(16, 185, 129, 0.15)";
      inpCard.style.borderColor = "rgba(16, 185, 129, 0.3)";
      inpVal.innerText = "45ms";
      inpVal.style.color = "#34d399";
      inpStatus.innerText = "GOOD 🟢";
      inpStatus.style.background = "#10b981";
    }
  };

  // Simulators for Perceived Performance
  window.simulateSkeletonLoading = function() {
    const btn = document.getElementById("perc-simulate-btn");
    const spinnerLoader = document.getElementById("perc-spinner-loader");
    const spinnerContent = document.getElementById("perc-spinner-content");
    const skeletonLoader = document.getElementById("perc-skeleton-loader");
    const skeletonContent = document.getElementById("perc-skeleton-content");

    if (!btn || window.percLoadingActive) return;

    window.percLoadingActive = true;
    btn.disabled = true;
    
    if (spinnerLoader) spinnerLoader.style.display = "flex";
    if (spinnerContent) spinnerContent.style.display = "none";
    if (skeletonLoader) skeletonLoader.style.display = "flex";
    if (skeletonContent) skeletonContent.style.display = "none";

    let timeLeft = 2.0;
    btn.innerText = `Загрузка... (${timeLeft.toFixed(1)}с)`;

    const interval = setInterval(() => {
      timeLeft -= 0.2;
      if (timeLeft <= 0) {
        clearInterval(interval);
        window.percLoadingActive = false;
        btn.disabled = false;
        btn.innerText = "Запустить симуляцию (2 сек)";

        if (spinnerLoader) spinnerLoader.style.display = "none";
        if (spinnerContent) spinnerContent.style.display = "block";
        if (skeletonLoader) skeletonLoader.style.display = "none";
        if (skeletonContent) skeletonContent.style.display = "block";
      } else {
        btn.innerText = `Загрузка... (${timeLeft.toFixed(1)}с)`;
      }
    }, 200);
  };

  // Simulators for Image Optimization
  window.changeImageFormatType = function(format) {
    const pngBtn = document.getElementById("img-opt-png-btn");
    const webpBtn = document.getElementById("img-opt-webp-btn");
    const avifBtn = document.getElementById("img-opt-avif-btn");
    
    const sizeVal = document.getElementById("img-opt-size-val");
    const timeVal = document.getElementById("img-opt-time-val");
    const statusVal = document.getElementById("img-opt-status-val");
    const progressBar = document.getElementById("img-opt-progress-bar");

    if (!pngBtn || !webpBtn || !avifBtn || !sizeVal || !timeVal || !statusVal || !progressBar) return;

    // Reset styles
    [pngBtn, webpBtn, avifBtn].forEach(b => {
      b.style.border = "1px solid rgba(255,255,255,0.1)";
      b.style.background = "rgba(0,0,0,0.3)";
      b.style.color = "#a1a1aa";
    });

    if (format === 'png') {
      pngBtn.style.border = "1px solid rgba(239, 68, 68, 0.4)";
      pngBtn.style.background = "rgba(239, 68, 68, 0.15)";
      pngBtn.style.color = "#fff";

      sizeVal.innerText = "1.8 MB";
      timeVal.innerText = "6.4s";
      timeVal.style.color = "#f87171";
      statusVal.innerText = "Плохо 🔴";
      statusVal.style.color = "#f87171";
      progressBar.style.width = "100%";
      progressBar.style.background = "#ef4444";
    } else if (format === 'webp') {
      webpBtn.style.border = "1px solid rgba(167, 139, 250, 0.4)";
      webpBtn.style.background = "rgba(167, 139, 250, 0.15)";
      webpBtn.style.color = "#fff";

      sizeVal.innerText = "120 KB";
      timeVal.innerText = "0.4s";
      timeVal.style.color = "#34d399";
      statusVal.innerText = "Хорошо 🟢";
      statusVal.style.color = "#34d399";
      progressBar.style.width = "20%";
      progressBar.style.background = "#8b5cf6";
    } else if (format === 'avif') {
      avifBtn.style.border = "1px solid rgba(16, 185, 129, 0.4)";
      avifBtn.style.background = "rgba(16, 185, 129, 0.15)";
      avifBtn.style.color = "#fff";

      sizeVal.innerText = "54 KB";
      timeVal.innerText = "0.2s";
      timeVal.style.color = "#10b981";
      statusVal.innerText = "Отлично 🟢";
      statusVal.style.color = "#10b981";
      progressBar.style.width = "9%";
      progressBar.style.background = "#10b981";
    }
  };

  // Simulators for WCAG Contrast Checker
  window.updateContrastSlider = function(value) {
    const textPreview = document.getElementById("contrast-preview-text");
    const ratioVal = document.getElementById("contrast-ratio-val");
    const badge = document.getElementById("contrast-status-badge");

    if (!textPreview || !ratioVal || !badge) return;

    const val = parseInt(value);
    
    // Interpolate ratio from 1.8 to 8.5
    const ratio = 1.8 + (val / 100) * 6.7;
    ratioVal.innerText = `${ratio.toFixed(1)}:1`;

    // Interpolate color from rgb(80,70,90) up to rgb(251,191,36)
    const r = Math.round(80 + (val / 100) * 171);
    const g = Math.round(70 + (val / 100) * 121);
    const b = Math.round(90 - (val / 100) * 54);
    textPreview.style.color = `rgb(${r}, ${g}, ${b})`;

    if (ratio < 4.5) {
      ratioVal.style.color = "#f87171";
      badge.innerText = "FAIL ❌";
      badge.style.background = "#ef4444";
      badge.style.color = "#fff";
    } else if (ratio >= 4.5 && ratio < 7.0) {
      ratioVal.style.color = "#34d399";
      badge.innerText = "PASS AA ✅";
      badge.style.background = "#10b981";
      badge.style.color = "#fff";
    } else {
      ratioVal.style.color = "#a78bfa";
      badge.innerText = "PASS AAA 🌟";
      badge.style.background = "#6366f1";
      badge.style.color = "#fff";
    }
  };

  // Simulators for Keyboard Navigation Focus Trap
  window.focusTrapActive = false;
  window.trappedFocusIndex = 0;
  
  window.toggleKeyboardFocusTrap = function() {
    window.focusTrapActive = !window.focusTrapActive;
    
    const indicator = document.getElementById("trap-status-indicator");
    const modalBox = document.getElementById("trap-modal-box");
    
    if (!indicator || !modalBox) return;

    if (window.focusTrapActive) {
      indicator.innerText = "АКТИВИРОВАНА 🟢";
      indicator.style.color = "#10b981";
      modalBox.style.borderColor = "rgba(167, 139, 250, 0.6)";
      modalBox.style.boxShadow = "0 0 10px rgba(139, 92, 246, 0.15)";
      
      // Select index 0 to start
      window.trappedFocusIndex = 0;
      window.updateTrappedFocusHighlight();
    } else {
      indicator.innerText = "ОТКЛЮЧЕНА ❌";
      indicator.style.color = "#ef4444";
      modalBox.style.borderColor = "rgba(255,255,255,0.06)";
      modalBox.style.boxShadow = "none";
      
      // Clear styles
      const input = document.getElementById("trap-el-input");
      const button = document.getElementById("trap-el-button");
      const link = document.getElementById("trap-el-link");
      
      if (input) input.style.borderColor = "rgba(255,255,255,0.1)";
      if (button) {
        button.style.borderColor = "rgba(255,255,255,0.1)";
        button.style.boxShadow = "none";
      }
      if (link) {
        link.style.outline = "none";
        link.style.color = "#a78bfa";
      }
    }
  };

  window.cycleTrappedFocus = function() {
    if (!window.focusTrapActive) {
      // Just visually alert about focus trap being disabled
      const modalBox = document.getElementById("trap-modal-box");
      if (modalBox) {
        modalBox.style.borderColor = "rgba(239, 68, 68, 0.4)";
        setTimeout(() => {
          if (!window.focusTrapActive) modalBox.style.borderColor = "rgba(255,255,255,0.06)";
        }, 300);
      }
      return;
    }

    window.trappedFocusIndex = (window.trappedFocusIndex + 1) % 3;
    window.updateTrappedFocusHighlight();
  };

  window.updateTrappedFocusHighlight = function() {
    const input = document.getElementById("trap-el-input");
    const button = document.getElementById("trap-el-button");
    const link = document.getElementById("trap-el-link");

    if (!input || !button || !link) return;

    // Reset styles
    input.style.borderColor = "rgba(255,255,255,0.1)";
    button.style.borderColor = "rgba(255,255,255,0.1)";
    button.style.boxShadow = "none";
    link.style.outline = "none";
    link.style.color = "#a78bfa";

    if (window.trappedFocusIndex === 0) {
      input.style.borderColor = "#a78bfa";
      input.focus();
    } else if (window.trappedFocusIndex === 1) {
      button.style.borderColor = "#a78bfa";
      button.style.boxShadow = "0 0 8px rgba(167, 139, 250, 0.4)";
      button.focus();
    } else if (window.trappedFocusIndex === 2) {
      link.style.outline = "1.5px solid #8b5cf6";
      link.style.color = "#fff";
      link.focus();
    }
  };

  // Simulators for Screen Reader
  window.clickScreenReaderElement = function(type) {
    const textEl = document.getElementById("sr-narrator-text");
    if (!textEl) return;

    if (type === 'bad') {
      textEl.innerText = '📢 Озвучка: "Кнопка. Пустое описание." (Пользователь не знает назначения кнопки!) ❌';
      textEl.style.color = "#ef4444";
    } else if (type === 'good') {
      textEl.innerText = '📢 Озвучка: "Кнопка. Открыть настройки профиля. Инструмент." 🟢';
      textEl.style.color = "#34d399";
    } else if (type === 'alert') {
      textEl.innerText = '📢 Озвучка (прерывание по role="alert"): "Внимание! Ваше сетевое соединение разорвано." ⚠️';
      textEl.style.color = "#fbbf24";
      
      const parent = textEl.parentElement;
      if (parent) {
        parent.style.borderColor = "rgba(245, 158, 11, 0.5)";
        parent.style.boxShadow = "0 0 10px rgba(245, 158, 11, 0.2)";
        setTimeout(() => {
          parent.style.borderColor = "rgba(255,255,255,0.06)";
          parent.style.boxShadow = "none";
        }, 500);
      }
    }
  };
  
  // Simulators for Prisma Safety Guardrails (Deprecated - replaced with static rich details explaining reset/retest safety)

  // Helper to dynamically adjust expanded step card heights
  function adjustStepDetailsHeight() {
    const activeDetails = document.querySelector('.step-card.expanded .step-details');
    if (activeDetails) {
      activeDetails.style.maxHeight = '1200px';
    }
  }

  // ================= NEW LEVEL 4 WIDGETS =================
  // 1. Design Tokens Widget
  window.updateDesignToken = function(type, value) {
    const card = document.getElementById("dt-preview-card");
    const badge = document.getElementById("dt-preview-badge");
    const btn = document.getElementById("dt-preview-btn");
    if (!card || !badge || !btn) return;

    if (type === 'color') {
      badge.style.backgroundColor = value;
      btn.style.backgroundColor = value;
      card.style.borderColor = value + "33"; // subtle opacity
      
      const parent = card.parentElement;
      if (parent) {
        const colorBtns = parent.querySelectorAll('button[onclick*="updateDesignToken(\'color\'"]');
        colorBtns.forEach(b => {
          // Normalize color check
          const bg = b.style.backgroundColor;
          if (bg === value || (value === '#3b82f6' && bg.includes('rgb(59, 130, 246)')) || 
              (value === '#10b981' && bg.includes('rgb(16, 185, 129)')) || 
              (value === '#f59e0b' && bg.includes('rgb(245, 158, 11)')) || 
              (value === '#ec4899' && bg.includes('rgb(236, 72, 153)')) || 
              (value === '#8b5cf6' && bg.includes('rgb(139, 92, 246)'))) {
            b.style.borderColor = "#fff";
          } else {
            b.style.borderColor = "rgba(255, 255, 255, 0.2)";
          }
        });
      }
    } else if (type === 'radius') {
      card.style.borderRadius = `${value}px`;
      btn.style.borderRadius = `${value}px`;
    } else if (type === 'padding') {
      card.style.padding = `${value}px`;
    }
  };

  // 2. Dark Mode Theme Widget
  window.toggleDarkModeTheme = function(theme) {
    const box = document.getElementById("dm-preview-box");
    const title = document.getElementById("dm-preview-title");
    const text = document.getElementById("dm-preview-text");
    const badge = document.getElementById("dm-preview-badge");
    
    const lightBtn = document.getElementById("dm-btn-light");
    const darkBtn = document.getElementById("dm-btn-dark");
    const systemBtn = document.getElementById("dm-btn-system");
    
    if (!box || !title || !text || !badge || !lightBtn || !darkBtn || !systemBtn) return;
    
    [lightBtn, darkBtn, systemBtn].forEach(btn => {
      btn.style.background = "rgba(255, 255, 255, 0.05)";
      btn.style.borderColor = "rgba(255, 255, 255, 0.1)";
      btn.style.color = "#fff";
    });
    
    let activeBtn = systemBtn;
    if (theme === 'light') activeBtn = lightBtn;
    else if (theme === 'dark') activeBtn = darkBtn;
    
    activeBtn.style.background = "rgba(139, 92, 246, 0.2)";
    activeBtn.style.borderColor = "rgba(139, 92, 246, 0.4)";
    activeBtn.style.color = "#a78bfa";
    
    let resolvedTheme = theme;
    if (theme === 'system') {
      resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    if (resolvedTheme === 'dark') {
      box.style.background = "#0f172a";
      box.style.color = "#fff";
      title.innerText = "Тёмная тема";
      title.style.color = "#fff";
      text.style.color = "#94a3b8";
      badge.innerText = theme === 'system' ? "Active (System: Dark)" : "Active";
      badge.style.background = "rgba(167, 139, 250, 0.15)";
      badge.style.color = "#a78bfa";
      badge.style.borderColor = "rgba(167, 139, 250, 0.3)";
    } else {
      box.style.background = "#f8fafc";
      box.style.color = "#0f172a";
      title.innerText = "Светлая тема";
      title.style.color = "#0f172a";
      text.style.color = "#475569";
      badge.innerText = theme === 'system' ? "Active (System: Light)" : "Active";
      badge.style.background = "rgba(59, 130, 246, 0.1)";
      badge.style.color = "#3b82f6";
      badge.style.borderColor = "rgba(59, 130, 246, 0.2)";
    }
  };

  // 3. Focus Management Widget
  window.fmFocusIndex = 0;
  window.fmElements = ["fm-modal-close", "fm-modal-input", "fm-modal-save", "fm-modal-tab-btn"];
  
  window.toggleFocusManagementModal = function(show) {
    const overlay = document.getElementById("fm-modal-overlay");
    const openBtn = document.getElementById("fm-open-btn");
    
    if (!overlay || !openBtn) return;
    
    if (show) {
      overlay.style.display = "block";
      openBtn.style.display = "none";
      window.fmFocusIndex = 1; // start on input
      window.updateFmFocusHighlight();
    } else {
      overlay.style.display = "none";
      openBtn.style.display = "inline-block";
      openBtn.focus();
      openBtn.style.outline = "2px solid #34d399";
      setTimeout(() => { openBtn.style.outline = "none"; }, 1000);
    }
  };
  
  window.cycleFocusManagement = function() {
    window.fmFocusIndex = (window.fmFocusIndex + 1) % window.fmElements.length;
    window.updateFmFocusHighlight();
  };
  
  window.updateFmFocusHighlight = function() {
    const focusLbl = document.getElementById("fm-current-focus-lbl");
    window.fmElements.forEach((id, idx) => {
      const el = document.getElementById(id);
      if (!el) return;
      
      if (idx === window.fmFocusIndex) {
        el.focus();
        el.style.outline = "2px solid #a78bfa";
        el.style.outlineOffset = "2px";
        if (focusLbl) {
          focusLbl.innerText = `Текущий фокус: ${el.tagName.toLowerCase()}${el.id ? '#' + el.id.replace('fm-modal-', '') : ''}`;
        }
      } else {
        el.style.outline = "none";
      }
    });
  };

  // 4. Framer Motion Widget
  window.runFramerMotionSim = function(type) {
    const target = document.getElementById("fmo-anim-target");
    if (!target) return;
    
    target.style.transform = "none";
    target.style.opacity = "1";
    target.innerHTML = "✨";
    
    if (type === 'fade') {
      target.style.transition = "none";
      target.style.opacity = "0";
      setTimeout(() => {
        target.style.transition = "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
        target.style.opacity = "1";
      }, 50);
    } else if (type === 'spring') {
      target.style.transition = "none";
      target.style.transform = "scale(0.3) rotate(-45deg)";
      setTimeout(() => {
        target.style.transition = "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)";
        target.style.transform = "scale(1.2) rotate(10deg)";
        setTimeout(() => {
          target.style.transform = "scale(1) rotate(0deg)";
        }, 300);
      }, 50);
    } else if (type === 'stagger') {
      target.style.transition = "none";
      target.style.width = "100%";
      target.style.height = "auto";
      target.style.background = "transparent";
      target.style.display = "flex";
      target.style.flexDirection = "column";
      target.style.gap = "4px";
      target.innerHTML = `
        <div class="st-item" style="background:#ec4899; height:12px; border-radius:3px; opacity:0; transform:translateY(10px); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);"></div>
        <div class="st-item" style="background:#a78bfa; height:12px; border-radius:3px; opacity:0; transform:translateY(10px); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); transition-delay: 0.1s;"></div>
        <div class="st-item" style="background:#8b5cf6; height:12px; border-radius:3px; opacity:0; transform:translateY(10px); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); transition-delay: 0.2s;"></div>
      `;
      
      setTimeout(() => {
        const items = target.querySelectorAll(".st-item");
        items.forEach(el => {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        });
      }, 50);
      
      setTimeout(() => {
        target.style.width = "40px";
        target.style.height = "40px";
        target.style.background = "linear-gradient(135deg, #ec4899, #8b5cf6)";
        target.style.display = "flex";
        target.style.flexDirection = "row";
        target.style.gap = "0";
        target.style.transition = "all 0.3s";
        target.innerHTML = "✨";
      }, 3000);
    }
  };

  // 5. Prefers Reduced Motion Widget
  window.reducedMotionActive = false;
  window.toggleReducedMotionSim = function() {
    window.reducedMotionActive = !window.reducedMotionActive;
    
    const status = document.getElementById("prm-status-lbl");
    const spinner = document.getElementById("prm-spinner");
    const btn = document.getElementById("prm-toggle-btn");
    
    if (!status || !spinner || !btn) return;
    
    if (window.reducedMotionActive) {
      status.innerText = "АКТИВИРОВАНА 🟢";
      status.style.color = "#10b981";
      spinner.className = "spinning-slow";
      btn.innerText = "Отключить Reduced Motion 🔓";
      btn.style.borderColor = "rgba(16, 185, 129, 0.4)";
      btn.style.color = "#10b981";
      btn.style.background = "rgba(16, 185, 129, 0.15)";
    } else {
      status.innerText = "ВЫКЛЮЧЕНА 🚫";
      status.style.color = "#ef4444";
      spinner.className = "spinning-fast";
      btn.innerText = "Эмулировать Reduced Motion 🔒";
      btn.style.borderColor = "rgba(251, 191, 36, 0.3)";
      btn.style.color = "#fbbf24";
      btn.style.background = "rgba(251, 191, 36, 0.15)";
    }
  };

  // 6. Form Validation Widget
  window.validateFormWidget = function() {
    const email = document.getElementById("fv-email");
    const emailError = document.getElementById("fv-email-error");
    const pass = document.getElementById("fv-password");
    const lenRule = document.getElementById("fv-pass-len");
    const numRule = document.getElementById("fv-pass-num");
    const btn = document.getElementById("fv-submit-btn");
    const successMsg = document.getElementById("fv-success-msg");
    
    if (!email || !pass || !btn) return;
    
    if (successMsg) successMsg.style.display = "none";
    
    const emailVal = email.value.trim();
    const passVal = pass.value;
    
    const emailRegex = /^[^s@]+@[^s@]+\.[^s@]+$/;
    const emailValid = emailRegex.test(emailVal);
    
    if (emailVal === "") {
      if (emailError) emailError.style.display = "none";
      email.style.borderColor = "rgba(255,255,255,0.1)";
    } else if (emailValid) {
      if (emailError) emailError.style.display = "none";
      email.style.borderColor = "#10b981";
    } else {
      if (emailError) emailError.style.display = "block";
      email.style.borderColor = "#ef4444";
    }
    
    const passLenValid = passVal.length >= 6;
    const passNumValid = /\d/.test(passVal);
    
    if (passVal === "") {
      if (lenRule) { lenRule.style.color = "#a1a1aa"; lenRule.innerText = "• Мин. 6 символов"; }
      if (numRule) { numRule.style.color = "#a1a1aa"; numRule.innerText = "• Мин. 1 цифра"; }
      pass.style.borderColor = "rgba(255,255,255,0.1)";
    } else {
      if (lenRule) {
        lenRule.style.color = passLenValid ? "#10b981" : "#ef4444";
        lenRule.innerText = passLenValid ? "✓ Мин. 6 символов" : "✗ Мин. 6 символов";
      }
      if (numRule) {
        numRule.style.color = passNumValid ? "#10b981" : "#ef4444";
        numRule.innerText = passNumValid ? "✓ Мин. 1 цифра" : "✗ Мин. 1 цифра";
      }
      pass.style.borderColor = (passLenValid && passNumValid) ? "#10b981" : "#ef4444";
    }
    
    const allValid = emailValid && passLenValid && passNumValid;
    if (allValid) {
      btn.disabled = false;
      btn.style.cursor = "pointer";
      btn.style.background = "#10b981";
      btn.style.color = "#fff";
      btn.style.borderColor = "#10b981";
    } else {
      btn.disabled = true;
      btn.style.cursor = "not-allowed";
      btn.style.background = "rgba(255,255,255,0.05)";
      btn.style.color = "#6b7280";
      btn.style.borderColor = "rgba(255,255,255,0.08)";
    }
  };
  
  window.submitFormWidget = function() {
    const successMsg = document.getElementById("fv-success-msg");
    const btn = document.getElementById("fv-submit-btn");
    if (successMsg) {
      successMsg.style.display = "block";
      if (btn) {
        btn.disabled = true;
        btn.style.cursor = "not-allowed";
      }
    }
  };

  // ================= NEW LEVEL 4 WIDGETS =================
  window.setSimInputState = function(state) {
    const input = document.getElementById("sim-input");
    const loader = document.getElementById("sim-input-loader");
    if (!input) return;
    
    // Reset defaults
    input.disabled = false;
    input.value = "";
    input.style.opacity = "1";
    input.style.borderColor = "rgba(255,255,255,0.1)";
    input.style.boxShadow = "none";
    input.style.color = "#fff";
    if (loader) loader.style.display = "none";
    
    if (state === "focus") {
      input.focus();
      input.style.borderColor = "#3b82f6";
      input.style.boxShadow = "0 0 10px rgba(59, 130, 246, 0.4)";
    } else if (state === "filled") {
      input.value = "Алексей Иванов";
      input.style.borderColor = "#10b981";
    } else if (state === "error") {
      input.value = "invalid-email@";
      input.style.borderColor = "#ef4444";
      input.style.boxShadow = "0 0 10px rgba(239, 68, 68, 0.4)";
    } else if (state === "disabled") {
      input.disabled = true;
      input.style.opacity = "0.5";
      input.style.borderColor = "rgba(255,255,255,0.05)";
    } else if (state === "loading") {
      input.disabled = true;
      input.value = "Проверка занятости имени...";
      input.style.borderColor = "#3b82f6";
      if (loader) loader.style.display = "block";
    }
  };

  window.testAutofillSubmit = function() {
    const status = document.getElementById("autofill-status");
    if (status) {
      status.style.display = "block";
      status.style.opacity = "0";
      setTimeout(() => {
        status.style.transition = "opacity 0.3s ease";
        status.style.opacity = "1";
      }, 50);
    }
  };

  window.switchBottomNavTab = function(tabId) {
    const tabs = ["home", "search", "cart", "profile"];
    const emojis = { home: "🏠", search: "🔍", cart: "🛒", profile: "👤" };
    const titles = { home: "Главная", search: "Поиск", cart: "Корзина", profile: "Профиль" };
    const screen = document.getElementById("bottom-nav-screen");
    
    tabs.forEach(t => {
      const el = document.getElementById(`bn-tab-${t}`);
      if (el) {
        el.style.opacity = "0.6";
        el.style.transform = "scale(1)";
        const iconSpan = el.querySelector("span:first-child");
        if (iconSpan) iconSpan.style.filter = "grayscale(1)";
        const txtSpan = el.querySelector("span:last-child");
        if (txtSpan) {
          txtSpan.style.color = "#a1a1aa";
          txtSpan.style.fontWeight = "normal";
        }
      }
    });

    const activeTab = document.getElementById(`bn-tab-${tabId}`);
    if (activeTab) {
      activeTab.style.opacity = "1";
      activeTab.style.transform = "scale(1.15)";
      const iconSpan = activeTab.querySelector("span:first-child");
      if (iconSpan) iconSpan.style.filter = "grayscale(0)";
      const txtSpan = activeTab.querySelector("span:last-child");
      if (txtSpan) {
        txtSpan.style.color = "#10b981";
        txtSpan.style.fontWeight = "bold";
      }
    }

    if (screen) {
      screen.style.transform = "scale(0.95)";
      screen.style.opacity = "0.5";
      setTimeout(() => {
        screen.innerText = `Раздел: ${titles[tabId]} ${emojis[tabId]}`;
        screen.style.transform = "scale(1)";
        screen.style.opacity = "1";
      }, 150);
    }
  };

  window.startSwipeWidget = function(e) {
    const swipeItem = document.getElementById("swipe-item");
    const statusMsg = document.getElementById("swipe-status-msg");
    if (!swipeItem) return;
    
    let startX = e.clientX || (e.touches && e.touches[0].clientX);
    let currentX = 0;
    let isSwiping = true;
    swipeItem.style.transition = "none";
    
    function onMove(moveEvent) {
      if (!isSwiping) return;
      const x = moveEvent.clientX || (moveEvent.touches && moveEvent.touches[0].clientX);
      const diffX = x - startX;
      if (diffX < 0) {
        currentX = Math.max(diffX, -100);
        swipeItem.style.transform = `translateX(${currentX}px)`;
      }
    }
    
    function onEnd() {
      if (!isSwiping) return;
      isSwiping = false;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onEnd);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      
      swipeItem.style.transition = "transform 0.2s ease-out";
      if (currentX <= -65) {
        swipeItem.style.transform = "translateX(-100%)";
        setTimeout(() => {
          const parent = swipeItem.parentElement;
          if (parent) {
            parent.style.transition = "all 0.3s ease";
            parent.style.height = "0";
            parent.style.marginTop = "0";
            parent.style.opacity = "0";
            parent.style.padding = "0";
            parent.style.border = "none";
          }
          if (statusMsg) {
            statusMsg.style.display = "block";
            statusMsg.style.opacity = "0";
            setTimeout(() => {
              statusMsg.style.transition = "opacity 0.3s ease";
              statusMsg.style.opacity = "1";
            }, 50);
          }
        }, 200);
      } else {
        swipeItem.style.transform = "translateX(0)";
      }
    }
    
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onEnd);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onEnd);
  };

  window.togglePwaOfflineSim = function() {
    const status = document.getElementById("pwa-network-status");
    const btn = document.getElementById("pwa-offline-btn");
    if (!status || !btn) return;
    
    if (status.innerText.includes("ONLINE")) {
      status.innerText = "OFFLINE 🔌";
      status.style.color = "#ef4444";
      btn.innerText = "Вернуться в Online режим 🔌";
      btn.style.background = "rgba(239, 68, 68, 0.15)";
      btn.style.borderColor = "rgba(239, 68, 68, 0.3)";
      btn.style.color = "#f87171";
    } else {
      status.innerText = "ONLINE 📶";
      status.style.color = "#10b981";
      btn.innerText = "Имитировать Offline режим 🔌";
      btn.style.background = "rgba(139, 92, 246, 0.15)";
      btn.style.borderColor = "rgba(139, 92, 246, 0.3)";
      btn.style.color = "#a78bfa";
    }
  };

  window.simulatePwaInstall = function() {
    const btn = document.getElementById("pwa-install-btn");
    if (!btn) return;
    btn.disabled = true;
    btn.innerText = "Установка...";
    btn.style.background = "rgba(255,255,255,0.05)";
    btn.style.color = "#6b7280";
    setTimeout(() => {
      btn.innerText = "Успешно установлено! 🎉";
      btn.style.background = "rgba(16, 185, 129, 0.2)";
      btn.style.color = "#10b981";
    }, 1200);
  };

  // ================= 6 NEW LEVEL 4 ARCHITECTURAL WIDGETS =================

  // 1. Co-location & Server Actions
  window.toggleColocationView = function(mode) {
    const btnApi = document.getElementById("btn-coloc-api");
    const btnAction = document.getElementById("btn-coloc-action");
    const codeView = document.getElementById("colocation-code-view");
    if (!codeView) return;

    if (btnApi) btnApi.classList.toggle("active", mode === "api");
    if (btnAction) btnAction.classList.toggle("active", mode === "action");

    if (mode === "api") {
      codeView.innerHTML = `<span style="color: #6b7280;">// app/api/feedback/route.js</span>
<span style="color: #f43f5e;">export async function</span> <span style="color: #3b82f6;">POST</span>(req) {
  <span style="color: #f59e0b;">const</span> data = <span style="color: #f43f5e;">await</span> req.json();
  <span style="color: #f43f5e;">await</span> db.feedback.create({ data });
  <span style="color: #f43f5e;">return</span> Response.json({ success: <span style="color: #10b981;">true</span> });
}

<span style="color: #6b7280;">// app/components/Feedback.js (Separate bloated frontend file)</span>
<span style="color: #f43f5e;">export default function</span> <span style="color: #3b82f6;">Feedback</span>() {
  <span style="color: #f59e0b;">const</span> handleSubmit = <span style="color: #f43f5e;">async</span> (e) => {
    e.preventDefault();
    <span style="color: #f43f5e;">await</span> fetch(<span style="color: #10b981;">'/api/feedback'</span>, {
      method: <span style="color: #10b981;">'POST'</span>,
      body: JSON.stringify({ text })
    });
  };
  <span style="color: #f43f5e;">return</span> &lt;<span style="color: #ef4444;">form</span> onSubmit={handleSubmit}&gt;...&lt;/<span style="color: #ef4444;">form</span>&gt;;
}`;
    } else {
      codeView.innerHTML = `<span style="color: #6b7280;">// app/components/FeedbackForm.js (Single File Co-location)</span>
<span style="color: #10b981;">'use client'</span>;

<span style="color: #6b7280;">// Server Action co-located in the same component file!</span>
<span style="color: #f43f5e;">async function</span> <span style="color: #3b82f6;">submitFeedback</span>(formData) {
  <span style="color: #10b981;">'use server'</span>;
  <span style="color: #f59e0b;">const</span> text = formData.get(<span style="color: #10b981;">'text'</span>);
  <span style="color: #f43f5e;">await</span> db.feedback.create({ data: { text } });
}

<span style="color: #f43f5e;">export default function</span> <span style="color: #3b82f6;">FeedbackForm</span>() {
  <span style="color: #f43f5e;">return</span> (
    &lt;<span style="color: #ef4444;">form</span> action={<span style="color: #3b82f6;">submitFeedback</span>}&gt;
      &lt;<span style="color: #ef4444;">textarea</span> name=<span style="color: #10b981;">"text"</span> required /&gt;
      &lt;<span style="color: #ef4444;">button</span> type=<span style="color: #10b981;">"submit"</span>&gt;Отправить&lt;/<span style="color: #ef4444;">button</span>&gt;
    &lt;/<span style="color: #ef4444;">form</span>&gt;
  );
}`;
    }
  };

  window.submitColocationSim = function(e) {
    if (e) e.preventDefault();
    const input = document.getElementById("coloc-input");
    const status = document.getElementById("colocation-status");
    if (!status || !input || !input.value.trim()) return;

    status.style.display = "block";
    status.innerHTML = `<span style="color: #f59e0b;">⏳ Отправка Server Action...</span>`;
    
    setTimeout(() => {
      status.innerHTML = `<span style="color: #10b981; font-weight: bold;">🎉 Server Action успешно выполнен напрямую в БД! Введенный текст: "${input.value.trim()}"</span>`;
      input.value = "";
    }, 1000);
  };

  // 2. Tailwind CSS
  window.applyTailwindClassesSim = function(classesVal) {
    const previewBox = document.getElementById("tailwind-preview-box");
    const codeOutput = document.getElementById("tailwind-code-output");
    if (!previewBox) return;

    // Reset styles
    previewBox.style.background = "rgba(255,255,255,0.05)";
    previewBox.style.borderRadius = "4px";
    previewBox.style.boxShadow = "none";
    previewBox.style.animation = "none";
    previewBox.style.transform = "none";

    const classes = (classesVal || "").split(" ");
    let bg = "#475569";
    let radius = "4px";
    let shadow = "none";
    let animate = "none";

    classes.forEach(cls => {
      cls = cls.trim();
      if (cls === "bg-cyan-500") bg = "#06b6d4";
      if (cls === "bg-emerald-500") bg = "#10b981";
      if (cls === "bg-amber-500") bg = "#f59e0b";
      if (cls === "rounded-xl") radius = "12px";
      if (cls === "rounded-full") radius = "50%";
      if (cls === "rounded-lg") radius = "8px";
      if (cls === "shadow-lg") shadow = "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
      if (cls === "shadow-xl") shadow = "0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
      if (cls === "shadow-md") shadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
      if (cls === "animate-pulse") animate = "pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite";
    });

    previewBox.style.background = bg;
    previewBox.style.borderRadius = radius;
    previewBox.style.boxShadow = shadow;
    if (animate !== "none") {
      previewBox.style.animation = animate;
    }

    if (codeOutput) {
      codeOutput.innerText = `<div class="${classes.join(" ")}"></div>`;
    }
  };

  window.setTailwindPreset = function(preset) {
    const input = document.getElementById("tailwind-classes-input");
    if (!input) return;

    let text = "";
    if (preset === "pulse") text = "bg-cyan-500 rounded-xl shadow-lg animate-pulse";
    if (preset === "rotate") text = "bg-emerald-500 rounded-full shadow-md";
    if (preset === "warning") text = "bg-amber-500 rounded-lg shadow-xl";

    input.value = text;
    window.applyTailwindClassesSim(text);
  };

  // 3. Shadcn UI
  window.runShadcnInstallSim = function(comp) {
    const term = document.getElementById("shadcn-terminal");
    if (!term) return;

    term.innerHTML = `<span style="color: #6b7280;">$ npx shadcn@latest add ${comp}</span>\n`;
    let lines = [
      `⏳ Чтение конфигурации components.json...`,
      `✓ Найдено: TypeScript, Tailwind, Lucide React`,
      `⏳ Загрузка исходного кода для '${comp}' с реестра shadcn/ui...`,
      `✓ Скопировано в: components/ui/${comp}.tsx`,
      `🎉 Компонент '${comp}' успешно установлен и готов к кастомизации!`
    ];

    let currentLine = 0;
    function printNext() {
      if (currentLine < lines.length) {
        term.innerHTML += `<span style="color: ${currentLine === lines.length - 1 ? '#10b981' : '#a1a1aa'}">${lines[currentLine]}</span>\n`;
        term.scrollTop = term.scrollHeight;
        currentLine++;
        setTimeout(printNext, 400);
      }
    }
    setTimeout(printNext, 300);
  };

  // 4. Zustand Store
  window.zustandCount = 0;
  window.zustandTheme = "dark";
  window.updateZustandStoreSim = function(action) {
    const storeVal = document.getElementById("zustand-store-val");
    if (!storeVal) return;

    if (action === "inc") window.zustandCount++;
    if (action === "dec") window.zustandCount--;
    if (action === "theme") window.zustandTheme = window.zustandTheme === "dark" ? "light" : "dark";

    storeVal.innerHTML = `{
  <span style="color: #60a5fa;">count</span>: <span style="color: #f59e0b; font-weight: bold;">${window.zustandCount}</span>,
  <span style="color: #60a5fa;">theme</span>: <span style="color: #10b981;">"${window.zustandTheme}"</span>,
  <span style="color: #34d399;">actions</span>: {
    <span style="color: #a78bfa;">increment</span>: <span style="color: #ec4899;">[Function]</span>,
    <span style="color: #a78bfa;">toggleTheme</span>: <span style="color: #ec4899;">[Function]</span>
  }
}`;
  };

  // 5. Skeleton Screens
  window.runSkeletonDemo = function(mode) {
    const container = document.getElementById("loading-container-demo");
    const btnSpinner = document.getElementById("btn-skel-spinner");
    const btnSkel = document.getElementById("btn-skel-skeleton");
    if (!container) return;

    if (btnSpinner) btnSpinner.classList.toggle("active", mode === "spinner");
    if (btnSkel) btnSkel.classList.toggle("active", mode === "skeleton");

    container.innerHTML = "";
    if (mode === "spinner") {
      container.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; min-height: 80px;">
          <div class="spinner-demo" style="width: 24px; height: 24px; border: 2.5px solid rgba(255,255,255,0.1); border-top-color: #3b82f6; border-radius: 50%; animation: spin-fast 0.8s linear infinite; margin-bottom: 8px;"></div>
          <span style="font-size: 8.5px; color: #a1a1aa;">Загрузка данных...</span>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div style="display: flex; gap: 8px; width: 100%;">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.08); animation: pulse-slow 1.5s ease-in-out infinite;"></div>
          <div style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
            <div style="width: 60%; height: 10px; border-radius: 2px; background: rgba(255,255,255,0.08); animation: pulse-slow 1.5s ease-in-out infinite;"></div>
            <div style="width: 90%; height: 8px; border-radius: 2px; background: rgba(255,255,255,0.05); animation: pulse-slow 1.5s ease-in-out infinite;"></div>
          </div>
        </div>
      `;
    }
  };

  // 6. Optimistic UI
  window.optimisticLikes = 10;
  window.triggerOptimisticLike = function() {
    const isFail = document.getElementById("chk-opt-fail")?.checked;
    const latency = parseInt(document.getElementById("opt-latency-slider")?.value || "1000");
    const countEl = document.getElementById("optimistic-count");
    const status = document.getElementById("optimistic-status");
    if (!countEl || !status) return;

    // Immediately increment (Optimistic update!)
    window.optimisticLikes++;
    countEl.innerText = window.optimisticLikes;
    countEl.style.transform = "scale(1.3)";
    setTimeout(() => { countEl.style.transform = "scale(1)"; }, 150);

    status.style.display = "block";
    status.innerHTML = `<span style="color: #3b82f6;">⚡ Оптимистичное обновление: +1 Лайк! Отправка сетевого запроса (${latency}мс)...</span>`;

    setTimeout(() => {
      if (isFail) {
        // Rollback!
        window.optimisticLikes--;
        countEl.innerText = window.optimisticLikes;
        countEl.style.transform = "scale(0.8)";
        setTimeout(() => { countEl.style.transform = "scale(1)"; }, 150);
        status.innerHTML = `<span style="color: #ef4444; font-weight: bold;">❌ Запрос отклонен! Откатываем лайк назад к ${window.optimisticLikes}</span>`;
      } else {
        status.innerHTML = `<span style="color: #10b981; font-weight: bold;">✓ Запрос подтвержден сервером! Лайк зафиксирован.</span>`;
      }
    }, latency);
  };

  // 7. Focus Traps
  window.openFocusTrapModal = function() {
    const modal = document.getElementById("focustrap-modal");
    const overlay = document.getElementById("focustrap-overlay");
    if (!modal || !overlay) return;
    modal.style.display = "block";
    overlay.style.display = "block";

    // Focus first input
    const firstInput = document.getElementById("focustrap-input-1");
    if (firstInput) firstInput.focus();

    // Attach keyboard event listener
    const handleKeyDown = function(e) {
      if (e.key === "Escape") {
        window.closeFocusTrapModal();
        return;
      }
      if (e.key === "Tab") {
        const focusables = [
          document.getElementById("focustrap-input-1"),
          document.getElementById("focustrap-input-2"),
          document.getElementById("focustrap-submit-btn"),
          document.getElementById("focustrap-close-btn")
        ].filter(Boolean);
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };
    window._focustrap_handler = handleKeyDown;
    window.addEventListener("keydown", handleKeyDown);
  };

  window.closeFocusTrapModal = function() {
    const modal = document.getElementById("focustrap-modal");
    const overlay = document.getElementById("focustrap-overlay");
    if (modal) modal.style.display = "none";
    if (overlay) overlay.style.display = "none";
    if (window._focustrap_handler) {
      window.removeEventListener("keydown", window._focustrap_handler);
      window._focustrap_handler = null;
    }
    // Return focus to open button
    const openBtn = document.getElementById("focustrap-open-btn");
    if (openBtn) openBtn.focus();
  };

  window.submitFocusTrapModal = function() {
    alert("Данные успешно отправлены внутри закрытого контура фокуса!");
    window.closeFocusTrapModal();
  };

  // 8. Framer Motion Anim
  window.runFramerAnimation = function(type) {
    const box = document.getElementById("framer-anim-box");
    if (!box) return;

    box.style.animation = "none";
    box.style.transform = "none";
    box.offsetHeight; // trigger reflow

    if (type === 'bounce') {
      box.style.transform = "translateY(-20px)";
      setTimeout(() => {
        box.style.transform = "translateY(0) scaleY(0.9)";
        setTimeout(() => {
          box.style.transform = "translateY(0) scaleY(1)";
        }, 100);
      }, 200);
    } else if (type === 'rotate') {
      box.style.transform = "rotate(360deg) scale(1.1)";
      setTimeout(() => {
        box.style.transform = "rotate(360deg) scale(1)";
      }, 300);
    } else if (type === 'shake') {
      box.style.animation = "shake-anim 0.3s ease-in-out";
    } else if (type === 'pulse') {
      box.style.transform = "scale(1.3)";
      setTimeout(() => {
        box.style.transform = "scale(1)";
      }, 200);
    }
  };

  // 9. Error Recovery
  window.triggerComponentError = function() {
    const content = document.getElementById("error-boundary-content");
    const fallback = document.getElementById("error-boundary-fallback");
    const view = document.getElementById("error-boundary-view");
    if (!content || !fallback || !view) return;

    content.style.display = "none";
    fallback.style.display = "block";
    view.style.border = "1px solid #ef4444";
    view.style.background = "rgba(239, 68, 68, 0.05)";
  };

  window.recoverComponent = function() {
    const content = document.getElementById("error-boundary-content");
    const fallback = document.getElementById("error-boundary-fallback");
    const view = document.getElementById("error-boundary-view");
    if (!content || !fallback || !view) return;

    fallback.innerHTML = `
      <div class="spinner-demo" style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.1); border-top-color: #f59e0b; border-radius: 50%; animation: spin-fast 0.8s linear infinite; margin-bottom: 6px;"></div>
      <span style="font-size: 8.5px; color: #a1a1aa;">Семантическое восстановление и переподключение к API...</span>
    `;

    setTimeout(() => {
      fallback.style.display = "none";
      content.style.display = "block";
      view.style.border = "none";
      view.style.background = "rgba(0,0,0,0.2)";
      
      fallback.innerHTML = `
        <div style="font-size: 10px; color: #f87171; font-weight: bold; margin-bottom: 4px;">⚠️ Сбой при рендеринге компонента</div>
        <div style="font-size: 8px; color: #a1a1aa; margin-bottom: 8px;">Error: API request failed (500 Internal Server Error)</div>
        <button id="error-recovery-retry-btn" onclick="event.stopPropagation(); window.recoverComponent && window.recoverComponent();" style="background: #f59e0b; border: none; color: #000; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 9px; font-weight: 700; box-shadow: 0 0 8px rgba(245, 158, 11, 0.4);">Повторить попытку (Retry)</button>
      `;
    }, 1000);
  };

  // Auto-init sandbox playgrounds when opened in DOM
  setInterval(() => {
    // Pull To Refresh setup
    const ptr = document.getElementById("ptr-container");
    if (ptr && !ptr.dataset.initialized) {
      ptr.dataset.initialized = "true";
      let isDragging = false;
      let startY = 0;
      let currentPull = 0;
      const spinner = document.getElementById("ptr-spinner");
      const arrow = document.getElementById("ptr-arrow");
      const feedText = document.getElementById("ptr-feed-text");
      
      ptr.addEventListener("pointerdown", (e) => {
        isDragging = true;
        startY = e.clientY;
        ptr.style.cursor = "grabbing";
        ptr.style.transition = "none";
        if (spinner) spinner.style.transition = "none";
        if (arrow) arrow.style.transition = "none";
      });
      
      window.addEventListener("pointermove", (e) => {
        if (!isDragging) return;
        const diffY = e.clientY - startY;
        if (diffY > 0) {
          currentPull = Math.min(diffY * 0.4, 50);
          if (spinner) {
            spinner.style.opacity = currentPull / 50;
            spinner.style.transform = `translateY(${currentPull - 20}px) rotate(${currentPull * 6}deg)`;
          }
          if (arrow) {
            arrow.style.opacity = currentPull / 50;
            arrow.style.transform = `translateY(${currentPull - 20}px) rotate(${Math.min(currentPull * 4, 180)}deg)`;
          }
        }
      });
      
      window.addEventListener("pointerup", () => {
        if (!isDragging) return;
        isDragging = false;
        ptr.style.cursor = "grab";
        
        if (currentPull >= 35) {
          if (spinner) {
            spinner.style.opacity = "1";
            spinner.style.transform = "translateY(8px)";
            spinner.style.animation = "spin-fast 1s linear infinite";
          }
          if (arrow) arrow.style.opacity = "0";
          if (feedText) feedText.innerHTML = `<span style="color:#f59e0b; font-weight:bold;">Загрузка свежих данных...</span>`;
          
          setTimeout(() => {
            if (spinner) {
              spinner.style.animation = "none";
              spinner.style.opacity = "0";
              spinner.style.transform = "translateY(-20px)";
            }
            if (feedText) {
              feedText.innerHTML = `
                <div style="color:#10b981; font-weight:bold; font-size:10px; margin-bottom:4px;">Лента обновлена! ⚡</div>
                <div style="font-size:8.5px; color:#fff; background:rgba(255,255,255,0.05); padding:4px; border-radius:4px;">
                  🔥 ИИ-агенты завершили 95% задач на сегодня!
                </div>
              `;
            }
          }, 1500);
        } else {
          if (spinner) {
            spinner.style.transition = "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)";
            spinner.style.opacity = "0";
            spinner.style.transform = "translateY(-20px)";
          }
          if (arrow) {
            arrow.style.transition = "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)";
            arrow.style.opacity = "0";
            arrow.style.transform = "translateY(-20px)";
          }
        }
        currentPull = 0;
      });
    }

    const el = document.getElementById("empty-sandbox-content");
    if (el && el.innerHTML.trim() === "<!-- Будет заполнено через JS при рендере -->") {
      window.simulateEmptyAction('clear');
    }
    const typoSelect = document.getElementById("typo-scale-select");
    if (typoSelect && !typoSelect.dataset.initialized) {
      typoSelect.dataset.initialized = "true";
      window.updateTypographyScale(typoSelect.value);
    }
    const cqSlider = document.getElementById("container-width-slider");
    if (cqSlider && !cqSlider.dataset.initialized) {
      cqSlider.dataset.initialized = "true";
      window.updateContainerQueryWidth(cqSlider.value);
    }
    const fluidMinSlider = document.getElementById("fluid-min-slider");
    if (fluidMinSlider && !fluidMinSlider.dataset.initialized) {
      fluidMinSlider.dataset.initialized = "true";
      window.updateFluidTypography();
    }
    const hitEl = document.getElementById("touch-hit-cnt");
    if (hitEl && !hitEl.dataset.initialized) {
      hitEl.dataset.initialized = "true";
      window.touchHits = 0;
      window.touchMisses = 0;
      hitEl.innerText = "0";
      const missEl = document.getElementById("touch-miss-cnt");
      if (missEl) missEl.innerText = "0";
    }
    const cwvVal = document.getElementById("cwv-lcp-val");
    if (cwvVal && !cwvVal.dataset.initialized) {
      cwvVal.dataset.initialized = "true";
      window.optimizeCoreWebVitals();
    }
    const percBtn = document.getElementById("perc-simulate-btn");
    if (percBtn && !percBtn.dataset.initialized) {
      percBtn.dataset.initialized = "true";
      window.percLoadingActive = false;
      const spinnerLoader = document.getElementById("perc-spinner-loader");
      const spinnerContent = document.getElementById("perc-spinner-content");
      const skeletonLoader = document.getElementById("perc-skeleton-loader");
      const skeletonContent = document.getElementById("perc-skeleton-content");
      if (spinnerLoader) spinnerLoader.style.display = "none";
      if (spinnerContent) spinnerContent.style.display = "block";
      if (skeletonLoader) skeletonLoader.style.display = "none";
      if (skeletonContent) skeletonContent.style.display = "block";
    }
    const imgOptSize = document.getElementById("img-opt-size-val");
    if (imgOptSize && !imgOptSize.dataset.initialized) {
      imgOptSize.dataset.initialized = "true";
      window.changeImageFormatType('webp');
    }
    const contrastSlider = document.getElementById("contrast-color-slider");
    if (contrastSlider && !contrastSlider.dataset.initialized) {
      contrastSlider.dataset.initialized = "true";
      window.updateContrastSlider(contrastSlider.value);
    }
    const trapIndicator = document.getElementById("trap-status-indicator");
    if (trapIndicator && !trapIndicator.dataset.initialized) {
      trapIndicator.dataset.initialized = "true";
      window.focusTrapActive = false;
      window.trappedFocusIndex = 0;
      trapIndicator.innerText = "ОТКЛЮЧЕНА ❌";
      trapIndicator.style.color = "#ef4444";
    }
    const dtSlider = document.getElementById("dt-radius-slider");
    if (dtSlider && !dtSlider.dataset.initialized) {
      dtSlider.dataset.initialized = "true";
      window.updateDesignToken('color', '#3b82f6');
      window.updateDesignToken('radius', dtSlider.value);
      const dtPad = document.getElementById("dt-padding-slider");
      if (dtPad) window.updateDesignToken('padding', dtPad.value);
    }
    const dmBtn = document.getElementById("dm-btn-dark");
    if (dmBtn && !dmBtn.dataset.initialized) {
      dmBtn.dataset.initialized = "true";
      window.toggleDarkModeTheme('dark');
    }
    const fmBtn = document.getElementById("fm-open-btn");
    if (fmBtn && !fmBtn.dataset.initialized) {
      fmBtn.dataset.initialized = "true";
      window.toggleFocusManagementModal(false);
    }
    const prmBtn = document.getElementById("prm-toggle-btn");
    if (prmBtn && !prmBtn.dataset.initialized) {
      prmBtn.dataset.initialized = "true";
      window.reducedMotionActive = false;
      window.toggleReducedMotionSim();
      window.reducedMotionActive = true;
      window.toggleReducedMotionSim();
    }
    const fvEmail = document.getElementById("fv-email");
    if (fvEmail && !fvEmail.dataset.initialized) {
      fvEmail.dataset.initialized = "true";
      window.validateFormWidget();
    }
    const srNarratorText = document.getElementById("sr-narrator-text");
    if (srNarratorText && !srNarratorText.dataset.initialized) {
      srNarratorText.dataset.initialized = "true";
      srNarratorText.innerText = "📢 Нажмите кнопку выше для озвучки...";
      srNarratorText.style.color = "#a1a1aa";
    }

    // 6 New Level 4 Architectural Sandboxes Auto-Init
    const colocView = document.getElementById("colocation-code-view");
    if (colocView && !colocView.dataset.initialized) {
      colocView.dataset.initialized = "true";
      window.toggleColocationView("action");
    }
    const tailwindInput = document.getElementById("tailwind-classes-input");
    if (tailwindInput && !tailwindInput.dataset.initialized) {
      tailwindInput.dataset.initialized = "true";
      window.setTailwindPreset("pulse");
    }
    const shadcnTerm = document.getElementById("shadcn-terminal");
    if (shadcnTerm && !shadcnTerm.dataset.initialized) {
      shadcnTerm.dataset.initialized = "true";
      shadcnTerm.innerHTML = `<span style="color: #6b7280;">// Выберите компонент выше для начала установки...</span>`;
    }
    const zustandStore = document.getElementById("zustand-store-val");
    if (zustandStore && !zustandStore.dataset.initialized) {
      zustandStore.dataset.initialized = "true";
      window.updateZustandStoreSim();
    }
    const loadingDemo = document.getElementById("loading-container-demo");
    if (loadingDemo && !loadingDemo.dataset.initialized) {
      loadingDemo.dataset.initialized = "true";
      window.runSkeletonDemo("skeleton");
    }
    const optCount = document.getElementById("optimistic-count");
    if (optCount && !optCount.dataset.initialized) {
      optCount.dataset.initialized = "true";
      optCount.innerText = window.optimisticLikes;
    }
  }, 300);

  // Start initialization
  init();
});
