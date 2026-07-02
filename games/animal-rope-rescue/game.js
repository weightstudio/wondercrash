(() => {
  const GAME_ID = "animal-rope-rescue";
  const localeKey = "weightplayLocale";
  const unlockKey = "weightplay_rope_rescue_unlocked";
  const starKey = "weightplay_rope_rescue_stars";
  const progressKey = "weightplay_rope_rescue_progress";

  const text = {
    en: {
      gameTitle: "Animal Rope Rescue",
      language: "Language",
      chooseStage: "Choose Stage",
      menuHint: "Cut vines and guide fruit to hungry animals.",
      stages: "Stages",
      loading: "Loading",
      nextStage: "Next Stage",
      retry: "Try Again",
      lobby: "Lobby",
      moves: "Cuts",
      locked: "Stage locked",
      stage: "Stage {n}",
      ready: "Tap a vine to cut it.",
      rescued: "Great rescue!",
      missed: "Try again. Watch the bounce path.",
      result: "You helped the animal with {cuts} vine cuts.",
      progress: "Nice progress! You cleared a new rescue stage.",
      skillLogic: "Logic",
      skillFocus: "Focus",
      skillCoordination: "Hand-eye",
      animals: { monkey: "monkey", rabbit: "rabbit", lion: "lion", parrot: "parrot" },
      goals: [
        "Cut the vine and feed the monkey.",
        "Time the drop for the rabbit.",
        "Use the leaf bounce.",
        "Drop through the gap.",
        "Cut the second vine after the fruit swings.",
        "Bounce twice to reach the parrot.",
        "Avoid wasting cuts.",
        "Rescue the lion with a clean drop.",
      ],
    },
    "zh-Hant": {
      gameTitle: "動物藤蔓救援",
      language: "語言",
      chooseStage: "選擇關卡",
      menuHint: "切斷藤蔓，讓水果送到小動物身邊。",
      stages: "關卡",
      loading: "載入中",
      nextStage: "下一關",
      retry: "再玩一次",
      lobby: "大廳",
      moves: "切割",
      locked: "關卡未解鎖",
      stage: "第 {n} 關",
      ready: "點擊藤蔓切斷它。",
      rescued: "救援成功！",
      missed: "再試一次，觀察彈跳路線。",
      result: "你用了 {cuts} 次切割幫助動物。",
      progress: "進步很棒！你完成新的救援關卡。",
      skillLogic: "邏輯",
      skillFocus: "專注",
      skillCoordination: "手眼協調",
      animals: { monkey: "猴子", rabbit: "兔子", lion: "獅子", parrot: "鸚鵡" },
      goals: [
        "切斷藤蔓，把水果送給猴子。",
        "抓準時機讓兔子吃到水果。",
        "利用葉子彈跳。",
        "讓水果穿過空隙。",
        "水果擺動後再切第二條藤蔓。",
        "連續彈跳送到鸚鵡身邊。",
        "不要浪費切割次數。",
        "乾淨落下，完成獅子救援。",
      ],
    },
  };

  const assets = {
    monkey: "../../assets/animal-rope-monkey.svg",
    rabbit: "../../assets/animal-rope-rabbit.svg",
    lion: "../../assets/animal-rope-lion.svg",
    parrot: "../../assets/animal-rope-parrot.svg",
    fruit: "../../assets/animal-rope-fruit.svg",
    bumper: "../../assets/animal-rope-bumper.svg",
  };

  const stages = [
    { animal: "monkey", fruit: [32, 26], animalPos: [48, 78], maxCuts: 1, ropes: [[32, 8, 32, 26]], bumpers: [] },
    { animal: "rabbit", fruit: [66, 24], animalPos: [58, 78], maxCuts: 1, ropes: [[66, 8, 66, 24]], bumpers: [[58, 59, 0, 1.05]] },
    { animal: "monkey", fruit: [24, 22], animalPos: [74, 78], maxCuts: 1, ropes: [[24, 7, 24, 22]], bumpers: [[48, 58, -12, 1.16]] },
    { animal: "parrot", fruit: [77, 20], animalPos: [34, 77], maxCuts: 1, ropes: [[77, 7, 77, 20]], bumpers: [[55, 58, 14, 1.08], [36, 66, -8, 0.98]] },
    { animal: "rabbit", fruit: [45, 27], animalPos: [70, 78], maxCuts: 2, ropes: [[31, 8, 45, 27], [63, 8, 45, 27]], bumpers: [[63, 62, -5, 1.08]] },
    { animal: "parrot", fruit: [18, 21], animalPos: [80, 76], maxCuts: 1, ropes: [[18, 7, 18, 21]], bumpers: [[37, 52, -8, 1.12], [59, 64, 10, 1.06]] },
    { animal: "lion", fruit: [52, 22], animalPos: [52, 79], maxCuts: 2, ropes: [[38, 7, 52, 22], [66, 7, 52, 22]], bumpers: [[43, 61, 7, 1.04], [62, 61, -7, 1.04]] },
    { animal: "lion", fruit: [80, 20], animalPos: [28, 78], maxCuts: 1, ropes: [[80, 7, 80, 20]], bumpers: [[61, 52, 12, 1.1], [41, 64, -13, 1.12]] },
  ];

  const $ = (id) => document.getElementById(id);
  const nodes = {
    localeSelect: $("localeSelect"),
    menuPanel: $("menuPanel"),
    stageGrid: $("stageGrid"),
    playPanel: $("playPanel"),
    backToStagesBtn: $("backToStagesBtn"),
    stageText: $("stageText"),
    goalText: $("goalText"),
    moveText: $("moveText"),
    arena: $("arena"),
    animalImg: $("animalImg"),
    fruitImg: $("fruitImg"),
    ropeLayer: $("ropeLayer"),
    bumperLayer: $("bumperLayer"),
    sparkLayer: $("sparkLayer"),
    feedbackText: $("feedbackText"),
    resultPanel: $("resultPanel"),
    resultTitle: $("resultTitle"),
    starText: $("starText"),
    resultText: $("resultText"),
    skillReport: $("skillReport"),
    nextStageBtn: $("nextStageBtn"),
    retryBtn: $("retryBtn"),
    resultStagesBtn: $("resultStagesBtn"),
    loadingPanel: $("loadingPanel"),
    loadingText: $("loadingText"),
    loadingFill: $("loadingFill"),
  };

  let locale = localStorage.getItem(localeKey) || "en";
  let unlocked = clamp(Number(localStorage.getItem(unlockKey)) || 1, 1, stages.length);
  let stars = readStars();
  let currentStage = 0;
  let state = null;
  let raf = 0;
  let lastTime = 0;

  function t(key, params = {}) {
    const parts = key.split(".");
    let value = text[locale] || text.en;
    for (const part of parts) value = value?.[part];
    if (value == null) {
      value = text.en;
      for (const part of parts) value = value?.[part];
    }
    return String(value ?? key).replace(/\{(\w+)\}/g, (_, name) => params[name] ?? "");
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function readStars() {
    try {
      const parsed = JSON.parse(localStorage.getItem(starKey) || "{}");
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }

  function saveStars() {
    localStorage.setItem(starKey, JSON.stringify(stars));
  }

  function pctToPx([x, y]) {
    const rect = nodes.arena.getBoundingClientRect();
    return { x: (x / 100) * rect.width, y: (y / 100) * rect.height, width: rect.width, height: rect.height };
  }

  function pxToPct(x, y) {
    const rect = nodes.arena.getBoundingClientRect();
    return [clamp((x / rect.width) * 100, 0, 100), clamp((y / rect.height) * 100, 0, 100)];
  }

  function applyLocale() {
    document.documentElement.lang = locale === "zh-Hant" ? "zh-Hant" : "en";
    nodes.localeSelect.value = locale;
    document.querySelectorAll("[data-ui]").forEach((node) => {
      node.textContent = t(node.dataset.ui);
    });
    renderStages();
    if (state) {
      nodes.stageText.textContent = t("stage", { n: currentStage + 1 });
      nodes.goalText.textContent = t(`goals.${currentStage}`);
      nodes.feedbackText.textContent = t("ready");
    }
    window.WonderI18n?.setLocale?.(locale);
  }

  function renderStages() {
    nodes.stageGrid.innerHTML = "";
    stages.forEach((stage, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `stage-card ${index >= unlocked ? "locked" : ""}`;
      button.innerHTML = `<strong>${t("stage", { n: index + 1 })}</strong><span>${stars[index] ? "★".repeat(stars[index]) : index >= unlocked ? t("locked") : t(`animals.${stage.animal}`)}</span>`;
      button.addEventListener("click", () => {
        if (index >= unlocked) {
          nodes.feedbackText.textContent = t("locked");
          return;
        }
        startStage(index);
      });
      nodes.stageGrid.append(button);
    });
  }

  function startStage(index) {
    cancelAnimationFrame(raf);
    currentStage = index;
    const stage = stages[index];
    state = {
      stage,
      x: stage.fruit[0],
      y: stage.fruit[1],
      vx: 0,
      vy: 0,
      cuts: 0,
      running: false,
      done: false,
      ropes: stage.ropes.map((rope) => ({ rope, cut: false })),
      hitBumpers: new Set(),
      startedAt: performance.now(),
    };
    nodes.menuPanel.classList.add("hidden");
    nodes.resultPanel.classList.add("hidden");
    nodes.playPanel.classList.remove("hidden");
    nodes.stageText.textContent = t("stage", { n: index + 1 });
    nodes.goalText.textContent = t(`goals.${index}`);
    nodes.feedbackText.textContent = t("ready");
    nodes.animalImg.src = assets[stage.animal];
    nodes.fruitImg.src = assets.fruit;
    nodes.fruitImg.classList.add("waiting");
    placePercent(nodes.animalImg, stage.animalPos[0], stage.animalPos[1]);
    drawBumpers();
    drawRopes();
    moveFruit();
    updateMoveText();
    lastTime = performance.now();
    raf = requestAnimationFrame(tick);
    window.WonderSound?.play?.("start");
    window.WonderAnalytics?.track?.("game_start", { game_id: GAME_ID, level: index + 1 });
    window.WeightPlayEdgeGuard?.focusPlayArea?.();
  }

  function placePercent(node, x, y) {
    node.style.left = `${x}%`;
    node.style.top = `${y}%`;
  }

  function drawBumpers() {
    nodes.bumperLayer.innerHTML = "";
    state.stage.bumpers.forEach(([x, y, angle]) => {
      const img = document.createElement("img");
      img.className = "bumper-img";
      img.src = assets.bumper;
      img.style.left = `${x}%`;
      img.style.top = `${y}%`;
      img.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
      nodes.bumperLayer.append(img);
    });
  }

  function drawRopes() {
    nodes.ropeLayer.innerHTML = "";
    state.ropes.forEach((entry, index) => {
      if (entry.cut) return;
      const [x1, y1, x2, y2] = entry.rope;
      const wide = document.createElementNS("http://www.w3.org/2000/svg", "line");
      wide.setAttribute("x1", x1);
      wide.setAttribute("y1", y1);
      wide.setAttribute("x2", state.running ? state.x : x2);
      wide.setAttribute("y2", state.running ? state.y : y2);
      wide.setAttribute("stroke", "rgba(255,255,255,0.01)");
      wide.setAttribute("stroke-width", "9");
      wide.classList.add("rope-hit");
      wide.addEventListener("pointerdown", () => cutRope(index));
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", x1);
      line.setAttribute("y1", y1);
      line.setAttribute("x2", state.running ? state.x : x2);
      line.setAttribute("y2", state.running ? state.y : y2);
      line.setAttribute("stroke", "#8b5a2c");
      line.setAttribute("stroke-width", "1.45");
      line.setAttribute("stroke-linecap", "round");
      nodes.ropeLayer.append(wide, line);
    });
  }

  function cutRope(index) {
    if (!state || state.done || state.ropes[index]?.cut || state.cuts >= state.stage.maxCuts) return;
    state.ropes[index].cut = true;
    state.cuts += 1;
    state.running = state.ropes.every((entry) => entry.cut);
    if (state.running) {
      nodes.fruitImg.classList.remove("waiting");
      state.vx += (50 - state.x) * 0.12;
      state.vy += 1.2;
    }
    updateMoveText();
    burst(state.x, state.y);
    drawRopes();
    window.WonderSound?.play?.("tap");
  }

  function updateMoveText() {
    nodes.moveText.textContent = `${state.cuts}/${state.stage.maxCuts}`;
  }

  function moveFruit() {
    placePercent(nodes.fruitImg, state.x, state.y);
  }

  function tick(time) {
    const dt = Math.min(0.033, (time - lastTime) / 1000 || 0.016);
    lastTime = time;
    if (state && !state.done) {
      if (state.running) updatePhysics(dt);
      drawRopes();
      moveFruit();
      checkGoal();
    }
    raf = requestAnimationFrame(tick);
  }

  function updatePhysics(dt) {
    state.vy += 42 * dt;
    state.x += state.vx * dt;
    state.y += state.vy * dt;
    state.vx *= 0.992;
    if (state.x < 5 || state.x > 95) {
      state.x = clamp(state.x, 5, 95);
      state.vx *= -0.62;
    }
    state.stage.bumpers.forEach(([bx, by, angle, power], index) => {
      const dx = state.x - bx;
      const dy = state.y - by;
      const distance = Math.hypot(dx, dy);
      if (distance < 11 && !state.hitBumpers.has(index)) {
        state.hitBumpers.add(index);
        const radians = ((angle - 90) * Math.PI) / 180;
        state.vx = Math.cos(radians) * 34 * power;
        state.vy = Math.sin(radians) * 34 * power - 18;
        burst(bx, by);
        window.WonderSound?.play?.("success");
      }
      if (distance > 16) state.hitBumpers.delete(index);
    });
    if (state.y > 103) failStage();
  }

  function checkGoal() {
    const [gx, gy] = state.stage.animalPos;
    if (Math.hypot(state.x - gx, state.y - (gy - 7)) < 13 && state.running) {
      completeStage();
    }
  }

  function completeStage() {
    if (state.done) return;
    state.done = true;
    const earned = state.cuts <= state.stage.maxCuts - 1 ? 3 : state.hitBumpers.size ? 2 : 1;
    stars[currentStage] = Math.max(stars[currentStage] || 0, earned);
    saveStars();
    unlocked = Math.max(unlocked, Math.min(stages.length, currentStage + 2));
    localStorage.setItem(unlockKey, String(unlocked));
    updateProgress(earned);
    showResult(true, earned);
    window.WonderSound?.play?.("win");
    window.WonderAnalytics?.track?.("game_complete", { game_id: GAME_ID, level: currentStage + 1, stars: earned });
  }

  function failStage() {
    if (state.done) return;
    state.done = true;
    nodes.feedbackText.textContent = t("missed");
    showResult(false, 0);
    window.WonderSound?.play?.("fail");
  }

  function updateProgress(earned) {
    const previous = readProgress();
    const score = earned * 100 + Math.max(0, 40 - state.cuts * 10);
    const bestScore = Math.max(previous.bestScore || 0, score);
    const playCount = (previous.playCount || 0) + 1;
    const improvementPercent = previous.bestScore ? Math.round(((score - previous.bestScore) / previous.bestScore) * 100) : 0;
    localStorage.setItem(progressKey, JSON.stringify({
      lastScore: score,
      bestScore,
      playCount,
      lastPlayedAt: new Date().toISOString(),
      improvementPercent,
      skillScores: {
        Logic: clamp(earned + 2, 1, 5),
        Focus: clamp(5 - state.cuts + earned, 1, 5),
        "Hand-eye Coordination": clamp(earned + (state.hitBumpers.size ? 1 : 0) + 1, 1, 5),
      },
    }));
  }

  function readProgress() {
    try {
      return JSON.parse(localStorage.getItem(progressKey) || "{}") || {};
    } catch {
      return {};
    }
  }

  function showResult(won, earned) {
    nodes.resultPanel.classList.remove("hidden");
    nodes.resultTitle.textContent = won ? t("rescued") : t("missed");
    nodes.starText.textContent = won ? "★".repeat(earned) + "☆".repeat(3 - earned) : "☆☆☆";
    nodes.resultText.textContent = won ? t("result", { cuts: state.cuts }) : t("ready");
    nodes.skillReport.innerHTML = won
      ? `<span>${t("skillLogic")}: ${"★".repeat(clamp(earned + 2, 1, 5))}</span><span>${t("skillFocus")}: ${"★".repeat(clamp(5 - state.cuts + earned, 1, 5))}</span><span>${t("skillCoordination")}: ${"★".repeat(clamp(earned + 2, 1, 5))}</span><span>${t("progress")}</span>`
      : `<span>${t("skillFocus")}: ★★★</span><span>${t("missed")}</span>`;
    renderStages();
  }

  function burst(x, y) {
    for (let i = 0; i < 6; i += 1) {
      const dot = document.createElement("span");
      dot.className = "spark";
      dot.style.left = `${x + (Math.random() - 0.5) * 7}%`;
      dot.style.top = `${y + (Math.random() - 0.5) * 7}%`;
      nodes.sparkLayer.append(dot);
      setTimeout(() => dot.remove(), 650);
    }
  }

  function showMenu() {
    cancelAnimationFrame(raf);
    state = null;
    nodes.playPanel.classList.add("hidden");
    nodes.resultPanel.classList.add("hidden");
    nodes.menuPanel.classList.remove("hidden");
    renderStages();
  }

  function init() {
    nodes.localeSelect.value = locale;
    nodes.localeSelect.addEventListener("change", () => {
      locale = nodes.localeSelect.value;
      localStorage.setItem(localeKey, locale);
      applyLocale();
    });
    nodes.backToStagesBtn.addEventListener("click", showMenu);
    nodes.resultStagesBtn.addEventListener("click", showMenu);
    nodes.retryBtn.addEventListener("click", () => startStage(currentStage));
    nodes.nextStageBtn.addEventListener("click", () => startStage(Math.min(currentStage + 1, unlocked - 1, stages.length - 1)));
    window.addEventListener("resize", () => {
      if (state) {
        moveFruit();
        drawRopes();
        drawBumpers();
      }
    });
    preload().then(() => {
      applyLocale();
      nodes.loadingPanel.classList.add("hidden");
      window.WeightPlayTutorial?.show?.(GAME_ID);
    });
  }

  function preload() {
    const list = Object.values(assets);
    let loaded = 0;
    return Promise.all(list.map((src) => new Promise((resolve) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loaded += 1;
        const pct = Math.round((loaded / list.length) * 100);
        nodes.loadingText.textContent = `${pct}%`;
        nodes.loadingFill.style.width = `${pct}%`;
        resolve();
      };
      img.src = src;
    })));
  }

  init();
})();
