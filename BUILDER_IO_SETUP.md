# Builder.io setup — get to the point where we can build the profile page

Follow these steps in order. When you’re done, you’ll have Builder.io connected and I can wire the caddie profile page to it.

---

## Step 1: Create a Builder.io account

1. Go to **https://builder.io/signup**
2. Sign up (email or Google/GitHub).
3. Confirm your email if prompted.

---

## Step 2: Get your Public API key

1. Log in at **https://builder.io**
2. Open your **Space** (you’ll be in a default space after signup).
3. **Option A:** Press **`Cmd + K`** (Mac) or **`Ctrl + K`** (Windows), type **`API`**, and copy the **Public API Key** shown.
4. **Option B:** Go to **Account Settings** for the Space: click your space name or avatar → **Space Settings** (or go to **https://builder.io/account/space**). Copy the **Public API Key** from that page.

Save this key somewhere safe (you’ll add it to `.env.local` in Step 5).

---

## Step 3: Create the profile page in Builder

1. In Builder.io, go to **Content** (or **Pages**).
2. Click **Create new** (or **New Page**).
3. Choose the **Page** model (default page type).
4. Set the **URL** for this page to exactly:
   ```text
   /dashboard/profile
   ```
   This must match so our app can load this page when users visit `/dashboard/profile`.
5. **Name** the page something like: `Caddie Profile` (for your reference).
6. Start designing the layout in the visual editor:
   - Add a **Hero** or **Section** at the top (for cover/avatar area).
   - Add **Text** blocks for name, location, bio, experience.
   - Add an **Image** (or block) for the profile photo.
   - Add a **Section** or list for reviews.

**Optional — use dynamic data:**  
In the right-hand panel, when you select a **Text** (or Image) block, you can bind its value to **State**. For example:

- Text for name → bind to: **`state.profile.displayName`**
- Text for location → **`state.profile.locationLine`**
- Text for bio → **`state.profile.bio`**
- Image URL → **`state.profile.avatarUrl`**
- For a list of reviews → we can use a **Custom Component** or you leave a placeholder section; I’ll wire the reviews list in code.

If you’re not sure about bindings, you can leave placeholders (e.g. “Name”, “Bio”); I’ll still pass the real data and we can refine bindings after.

7. **Publish** the page (publish button so it’s live and fetchable).

---

## Step 4: Note your model name

- The model you used is almost certainly **`page`** (Builder’s default).
- If you created a **custom model** for profiles, note its **model id/name** (e.g. `profile-page`).  
- You’ll send me this in Step 6 so I use the correct model when fetching.

---

## Step 5: Add the API key to your project

1. Open your project’s **`.env.local`** (in the `fairway-standard` folder).
2. Add this line (replace with your real key):

```env
NEXT_PUBLIC_BUILDER_API_KEY=your_actual_public_api_key_here
```

3. Save the file.  
4. Restart the dev server if it’s running (`npm run dev`).

---

## Step 6: Send me these three things

Reply with:

1. **Confirmation:** “API key is in `.env.local`” (you don’t need to paste the key).
2. **Page URL in Builder:** The exact URL you set for the profile page (should be **`/dashboard/profile`**).
3. **Model name:** The Builder model you used (almost always **`page`**), or the custom model name if different.

Example reply:

```text
API key is in .env.local. Page URL is /dashboard/profile. Model is page.
```

---

## What I’ll do next

Once you’ve done the above, I will:

1. Add the Builder.io SDK (`@builder.io/sdk-react`) to the project.
2. In the app’s `/dashboard/profile` route, fetch the Builder page that matches that URL.
3. Load your Supabase caddie data + Clerk user + reviews.
4. Render the Builder page and pass that data as **`data`** (so it’s available as **`state.profile`**, **`state.reviews`**, etc. in Builder).
5. Register any custom components we need (e.g. a Reviews list) so your design can use them.

After that, you can keep editing the layout and copy in Builder.io and the profile page will stay wired to real caddie data.
