// ============================================================
// auth.js — accounts + progress for Maze Academy, via Supabase.
//
// Needs (loaded before this file in index.html):
//   - the Supabase SDK (window.supabase, from CDN)
//   - supabase-config.js (SUPABASE_URL, SUPABASE_ANON_KEY)
//   - app.js exposing window.MazeApp = { getSnapshot, applySnapshot }
//
// Works from a hosted link (GitHub Pages) AND from a local file:
//   - Guests: progress saved in the browser (localStorage).
//   - Sign up / log in: local progress merges into the account, then
//     progress saves to Supabase and follows the user across devices.
//   - Not configured yet (placeholder keys): clean guest-only mode.
// ============================================================

(function () {
  "use strict";

  const LOCAL_KEY = "maze-progress-v1";
  const isConfigured =
    typeof SUPABASE_URL === "string" &&
    typeof SUPABASE_ANON_KEY === "string" &&
    !SUPABASE_URL.includes("YOUR-PROJECT") &&
    !SUPABASE_ANON_KEY.includes("YOUR-ANON-KEY");

  let supa = null;
  let currentUser = null;
  let isHydrating = false;
  let appReady = false;
  let saveTimer = null;

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

  // ---- Supabase data ---------------------------------------------
  async function fetchRemote() {
    if (!supa || !currentUser) return null;
    const { data, error } = await supa
      .from("profiles")
      .select("de_progress, fr_progress")
      .eq("id", currentUser.id)
      .maybeSingle();
    if (error || !data) return null;
    const snap = { de: data.de_progress || {}, fr: data.fr_progress || {} };
    return isEmptySnap(snap) ? null : snap;
  }
  async function saveRemote(snap) {
    if (!supa || !currentUser) return;
    try {
      await supa.from("profiles").upsert({
        id: currentUser.id,
        de_progress: snap.de,
        fr_progress: snap.fr,
        updated_at: new Date().toISOString()
      });
    } catch (_) { /* offline — local copy kept */ }
  }

  // ---- persistence (app.js calls window.MazeAuth.persist) --------
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
    const { data, error } = await supa.auth.signUp({ email, password });
    if (error) throw error;
    if (!data.session) return { needsConfirmation: true };
    return { needsConfirmation: false };
  }
  async function doLogin(email, password) {
    const { error } = await supa.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }
  async function doLogout() {
    try { await supa.auth.signOut(); } catch (_) { /* ignore */ }
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
    } else if (isConfigured) {
      area.innerHTML = `<button type="button" class="account-btn" id="signin-btn">Sign in</button>`;
      el("signin-btn").addEventListener("click", () => openAuthModal("login"));
    } else {
      area.innerHTML = `<span class="account-note" title="Add your Supabase keys to supabase-config.js">Guest mode</span>`;
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
      if (mode === "signup") {
        const res = await doSignup(email, password);
        if (res.needsConfirmation) {
          setAuthMessage("Check your email to confirm your account, then log in.", "ok");
          setAuthTab("login");
          return;
        }
      } else {
        await doLogin(email, password);
      }
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

    if (!isConfigured || !window.supabase) {
      startGuest();
      updateAccountUI();
      return;
    }

    supa = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const { data: { session } } = await supa.auth.getSession();
    currentUser = session ? session.user : null;

    if (currentUser) {
      await afterLogin();
    } else {
      startGuest();
      updateAccountUI();
    }

    supa.auth.onAuthStateChange(async (event, session) => {
      const prev = currentUser;
      currentUser = session ? session.user : null;
      if (event === "SIGNED_IN" && currentUser && (!prev || prev.id !== currentUser.id)) {
        await afterLogin();
      } else {
        updateAccountUI();
      }
    });

    if (!currentUser && window.location.hash === "#signin") {
      openAuthModal("login");
    }
  }

  if (window.MazeApp) bootstrap();
  else window.addEventListener("maze-ready", bootstrap, { once: true });
})();
