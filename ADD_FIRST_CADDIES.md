# How to Add Keith and Preston as Caddies (Simple Steps)

Follow these steps **one time** to add the two caddie accounts. Your admin account stays the same.

---

## What You Need First

1. **Clerk** – where login accounts live  
   - Go to: https://dashboard.clerk.com  
   - Sign in.  
   - Open your app (The Fairway Standard).  
   - In the left sidebar, click **API Keys**.  
   - Find **Secret key**. Click **Show** or **Copy**.  
   - **Paste it somewhere safe** (e.g. a Notes app). You’ll need it in Step 3.

2. **Supabase** – where caddie data is stored  
   - Go to: https://supabase.com/dashboard  
   - Sign in and open your project.  
   - In the left sidebar, click **Project Settings** (gear icon).  
   - Click **API** in the left menu.  
   - You need two values (copy each and keep them safe):  
     - **Project URL** (under “Project URL”)  
     - **service_role** key (under “Project API keys” → “service_role” → **Reveal** → Copy)

3. **Your project folder**  
   - The folder you need is **`fairway-standard`** — the one that contains `package.json` and the `src` folder.  
   - You will run commands from **inside that folder** (Steps 2 and 4).

---

## Step 1: Open Terminal in the `fairway-standard` Folder

- **On Mac:**  
  - Open **Finder** and go to the **`fairway-standard`** folder (the one with `package.json` and `src`).  
  - Right‑click the folder → **New Terminal at Folder** (or open Terminal, type `cd` and a space, drag the **fairway-standard** folder into the window, and press Enter).

- **On Windows:**  
  - Open **File Explorer** and go to the **`fairway-standard`** folder.  
  - In the address bar, type `cmd` and press Enter (this opens Command Prompt in that folder).

You should see a black or white window with text; the last part of the line should include `fairway-standard`.

---

## Step 2: Create or Edit `.env.local`

**`.env.local`** and **`.env.local.example`** are **files** (not folders). They live in the **`fairway-standard`** folder.

- **If you don’t have `.env.local` yet:**  
  - In Terminal, make sure you’re **inside the `fairway-standard` folder**. If you’re not, run:
  ```bash
  cd fairway-standard
  ```
  - Then run this to create `.env.local` from the example file:
  ```bash
  cp .env.local.example .env.local
  ```
  - That creates the file. You won’t see it in Finder (macOS hides files whose names start with a dot). Open it in your editor instead — see below.

- **How to open `.env.local` (in Cursor or VS Code):**  
  - In the **left sidebar**, expand the **`fairway-standard`** folder and click **`.env.local`**.  
  - Or press **Cmd+P** (Mac) / **Ctrl+P** (Windows), type `env.local`, and choose `.env.local` from the list.

- **Edit `.env.local`:** Make sure these three lines exist and are filled in. **Replace the placeholder values** with your real values (no quotes around the values, no extra spaces):

```env
CLERK_SECRET_KEY=your_clerk_secret_key_here
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx...
```

- **Where to get each value:**  
  - `CLERK_SECRET_KEY` → from Clerk Dashboard → API Keys → Secret key (Step “What You Need First” #1).  
  - `NEXT_PUBLIC_SUPABASE_URL` → from Supabase → Project Settings → API → Project URL.  
  - `SUPABASE_SERVICE_ROLE_KEY` → from Supabase → Project Settings → API → under "Project API keys" use the **service_role** key (click **Reveal**, then copy). **Do not use the anon key here** — the service_role key is different and lets the script write to the database. If you see "Invalid API key", you likely pasted the anon key; use the service_role key instead.

- **Save the file** and close it.

---

## Step 3: Run the “Add Caddies” Command

- Go back to the **Terminal** (or Command Prompt) window where you’re in the project folder.

- **Copy this whole line** (one line):

```bash
node --env-file=.env.local scripts/seed-caddies.mjs
```

- **Paste** it into the Terminal.  
- Press **Enter**.

- You should see something like:
  - `Creating Clerk user and caddie record: Keith McArthur ...`
  - `Done. Clerk user id: user_xxxxx`
  - Same for Preston Cobb.
  - Then: `Both caddies are in the system.`

- **If you see an error:**  
  - “CLERK_SECRET_KEY is required” or “SUPABASE_... is required” → one of the three values in `.env.local` is missing or wrong. Open `.env.local` again and fix that line, save, then run the command again.  
  - Any other error → copy the **full error message** and send it to whoever helps you with the project.

- **If you see no output at all:**  
  1. **Run from the right folder.** In Terminal, run `cd fairway-standard` first, then run the `node ...` command again. The script and `.env.local` must both be inside `fairway-standard`.  
  2. **Check your Supabase URL.** In `.env.local`, `NEXT_PUBLIC_SUPABASE_URL` must end with **`.supabase.co`** (e.g. `https://xxxx.supabase.co`). If it's missing `.co`, the script can fail.  
  3. **Check your Supabase service key.** In Supabase Dashboard → Project Settings → API, the **service_role** key is a long token (starts with `eyJ...`). Copy that into `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.  
  4. **Node version.** The `--env-file` flag needs Node **20.6 or newer**. Run `node -v`; if it's below 20, upgrade Node or set the env vars another way (e.g. export them in the shell) then run `node scripts/seed-caddies.mjs`.

---

## Step 4: After It Succeeds

- **Keith** and **Preston** can now sign in to your app with **email or phone** and password:

  | Caddie  | Email | Phone (for sign-in) | Password      |
  |---------|-------|---------------------|---------------|
  | Keith   | `keith.mcarthur@thefairwaystandard.org` | `+19096189494` or `(909) 618-9494` | `StandardCaddie` |
  | Preston | `preston.cobb@thefairwaystandard.org`  | `+16153107111` or `(615) 310-7111` | `StandardCaddie` |

  If your Clerk app allows phone sign-in, they can use their phone number + password. Otherwise they use email + password.

- **You** keep using your usual login; your admin account is not changed.

- **To make them show up on the “Browse” page:**  
  - You (as admin) go to **Admin → Caddies** in your app.  
  - Open each caddie (Keith, Preston), set an **hourly rate** and set **subscription status** to **Active**, then save.

---

## Quick Copy-Paste Summary

| Step | Where to go | What to copy/paste |
|------|-------------|---------------------|
| Get Clerk key | https://dashboard.clerk.com → Your app → API Keys | Copy the **Secret key** |
| Get Supabase URL + key | https://supabase.com/dashboard → Your project → Project Settings → API | Copy **Project URL** and **service_role** key |
| Create `.env.local` (if needed) | Terminal, in the **fairway-standard** folder | `cp .env.local.example .env.local` |
| Edit `.env.local` | Open `.env.local` in Cursor/editor | Paste your real values for the 3 keys (see Step 2) |
| Run the script | Terminal, in the **fairway-standard** folder | `node --env-file=.env.local scripts/seed-caddies.mjs` |

That’s it. Once this has run successfully, you don’t need to run it again for these two caddies.
