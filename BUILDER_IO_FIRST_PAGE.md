# Create your first profile page in Builder.io

Your app is already wired to Builder: when a page exists at URL **`/dashboard/profile`**, it will render here with your real caddie data. Until you create that page, the app shows the fallback profile layout.

## Steps in Builder.io

1. **Open the visual editor**
   - Go to [builder.io](https://builder.io) and log in.
   - You may land on "Projects" or "Content". Look for **Content** or **Pages** in the left sidebar (or top nav).

2. **Create a new page**
   - Click **"Create new"** or **"New"** → choose **Page** (the default page model).
   - When asked for a **URL**, enter exactly:
     ```
     /dashboard/profile
     ```
   - Save / name the page (e.g. "Caddie Profile") and click **Publish** when you’re done designing.

3. **Design the layout**
   - Drag and drop sections: **Section**, **Text**, **Image**, **Columns**, etc.
   - To show **live data** from the app, bind elements to **State** in the right panel:
     - **Name** → `state.profile.displayName`
     - **Location** (hometown · home course) → `state.profile.locationLine`
     - **Bio** → `state.profile.bio`
     - **Profile image** → set Image URL to `state.profile.avatarUrl`
     - **Experience** → `state.profile.yearsExperience` (number)
     - **Role** → `state.profile.roleLabel`
     - **Reviews** → use `state.reviews` (array) in a repeated block or custom component when you’re ready.

4. **Publish**
   - Click **Publish** so the page is live. The app will fetch it and render it at `/dashboard/profile` with your caddie data.

## Data available in Builder (state)

Your app passes this into Builder so you can bind it in the editor:

- **`state.profile`**  
  `displayName`, `locationLine`, `avatarUrl`, `clerkInitials`, `bio`, `yearsExperience`, `roleLabel`, `verified`, `subscriptionStatus`, `isCaddie`, `phone`, `email`
- **`state.reviews`**  
  Array of `{ id, reviewer_name, rating, comment, created_at }`
- **`state.reviewCount`**  
  Number of reviews
- **`state.averageRating`**  
  Average rating (number or null)
- **`state.userId`**  
  Clerk user ID (for links)

After you create and publish the page at **`/dashboard/profile`**, reload your app’s profile tab to see the Builder-designed layout with real data.
