# Maze Academy

A German & French language-learning site built as a curriculum "maze" — six CEFR
levels (A1 → C1/C2), five modules each, ten short practice rooms per module — with
task questions, module theory, book recommendations, end-of-unit tests, **user
accounts**, and progress saved to a local database.

## Features
- 🇩🇪🇫🇷 Two full courses (German & French), each with 600+ practice questions, theory cards, unit tests, and reading lists.
- 🧩 Interactive curriculum maze with XP, streaks, and per-module progress.
- 👤 **Accounts**: email + password sign-up/login. Progress is saved to your account and restored on any browser.
- 🗄️ **Database**: a small, dependency-free Node server with a built-in SQLite database (`data.db`).
- 🙋 Guest mode: works without an account (progress saved locally), and syncs into your account when you log in.

## Use it online (one link)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/N1x-Plut0/Language-learning-)

Click the button → sign in to Render with GitHub → **Apply**. Render reads
`render.yaml`, builds the server, and gives you a permanent link like
`https://maze-academy.onrender.com` with **accounts working**. First deploy takes
~2–3 minutes.

> Free-tier note: the service sleeps after ~15 min of inactivity (first visit after
> that takes ~30s to wake), and the SQLite database can reset on redeploys. Fine for
> demos; ask for the persistent-database upgrade if you need accounts to last forever.

## Run it locally
Requires [Node.js](https://nodejs.org) 22.6+ (built-in SQLite is used).

- **Windows:** double-click **`Start Maze Academy.bat`** — it starts the server and opens your browser automatically.
- **Any OS:** run `node server.js`, then open **http://localhost:3000**.

Then click **Sign in → Sign up**. There is no build step and no `npm install` — the server uses only Node's built-in modules.

## Project layout
| File | Purpose |
|------|---------|
| `index.html` | The main app (maze, practice, books, account UI). |
| `app.js` | Course logic, rendering, state. |
| `auth.js` | Account UI + talks to the `/api/*` backend. |
| `server.js` | Web server + accounts API + SQLite database. |
| `de-*.js` / `fr-*.js` | Question banks, theory, unit tests, books. |
| `styles.css` | All styling. |
| `title-1/2/3.html` | Alternative landing pages. |

See [SETUP.md](SETUP.md) for full setup notes.

## Notes
- `data.db` (accounts + progress) is **gitignored** — it never gets committed.
- Passwords are hashed (scrypt); sessions use a secure HttpOnly cookie.
