# Dynamic Recipe Book + Admin CMS

The existing `/recipes` page is hardcoded in `src/data/recipes.ts` (30 Herbalife-protocol recipes, email-gated). I'll keep it working and layer a database + admin editor on top so you can add/edit/delete recipes without touching code, with the URL `/recipes` unchanged.

## What you get

1. **Public page (`/recipes`)** — unchanged URL, same minimalist dark UI, same modal flow. It will load recipes from the database (with the existing 30 as a built-in fallback so nothing breaks if the DB is empty). Mobile-first, fast, infinite-scalable as you add rows.
2. **Admin Recipes tab** — new tab in `/admin/dashboard` called "מתכונים" with:
   - List of all recipes (search + filter by category)
   - "הוסף מתכון" button → form: title, category (breakfast/mains/desserts/shakes), badges, protein, calories, prep minutes, emoji, product handle, ingredients (one per line), steps (one per line), image URL
   - Edit / Delete per row
   - Changes go live on `/recipes` immediately on next page load (or instantly via realtime subscribe)
3. **Image handling** — paste an image URL in the admin form. (Optional later: native upload to storage bucket — say the word and I'll add it.)

## Technical notes

- New table `public.recipes` with columns matching the `Recipe` type (id text PK, title, category, badges text[], protein int, calories int, prep_minutes int, product_handle, product_name, emoji, ingredients text[], steps text[], image_url, sort_order, created_at, updated_at). RLS: public can SELECT; only authenticated admin can INSERT/UPDATE/DELETE.
- Seed the table with the current 30 static recipes via the migration so nothing visually changes on day 1.
- `Recipes.tsx` switches from importing the static array to `supabase.from('recipes').select()`, with the static array as fallback if the query fails or returns empty.
- New admin component `src/components/admin/AdminRecipes.tsx` mounted as a new tab in `AdminDashboard.tsx`.
- Keep the email-gate (`gfp_unlocked`) and the `?recipe=<id>` deep-link behavior intact.

Reply "go" and I'll ship it.