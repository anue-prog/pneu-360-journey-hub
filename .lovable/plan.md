

# Editorial Redesign — "Typographic Prestige"

## Vision

Transform the site from a clean corporate look into a bold **editorial magazine** aesthetic. Think Kinfolk meets automotive luxury: massive display typography (Anton for headlines), refined body text (Inter), dramatic image-text compositions, and deliberate asymmetry within a symmetric grid. Every section should feel like a spread in a high-end print magazine.

## Key Design Changes

### 1. Typography Overhaul

**Font swap**: Replace Inter headings with **Anton** (Google Fonts) — a condensed, all-caps display face that screams editorial authority. Inter stays for body and labels.

- `index.css`: Add Anton via Google Fonts import
- `.text-brand-heading`: Switch to `font-family: 'Anton'`, increase size to `clamp(56px, 10vw, 140px)`, set `font-weight: 400` (Anton only has 400), `letter-spacing: -0.02em`, `text-transform: uppercase`
- Body text (`text-brand-body`): Bump to `18px`, `font-weight: 300`, `line-height: 1.85` for luxurious readability
- Labels (`text-brand-label`): Keep `Inter`, refine to `11px`, `600 weight`, `4px tracking`

### 2. Hero — Full Editorial Impact

- Headline: Switch to Anton, scale up dramatically (`clamp(60px, 14vw, 160px)`)
- Split the headline into a stacked, left-aligned composition with massive leading
- Add a subtle editorial detail: a thin horizontal rule between the light and bold lines
- Keep the Ken-Burns image entry and parallax — they already feel editorial

### 3. Homepage Sections — Magazine Spread Layout

**ServicesFullscreen, ReifenFullscreen, FelgenFullscreen:**
- Increase image aspect ratios to `3/4` (portrait) or `16/10` for more visual drama
- Make headings span the full width above the grid (not beside the image)
- Add large decorative section numbers in Anton (`text-[clamp(80px,15vw,200px)]`, `opacity-[0.06]`) positioned behind headings
- Service list items: increase padding, add subtle hover background shift

**UeberUns:**
- Stats numbers: switch to Anton for maximum impact
- Add a full-bleed atmospheric image between the text and stats (using `team-pneu360.webp` or `perry-center-aerial.png`)

**ProcessSection:**
- Step numbers: massive Anton numerals (`clamp(100px, 20vw, 240px)`) with very low opacity as background elements
- Cards: remove borders, use negative space and a single accent line instead

**ReviewsSection:**
- Quote text: larger (`clamp(22px, 3vw, 36px)`), with Anton for the reviewer name
- Add oversized quotation mark as a decorative element

**LocationsTeaser:**
- Full-width image strip above the text content
- Location names in Anton

### 4. Marquee

- Increase vertical padding for breathing room
- Slightly larger logos with more gap

### 5. Section Rhythm & Spacing

- Increase vertical section padding: `py-32 md:py-44 lg:py-56`
- Add full-bleed image dividers between some sections (using existing assets like `hero-road-dusk.webp`, `home-felge-detail.jpg`)
- These are simple `<div>` elements with a parallax background image, no text — pure visual breathing

### 6. SectionHeading Component

- Switch to Anton
- Remove the number from the flex layout, make it an absolutely positioned background element
- Increase heading size

### 7. Navbar & Footer

- Navbar: Keep current structure, but switch the "Anfrage" CTA button font to Anton for contrast
- Footer: Make the logo claim larger, increase spacing between grid columns

### 8. Global CSS Refinements

- `index.css`: Add Anton import, update `.text-brand-heading` and new utility `.text-editorial-display` for oversized decorative type
- Add a new utility `.text-editorial-number` for giant background numerals
- `tailwind.config.ts`: Add `'Anton'` to a new `fontFamily.display` entry

## Files to Modify

| File | Change |
|------|--------|
| `src/index.css` | Add Anton font, update typography utilities |
| `tailwind.config.ts` | Add `display` font family |
| `src/components/home/Hero.tsx` | Anton headline, bigger scale, editorial layout |
| `src/components/home/ServicesFullscreen.tsx` | Full-width heading, portrait image, bg numbers |
| `src/components/home/ReifenFullscreen.tsx` | Same editorial treatment |
| `src/components/home/FelgenFullscreen.tsx` | Same editorial treatment |
| `src/components/home/UeberUns.tsx` | Anton stats, full-bleed image insert |
| `src/components/home/ProcessSection.tsx` | Giant bg numbers, borderless cards |
| `src/components/home/ReviewsSection.tsx` | Larger quotes, decorative quotation mark |
| `src/components/home/LocationsTeaser.tsx` | Full-width image, Anton location names |
| `src/components/home/Marquee.tsx` | More breathing room |
| `src/components/shared/SectionHeading.tsx` | Anton, bg number positioning |
| `src/pages/Index.tsx` | Add image divider sections between content blocks |
| `src/components/home/animations.ts` | Slightly slower, more dramatic timing |

## What Stays

- Color palette (black + gold accent)
- Framer Motion animation system (just tuned)
- All existing functionality (configurators, wait times, reviews)
- Navbar/footer structure
- Mobile responsiveness

