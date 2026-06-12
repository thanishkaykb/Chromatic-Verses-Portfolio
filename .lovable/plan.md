
# Thanishka Yogesh — Chromatic Verses: full rebuild

Massive scope, broken into 8 work blocks. I'll execute top-to-bottom in one go after approval.

## 1. Visual overhaul (kill the "cockroach leaves")
- Upload your 6 watercolor flower references (sunflower, red peonies, bougainvillea, golden shower, pink rose, lilac) as CDN assets.
- Replace every hand-drawn SVG `<Leaf/>` `<Floral/>` decoration with floating watercolor flower PNGs (transparent, soft drift animation).
- Add a paper/watercolor wash background so no section is blank.
- Pull `<Sparkle/>` out of being a pixel star — make it a tiny watercolor petal.

## 2. Cover / header fixes
- Headline: **"Thanishka Yogesh — Chromatic Verses"** (full name everywhere, no more bare "Thanishka").
- Volume strip: **"Vol. 24 · Oct"**.
- Fix the clipped "G" by reducing the `clamp()` cap and tightening tracking so the full name fits.
- Replace the blue-dress portrait with your **painting-photo.jpeg** (the one of you painting trees).
- Remove the duplicate "Write to me" CTA that sits below "Wander the gallery" (keep just gallery + poetry; contact lives in its own section).
- Add a tiny, low-contrast **admin entry link in the footer** (below the "Wander" CTA area, in the colophon footer) — labeled "·" or "studio" so visitors don't notice but you know where it is.

## 3. Content rewrite from your docs
- Homepage hero copy, "Featured in" ribbon, welcome paragraph, personal statement, quotes — all replaced with the exact text from `Homepage_Content-2.docx`.
- About page rewritten verbatim from `Homepage_Content.docx` (About Me + Personal Statement + creative philosophy).
- "A few things about me" → cards instead of the childish emoji grid in your screenshot. Painted watercolor icons in muted tones, serif italic labels, soft cream cards on a watercolor wash.
- Contact: phone, email, Instagram (fix link to `https://www.instagram.com/art_by_thanishka`), PoetrySoup, LinkedIn, GitHub.

## 4. Artworks — exhibition-style gallery
- Masonry layout (like your reference template): tightly packed, varied tile sizes, breathing room around each.
- Click any artwork → full-screen lightbox with: large image, title, medium, year, description, prev/next arrows, keyboard ←/→/Esc, swipe on mobile.
- Counter "12 / 55" so it feels like a curated exhibition.

## 5. Poetry — book with page flips
- Cover page → Index page (clickable poem titles + page numbers) → poem pages.
- Realistic page-flip animation (CSS 3D transform, hinged in the middle).
- Short poem → renders on the right page only (left shows decorative watercolor + page number).
- Long poem → auto-split across left + right facing pages.
- Aged-paper texture, deckled edges, subtle floral border print on every page.
- Keyboard ←/→ to flip; "Back to index" pill always visible.

## 6. Admin portal — full CRUD with drag-drop
Single `/studio` route (renamed from `/admin` for obscurity), gated by your email + admin role. Tabs:
- **Hero/About/Contact** — inline text editing of all site copy (stored in existing `site_content` table).
- **Artworks** — multi-file drop-upload, edit title/medium/year/description/category, drag-to-reorder, delete.
- **Poetry** — title, body (multi-paragraph), category, written date, drag-reorder, delete.
- **Publications** — title, publication name, date, **link URL**, cover image, drag-reorder, delete.
- **Scrapbook polaroids** — click photo to swap, click caption to edit inline, drag-reorder, delete.
- **Messages inbox** — read letters from the contact form, mark as read.

Drag-and-drop via `@dnd-kit`. Multi-upload via drop zone.

## 7. Auth — Google + email, restricted to you
- Enable Google OAuth (Lovable Cloud managed — no setup needed from you).
- Email/password as fallback.
- First account to sign up with email **thanishka.ykb@gmail.com** auto-gets admin role (DB trigger). Anyone else who finds `/studio` gets a "not authorized" wall.

## 8. Contact form → your inbox
- Letter form on contact page writes to `contact_messages` (already exists) AND triggers a server route that emails **thanishka.ykb@gmail.com** via the Resend connector (built into Lovable Cloud — I'll wire it up).
- You also see all letters in the Messages tab of `/studio`.

## Technical notes
- New deps: `@dnd-kit/core`, `@dnd-kit/sortable`, `react-pageflip` (for the book).
- New tables: none — extend existing ones (`publications` already has `file_url`; will reuse as link).
- One migration: add `link_url` to `publications`, add `signup` trigger to auto-promote your email to admin.
- New edge route: `/api/contact-notify` to send the email.

## What I will NOT do this round (to keep it shippable)
- Custom domain / Vercel deploy steps (project already deploys via Lovable's publish button — same URL).
- AI-generated artwork. All decorative flowers come from your uploads.

Approve and I'll ship it end-to-end.
