# Maze Academy

A German & French language-learning site built as a curriculum "maze" — six CEFR
levels (A1 → C1/C2), each split into two sub-levels (A1.1, A1.2 …), six modules per level, ten short practice rooms per module — with
task questions, module theory, book recommendations, end-of-unit tests, and **user
accounts** so progress follows you across devices.

## Features
- 🇩🇪🇫🇷 Two full courses (German & French), each with 600+ practice questions, theory cards, unit tests, and reading lists.
- 🧩 Interactive curriculum maze with XP, streaks, and per-module progress.
- 🔰 Starter for complete beginners: six mini-lessons per language (first words and phrases) with browser audio, pronunciation hints and a short check after each lesson. 🔊 buttons also read theory examples and lesson vocabulary aloud.
- 📋 Lesson plans: one lesson per maze module (36 per language, grouped into 12 sub-levels) with goals, grammar, vocabulary, rooms, speaking/writing tasks, and homework, all linked to the maze and ticked off as you progress. Printable.
- 👤 **Accounts**: email + password sign-up/login, powered by [Supabase](https://supabase.com) (free, persistent).
- 🙋 Guest mode: works without an account (progress saved in the browser), and syncs into your account when you log in.
- ☁️ Fully static — hosted free on GitHub Pages, no server to run.

## Live link
Once accounts are configured (see below), the site is published automatically to GitHub Pages:

```
https://n1x-plut0.github.io/Language-learning-/
```

Each language has its own page:

- German: `https://n1x-plut0.github.io/Language-learning-/german/`
- French: `https://n1x-plut0.github.io/Language-learning-/french/`

Anyone can open that link, sign up, and log in — their progress is saved to their account.

## Set up accounts (one-time, ~5 min)
Accounts use a free Supabase project. You create the project and paste two keys;
that's it. Full click-by-click steps are in **[SETUP.md](SETUP.md)**:
1. Create a free Supabase project.
2. Run `schema.sql` in its SQL Editor.
3. Turn off email confirmation (for instant sign-up).
4. Paste your **Project URL** + **anon key** into `supabase-config.js`.

## Play locally
Double-click **`Play Maze Academy.bat`** (or just open `index.html`). The full game
works offline as a guest; once the Supabase keys are set, accounts work locally too.

## Project layout
| File | Purpose |
|------|---------|
| `index.html` | Home page: pick a language, see your progress in each course. |
| `german/index.html` | German course page: next lesson, lesson plan, maze, practice, placement, basics, books. |
| `french/index.html` | French course page (same layout as German). |
| `app.js` | Course logic, rendering, state. |
| `auth.js` | Account UI + Supabase auth & progress sync. |
| `supabase-config.js` | Your Supabase URL + anon key. |
| `schema.sql` | Database table + security policies (run once in Supabase). |
| `de-*.js` / `fr-*.js` | Question banks, theory, unit tests, books. |
| `de-starter.js` / `fr-starter.js` | Starter lessons: first words with pronunciation hints. |
| `de-plan.js` / `fr-plan.js` | Lesson plans: goals, vocabulary and activities for each module. |
| `styles.css` | All styling. |
| `title-1/2/3.html` | Alternative landing pages. |
| `.github/workflows/deploy-pages.yml` | Auto-publishes the site to GitHub Pages. |

## Notes
- The Supabase **anon key is meant to be public** (it lives in the page); your data is protected by Row-Level Security (`schema.sql`).
- `server.js` is an optional self-hosted alternative backend; it isn't used by the hosted Supabase setup.
