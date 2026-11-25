#!/usr/bin/env node
/**
 * DHEE Studio — Landing Page Scaffolder
 * Usage:
 *   npm run new-page -- <slug> [--type A|B|C|D|E] [--segment "Industry Name"]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pagesDir = path.resolve(__dirname, '../src/content/pages');

const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith('--'));

if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error('Usage: npm run new-page -- <slug> [--type A|B|C|D|E] [--segment "Segment name"]');
  console.error('Slug must use lowercase letters, numbers, and hyphens only (e.g. "medtech").');
  process.exit(1);
}

const getFlag = (name, fallback) => {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback;
};

const pageType = getFlag('type', 'A').toUpperCase();
if (!['A', 'B', 'C', 'D', 'E'].includes(pageType)) {
  console.error(`Invalid --type "${pageType}". Choose A, B, C, D, or E.`);
  process.exit(1);
}

const titleCase = slug
  .split('-')
  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
  .join(' ');
const segment = getFlag('segment', `${titleCase} teams`);

const THEME_PRESETS = {
  A: {
    accent: '#f59e0b',
    accentBright: '#fcd34d',
    accentDark: '#b45309',
    accentSecondary: '#38bdf8',
    accentRgb: '245, 158, 11',
    accentBrightRgb: '252, 211, 77',
    accentSecondaryRgb: '56, 189, 248',
    ember: '#ff5a2f'
  },
  B: {
    accent: '#2dd4bf',
    accentBright: '#5eead4',
    accentDark: '#0f766e',
    accentSecondary: '#3b82f6',
    accentRgb: '45, 212, 191',
    accentBrightRgb: '94, 234, 212',
    accentSecondaryRgb: '59, 130, 246',
    ember: '#ff5a2f'
  },
  C: {
    accent: '#10b981',
    accentBright: '#6ee7b7',
    accentDark: '#047857',
    accentSecondary: '#38bdf8',
    accentRgb: '16, 185, 129',
    accentBrightRgb: '110, 231, 183',
    accentSecondaryRgb: '56, 189, 248',
    ember: '#ff5a2f'
  },
  D: {
    accent: '#38bdf8',
    accentBright: '#7dd3fc',
    accentDark: '#0369a1',
    accentSecondary: '#818cf8',
    accentRgb: '56, 189, 248',
    accentBrightRgb: '125, 211, 252',
    accentSecondaryRgb: '129, 140, 248',
    ember: '#ff5a2f'
  },
  E: {
    accent: '#a78bfa',
    accentBright: '#c4b5fd',
    accentDark: '#6d28d9',
    accentSecondary: '#38bdf8',
    accentRgb: '167, 139, 250',
    accentBrightRgb: '196, 181, 253',
    accentSecondaryRgb: '56, 189, 248',
    ember: '#ff5a2f'
  }
};

const targetPath = path.join(pagesDir, `${slug}.json`);
if (fs.existsSync(targetPath)) {
  console.error(`File already exists: ${targetPath}`);
  process.exit(1);
}

const scaffold = {
  slug,
  pageType,
  segment,
  language: 'en',
  theme: THEME_PRESETS[pageType],
  presentation: {
    layout: 'standard',
    heroMedia: 'video',
    practiceKicker: 'INDUSTRY FILMS',
    practiceName: segment.toUpperCase()
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
    title: `Make complex ${titleCase.toLowerCase()} products easier to understand | DHEE`,
    description: `Clear, product-specific video stories and interactive landing pages built for ${segment.toLowerCase()} by DHEE Studio.`,
    noindex: true
  },
  hero: {
    eyebrow: `For ${segment.toLowerCase()}`,
    title: `Make ${titleCase.toLowerCase()} systems`,
    emphasis: 'clear before the call.',
    body: 'Turn approved technical references into a concise visual story buyers, operators, and partners can follow before an expert conversation.',
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
    value: '1 story',
    body: 'Anchor the page around one real audience question and one verified next step.',
    source: { label: 'See the story flow', href: '#journey' }
  },
  journey: {
    eyebrow: 'One system, one clear thread',
    title: 'Follow the workflow.',
    emphasis: 'Clarify the value.',
    body: 'Replace generic feature lists with three concrete visual beats your buyers can grasp in seconds.',
    steps: [
      {
        tab: 'The starting point',
        zone: 'CONTEXT',
        title: 'Establish the real operating context.',
        copy: 'Show the starting state and buyer challenge using approved product references.',
        image: '/images/machinery-input.jpg',
        imageAlt: 'Illustrative placeholder workflow visual — replace with approved product imagery.'
      },
      {
        tab: 'How it works',
        zone: 'MECHANISM',
        title: 'Make the core mechanism visible.',
        copy: 'Highlight the key stage that separates your product from generic alternatives.',
        image: '/images/machinery-process.jpg',
        imageAlt: 'Illustrative placeholder process visual — replace with approved product imagery.'
      },
      {
        tab: 'The next step',
        zone: 'OUTCOME',
        title: 'Connect clarity to an expert review.',
        copy: 'Close with the verified result and route the buyer directly to technical qualification.',
        image: '/images/machinery-outcome.jpg',
        imageAlt: 'Illustrative placeholder outcome visual — replace with approved product imagery.'
      }
    ]
  },
  response: {
    eyebrow: 'Before and after the first reply',
    title: 'Make the first response useful.',
    body: 'Pair your first reply with a focused visual overview while your technical team prepares to address customer-specific requirements.',
    beforeLabel: 'THE HOLDING REPLY',
    beforeMessage: 'Thanks for reaching out. A specialist will contact you soon.',
    beforeNote: 'The buyer still waits without clear product context.',
    tabs: [
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
    ]
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
    note: 'Approved documentation, specifications, and regulatory instructions remain authoritative.'
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
      {
        number: '01',
        title: 'Product overview',
        detail: 'What it does, who it serves, and where it fits.',
        poster: '/images/industrial-machine-hero.jpg',
        alt: 'Illustrative placeholder overview card.'
      },
      {
        number: '02',
        title: 'Workflow walkthrough',
        detail: 'Follow one task from start to finish.',
        poster: '/images/machinery-input.jpg',
        alt: 'Illustrative placeholder workflow card.'
      },
      {
        number: '03',
        title: 'Capability spotlight',
        detail: 'Zoom in on one differentiating mechanism.',
        poster: '/images/machinery-process.jpg',
        alt: 'Illustrative placeholder capability card.'
      },
      {
        number: '04',
        title: 'Getting started',
        detail: 'Orient new users alongside official manuals.',
        poster: '/images/machinery-outcome.jpg',
        alt: 'Illustrative placeholder onboarding card.'
      }
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
    disclosure: 'Draft concept page. Replace placeholder imagery and verify all product and regulatory claims before publishing.',
    copyright: 'DHEE Studio'
  }
};

fs.writeFileSync(targetPath, `${JSON.stringify(scaffold, null, 2)}\n`, 'utf8');
console.log(`Created ${path.relative(process.cwd(), targetPath)} (Type ${pageType}, route /${slug}/)`);
console.log('Next: customize copy & media, then run "npm run build" to validate and build.');
