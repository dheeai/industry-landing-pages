#!/usr/bin/env node
/**
 * DHEE Studio — Industry Research to Landing Page Scaffolder
 *
 * Usage:
 *   npm run new-page -- --list-presets
 *   npm run new-page -- <slug> [--preset protocol-industrial] [--type A|B|C|D|E] [--segment "Industry Name"] [--brief path/to/brief.json]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const pagesDir = path.join(rootDir, 'src/content/pages');
const imagesDir = path.join(rootDir, 'public/images');
const presetsPath = path.join(rootDir, 'templates/presets.json');

const { presets } = JSON.parse(fs.readFileSync(presetsPath, 'utf8'));
const args = process.argv.slice(2);

if (args.includes('--list-presets')) {
  console.log('\nAvailable DHEE Landing Page Presets:\n');
  for (const [id, p] of Object.entries(presets)) {
    console.log(`  ${id.padEnd(22)} [${p.layout} · Type ${p.defaultPageType} · ${p.theme.accent}]`);
    console.log(`    ${p.name} — Best for: ${p.bestFor.join(', ')}\n`);
  }
  process.exit(0);
}

const slug = args.find((a) => !a.startsWith('--'));
if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error('Usage: npm run new-page -- <slug> [--preset protocol-industrial] [--type A|B|C|D|E] [--segment "Industry"] [--brief brief.json]');
  console.error('Run "npm run list-presets" to see all available presets.');
  process.exit(1);
}

const getFlag = (name, fallback) => {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback;
};

const presetId = getFlag('preset', 'protocol-industrial');
const preset = presets[presetId];
if (!preset) {
  console.error(`Unknown --preset "${presetId}". Available: ${Object.keys(presets).join(', ')}`);
  process.exit(1);
}

const layoutOverride = getFlag('layout', preset.layout);
const pageType = getFlag('type', preset.defaultPageType).toUpperCase();
if (!['A', 'B', 'C', 'D', 'E'].includes(pageType)) {
  console.error(`Invalid --type "${pageType}". Choose A, B, C, D, or E.`);
  process.exit(1);
}

const briefPath = getFlag('brief', '');
let brief = null;
if (briefPath) {
  const resolvedBrief = path.resolve(process.cwd(), briefPath);
  if (!fs.existsSync(resolvedBrief)) {
    console.error(`Brief file not found: ${resolvedBrief}`);
    process.exit(1);
  }
  brief = JSON.parse(fs.readFileSync(resolvedBrief, 'utf8'));
}

const titleCase = slug
  .split('-')
  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
  .join(' ');
const segment = getFlag('segment', brief?.segment ?? `${titleCase} teams`);
const practiceName = brief?.practiceName ?? segment.toUpperCase();

const targetPath = path.join(pagesDir, `${slug}.json`);
if (fs.existsSync(targetPath)) {
  console.error(`File already exists: ${targetPath}`);
  process.exit(1);
}

const journeySteps = (brief?.journeySteps?.length === 3
  ? brief.journeySteps
  : [
      { tab: 'The starting point', zone: 'CONTEXT', title: 'Establish the real operating context.', copy: 'Show the starting state and buyer challenge using approved product references.' },
      { tab: 'How it works', zone: 'MECHANISM', title: 'Make the core mechanism visible.', copy: 'Highlight the key stage that separates your product from generic alternatives.' },
      { tab: 'The next step', zone: 'OUTCOME', title: 'Connect clarity to an expert review.', copy: 'Close with the verified result and route the buyer directly to technical qualification.' }
    ]
).map((step, i) => ({
  ...step,
  image: ['/images/machinery-input.jpg', '/images/machinery-process.jpg', '/images/machinery-outcome.jpg'][i],
  imageAlt: `Illustrative visual for ${step.tab} — replace with approved ${segment.toLowerCase()} imagery.`
}));

const buyerQuestions = brief?.buyerQuestions?.length === 3
  ? brief.buyerQuestions
  : [
      {
        label: 'System fit',
        question: 'How does this fit into our existing workflow?',
        answer: 'Here is a concise visual overview of where the system integrates. Share your requirements and our technical team will confirm fit.',
        asset: 'Workflow fit overview'
      },
      {
        label: 'How it works',
        question: 'What actually happens step by step?',
        answer: 'This short walkthrough breaks down the core sequence visually before we dive into model-specific documentation.',
        asset: 'Step-by-step explainer'
      },
      {
        label: 'Next steps',
        question: 'What should our team review first?',
        answer: 'Start with this reviewed orientation alongside official specifications and compliance documentation.',
        asset: 'Buyer orientation clip'
      }
    ];

// Auto-generate a clean theme-matched Blueprint Schematic SVG for the new industry!
const blueprintRel = `/images/${slug}-blueprint-art.svg`;
const blueprintFull = path.join(imagesDir, `${slug}-blueprint-art.svg`);
const accent = preset.theme.accent;
const accentSoft = preset.theme.accentBright;
const escapeXml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const blueprintSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 440" width="920" height="440">
  <defs>
    <pattern id="gFine" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="${accentSoft}" stroke-opacity="0.08" stroke-width="0.75"/>
    </pattern>
    <pattern id="gMajor" width="100" height="100" patternUnits="userSpaceOnUse">
      <path d="M 100 0 L 0 0 0 100" fill="none" stroke="${accentSoft}" stroke-opacity="0.16" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="920" height="440" fill="#070E20"/>
  <rect width="920" height="440" fill="url(#gFine)"/>
  <rect width="920" height="440" fill="url(#gMajor)"/>
  <rect x="18" y="18" width="884" height="404" fill="none" stroke="${accentSoft}" stroke-opacity="0.28" stroke-width="1"/>
  <path d="M 18 38 V 18 H 38 M 882 18 H 902 V 38 M 18 402 V 422 H 38 M 882 422 H 902 V 402" fill="none" stroke="${accent}" stroke-width="2.2"/>
  <g font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="10.5" letter-spacing="1.6">
    <text x="36" y="42" fill="${accentSoft}">DWG. DHEE-${slug.toUpperCase().slice(0, 6)}-01</text>
    <text x="460" y="42" text-anchor="middle" fill="#FFFFFF">${escapeXml(practiceName)} · STORY ARCHITECTURE</text>
    <text x="884" y="42" text-anchor="end" fill="${accentSoft}">CONCEPT SCHEMATIC</text>
  </g>
  <line x1="18" y1="56" x2="902" y2="56" stroke="${accentSoft}" stroke-opacity="0.22" stroke-width="1"/>
  <line x1="64" y1="226" x2="856" y2="226" stroke="${accent}" stroke-opacity="0.55" stroke-width="1.2" stroke-dasharray="10 6"/>
  ${journeySteps
    .map((st, idx) => {
      const x = 76 + idx * 278;
      return `<g transform="translate(${x},126)">
    <rect width="212" height="200" fill="#0C1730" stroke="${idx === 1 ? accent : accentSoft}" stroke-opacity="${idx === 1 ? '0.95' : '0.45'}" stroke-width="1.4"/>
    <text x="18" y="34" font-family="ui-monospace, monospace" font-size="11" letter-spacing="1.5" fill="${accentSoft}">0${idx + 1} · ${escapeXml(st.zone)}</text>
    <text x="18" y="72" font-family="system-ui, sans-serif" font-size="17" font-weight="600" fill="#FFFFFF">${escapeXml(st.tab)}</text>
    <rect x="18" y="100" width="176" height="4" fill="${accent}" fill-opacity="${idx === 1 ? '1' : '0.45'}"/>
    <circle cx="106" cy="148" r="22" fill="none" stroke="${accentSoft}" stroke-width="1.2" stroke-dasharray="4 3"/>
    <circle cx="106" cy="148" r="8" fill="${accent}"/>
  </g>`;
    })
    .join('\n  ')}
  <line x1="18" y1="388" x2="902" y2="388" stroke="${accentSoft}" stroke-opacity="0.2" stroke-width="1"/>
  <g transform="translate(36,408)" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="10" letter-spacing="1.4" fill="${accentSoft}">
    <text x="0" y="0">DHEE STUDIO · ${escapeXml(preset.name.toUpperCase())}</text>
    <text x="848" y="0" text-anchor="end">REPLACE WITH APPROVED VERTICAL SCHEMATIC</text>
  </g>
</svg>
`;

if (!fs.existsSync(blueprintFull)) {
  fs.writeFileSync(blueprintFull, blueprintSvg, 'utf8');
}

const scaffold = {
  slug,
  pageType,
  segment,
  language: 'en',
  theme: preset.theme,
  presentation: {
    layout: layoutOverride,
    heroMedia: 'video',
    blueprintArt: blueprintRel,
    practiceKicker: preset.practiceKicker,
    practiceName
  },
  marqueeItems: [
    'Focused product explainers',
    'Reviewed technical claims',
    'First-response buyer clarity',
    'Proposal & event companions',
    'Captions & localized cuts',
    'Managed DHEE production'
  ],
  seo: {
    title: `${brief?.hero?.title ? `${brief.hero.title} ${brief.hero.emphasis}` : `Make complex ${titleCase.toLowerCase()} products easier to understand`} | DHEE`,
    description: brief?.hero?.body ?? `Clear, product-specific video stories and interactive landing pages built for ${segment.toLowerCase()} by DHEE Studio.`,
    noindex: true
  },
  hero: {
    eyebrow: brief?.hero?.eyebrow ?? `For ${segment.toLowerCase()}`,
    title: brief?.hero?.title ?? `Make ${titleCase.toLowerCase()} systems`,
    emphasis: brief?.hero?.emphasis ?? 'clear before the call.',
    body: brief?.hero?.body ?? 'Turn approved technical references into a concise visual story buyers, operators, and partners can follow before an expert conversation.',
    primary: { label: 'Explore a sample', href: '#sample' },
    secondary: { label: 'Talk through your product', href: '#contact' },
    edition: 'DRAFT'
  },
  concept: {
    eyebrow: 'Video is not the pitch. It is the bridge.',
    title: 'Give the buyer a clearer way into the conversation.',
    steps: ['Interest', 'Understanding', 'Continuation'],
    body: 'Start with one recurring technical question. Show a clear, reviewed visual sequence, then continue with the specialist who owns the specifics.'
  },
  research: {
    value: brief?.research?.value ?? '1 story',
    body: brief?.research?.body ?? 'Anchor the page around one real audience question and one verified next step.',
    source: {
      label: brief?.research?.sourceLabel ?? 'See the story flow',
      href: brief?.research?.sourceHref ?? '#journey'
    }
  },
  ...(brief?.trigger
    ? {
        trigger: {
          eyebrow: brief.trigger.eyebrow,
          title: brief.trigger.title,
          body: brief.trigger.body,
          dateStamp: brief.trigger.dateStamp,
          dateLabel: brief.trigger.dateLabel,
          source: { label: brief.trigger.sourceLabel, href: brief.trigger.sourceHref }
        }
      }
    : {}),
  journey: {
    eyebrow: 'One system, one clear thread',
    title: 'Follow the workflow.',
    emphasis: 'Clarify the value.',
    body: 'Replace generic feature lists with three concrete visual beats your buyers can grasp in seconds.',
    steps: journeySteps
  },
  response: {
    eyebrow: 'Before and after the first reply',
    title: 'Make the first response useful.',
    body: 'Pair your first reply with a focused visual overview while your technical team prepares to address customer-specific requirements.',
    beforeLabel: 'THE HOLDING REPLY',
    beforeMessage: 'Thanks for reaching out. A specialist will contact you soon.',
    beforeNote: 'The buyer still waits without clear product context.',
    tabs: buyerQuestions
  },
  comparison: {
    title: 'Shared context before the first technical meeting.',
    body: 'An illustrative comparison of a text-only introduction and a visual product bridge. Makes no performance guarantee.',
    leftTitle: 'Typical first touch',
    leftItems: [
      'Written acknowledgement without visual context',
      'Stakeholders picture different workflows',
      'Live calls spend time on basic orientation'
    ],
    rightTitle: 'With a DHEE video bridge',
    rightItems: [
      'Share a reviewed explainer immediately',
      'Align stakeholders on one visual sequence',
      'Focus live meetings on configuration and fit'
    ],
    note: brief?.disclaimer ?? 'Approved documentation, specifications, and regulatory instructions remain authoritative.'
  },
  useCases: [
    {
      number: '01',
      title: 'Answer an inbound lead',
      body: 'Respond to new enquiries with a concise visual explainer while specialists prepare detailed answers.',
      tag: 'Inbound lead'
    },
    {
      number: '02',
      title: 'Clarify questions in chat',
      body: 'Share a focused clip in email or messaging when a buyer asks how the system operates.',
      tag: 'Direct follow-up'
    },
    {
      number: '03',
      title: 'Pair with a proposal',
      body: 'Give technical and commercial reviewers a shared visual companion alongside formal specifications.',
      tag: 'Proposal companion'
    }
  ],
  video: {
    title: `${titleCase} concept explainer`,
    description: 'Replace with an approved industry sample film, captions file, and transcript before publishing.',
    duration: '00:47',
    poster: '/images/machinery-concept.svg',
    label: 'Illustrative placeholder sample · Replace before launch',
    videoUrl: '/videos/machinery-sample-01.mp4',
    captionsUrl: '/videos/machinery-sample-01.en.vtt',
    transcript: [
      'Replace this draft transcript with the approved narration for your new industry sample film.'
    ]
  },
  library: {
    title: 'Build a reusable story library around real questions.',
    body: 'Start with one flagship explainer, then expand into onboarding, feature, and service stories.',
    items: [
      { number: '01', title: 'Product overview', detail: 'What it does, who it serves, and where it fits.', poster: '/images/industrial-machine-hero.jpg', alt: 'Illustrative placeholder overview card.' },
      { number: '02', title: 'Workflow walkthrough', detail: 'Follow one task from start to finish.', poster: '/images/machinery-input.jpg', alt: 'Illustrative placeholder workflow card.' },
      { number: '03', title: 'Capability spotlight', detail: 'Zoom in on one differentiating mechanism.', poster: '/images/machinery-process.jpg', alt: 'Illustrative placeholder capability card.' },
      { number: '04', title: 'Getting started', detail: 'Orient new users alongside official manuals.', poster: '/images/machinery-outcome.jpg', alt: 'Illustrative placeholder onboarding card.' }
    ]
  },
  process: {
    title: 'Seven steps from brief to finished visual',
    steps: [
      { number: '01', title: 'Brief and research the audience' },
      { number: '02', title: 'Collect brand and product references' },
      { number: '03', title: 'Analyse the market and competitors' },
      { number: '04', title: 'Storyboard the idea' },
      { number: '05', title: 'Write the script and plan audio' },
      { number: '06', title: 'Build visuals, graphics and cutdowns' },
      { number: '07', title: 'Review claims, captions and final QA' }
    ]
  },
  faqs: [
    {
      question: 'What do we need to start a first concept?',
      answer: 'One target audience, one recurring technical question, and approved product references your team is comfortable sharing.'
    },
    {
      question: 'Who approves technical and compliance claims?',
      answer: 'Your product, engineering, or regulatory reviewers retain final approval on all scripts, visuals, and claims before external sharing.'
    }
  ],
  cta: {
    title: `Which ${titleCase.toLowerCase()} story should we clarify first?`,
    body: 'Bring one product, one audience, and one question your team answers every week.',
    calendar: {
      label: 'Choose a time',
      href: 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1jRZAWKol3cIiT4khN3XhotFLi_YMKThl_3d-8tGVQglz7mt5fuhBEWcqErA_JluTYAL0r6a?gv=true'
    },
    email: {
      label: 'Email the DHEE team',
      href: 'mailto:Gayathri@Dhee.Studio'
    }
  },
  footer: {
    disclosure: brief?.disclaimer ?? 'Draft concept page. Replace placeholder imagery and verify all product and regulatory claims before publishing.',
    copyright: 'DHEE Studio'
  }
};

fs.writeFileSync(targetPath, `${JSON.stringify(scaffold, null, 2)}\n`, 'utf8');
console.log(`✓ Created ${path.relative(rootDir, targetPath)} (preset: ${presetId}, layout: ${layoutOverride}, Type ${pageType})`);
console.log(`✓ Blueprint SVG: ${path.relative(rootDir, blueprintFull)}`);
console.log(`Next: run "npm run check:all" to validate assets, schema, and build /${slug}/`);
