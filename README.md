# DHEE industry landing pages

Reusable static-first Astro site for industry and target-account landing pages, paired with sample videos. The current industry routes are `/machinery/` and `/robotics/`. The original brief calls for a portfolio of eight samples; the machinery explainer and robotics task concept are the first two examples.

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

1. Copy `src/content/pages/machinery.json` to a new JSON file in the same folder.
2. Set a unique lowercase `slug` (for example, `robotics`) and update its audience, SEO copy and section content.
3. Keep exactly three `useCases`; the config validator checks the required fields, sample poster and text alternative.
4. Add approved imagery under `public/images/` and point `video.poster` to it. Set `video.videoUrl` and `video.captionsUrl` when a sample is ready; otherwise, the page shows its concept poster.
5. Run `npm run build`; Astro creates a matching `dist/<slug>/` route.

The shared page renderer and layout live in `src/pages/[slug].astro` and `src/layouts/LandingPage.astro`. The visual system is in `src/styles/global.css`. The machinery page content is config-driven, including the research note, regulatory trigger, before/after response example, three sales moments, interactive workflow, comparison, sample, library, seven-step process, FAQ and calendar CTA. Add a new page by copying its JSON config and replacing its audience, facts, examples, language and approved media.

The DHEE mark in the header and footer is copied from the existing `dheeai/dhee-website` brand assets. The machinery illustration and copy are specific to this page; no client or competitor logos are used.

## Before publishing

- Replace the concept illustration and storyboard copy with DHEE-approved machine footage and product-expert-reviewed language.
- Review the latest machinery narration pronunciation, 55-second cut and captions; review the illustrative robotics concept and captions with the team.
- Complete the video portfolio and create the LinkedIn and WhatsApp cuts called for in the brief.
- Add the approved EN/DE/IT/FR/NL configs after human review of translations.
- Configure consent-based or cookieless analytics for page views, scroll depth, sample playback and CTA clicks after the domain and privacy destination are approved. No tracking script is currently loaded.
- Confirm the booking destination and contact details with DHEE. The current CTA uses the contact email shown on the existing DHEE page.
- Confirm DHEE brand colors and typography. The DHEE logo mark comes from the existing website; the page uses an editorial palette and system fonts until an approved brand type and color specification is supplied.
- Review all product, safety and regulatory statements with the relevant DHEE and customer experts. The page states that explanatory video does not replace required instructions.
- Update `site` and `base` in `astro.config.mjs` if the repository or production domain changes.
- Add DHEE's approved privacy-policy destination before collecting analytics or adding a privacy link.
