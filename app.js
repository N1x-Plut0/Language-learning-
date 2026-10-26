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
  { name: "Fog + Beige", a: "#cacaca", b: "#ae9b8a", title: "Fluent Exit", focus: "Speaking, writing, and review" },
  { name: "Sage + Fog", a: "#9a9d81", b: "#cacaca", title: "Summit Route", focus: "Real-life tasks and level check" }
];

// Each CEFR level is split into two sub-levels: lessons 1-3 are X.1, lessons 4-6 are X.2.
function subLevelOf(levelId, moduleIndex) {
  return `${levelId}.${moduleIndex < Math.ceil(moduleThemes.length / 2) ? 1 : 2}`;
}

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
    answers: ["Tschüss", "Guten Tag", "Bitte sehr", "Vielleicht"],
    correct: 1
  },
  {
    prompt: "Which article fits: ___ Tisch?",
    answers: ["der", "die", "das", "den"],
    correct: 0
  },
  {
    prompt: "Translate: I would like a coffee.",
    answers: ["Ich habe Kaffee", "Ich möchte einen Kaffee", "Ich bin Kaffee", "Ich gehe Kaffee"],
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
    answers: ["Was geht?", "Ich hätte gern Ihre Meinung dazu", "Na, alles klar?", "Komm mal her"],
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
    answers: ["Das ist falsch", "Das stimmt nie", "Ich sehe den Punkt, würde aber ergänzen", "Nein, Ende"],
    correct: 2
  },
  {
    prompt: "Which sentence has a nominalized verb?",
    answers: ["Das Lernen fällt mir leicht", "Ich lerne leicht", "Du lernst gern", "Wir haben gelernt"],
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

  if (els.questions) {
    renderQuestions();
    renderLevelTabs();
    renderModules();
    renderMaze();
    renderTask();
    bindEvents();
  }
  renderBooks();
  initUnitTest();
  initFrReveal();
  frInit();
  initLessonPlans();
  renderLanding();
  initNavSpy();
  initPracticeKeys();

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

  if (els.levelTabs) {
    renderLevelTabs();
    renderModules();
    renderMaze();
    renderTask();
  }

  if (frEls.levelTabs) {
    frRenderLevelTabs();
    frRenderModules();
    frRenderMaze();
    frRenderTask();
  }
  renderLanding();
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
      <span>${subLevelOf(state.level, index)} · ${module.focus}</span>
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
  els.progressCopy.textContent = percent === 100 ? "All rooms done: take the unit test to finish the lesson." : `${completedInModule} of ${module.tasks.length} rooms done. The unit test unlocks at 10.`;
  els.journeyCopy.textContent = state.streak > 0 ? `${state.streak} correct warm-up${state.streak === 1 ? "" : "s"} in a row. Keep the route glowing.` : "Choose a pace, then open any room in the maze.";
  els.lessonReward.textContent = `+${reward} XP`;
  if (typeof deModuleTheory !== "undefined") {
    renderTheory(deModuleTheory, state.level, state.module, els.theoryModuleTitle, els.theoryBody);
  }
  if (els.unitTestBtn) els.unitTestBtn.hidden = percent !== 100;
  if (els.completeTask) els.completeTask.textContent = roomButtonLabel(state, module);
  renderActivity(task);
  renderLessonPlan("de");
  renderNextLesson("de");
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
    els.resultCopy.textContent = `${score} of ${questions.length} correct. Start in ${recommended.id}, then work through its six lessons.`;
    els.scoreBar.style.width = `${Math.round((score / questions.length) * 100)}%`;
    renderLevelTabs();
    renderModules();
    renderMaze();
    renderTask();
    document.getElementById("start").scrollIntoView({ behavior: "smooth", block: "start" });
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
    const outcome = advanceRoom(state, getCurrentModule(), "de");
    if (outcome === "unanswered") {
      els.lessonFeedback.className = "lesson-feedback retry";
      els.lessonFeedback.textContent = "Answer the question above first: the room counts as done once you get it right.";
      return;
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

// Option order: the banks list the correct answer in predictable places, so
// options are shuffled. A seed keeps the order stable for a given room.
function shuffledOrder(count, seed) {
  let h = 2166136261;
  for (const ch of String(seed)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const order = [...Array(count).keys()];
  for (let i = count - 1; i > 0; i -= 1) {
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
    const j = h % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

function bankedActivity(banked, seed, goodText) {
  const order = shuffledOrder(banked.opts.length, seed);
  return {
    prompt: () => banked.q,
    options: () => order.map((i) => banked.opts[i]),
    correct: order.indexOf(banked.a),
    feedback: banked.ex ? `${goodText} ${banked.ex}` : goodText,
    ex: banked.ex || ""
  };
}

// Room flow: a room counts as done once its question is answered correctly
// (or the answer was revealed). The main button then moves on, and on the
// last room of a finished module it opens the unit test.
function roomButtonLabel(st, module) {
  const task = module.tasks[st.task];
  const done = st.completed.has(task.id);
  const allDone = module.tasks.every((t) => st.completed.has(t.id));
  if (!done) return "Complete room";
  if (allDone) return "Take the unit test →";
  return "Next room →";
}

function advanceRoom(st, module, lang) {
  const task = module.tasks[st.task];
  if (!st.completed.has(task.id)) return "unanswered";
  if (module.tasks.every((t) => st.completed.has(t.id))) { openUnitTest(lang); return "test"; }
  const nextOpen = module.tasks.findIndex((t, i) => i > st.task && !st.completed.has(t.id));
  const firstOpen = module.tasks.findIndex((t) => !st.completed.has(t.id));
  st.task = nextOpen !== -1 ? nextOpen : firstOpen;
  return "moved";
}

// Wrong answers: the first miss only marks the chosen option; the second
// reveals the answer and its explanation (no XP for a revealed answer).
const answerAttempts = new Map();
const revealedAnswers = new Set();

function applyAnswer({ taskId, activity, answerIndex, optionsEl, feedbackEl, solvedSet, retryText, revealText }) {
  const buttons = [...optionsEl.querySelectorAll(".lesson-option")];
  if (answerIndex === activity.correct) {
    buttons.forEach((b, i) => b.classList.toggle("correct", i === activity.correct));
    const earned = !solvedSet.has(taskId) && !revealedAnswers.has(taskId);
    solvedSet.add(taskId);
    answerAttempts.delete(taskId);
    feedbackEl.className = "lesson-feedback good";
    feedbackEl.textContent = activity.feedback;
    return { correct: true, earned };
  }
  const attempts = (answerAttempts.get(taskId) || 0) + 1;
  answerAttempts.set(taskId, attempts);
  const button = buttons[answerIndex];
  if (button) { button.classList.add("wrong"); button.disabled = true; }
  feedbackEl.className = "lesson-feedback retry";
  if (attempts >= 2) {
    revealedAnswers.add(taskId);
    buttons.forEach((b, i) => b.classList.toggle("correct", i === activity.correct));
    feedbackEl.textContent = `${revealText} ${activity.options()[activity.correct]}.${activity.ex ? ` ${activity.ex}` : ""}`;
  } else {
    feedbackEl.textContent = retryText;
  }
  return { correct: false, earned: false };
}

function getActivity(task = getCurrentTask()) {
  const banked = (typeof deTaskQBank !== "undefined")
    ? getTaskQ(deTaskQBank, state.level, state.task, state.module)
    : null;
  if (banked) return bankedActivity(banked, task.id, "Richtig!");
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
  const result = applyAnswer({
    taskId: task.id, activity, answerIndex,
    optionsEl: els.lessonOptions, feedbackEl: els.lessonFeedback, solvedSet: state.solved,
    retryText: "Not quite. Have another look and try again.",
    revealText: "The answer is:"
  });
  if (result.correct) {
    state.streak += 1;
    if (result.earned) state.xp += getReward();
    state.completed.add(task.id);
    renderMaze();
    renderTask();
    celebrate();
  } else {
    state.streak = 0;
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
  if (banked) return bankedActivity(banked, task.id, "Correct !");
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
      <span>${subLevelOf(frState.level, index)} · ${module.focus}</span>
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
    ? "All rooms done: take the unit test to finish the lesson."
    : `${done} of ${module.tasks.length} rooms done. The unit test unlocks at 10.`;
  frEls.xpCount.textContent = frState.xp;
  frEls.streakCount.textContent = frState.streak;
  frEls.lessonReward.textContent = `+${frGetReward()} XP`;
  if (frEls.currentLevel) frEls.currentLevel.textContent = frState.level;
  if (frEls.selectedModuleLabel) frEls.selectedModuleLabel.textContent = `Module ${module.number}`;
  if (typeof frModuleTheory !== "undefined") {
    renderTheory(frModuleTheory, frState.level, frState.module, frEls.theoryModuleTitle, frEls.theoryBody);
  }
  const frBtn = document.getElementById("fr-unit-test-btn");
  if (frBtn) frBtn.hidden = pct !== 100;
  if (frEls.completeTask) frEls.completeTask.textContent = roomButtonLabel(frState, module);
  frRenderActivity(task);
  renderLessonPlan("fr");
  renderNextLesson("fr");
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
  const result = applyAnswer({
    taskId: task.id, activity, answerIndex,
    optionsEl: frEls.lessonOptions, feedbackEl: frEls.lessonFeedback, solvedSet: frState.solved,
    retryText: "Pas tout à fait. Have another look and try again.",
    revealText: "La bonne réponse :"
  });
  if (result.correct) {
    frState.streak += 1;
    if (result.earned) frState.xp += frGetReward();
    frState.completed.add(task.id);
    frRenderMaze();
    frRenderTask();
  } else {
    frState.streak = 0;
  }
  frEls.xpCount.textContent = frState.xp;
  frEls.streakCount.textContent = frState.streak;
  notifyProgressChange();
}

function frBindEvents() {
  document.querySelectorAll("[data-fr-duration]").forEach((button) => {
    button.addEventListener("click", () => {
      frState.duration = Number(button.dataset.frDuration);
      document.querySelectorAll("[data-fr-duration]").forEach((item) => {
        item.classList.toggle("active", item === button);
        item.setAttribute("aria-pressed", item === button ? "true" : "false");
      });
      frRenderTask();
    });
  });

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
      frEls.resultCopy.textContent = `${score} of ${frQuestions.length} correct. Start at ${rec.id} and work through its six lessons.`;
      frEls.scoreBar.style.width = `${Math.round((score / frQuestions.length) * 100)}%`;
      frRenderLevelTabs();
      frRenderModules();
      frRenderMaze();
      frRenderTask();
      document.getElementById("fr-start").scrollIntoView({ behavior: "smooth", block: "start" });
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
      const outcome = advanceRoom(frState, frGetCurrentModule(), "fr");
      if (outcome === "unanswered") {
        frEls.lessonFeedback.className = "lesson-feedback retry";
        frEls.lessonFeedback.textContent = "Répondez d'abord : the room counts as done once you get the question right.";
        return;
      }
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
    "fr-theory-module-title", "fr-theory-body", "fr-current-level", "fr-selected-module-label"
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

// ─── LESSON PLANS ────────────────────────────────────────────────
// One lesson per maze module. Grammar, rooms and books come from the course
// data; goals, vocabulary and activities come from de-plan.js / fr-plan.js.
const planView = { de: { level: null, open: new Set() }, fr: { level: null, open: new Set() } };

function planSource(lang) {
  return lang === "fr"
    ? { plan: typeof frLessonPlan !== "undefined" ? frLessonPlan : null, levels: frLevels, curriculum: frCurriculum,
        st: frState, theory: typeof frModuleTheory !== "undefined" ? frModuleTheory : {}, books: typeof frBooks !== "undefined" ? frBooks : [] }
    : { plan: typeof deLessonPlan !== "undefined" ? deLessonPlan : null, levels, curriculum,
        st: state, theory: typeof deModuleTheory !== "undefined" ? deModuleTheory : {}, books: typeof deBooks !== "undefined" ? deBooks : [] };
}

function renderLessonPlan(lang) {
  const tabs = document.getElementById(`${lang}-plan-tabs`);
  const list = document.getElementById(`${lang}-plan-list`);
  const src = planSource(lang);
  if (!tabs || !list || !src.plan) return;
  const view = planView[lang];
  const level = view.level || src.st.level;

  tabs.innerHTML = src.levels.map((l) => `
    <button class="level-tab ${l.id === level ? "active" : ""}" type="button" data-plan-level="${l.id}">${l.id}</button>
  `).join("");

  const levelInfo = src.levels.find((l) => l.id === level);
  const book = src.books.find((b) => b.level === level);
  list.innerHTML = (src.plan[level] || []).map((lesson, index) => {
    const module = src.curriculum[level][index];
    const sub = subLevelOf(level, index);
    const groupHead = index === 0 || subLevelOf(level, index - 1) !== sub ? (() => {
      const mods = src.curriculum[level].filter((_, i) => subLevelOf(level, i) === sub);
      const first = src.curriculum[level].indexOf(mods[0]);
      const rooms = mods.flatMap((m) => m.tasks);
      const doneRooms = rooms.filter((t) => src.st.completed.has(t.id)).length;
      return `<h3 class="book-level-heading plan-sublevel">${sub} · Lessons ${first + 1}–${first + mods.length} · ${doneRooms}/${rooms.length} rooms</h3>`;
    })() : "";
    const theory = (src.theory[level] || [])[index] || { title: module.title, rules: [], examples: [], keyPattern: "" };
    const done = module.tasks.filter((t) => src.st.completed.has(t.id)).length;
    const pct = Math.round((done / module.tasks.length) * 100);
    const current = src.st.level === level && src.st.module === index;
    return `${groupHead}
      <details class="plan-card ${current ? "current" : ""}" data-plan-index="${index}" ${view.open.has(`${level}-${index}`) ? "open" : ""}
        style="--module-a: ${module.a}; --module-b: ${module.b};">
        <summary class="plan-summary">
          <span class="plan-num">${sub} · Lesson ${index + 1}</span>
          <span class="plan-title">${theory.title}</span>
          <span class="plan-meta">${module.title} · ${lesson.minutes} min</span>
          <span class="plan-progress" aria-label="${done} of ${module.tasks.length} rooms complete">
            <span class="plan-progress-bar"><span style="width:${pct}%"></span></span>${pct}%
          </span>
        </summary>
        <div class="plan-body">
          <div class="plan-block">
            <h4>Goals</h4>
            <ul>${lesson.goals.map((g) => `<li>${g}</li>`).join("")}</ul>
          </div>
          <div class="plan-block">
            <h4>1 · Warm-up</h4>
            <p>${lesson.warmup}</p>
          </div>
          <div class="plan-block plan-wide">
            <h4>2 · Grammar focus</h4>
            <ul>${theory.rules.map((r) => `<li>${r}</li>`).join("")}</ul>
            ${theory.keyPattern ? `<p class="plan-pattern"><strong>Key pattern:</strong> ${theory.keyPattern}</p>` : ""}
            ${theory.examples.length ? `<table class="theory-examples">${theory.examples.map((ex) => `<tr><td>${ex.src}</td><td>${ex.tr}</td></tr>`).join("")}</table>` : ""}
          </div>
          <div class="plan-block">
            <h4>3 · Vocabulary</h4>
            <dl class="plan-vocab">${lesson.vocab.map(([w, m]) => `<dt>${w}</dt><dd>${m}</dd>`).join("")}</dl>
          </div>
          <div class="plan-block">
            <h4>4 · Maze rooms (${done}/${module.tasks.length})</h4>
            <ol class="plan-rooms">${module.tasks.map((t) => `
              <li class="${src.st.completed.has(t.id) ? "done" : ""}"><span>${t.title}</span><em>${t.skill}</em></li>`).join("")}
            </ol>
          </div>
          <div class="plan-block">
            <h4>5 · Speaking</h4>
            <p>${lesson.speaking}</p>
          </div>
          <div class="plan-block">
            <h4>6 · Writing</h4>
            <p>${lesson.writing}</p>
          </div>
          <div class="plan-block">
            <h4>7 · Check</h4>
            <p>Unit test: 10 questions on this module. It unlocks when all 10 rooms are complete.</p>
            ${book ? `<p><strong>Reading:</strong> ${book.title} (${book.author})</p>` : ""}
          </div>
          <div class="plan-block">
            <h4>Homework</h4>
            <p>${lesson.homework}</p>
          </div>
          <div class="plan-actions">
            <button class="primary-btn" type="button" data-plan-start="${index}">${done === module.tasks.length ? "Review lesson" : done ? "Continue lesson" : "Start lesson"} →</button>
            <button class="secondary-btn" type="button" data-plan-open="${index}">Show in maze</button>
            <span class="plan-level-name">${levelInfo ? `${levelInfo.id} ${levelInfo.name}` : level} · ${module.focus}</span>
          </div>
        </div>
      </details>
    `;
  }).join("");
}

function openPlanModule(lang, level, index) {
  if (lang === "fr") {
    frState.level = level;
    frState.module = index;
    frState.task = 0;
    frRenderLevelTabs(); frRenderModules(); frRenderMaze(); frRenderTask();
  } else {
    state.level = level;
    state.module = index;
    state.task = 0;
    renderLevelTabs(); renderModules(); renderMaze(); renderTask();
  }
  const target = document.getElementById(lang === "fr" ? "fr-curriculum" : "curriculum");
  if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
}

// The lesson to work on next: the first unfinished module at the learner's
// level, else the first module of the next level.
function findNextLesson(lang) {
  const src = planSource(lang);
  const ids = src.levels.map((l) => l.id);
  for (let li = Math.max(0, ids.indexOf(src.st.level)); li < ids.length; li += 1) {
    const modules = src.curriculum[ids[li]];
    const index = modules.findIndex((m) => m.tasks.some((t) => !src.st.completed.has(t.id)));
    if (index !== -1) return { level: ids[li], index };
  }
  return null;
}

function lessonSummary(lang, level, index) {
  const src = planSource(lang);
  const module = src.curriculum[level][index];
  const theory = (src.theory[level] || [])[index];
  const lesson = src.plan && src.plan[level] ? src.plan[level][index] : null;
  const done = module.tasks.filter((t) => src.st.completed.has(t.id)).length;
  return {
    module, lesson, done,
    total: module.tasks.length,
    pct: Math.round((done / module.tasks.length) * 100),
    title: theory ? theory.title : module.title,
    levelInfo: src.levels.find((l) => l.id === level)
  };
}

function startLesson(lang, level, index) {
  const st = planSource(lang).st;
  const module = planSource(lang).curriculum[level][index];
  const firstOpen = module.tasks.findIndex((t) => !st.completed.has(t.id));
  st.level = level;
  st.module = index;
  st.task = firstOpen === -1 ? 0 : firstOpen;
  if (lang === "fr") { frRenderLevelTabs(); frRenderModules(); frRenderMaze(); frRenderTask(); }
  else { renderLevelTabs(); renderModules(); renderMaze(); renderTask(); }
  const theoryCard = document.getElementById(lang === "fr" ? "fr-theory-card" : "theory-card");
  if (theoryCard && firstOpen <= 0) theoryCard.open = true;
  const target = document.getElementById(lang === "fr" ? "fr-practice" : "practice");
  if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderNextLesson(lang) {
  const box = document.getElementById(`${lang}-next`);
  const practiceLine = document.getElementById(`${lang}-practice-lesson`);
  const src = planSource(lang);
  if (practiceLine) {
    const cur = lessonSummary(lang, src.st.level, src.st.module);
    practiceLine.innerHTML = `${subLevelOf(src.st.level, src.st.module)} · Lesson ${src.st.module + 1} of ${src.curriculum[src.st.level].length}: <strong>${cur.title}</strong> · ${cur.done}/${cur.total} rooms · <a href="#${lang}-plan">see lesson plan</a>`;
  }
  if (!box) return;
  const next = findNextLesson(lang);
  const placementId = lang === "fr" ? "fr-placement" : "placement";
  if (!next) {
    box.innerHTML = `<div class="next-card"><h3>Course complete!</h3><p>You have finished every room. Review any lesson in the plan below.</p></div>`;
    return;
  }
  const info = lessonSummary(lang, next.level, next.index);
  const fresh = src.st.completed.size === 0;
  box.innerHTML = `
    <article class="next-card" style="--module-a: ${info.module.a};">
      <div class="next-main">
        <p class="next-kicker">${subLevelOf(next.level, next.index)} ${info.levelInfo ? info.levelInfo.name : ""} · Lesson ${next.index + 1} of ${src.curriculum[next.level].length}${info.lesson ? ` · ${info.lesson.minutes} min` : ""}</p>
        <h3>${info.title}</h3>
        ${info.lesson ? `<ul class="next-goals">${info.lesson.goals.map((g) => `<li>${g}</li>`).join("")}</ul>` : ""}
        <div class="next-actions">
          <button class="primary-btn" type="button" data-next-start>${info.done ? "Continue lesson" : "Start lesson"} →</button>
          <a class="secondary-btn" href="#${lang}-plan" data-next-plan>Read the lesson plan</a>
        </div>
        ${fresh ? `<p class="next-hint">Not a beginner? <a href="#${placementId}">Take the placement check</a> to start at your level.</p>` : ""}
      </div>
      <div class="next-side">
        <div class="ring next-ring" style="--progress: ${info.pct};"><span>${info.pct}%</span></div>
        <p>${info.done} of ${info.total} rooms done</p>
      </div>
    </article>
  `;
  box.querySelector("[data-next-start]").addEventListener("click", () => startLesson(lang, next.level, next.index));
  box.querySelector("[data-next-plan]").addEventListener("click", () => {
    planView[lang].level = next.level;
    planView[lang].open.add(`${next.level}-${next.index}`);
    renderLessonPlan(lang);
  });
}

// Home page: show where each course stands on the language cards.
function renderLanding() {
  ["de", "fr"].forEach((lang) => {
    const el = document.getElementById(`${lang}-card-progress`);
    if (!el) return;
    const st = planSource(lang).st;
    const next = findNextLesson(lang);
    if (!next) { el.textContent = "Course complete"; return; }
    const info = lessonSummary(lang, next.level, next.index);
    el.textContent = st.completed.size
      ? `Next: ${subLevelOf(next.level, next.index)} · Lesson ${next.index + 1} · ${info.title} (${info.pct}%)`
      : `Start with ${subLevelOf(next.level, next.index)} · Lesson ${next.index + 1} · ${info.title}`;
  });
}

function printLessonPlan(lang) {
  const list = document.getElementById(`${lang}-plan-list`);
  if (!list) return;
  const wasOpen = [...list.querySelectorAll("details")].map((d) => d.open);
  list.querySelectorAll("details").forEach((d) => { d.open = true; });
  document.body.dataset.printPlan = lang;
  window.addEventListener("afterprint", () => {
    delete document.body.dataset.printPlan;
    list.querySelectorAll("details").forEach((d, i) => { d.open = wasOpen[i]; });
  }, { once: true });
  window.print();
}

function initLessonPlans() {
  ["de", "fr"].forEach((lang) => {
    const tabs = document.getElementById(`${lang}-plan-tabs`);
    const list = document.getElementById(`${lang}-plan-list`);
    if (!tabs || !list) return;
    const view = planView[lang];
    tabs.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-plan-level]");
      if (!btn) return;
      view.level = btn.dataset.planLevel;
      renderLessonPlan(lang);
    });
    list.addEventListener("toggle", (e) => {
      const card = e.target.closest(".plan-card");
      if (!card) return;
      const key = `${view.level || planSource(lang).st.level}-${card.dataset.planIndex}`;
      if (card.open) view.open.add(key); else view.open.delete(key);
    }, true);
    list.addEventListener("click", (e) => {
      const level = view.level || planSource(lang).st.level;
      const start = e.target.closest("[data-plan-start]");
      if (start) { startLesson(lang, level, Number(start.dataset.planStart)); return; }
      const btn = e.target.closest("[data-plan-open]");
      if (!btn) return;
      openPlanModule(lang, level, Number(btn.dataset.planOpen));
    });
    renderLessonPlan(lang);
  });
  document.querySelectorAll("[data-plan-print]").forEach((btn) => {
    btn.addEventListener("click", () => printLessonPlan(btn.dataset.planPrint));
  });
}

// ─── SMALL UI HELPERS ────────────────────────────────────────────
// Highlight the nav link of the section currently on screen.
function initNavSpy() {
  const links = [...document.querySelectorAll('.top-actions a[href^="#"]')];
  const targets = links.map((a) => document.getElementById(a.getAttribute("href").slice(1))).filter(Boolean);
  if (!targets.length || !("IntersectionObserver" in window)) return;
  const visible = new Map();
  const update = () => {
    const best = targets.filter((t) => visible.get(t)).sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0];
    links.forEach((a) => {
      const on = best && a.getAttribute("href") === `#${best.id}`;
      a.classList.toggle("active", Boolean(on));
      if (on) a.setAttribute("aria-current", "location"); else a.removeAttribute("aria-current");
    });
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => visible.set(e.target, e.isIntersecting));
    update();
  }, { rootMargin: "-30% 0px -55% 0px" });
  targets.forEach((t) => observer.observe(t));
}

// Practice room shortcuts: 1-4 pick an answer, Enter moves on, arrows switch rooms.
function initPracticeKeys() {
  const rooms = [
    { section: "practice", options: "lesson-options", prev: "prev-task", next: "next-task", go: "complete-task" },
    { section: "fr-practice", options: "fr-lesson-options", prev: "fr-prev-task", next: "fr-next-task", go: "fr-complete-task" }
  ].filter((r) => document.getElementById(r.section));
  if (!rooms.length) return;
  document.addEventListener("keydown", (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.target.closest("input, textarea, select, [contenteditable]")) return;
    if (document.querySelector(".unit-modal:not([hidden])")) return;
    const room = rooms.find((r) => {
      const box = document.getElementById(r.section).getBoundingClientRect();
      return box.top < window.innerHeight * 0.6 && box.bottom > window.innerHeight * 0.4;
    });
    if (!room) return;
    if (/^[1-4]$/.test(e.key)) {
      const btn = document.getElementById(room.options).querySelectorAll(".lesson-option")[Number(e.key) - 1];
      if (btn) { btn.click(); e.preventDefault(); }
    } else if (e.key === "Enter" && !e.target.closest("button, a, summary")) {
      const btn = document.getElementById(room.go);
      if (btn) { btn.click(); e.preventDefault(); }
    } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      const btn = document.getElementById(e.key === "ArrowLeft" ? room.prev : room.next);
      if (btn) { btn.click(); e.preventDefault(); }
    }
  });
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
  unitTest.questions = getUnitTestQuestions(lang, unitTest.level, unitTest.module).map((q) => {
    const order = shuffledOrder(q.opts.length, `${Math.random()}`);
    return { q: q.q, ex: q.ex || "", opts: order.map((i) => q.opts[i]), a: order.indexOf(q.a) };
  });

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
      <p class="unit-q-ex" hidden></p>
    </fieldset>
  `).join("");
  container.scrollTop = 0;

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
  const fieldsets = [...container.querySelectorAll("fieldset")];
  const missing = fieldsets.findIndex((f) => !f.querySelector("input:checked"));
  if (missing !== -1) {
    fieldsets.forEach((f) => f.classList.toggle("unanswered", !f.querySelector("input:checked")));
    fieldsets[missing].scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
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
      fieldset.classList.remove("unanswered");
      fieldset.querySelectorAll("input").forEach((input) => { input.disabled = true; });
      const ex = fieldset.querySelector(".unit-q-ex");
      if (ex && q.ex) { ex.textContent = q.ex; ex.hidden = false; }
    }
  });

  const total = unitTest.questions.length;
  const passed = score >= 7;
  document.getElementById("unit-modal-score").textContent = `${score} / ${total}`;
  const verdict = document.getElementById("unit-modal-verdict");
  if (passed) {
    verdict.textContent = unitTest.lang === "fr"
      ? "Réussi ! +100 XP gagnés."
      : "Passed! +100 XP earned.";
    if (unitTest.lang === "fr") { frState.xp += 100; if (frEls.xpCount) frEls.xpCount.textContent = frState.xp; }
    else { state.xp += 100; if (els.xpCount) els.xpCount.textContent = state.xp; }
  } else {
    verdict.textContent = unitTest.lang === "fr"
      ? `Il faut 7/10 pour réussir. Réessayez !`
      : `You need 7/10 to pass. Try again!`;
  }

  document.getElementById("unit-modal-actions").hidden = true;
  document.getElementById("unit-modal-result").hidden = false;
  document.getElementById("unit-modal-next").hidden = !passed;
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
    const isFr = unitTest.lang === "fr";
    const st = isFr ? frState : state;
    const ids = (isFr ? frLevels : levels).map((l) => l.id);
    const count = (isFr ? frCurriculum : curriculum)[st.level].length;
    if (st.module + 1 < count) {
      st.module += 1;
    } else if (ids.indexOf(st.level) + 1 < ids.length) {
      st.level = ids[ids.indexOf(st.level) + 1];
      st.module = 0;
    } else {
      st.module = 0;
    }
    st.task = 0;
    if (isFr) { frRenderLevelTabs(); frRenderModules(); frRenderMaze(); frRenderTask(); }
    else { renderLevelTabs(); renderModules(); renderMaze(); renderTask(); }
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
