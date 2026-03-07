# Builder.io is already connected — no code copy-paste

Your Next.js app and Builder.io are **already connected** over the internet. There is no step where you copy code from Builder into your repo.

## How it works

1. **Your app** (when someone visits `/dashboard/profile`) calls Builder’s API: “Give me the Page whose URL is `/dashboard/profile`.”
2. **Builder.io** returns that page’s design (as JSON).
3. **Your app** renders that design and injects the real caddie data (name, avatar, bio, reviews, etc.).

So the “connection” is: **same API key + same URL**. No manual code transfer.

## The only thing that has to happen in Builder

What you built with “What should we build?” might live in **Projects** (code) or **Content** (visual pages). Our app only uses **Content** — a Page that has a URL.

Do this **once** in Builder.io:

1. **Switch to Content/Pages**
   - In the Builder.io dashboard, open **Content** or **Pages** in the left sidebar (not “Projects”).
   - If you don’t see it: look for “Content”, “Visual CMS”, or “Pages” in the main nav or sidebar.

2. **Create or open the profile page**
   - If Builder created a **Page** from your prompt: open that page.
   - If it only created a **Project** (React/Vite repo): in Content/Pages click **New** → **Page** and build (or copy) the layout there.

3. **Set the URL**
   - In the page settings, set **URL** to exactly:  
     **`/dashboard/profile`**  
   - Save.

4. **Publish**
   - Click **Publish** so the page is live.

After that, your site’s `/dashboard/profile` will **automatically** show whatever is published at that URL in Builder. No copying code, no “runaround” — it’s all via the API.

## Summary

| Question | Answer |
|----------|--------|
| Do I copy code from Builder into my app? | **No.** The app fetches the page from Builder by URL. |
| Do I need to “connect” Builder again? | **No.** The API key in `.env.local` is the connection. |
| What do I do in Builder? | In **Content → Pages**, have one Page with URL **`/dashboard/profile`** and **Publish** it. |
| Where do I edit the design later? | In Builder.io (Content/Pages). Changes go live after you Publish; the app keeps fetching the same URL. |

If the design you want is currently in a Builder **Project** (generated code) instead of a **Page** (Content), you have two options: recreate that layout as a **Page** in Content/Pages, or paste the structure into a new Page if Builder supports import. The app side needs no changes.
