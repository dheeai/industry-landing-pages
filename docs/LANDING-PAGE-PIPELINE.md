# DHEE Studio · Industry-to-Landing-Page Pipeline

A repeatable 5-stage pipeline for turning industry research into a verified, high-craft landing page in minutes—anchored on our **Protocol Blueprint** system (inspired by Oversight Supply’s *Protocol*) and our **Vantablack Darkroom** system.

---

## Stage 1 · Industry & Buyer Research
Before writing a single line of JSON, capture real, verifiable facts in a structured brief copied from `templates/industry-brief.template.json`:

1. **Audience & Core Job:** Name the exact buyer, operator, or stakeholder roles (e.g., Applications Engineer, Process Lead, Quality/MLR Reviewer).
2. **Verified Research Stat or Spec:** Pull 1 primary-source market metric (with direct source URL) or 3 published product specs—**never fabricate percentages, ROI claims, or timelines**.
3. **Timely Regulatory / Market Trigger:** Identify a dated external catalyst (e.g., EU Machinery Regulation 2023/1230, Series B expansion, ISO/MDR milestone) with its authoritative source URL.
4. **3 Recurring First-Response Questions:** Capture the exact first 3 questions prospects ask in inbound emails/WhatsApp/calls and pair each with a concise visual reply.
5. **3-Stage Visual Workflow (`Input → Process → Outcome`):** Define the concrete 3-beat thread the explainer film and interactive Journey viewer follow.
6. **Honest Boundaries & Disclaimers:** Explicitly separate illustrative concepts from validated simulations, statutory manuals, safety cases, or regulatory sign-off.

---

## Stage 2 · Choose a Template Preset
Run `npm run list-presets` to inspect all registered presets in `templates/presets.json`:

| Preset ID | Layout Engine | Default Accent | Best For |
| :--- | :--- | :--- | :--- |
| `protocol-industrial` | `protocol` (Oversight *Protocol*) | Signal Cobalt `#2056FF` | EU Machinery, CNC, Packaging, Heavy Industry |
| `protocol-robotics` | `protocol` (Oversight *Protocol*) | Precision Azure `#0284C7` | Robotics, Physical AI, AMRs, Work Cells |
| `protocol-biotech` | `protocol` (Oversight *Protocol*) | Clinical Teal `#0D9488` | Biomanufacturing, MedTech, Target Account Pitches |
| `protocol-library` | `protocol` (Oversight *Protocol*) | Structured Emerald `#059669` | Multi-SKU Product Video Libraries |
| `protocol-partner` | `protocol` (Oversight *Protocol*) | Editorial Indigo `#4F46E5` | Consultancies, System Integrators, Channel Partners |
| `studio-darkroom` | `standard` (Vantablack Darkroom) | Bioluminescent Teal `#2DD4BF` | Pharma Cinema, High-Contrast Flagship Reveals |

> **Switching layouts later is 1 line in JSON:** change `"presentation": { "layout": "protocol" }` ↔ `"standard"`.

---

## Stage 3 · Scaffold in One Command

Generate both the validated page config (`src/content/pages/<slug>.json`) and a matching Blueprint schematic (`public/images/<slug>-blueprint-art.svg`):

```sh
# Quick scaffold from a preset
npm run new-page -- semiconductors --preset protocol-industrial --segment "Semiconductor Tools"

# Or hydrate directly from a filled research brief
npm run new-page -- semiconductors --preset protocol-industrial --brief my-brief.json
```

---

## Stage 4 · Art Direction, Media & Localization
Follow the DHEE Protocol craft guardrails so every vertical feels museum-grade:

- **Official Brand Mark:** Always uses `/images/dhee-mark-black.png` (light header) and `/images/dhee-mark-white.png` (dark footer).
- **Color Discipline:** Clean `#FFFFFF` / `#F7F8FA` editorial surfaces + deep obsidian `#070B14` showcase bands + your preset’s crisp blue/teal/emerald/indigo signal accent. No raw paint-swatch labels or cluttered badges.
- **Zero-Overlap Specimen Plate (`FIG. 02`):** Pair an orthographic SVG engineering schematic (`presentation.blueprintArt`) flush above a 2-column photographic diptych—never float photos over blueprint text.
- **Approved Media & Captions:** Place images in `public/images/`, MP4s and WebVTT `.vtt` tracks in `public/videos/`, and keep every visual accurately alt-tagged.
- **Multi-Language Editions (Optional):** Drop `src/content/locales/<slug>.<lang>.json` (e.g. `semiconductors.de.json`); routes and the header language switcher wire up automatically.

---

## Stage 5 · Automated QA Gate & Preview

Run the full validation & build gate before previewing locally:

```sh
npm run check:all
npm run preview
```

`npm run check:all` verifies:
1. Valid JSON across every page and locale file.
2. Zero duplicate slugs and zero orphaned locale files.
3. Every local `/images/...`, `/videos/...`, `.vtt`, and `blueprintArt` asset exists inside `public/`.
4. Strict `validateLandingPage()` TypeScript schema validation during `astro build`.

Before pushing to `main`:
- Inspect desktop (`1280×800`), split-pane (`680×800`), and mobile (`390×844`) for `0` console errors, `0` broken images, and `0` horizontal overflow.
- Push to `main` (or open a PR—`.github/workflows/validate-pr.yml` runs the full check + scaffolder smoke test automatically, and `.github/workflows/deploy.yml` runs the two-job GitHub Pages build → deploy pipeline).
