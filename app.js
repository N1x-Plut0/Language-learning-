const levels = [
  { id: "A1", name: "Breakthrough", min: 0 },
  { id: "A2", name: "Waystage", min: 4 },
  { id: "B1", name: "Threshold", min: 7 },
  { id: "B2", name: "Vantage", min: 10 },
  { id: "C1", name: "Advanced", min: 13 },
  { id: "C3", name: "Mastery", min: 15 }
];

const moduleThemes = [
  { name: "Clay + Sage", a: "#a58d78", b: "#9a9d81", title: "First Route", focus: "Core phrases and sound patterns" },
  { name: "Taupe + Fog", a: "#c2b4a9", b: "#cacaca", title: "City Loop", focus: "Questions, replies, and everyday choices" },
  { name: "Beige + Clay", a: "#ae9b8a", b: "#a58d78", title: "Grammar Gates", focus: "Sentence structure and accuracy" },
  { name: "Sage + Taupe", a: "#9a9d81", b: "#c2b4a9", title: "Story Turns", focus: "Reading, listening, and context" },
  { name: "Fog + Beige", a: "#cacaca", b: "#ae9b8a", title: "Fluent Exit", focus: "Speaking, writing, and review" }
];

const taskPatterns = {
  A1: ["Greetings", "Alphabet sounds", "Numbers", "Nouns and articles", "Present tense", "Ordering food", "Family words", "Daily verbs", "Simple questions", "Mini dialogue"],
  A2: ["Past moments", "Directions", "Shopping", "Separable verbs", "Modal verbs", "Appointments", "Weather", "Emails", "Travel phrases", "Story recap"],
  B1: ["Opinions", "Subordinate clauses", "Work topics", "Media listening", "Advice", "Plans", "Reported ideas", "Problem solving", "Short essay", "Interview"],
  B2: ["Debate language", "Passive voice", "Complex connectors", "News analysis", "Register", "Negotiation", "Abstract nouns", "Argument map", "Presentation", "Peer response"],
  C1: ["Nuance", "Academic reading", "Idioms", "Stylistic choice", "Precision grammar", "Long-form listening", "Critical summary", "Formal writing", "Spontaneous speaking", "Editing pass"],
  C3: ["Near-native tone", "Dialect awareness", "Rhetorical control", "Literary texture", "Specialized vocabulary", "Humor and irony", "Dense lectures", "Policy argument", "Translation craft", "Masterclass task"]
};

const skills = ["Vocabulary", "Pronunciation", "Grammar", "Listening", "Speaking", "Reading", "Writing", "Culture", "Review", "Challenge"];

const questions = [
  {
    prompt: "Choose the best German greeting for a first meeting.",
    answers: ["Tschuess", "Guten Tag", "Bitte sehr", "Vielleicht"],
    correct: 1
  },
  {
    prompt: "Which article fits: ___ Tisch?",
    answers: ["der", "die", "das", "den"],
    correct: 0
  },
  {
    prompt: "Translate: I would like a coffee.",
    answers: ["Ich habe Kaffee", "Ich moechte einen Kaffee", "Ich bin Kaffee", "Ich gehe Kaffee"],
    correct: 1
  },
  {
    prompt: "What is the correct verb form: Du ___ in Berlin.",
    answers: ["wohne", "wohnst", "wohnt", "wohnen"],
    correct: 1
  },
  {
    prompt: "Pick the past participle: machen",
    answers: ["gemacht", "gemachen", "machte", "machst"],
    correct: 0
  },
  {
    prompt: "Which sentence uses a modal verb correctly?",
    answers: ["Ich kann Deutsch sprechen", "Ich Deutsch kann sprechen", "Kann ich Deutsch spreche", "Ich kann spreche Deutsch"],
    correct: 0
  },
  {
    prompt: "Choose the connector that sends the conjugated verb to the end.",
    answers: ["aber", "denn", "und", "weil"],
    correct: 3
  },
  {
    prompt: "Best translation: Although it rained, we went out.",
    answers: ["Obwohl es geregnet hat, sind wir ausgegangen", "Weil es regnete, bleiben wir", "Trotzdem Regen wir gehen", "Wenn es regnet, gehen wir aus"],
    correct: 0
  },
  {
    prompt: "Which phrase sounds more formal?",
    answers: ["Was geht?", "Ich haette gern Ihre Meinung dazu", "Na, alles klar?", "Komm mal her"],
    correct: 1
  },
  {
    prompt: "Select the sentence with correct passive voice.",
    answers: ["Der Text wird gelesen", "Der Text liest worden", "Der Text ist lesen", "Der Text werden gelesen"],
    correct: 0
  },
  {
    prompt: "Which word best expresses 'nevertheless'?",
    answers: ["allerdings", "trotzdem", "beziehungsweise", "sowohl"],
    correct: 1
  },
  {
    prompt: "Pick the phrase that softens disagreement in advanced discussion.",
    answers: ["Das ist falsch", "Das stimmt nie", "Ich sehe den Punkt, wuerde aber ergaenzen", "Nein, Ende"],
    correct: 2
  },
  {
    prompt: "Which sentence has a nominalized verb?",
    answers: ["Das Lernen fallt mir leicht", "Ich lerne leicht", "Du lernst gern", "Wir haben gelernt"],
    correct: 0
  },
  {
    prompt: "Choose the most idiomatic completion: Das ist nicht mein ___.",
    answers: ["Bier", "Tee", "Wasser", "Saft"],
    correct: 1
  },
  {
    prompt: "Which phrase signals a precise concession?",
    answers: ["Zwar stimmt das, doch...", "Und dann...", "Also gut", "Irgendwie ja"],
    correct: 0
  },
  {
    prompt: "Best high-register equivalent of 'use' as a noun.",
    answers: ["Benutzung", "Ding", "Machen", "Nehmen"],
    correct: 0
  }
];

const state = {
  level: "A1",
  module: 0,
  task: 0,
  duration: 10,
  completed: new Set(),
  solved: new Set(),
  xp: 0,
  streak: 0
};

const activityTemplates = [
  {
    prompt: (task, level) => `${level} warm-up: which German phrase best fits "${task.title}"?`,
    options: (task) => [task.title, "Random sentence", "Only listening", "No practice"],
    correct: 0,
    feedback: "Nice. You picked the route focus for this room."
  },
  {
    prompt: (task) => `What should you do first in a ${task.mode.toLowerCase()}?`,
    options: () => ["Notice the pattern", "Skip the example", "Memorize blindly", "Avoid speaking"],
    correct: 0,
    feedback: "Exactly. Pattern first, speed later."
  },
  {
    prompt: (task) => `Which skill does this room train most directly?`,
    options: (task) => [task.skill, "Drawing", "Typing speed", "Maths"],
    correct: 0,
    feedback: "Correct. That is the skill badge for this task."
  }
];

const coordinates = [
  [9, 13],
  [30, 13],
  [30, 34],
  [52, 34],
  [52, 18],
  [74, 18],
  [74, 45],
  [60, 45],
  [60, 70],
  [84, 70]
];

const mobileCoordinates = [
  [18, 8],
  [72, 8],
  [72, 24],
  [30, 24],
  [30, 42],
  [78, 42],
  [78, 58],
  [24, 58],
  [24, 78],
  [76, 78]
];

function buildCurriculum() {
  return Object.fromEntries(levels.map((level) => {
    const modules = moduleThemes.map((theme, moduleIndex) => {
      const taskNames = taskPatterns[level.id];
      return {
        ...theme,
        number: moduleIndex + 1,
        title: `${theme.title}`,
        tasks: taskNames.map((name, taskIndex) => ({
          id: `${level.id}-${moduleIndex + 1}-${taskIndex + 1}`,
          number: taskIndex + 1,
          title: `${name}`,
          skill: skills[taskIndex],
          mode: taskIndex % 3 === 0 ? "Guided drill" : taskIndex % 3 === 1 ? "Quick challenge" : "Applied practice",
          description: makeDescription(level.id, moduleIndex, taskIndex, name)
        }))
      };
    });
    return [level.id, modules];
  }));
}

function makeDescription(levelId, moduleIndex, taskIndex, name) {
  const moduleFocus = moduleThemes[moduleIndex].focus.toLowerCase();
  const levelText = {
    A1: "Build a first usable pattern",
    A2: "Connect the pattern to everyday situations",
    B1: "Use the pattern in longer exchanges",
    B2: "Control the pattern in precise discussion",
    C1: "Refine tone, structure, and nuance",
    C3: "Shape the language with near-native intention"
  }[levelId];
  return `${levelText}: ${name.toLowerCase()} through ${moduleFocus}. Planned for a ${state.duration}-minute lesson.`;
}

const curriculum = buildCurriculum();

const els = {};

function init() {
  [
    "questions", "placement-form", "result-title", "result-copy", "score-bar",
    "current-level", "selected-module-label", "task-count", "level-tabs",
    "module-list", "maze-map", "maze-level-label", "maze-title", "maze-theme",
    "practice-title", "task-position", "task-time", "task-title",
    "task-description", "task-skill", "task-mode", "prev-task",
    "next-task", "complete-task", "progress-ring", "progress-value",
    "progress-copy", "streak-count", "xp-count", "journey-copy",
    "lesson-prompt", "lesson-options", "lesson-feedback", "lesson-reward",
    "theory-module-title", "theory-body", "unit-test-btn"
  ].forEach((id) => {
    els[toCamel(id)] = document.getElementById(id);
  });

  renderQuestions();
  renderLevelTabs();
  renderModules();
  renderMaze();
  renderTask();
  bindEvents();
  renderBooks();
  initUnitTest();
  initFrReveal();
  frInit();

  window.MazeApp = { getSnapshot, applySnapshot };
  window.dispatchEvent(new Event("maze-ready"));
}

// ─── ACCOUNT BRIDGE (used by auth.js) ─────────────────────────────
// Serialize the live state objects into a plain, JSON-safe snapshot.
function snapshotOne(s) {
  return {
    level: s.level,
    module: s.module,
    task: s.task,
    duration: s.duration,
    xp: s.xp,
    streak: s.streak,
    completed: [...s.completed],
    solved: [...s.solved]
  };
}

function getSnapshot() {
  return { de: snapshotOne(state), fr: snapshotOne(frState) };
}

function hydrateOne(target, data) {
  if (!data || typeof data !== "object") return;
  if (typeof data.level === "string") target.level = data.level;
  if (Number.isInteger(data.module)) target.module = data.module;
  if (Number.isInteger(data.task)) target.task = data.task;
  if (Number.isInteger(data.duration)) target.duration = data.duration;
  if (Number.isFinite(data.xp)) target.xp = data.xp;
  if (Number.isFinite(data.streak)) target.streak = data.streak;
  if (Array.isArray(data.completed)) target.completed = new Set(data.completed);
  if (Array.isArray(data.solved)) target.solved = new Set(data.solved);
}

// Replace live state with a snapshot, then re-render both sections.
function applySnapshot(snap) {
  if (!snap || typeof snap !== "object") return;
  hydrateOne(state, snap.de);
  hydrateOne(frState, snap.fr);

  renderLevelTabs();
  renderModules();
  renderMaze();
  renderTask();

  if (typeof frRenderLevelTabs === "function" && frEls.levelTabs) {
    frRenderLevelTabs();
    frRenderModules();
    frRenderMaze();
    frRenderTask();
  }
}

// Notify the account layer that saved data changed (no-op until auth.js loads).
function notifyProgressChange() {
  if (window.MazeAuth && typeof window.MazeAuth.persist === "function") {
    window.MazeAuth.persist();
  }
}

function toCamel(id) {
  return id.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

function renderQuestions() {
  els.questions.innerHTML = questions.map((question, questionIndex) => `
    <fieldset class="question">
      <p>${questionIndex + 1}. ${question.prompt}</p>
      <div class="answer-grid">
        ${question.answers.map((answer, answerIndex) => `
          <label>
            <input type="radio" name="q${questionIndex}" value="${answerIndex}" ${answerIndex === 0 ? "required" : ""}>
            <span>${answer}</span>
          </label>
        `).join("")}
      </div>
    </fieldset>
  `).join("");
}

function renderLevelTabs() {
  els.levelTabs.innerHTML = levels.map((level) => `
    <button class="level-tab ${level.id === state.level ? "active" : ""}" type="button" data-level="${level.id}">
      ${level.id}
    </button>
  `).join("");
}

function renderModules() {
  const modules = curriculum[state.level];
  els.moduleList.innerHTML = modules.map((module, index) => `
    <button class="module-card ${index === state.module ? "active" : ""}" type="button" data-module="${index}" style="--module-a: ${module.a}; --module-b: ${module.b};">
      <strong>Module ${module.number}: ${module.title}</strong>
      <span>${module.focus}</span>
    </button>
  `).join("");
}

function renderMaze() {
  const module = getCurrentModule();
  const coords = window.matchMedia("(max-width: 640px)").matches ? mobileCoordinates : coordinates;
  els.mazeMap.parentElement.style.setProperty("--module-a", module.a);
  els.mazeMap.parentElement.style.setProperty("--module-b", module.b);
  els.mazeLevelLabel.textContent = state.level;
  els.mazeTitle.textContent = `Module ${module.number}: ${module.title}`;
  els.mazeTheme.textContent = module.name;
  els.selectedModuleLabel.textContent = `Module ${module.number}`;
  els.taskCount.textContent = module.tasks.length;

  const polyline = coords.map(([x, y]) => `${x},${y}`).join(" ");
  els.mazeMap.innerHTML = `
    <svg class="maze-path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <polyline points="${polyline}" fill="none" stroke="rgba(51,43,37,0.28)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"></polyline>
      <polyline class="maze-glow" points="${polyline}" fill="none" stroke="url(#taskGradient)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></polyline>
      <defs>
        <linearGradient id="taskGradient" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="${module.a}"></stop>
          <stop offset="1" stop-color="${module.b}"></stop>
        </linearGradient>
      </defs>
    </svg>
    ${module.tasks.map((task, index) => `
      <button class="task-node ${index === state.task ? "active" : ""} ${state.completed.has(task.id) ? "complete" : ""}"
        type="button"
        style="--x: ${coords[index][0]}%; --y: ${coords[index][1]}%;"
        data-task="${index}"
        aria-label="Task ${task.number}: ${task.title}">
        ${task.number}
      </button>
    `).join("")}
  `;
}

function renderTask() {
  const module = getCurrentModule();
  const task = module.tasks[state.task];
  const completedInModule = module.tasks.filter((item) => state.completed.has(item.id)).length;
  const percent = Math.round((completedInModule / module.tasks.length) * 100);
  const reward = getReward();

  els.currentLevel.textContent = state.level;
  els.xpCount.textContent = state.xp;
  els.streakCount.textContent = state.streak;
  els.practiceTitle.textContent = `${state.level} - Module ${module.number}: ${module.title}`;
  els.taskPosition.textContent = `Task ${task.number} of ${module.tasks.length}`;
  els.taskTime.textContent = `${state.duration} min session`;
  els.taskTitle.textContent = task.title;
  els.taskDescription.textContent = makeDescription(state.level, state.module, state.task, task.title);
  els.taskSkill.textContent = task.skill;
  els.taskMode.textContent = task.mode;
  els.progressRing.style.setProperty("--progress", percent);
  els.progressValue.textContent = `${percent}%`;
  els.progressCopy.textContent = percent === 100 ? "Module complete. The next route is ready." : `${completedInModule} of ${module.tasks.length} tasks complete.`;
  els.journeyCopy.textContent = state.streak > 0 ? `${state.streak} correct warm-up${state.streak === 1 ? "" : "s"} in a row. Keep the route glowing.` : "Choose a pace, then open any room in the maze.";
  els.lessonReward.textContent = `+${reward} XP`;
  if (typeof deModuleTheory !== "undefined") {
    renderTheory(deModuleTheory, state.level, state.module, els.theoryModuleTitle, els.theoryBody);
  }
  if (els.unitTestBtn) els.unitTestBtn.hidden = percent !== 100;
  renderActivity(task);
  notifyProgressChange();
}

function bindEvents() {
  document.querySelectorAll(".duration-option").forEach((button) => {
    button.addEventListener("click", () => {
      state.duration = Number(button.dataset.duration);
      document.querySelectorAll(".duration-option").forEach((item) => {
        item.classList.toggle("active", item === button);
        item.setAttribute("aria-pressed", item === button ? "true" : "false");
      });
      renderTask();
    });
  });

  els.placementForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(els.placementForm);
    const score = questions.reduce((total, question, index) => {
      return total + (Number(data.get(`q${index}`)) === question.correct ? 1 : 0);
    }, 0);
    const recommended = [...levels].reverse().find((level) => score >= level.min) || levels[0];
    state.level = recommended.id;
    state.module = 0;
    state.task = 0;
    els.resultTitle.textContent = `${recommended.id} ${recommended.name}`;
    els.resultCopy.textContent = `${score} of ${questions.length} correct. Start in ${recommended.id}, then move through all five maze modules.`;
    els.scoreBar.style.width = `${Math.round((score / questions.length) * 100)}%`;
    renderLevelTabs();
    renderModules();
    renderMaze();
    renderTask();
    document.getElementById("curriculum").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  els.levelTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-level]");
    if (!button) return;
    state.level = button.dataset.level;
    state.module = 0;
    state.task = 0;
    renderLevelTabs();
    renderModules();
    renderMaze();
    renderTask();
  });

  els.moduleList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-module]");
    if (!button) return;
    state.module = Number(button.dataset.module);
    state.task = 0;
    renderModules();
    renderMaze();
    renderTask();
  });

  els.mazeMap.addEventListener("click", (event) => {
    const button = event.target.closest("[data-task]");
    if (!button) return;
    state.task = Number(button.dataset.task);
    renderMaze();
    renderTask();
    document.getElementById("practice").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  els.lessonOptions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-answer]");
    if (!button) return;
    checkActivityAnswer(Number(button.dataset.answer));
  });

  els.prevTask.addEventListener("click", () => {
    state.task = (state.task + getCurrentModule().tasks.length - 1) % getCurrentModule().tasks.length;
    renderMaze();
    renderTask();
  });

  els.nextTask.addEventListener("click", () => {
    state.task = (state.task + 1) % getCurrentModule().tasks.length;
    renderMaze();
    renderTask();
  });

  els.completeTask.addEventListener("click", () => {
    const task = getCurrentModule().tasks[state.task];
    state.completed.add(task.id);
    if (state.task < getCurrentModule().tasks.length - 1) {
      state.task += 1;
    }
    renderMaze();
    renderTask();
  });

  window.addEventListener("resize", debounce(renderMaze, 120));
}

function getCurrentModule() {
  return curriculum[state.level][state.module];
}

function getCurrentTask() {
  return getCurrentModule().tasks[state.task];
}

function getTaskQ(bank, levelId, taskIndex, moduleIndex) {
  const pool = bank && bank[levelId] && bank[levelId][taskIndex];
  if (pool && pool.length) return pool[moduleIndex % pool.length];
  return null;
}

function getActivity(task = getCurrentTask()) {
  const banked = (typeof deTaskQBank !== "undefined")
    ? getTaskQ(deTaskQBank, state.level, state.task, state.module)
    : null;
  if (banked) {
    return {
      prompt: () => banked.q,
      options: () => banked.opts,
      correct: banked.a,
      feedback: "Richtig! That is the correct answer."
    };
  }
  const fallback = activityTemplates[(task.number + state.module) % activityTemplates.length];
  return {
    prompt: () => fallback.prompt(task, state.level),
    options: () => fallback.options(task),
    correct: fallback.correct,
    feedback: fallback.feedback
  };
}

function getReward() {
  return Math.max(10, Math.round(state.duration * 1.5));
}

function renderTheory(theoryBank, level, moduleIndex, titleEl, bodyEl) {
  if (!titleEl || !bodyEl) return;
  const entry = theoryBank && theoryBank[level] && theoryBank[level][moduleIndex];
  if (!entry) { titleEl.textContent = "Module theory"; bodyEl.innerHTML = ""; return; }
  titleEl.textContent = entry.title;
  const rules = entry.rules.map((r) => `<li>${r}</li>`).join("");
  const examples = entry.examples.map((ex) => `<tr><td>${ex.src}</td><td>${ex.tr}</td></tr>`).join("");
  bodyEl.innerHTML = `
    <ul class="theory-rules">${rules}</ul>
    <table class="theory-examples">${examples}</table>
    <p class="theory-pattern"><strong>Key pattern:</strong> ${entry.keyPattern}</p>
  `;
}

function renderActivity(task) {
  const activity = getActivity(task);
  const solved = state.solved.has(task.id);
  els.lessonPrompt.textContent = activity.prompt(task, state.level);
  els.lessonOptions.innerHTML = activity.options(task).map((option, index) => `
    <button class="lesson-option ${solved && index === activity.correct ? "correct" : ""}" type="button" data-answer="${index}">
      ${option}
    </button>
  `).join("");
  els.lessonFeedback.className = `lesson-feedback ${solved ? "good" : ""}`;
  els.lessonFeedback.textContent = solved ? activity.feedback : "Select an answer to check your instinct.";
}

function checkActivityAnswer(answerIndex) {
  const task = getCurrentTask();
  const activity = getActivity(task);
  const buttons = [...els.lessonOptions.querySelectorAll(".lesson-option")];
  buttons.forEach((button, index) => {
    button.classList.toggle("correct", index === activity.correct);
    button.classList.toggle("wrong", index === answerIndex && index !== activity.correct);
  });

  if (answerIndex === activity.correct) {
    const isNewSolve = !state.solved.has(task.id);
    state.solved.add(task.id);
    state.streak += 1;
    if (isNewSolve) {
      state.xp += getReward();
    }
    els.lessonFeedback.className = "lesson-feedback good";
    els.lessonFeedback.textContent = activity.feedback;
    celebrate();
  } else {
    state.streak = 0;
    els.lessonFeedback.className = "lesson-feedback retry";
    els.lessonFeedback.textContent = "Close. Try the option that matches this room's focus.";
  }

  els.xpCount.textContent = state.xp;
  els.streakCount.textContent = state.streak;
  els.journeyCopy.textContent = state.streak > 0 ? `${state.streak} correct warm-up${state.streak === 1 ? "" : "s"} in a row. Keep the route glowing.` : "No problem. Reset the streak with the next correct answer.";
  notifyProgressChange();
}

function celebrate() {
  const panels = [document.querySelector(".task-panel"), document.querySelector(".progress-panel")];
  panels.forEach((panel) => {
    if (!panel) return;
    panel.classList.remove("celebrate");
    void panel.offsetWidth;
    panel.classList.add("celebrate");
  });
}

function debounce(fn, delay) {
  let timer;
  return () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(fn, delay);
  };
}

// ─── FRENCH APP ──────────────────────────────────────────────────
const frLevels = [
  { id: "A1", name: "Débutant",      min: 0  },
  { id: "A2", name: "Élémentaire",   min: 4  },
  { id: "B1", name: "Intermédiaire", min: 7  },
  { id: "B2", name: "Avancé",        min: 10 },
  { id: "C1", name: "Autonome",      min: 13 },
  { id: "C2", name: "Maîtrise",      min: 15 }
];

const frTaskPatterns = {
  A1: ["Greetings", "Alphabet & accents", "Numbers", "Nouns and articles", "Present tense", "Ordering food", "Family words", "Daily verbs", "Simple questions", "Mini dialogue"],
  A2: ["Passé composé", "Directions", "Shopping", "Reflexive verbs", "Modal expressions", "Appointments", "Weather", "Emails", "Travel phrases", "Story recap"],
  B1: ["Opinions", "Subordinate clauses", "Work topics", "Media listening", "Giving advice", "Future plans", "Reported speech", "Problem solving", "Short essay", "Interview"],
  B2: ["Debate language", "Passive voice", "Complex connectors", "News analysis", "Register", "Negotiation", "Abstract nouns", "Argument map", "Presentation", "Peer response"],
  C1: ["Nuance", "Academic reading", "Idioms", "Stylistic choice", "Precision grammar", "Long-form listening", "Critical summary", "Formal writing", "Spontaneous speaking", "Editing pass"],
  C2: ["Near-native tone", "Regional varieties", "Rhetorical control", "Literary texture", "Specialized vocabulary", "Humor and irony", "Dense lectures", "Policy argument", "Translation craft", "Masterclass task"]
};

const frQuestions = [
  { prompt: "Choose the best French greeting for a first meeting.", answers: ["Salut", "Bonjour", "À tout à l'heure", "Bonsoir"], correct: 1 },
  { prompt: "Which article fits: ___ table?", answers: ["le", "la", "les", "un"], correct: 1 },
  { prompt: "Translate: I would like a coffee.", answers: ["Je suis un café", "Je voudrais un café", "J'ai un café", "Je bois café"], correct: 1 },
  { prompt: "What is the correct verb form: Tu ___ en France.", answers: ["habite", "habites", "habitez", "habitons"], correct: 1 },
  { prompt: "Pick the passé composé of 'aller'.", answers: ["j'ai allé", "je suis allé", "j'allais", "j'aille"], correct: 1 },
  { prompt: "Which sentence uses a reflexive verb correctly?", answers: ["Je me lève tôt", "Je lève me tôt", "Moi lève tôt", "Je lève à tôt"], correct: 0 },
  { prompt: "Choose the connector that introduces a reason clause.", answers: ["mais", "et", "parce que", "ou"], correct: 2 },
  { prompt: "Best translation: Although it rained, we went out.", answers: ["Bien qu'il ait plu, nous sommes sortis", "Parce qu'il pleut, nous sortons", "Si il pleut, nous sortons", "Quand il pluie, on sort"], correct: 0 },
  { prompt: "Which phrase sounds more formal?", answers: ["Ça roule?", "Je vous prie de bien vouloir...", "T'as vu?", "C'est quoi ça?"], correct: 1 },
  { prompt: "Select the sentence with correct passive voice.", answers: ["Le texte est lu par tous", "Le texte lit par tous", "Le texte a lire", "Tous lisent le texte être"], correct: 0 },
  { prompt: "Which word best expresses 'nevertheless'?", answers: ["pourtant", "donc", "puis", "car"], correct: 0 },
  { prompt: "Pick the phrase that softens disagreement in discussion.", answers: ["C'est faux", "Je ne suis pas du tout d'accord", "Je comprends votre point, cependant...", "Non, jamais"], correct: 2 },
  { prompt: "Which sentence contains a nominalized verb?", answers: ["Le savoir est précieux", "Je sais tout", "Tu apprends vite", "Nous avons appris"], correct: 0 },
  { prompt: "Complete the idiom: Ça ne casse pas ___.", answers: ["trois pattes à un canard", "deux jambes à un chien", "quatre bras à un chat", "cinq têtes à un lion"], correct: 0 },
  { prompt: "Which phrase signals a precise concession in formal writing?", answers: ["Certes… néanmoins…", "Et puis…", "Bon, d'accord", "En fait, oui"], correct: 0 },
  { prompt: "Best high-register noun equivalent of 'use'.", answers: ["l'utilisation", "la chose", "le faire", "le truc"], correct: 0 }
];

const frState = {
  level: "A1",
  module: 0,
  task: 0,
  duration: 10,
  completed: new Set(),
  solved: new Set(),
  xp: 0,
  streak: 0
};

const frActivityTemplates = [
  {
    prompt: (task, level) => `${level} warm-up: which French phrase best fits "${task.title}"?`,
    options: (task) => [task.title, "Random sentence", "Only listening", "No practice"],
    correct: 0,
    feedback: "Bien ! You picked the focus for this room."
  },
  {
    prompt: (task) => `What should you do first in a ${task.mode.toLowerCase()}?`,
    options: () => ["Notice the pattern", "Skip the example", "Memorize blindly", "Avoid speaking"],
    correct: 0,
    feedback: "Exactement. Pattern first, speed later."
  },
  {
    prompt: (task) => `Which skill does this room train most directly?`,
    options: (task) => [task.skill, "Drawing", "Typing speed", "Maths"],
    correct: 0,
    feedback: "Correct. That is the skill badge for this task."
  }
];

function frMakeDescription(levelId, moduleIndex, taskIndex, name) {
  const moduleFocus = moduleThemes[moduleIndex].focus.toLowerCase();
  const levelText = {
    A1: "Build a first usable pattern",
    A2: "Connect the pattern to everyday situations",
    B1: "Use the pattern in longer exchanges",
    B2: "Control the pattern in precise discussion",
    C1: "Refine tone, structure, and nuance",
    C2: "Shape the language with near-native intention"
  }[levelId];
  return `${levelText}: ${name.toLowerCase()} through ${moduleFocus}. Planned for a ${frState.duration}-minute lesson.`;
}

function frBuildCurriculum() {
  return Object.fromEntries(frLevels.map((level) => {
    const modules = moduleThemes.map((theme, moduleIndex) => ({
      ...theme,
      number: moduleIndex + 1,
      tasks: frTaskPatterns[level.id].map((name, taskIndex) => ({
        id: `fr-${level.id}-${moduleIndex + 1}-${taskIndex + 1}`,
        number: taskIndex + 1,
        title: name,
        skill: skills[taskIndex],
        mode: taskIndex % 3 === 0 ? "Guided drill" : taskIndex % 3 === 1 ? "Quick challenge" : "Applied practice",
        description: frMakeDescription(level.id, moduleIndex, taskIndex, name)
      }))
    }));
    return [level.id, modules];
  }));
}

const frCurriculum = frBuildCurriculum();
const frEls = {};

function frGetCurrentModule() { return frCurriculum[frState.level][frState.module]; }
function frGetCurrentTask()   { return frGetCurrentModule().tasks[frState.task]; }
function frGetActivity(task)  {
  task = task || frGetCurrentTask();
  const banked = (typeof frTaskQBank !== "undefined")
    ? getTaskQ(frTaskQBank, frState.level, frState.task, frState.module)
    : null;
  if (banked) {
    return {
      prompt: () => banked.q,
      options: () => banked.opts,
      correct: banked.a,
      feedback: "Correct ! C'est la bonne reponse."
    };
  }
  const fallback = frActivityTemplates[(task.number + frState.module) % frActivityTemplates.length];
  return {
    prompt: () => fallback.prompt(task, frState.level),
    options: () => fallback.options(task),
    correct: fallback.correct,
    feedback: fallback.feedback
  };
}
function frGetReward() { return Math.max(10, Math.round(frState.duration * 1.5)); }

function frRenderQuestions() {
  if (!frEls.questions) return;
  frEls.questions.innerHTML = frQuestions.map((q, i) => `
    <fieldset class="question">
      <p>${i + 1}. ${q.prompt}</p>
      <div class="answer-grid">
        ${q.answers.map((a, j) => `
          <label>
            <input type="radio" name="frq${i}" value="${j}" ${j === 0 ? "required" : ""}>
            <span>${a}</span>
          </label>
        `).join("")}
      </div>
    </fieldset>
  `).join("");
}

function frRenderLevelTabs() {
  if (!frEls.levelTabs) return;
  frEls.levelTabs.innerHTML = frLevels.map((level) => `
    <button class="level-tab ${level.id === frState.level ? "active" : ""}" type="button" data-fr-level="${level.id}">${level.id}</button>
  `).join("");
}

function frRenderModules() {
  if (!frEls.moduleList) return;
  frEls.moduleList.innerHTML = frCurriculum[frState.level].map((module, index) => `
    <button class="module-card ${index === frState.module ? "active" : ""}" type="button"
      data-fr-module="${index}"
      style="--module-a: ${module.a}; --module-b: ${module.b};">
      <strong>Module ${module.number}: ${module.title}</strong>
      <span>${module.focus}</span>
    </button>
  `).join("");
}

function frRenderMaze() {
  if (!frEls.mazeMap) return;
  const module = frGetCurrentModule();
  const coords = window.matchMedia("(max-width: 640px)").matches ? mobileCoordinates : coordinates;
  frEls.mazeMap.closest(".maze-board").style.setProperty("--module-a", module.a);
  frEls.mazeMap.closest(".maze-board").style.setProperty("--module-b", module.b);
  frEls.mazeLevelLabel.textContent = frState.level;
  frEls.mazeTitle.textContent = `Module ${module.number}: ${module.title}`;
  frEls.mazeTheme.textContent = module.name;
  const polyline = coords.map(([x, y]) => `${x},${y}`).join(" ");
  frEls.mazeMap.innerHTML = `
    <svg class="maze-path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <polyline points="${polyline}" fill="none" stroke="rgba(51,43,37,0.28)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"></polyline>
      <polyline class="maze-glow" points="${polyline}" fill="none" stroke="url(#frGrad)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></polyline>
      <defs>
        <linearGradient id="frGrad" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="${module.a}"></stop>
          <stop offset="1" stop-color="${module.b}"></stop>
        </linearGradient>
      </defs>
    </svg>
    ${module.tasks.map((task, index) => `
      <button class="task-node ${index === frState.task ? "active" : ""} ${frState.completed.has(task.id) ? "complete" : ""}"
        type="button"
        style="--x: ${coords[index][0]}%; --y: ${coords[index][1]}%;"
        data-fr-task="${index}"
        aria-label="Task ${task.number}: ${task.title}">
        ${task.number}
      </button>
    `).join("")}
  `;
}

function frRenderTask() {
  if (!frEls.taskTitle) return;
  const module = frGetCurrentModule();
  const task = frGetCurrentTask();
  const done = module.tasks.filter((t) => frState.completed.has(t.id)).length;
  const pct = Math.round((done / module.tasks.length) * 100);
  frEls.practiceTitle.textContent = `${frState.level} — Module ${module.number}: ${module.title}`;
  frEls.taskPosition.textContent = `Task ${task.number} of ${module.tasks.length}`;
  frEls.taskTime.textContent = `${frState.duration} min session`;
  frEls.taskTitle.textContent = task.title;
  frEls.taskDescription.textContent = frMakeDescription(frState.level, frState.module, frState.task, task.title);
  frEls.taskSkill.textContent = task.skill;
  frEls.taskMode.textContent = task.mode;
  frEls.progressRing.style.setProperty("--progress", pct);
  frEls.progressValue.textContent = `${pct}%`;
  frEls.progressCopy.textContent = pct === 100
    ? "Module complete. The next route is ready."
    : `${done} of ${module.tasks.length} tasks complete.`;
  frEls.xpCount.textContent = frState.xp;
  frEls.streakCount.textContent = frState.streak;
  frEls.lessonReward.textContent = `+${frGetReward()} XP`;
  if (typeof frModuleTheory !== "undefined") {
    renderTheory(frModuleTheory, frState.level, frState.module, frEls.theoryModuleTitle, frEls.theoryBody);
  }
  const frBtn = document.getElementById("fr-unit-test-btn");
  if (frBtn) frBtn.hidden = pct !== 100;
  frRenderActivity(task);
  notifyProgressChange();
}

function frRenderActivity(task) {
  if (!frEls.lessonPrompt) return;
  const activity = frGetActivity(task);
  const solved = frState.solved.has(task.id);
  frEls.lessonPrompt.textContent = activity.prompt(task, frState.level);
  frEls.lessonOptions.innerHTML = activity.options(task).map((opt, i) => `
    <button class="lesson-option ${solved && i === activity.correct ? "correct" : ""}" type="button" data-fr-answer="${i}">${opt}</button>
  `).join("");
  frEls.lessonFeedback.className = `lesson-feedback ${solved ? "good" : ""}`;
  frEls.lessonFeedback.textContent = solved
    ? activity.feedback
    : "Select an answer to check your instinct.";
}

function frCheckAnswer(answerIndex) {
  const task = frGetCurrentTask();
  const activity = frGetActivity(task);
  [...frEls.lessonOptions.querySelectorAll(".lesson-option")].forEach((btn, i) => {
    btn.classList.toggle("correct", i === activity.correct);
    btn.classList.toggle("wrong", i === answerIndex && i !== activity.correct);
  });
  if (answerIndex === activity.correct) {
    const fresh = !frState.solved.has(task.id);
    frState.solved.add(task.id);
    frState.streak += 1;
    if (fresh) frState.xp += frGetReward();
    frEls.lessonFeedback.className = "lesson-feedback good";
    frEls.lessonFeedback.textContent = activity.feedback;
  } else {
    frState.streak = 0;
    frEls.lessonFeedback.className = "lesson-feedback retry";
    frEls.lessonFeedback.textContent = "Réessayez. Try the option that matches this room's focus.";
  }
  frEls.xpCount.textContent = frState.xp;
  frEls.streakCount.textContent = frState.streak;
  notifyProgressChange();
}

function frBindEvents() {
  if (frEls.placementForm) {
    frEls.placementForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(frEls.placementForm);
      const score = frQuestions.reduce((n, q, i) => n + (Number(data.get(`frq${i}`)) === q.correct ? 1 : 0), 0);
      const rec = [...frLevels].reverse().find((l) => score >= l.min) || frLevels[0];
      frState.level = rec.id;
      frState.module = 0;
      frState.task = 0;
      frEls.resultTitle.textContent = `${rec.id} — ${rec.name}`;
      frEls.resultCopy.textContent = `${score} of ${frQuestions.length} correct. Start at ${rec.id} and work through all five maze modules.`;
      frEls.scoreBar.style.width = `${Math.round((score / frQuestions.length) * 100)}%`;
      frRenderLevelTabs();
      frRenderModules();
      frRenderMaze();
      frRenderTask();
      document.getElementById("fr-curriculum").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  if (frEls.levelTabs) {
    frEls.levelTabs.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-fr-level]");
      if (!btn) return;
      frState.level = btn.dataset.frLevel;
      frState.module = 0;
      frState.task = 0;
      frRenderLevelTabs();
      frRenderModules();
      frRenderMaze();
      frRenderTask();
    });
  }

  if (frEls.moduleList) {
    frEls.moduleList.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-fr-module]");
      if (!btn) return;
      frState.module = Number(btn.dataset.frModule);
      frState.task = 0;
      frRenderModules();
      frRenderMaze();
      frRenderTask();
    });
  }

  if (frEls.mazeMap) {
    frEls.mazeMap.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-fr-task]");
      if (!btn) return;
      frState.task = Number(btn.dataset.frTask);
      frRenderMaze();
      frRenderTask();
      document.getElementById("fr-practice").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  if (frEls.lessonOptions) {
    frEls.lessonOptions.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-fr-answer]");
      if (!btn) return;
      frCheckAnswer(Number(btn.dataset.frAnswer));
    });
  }

  if (frEls.prevTask) {
    frEls.prevTask.addEventListener("click", () => {
      frState.task = (frState.task + frGetCurrentModule().tasks.length - 1) % frGetCurrentModule().tasks.length;
      frRenderMaze();
      frRenderTask();
    });
  }

  if (frEls.nextTask) {
    frEls.nextTask.addEventListener("click", () => {
      frState.task = (frState.task + 1) % frGetCurrentModule().tasks.length;
      frRenderMaze();
      frRenderTask();
    });
  }

  if (frEls.completeTask) {
    frEls.completeTask.addEventListener("click", () => {
      const task = frGetCurrentModule().tasks[frState.task];
      frState.completed.add(task.id);
      if (frState.task < frGetCurrentModule().tasks.length - 1) frState.task += 1;
      frRenderMaze();
      frRenderTask();
    });
  }
}

function frInit() {
  if (!document.getElementById("fr-questions")) return;
  [
    "fr-placement-form", "fr-result-title", "fr-result-copy", "fr-score-bar",
    "fr-level-tabs", "fr-module-list", "fr-maze-map", "fr-maze-level-label",
    "fr-maze-title", "fr-maze-theme", "fr-practice-title", "fr-task-position",
    "fr-task-time", "fr-task-title", "fr-task-description", "fr-task-skill",
    "fr-task-mode", "fr-prev-task", "fr-next-task", "fr-complete-task",
    "fr-progress-ring", "fr-progress-value", "fr-progress-copy",
    "fr-streak-count", "fr-xp-count", "fr-lesson-prompt", "fr-lesson-options",
    "fr-lesson-feedback", "fr-lesson-reward", "fr-questions",
    "fr-theory-module-title", "fr-theory-body"
  ].forEach((id) => { frEls[toCamel(id.slice(3))] = document.getElementById(id); });

  frRenderQuestions();
  frRenderLevelTabs();
  frRenderModules();
  frRenderMaze();
  frRenderTask();
  frBindEvents();
}

// ─── BOOKS ───────────────────────────────────────────────────────
function renderBookGrid(gridId, books) {
  const grid = document.getElementById(gridId);
  if (!grid || typeof books === "undefined") return;
  const byLevel = {};
  books.forEach((b) => { (byLevel[b.level] = byLevel[b.level] || []).push(b); });
  grid.innerHTML = Object.keys(byLevel).map((level) => `
    <div class="book-level-group">
      <h3 class="book-level-heading">${level}</h3>
      <div class="book-cards-row">
        ${byLevel[level].map((b) => `
          <article class="book-card">
            <span class="book-type-badge">${b.type}</span>
            <p class="book-title">${b.title}</p>
            <p class="book-author">${b.author}</p>
            <p class="book-desc">${b.desc}</p>
          </article>
        `).join("")}
      </div>
    </div>
  `).join("");
}

function renderBooks() {
  if (typeof deBooks !== "undefined") renderBookGrid("de-books-grid", deBooks);
  if (typeof frBooks !== "undefined") renderBookGrid("fr-books-grid", frBooks);
}

// ─── UNIT TEST MODAL ──────────────────────────────────────────────
const unitTest = { lang: "de", level: "A1", module: 0, questions: [] };

function getUnitTestQuestions(lang, level, moduleIndex) {
  const bank = lang === "fr"
    ? (typeof frUnitTests !== "undefined" ? frUnitTests : null)
    : (typeof deUnitTests !== "undefined" ? deUnitTests : null);
  return (bank && bank[level] && bank[level][moduleIndex]) || [];
}

function openUnitTest(lang) {
  const modal = document.getElementById("unit-test-modal");
  if (!modal) return;
  const isFr = lang === "fr";
  unitTest.lang = lang;
  unitTest.level = isFr ? frState.level : state.level;
  unitTest.module = isFr ? frState.module : state.module;
  unitTest.questions = getUnitTestQuestions(lang, unitTest.level, unitTest.module);

  const heading = document.getElementById("unit-modal-heading");
  const moduleNum = unitTest.module + 1;
  heading.textContent = `${isFr ? "Test" : "Unit Test"} — ${unitTest.level} · Module ${moduleNum}`;

  const container = document.getElementById("unit-modal-questions");
  container.innerHTML = unitTest.questions.map((q, i) => `
    <fieldset class="question">
      <p>${i + 1}. ${q.q}</p>
      <div class="answer-grid">
        ${q.opts.map((opt, j) => `
          <label>
            <input type="radio" name="ut${i}" value="${j}">
            <span>${opt}</span>
          </label>
        `).join("")}
      </div>
    </fieldset>
  `).join("");

  document.getElementById("unit-modal-result").hidden = true;
  document.getElementById("unit-modal-actions").hidden = false;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeUnitTest() {
  const modal = document.getElementById("unit-test-modal");
  if (modal) modal.hidden = true;
  document.body.style.overflow = "";
}

function submitUnitTest() {
  const container = document.getElementById("unit-modal-questions");
  let score = 0;
  unitTest.questions.forEach((q, i) => {
    const checked = container.querySelector(`input[name="ut${i}"]:checked`);
    const correct = checked && Number(checked.value) === q.a;
    if (correct) score += 1;
    const fieldset = container.querySelectorAll("fieldset")[i];
    if (fieldset) {
      const labels = fieldset.querySelectorAll("label");
      labels.forEach((label, j) => {
        label.classList.remove("correct", "wrong");
        if (j === q.a) label.classList.add("correct");
        else if (checked && Number(checked.value) === j) label.classList.add("wrong");
      });
    }
  });

  const total = unitTest.questions.length;
  const passed = score >= 7;
  document.getElementById("unit-modal-score").textContent = `${score} / ${total}`;
  const verdict = document.getElementById("unit-modal-verdict");
  if (passed) {
    verdict.textContent = unitTest.lang === "fr"
      ? "Reussi ! +100 XP gagnes."
      : "Passed! +100 XP earned.";
    if (unitTest.lang === "fr") { frState.xp += 100; if (frEls.xpCount) frEls.xpCount.textContent = frState.xp; }
    else { state.xp += 100; if (els.xpCount) els.xpCount.textContent = state.xp; }
  } else {
    verdict.textContent = unitTest.lang === "fr"
      ? `Il faut 7/10 pour reussir. Reessayez !`
      : `You need 7/10 to pass. Try again!`;
  }

  document.getElementById("unit-modal-actions").hidden = true;
  document.getElementById("unit-modal-result").hidden = false;
  if (passed) notifyProgressChange();
}

function initUnitTest() {
  const modal = document.getElementById("unit-test-modal");
  if (!modal) return;

  if (els.unitTestBtn) els.unitTestBtn.addEventListener("click", () => openUnitTest("de"));
  const frBtn = document.getElementById("fr-unit-test-btn");
  if (frBtn) frBtn.addEventListener("click", () => openUnitTest("fr"));

  document.getElementById("unit-modal-close").addEventListener("click", closeUnitTest);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeUnitTest(); });
  document.getElementById("unit-modal-submit").addEventListener("click", submitUnitTest);
  document.getElementById("unit-modal-retry").addEventListener("click", () => openUnitTest(unitTest.lang));
  document.getElementById("unit-modal-next").addEventListener("click", () => {
    if (unitTest.lang === "fr") {
      frState.module = (frState.module + 1) % frCurriculum[frState.level].length;
      frState.task = 0;
      frRenderModules(); frRenderMaze(); frRenderTask();
    } else {
      state.module = (state.module + 1) % curriculum[state.level].length;
      state.task = 0;
      renderModules(); renderMaze(); renderTask();
    }
    closeUnitTest();
  });
}

function initFrReveal() {
  const revealEls = document.querySelectorAll('.fr-reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fr-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );
  revealEls.forEach((el) => observer.observe(el));
}

init();
