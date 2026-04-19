const MORSE_TABLE = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  0: "-----",
  1: ".----",
  2: "..---",
  3: "...--",
  4: "....-",
  5: ".....",
  6: "-....",
  7: "--...",
  8: "---..",
  9: "----.",
};

const REVERSE_MORSE = Object.fromEntries(
  Object.entries(MORSE_TABLE).map(([character, code]) => [code, character]),
);

const PHRASE_ALIASES = {
  "我爱你": "WO AI NI",
  "我恨你": "WO HEN NI",
  "你在干什么": "NI ZAI GAN SHEN ME",
};

const MACHINES = [
  {
    id: "mechanical",
    name: "第一代机械手键",
    caption: "灵敏但躁动，适合练准度。",
    image: "machine-mechanical.svg",
    unlockAt: 0,
    dotCutoff: 240,
    letterGap: 600,
    latency: 0,
    jitter: 26,
    assist: 0.05,
  },
  {
    id: "vacuum",
    name: "第二代真空管机",
    caption: "存在延迟，需要提前预判。",
    image: "machine-vacuum.svg",
    unlockAt: 2,
    dotCutoff: 230,
    letterGap: 660,
    latency: 58,
    jitter: 18,
    assist: 0.04,
  },
  {
    id: "digital",
    name: "现代数字终端",
    caption: "具备波形显示与自动纠偏。",
    image: "machine-digital.svg",
    unlockAt: 4,
    dotCutoff: 250,
    letterGap: 560,
    latency: 0,
    jitter: 8,
    assist: 0.22,
  },
  {
    id: "legend",
    name: "传奇便携特工机",
    caption: "传奇奖励机型，噪点更多，挑战更纯粹。",
    image: "machine-legend.svg",
    unlockAt: 6,
    dotCutoff: 225,
    letterGap: 610,
    latency: 24,
    jitter: 42,
    assist: 0.02,
  },
];

const MISSIONS = [
  {
    id: "calibration",
    title: "姓名报码",
    typeLabel: "编码",
    envLabel: "地下室 / 稳态",
    difficultyLabel: "Lv.1",
    story: "第一夜的设备通电测试。你需要发送自己的代号，确认中继站与主控台的节奏完全同步。",
    brief: "将身份校验词发送出去：ERIC",
    targetText: "ERIC",
    displayTarget: "ERIC",
    incomingSequence: encodeText("ERIC"),
    mode: "encode",
    noiseLevel: 0.14,
  },
  {
    id: "alphabet-drill",
    title: "字母基础训练",
    typeLabel: "训练",
    envLabel: "训练台 / 低噪",
    difficultyLabel: "Lv.1",
    story: "中继站的第一堂正式课。把 A 到 Z 这 26 个字母挨个发一遍，熟悉每个字母独有的点划节奏。下面的对照表会实时高亮当前目标字母，点一下任意字母还能听示范音。",
    brief: "按顺序发送 A B C … Z 共 26 个字母。对照表会高亮当前目标字母。",
    targetText: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    displayTarget: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    incomingSequence: encodeText("ABCDEFGHIJKLMNOPQRSTUVWXYZ"),
    mode: "encode",
    noiseLevel: 0.08,
  },
  {
    id: "midnight-listen",
    title: "午夜监听",
    typeLabel: "监听",
    envLabel: "监听室 / 回声",
    difficultyLabel: "Lv.2",
    story: "隔墙传来断续脉冲。你得先从声音中辨认含义，再重新发回正确报码。",
    brief: "监听并回传真正的单词。答案藏在下方监听片段中。",
    targetText: "HEART",
    displayTarget: "待破译",
    incomingSequence: encodeText("HEART"),
    mode: "listen",
    noiseLevel: 0.2,
  },
  {
    id: "option-c",
    title: "敌台诱饵",
    typeLabel: "博弈",
    envLabel: "诱骗链路 / 敌台",
    difficultyLabel: "Lv.3",
    story: "敌方广播不断诱导你选择 A 或 B，但情报正文暗示的正确回应其实是第三个方案。",
    brief: "识别诱饵，发出正确答案：OPTIONC",
    targetText: "OPTIONC",
    displayTarget: "OPTION C",
    incomingSequence: encodeText("OPTIONC"),
    mode: "encode",
    noiseLevel: 0.28,
  },
  {
    id: "storm-filter",
    title: "雷暴滤波",
    typeLabel: "干扰",
    envLabel: "雷雨 / 强噪点",
    difficultyLabel: "Lv.4",
    story: "高空雷暴进入通信走廊。波形被拉扯、音频有底噪，但求救信号依旧存在。",
    brief: "在噪点里回传求救词。建议先重放监听，利用节奏而不是字形判断。",
    targetText: "SHELTER",
    displayTarget: "待破译",
    incomingSequence: encodeText("SHELTER"),
    mode: "noise",
    noiseLevel: 0.52,
  },
  {
    id: "tube-delay",
    title: "真空延迟",
    typeLabel: "编码",
    envLabel: "真空管室 / 延迟",
    difficultyLabel: "Lv.5",
    story: "旧式真空管机会吞掉你前半拍的犹豫。只有在预判节拍后按下，代码才会完整落到纸带上。",
    brief: "切换到更高级机型也可以，但仍需完成关键词发送：FUTURE",
    targetText: "FUTURE",
    displayTarget: "FUTURE",
    incomingSequence: encodeText("FUTURE"),
    mode: "encode",
    noiseLevel: 0.34,
  },
  {
    id: "relay-finale",
    title: "双时空中继",
    typeLabel: "终局",
    envLabel: "传奇终端 / 复合干扰",
    difficultyLabel: "Lv.6",
    story: "最后一段信息来自两条时间线叠加后的总站。只有稳定的节奏能把答案从噪点里拽出来。",
    brief: "监听并回传最终确认词：ALLYNODE",
    targetText: "ALLYNODE",
    displayTarget: "待破译",
    incomingSequence: encodeText("ALLYNODE"),
    mode: "noise",
    noiseLevel: 0.72,
  },
];

const ACHIEVEMENTS = [
  { id: "first-clear", title: "初次入网", caption: "完成第一关，证明你掌握了点划节奏。 " },
  { id: "double-unlock", title: "旧机修复师", caption: "解锁真空管机型。 " },
  { id: "signal-analyst", title: "噪声分析员", caption: "完成首个干扰任务。 " },
  { id: "legendary", title: "中继站守门人", caption: "完成全部战役并解锁传奇机型。 " },
];

const STORAGE_KEY = "eric-morse-cipher-progress-v1";
const DEFAULT_PLAYER_NAME = "ERIC";

const state = {
  currentMissionIndex: 0,
  selectedMachineId: "mechanical",
  gateVerified: false,
  playerName: DEFAULT_PLAYER_NAME,
  exampleHeard: false,
  completedMissionIds: [],
  totalScore: 0,
  currentMissionScore: 0,
  bestStreak: 0,
  activeStreak: 0,
  currentSymbol: "",
  currentTransmission: "",
  errors: 0,
  pulses: 0,
  missionStartedAt: 0,
  missionComplete: false,
  keyDown: false,
  pressStartedAt: 0,
  lastReleaseAt: 0,
  lastPulseMs: 0,
  livePreview: "...",
  missionStateLabel: "待命",
  lastClassification: null,
  flashUntil: 0,
  replaying: false,
  replayUntil: 0,
  noiseSeed: Math.random() * 9999,
  pulseVisuals: [],
  displayIncomingSequence: "--",
  logs: [],
};

const dom = {
  gateScreen: document.getElementById("gate-screen"),
  gateAnswer: document.getElementById("gate-answer"),
  gateSubmit: document.getElementById("gate-submit"),
  gateError: document.getElementById("gate-error"),
  playerNameInput: document.getElementById("player-name-input"),
  playerNameApply: document.getElementById("player-name-apply"),
  playerNameDisplay: document.getElementById("player-name-display"),
  playerMorseDisplay: document.getElementById("player-morse-display"),
  playerMissionNote: document.getElementById("player-mission-note"),
  phraseInput: document.getElementById("phrase-input"),
  phraseApply: document.getElementById("phrase-apply"),
  phraseSourceDisplay: document.getElementById("phrase-source-display"),
  phraseLatinDisplay: document.getElementById("phrase-latin-display"),
  phraseMorseDisplay: document.getElementById("phrase-morse-display"),
  phraseNote: document.getElementById("phrase-note"),
  phraseChips: Array.from(document.querySelectorAll(".phrase-chip")),
  noiseCanvas: document.getElementById("noise-canvas"),
  waveform: document.getElementById("waveform"),
  missionList: document.getElementById("mission-list"),
  missionTitle: document.getElementById("mission-title"),
  missionStory: document.getElementById("mission-story"),
  missionBrief: document.getElementById("mission-brief"),
  incomingSequence: document.getElementById("incoming-sequence"),
  missionTypeChip: document.getElementById("mission-type-chip"),
  missionEnvChip: document.getElementById("mission-env-chip"),
  missionDifficultyChip: document.getElementById("mission-difficulty-chip"),
  currentSymbol: document.getElementById("current-symbol"),
  livePreview: document.getElementById("live-preview"),
  lastPulse: document.getElementById("last-pulse"),
  missionState: document.getElementById("mission-state"),
  targetText: document.getElementById("target-text"),
  transmittedText: document.getElementById("transmitted-text"),
  replayBtn: document.getElementById("replay-btn"),
  resetBtn: document.getElementById("reset-btn"),
  nextBtn: document.getElementById("next-btn"),
  tutorialCallout: document.getElementById("tutorial-callout"),
  tutorialTitle: document.getElementById("tutorial-title"),
  tutorialText: document.getElementById("tutorial-text"),
  telegraphKey: document.getElementById("telegraph-key"),
  tempoFill: document.getElementById("tempo-fill"),
  accuracyValue: document.getElementById("accuracy-value"),
  rhythmValue: document.getElementById("rhythm-value"),
  speedValue: document.getElementById("speed-value"),
  machineList: document.getElementById("machine-list"),
  machineNameTag: document.getElementById("machine-name-tag"),
  machinePreviewImage: document.getElementById("machine-preview-image"),
  machinePreviewTitle: document.getElementById("machine-preview-title"),
  machinePreviewCaption: document.getElementById("machine-preview-caption"),
  systemLog: document.getElementById("system-log"),
  achievementList: document.getElementById("achievement-list"),
  streakValue: document.getElementById("streak-value"),
  missionScore: document.getElementById("mission-score"),
  noiseValue: document.getElementById("noise-value"),
  totalScore: document.getElementById("total-score"),
  campaignProgress: document.getElementById("campaign-progress"),
  machineProgress: document.getElementById("machine-progress"),
  campaignStatusTag: document.getElementById("campaign-status-tag"),
  morseChartGrid: document.getElementById("morse-chart-grid"),
  morseChartTag: document.getElementById("morse-chart-tag"),
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

let audioContext = null;
let masterGain = null;
let liveOscillator = null;
let liveGain = null;
let audioUnlocked = false;

const TONE_FREQUENCY = 720;
const TONE_PEAK_GAIN = 0.06;
const TONE_ATTACK_SEC = 0.018;
const TONE_RELEASE_SEC = 0.04;
const DOT_TONE_MS = 120;
const DASH_TONE_MS = 360;
const DOT_CYCLE_MS = 200;
const DASH_CYCLE_MS = 480;
const LETTER_GAP_MS = 280;
let waveformContext = dom.waveform.getContext("2d");
let noiseContext = dom.noiseCanvas.getContext("2d");

function normalizeText(value) {
  return String(value).toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function normalizePlayerName(value) {
  return String(value).toUpperCase().replace(/[^A-Z]/g, "");
}

function encodeText(value) {
  return normalizeText(value)
    .split("")
    .map((character) => MORSE_TABLE[character] || "")
    .filter(Boolean)
    .join(" ");
}

function normalizeLatinPhrase(value) {
  return String(value)
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function resolvePhrase(rawValue) {
  const source = String(rawValue || "").trim() || "我爱你";
  const compact = source.replace(/\s+/g, "");
  const aliasLatin = PHRASE_ALIASES[compact];
  if (aliasLatin) {
    return {
      source,
      latin: aliasLatin,
      morse: aliasLatin
        .split(" ")
        .map((word) => encodeText(word))
        .join("  "),
      note: "已按拼音生成示例短句。",
    };
  }

  const latin = normalizeLatinPhrase(source);
  const hasChinese = /[\u4e00-\u9fff]/.test(source);
  if (!latin) {
    return {
      source,
      latin: "（无可转码内容）",
      morse: "",
      note: hasChinese
        ? "这句中文暂未内置拼音，请直接输入拼音或英文。"
        : "请输入英文字母或数字。",
    };
  }
  return {
    source,
    latin,
    morse: latin
      .split(" ")
      .map((word) => encodeText(word))
      .join("  "),
    note: hasChinese
      ? "中文部分暂未内置拼音，仅对其中的英文/数字进行了转码。"
      : "已按英文/数字直接生成摩斯码。",
  };
}

function currentMission() {
  return MISSIONS[state.currentMissionIndex];
}

function currentMachine() {
  return MACHINES.find((machine) => machine.id === state.selectedMachineId) || MACHINES[0];
}

function isTutorialMission() {
  return state.currentMissionIndex === 0;
}

function missionsCompletedCount() {
  return state.completedMissionIds.length;
}

function unlockedMachines() {
  const completed = missionsCompletedCount();
  return MACHINES.filter((machine) => completed >= machine.unlockAt).map((machine) => machine.id);
}

function isMissionUnlocked(index) {
  return index <= missionsCompletedCount();
}

function saveProgress() {
  const payload = {
    selectedMachineId: state.selectedMachineId,
    playerName: state.playerName,
    completedMissionIds: state.completedMissionIds,
    totalScore: state.totalScore,
    bestStreak: state.bestStreak,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function loadProgress() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    state.selectedMachineId = parsed.selectedMachineId || state.selectedMachineId;
    state.playerName = normalizePlayerName(parsed.playerName || state.playerName) || DEFAULT_PLAYER_NAME;
    state.completedMissionIds = Array.isArray(parsed.completedMissionIds) ? parsed.completedMissionIds : [];
    state.totalScore = Number(parsed.totalScore || 0);
    state.bestStreak = Number(parsed.bestStreak || 0);
    state.activeStreak = 0;
  } catch (error) {
    console.warn("Failed to load progress", error);
  }
}

function addLog(message) {
  const now = new Date();
  const timestamp = now.toLocaleTimeString("zh-CN", { hour12: false });
  state.logs = state.logs || [];
  state.logs.unshift({ timestamp, message });
  state.logs = state.logs.slice(0, 10);
  renderLogs();
}

function renderLogs() {
  dom.systemLog.innerHTML = "";
  for (const item of state.logs || []) {
    const li = document.createElement("li");
    li.innerHTML = `<span class="log-time">${item.timestamp}</span>${item.message}`;
    dom.systemLog.appendChild(li);
  }
}

function resetMissionState({ keepLogs = false } = {}) {
  state.currentSymbol = "";
  state.currentTransmission = "";
  state.errors = 0;
  state.pulses = 0;
  state.currentMissionScore = 0;
  state.missionStartedAt = performance.now();
  state.missionComplete = false;
  state.keyDown = false;
  state.pressStartedAt = 0;
  state.lastReleaseAt = performance.now();
  state.lastPulseMs = 0;
  state.livePreview = "...";
  state.missionStateLabel = "待命";
  state.lastClassification = null;
  state.flashUntil = 0;
  state.replaying = false;
  state.replayUntil = 0;
  state.exampleHeard = !isTutorialMission();
  state.pulseVisuals = [];
  state.displayIncomingSequence = formatIncomingSequence(currentMission());
  stopLiveTone();
  if (!keepLogs) {
    state.logs = [];
  }
  const mission = currentMission();
  addLog(`已装载任务《${mission.title}》，准备发报。`);
  updateUI();
}

function getFirstMissionConfig(name) {
  const playerName = normalizePlayerName(name) || DEFAULT_PLAYER_NAME;
  return {
    targetText: playerName,
    displayTarget: playerName,
    incomingSequence: encodeText(playerName),
    brief: `先把你自己的英文名字发出去：${playerName}`,
    story: `中继站先要记录你的专属代号。输入自己的英文名字后，系统会自动生成正确摩斯码；第一关的任务，就是把 ${playerName} 稳稳发出去。`,
  };
}

function syncFirstMissionFromPlayerName(name) {
  const playerName = normalizePlayerName(name) || DEFAULT_PLAYER_NAME;
  const firstMission = MISSIONS[0];
  const config = getFirstMissionConfig(playerName);
  firstMission.targetText = config.targetText;
  firstMission.displayTarget = config.displayTarget;
  firstMission.incomingSequence = config.incomingSequence;
  firstMission.brief = config.brief;
  firstMission.story = config.story;
}

function renderPlayerIdentityPreview(name) {
  const playerName = normalizePlayerName(name) || DEFAULT_PLAYER_NAME;
  dom.playerNameDisplay.textContent = playerName;
  dom.playerMorseDisplay.textContent = encodeText(playerName);
  dom.playerMissionNote.textContent = `第一关目标：把 ${playerName} 发出去。`;
}

function renderPhrasePreview(rawValue) {
  const phrase = resolvePhrase(rawValue);
  dom.phraseInput.value = phrase.source;
  dom.phraseSourceDisplay.textContent = phrase.source;
  dom.phraseLatinDisplay.textContent = phrase.latin;
  dom.phraseMorseDisplay.textContent = phrase.morse;
  dom.phraseNote.textContent = phrase.note;
}

function applyPlayerName(rawName, { resetMission = true, silent = false } = {}) {
  const playerName = normalizePlayerName(rawName) || DEFAULT_PLAYER_NAME;
  state.playerName = playerName;
  syncFirstMissionFromPlayerName(playerName);

  dom.playerNameInput.value = playerName;
  renderPlayerIdentityPreview(playerName);
  saveProgress();

  if (state.currentMissionIndex === 0 && resetMission) {
    resetMissionState({ keepLogs: false });
  } else {
    if (state.currentMissionIndex === 0) {
      state.displayIncomingSequence = formatIncomingSequence(currentMission());
    }
    updateUI();
  }

  if (!silent) {
    addLog(`已生成 ${playerName} 的专属摩斯密码。`);
  }
}

function verifyGateAnswer() {
  const answer = String(dom.gateAnswer.value || "").trim();
  if (answer !== "12") {
    dom.gateError.classList.add("visible");
    dom.gateAnswer.focus();
    dom.gateAnswer.select();
    return;
  }

  dom.gateError.classList.remove("visible");
  state.gateVerified = true;
  dom.gateScreen.classList.add("hidden");
  addLog("身份验证通过，Eric 专属通道已开启。");
  replayMissionSignal();
  updateUI();
}

function setMission(index) {
  if (!isMissionUnlocked(index)) {
    addLog("后续任务尚未解锁。先完成前一任务。");
    return;
  }
  state.currentMissionIndex = index;
  resetMissionState({ keepLogs: false });
  updateMissionList();
}

function updateMissionList() {
  dom.missionList.innerHTML = "";
  MISSIONS.forEach((mission, index) => {
    const button = document.createElement("button");
    button.className = "mission-card";
    const isCompleted = state.completedMissionIds.includes(mission.id);
    const unlocked = isMissionUnlocked(index);
    if (index === state.currentMissionIndex) {
      button.classList.add("active");
    }
    if (isCompleted) {
      button.classList.add("completed");
    }
    if (!unlocked) {
      button.classList.add("locked");
      button.disabled = true;
    }
    button.innerHTML = `
      <div class="card-topline">
        <span class="card-title">${mission.title}</span>
        <span>${mission.difficultyLabel}</span>
      </div>
      <div class="card-subline">
        <span class="card-caption">${mission.typeLabel} / ${mission.envLabel}</span>
        <span>${isCompleted ? "已通关" : unlocked ? "可执行" : "锁定"}</span>
      </div>
    `;
    button.addEventListener("click", () => setMission(index));
    dom.missionList.appendChild(button);
  });
}

function updateMachineList() {
  const unlocked = unlockedMachines();
  dom.machineList.innerHTML = "";
  MACHINES.forEach((machine) => {
    const button = document.createElement("button");
    const available = unlocked.includes(machine.id);
    button.className = "machine-card";
    if (machine.id === state.selectedMachineId) {
      button.classList.add("active");
    }
    if (!available) {
      button.classList.add("locked");
      button.disabled = true;
    }
    button.innerHTML = `
      <img class="machine-thumb" src="${machine.image}" alt="${machine.name}">
      <div>
        <div class="machine-titleline">
          <span class="machine-title">${machine.name}</span>
          <span>${available ? "已解锁" : `需 ${machine.unlockAt} 关`}</span>
        </div>
        <div class="machine-caption">${machine.caption}</div>
      </div>
    `;
    button.addEventListener("click", () => {
      if (!available) {
        return;
      }
      state.selectedMachineId = machine.id;
      saveProgress();
      updateMachineList();
      updateUI();
      addLog(`机型切换为 ${machine.name}。`);
    });
    dom.machineList.appendChild(button);
  });
}

function updateAchievements() {
  const completed = missionsCompletedCount();
  const unlocked = unlockedMachines();
  const progress = {
    "first-clear": completed >= 1,
    "double-unlock": unlocked.includes("vacuum"),
    "signal-analyst": state.completedMissionIds.includes("storm-filter"),
    legendary: completed === MISSIONS.length && unlocked.includes("legend"),
  };

  dom.achievementList.innerHTML = "";
  ACHIEVEMENTS.forEach((achievement) => {
    const card = document.createElement("article");
    card.className = "achievement-card";
    if (progress[achievement.id]) {
      card.classList.add("completed");
    } else {
      card.classList.add("locked");
    }
    card.innerHTML = `
      <div class="achievement-titleline">
        <span class="achievement-title">${achievement.title}</span>
        <span>${progress[achievement.id] ? "达成" : "未达成"}</span>
      </div>
      <div class="achievement-caption">${achievement.caption.trim()}</div>
    `;
    dom.achievementList.appendChild(card);
  });
}

function computeAccuracy() {
  if (!state.pulses && !state.errors) {
    return 100;
  }
  return Math.max(40, Math.round(100 - state.errors * 11));
}

function computeSpeed() {
  const elapsedMinutes = Math.max((performance.now() - state.missionStartedAt) / 60000, 1 / 60);
  return Math.round(state.pulses / elapsedMinutes);
}

function computeRhythmRank() {
  const accuracy = computeAccuracy();
  if (accuracy >= 96) {
    return "S";
  }
  if (accuracy >= 88) {
    return "A";
  }
  if (accuracy >= 76) {
    return "B";
  }
  return "C";
}

function currentExpectedLetter() {
  const mission = currentMission();
  const target = normalizeText(mission.targetText);
  const typed = normalizeText(state.currentTransmission);
  return target[typed.length] || null;
}

function playMorseDemo(letter) {
  unlockAudio();
  const sequence = MORSE_TABLE[letter] || "";
  let cursor = 0;
  for (const ch of sequence) {
    if (ch === ".") {
      playTone(DOT_TONE_MS, TONE_FREQUENCY, cursor);
      cursor += DOT_CYCLE_MS;
    } else if (ch === "-") {
      playTone(DASH_TONE_MS, TONE_FREQUENCY, cursor);
      cursor += DASH_CYCLE_MS;
    }
  }
}

function renderMorseChart() {
  if (!dom.morseChartGrid) {
    return;
  }
  const expected = currentExpectedLetter();
  const mission = currentMission();
  const isDrill = mission.id === "alphabet-drill";
  const typed = normalizeText(state.currentTransmission);
  const targetLetters = new Set(normalizeText(mission.targetText).split(""));

  dom.morseChartGrid.innerHTML = "";
  for (const letter of ALPHABET) {
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "morse-cell";
    if (letter === expected && !state.missionComplete) {
      cell.classList.add("active");
    }
    if (isDrill && typed.includes(letter)) {
      cell.classList.add("done");
    }
    if (!isDrill && !targetLetters.has(letter)) {
      cell.classList.add("dim");
    }
    cell.innerHTML = `<span class="morse-letter">${letter}</span><span class="morse-code">${MORSE_TABLE[letter]}</span>`;
    cell.addEventListener("click", () => playMorseDemo(letter));
    dom.morseChartGrid.appendChild(cell);
  }

  if (dom.morseChartTag) {
    dom.morseChartTag.textContent = isDrill
      ? `当前目标 ${expected || "完成"}`
      : "点击字母听示范";
  }
}

function updateUI() {
  const mission = currentMission();
  const machine = currentMachine();
  const accuracy = computeAccuracy();
  const speed = computeSpeed();
  const unlocked = unlockedMachines();

  renderPlayerIdentityPreview(state.playerName);
  dom.missionTitle.textContent = mission.title;
  dom.missionStory.textContent = mission.story;
  dom.missionBrief.textContent = mission.brief;
  dom.incomingSequence.textContent = state.displayIncomingSequence;
  dom.missionTypeChip.textContent = mission.typeLabel;
  dom.missionEnvChip.textContent = mission.envLabel;
  dom.missionDifficultyChip.textContent = mission.difficultyLabel;
  dom.currentSymbol.textContent = state.currentSymbol || "等待输入";
  dom.livePreview.textContent = state.livePreview;
  dom.lastPulse.textContent = `${Math.round(state.lastPulseMs)} ms`;
  dom.missionState.textContent = state.missionStateLabel;
  dom.targetText.textContent = mission.displayTarget;
  dom.transmittedText.textContent = state.currentTransmission || "尚未发报";
  dom.machineNameTag.textContent = machine.name;
  dom.machinePreviewImage.src = machine.image;
  dom.machinePreviewImage.alt = machine.name;
  dom.machinePreviewTitle.textContent = machine.name;
  dom.machinePreviewCaption.textContent = machine.caption;
  dom.accuracyValue.textContent = `${accuracy}%`;
  dom.rhythmValue.textContent = computeRhythmRank();
  dom.speedValue.textContent = `${speed} / min`;
  dom.streakValue.textContent = String(state.bestStreak);
  dom.missionScore.textContent = String(state.currentMissionScore);
  dom.noiseValue.textContent = noiseLabel(mission.noiseLevel);
  dom.totalScore.textContent = String(state.totalScore);
  dom.campaignProgress.textContent = `${missionsCompletedCount()} / ${MISSIONS.length}`;
  dom.machineProgress.textContent = `${unlocked.length} / ${MACHINES.length}`;
  dom.campaignStatusTag.textContent =
    missionsCompletedCount() === MISSIONS.length ? "总站已接通" : MISSIONS[Math.min(missionsCompletedCount(), MISSIONS.length - 1)].title;

  const tempoPercent = Math.min(100, (state.lastPulseMs / 740) * 100);
  dom.tempoFill.style.width = `${tempoPercent}%`;
  dom.nextBtn.textContent =
    missionsCompletedCount() === MISSIONS.length && state.currentMissionIndex === MISSIONS.length - 1
      ? "重新演习"
      : "下一任务";
  dom.replayBtn.textContent = isTutorialMission() ? "播放姓名示例" : "重放监听";

  if (isTutorialMission()) {
    dom.tutorialCallout.hidden = false;
    dom.tutorialTitle.textContent = state.exampleHeard ? "现在轮到你模仿发报" : "先听示例，再模仿发报";
    dom.tutorialText.textContent = state.exampleHeard
      ? `示例已经播放完毕。现在按住发报键，把 ${state.playerName} 模仿发出去，系统会给你评分。`
      : `先点“播放姓名示例”，听系统把 ${state.playerName} 发一遍。听完后按钮会亮起，再开始模仿。`;
    dom.telegraphKey.classList.toggle("guided", state.exampleHeard);
    dom.telegraphKey.classList.toggle("waiting", !state.exampleHeard);
  } else {
    dom.tutorialCallout.hidden = true;
    dom.telegraphKey.classList.remove("guided", "waiting");
  }

  updateMissionList();
  updateMachineList();
  updateAchievements();
  renderMorseChart();
}

function formatIncomingSequence(mission) {
  if (mission.mode === "encode") {
    return `${mission.incomingSequence}  |  校验样本`;
  }
  if (mission.mode === "noise") {
    return distortSequence(mission.incomingSequence, mission.noiseLevel);
  }
  return mission.incomingSequence;
}

function distortSequence(sequence, noiseLevel) {
  const pool = ["~", "×", "·", "-", ".", "/", " "];
  return sequence
    .split("")
    .map((character) => {
      if (character === " " || Math.random() > noiseLevel * 0.45) {
        return character;
      }
      return pool[Math.floor(Math.random() * pool.length)];
    })
    .join("");
}

function noiseLabel(value) {
  if (value >= 0.68) {
    return "极高";
  }
  if (value >= 0.45) {
    return "高";
  }
  if (value >= 0.24) {
    return "中";
  }
  return "低";
}

function ensureAudio() {
  if (audioContext) {
    return;
  }
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return;
  }
  audioContext = new AudioContextClass();
  masterGain = audioContext.createGain();
  masterGain.gain.value = 0.28;
  masterGain.connect(audioContext.destination);
}

function unlockAudio() {
  ensureAudio();
  if (!audioContext) {
    return;
  }
  if (audioContext.state === "suspended") {
    const resumed = audioContext.resume();
    if (resumed && typeof resumed.catch === "function") {
      resumed.catch(() => {});
    }
  }
  if (!audioUnlocked) {
    try {
      const buffer = audioContext.createBuffer(1, 1, 22050);
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start(0);
      audioUnlocked = true;
    } catch (error) {
      // ignore — some browsers throw if already running
    }
  }
}

function startLiveTone() {
  ensureAudio();
  if (!audioContext || liveOscillator) {
    return;
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  liveOscillator = audioContext.createOscillator();
  liveGain = audioContext.createGain();
  liveOscillator.type = "square";
  liveOscillator.frequency.value = TONE_FREQUENCY;
  liveGain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  liveGain.gain.exponentialRampToValueAtTime(TONE_PEAK_GAIN, audioContext.currentTime + TONE_ATTACK_SEC);
  liveOscillator.connect(liveGain);
  liveGain.connect(masterGain);
  liveOscillator.start();
}

function stopLiveTone() {
  if (!audioContext || !liveOscillator || !liveGain) {
    liveOscillator = null;
    liveGain = null;
    return;
  }
  const now = audioContext.currentTime;
  liveGain.gain.cancelScheduledValues(now);
  liveGain.gain.setValueAtTime(Math.max(liveGain.gain.value, 0.0001), now);
  liveGain.gain.exponentialRampToValueAtTime(0.0001, now + TONE_RELEASE_SEC);
  liveOscillator.stop(now + TONE_RELEASE_SEC + 0.01);
  liveOscillator = null;
  liveGain = null;
}

function playTone(durationMs, frequency = TONE_FREQUENCY, delayMs = 0) {
  ensureAudio();
  if (!audioContext) {
    return;
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const startTime = audioContext.currentTime + delayMs / 1000;
  const holdEnd = startTime + durationMs / 1000;
  const attackEnd = Math.min(startTime + TONE_ATTACK_SEC, holdEnd);
  const releaseEnd = holdEnd + TONE_RELEASE_SEC;

  oscillator.type = "square";
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(TONE_PEAK_GAIN, attackEnd);
  gain.gain.setValueAtTime(TONE_PEAK_GAIN, holdEnd);
  gain.gain.exponentialRampToValueAtTime(0.0001, releaseEnd);
  oscillator.connect(gain);
  gain.connect(masterGain);
  oscillator.start(startTime);
  oscillator.stop(releaseEnd + 0.02);
}

function pressKey() {
  if (!state.gateVerified || state.keyDown || state.missionComplete) {
    return;
  }
  if (isTutorialMission() && !state.exampleHeard) {
    state.missionStateLabel = "请先听示例";
    addLog(`先播放 ${state.playerName} 的姓名示例，再开始模仿发报。`);
    updateUI();
    return;
  }
  ensureAudio();
  state.keyDown = true;
  state.pressStartedAt = performance.now();
  state.missionStateLabel = "发报中";
  state.flashUntil = performance.now() + 120;
  dom.telegraphKey.classList.add("active");
  startLiveTone();
  updateUI();
}

function releaseKey() {
  if (!state.keyDown || state.missionComplete) {
    return;
  }

  state.keyDown = false;
  dom.telegraphKey.classList.remove("active");
  stopLiveTone();

  const machine = currentMachine();
  const rawDuration = performance.now() - state.pressStartedAt;
  const jitter = (Math.random() * 2 - 1) * machine.jitter;
  let effectiveDuration = Math.max(55, rawDuration - machine.latency + jitter);

  if (machine.assist > 0) {
    const dotDistance = Math.abs(effectiveDuration - 140);
    const dashDistance = Math.abs(effectiveDuration - 420);
    if (dotDistance < 80 && Math.random() < machine.assist) {
      effectiveDuration = 140;
    }
    if (dashDistance < 110 && Math.random() < machine.assist) {
      effectiveDuration = 420;
    }
  }

  const symbol = effectiveDuration <= machine.dotCutoff ? "." : "-";
  state.currentSymbol += symbol;
  state.lastPulseMs = effectiveDuration;
  state.lastReleaseAt = performance.now();
  state.pulses += 1;
  state.lastClassification = symbol;
  state.livePreview = REVERSE_MORSE[state.currentSymbol] || "...";
  state.flashUntil = performance.now() + 220;
  state.pulseVisuals.push({
    createdAt: performance.now(),
    width: symbol === "." ? 0.08 : 0.18,
    height: symbol === "." ? 0.5 : 0.82,
  });
  state.missionStateLabel = symbol === "." ? "录入点" : "录入划";
  updateUI();
}

function finalizeCurrentLetter() {
  if (!state.currentSymbol) {
    return;
  }
  const decoded = REVERSE_MORSE[state.currentSymbol];
  if (!decoded) {
    state.errors += 1;
    addLog(`非法报码 ${state.currentSymbol}，已丢弃。`);
  } else {
    state.currentTransmission += decoded;
    const mission = currentMission();
    const expectedPrefix = normalizeText(mission.targetText).slice(0, state.currentTransmission.length);
    if (state.currentTransmission !== expectedPrefix) {
      state.errors += 1;
      addLog(`当前回传为 ${state.currentTransmission}，与目标节奏不一致。`);
    } else {
      addLog(`识别字母 ${decoded}。`);
    }
    if (normalizeText(state.currentTransmission) === normalizeText(mission.targetText)) {
      completeMission();
    }
  }

  state.currentSymbol = "";
  state.livePreview = "...";
  state.missionStateLabel = state.missionComplete ? "任务完成" : "待命";
  updateUI();
}

function completeMission() {
  if (state.missionComplete) {
    return;
  }
  const mission = currentMission();
  const accuracy = computeAccuracy();
  const speed = computeSpeed();
  const machineBonus = currentMachine().id === "legend" ? 140 : currentMachine().id === "digital" ? 90 : 35;
  const missionScore = 420 + accuracy * 7 + speed * 3 + machineBonus;
  const unlockedBefore = unlockedMachines().length;

  state.currentMissionScore = missionScore;
  state.totalScore += missionScore;
  state.missionComplete = true;
  state.missionStateLabel = "任务完成";

  if (!state.completedMissionIds.includes(mission.id)) {
    state.completedMissionIds.push(mission.id);
    state.activeStreak += 1;
    state.bestStreak = Math.max(state.bestStreak, state.activeStreak);
  }

  const nextMachine = MACHINES.find((machine) => machine.unlockAt === missionsCompletedCount());
  addLog(`任务完成：《${mission.title}》得分 ${missionScore}。`);
  if (unlockedMachines().length > unlockedBefore && nextMachine) {
    addLog(`新机型解锁：${nextMachine.name}。`);
  }
  if (missionsCompletedCount() === MISSIONS.length) {
    addLog("全部战役已完成，双时空中继站全面上线。");
  }

  saveProgress();
  updateUI();
}

function goNextMission() {
  if (!state.gateVerified) {
    return;
  }
  if (missionsCompletedCount() === MISSIONS.length && state.currentMissionIndex === MISSIONS.length - 1) {
    state.currentMissionIndex = 0;
    resetMissionState({ keepLogs: false });
    updateMissionList();
    return;
  }
  const nextIndex = Math.min(state.currentMissionIndex + 1, missionsCompletedCount(), MISSIONS.length - 1);
  if (nextIndex === state.currentMissionIndex) {
    addLog("请先完成当前任务，才能前往下一关。");
    return;
  }
  setMission(nextIndex);
}

function replayMissionSignal() {
  if (!state.gateVerified) {
    return;
  }
  const mission = currentMission();
  if (state.replaying) {
    return;
  }

  const sequence = mission.incomingSequence;
  state.replaying = true;
  state.replayUntil = performance.now() + morsePlaybackDuration(sequence);
  state.missionStateLabel = "重放监听";
  addLog(`开始重放《${mission.title}》监听波形。`);
  updateUI();

  let cursorMs = 0;
  for (const character of sequence) {
    if (character === ".") {
      schedulePulseVisual(cursorMs, 0.09, 0.55);
      playTone(DOT_TONE_MS, TONE_FREQUENCY, cursorMs);
      cursorMs += DOT_CYCLE_MS;
    } else if (character === "-") {
      schedulePulseVisual(cursorMs, 0.18, 0.88);
      playTone(DASH_TONE_MS, TONE_FREQUENCY, cursorMs);
      cursorMs += DASH_CYCLE_MS;
    } else if (character === " ") {
      cursorMs += LETTER_GAP_MS;
    }
  }

  window.setTimeout(() => {
    state.replaying = false;
    if (isTutorialMission()) {
      state.exampleHeard = true;
      state.missionStateLabel = state.missionComplete ? "任务完成" : "示例已播放";
      addLog(`姓名示例播放完成。现在请模仿把 ${state.playerName} 发出去。`);
    } else {
      state.missionStateLabel = state.missionComplete ? "任务完成" : "待命";
    }
    updateUI();
  }, cursorMs + 80);
}

function morsePlaybackDuration(sequence) {
  let total = 0;
  for (const character of sequence) {
    if (character === ".") {
      total += DOT_CYCLE_MS;
    } else if (character === "-") {
      total += DASH_CYCLE_MS;
    } else if (character === " ") {
      total += LETTER_GAP_MS;
    }
  }
  return total;
}

function schedulePulseVisual(delayMs, width, height) {
  window.setTimeout(() => {
    state.flashUntil = performance.now() + 220;
    state.pulseVisuals.push({
      createdAt: performance.now(),
      width,
      height,
    });
  }, delayMs);
}

function resizeCanvases() {
  const noiseDpr = Math.min(window.devicePixelRatio || 1, 2);
  dom.noiseCanvas.width = Math.floor(window.innerWidth * noiseDpr);
  dom.noiseCanvas.height = Math.floor(window.innerHeight * noiseDpr);
  dom.noiseCanvas.style.width = `${window.innerWidth}px`;
  dom.noiseCanvas.style.height = `${window.innerHeight}px`;
  noiseContext.setTransform(1, 0, 0, 1, 0, 0);
  noiseContext.scale(noiseDpr, noiseDpr);

  const rect = dom.waveform.getBoundingClientRect();
  const waveDpr = Math.min(window.devicePixelRatio || 1, 2);
  dom.waveform.width = Math.floor(rect.width * waveDpr);
  dom.waveform.height = Math.floor(rect.height * waveDpr);
  waveformContext.setTransform(1, 0, 0, 1, 0, 0);
  waveformContext.scale(waveDpr, waveDpr);
}

function drawNoiseBackground(time) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  noiseContext.clearRect(0, 0, width, height);
  const mission = currentMission();
  const dotCount = Math.round(90 + mission.noiseLevel * 360);

  for (let index = 0; index < dotCount; index += 1) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const alpha = 0.02 + Math.random() * (0.05 + mission.noiseLevel * 0.08);
    const size = Math.random() > 0.9 ? 2 : 1;
    noiseContext.fillStyle = `rgba(180, 230, 255, ${alpha})`;
    noiseContext.fillRect(x, y, size, size);
  }
  noiseContext.fillStyle = `rgba(92, 243, 255, ${0.04 + mission.noiseLevel * 0.05})`;
  noiseContext.fillRect(0, (time * 0.11) % height, width, 1);
}

function drawWaveform(time) {
  const rect = dom.waveform.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
  const mission = currentMission();
  const now = performance.now();

  waveformContext.clearRect(0, 0, width, height);
  const gradient = waveformContext.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "rgba(5, 12, 18, 0.95)");
  gradient.addColorStop(1, "rgba(5, 16, 24, 0.95)");
  waveformContext.fillStyle = gradient;
  waveformContext.fillRect(0, 0, width, height);

  waveformContext.strokeStyle = "rgba(92, 243, 255, 0.08)";
  waveformContext.lineWidth = 1;
  for (let y = 20; y < height; y += 22) {
    waveformContext.beginPath();
    waveformContext.moveTo(0, y);
    waveformContext.lineTo(width, y);
    waveformContext.stroke();
  }

  for (let x = 24; x < width; x += 48) {
    waveformContext.beginPath();
    waveformContext.moveTo(x, 0);
    waveformContext.lineTo(x, height);
    waveformContext.stroke();
  }

  const baseline = height / 2;
  waveformContext.beginPath();
  waveformContext.lineWidth = 2;
  waveformContext.strokeStyle = "rgba(92, 243, 255, 0.28)";

  for (let x = 0; x <= width; x += 4) {
    const noise = Math.sin(x * 0.03 + time * 0.0024 + state.noiseSeed) * mission.noiseLevel * 22;
    const shimmer = Math.sin(x * 0.01 + time * 0.0016) * 8;
    const active = state.keyDown ? Math.sin(x * 0.22 + time * 0.026) * 36 : 0;
    const replayPulse = state.replaying ? Math.sin(x * 0.09 + time * 0.014) * 14 : 0;
    const y = baseline + noise + shimmer + active + replayPulse;
    if (x === 0) {
      waveformContext.moveTo(x, y);
    } else {
      waveformContext.lineTo(x, y);
    }
  }
  waveformContext.stroke();

  state.pulseVisuals = state.pulseVisuals.filter((pulse) => now - pulse.createdAt < 2200);
  state.pulseVisuals.forEach((pulse, index) => {
    const age = now - pulse.createdAt;
    const progress = age / 2200;
    const x = width - progress * (width + 120);
    const pulseWidth = Math.max(16, pulse.width * 220);
    const pulseHeight = pulse.height * height * 0.36;
    const alpha = 1 - progress;

    waveformContext.fillStyle = `rgba(92, 243, 255, ${0.42 * alpha})`;
    waveformContext.fillRect(x, baseline - pulseHeight / 2, pulseWidth, pulseHeight);

    if (index % 2 === 0) {
      waveformContext.strokeStyle = `rgba(255, 202, 105, ${0.22 * alpha})`;
      waveformContext.strokeRect(x, baseline - pulseHeight / 2, pulseWidth, pulseHeight);
    }
  });

  if (now < state.flashUntil) {
    waveformContext.fillStyle = "rgba(147, 255, 232, 0.08)";
    waveformContext.fillRect(0, 0, width, height);
  }

  waveformContext.fillStyle = "rgba(92, 243, 255, 0.78)";
  waveformContext.fillRect(width * 0.72, 18, 1.5, height - 36);
}

function animationLoop(time) {
  const machine = currentMachine();
  if (!state.keyDown && state.currentSymbol && performance.now() - state.lastReleaseAt > machine.letterGap) {
    finalizeCurrentLetter();
  }

  drawNoiseBackground(time);
  drawWaveform(time);
  window.requestAnimationFrame(animationLoop);
}

function bindEvents() {
  dom.gateSubmit.addEventListener("click", () => {
    unlockAudio();
    verifyGateAnswer();
  });
  dom.gateAnswer.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      unlockAudio();
      verifyGateAnswer();
    }
  });
  dom.gateAnswer.addEventListener("input", () => {
    dom.gateError.classList.remove("visible");
  });

  dom.playerNameApply.addEventListener("click", () => {
    applyPlayerName(dom.playerNameInput.value);
  });
  dom.playerNameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      applyPlayerName(dom.playerNameInput.value);
    }
  });
  dom.playerNameInput.addEventListener("input", () => {
    const draftName = normalizePlayerName(dom.playerNameInput.value) || DEFAULT_PLAYER_NAME;
    state.playerName = draftName;
    syncFirstMissionFromPlayerName(draftName);
    if (state.currentMissionIndex === 0) {
      state.displayIncomingSequence = formatIncomingSequence(currentMission());
      updateUI();
    } else {
      renderPlayerIdentityPreview(draftName);
    }
  });

  dom.phraseApply.addEventListener("click", () => {
    renderPhrasePreview(dom.phraseInput.value);
  });
  dom.phraseInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      renderPhrasePreview(dom.phraseInput.value);
    }
  });
  dom.phraseChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      renderPhrasePreview(chip.dataset.phrase || "");
    });
  });

  dom.replayBtn.addEventListener("click", () => {
    unlockAudio();
    replayMissionSignal();
  });
  dom.resetBtn.addEventListener("click", () => {
    if (!state.gateVerified) {
      return;
    }
    state.currentSymbol = "";
    state.currentTransmission = "";
    state.errors = 0;
    state.pulses = 0;
    state.currentMissionScore = 0;
    state.missionComplete = false;
    state.missionStartedAt = performance.now();
    state.missionStateLabel = "缓冲已清空";
    addLog("已清空当前发报缓冲。");
    updateUI();
  });
  dom.nextBtn.addEventListener("click", goNextMission);

  dom.telegraphKey.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    unlockAudio();
    if (dom.telegraphKey.setPointerCapture) {
      dom.telegraphKey.setPointerCapture(event.pointerId);
    }
    pressKey();
  });
  dom.telegraphKey.addEventListener("pointerup", releaseKey);
  dom.telegraphKey.addEventListener("pointercancel", releaseKey);
  window.addEventListener("pointerup", releaseKey);
  window.addEventListener("pointercancel", releaseKey);
  window.addEventListener("blur", releaseKey);

  const isTypingTarget = (target) => {
    if (!target) return false;
    const tag = target.tagName;
    return tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable;
  };

  const unlockOnce = () => {
    unlockAudio();
    if (audioUnlocked) {
      document.removeEventListener("pointerdown", unlockOnce, true);
      document.removeEventListener("touchstart", unlockOnce, true);
      document.removeEventListener("keydown", unlockOnce, true);
    }
  };
  document.addEventListener("pointerdown", unlockOnce, true);
  document.addEventListener("touchstart", unlockOnce, true);
  document.addEventListener("keydown", unlockOnce, true);

  window.addEventListener("keydown", (event) => {
    if (event.code !== "Space") {
      return;
    }
    if (isTypingTarget(event.target)) {
      return;
    }
    event.preventDefault();
    if (!state.gateVerified) {
      return;
    }
    if (!state.keyDown) {
      unlockAudio();
      pressKey();
    }
  });

  window.addEventListener("keyup", (event) => {
    if (event.code !== "Space") {
      return;
    }
    if (isTypingTarget(event.target)) {
      return;
    }
    event.preventDefault();
    if (!state.gateVerified) {
      return;
    }
    releaseKey();
  });

  window.addEventListener("resize", resizeCanvases);
}

function boot() {
  loadProgress();
  applyPlayerName(state.playerName, { resetMission: false, silent: true });
  renderPhrasePreview("我爱你");

  if (!MACHINES.some((machine) => machine.id === state.selectedMachineId && unlockedMachines().includes(machine.id))) {
    state.selectedMachineId = "mechanical";
  }

  state.currentMissionIndex = Math.min(missionsCompletedCount(), MISSIONS.length - 1);
  state.logs = [];
  bindEvents();
  resizeCanvases();
  resetMissionState({ keepLogs: false });
  updateUI();
  dom.gateAnswer.focus();
  window.requestAnimationFrame(animationLoop);
}

boot();
