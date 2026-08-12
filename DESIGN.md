---
name: Banya Labs
description: A Southern African AI studio portfolio — warm cream pages, ink-precise type, amber marginalia, evidence first.
colors:
  warm-cream: "oklch(0.97 0.012 88)"
  near-black: "oklch(0.12 0.005 90)"
  card-surface: "oklch(0.94 0.012 88)"
  surface-raised: "oklch(0.94 0.012 88)"
  brand-amber: "oklch(0.68 0.18 55)"
  subtle-border: "oklch(0.85 0.012 88)"
  ink-dim: "oklch(0.45 0.01 88)"
  midnight-base: "#0a0a0a"
  dark-card: "#161616"
typography:
  display:
    fontFamily: "'Playfair Display', Georgia, serif"
    fontSize: "clamp(2.5rem, 6vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "'Playfair Display', Georgia, serif"
    fontSize: "clamp(1.75rem, 4vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  title:
    fontFamily: "'Inter', sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "'Inter', sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "'JetBrains Mono', 'Courier New', monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.04em"
  micro:
    fontFamily: "'JetBrains Mono', 'Courier New', monospace"
    fontSize: "0.625rem"
    fontWeight: 500
    letterSpacing: "0.06em"
rounded:
  none: "0px"
  sm: "4px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "48px"
  section: "80px"
components:
  button-primary:
    backgroundColor: "{colors.near-black}"
    textColor: "{colors.warm-cream}"
    rounded: "{rounded.none}"
    padding: "8px 16px"
    typography: "label"
  button-primary-hover:
    backgroundColor: "transparent"
    textColor: "{colors.near-black}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.near-black}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  card-light:
    backgroundColor: "{colors.warm-cream}"
    rounded: "{rounded.sm}"
    padding: "24px"
  card-dark:
    backgroundColor: "{colors.dark-card}"
    rounded: "{rounded.sm}"
    padding: "24px"
  nav-link:
    textColor: "{colors.ink-dim}"
    typography: "label"
  nav-link-hover:
    textColor: "{colors.brand-amber}"
---

# Design System: Banya Labs

## Overview

**Creative North Star: "The Founder's Ledger"**

Banya Labs is a careful, handwritten account book brought to screen. Warm cream pages hold ink-precise type; amber marks the margin notes — the evidence, the milestones, the things that actually shipped. Nothing is decorated for its own sake. Every element earns its place by doing a job the viewer can name.

The system is dual-tone by design, not by accident. A warm light base — cream, near-black, amber — governs the content sections where information lives. Full-bleed dark bands (`#0a0a0a`, lit by ASCII canvas texture) carve out architectural moments — the hero, the pillars, the roadmap — where the product asserts its identity before the evidence begins. These two registers do not compromise each other; they answer different questions. The light sections say *here is the work*; the dark sections say *here is what we are building toward*.

Density is deliberate: tight groups inside, generous breathing room between. The grid uses `gap-px` separators rather than shadows or color blocks to divide content, reinforcing the ledger metaphor. Motion is sparse — one authored entrance per section, progress bars that animate into view on scroll — so when something moves it carries meaning.

**Key Characteristics:**
- Warm cream (`#F5F0E8 equiv`) base with near-black text and amber as the sole interactive accent
- Playfair Display serif for display authority; JetBrains Mono for metadata precision; Inter for body clarity
- Dual-tone architecture: warm light content + full-bleed dark identity bands (intentional, not a bug)
- Flat surfaces with 1px structural borders — no deep shadows, no gradient fills on content
- Amber appears sparingly: hover states, active indicators, progress fills — never decorative

## Colors

The palette is a ledger's materials: aged cream, dense ink, and a single copper-amber annotation color. One accent. Its rarity is the point.

### Primary
- **Ledger Amber** (`oklch(0.68 0.18 55)` / `#E57A1A` approx): The sole interactive accent. Used on hover states, active timeline nodes, progress bar fills, amber borders on focused cards, and the ring token. Never used as a background fill on large areas.

### Neutral
- **Warm Cream** (`oklch(0.97 0.012 88)` / `#F5F0E8` approx): The main site background. Slightly warm white — not pure, not cold. Forces light-mode identity.
- **Near Black** (`oklch(0.12 0.005 90)` / `#1C1C1A` approx): Primary text, icon fills, primary button background, logo. Near-black with a micro-warm hue — never pure `#000`.
- **Card Surface** (`oklch(0.94 0.012 88)` / `#EDE8DF` approx): Card and container backgrounds in light sections. Slightly darker than the page cream to create tonal layering without shadows.
- **Subtle Border** (`oklch(0.85 0.012 88)` / `#DED9CF` approx): All structural grid lines, card outlines, input borders, and dividers. Used with `gap-px` layouts for hairline grid construction.
- **Ink Dim** (`oklch(0.45 0.01 88)` / `#7A756D` approx): Subtitles, nav links at rest, captions, helper text, secondary metadata. Always within the warm hue family — not neutral gray.

### Dark Band Palette (intentional exceptions)
- **Midnight Base** (`#0a0a0a`): Full-bleed background for identity sections (hero, pillars, roadmap). Not general dark mode — these sections are architectural.
- **Dark Card** (`#161616`): Card surface inside dark band sections. Slightly lighter than midnight to create depth without shadows.
- **Dark Border** (`rgba(255,255,255,0.08)–0.12`): Structural lines inside dark sections. White at low opacity, never gray.

### Named Rules
**The One Amber Rule.** Brand amber appears on ≤10% of any given screen surface. Its rarity is what makes it mean something. A hover state that turns amber is an event, not decoration.

**The Warm-Only Neutral Rule.** All neutral tones carry the same hue family (88° in OKLCH). Never introduce a cool gray or blue-tinted neutral — the ledger's paper is warm, and everything on it stays warm.

## Typography

**Display Font:** Playfair Display (with Georgia, serif fallback)
**Body Font:** Inter (with sans-serif fallback)
**Label/Mono Font:** JetBrains Mono (with Courier New, monospace fallback)

**Character:** The pairing balances editorial authority with operational precision. Playfair earns attention for titles and headlines; JetBrains Mono handles indices, statuses, counts, and metadata as if stamped with a typewriter; Inter carries the body without calling attention to itself.

### Hierarchy
- **Display** (700, clamp 2.5–4rem, lh 1.08, ls –0.02em): Hero headlines, section titles that name the moment. Dark background sections use white; light sections use near-black.
- **Headline** (600, clamp 1.75–2.5rem, lh 1.15, ls –0.015em): Major section headers, pillar labels. Playfair.
- **Title** (600 Inter, 1rem, lh 1.4): Card headings, component labels. Transitions from serif to sans at this scale.
- **Body** (400 Inter, 0.9375rem, lh 1.65): Main descriptive copy. 65–75ch max-width target.
- **Label** (500 JetBrains Mono, 0.75rem, ls 0.04em, uppercase or sentence case): Navigation links, button text, phase numbers, status badges, counters, index numbers. The technical voice.
- **Micro** (500 JetBrains Mono, 0.625rem / 10px, ls 0.06em): Cramped-context labels only — timeline node sub-labels, automation card step counts, footer legal text. Never use at body scale.

### Named Rules
**The Serif-at-Scale Rule.** Playfair Display is used only at headline scale and above (title and up). Body and UI copy belong to Inter or Mono. Mixing serif into body copy breaks the ledger's register.

**The Mono-for-Data Rule.** JetBrains Mono is used for anything that functions as data, code, measurement, or status — not as decoration for a "technical" feel. A section heading that happens to be technical is still a Playfair headline.

## Layout

The grid is built from 1px hairlines, not color blocks. A `max-w-6xl` (1152px) container with `px-6` horizontal padding is the canonical content width across all sections. Section vertical padding is `py-20` (80px) as the baseline, expanding to `py-28` (112px) for major identity sections.

Inside cards and lists, `gap-px bg-border` constructs crisp hairline separators between rows — no margin collapse, no gutter abstraction. Content groups are tight; section separation is generous. More space above a heading than below it.

Dark band sections are full-bleed (`w-full`, no container constraint on the background) but use the same `max-w-6xl` inner container for content. The `border-t border-white/8` rule marks the transition from light to dark sections with a hairline.

Responsive behavior: single-column stacking below `md` (768px); desktop grid layouts activate at `md` and above. Navigation collapses to a slide-down mobile menu at `md`. No horizontal scrolling at any breakpoint.

## Elevation & Depth

This system is **flat with tonal layering**. Shadows do not create depth — color value differences between surfaces do. The card surface (`oklch(0.94)`) is darker than the page background (`oklch(0.97)`) by exactly enough to be perceptible without a shadow.

### Shadow Vocabulary
- **Surface Hover Glow** (`shadow-sm` or `hover:shadow-brand-amber/10`): A whisper of amber-tinted shadow appears on card hover in light sections only. It confirms interaction without lifting the surface. This is the only shadow in the light system.
- **None in dark sections**: Dark band cards use border contrast alone (`border-white/10`, transitioning to `border-brand-amber` on hover). No shadows in dark sections.

### Named Rules
**The Flat-By-Default Rule.** Surfaces sit flat at rest. Shadow appears only in response to hover state and only in light sections. A shadow at rest is decoration; a shadow on hover is information.

**The Border-or-Shadow Rule.** Every surface uses exactly one depth signal: a 1px border or a hover shadow. Never both at rest.

## Shapes

Form language is rectilinear with minimal softening. The base `--radius` is `0.25rem` (4px) — present but imperceptible at small scales, establishing a barely-there rounding that reads as precise rather than hard.

**Corner strategy:** `rounded-sm` (4px) for cards, inputs, and interactive surfaces. `rounded-none` for primary buttons and structural containers. `rounded-full` only for avatar circles, circular icon buttons, and small pill indicators — never for cards or content containers.

**Borders:** 1px solid, always. No 2px accent borders. No colored `border-left` bars. Structural lines use `--border` (subtle warm gray); interactive hover states transition to `--brand-amber`.

**Dark section geometry:** Cards in dark sections use `rounded-sm` matching the light system. The full-bleed section background is square-edged with a hairline top border.

## Components

### Buttons

Buttons are tactile and considered — pressing one feels like it commits to something.

- **Shape:** Square-edged (`rounded-none`) for primary; minimally rounded (`rounded-sm`, 4px) for secondary/ghost
- **Primary:** `bg-near-black text-warm-cream`, font-mono xs uppercase, `px-4 py-2`, 1px border `border-near-black`. Hover: `bg-transparent text-near-black border-near-black` — inverts without color change.
- **Amber CTA (dark sections):** `bg-brand-amber text-near-black`, same mono label treatment
- **Ghost:** `bg-transparent text-foreground`, 1px `border-border`. Hover: `border-foreground`
- **Transitions:** `transition-colors duration-150` — fast, not springy

### Navigation

The navbar is transparent at the top of the page; on scroll it acquires `bg-background/95 backdrop-blur-sm border-b border-border shadow-sm`. This is the only use of backdrop-blur in the system.

- **Logo:** 24px SVG mark + JetBrains Mono wordmark, tracking-tight. Rotates –6° on hover (group-hover `-rotate-6`).
- **Nav links:** font-mono xs, `text-ink-dim`, hover `text-brand-amber`, `transition-colors duration-150`
- **CTA badge:** mono xs, `border-border`, `text-ink-dim`, `rounded-sm`. The "N / 100 apps" counter is a live business signal, not a UI decoration.
- **Mobile:** Slides down with `maxHeight` animation from `0` to `320px`. Links get a right-arrow indicator; closing is instant.

### Cards

Cards sit on the page with quiet weight — no lift, no dramatic hover.

**Light section cards:**
- Background: `bg-background` on `bg-surface-raised` parent
- Border: 1px `border-border`. On hover: `border-brand-amber` transition
- Radius: `rounded-sm` (4px)
- Shadow: `shadow-sm` at rest, `hover:shadow-brand-amber/10` on hover
- Internal padding: `p-5` or `p-6`

**Dark section cards:**
- Background: `bg-[#161616]`
- Border: `border-white/10`. On hover: `border-brand-amber`
- No shadows. Depth comes from border contrast alone.
- Same radius and padding as light cards.

### Progress Bar

The progress bar is a signature component — it is the literal visual representation of the 100 apps mission.

- **Track:** `bg-border rounded-sm h-12` — a flat warm-gray trough
- **Fill:** `bg-brand-amber rounded-sm` — animates from `0%` to target width on intersection, `1.8s cubic-bezier(0.4,0,0.2,1)` easing
- **Behavior:** Width transition starts when the bar enters the viewport (IntersectionObserver, threshold 0.3). One animation, never loops.

### Timeline / Roadmap Nodes

Used in the automation roadmap dark section.

- **Spine:** Horizontal hairline connecting node centers
- **Active node:** Solid `bg-brand-amber` fill, `border-brand-amber` card outline
- **Planned nodes:** `bg-[#161616] border-white/10` — same card treatment as dark section cards
- **Phase number:** font-mono xs, amber text on active, dim white on planned
- **Labels:** Centered headings below the spine

### ASCII Canvas (Signature Component)

The ASCII canvas is the textural signature of the dark identity sections. It renders a monochrome dithered image — Zimbabwe landscape, hourglass — in real-time using canvas and a limited charset (`[' ', '.', 'Å', 'ø', 'å', 'o', 'O', 'Ã', 'ñ', '@']`).

- **Usage:** Hero background (full-bleed), hourglass illustration (right column), dark section backdrops at `opacity-20`
- **Interaction:** Cursor proximity perturbs character brightness in the hero
- **Never use this on light sections.** The ASCII texture belongs to the dark register only.

## Do's and Don'ts

### Do:
- **Do** use Playfair Display for display and headline-level text; switch to Inter at title scale and below.
- **Do** use JetBrains Mono for any text that functions as data, code, measurement, counter, or status — including nav links, button labels, and phase numbers.
- **Do** keep amber constrained to interactive states, active indicators, and progress fills. One amber element per card is already rich.
- **Do** use `gap-px bg-border` hairline grids instead of margin-based separation for list and table structures.
- **Do** let dark band sections be full-bleed; they are identity moments, not content containers.
- **Do** animate progress bars and entrance transitions on intersection, not on page load — motion is earned by attention, not given freely.
- **Do** keep the navbar transparent at rest; the background appears only on scroll.
- **Do** use `border-brand-amber` hover transitions on cards — amber borders on hover are the system's primary interaction signal.

### Don't:
- **Don't** use pure `#000000` black or pure `#FFFFFF` white anywhere. Near-black and warm cream are the poles; the warmth is load-bearing.
- **Don't** introduce deep shadows (`shadow-xl`, `shadow-2xl`). The system is flat; shadows appear only as whispers on hover.
- **Don't** use gradient text. Weight and size carry emphasis; gradient text is costume.
- **Don't** use `rounded-full` on cards, containers, or buttons. Pills are for small controls, avatars, and circular indicators only.
- **Don't** add a second accent color. Amber is the one voice. Introducing blue, green, or teal breaks the ledger.
- **Don't** use the ASCII canvas in light sections. The texture belongs to the dark register; using it on cream backgrounds dissolves the dual-tone contract.
- **Don't** use colored `border-left` bars wider than 1px on cards or callouts. Borders are structural, not decorative.
- **Don't** run Playfair into body copy. The serif earns attention at display scale; at body scale it clogs reading.
- **Don't** put an eyebrow label or kicker above a Playfair headline. The heading carries its own weight.
