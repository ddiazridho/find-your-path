# Computer Science simulations

Audience: students exploring four Computer Science fields. Mode: Operate. The current user brief pins Medicine as the visual and interaction reference and Law as an architectural reference, superseding the earlier classroom/sidebar composition.

## Direction contract

THESIS: meet a real instructor in an illustrated lab, then learn by making; the room, narration, dialogue, and controls belong to one simulation frame.

OWN-WORLD: inherit Medicine's sage rooms, teal frame bars, dark readable dialogue, cream controls, and flat illustrated characters. Retain Manrope and Geist Mono for code. Authored SVG keeps the cast lightweight and adaptable.

STORY: each instructor presents the existing three-part project brief. The student enters a workbench, reviews real work, and unlocks each next step. Feedback changes the instructor's expression; editing still invalidates review and completion.

FIRST VIEWPORT: a compact track header and project title above one wide frame. The room and instructor occupy its upper region; narration, full dialogue, and Continue share its lower region. Mobile stacks content inside the same border.

FORM: code-led adaptation of the user-pinned Medicine frame; no concept seed applies. During exercises, tools precede an instructor guide and review controls within the frame. The signature interaction remains the working website, lit LED, successful packet, or downloadable poster.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Architecture

Department-owned shared frame, scene, instructor, and guide live in app/computer-science/components. Lessons, field metadata, and workspaces are colocated per field; computer-science.css owns scoped styles. Legacy Software exercises live in software/components with audio utilities in software/lib. Existing routes remain intact. Medicine and Law are not modified.

## Validation

Production build and TypeScript checks pass. ESLint passes for the redesigned sources and browser scripts; department-wide lint retains the pre-existing `react-hooks/set-state-in-effect` finding in unchanged legacy `software/components/CodingSimulation.tsx:216`.

Both `scripts/test-learning-labs.cjs` and `scripts/test-cs-frame.cjs` pass. Checks cover all four projects, review gates and completion invalidation, dialogue keyboard navigation, focus, restart/cancel, instructor expressions, reduced motion, frame containment and overflow at 1440/390/320px, and legacy/Medicine/Law route smoke checks. Production captures in `.impeccable/review/computer-science` record 1440/390px introductions and desktop/mobile active workspaces. Finish reviewers recommend shipping with no material blockers; long mobile workspaces are optional layout polish.

Content comparison confirms four lessons unchanged except added setting metadata, five legacy files unchanged except relative imports, and no Medicine/Law modifications. The extension inherits Medicine's frame language and the existing field-owned department structure. All new illustration is code-native SVG; no new raster assets or dependencies were added.

Root `DESIGN.md`, `.impeccable/design.json`, and `PRODUCT.md` remain unchanged. Pre-existing drift remains: the root design documentation primarily describes homepage primitives and decorative previews rather than every working department simulation. This task records its surface-specific extension here without replacing the global design system. See `app/computer-science/README.md` for responsibilities, preserved routes, and reproducible checks.
