# JoseWebsite2 Build Plan

## Guiding Goals
- Deliver an immersive artist hub that highlights José’s music catalog, visuals, testimonies, and upcoming content.
- Keep the site performant on mobile, with smooth motion and accessible controls.
- Maintain a simple editorial workflow (MDX + Contentlayer) so new releases and updates stay fresh.

## Milestones & Focus Areas

### 1. MVP Homepage Polish (Target: Week 1)
- Replace placeholder assets with final artwork/video stills (`public/media/releases`, `public/images`).
- Confirm remote Supabase URLs are accessible or swap to local optimized files.
- Finalize hero copy and scripture treatment; ensure text contrast passes WCAG.
- Flesh out newsletter form (integrate Resend or Mailchimp) or hide until ready.
- Run automated lint/type checks and address unused imports (`app/page.tsx`).

### 2. Music Catalog Build-out (Target: Week 2)
- Create dedicated `app/music/page.tsx` with release grid, filters, and play actions.
- Implement dynamic release pages under `app/release/[slug]/page.tsx` rendering MDX details, credits, embeds, and LyricsDrawer.
- Populate track `audioSrc` fields or design preview gating in `content/releases/*.mdx`.
- Expand SongWheel to optionally filter by release type and handle long catalogs.
- Hook AudioProvider into catalog pages (play buttons enqueue tracks with cover art).

### 3. Video & Media Experiences (Target: Week 3)
- Add `app/videos/page.tsx` showcasing `Video` contentlayer entries (grid + modal player).
- Introduce carousel or hero highlight for featured video series.
- Audit embed performance; consider click-to-play placeholder for heavy iframes.
- Ensure social sharing metadata (Open Graph, Twitter) uses video thumbnails.

### 4. Community & Contact Surfaces (Target: Week 3)
- Build `app/contact/page.tsx` with booking form (Zod validation, Resend email handler).
- Craft `app/links/page.tsx` as a Link-in-bio style hub for social platforms.
- Add newsletter integration to footer or dedicated CTA component.
- Document any environment variables required for email services.

### 5. Launch Readiness & QA (Target: Week 4)
- Populate `data/embeds` with final Spotify/Apple IDs; remove placeholder notes.
- Configure Contentlayer for incremental updates (Netlify/Vercel build hooks).
- Write Playwright smoke tests for key flows (home scroll, music playback, contact form submission).
- Optimize images via Next.js Image or external tooling; verify Lighthouse scores (mobile ≥ 85).
- Prepare Netlify deployment (`netlify.toml`) and confirm preview/production flows.

## Supporting Tasks & Decisions
- Consolidate repo structure (either move app to root or remove duplicated scaffold).
- Define design tokens (colors/spacing) in Tailwind for future consistency.
- Establish content governance: checklist for new release MDX (cover, platforms, credits, lyrics).
- Create fallback messaging for missing audio/video assets.
- Track progress in issues or TODO comments removed prior to launch.

## Dependencies & Open Questions
- Where should final media live (Supabase vs. local)? Decide to avoid mixed sources.
- Email/newsletter provider confirmed? Needed for forms.
- Any merch/store integration planned? Reserve routing if so.
- Define owner for ongoing content updates (artist vs. manager) and access needs.

## Next Steps
1. Approve milestone targets and adjust timelines to match team availability.
2. Resolve repo structure decision before adding new routes.
3. Begin Milestone 1 tasks, starting with asset collection and lint cleanup.
