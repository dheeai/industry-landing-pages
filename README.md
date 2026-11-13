# DHEE industry landing pages

Reusable static-first Astro site for industry and target-account landing pages, paired with sample videos. The first route is the EU machinery page at `/machinery/`. The original brief calls for a portfolio of eight samples; `videos/01-machine-working-principle/storyboard.md` is the approval draft for the first, 60-second sample.

## GitHub Pages

The `main` branch deploys automatically through GitHub Actions. The repository is configured for `https://dheeai.github.io/industry-landing-pages/`; enable GitHub Pages with **GitHub Actions** as the build and deployment source in repository settings. The initial page is the machinery route at `/industry-landing-pages/machinery/`.

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
4. Add approved imagery under `public/images/` and point `video.poster` to it. If approved footage is available, set `video.videoUrl` and `video.captionsUrl`; until then, the storyboard poster and transcript remain visible.
5. Run `npm run build`; Astro creates a matching `dist/<slug>/` route.

The shared page renderer and layout live in `src/pages/[slug].astro` and `src/layouts/LandingPage.astro`. The visual system is in `src/styles/global.css`.

## Before publishing

- Replace the concept illustration and storyboard copy with DHEE-approved machine footage and product-expert-reviewed language.
- Complete the video portfolio and create the LinkedIn and WhatsApp cuts called for in the brief.
- Confirm the booking destination and contact details with DHEE. The current CTA uses the contact email shown on the existing DHEE page.
- Confirm DHEE brand assets, colors and typography. The current page uses a lightweight editorial palette and a text wordmark as a visual direction.
- Review all product, safety and regulatory statements with the relevant DHEE and customer experts. The page states that explanatory video does not replace required instructions.
- Update `site` and `base` in `astro.config.mjs` if the repository or production domain changes.
- Add DHEE's approved privacy-policy destination before collecting analytics or adding a privacy link.
