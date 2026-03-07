# Where to go in Builder.io (you're in Projects right now)

You're in **Projects** — that's for code generation. Our app needs a **Page** from **Content**. Here’s how to get there.

---

## Step 1: Open Content

**Option A — Direct link (simplest)**  
In your browser, go to:

**https://builder.io/content**

That should open the Content area where Pages live (and where you set a URL like `/dashboard/profile`).

**Option B — From the sidebar**  
In the same Builder window, look at the **left sidebar**:

- You see **Projects** (highlighted), Integrations, Design System, Asset Library, etc.
- **Content** can be in that same list (sometimes above or below Projects).
- If the list is long, **scroll** the sidebar and look for **"Content"**.
- Click **Content**.

If you don’t see Content anywhere, your space might be Fusion-only; use Option A (the link) or Step 2.

---

## Step 2: If you don’t have Content — use a Publish space

Builder has two space types:

- **Fusion** = Projects + code generation (where you are now).
- **Publish** = Content/Pages + headless CMS (what our app fetches by URL).

If **Content** doesn’t exist in your current space:

1. In Builder, open **Settings** (gear in the sidebar) or your **account/space switcher**.
2. Create a **new Space** and choose **Publish** (or “Visual CMS” / headless CMS).
3. In that new space you’ll have **Content** → **Pages**.
4. Get the **Public API key** for that new space (Space Settings → API Keys).
5. Put that key in your app’s `.env.local` as `NEXT_PUBLIC_BUILDER_API_KEY` (replace the old one).
6. In that Publish space, go to **Content** → **Pages** and follow Step 3 below.

---

## Step 3: Create the profile page (once you’re in Content)

1. Click **+ New** or **New entry**.
2. Choose **Page**.
3. When it asks for **URL**, enter exactly: **`/dashboard/profile`**
4. Name it (e.g. “Caddie Profile”) and click Create.
5. Design the layout (drag sections, text, image). Bind dynamic fields to **State** (e.g. `state.profile.displayName`, `state.profile.avatarUrl`).
6. Click **Publish**.

After that, your app will load this page automatically when someone visits `/dashboard/profile` — no code copy-paste.

---

## Quick recap

| Where you are     | What to do |
|-------------------|------------|
| In **Projects**   | Go to **Content** (sidebar or https://builder.io/content). |
| No **Content**    | Create a **Publish** space, use its API key in `.env.local`, then use Content there. |
| In **Content**    | New → Page → URL `/dashboard/profile` → design → Publish. |

Start with **https://builder.io/content** in a new tab; that’s the fastest way to get to the right place.
