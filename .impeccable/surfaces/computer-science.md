# Computer Science simulations

Audience: students exploring four Computer Science fields. Mode: Operate. All visible copy is English. User-pinned references: `app/computer-science/simulation-style-reference.jpeg` for scene style and `networking-simulation-reference.png` for networking workspace organization.

## Direction contract

THESIS: enter a believable classroom, hear the day's brief, then learn by making something in a real interactive workspace.

OWN-WORLD: inherit Manrope, studio green, warm paper, pastel fills, soft corners and fine borders. High-angle, warmly lit classroom and laboratory illustrations follow the supplied scene reference. Dark code and topology areas distinguish technical work from the light teaching guide.

STORY: a lecturer or lab assistant introduces one small project. Students perform each step, review their work, and unlock the next. Earlier instructions remain accessible. Completion reflects validated work.

FIRST VIEWPORT: a compact track header above a large classroom scene, with a readable dialogue panel alongside and one start action. The workspace places the guide left, the main editor or workbench center, and preview or status right; small screens stack these areas without hiding controls.

FORM: user-specified classrooms and three-panel tools; code-led extension of the established system. No concept seed applies to this pinned layout. Signature interaction: visibly transform the student's actions into a website, illuminated LED, traveling network packet, or promotion poster.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Shipped implementation

The four routes `/computer-science/software`, `/computer-science/embedded-system`, `/computer-science/networking`, and `/computer-science/multimedia` share `app/components/learning-lab`. English instructor dialogue leads into guided, reviewed steps. Software combines an HTML/CSS editor with a sandboxed live preview; Embedded System models component placement, terminal wiring, and a hold-to-light LED button; Networking models device links, IP configuration, ping errors, and animated packets; Multimedia supports drag/drop or button placement, keyboard positioning, image adjustment sliders, and poster download. Completion is validated locally; changing reviewed work invalidates completion. Legacy Software subroutes remain present. No backend, real network traffic, or AI insights are supplied.

The extension preserves the incumbent Manrope/Geist Mono pairing, studio-green actions, warm paper, fine borders, and softly rounded panels. Larger lesson copy, a three-column desktop workbench, stacked small-screen controls, and dark technical work areas serve this surface rather than redefining the global design system. Visible focus, labeled controls, live feedback, alternative placement controls, and reduced-motion handling are implemented.

Verification reported by the implementation pass: production build, TypeScript, target ESLint, and `scripts/test-learning-labs.cjs` passed. Browser coverage includes all four complete lessons, keyboard operation, review invalidation, downloads, LED errors, and ping errors. Twelve desktop/mobile captures are retained in `.impeccable/review/computer-science`.

Shipping scene assets are `public/simulations/scenes/classroom.png` and `electronics-lab.png`. Both contain embedded generation prompts; the provenance scan found two rasters and zero missing prompts. Exact prompt text is also retained under `.impeccable/assets/`.

Existing documentation drift: root `DESIGN.md` still describes tasks globally as decorative previews and records exploration-specific sizes and patterns. Its palette and reusable visual rules remain incumbent authority. This ordinary extension preserves `DESIGN.md` and `.impeccable/design.json`; their stale product claims are reported rather than promoted into new rules or repaired here.
