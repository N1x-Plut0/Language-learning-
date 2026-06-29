// ============================================================
// server.js — Maze Academy backend
//
// A tiny, zero-dependency web server (Node's built-ins only) that:
//   - serves the static site (index.html, app.js, ...)
//   - provides real accounts, stored in a JSON file (data.json)
//
// Run it with:   node server.js     (or: npm start)
// Then open:     http://localhost:3000
//
// No external services, no npm install, no API keys, no special Node flags.
// Runs on any Node 18+.
// ============================================================

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { exec } = require("node:child_process");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const DATA_PATH = path.join(ROOT, "data.json");

// ---- storage (a simple JSON file) ------------------------------
// store = { users: [ {id,email,pass,de_progress,fr_progress,created_at} ],
//           sessions: { token: userId } }
let store = { users: [], sessions: {} };

function loadStore() {
  try {
    store = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
  } catch (_) {
    store = { users: [], sessions: {} };
  }
  if (!Array.isArray(store.users)) store.users = [];
  if (!store.sessions || typeof store.sessions !== "object") store.sessions = {};
}

let saveQueued = false;
function saveStore() {
  // debounce rapid writes into one
  if (saveQueued) return;
  saveQueued = true;
  setImmediate(() => {
    saveQueued = false;
    try { fs.writeFileSync(DATA_PATH, JSON.stringify(store)); } catch (_) { /* ignore */ }
  });
}

loadStore();

function findUserByEmail(email) {
  return store.users.find((u) => u.email === email) || null;
}
function findUserById(id) {
  return store.users.find((u) => u.id === id) || null;
}

// ---- password hashing (scrypt) ---------------------------------
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}
function verifyPassword(password, stored) {
  const [salt, hash] = String(stored).split(":");
  if (!salt || !hash) return false;
  const test = crypto.scryptSync(password, salt, 64);
  const known = Buffer.from(hash, "hex");
  return test.length === known.length && crypto.timingSafeEqual(test, known);
}

// ---- helpers ---------------------------------------------------
function send(res, status, body, headers = {}) {
  const data = typeof body === "string" ? body : JSON.stringify(body);
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", ...headers });
  res.end(data);
}

function parseCookies(req) {
  const out = {};
  const raw = req.headers.cookie;
  if (!raw) return out;
  raw.split(";").forEach((pair) => {
    const i = pair.indexOf("=");
    if (i > -1) out[pair.slice(0, i).trim()] = decodeURIComponent(pair.slice(i + 1).trim());
  });
  return out;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 1e6) { reject(new Error("body too large")); req.destroy(); }
    });
    req.on("end", () => {
      if (!data) return resolve({});
      try { resolve(JSON.parse(data)); } catch (_) { resolve({}); }
    });
    req.on("error", reject);
  });
}

function userFromReq(req) {
  const token = parseCookies(req).sid;
  if (!token) return null;
  const userId = store.sessions[token];
  if (userId === undefined) return null;
  return findUserById(userId);
}

function makeSession(userId) {
  const token = crypto.randomBytes(32).toString("hex");
  store.sessions[token] = userId;
  saveStore();
  return token;
}

function sessionCookie(token) {
  return `sid=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24 * 365}`;
}
function clearCookie() {
  return "sid=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0";
}

function isValidEmail(e) {
  return typeof e === "string" && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);
}

// ---- API routes ------------------------------------------------
async function handleApi(req, res, pathname) {
  // POST /api/signup
  if (pathname === "/api/signup" && req.method === "POST") {
    const { email, password } = await readBody(req);
    if (!isValidEmail(email)) return send(res, 400, { error: "Please enter a valid email." });
    if (!password || String(password).length < 6) return send(res, 400, { error: "Password must be at least 6 characters." });
    const lower = email.toLowerCase();
    if (findUserByEmail(lower)) return send(res, 409, { error: "An account with that email already exists." });
    const id = (store.users.reduce((m, u) => Math.max(m, u.id), 0) || 0) + 1;
    store.users.push({
      id,
      email: lower,
      pass: hashPassword(password),
      de_progress: {},
      fr_progress: {},
      created_at: new Date().toISOString()
    });
    saveStore();
    const token = makeSession(id);
    return send(res, 200, { email: lower }, { "Set-Cookie": sessionCookie(token) });
  }

  // POST /api/login
  if (pathname === "/api/login" && req.method === "POST") {
    const { email, password } = await readBody(req);
    const user = isValidEmail(email) ? findUserByEmail(email.toLowerCase()) : null;
    if (!user || !verifyPassword(password, user.pass)) {
      return send(res, 401, { error: "Wrong email or password." });
    }
    const token = makeSession(user.id);
    return send(res, 200, { email: user.email }, { "Set-Cookie": sessionCookie(token) });
  }

  // POST /api/logout
  if (pathname === "/api/logout" && req.method === "POST") {
    const token = parseCookies(req).sid;
    if (token && store.sessions[token] !== undefined) {
      delete store.sessions[token];
      saveStore();
    }
    return send(res, 200, { ok: true }, { "Set-Cookie": clearCookie() });
  }

  // GET /api/me
  if (pathname === "/api/me" && req.method === "GET") {
    const user = userFromReq(req);
    if (!user) return send(res, 401, { error: "Not logged in." });
    return send(res, 200, { email: user.email });
  }

  // GET /api/progress
  if (pathname === "/api/progress" && req.method === "GET") {
    const user = userFromReq(req);
    if (!user) return send(res, 401, { error: "Not logged in." });
    return send(res, 200, { de: user.de_progress || {}, fr: user.fr_progress || {} });
  }

  // PUT /api/progress
  if (pathname === "/api/progress" && req.method === "PUT") {
    const user = userFromReq(req);
    if (!user) return send(res, 401, { error: "Not logged in." });
    const { de, fr } = await readBody(req);
    user.de_progress = de || {};
    user.fr_progress = fr || {};
    saveStore();
    return send(res, 200, { ok: true });
  }

  return send(res, 404, { error: "Unknown endpoint." });
}

// ---- static files ----------------------------------------------
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".md": "text/markdown; charset=utf-8",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg"
};

function serveStatic(req, res, pathname) {
  let rel = decodeURIComponent(pathname);
  if (rel === "/") rel = "/index.html";
  const filePath = path.normalize(path.join(ROOT, rel));
  if (!filePath.startsWith(ROOT)) return send(res, 403, { error: "Forbidden" });
  const base = path.basename(filePath);
  // never serve the data store or the server itself
  if (base === "data.json" || base === "data.db" || base === "server.js") {
    return send(res, 403, { error: "Forbidden" });
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end("Not found");
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": TYPES[ext] || "application/octet-stream" });
    res.end(data);
  });
}

// ---- server ----------------------------------------------------
const server = http.createServer(async (req, res) => {
  try {
    const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
    if (pathname.startsWith("/api/")) {
      await handleApi(req, res, pathname);
    } else {
      serveStatic(req, res, pathname);
    }
  } catch (err) {
    send(res, 500, { error: "Server error." });
  }
});

function openBrowser(url) {
  if (process.env.NO_OPEN) return; // hosting can set NO_OPEN=1 to skip
  const cmd =
    process.platform === "win32" ? `start "" "${url}"` :
    process.platform === "darwin" ? `open "${url}"` :
    `xdg-open "${url}"`;
  exec(cmd, () => {});
}

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`\n  Maze Academy is running.`);
  console.log(`  Open  →  ${url}\n`);
  console.log(`  (Accounts + progress are stored in data.json in this folder.)`);
  console.log(`  Press Ctrl+C to stop.\n`);
  openBrowser(url);
});
