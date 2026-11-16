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

1. Copy the closest page config from `src/content/pages/` to a new JSON file in the same folder.
2. Set a unique lowercase `slug`, the matching `pageType` (`A`–`E`), and update its audience, SEO copy and section content.
3. Keep exactly three `useCases`; the config validator checks the required fields, sample poster and text alternative.
4. Add approved imagery under `public/images/` and point `video.poster` to it. Set `video.videoUrl` and `video.captionsUrl` when a sample is ready; otherwise, the page shows its concept poster.
5. Run `npm run build`; Astro creates a matching `dist/<slug>/` route.

The shared page renderer and layout live in `src/pages/[slug].astro` and `src/layouts/LandingPage.astro`. The visual system is in `src/styles/global.css`. Page copy, story steps, trigger, use cases, video, library, process, FAQ and CTA are configured in JSON. Page Type C uses the library block as its main value; Type E uses the same reusable blocks to explain a partner's service lines and client handoffs. The two template routes are noindex concept examples, not approved company pages.

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
