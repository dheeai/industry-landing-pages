# DHEE industry landing pages

Reusable static-first Astro site for industry and target-account landing pages, paired with sample videos. The original brief defines five page types, represented in each page config by `pageType`: A (industry trigger), B (account pitch), C (product library), D (demo-before-hardware), and E (channel partner). The machinery, Multiply Labs and robotics routes cover A, B and D; the private `library-template` and `partner-template` routes are concept examples for C and E. The brief also calls for a portfolio of eight samples; the machinery explainer and robotics task concept are the first two examples.

## GitHub Pages

The `main` branch deploys automatically through GitHub Actions. The repository is configured for `https://dheeai.github.io/industry-landing-pages/`; enable GitHub Pages with **GitHub Actions** as the build and deployment source in repository settings. Current routes are `/industry-landing-pages/machinery/` and `/industry-landing-pages/robotics/`.

## Run locally

```sh
npm install
npm run dev
```

The development server uses Astro's default port, `http://127.0.0.1:4321`.

Create the static production output with:

```sh
npm run build
```

Astro writes the deployable site to `dist/`.
`npm run preview` uses Astro's default preview port; stop the development server first if you want to preview the production build.

## Add another page

Generate a validated starter config in one command:

```sh
npm run new-page -- my-industry --type A --segment "My Industry"
```

1. Customize the generated JSON in `src/content/pages/<slug>.json` (optional per-industry `theme` color tokens, `presentation` flags, `telemetry` cards, `marqueeItems`, copy, and media).
2. Add optional localized variants as `src/content/locales/<slug>.<lang>.json` — routes and language switchers wire up automatically.
3. Add approved imagery under `public/images/` and video/captions under `public/videos/`.
4. Run `npm run build` to validate against `src/content/schema.ts` and generate `dist/<slug>/`.

### Reusable Architecture & CI/CD

- **Portfolio Hub:** `src/pages/index.astro` renders the root directory (`/`) linking to all live verticals and templates.
- **Design System & Motion:** Shared tokens live in `src/styles/studio-tokens.css`, layout & theme primitives in `src/styles/studio-system.css`, and zero-reflow scroll/tab interactions in `src/scripts/studio-motion.ts`.
- **Modular Components:** Reusable Astro sections live in `src/components/` (`StudioHeader`, `StudioHero`, `KineticMarquee`, `ConceptBridge`, `TriggerAndMetrics`, `FirstResponseStudio`, `UseCasesGrid`, `InteractiveJourney`, `ComparisonSection`, `StoryLibrary`, `ProcessStack`, `FaqSection`, `ClosingCta`, `StudioFooter`, `FloatingChrome`).
- **GitHub Actions:** `.github/workflows/deploy.yml` separates `build` and `deploy` jobs with route verification and `cancel-in-progress: false` to prevent Pages artifact races. `.github/workflows/validate-pr.yml` validates JSON configs, schema builds, and the page scaffolder on every PR to `main`.

## Optional campaign integrations

Copy `.env.example` to `.env` for local configuration. `PUBLIC_MULTIPLY_LABS_VIDEO_URL` accepts a direct browser-playable URL from the approved streaming host; when unset, the local MP4 remains available for preview. `PUBLIC_PLAUSIBLE_DOMAIN` and `PUBLIC_PRIVACY_URL` must both be set before the consent banner or analytics loads. The tracker stores a visitor's accept/reject choice and emits page views, scroll depth, video play/watch milestones, and CTA clicks only after acceptance. These values are build-time public settings, not secrets.

The DHEE mark in the header and footer is copied from the existing `dheeai/dhee-website` brand assets. The Multiply Labs page uses public product photography and clearly labels its generated motion as an independent, illustrative concept; no competitor logos are used.

## Before publishing

- Replace the concept illustration and storyboard copy with DHEE-approved machine footage and product-expert-reviewed language.
- Review the latest machinery narration pronunciation, 55-second cut and captions; review the illustrative robotics concept and captions with the team.
- Complete the video portfolio and create the LinkedIn and WhatsApp cuts called for in the brief.
- Human-review the draft DE/IT/FR/NL page text and captions before sharing those language routes externally; the English voice-over remains the same in each route.
- Keep UTM tags on outreach links (`utm_source`, `utm_medium`, `utm_campaign`, and optional `utm_content`/`utm_term`) to compare email, LinkedIn and event traffic. Plausible's campaign reports use those tags; consented custom events also include the page slug, language and UTM values.
- Keep the language selector and draft locale routes out of external outreach until each translation and caption file has a human review.
- Configure `PUBLIC_PLAUSIBLE_DOMAIN` and `PUBLIC_PRIVACY_URL` in the GitHub Pages build after DHEE approves the analytics domain and privacy destination. No tracker loads until both values are set and the visitor accepts.
- Upload the sample to the approved streaming host and set `PUBLIC_MULTIPLY_LABS_VIDEO_URL` in the GitHub Pages build; local MP4 remains the preview fallback.
- Confirm the booking destination and contact details with DHEE. The current CTA uses the contact email shown on the existing DHEE page.
- Confirm DHEE brand colors and typography. The DHEE logo mark comes from the existing website; the page uses an editorial palette and system fonts until an approved brand type and color specification is supplied.
- Review all product, safety and regulatory statements with the relevant DHEE and customer experts. The page states that its AI-generated motion is illustrative and that it is not commissioned, approved or endorsed by Multiply Labs.
- Update `site` and `base` in `astro.config.mjs` if the repository or production domain changes.
- Add DHEE's approved privacy-policy destination and Plausible domain in the GitHub Pages build before enabling analytics. The consent banner and tracking remain off until both values exist.


### Standalone pharma microsite

The pharma/life-sciences page lives in `public/pharma/` as a separate static microsite, not a route generated from the config-driven Astro page system. Astro copies it into `dist/pharma/` during the normal build. Its GitHub Pages route is `/industry-landing-pages/pharma/`. The HTML, CSS, JavaScript, social image, and scientific review checklist are kept together so the page can be edited independently while still shipping through the existing GitHub Pages workflow.
