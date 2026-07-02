(() => {
  const GAME_ID = "animal-zoo-idle";
  const localeKey = "weightPlayLocale";
  const saveKey = "weightplay_animal_zoo_idle_save_v3";
  const oldSaveKeys = ["weightplay_animal_zoo_idle_save_v2", "weightplay_animal_zoo_idle_save_v1"];

  const ASSETS = {
    cover: "../../assets/animal-zoo-idle-cover.png",
    stage: "../../assets/animal-zoo-idle-stage-bg.png",
    lion: "../../assets/animal-zoo-idle-lion.png",
    giraffe: "../../assets/animal-zoo-idle-giraffe.png",
    elephant: "../../assets/animal-zoo-elephant.png",
    panda: "../../assets/animal-zoo-panda.png",
    penguin: "../../assets/animal-zoo-penguin.png",
    keeper: "../../assets/animal-zoo-keeper.png",
    gate1: "../../assets/animal-zoo-gate-lv1.png",
    gate2: "../../assets/animal-zoo-gate-lv2.png",
    gate3: "../../assets/animal-zoo-gate-lv3.png",
    visitorChild: "../../assets/animal-zoo-visitor-child.png",
    visitorElder: "../../assets/animal-zoo-visitor-elder.png",
    visitorFamily: "../../assets/animal-zoo-visitor-family.png",
  };

  const animals = [
    { id: "lion", asset: ASSETS.lion, baseIncome: 8, cost: 0, care: 8, x: 24, y: 18, size: 30 },
    { id: "giraffe", asset: ASSETS.giraffe, baseIncome: 16, cost: 360, care: 10, x: 67, y: 8, size: 35 },
    { id: "elephant", asset: ASSETS.elephant, baseIncome: 28, cost: 980, care: 12, x: 43, y: 34, size: 26 },
    { id: "panda", asset: ASSETS.panda, baseIncome: 42, cost: 2100, care: 14, x: 78, y: 40, size: 21 },
    { id: "penguin", asset: ASSETS.penguin, baseIncome: 58, cost: 4200, care: 16, x: 58, y: 48, size: 18 },
  ];

  const visitorAssets = [ASSETS.visitorChild, ASSETS.visitorElder, ASSETS.visitorFamily];

  const text = {
    en: {
      title: "Animal Zoo Idle",
      language: "Language",
      menuTitle: "Build a growing animal park.",
      menuHint: "Welcome visitors, collect tickets, upgrade the zoo gate, and recruit more animals to grow your park.",
      start: "Open Park",
      coins: "Coins",
      tickets: "Ticket Box",
      visitors: "Visitors",
      report: "Report",
      reportTitle: "Zoo Growth Report",
      continue: "Continue",
      loading: "Loading",
      collect: "Collect",
      careAll: "Care",
      upgradeGate: "Upgrade Gate",
      recruit: "Recruit",
      gate: "Gate Lv.{n}",
      income: "{n}/10s",
      happiness: "Happiness",
      animals: "Animals",
      offline: "Welcome back! Visitors left {coins} coins in the ticket box.",
      notEnough: "Need more coins.",
      collected: "Collected {coins} coins.",
      cared: "Animals are happier. More visitors are coming.",
      upgraded: "The gate looks better. Ticket income increased!",
      recruited: "{name} joined the zoo!",
      maxGate: "Max Gate",
      reportGood: "Great care! Your zoo is growing and the animals looked happy.",
      reportTry: "Good effort. Recruit animals and upgrade the gate to grow faster.",
      lion: "Lion",
      giraffe: "Giraffe",
      elephant: "Elephant",
      panda: "Panda",
      penguin: "Penguin",
    },
    "zh-Hant": {
      title: "動物小小樂園",
      language: "語言",
      menuTitle: "經營會成長的動物園。",
      menuHint: "接待遊客、收取門票、升級園區大門，並招募更多動物讓樂園越來越熱鬧。",
      start: "開園",
      coins: "金幣",
      tickets: "票箱",
      visitors: "遊客",
      report: "報告",
      reportTitle: "樂園成長報告",
      continue: "繼續",
      loading: "載入中",
      collect: "收票",
      careAll: "照顧",
      upgradeGate: "升級大門",
      recruit: "招募",
      gate: "大門 Lv.{n}",
      income: "{n}/10秒",
      happiness: "幸福度",
      animals: "動物",
      offline: "歡迎回來！遊客在票箱留下了 {coins} 金幣。",
      notEnough: "金幣不足。",
      collected: "收取 {coins} 金幣。",
      cared: "動物更開心了，更多遊客正在進園。",
      upgraded: "大門變漂亮了，門票收入提高！",
      recruited: "{name} 加入樂園！",
      maxGate: "大門已滿級",
      reportGood: "照顧得很好！樂園正在成長，動物也很開心。",
      reportTry: "做得不錯。招募動物並升級大門，可以讓樂園成長更快。",
      lion: "獅子",
      giraffe: "長頸鹿",
      elephant: "大象",
      panda: "熊貓",
      penguin: "企鵝",
    },
  };

  const $ = (id) => document.getElementById(id);
  const nodes = {
    localeSelect: $("localeSelect"),
    menuPanel: $("menuPanel"),
    gamePanel: $("gamePanel"),
    startBtn: $("startBtn"),
    coinText: $("coinText"),
    incomeText: $("incomeText"),
    reportBtn: $("reportBtn"),
    offlineNotice: $("offlineNotice"),
    habitatGrid: $("habitatGrid"),
    resultPanel: $("resultPanel"),
    reportScore: $("reportScore"),
    reportText: $("reportText"),
    focusStars: $("focusStars"),
    logicStars: $("logicStars"),
    animalStars: $("animalStars"),
    closeReportBtn: $("closeReportBtn"),
    loadingPanel: $("loadingPanel"),
    loadingText: $("loadingText"),
    loadingFill: $("loadingFill"),
  };

  let locale = window.WonderI18n?.locale?.() || localStorage.getItem(localeKey) || "en";
  let save = loadSave();
  let tickCount = 0;

  function t(key, data = {}) {
    const value = text[locale]?.[key] || text.en[key] || key;
    return Object.entries(data).reduce((out, [name, item]) => out.replaceAll(`{${name}}`, String(item)), value);
  }

  function loadSave() {
    const fallback = {
      coins: 180,
      ticketBox: 0,
      gateLevel: 1,
      happiness: 76,
      playCount: 0,
      careCount: 0,
      bestScore: 0,
      lastScore: 0,
      lastPlayedAt: Date.now(),
      unlocked: { lion: true },
    };
    try {
      const current = JSON.parse(localStorage.getItem(saveKey) || "null");
      if (current) return normalizeSave({ ...fallback, ...current });
      for (const key of oldSaveKeys) {
        const old = JSON.parse(localStorage.getItem(key) || "null");
        if (old) {
          return normalizeSave({
            ...fallback,
            coins: Math.max(180, Number(old.coins || 0)),
            ticketBox: Number(old.ticketBox || 0),
            gateLevel: Number(old.meadowLevel || old.gateLevel || 1),
            happiness: Number(old.happiness || 76),
            unlocked: { lion: true, giraffe: Boolean(old.animals?.giraffe) },
          });
        }
      }
      return fallback;
    } catch {
      return fallback;
    }
  }

  function normalizeSave(data) {
    data.unlocked = { lion: true, ...(data.unlocked || {}) };
    data.coins = Math.max(0, Number(data.coins || 0));
    data.ticketBox = Math.max(0, Number(data.ticketBox || 0));
    data.gateLevel = clamp(Math.floor(Number(data.gateLevel || 1)), 1, 3);
    data.happiness = clamp(Number(data.happiness || 76), 18, 100);
    return data;
  }

  function saveGame() {
    save.lastPlayedAt = Date.now();
    localStorage.setItem(saveKey, JSON.stringify(save));
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function unlockedAnimals() {
    return animals.filter((animal) => save.unlocked[animal.id]);
  }

  function nextRecruit() {
    return animals.find((animal) => !save.unlocked[animal.id]);
  }

  function gateUpgradeCost() {
    return save.gateLevel >= 3 ? 0 : 420 * save.gateLevel;
  }

  function incomePerTick() {
    const animalIncome = unlockedAnimals().reduce((sum, animal) => sum + animal.baseIncome, 0);
    const gateBonus = 1 + (save.gateLevel - 1) * 0.45;
    const happyBonus = 0.55 + save.happiness / 100;
    return Math.max(4, Math.round(animalIncome * gateBonus * happyBonus));
  }

  function visitorCount() {
    return clamp(Math.ceil(incomePerTick() / 26), 2, 8);
  }

  function applyOffline() {
    const elapsedSeconds = Math.min(7200, Math.max(0, (Date.now() - Number(save.lastPlayedAt || Date.now())) / 1000));
    const earned = Math.floor((elapsedSeconds / 10) * incomePerTick() * 0.55);
    if (earned > 0) {
      save.ticketBox += earned;
      nodes.offlineNotice.textContent = t("offline", { coins: earned });
      nodes.offlineNotice.classList.remove("hidden");
      window.setTimeout(() => nodes.offlineNotice.classList.add("hidden"), 3200);
    }
    saveGame();
  }

  function localizeStatic() {
    document.documentElement.lang = locale === "zh-Hant" ? "zh-Hant" : "en";
    document.querySelectorAll("[data-ui]").forEach((node) => {
      node.textContent = t(node.dataset.ui);
    });
    nodes.localeSelect.value = locale;
  }

  function render() {
    nodes.coinText.textContent = Math.floor(save.coins);
    nodes.incomeText.textContent = Math.floor(save.ticketBox);
    const card = nodes.habitatGrid.querySelector(".zoo-stage-card");
    if (!card) {
      nodes.habitatGrid.appendChild(renderPark());
      return;
    }
    updatePark(card);
  }

  function renderPark() {
    const next = nextRecruit();
    const card = document.createElement("article");
    card.className = "zoo-stage-card";
    card.innerHTML = `
      <div class="park-hud">
        <strong>${t("gate", { n: save.gateLevel })}</strong>
        <span>${t("income", { n: incomePerTick() })}</span>
        <span>${t("animals")}: ${unlockedAnimals().length}/${animals.length}</span>
      </div>
      <div class="savanna-stage stage-lv-${save.gateLevel}" aria-label="Safari park">
        <div class="gate image-asset"><img src="${gateAsset()}" alt="" draggable="false" /></div>
        <div class="visitor-line"></div>
        <img class="keeper image-asset" src="${ASSETS.keeper}" alt="" draggable="false" />
        <div class="animal-layer"></div>
        <div class="heart-field"></div>
      </div>
      <div class="care-panel">
        <div class="happy-meter"><span>${t("happiness")}</span><b>${Math.round(save.happiness)}%</b><i style="width:${save.happiness}%"></i></div>
        <div class="zoo-actions">
          <button type="button" data-action="collect">${t("collect")}</button>
          <button type="button" data-action="care">${t("careAll")}</button>
          <button type="button" data-action="upgrade" ${save.gateLevel >= 3 ? "disabled" : ""}>${save.gateLevel >= 3 ? t("maxGate") : `${t("upgradeGate")} ${gateUpgradeCost()}`}</button>
          <button type="button" data-action="recruit" ${next ? "" : "disabled"}>${next ? `${t("recruit")} ${t(next.id)} ${next.cost}` : `${t("animals")} Max`}</button>
        </div>
      </div>
    `;
    renderVisitors(card.querySelector(".visitor-line"));
    const animalLayer = card.querySelector(".animal-layer");
    renderAnimals(animalLayer);
    animalLayer.dataset.animalIds = unlockedAnimals().map((animal) => animal.id).join(",");
    card.querySelector('[data-action="collect"]').addEventListener("click", collectTickets);
    card.querySelector('[data-action="care"]').addEventListener("click", careAnimals);
    card.querySelector('[data-action="upgrade"]').addEventListener("click", upgradeGate);
    card.querySelector('[data-action="recruit"]').addEventListener("click", recruitAnimal);
    return card;
  }

  function updatePark(card) {
    const next = nextRecruit();
    const hud = card.querySelector(".park-hud");
    if (hud) {
      hud.children[0].textContent = t("gate", { n: save.gateLevel });
      hud.children[1].textContent = t("income", { n: incomePerTick() });
      hud.children[2].textContent = `${t("animals")}: ${unlockedAnimals().length}/${animals.length}`;
    }
    const stage = card.querySelector(".savanna-stage");
    if (stage) {
      stage.classList.remove("stage-lv-1", "stage-lv-2", "stage-lv-3");
      stage.classList.add(`stage-lv-${save.gateLevel}`);
    }
    const gate = card.querySelector(".gate img");
    if (gate && !gate.src.endsWith(gateAsset())) gate.src = gateAsset();
    const happyText = card.querySelector(".happy-meter b");
    const happyFill = card.querySelector(".happy-meter i");
    if (happyText) happyText.textContent = `${Math.round(save.happiness)}%`;
    if (happyFill) happyFill.style.width = `${save.happiness}%`;
    const upgrade = card.querySelector('[data-action="upgrade"]');
    if (upgrade) {
      upgrade.disabled = save.gateLevel >= 3;
      upgrade.textContent = save.gateLevel >= 3 ? t("maxGate") : `${t("upgradeGate")} ${gateUpgradeCost()}`;
    }
    const recruit = card.querySelector('[data-action="recruit"]');
    if (recruit) {
      recruit.disabled = !next;
      recruit.textContent = next ? `${t("recruit")} ${t(next.id)} ${next.cost}` : `${t("animals")} Max`;
    }
    const animalLayer = card.querySelector(".animal-layer");
    const animalIds = unlockedAnimals().map((animal) => animal.id).join(",");
    if (animalLayer && animalLayer.dataset.animalIds !== animalIds) {
      animalLayer.innerHTML = "";
      renderAnimals(animalLayer);
      animalLayer.dataset.animalIds = animalIds;
    }
  }

  function gateAsset() {
    if (save.gateLevel >= 3) return ASSETS.gate3;
    if (save.gateLevel >= 2) return ASSETS.gate2;
    return ASSETS.gate1;
  }

  function renderVisitors(container) {
    const count = visitorCount();
    for (let i = 0; i < count; i += 1) {
      const img = document.createElement("img");
      img.src = visitorAssets[i % visitorAssets.length];
      img.alt = "";
      img.draggable = false;
      img.style.setProperty("--delay", `${i * -0.72}s`);
      img.style.setProperty("--lane", `${i % 3}`);
      container.appendChild(img);
    }
  }

  function renderAnimals(container) {
    for (const animal of unlockedAnimals()) {
      const wrap = document.createElement("div");
      wrap.className = `animal animal-${animal.id}`;
      wrap.dataset.name = t(animal.id);
      wrap.style.left = `${animal.x}%`;
      wrap.style.bottom = `${animal.y}%`;
      wrap.style.width = `${animal.size}%`;
      wrap.innerHTML = `<img src="${animal.asset}" alt="" draggable="false" />`;
      container.appendChild(wrap);
    }
  }

  function collectTickets() {
    const amount = Math.floor(save.ticketBox);
    if (amount <= 0) {
      popToast(t("notEnough"));
      playSound("error");
      return;
    }
    save.coins += amount;
    save.ticketBox = 0;
    popToast(t("collected", { coins: amount }));
    playSound("coin");
    saveGame();
    render();
  }

  function careAnimals() {
    save.careCount += 1;
    const gain = unlockedAnimals().reduce((sum, animal) => sum + animal.care, 0);
    save.happiness = clamp(save.happiness + gain / 3, 18, 100);
    save.ticketBox += Math.round(incomePerTick() * 0.6);
    popHearts();
    popToast(t("cared"));
    playSound("success");
    saveGame();
    render();
  }

  function upgradeGate() {
    if (save.gateLevel >= 3) return;
    const cost = gateUpgradeCost();
    if (save.coins < cost) return notEnough();
    save.coins -= cost;
    save.gateLevel += 1;
    save.happiness = clamp(save.happiness + 7, 18, 100);
    popToast(t("upgraded"));
    playSound("upgrade");
    saveGame();
    render();
  }

  function recruitAnimal() {
    const animal = nextRecruit();
    if (!animal) return;
    if (save.coins < animal.cost) return notEnough();
    save.coins -= animal.cost;
    save.unlocked[animal.id] = true;
    save.happiness = clamp(save.happiness + 12, 18, 100);
    popToast(t("recruited", { name: t(animal.id) }));
    playSound("upgrade");
    window.WonderAnalytics?.track("animal_unlock", { game_id: GAME_ID, animal_id: animal.id });
    saveGame();
    render();
  }

  function notEnough() {
    popToast(t("notEnough"));
    playSound("error");
  }

  function popHearts() {
    const stage = document.querySelector(".heart-field");
    if (!stage) return;
    for (let i = 0; i < 6; i += 1) {
      const heart = document.createElement("i");
      heart.textContent = "♥";
      heart.style.left = `${24 + i * 9}%`;
      heart.style.animationDelay = `${i * 70}ms`;
      stage.appendChild(heart);
      window.setTimeout(() => heart.remove(), 900);
    }
  }

  function showReport() {
    const score = Math.round(save.coins / 12 + save.ticketBox / 10 + save.careCount * 16 + save.gateLevel * 55 + unlockedAnimals().length * 80);
    const previous = Number(save.bestScore || 0);
    save.playCount += 1;
    save.lastScore = score;
    save.bestScore = Math.max(previous, score);
    saveGame();
    nodes.reportScore.textContent = score;
    nodes.reportText.textContent = score >= previous ? t("reportGood") : t("reportTry");
    nodes.focusStars.textContent = starText(save.careCount * 32 + save.happiness);
    nodes.logicStars.textContent = starText(save.gateLevel * 90 + unlockedAnimals().length * 34);
    nodes.animalStars.textContent = starText(unlockedAnimals().length * 95);
    nodes.resultPanel.classList.remove("hidden");
    window.WonderAnalytics?.track("game_complete", { game_id: GAME_ID, score, animals: unlockedAnimals().length });
  }

  function starText(score) {
    const count = clamp(Math.ceil(score / 95), 1, 5);
    return "★★★★★".slice(0, count) + "☆☆☆☆☆".slice(0, 5 - count);
  }

  function popToast(message) {
    const toast = document.createElement("div");
    toast.className = "zoo-toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    window.setTimeout(() => toast.remove(), 1300);
  }

  function playSound(name) {
    window.WonderSound?.play?.(name);
  }

  function startGame() {
    document.body.classList.add("zoo-playing");
    nodes.menuPanel.classList.add("hidden");
    nodes.gamePanel.classList.remove("hidden");
    applyOffline();
    render();
    window.WonderAnalytics?.track("game_start", { game_id: GAME_ID });
  }

  function tickPark() {
    if (nodes.gamePanel.classList.contains("hidden")) return;
    tickCount += 1;
    save.ticketBox += incomePerTick();
    save.happiness = clamp(save.happiness - 0.42, 18, 100);
    if (tickCount % 3 === 0) saveGame();
    render();
  }

  function loadAssets() {
    const assets = [
      ASSETS.cover,
      ASSETS.stage,
      ASSETS.lion,
      ASSETS.giraffe,
      ASSETS.elephant,
      ASSETS.panda,
      ASSETS.penguin,
      ASSETS.keeper,
      ASSETS.gate1,
      ASSETS.gate2,
      ASSETS.gate3,
      ...visitorAssets,
    ];
    let done = 0;
    const finish = () => {
      done += 1;
      const pct = Math.round((done / assets.length) * 100);
      nodes.loadingText.textContent = `${pct}%`;
      nodes.loadingFill.style.width = `${pct}%`;
      if (done >= assets.length) {
        window.WonderAnalytics?.track("game_ready", { game_id: GAME_ID });
        window.setTimeout(() => nodes.loadingPanel.classList.add("hidden"), 180);
      }
    };
    assets.forEach((src) => {
      const img = new Image();
      img.onload = finish;
      img.onerror = finish;
      img.src = src;
    });
  }

  nodes.localeSelect.addEventListener("change", () => {
    locale = nodes.localeSelect.value;
    window.WonderI18n?.setLocale?.(locale);
    localStorage.setItem(localeKey, locale);
    localizeStatic();
    render();
  });
  nodes.startBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    startGame();
  });
  nodes.reportBtn.addEventListener("click", showReport);
  nodes.closeReportBtn.addEventListener("click", () => nodes.resultPanel.classList.add("hidden"));
  window.addEventListener("beforeunload", saveGame);

  localizeStatic();
  loadAssets();
  render();
  window.setInterval(tickPark, 10000);
})();
