# Computer Science

Four client-side guided lessons share Medicine's illustrated room, teal frame, dark dialogue, and cream controls. The department keeps its own components and scoped styles, while preserving the existing lesson content and routes. Medicine and Law provide visual and organizational references; neither department needs edits for a Computer Science change.

## File responsibilities

| File or directory | Responsibility |
| --- | --- |
| `major.ts` | Major metadata and ordered field registration for the exploration entry point. |
| `lesson-types.ts` | Track identifiers and shared lesson/step contracts, including room setting metadata. |
| `lessons.ts` | Typed lesson registry; imports content from each field. |
| `<field>/field.ts` | Exploration preview metadata, image, accessible description, and route. |
| `<field>/lesson.ts` | Instructor, dialogue, project brief, steps, hints, examples, and room setting. |
| `<field>/page.tsx` | Route metadata and entry into `LearningLab` with the track identifier. |
| `<field>/*Lab.tsx` | Field-owned workspace, project state, real validation, and interactive output. |
| `components/LearningLab.tsx` | Workspace registry, intro dialogue, classroom/workbench transition, restart confirmation, and field navigation. |
| `components/SimulationFrame.tsx` | Shared frame chrome and two-stage progress. |
| `components/LabScene.tsx` | Field-specific illustrated room and full instructor placement. |
| `components/Instructor.tsx` | Authored SVG cast, portraits, and feedback expressions. |
| `components/LessonUI.tsx` | Header, guide, review/progression state, and completion UI. Editing changes the review signature and invalidates completion. |
| `computer-science.css` | Department styles, responsive layouts, focus treatment, and reduced-motion rules. |
| `software/components/` | Preserved legacy coding, logic-flow, and database simulations plus their diorama. |
| `software/lib/sound-effects.ts` | Legacy simulation audio utilities. |

The PNG/JPEG reference files in this directory are existing visual references. New room and instructor artwork is authored in SVG within the components.

## Preserved routes

The main lessons remain at `/computer-science/software`, `/computer-science/embedded-system`, `/computer-science/networking`, and `/computer-science/multimedia`.

Legacy Software routes remain at `/computer-science/software/simulation/coding`, `/computer-science/software/simulation/logic-flow`, and `/computer-science/software/simulation/database`. Their pages import the relocated legacy components.

## Add a field

1. Create a field directory with `field.ts`, `lesson.ts`, `page.tsx`, and a workspace component. Follow an existing field's typed exports and thin route page.
2. Extend `Track` in `lesson-types.ts`; register its lesson in `lessons.ts`, preview in `major.ts`, and workspace in `components/LearningLab.tsx`.
3. Add the room and instructor variant in `LabScene.tsx` and `Instructor.tsx`. Reuse the existing frame, guide, CSS scope, keyboard focus behavior, and reduced-motion rules.
4. Use `useProgress`, `Guide`, and the completion UI from `LessonUI.tsx`. Include every meaningful project edit in the review signature, validate the actual project before unlocking progression, and preserve reset behavior.
5. Extend both browser scripts to cover the new field's introduction, invalid and valid work, completion, and responsive layout. Update the surface brief with validation evidence.

## Validation

Run these from the repository root in PowerShell:

```powershell
npm.cmd run build
npx.cmd tsc --noEmit
npx.cmd eslint "app/computer-science/components/**/*.{ts,tsx}" "app/computer-science/*/*.{ts,tsx}" app/computer-science/major.ts app/computer-science/lessons.ts app/computer-science/lesson-types.ts scripts/test-learning-labs.cjs scripts/test-cs-frame.cjs
```

Start the production server in a separate terminal after building:

```powershell
npm.cmd run start
```

The browser scripts require an installed `@playwright/test` package and Chrome. They default to `http://localhost:3000`. If Playwright is installed outside this project, set `PLAYWRIGHT_MODULE` to that package's resolvable module name or local package directory. Set `LAB_TEST_URL` when testing another server:

```powershell
# Optional overrides; omit when the defaults work.
$env:PLAYWRIGHT_MODULE = '@playwright/test'
$env:LAB_TEST_URL = 'http://localhost:3000'
node scripts/test-learning-labs.cjs
node scripts/test-cs-frame.cjs
```

The learning-labs script completes all four projects, checks review gates and invalidation, and captures desktop/mobile workspaces. The frame script checks containment at 1440/390/320px, keyboard dialogue, focus, restart/cancel, expressions, reduced motion, and preserved legacy/Medicine/Law routes. Screenshots are written to `.impeccable/review/computer-science`.

Build, TypeScript, scoped lint, and both browser scripts passed for this adaptation. `npx.cmd eslint app/computer-science` also includes legacy code and currently reports the pre-existing `react-hooks/set-state-in-effect` finding at `software/components/CodingSimulation.tsx:216`. Finish review found no material blockers; mobile workspaces remain long and can receive optional layout polish.
