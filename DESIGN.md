# Find Your Path design system

## Direction
Inspired by the 16Personalities homepage at the project owner's request: reassuring, open, colorful, and easy to read. Preserve Find Your Path's identity, content, and working simulations. The reference informs palette, generous spacing, a centered welcome, and rounded actions.

## Palette
Shared tokens live in app/globals.css. Paper and surfaces: #ffffff. Ink: #343c4b. Supporting text: #51596a. Primary purple: #88619a; hover: #704b82. Lines: #e3e5e9. Secondary surfaces: #f6f6f7. Sky: #eaf3f6. Mint: #dcefe7. Peach: #f8ecd5. Lilac: #eee6f2. Rose: #f4e5ed. Sand: #f4efd9. Teal links: #00759c. Green accent: #287956. Gold text: #8a651d.

## Typography and composition
Manrope is the shared face; Geist Mono is reserved for code. Balanced headings, comfortable line height, and generous whitespace. Desktop hero headings reach 64px, hero copy 18px, and card copy 14px. The homepage has a centered welcome on pale blue followed by a white Explore section. Reuse the authored task illustrations. Three cards per row on desktop, two on tablet, one on mobile.

## Components

The root layout renders one shared footer on every route except /quiz; /quiz/results retains it. It includes the left-aligned reassurance "You're exploring, not committing." without an icon, supporting copy, and the brand/link row. Every route with a footer shows an angular transition above it, colored to match the preceding content: white for Home, pale gray for Find University, and sky for other pages. Home and other routes use a pale gray footer; Find University uses white. Quiz results include one feedback card below the exploration actions and above the footer, with satisfaction radios, a topic selector, an optional message, and explicit sending, success, and retry states.
Primary buttons and category filters use pill shapes and purple selected states. Secondary text links are teal. Major cards have a 12px radius, fine neutral borders, pastel illustration fields, and white bodies; elevation appears on hover. Skill tags are neutral pills. Explore cards do not show estimated time.

Every route uses one fixed white navbar from the root layout, with a subtle lower shadow and the supplied FYP logo aligned to the shared container. Heights are 72px on desktop, 64px on tablet, and 60px on mobile; the body reserves the same space. Routes outside the homepage show a bordered back arrow before the logo within the same margins. Results return to the quiz, legacy software simulations return to the software lesson, and major simulations return to Explore. Every route begins with a separate angular divider below the navbar and a pale blue opening area. Quiz answers use purple selection and pastel surfaces. University form fields use neutral borders and purple focus. Simulation environments retain colors that explain their scenes and states.

The navbar includes a right-aligned language button with a Languages icon. Indonesian is the default; the button names the destination language (English or Bahasa Indonesia). The preference persists across routes and reloads without resetting answers, projects, or story progress. Authored text, accessibility labels, SVG artwork, downloads, and AI explanations follow the selected language; user entries, code syntax, official names, and canonical simulation values remain intact. Longer Indonesian board lettering uses a smaller display size to fit the existing illustrated card.

## Interaction

Find University reuses the angular section transitions: pale blue introduction into the pale gray form and results area, then pale gray into the white footer. The lower transition follows the results when they are displayed. Straight section and footer borders are omitted on this route.

The homepage uses full-width angular transitions from the sky hero to the white Explore section and from Explore to the pale gray footer area. Each downward shape uses the preceding section's color, scales from 32px to 80px tall, and is decorative. The footer area includes the closing reassurance and footer links; the Explore section has no straight border at these transitions.
Simulation interface colors are shared in `app/simulation-theme.css`, imported by the root layout. Scope text, background, and button colors to named panels and controls. Preserve illustrated rooms, characters, props, charts, SVG fills, animation keyframes, and scene palette variables. Legacy Software screens opt in through `legacy-simulation`; their animated flow is excluded with `simulation-artwork`. Do not use unscoped descendant recoloring on simulation scenes.

Preserve routes, product copy, search, filters, native dialog behavior, Escape dismissal, scroll locking, labels, visible keyboard focus, and reduced-motion support. Theme selection, caret, focus outlines, and scrollbars consistently. Color must not be the only indicator of selection or status. Do not invent assessment claims or outcomes.
