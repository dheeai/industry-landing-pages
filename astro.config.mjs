import { defineConfig } from 'astro/config';

const pagesBase = process.env.GITHUB_ACTIONS ? '/industry-landing-pages' : '/';

export default defineConfig({
  site: 'https://dheeai.github.io',
  base: pagesBase,
  output: 'static',
  trailingSlash: 'always',
});
