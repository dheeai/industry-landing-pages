export type Link = { label: string; href: string };
export type PageType = 'A' | 'B' | 'C' | 'D' | 'E';

export type PageTheme = {
  accent: string;
  accentBright: string;
  accentDark: string;
  accentSecondary: string;
  accentRgb: string;
  accentBrightRgb: string;
  accentSecondaryRgb?: string;
  ember?: string;
};

export type PagePresentation = {
  layout?: 'standard' | 'account-showcase' | 'protocol';
  heroMedia?: 'video' | 'image';
  blueprintArt?: string;
  showFilmSection?: boolean;
  showDeliverables?: boolean;
  linkUseCasesToResponse?: boolean;
  practiceKicker?: string;
  practiceName?: string;
  videoEnvOverride?: string;
};

export type TelemetryItem = {
  kicker: string;
  value: string;
  unit?: string;
  body: string;
  countTo?: number;
  dark?: boolean;
};

export type LandingPage = {
  slug: string;
  pageType: PageType;
  segment: string;
  language: string;
  theme?: PageTheme;
  presentation?: PagePresentation;
  marqueeItems?: string[];
  telemetry?: TelemetryItem[];
  languageVariants?: Array<{ language: string; label: string; slug: string }>;
  languageLabel?: string;
  localeReview?: 'draft-machine-translation' | 'human-reviewed';
  ui?: Record<string, string>;
  navigation?: { response: string; applications: string; journey: string; sample: string; studio?: string };
  seo: { title: string; description: string; noindex?: boolean };
  hero: {
    eyebrow: string;
    title: string;
    emphasis: string;
    body: string;
    primary: Link;
    secondary: Link;
    image?: string;
    imageAlt?: string;
    artTopLabel?: string;
    artStamp?: string;
    artStampLabel?: string;
    artStampTop?: string;
    artInput?: string;
    artOutput?: string;
    note?: string;
    noteEmphasis?: string;
    edition?: string;
  };
  concept: { eyebrow: string; title: string; steps: string[]; body: string };
  research: { value: string; body: string; source: Link; items?: Array<{ value: string; label: string }> };
  journey: {
    eyebrow: string;
    title: string;
    emphasis: string;
    body: string;
    storyLabel?: string;
    navigationLabel?: string;
    steps: Array<{ tab: string; zone: string; title: string; copy: string; image: string; imageAlt: string }>;
  };
  response: {
    eyebrow: string;
    title: string;
    body: string;
    beforeLabel: string;
    beforeMessage: string;
    beforeNote: string;
    videoDuration?: string;
    assetLabel?: string;
    tabs: Array<{ label: string; question: string; answer: string; asset: string }>;
  };
  trigger?: { eyebrow: string; title: string; body: string; dateStamp: string; dateLabel: string; source: Link };
  metrics?: { eyebrow: string; title: string; body: string; source: Link; items: Array<{ value: string; label: string }> };
  comparison: {
    title: string;
    body: string;
    leftTitle: string;
    leftItems: string[];
    rightTitle: string;
    rightItems: string[];
    note: string;
  };
  applications?: { eyebrow: string; title: string; emphasis: string; body: string };
  useCases: Array<{ number: string; title: string; body: string; tag: string }>;
  video: {
    title: string;
    description: string;
    duration: string;
    poster: string;
    label: string;
    videoUrl?: string;
    captionsUrl?: string;
    autoplayOnScroll?: boolean;
    transcript: string[];
  };
  library: {
    title: string;
    body: string;
    items: Array<{ number: string; title: string; detail: string; poster: string; alt: string }>;
  };
  faqTitle?: { eyebrow: string; title: string; emphasis: string };
  process: { title: string; steps: Array<{ number: string; title: string }> };
  faqs: Array<{ question: string; answer: string }>;
  cta: { title: string; body: string; calendar: Link; email: Link };
  footer: { disclosure: string; copyright: string };
  studio?: {
    eyebrow: string;
    title: string;
    body: string;
    steps: Array<{ number: string; title: string; body: string }>;
    inputsLabel: string;
    inputs: string;
    outputsLabel: string;
    outputs: string;
  };
};

export const DEFAULT_THEMES: Record<PageType, PageTheme> = {
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

export function resolveThemeStyle(page: LandingPage): string {
  const t = page.theme ?? DEFAULT_THEMES[page.pageType] ?? DEFAULT_THEMES.B;
  return [
    `--accent:${t.accent}`,
    `--accent-bright:${t.accentBright}`,
    `--accent-dark:${t.accentDark}`,
    `--accent-secondary:${t.accentSecondary}`,
    `--accent-rgb:${t.accentRgb}`,
    `--accent-bright-rgb:${t.accentBrightRgb}`,
    `--accent-secondary-rgb:${t.accentSecondaryRgb ?? '59, 130, 246'}`,
    `--ember:${t.ember ?? '#ff5a2f'}`
  ].join(';');
}

export function resolveProtocolThemeStyle(page: LandingPage): string {
  const t = page.theme;
  if (!t) return '';
  return [
    `--p-accent:${t.accent}`,
    `--p-accent-hover:${t.accentDark}`,
    `--p-accent-soft:${t.accentBright}`,
    `--p-accent-rgb:${t.accentRgb}`
  ].join(';');
}

export function validateLandingPage(page: unknown): asserts page is LandingPage {
  if (!page || typeof page !== 'object') throw new Error('Landing page config must be an object.');
  const candidate = page as Partial<LandingPage>;
  const required = ['slug', 'pageType', 'segment', 'language', 'seo', 'hero', 'concept', 'research', 'journey', 'response', 'comparison', 'useCases', 'video', 'library', 'process', 'faqs', 'cta', 'footer'] as const;
  for (const key of required) if (!(key in candidate)) throw new Error(`Landing page config is missing required field: ${key}`);
  if (typeof candidate.slug !== 'string' || !/^[a-z0-9-]+$/.test(candidate.slug)) throw new Error('Landing page slug must use lowercase letters, numbers, and hyphens.');
  if (!['A', 'B', 'C', 'D', 'E'].includes(candidate.pageType ?? '')) throw new Error(`Landing page "${candidate.slug}" needs one of the five brief page types (A–E).`);
  if (!candidate.seo?.title || !candidate.seo.description) throw new Error(`Landing page "${candidate.slug}" needs an SEO title and description.`);
  if (!candidate.hero?.title || !candidate.hero.body || !candidate.hero.primary?.href) throw new Error(`Landing page "${candidate.slug}" needs a complete hero and primary CTA.`);
  if (!Array.isArray(candidate.useCases) || candidate.useCases.length < 3 || candidate.useCases.length > 4) throw new Error(`Landing page "${candidate.slug}" must define three or four use cases.`);
  if (!Array.isArray(candidate.process?.steps) || candidate.process.steps.length !== 7) throw new Error(`Landing page "${candidate.slug}" must define the seven production steps from the brief.`);
  if (!Array.isArray(candidate.journey?.steps) || candidate.journey.steps.length !== 3) throw new Error(`Landing page "${candidate.slug}" must define three visual story steps.`);
  if (candidate.journey.steps.some((step) => !step.image || !step.imageAlt)) throw new Error(`Landing page "${candidate.slug}" needs a visual and alt text for every story step.`);
  if (!Array.isArray(candidate.response?.tabs) || candidate.response.tabs.length !== 3) throw new Error(`Landing page "${candidate.slug}" must define three example first-response questions.`);
  if (!candidate.video?.poster || !candidate.video?.transcript?.length) throw new Error(`Landing page "${candidate.slug}" needs a poster and text alternative for its sample video.`);
  if (!Array.isArray(candidate.library?.items) || candidate.library.items.some((item) => !item.poster || !item.alt)) throw new Error(`Landing page "${candidate.slug}" needs an image and alternative text for every library card.`);
  if (candidate.video.videoUrl && !candidate.video.captionsUrl) throw new Error(`Landing page "${candidate.slug}" needs captions when a sample video URL is configured.`);
  if (!Array.isArray(candidate.faqs) || candidate.faqs.length === 0) throw new Error(`Landing page "${candidate.slug}" must define at least one FAQ.`);
  if (candidate.studio && candidate.studio.steps.length !== 3) throw new Error(`Landing page "${candidate.slug}" needs three studio pipeline stages.`);
}
