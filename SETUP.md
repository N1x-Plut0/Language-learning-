# Running Maze Academy (with accounts)

Everything is built in. There is **no signup, no cloud service, no API keys** — accounts
and progress are stored in a local database file (`data.db`) created automatically.

## Start it
You need [Node.js](https://nodejs.org) (version 22 or newer — you have v24, which is perfect).

1. Open a terminal in this folder.
2. Run:

   ```
   node server.js
   ```

   (or `npm start`)

3. Open the address it prints:

   ```
   http://localhost:3000
   ```

That's it. The first run creates `data.db` in this folder.

## Using accounts
- Click **Sign in** (top-right) → **Sign up** → create an account with any email + password (6+ chars).
- Do some lessons, then reload — your XP, streak, and completed rooms are still there.
- **Log out** and **log in** again (even in another browser on the same computer) — your
  progress loads from the database.
- Not logged in? You can still use everything as a **guest**; progress saves in that browser.

## How it works (plain version)
- `server.js` is a small web server using only Node's built-in modules (no `npm install`).
- It serves the site **and** provides the accounts API at `/api/*`.
- Passwords are hashed (scrypt) before storage; you're kept logged in with a secure cookie.
- All data lives in `data.db` (a real SQLite database). Back it up by copying that file.

## Notes
- Open the site through **http://localhost:3000**, not by double-clicking `index.html`.
  (Opening the file directly still works in guest mode, but accounts need the server.)
- To stop the server: press **Ctrl+C** in the terminal.
- `data.db` contains all accounts/progress — don't delete it unless you want a fresh start.

### Using it on other devices (optional)
To reach accounts from your phone or another computer, deploy `server.js` to any host that
runs Node (Render, Railway, Fly.io, a small VPS…). The code is ready as-is — just run it
there and point your domain at it.
