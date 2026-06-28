// ============================================================
// server.js — Maze Academy backend
//
// A tiny, zero-dependency web server (Node's built-ins only) that:
//   - serves the static site (index.html, app.js, ...)
//   - provides real accounts + a real SQLite database (data.db)
//
// Run it with:   node server.js     (or: npm start)
// Then open:     http://localhost:3000
//
// No external services, no npm install, no API keys.
// ============================================================

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { DatabaseSync } = require("node:sqlite");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const DB_PATH = path.join(ROOT, "data.db");

// ---- database --------------------------------------------------
const db = new DatabaseSync(DB_PATH);
db.exec(`
  create table if not exists users (
    id integer primary key autoincrement,
    email text unique not null,
    pass text not null,
    de_progress text not null default '{}',
    fr_progress text not null default '{}',
    created_at text not null default (datetime('now'))
  );
  create table if not exists sessions (
    token text primary key,
    user_id integer not null references users(id) on delete cascade,
    created_at text not null default (datetime('now'))
  );
`);

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
  const row = db.prepare(
    "select users.* from sessions join users on users.id = sessions.user_id where sessions.token = ?"
  ).get(token);
  return row || null;
}

function makeSession(userId) {
  const token = crypto.randomBytes(32).toString("hex");
  db.prepare("insert into sessions (token, user_id) values (?, ?)").run(token, userId);
  return token;
}

function sessionCookie(token) {
  // HttpOnly so JS can't read it; Lax so it rides normal navigation.
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
    const existing = db.prepare("select id from users where email = ?").get(email.toLowerCase());
    if (existing) return send(res, 409, { error: "An account with that email already exists." });
    const info = db.prepare("insert into users (email, pass) values (?, ?)").run(email.toLowerCase(), hashPassword(password));
    const token = makeSession(info.lastInsertRowid);
    return send(res, 200, { email: email.toLowerCase() }, { "Set-Cookie": sessionCookie(token) });
  }

  // POST /api/login
  if (pathname === "/api/login" && req.method === "POST") {
    const { email, password } = await readBody(req);
    const user = isValidEmail(email)
      ? db.prepare("select * from users where email = ?").get(email.toLowerCase())
      : null;
    if (!user || !verifyPassword(password, user.pass)) {
      return send(res, 401, { error: "Wrong email or password." });
    }
    const token = makeSession(user.id);
    return send(res, 200, { email: user.email }, { "Set-Cookie": sessionCookie(token) });
  }

  // POST /api/logout
  if (pathname === "/api/logout" && req.method === "POST") {
    const token = parseCookies(req).sid;
    if (token) db.prepare("delete from sessions where token = ?").run(token);
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
    return send(res, 200, {
      de: JSON.parse(user.de_progress || "{}"),
      fr: JSON.parse(user.fr_progress || "{}")
    });
  }

  // PUT /api/progress
  if (pathname === "/api/progress" && req.method === "PUT") {
    const user = userFromReq(req);
    if (!user) return send(res, 401, { error: "Not logged in." });
    const { de, fr } = await readBody(req);
    db.prepare("update users set de_progress = ?, fr_progress = ? where id = ?")
      .run(JSON.stringify(de || {}), JSON.stringify(fr || {}), user.id);
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
  // prevent path traversal
  const filePath = path.normalize(path.join(ROOT, rel));
  if (!filePath.startsWith(ROOT)) return send(res, 403, { error: "Forbidden" });
  // never serve the database or the server itself
  const base = path.basename(filePath);
  if (base === "data.db" || base === "server.js") return send(res, 403, { error: "Forbidden" });

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

server.listen(PORT, () => {
  console.log(`\n  Maze Academy is running.`);
  console.log(`  Open  →  http://localhost:${PORT}\n`);
  console.log(`  (Accounts + progress are stored in data.db in this folder.)`);
  console.log(`  Press Ctrl+C to stop.\n`);
});
