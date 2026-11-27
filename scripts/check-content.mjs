#!/usr/bin/env node
/**
 * DHEE Studio — Content, Local Asset & Locale Integrity Validator
 * Fails on broken local asset paths, duplicate slugs, invalid JSON,
 * or orphaned locale files.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const pagesDir = path.join(root, 'src/content/pages');
const localesDir = path.join(root, 'src/content/locales');
const publicDir = path.join(root, 'public');

const errors = [];
const warnings = [];

const checkPublicPath = (fileLabel, field, assetPath) => {
  if (!assetPath || typeof assetPath !== 'string') return;
  if (assetPath.startsWith('http://') || assetPath.startsWith('https://')) return;
  const rel = assetPath.replace(/^\//, '');
  const full = path.join(publicDir, rel);
  if (!fs.existsSync(full)) {
    errors.push(`[${fileLabel}] Missing public asset for "${field}": ${assetPath}`);
  }
};

const pageFiles = fs.readdirSync(pagesDir).filter((f) => f.endsWith('.json')).sort();
const seenSlugs = new Set();
const basePages = new Map();

for (const file of pageFiles) {
  const fullPath = path.join(pagesDir, file);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  } catch (err) {
    errors.push(`[pages/${file}] Invalid JSON: ${err.message}`);
    continue;
  }

  if (!data.slug) {
    errors.push(`[pages/${file}] Missing "slug" field.`);
    continue;
  }
  if (seenSlugs.has(data.slug)) {
    errors.push(`[pages/${file}] Duplicate slug "${data.slug}".`);
  }
  seenSlugs.add(data.slug);
  basePages.set(data.slug, data);

  checkPublicPath(file, 'hero.image', data.hero?.image);
  checkPublicPath(file, 'presentation.blueprintArt', data.presentation?.blueprintArt);
  checkPublicPath(file, 'video.poster', data.video?.poster);
  checkPublicPath(file, 'video.videoUrl', data.video?.videoUrl);
  checkPublicPath(file, 'video.captionsUrl', data.video?.captionsUrl);

  (data.journey?.steps ?? []).forEach((step, idx) => {
    checkPublicPath(file, `journey.steps[${idx}].image`, step.image);
  });
  (data.library?.items ?? []).forEach((item, idx) => {
    checkPublicPath(file, `library.items[${idx}].poster`, item.poster);
  });
}

const localeFiles = fs.existsSync(localesDir)
  ? fs.readdirSync(localesDir).filter((f) => f.endsWith('.json')).sort()
  : [];

for (const file of localeFiles) {
  const match = file.match(/^([a-z0-9-]+)\.([a-z]{2})\.json$/);
  if (!match) {
    errors.push(`[locales/${file}] Filename must match "<base-slug>.<lang>.json".`);
    continue;
  }
  const [, baseSlug, lang] = match;
  if (!basePages.has(baseSlug)) {
    errors.push(`[locales/${file}] Orphaned locale: base page "${baseSlug}" does not exist.`);
  }

  let loc;
  try {
    loc = JSON.parse(fs.readFileSync(path.join(localesDir, file), 'utf8'));
  } catch (err) {
    errors.push(`[locales/${file}] Invalid JSON: ${err.message}`);
    continue;
  }

  if (!loc.slug || seenSlugs.has(loc.slug)) {
    errors.push(`[locales/${file}] Missing or duplicate locale slug "${loc.slug}".`);
  } else {
    seenSlugs.add(loc.slug);
  }
  if (loc.language !== lang) {
    errors.push(`[locales/${file}] Language "${loc.language}" does not match filename suffix ".${lang}.json".`);
  }
  checkPublicPath(file, 'captionsUrl', loc.captionsUrl);

  const keyCount = Object.keys(loc.translations ?? {}).length;
  if (keyCount === 0) {
    errors.push(`[locales/${file}] Empty "translations" dictionary.`);
  }
  if (loc.reviewStatus !== 'human-reviewed') {
    warnings.push(`[locales/${file}] Status is "${loc.reviewStatus ?? 'unreviewed'}" (${keyCount} translated strings) — review before external outreach.`);
  }
}

console.log(`Checked ${pageFiles.length} page config(s) and ${localeFiles.length} locale file(s).`);
if (warnings.length) {
  console.log('\nReview notes:');
  for (const w of warnings) console.log(`  - ${w}`);
}

if (errors.length) {
  console.error('\nContent validation FAILED:');
  for (const e of errors) console.error(`  x ${e}`);
  process.exit(1);
}

console.log('\n✓ All page configs, local assets, and locale files passed validation.');
