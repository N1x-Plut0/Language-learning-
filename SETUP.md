# Setup — accounts for other users (one-time, ~5 minutes)

Your site is a static web app. Accounts run on **Supabase** (free, persistent),
and the site is hosted free on **GitHub Pages** so anyone can use it from one link.

You only do **two things**: create a Supabase project, and paste 2 keys.
I'll handle the rest once you send me the keys.

---

## Step 1 — Create a free Supabase project
1. Go to **https://supabase.com** → **Start your project** → sign in (GitHub is easiest).
2. **New project** → give it a name + a database password → pick a region → **Create**.
3. Wait ~2 minutes for it to finish setting up.

## Step 2 — Create the accounts table
1. In your project, open **SQL Editor** (left sidebar) → **New query**.
2. Open the file **`schema.sql`** in this project, copy ALL of it, paste it in, click **Run**.
3. You should see a `profiles` table under **Table Editor**.

## Step 3 — Make sign-up instant (turn off email confirmation)
1. Left sidebar: **Authentication** → **Providers** → **Email**.
2. Turn **"Confirm email" OFF** → **Save**.
   (Otherwise users must click a confirmation email before logging in.)

## Step 4 — Copy your 2 keys
1. Left sidebar: **Project Settings** (gear) → **API**.
2. Copy these two values:
   - **Project URL**  (looks like `https://abcdxyz.supabase.co`)
   - **anon public** key  (a long string starting with `eyJ...`)

## Step 5 — Send them to me (or paste them yourself)
Paste them into **`supabase-config.js`**, replacing the placeholders:

```js
const SUPABASE_URL = "https://abcdxyz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOi...";
```

> The anon key is **meant to be public** — it lives in the page. Your data is
> protected by Row-Level Security (from `schema.sql`).

That's your whole part. Once the keys are in and pushed to GitHub, the site is live.

---

## The live link (GitHub Pages — automatic)
This repo has a workflow that publishes the site to GitHub Pages on every push.
After your first push with the keys filled in, your site is at:

```
https://n1x-plut0.github.io/Language-learning-/
```

Share that link — anyone can open it, **sign up, and log in**, and their progress
is saved to their account on any device. No server to run, nothing to keep open.

(If GitHub Pages isn't on yet: repo **Settings → Pages → Build and deployment →
Source: GitHub Actions**. The included workflow does the rest.)

## Play locally too
Double-click **`Play Maze Academy.bat`** (or open `index.html`). Once the keys are
set, accounts work locally as well, syncing to the same Supabase project.
