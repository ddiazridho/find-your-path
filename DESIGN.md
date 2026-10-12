---
name: Find Your Path
description: An approachable campus creative studio for exploring university majors.
colors:
  paper: "#fbfcf8"
  surface: "#ffffff"
  ink: "#203b31"
  muted: "#627068"
  primary: "#265c45"
  primary-hover: "#184632"
  line: "#e0e6dd"
  section: "#f2f5ee"
  mint: "#d8eadb"
  peach: "#f4dfca"
  lilac: "#e4def4"
  sky: "#dcebf0"
  rose: "#f2dedc"
  sand: "#e9e4d4"
typography:
  display:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(44px, 4.5vw, 64px)"
    fontWeight: 800
    lineHeight: 1.13
    letterSpacing: "-.04em"
  headline:
    fontFamily: "Manrope, sans-serif"
    fontSize: "28px"
    fontWeight: 800
    lineHeight: 1.3
    letterSpacing: "-.035em"
  title:
    fontFamily: "Manrope, sans-serif"
    fontSize: "19px"
    fontWeight: 800
    letterSpacing: "-.6px"
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "12px"
    lineHeight: 1.8
  label:
    fontFamily: "Manrope, sans-serif"
    fontSize: "10px"
    fontWeight: 600
  code:
    fontFamily: "Geist Mono, monospace"
    fontSize: "9px"
    lineHeight: 2
rounded:
  sm: "8px"
  card: "16px"
  lg: "24px"
spacing:
  space-1: ".5rem"
  space-2: "1rem"
  space-3: "1.5rem"
  space-4: "2rem"
  space-6: "3rem"
  space-8: "4rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    padding: "14px 21px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-text:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "14px 0"
  search-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 14px"
    height: "44px"
    width: "280px"
  filter-chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "7px"
    padding: "8px 14px"
  filter-chip-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
  major-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
  preview-dialog:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    width: "min(520px, calc(100% - 32px))"
---

# Design System: Find Your Path

## Overview

**Creative North Star: "Campus creative studio"**

An approachable, daytime visual world for students discovering university majors. Green ink, warm paper, soft pastel task fields, and confident rounded typography make exploration feel welcoming. This description records the shipped interface; it is not a separate brand promise.

Keep reusable controls calm and legible. Authored task specimens supply the playful character through type, small diagrams, and restrained rotation. They are decorative previews, not working simulations, assessments, or personalized recommendations.

**Key Characteristics:**
- Warm paper and green ink.
- Bold Manrope headings with quiet supporting text.
- Pastel specimen fields within white cards.
- Soft controls, clear borders, and selective hover lift.

## Colors

The normative palette above comes directly from the global stylesheet's custom properties.

### Primary
- **Studio green** (`primary`): main actions, selected filters, active navigation, and emphasized words.
- **Deep studio green** (`primary-hover`): primary action hover state.

### Secondary
- **Mint, peach, lilac, sky, rose, and sand**: major-specific illustration fields. These distinguish content without turning every field into a competing action color.

### Neutral
- **Warm paper** (`paper`): page background.
- **White surface** (`surface`): controls, card bodies, and dialogs.
- **Green ink** (`ink`): headings and default text.
- **Quiet green gray** (`muted`): descriptions, labels, and notes.
- **Soft line** (`line`): structural separators.
- **Pale studio ground** (`section`): grouped exploration content and informational notices.

**The Action Green Rule.** Use the primary green for interactive emphasis; use pastel fields to distinguish illustrative content.

## Typography

**Display and body font:** Manrope, falling back to sans-serif. Loaded through Next's font integration and exposed as `--font-sans`.

**Code font:** Geist Mono, falling back to monospace; exposed as `--font-geist-mono`.

Heavy, tightly spaced headings establish hierarchy. Small supporting text stays relaxed through generous line height. The frontmatter records desktop roles: hero support is larger (15px, line-height 1.9), while card descriptions use the body role and a short measure (32ch).

Display scales fluidly, becomes 42px at the tablet breakpoint, and uses `clamp(40px, 10.6vw, 57px)` on mobile. Card titles grow to 21px on mobile; descriptions grow to 13px. Uppercase lettering belongs to miniature illustration captions, not primary actions.

## Layout

Shared content uses a centered container with maximum width (1200px), desktop side gutters (48px), medium gutters (32px), and mobile gutters (20px). The spacing tokens provide a reusable rhythm; existing components also use local optical adjustments.

The current exploration grid has three equal columns, two at widths up to 850px, and one at widths up to 600px. Desktop cards have a gap (24px). At the 1100px breakpoint the grid tightens; at 600px the search becomes full width and filters scroll horizontally. Preserve visible keyboard focus within the scrolling filter strip.

Dialogs remain inside the viewport with a maximum height of `calc(100dvh - 48px)` and internal scrolling. The homepage's asymmetric hero and overlapping specimen board are surface-specific compositions; consult `.impeccable/surfaces/explore.md` when changing that page.

## Elevation & Depth

Most surfaces rest flat against tonal backgrounds and fine borders. Hover gives cards a diffuse lift; the hero's overlapping specimens retain ambient shadows. Dialogs use stronger elevation and a dimmed backdrop to establish their modal layer. Exact shadow and motion values live in the sidecar.

**The Selective Lift Rule.** Keep the browsing grid flat at rest and reserve its shadow for hover; retain the stronger dialog shadow for modal separation.

## Shapes

Controls use softly curved corners (`sm`); cards use the larger `card` radius and dialogs use `lg`. Filter chips are slightly tighter (7px), skill tags tighter again (5px). Circular arrows and close controls are compact accents. The compass brand tile has one short corner and a slight rotation; preserve that silhouette when reusing the mark.

## Components

### Buttons

Confident primary actions use white text on studio green, a minimum height (48px), and the primary button spacing above. Hover deepens the fill and adds a small shadow. Text actions have transparent fill, no horizontal padding, and an underline on hover. Global keyboard focus uses a green outline (3px) offset from the control (5px). Disabled buttons reduce opacity (.55) and show the unavailable cursor.

### Inputs / Fields

Search combines a small inline icon, white background, fine border, and the `sm` radius. The text field stays transparent within the wrapper. Focus within the wrapper uses an outline (2px) with offset (2px). Mobile increases the field height (46px) and text size (12px). Keep its accessible label even when the visible cue is a placeholder.

### Chips

Category filters use bordered, transparent chips; hover adds a pale green fill and selected state uses studio green with white text. Selection is also expressed through `aria-pressed`. Skill tags are quieter, noninteractive labels with pale backgrounds and small borders.

### Cards / Containers

Major cards are full-card buttons with clipped pastel illustration fields and white bodies. Desktop illustration height is 216px and body padding is `22px 23px 17px`. A fine divider separates descriptive content from the task action. The circular arrow fills green on card hover. Duration badges sit in the illustration corner; they describe illustrative task previews.

### Navigation

The brand and active link share a horizontal header. The active link uses bold text and a green underline (3px), paired with `aria-current`. Header height reduces from 96px to 80px and then 72px; the supplementary note disappears on tablet.

### Task specimens and preview dialogs

Code windows, bar charts, type swatches, conversation bubbles, care notes, and concept plans are authored HTML/CSS illustrations marked `aria-hidden`. They are enlarged in the preview dialog. Preserve their decorative status and the visible preview notice. The native dialog supplies modality, closes with Escape and its close control, locks background scrolling, and initially focuses the close button.

The entrance uses a small translation and scale over .35s with the shared ease-out curve. Reduced-motion preferences remove animations and transitions and restore immediate scrolling.

## Do's and Don'ts

### Do:
- **Do** reuse the global color, radius, spacing, font, and easing variables when extending the interface.
- **Do** pair green action emphasis with quiet supporting text and pastel specimen fields.
- **Do** preserve visible keyboard focus, accessible labels, and reduced-motion behavior.
- **Do** describe task specimens as previews while simulations and personalized insights remain unconnected.

### Don't:
- **Don't** turn decorative specimens into fabricated results, assessments, or recommendations.
- **Don't** add resting shadows to every card; retain the current selective elevation hierarchy.
- **Don't** promote the homepage hero composition into a requirement for every future screen.
