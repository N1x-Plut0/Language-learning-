// ============================================================
// auth.js — accounts + progress persistence for Maze Academy
//
// Talks to the local backend in server.js (same origin) via /api/*.
// Depends on app.js exposing window.MazeApp = { getSnapshot, applySnapshot }.
//
// Behaviour:
//   - Guests: progress saved to localStorage.
//   - On sign-up / login: local progress merges into the account,
//     then progress saves to the database (debounced).
//   - If the backend isn't running (e.g. page opened as a file),
//     it quietly falls back to guest/local-only mode.
// ============================================================

(function () {
  "use strict";

  const LOCAL_KEY = "maze-progress-v1";

  let backendUp = false;
  let currentUser = null;       // { email } when logged in
  let isHydrating = false;      // suppress persist while we load data in
  let appReady = false;
  let saveTimer = null;

  // ---- API client ------------------------------------------------

  async function api(path, method, body) {
    const res = await fetch(path, {
      method: method || "GET",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      credentials: "same-origin",
      body: body ? JSON.stringify(body) : undefined
    });
    let data = null;
    try { data = await res.json(); } catch (_) { /* ignore */ }
    if (!res.ok) {
      const msg = (data && data.error) ? data.error : `Request failed (${res.status}).`;
      const err = new Error(msg);
      err.status = res.status;
      throw err;
    }
    return data;
  }

  // ---- local storage ---------------------------------------------

  function readLocal() {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
  }
  function writeLocal(snap) {
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(snap)); } catch (_) { /* ignore */ }
  }

  // ---- merge helpers ---------------------------------------------

  function mergeOne(a, b) {
    a = a || {}; b = b || {};
    const completed = new Set([...(a.completed || []), ...(b.completed || [])]);
    const solved = new Set([...(a.solved || []), ...(b.solved || [])]);
    const richer = (b.xp || 0) >= (a.xp || 0) ? b : a;
    return {
      level: richer.level || a.level || b.level,
      module: richer.module ?? a.module ?? b.module ?? 0,
      task: richer.task ?? a.task ?? b.task ?? 0,
      duration: richer.duration ?? a.duration ?? b.duration ?? 10,
      xp: Math.max(a.xp || 0, b.xp || 0),
      streak: Math.max(a.streak || 0, b.streak || 0),
      completed: [...completed],
      solved: [...solved]
    };
  }
  function mergeSnapshots(local, remote) {
    if (!local && !remote) return null;
    if (!local) return remote;
    if (!remote) return local;
    return { de: mergeOne(local.de, remote.de), fr: mergeOne(local.fr, remote.fr) };
  }

  function isEmptySnap(snap) {
    if (!snap) return true;
    const empty = (s) => !s || (!(s.completed || []).length && !(s.solved || []).length && !s.xp);
    return empty(snap.de) && empty(snap.fr);
  }

  function hydrate(snap) {
    if (!snap || !window.MazeApp) return;
    isHydrating = true;
    try { window.MazeApp.applySnapshot(snap); }
    finally { isHydrating = false; }
  }

  // ---- remote progress -------------------------------------------

  async function fetchRemote() {
    try {
      const data = await api("/api/progress", "GET");
      if (isEmptySnap(data)) return null;
      return data;
    } catch (_) { return null; }
  }
  async function saveRemote(snap) {
    try { await api("/api/progress", "PUT", snap); } catch (_) { /* offline — keep local copy */ }
  }

  // ---- persistence (called by app.js via window.MazeAuth.persist) -

  function persist() {
    if (isHydrating || !appReady || !window.MazeApp) return;
    const snap = window.MazeApp.getSnapshot();
    writeLocal(snap);
    if (!currentUser) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => saveRemote(snap), 800);
  }
  window.MazeAuth = { persist };

  // ---- auth flows ------------------------------------------------

  async function afterLogin() {
    const local = readLocal();
    const remote = await fetchRemote();
    const merged = mergeSnapshots(local, remote);
    if (merged) {
      hydrate(merged);
      writeLocal(merged);
      await saveRemote(merged);
    } else {
      await saveRemote(window.MazeApp.getSnapshot());
    }
    updateAccountUI();
  }

  async function doSignup(email, password) {
    const data = await api("/api/signup", "POST", { email, password });
    currentUser = { email: data.email };
    await afterLogin();
  }
  async function doLogin(email, password) {
    const data = await api("/api/login", "POST", { email, password });
    currentUser = { email: data.email };
    await afterLogin();
  }
  async function doLogout() {
    try { await api("/api/logout", "POST"); } catch (_) { /* ignore */ }
    currentUser = null;
    updateAccountUI();
  }

  // ---- UI --------------------------------------------------------

  function el(id) { return document.getElementById(id); }

  function updateAccountUI() {
    const area = el("account-area");
    if (!area) return;
    if (currentUser) {
      area.innerHTML =
        `<span class="account-email" title="${currentUser.email}">${currentUser.email}</span>` +
        `<button type="button" class="account-btn" id="logout-btn">Log out</button>`;
      el("logout-btn").addEventListener("click", () => doLogout());
    } else if (backendUp) {
      area.innerHTML = `<button type="button" class="account-btn" id="signin-btn">Sign in</button>`;
      el("signin-btn").addEventListener("click", () => openAuthModal("login"));
    } else {
      area.innerHTML = `<span class="account-note" title="Start the server (node server.js) to enable accounts">Guest mode</span>`;
    }
  }

  function setAuthTab(mode) {
    const isLogin = mode === "login";
    el("auth-tab-login").classList.toggle("active", isLogin);
    el("auth-tab-signup").classList.toggle("active", !isLogin);
    el("auth-submit").textContent = isLogin ? "Log in" : "Sign up";
    el("auth-modal").dataset.mode = mode;
    setAuthMessage("");
  }
  function setAuthMessage(text, kind) {
    const m = el("auth-message");
    if (!m) return;
    m.textContent = text || "";
    m.className = "auth-message" + (kind ? " " + kind : "");
  }
  function openAuthModal(mode) {
    const modal = el("auth-modal");
    if (!modal) return;
    setAuthTab(mode || "login");
    el("auth-email").value = "";
    el("auth-password").value = "";
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    el("auth-email").focus();
  }
  function closeAuthModal() {
    const modal = el("auth-modal");
    if (modal) modal.hidden = true;
    document.body.style.overflow = "";
  }

  async function handleSubmit() {
    const email = el("auth-email").value.trim();
    const password = el("auth-password").value;
    const mode = el("auth-modal").dataset.mode;
    if (!email || !password) {
      setAuthMessage("Please enter an email and password.", "error");
      return;
    }
    const submit = el("auth-submit");
    submit.disabled = true;
    setAuthMessage("Working…");
    try {
      if (mode === "signup") await doSignup(email, password);
      else await doLogin(email, password);
      closeAuthModal();
    } catch (err) {
      setAuthMessage(err && err.message ? err.message : "Something went wrong.", "error");
    } finally {
      submit.disabled = false;
    }
  }

  function wireModal() {
    if (!el("auth-modal")) return;
    el("auth-tab-login").addEventListener("click", () => setAuthTab("login"));
    el("auth-tab-signup").addEventListener("click", () => setAuthTab("signup"));
    el("auth-close").addEventListener("click", closeAuthModal);
    el("auth-modal").addEventListener("click", (e) => {
      if (e.target === el("auth-modal")) closeAuthModal();
    });
    el("auth-form").addEventListener("submit", (e) => {
      e.preventDefault();
      handleSubmit();
    });
  }

  // ---- bootstrap -------------------------------------------------

  function startGuest() {
    const local = readLocal();
    if (local) hydrate(local);
  }

  async function bootstrap() {
    appReady = true;
    wireModal();

    // Is the backend reachable? (GET /api/me returns 200 if logged in, 401 if not.)
    try {
      const me = await api("/api/me", "GET");
      backendUp = true;
      currentUser = me && me.email ? { email: me.email } : null;
    } catch (err) {
      if (err.status === 401) {
        backendUp = true;      // server answered, just not logged in
        currentUser = null;
      } else {
        backendUp = false;     // no server (opened as file, or not started)
      }
    }

    if (currentUser) {
      await afterLogin();
    } else {
      startGuest();
      updateAccountUI();
    }

    // Arrived from a "Sign in" link on a title page? Open the login modal.
    if (backendUp && !currentUser && window.location.hash === "#signin") {
      openAuthModal("login");
    }
  }

  if (window.MazeApp) bootstrap();
  else window.addEventListener("maze-ready", bootstrap, { once: true });
})();
