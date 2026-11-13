export type Link = { label: string; href: string };
export type LandingPage = {
  slug: string;
  segment: string;
  language: string;
  seo: { title: string; description: string };
  hero: { eyebrow: string; title: string; emphasis: string; body: string; primary: Link; secondary: Link };
  concept: { eyebrow: string; title: string; steps: string[]; body: string };
  research: { value: string; body: string; source: Link };
  journey: { eyebrow: string; title: string; emphasis: string; body: string; steps: Array<{ tab: string; zone: string; title: string; copy: string; image: string; imageAlt: string }> };
  response: { eyebrow: string; title: string; body: string; beforeLabel: string; beforeMessage: string; beforeNote: string; tabs: Array<{ label: string; question: string; answer: string; asset: string }> };
  trigger?: { eyebrow: string; title: string; body: string; dateStamp: string; dateLabel: string; source: Link };
  comparison: { title: string; body: string; leftTitle: string; leftItems: string[]; rightTitle: string; rightItems: string[]; note: string };
  useCases: Array<{ number: string; title: string; body: string; tag: string }>;
  video: { title: string; description: string; duration: string; poster: string; label: string; videoUrl?: string; captionsUrl?: string; transcript: string[] };
  library: { title: string; body: string; items: Array<{ number: string; title: string; detail: string; poster: string; alt: string }> };
  process: { title: string; steps: Array<{ number: string; title: string }> };
  faqs: Array<{ question: string; answer: string }>;
  cta: { title: string; body: string; calendar: Link; email: Link };
  footer: { disclosure: string; copyright: string };
};

export function validateLandingPage(page: unknown): asserts page is LandingPage {
  if (!page || typeof page !== 'object') throw new Error('Landing page config must be an object.');
  const candidate = page as Partial<LandingPage>;
  const required = ['slug', 'segment', 'language', 'seo', 'hero', 'concept', 'research', 'journey', 'response', 'comparison', 'useCases', 'video', 'library', 'process', 'faqs', 'cta', 'footer'] as const;
  for (const key of required) if (!(key in candidate)) throw new Error(`Landing page config is missing required field: ${key}`);
  if (typeof candidate.slug !== 'string' || !/^[a-z0-9-]+$/.test(candidate.slug)) throw new Error('Landing page slug must use lowercase letters, numbers, and hyphens.');
  if (!candidate.seo?.title || !candidate.seo.description) throw new Error(`Landing page "${candidate.slug}" needs an SEO title and description.`);
  if (!candidate.hero?.title || !candidate.hero.body || !candidate.hero.primary?.href) throw new Error(`Landing page "${candidate.slug}" needs a complete hero and primary CTA.`);
  if (!Array.isArray(candidate.useCases) || candidate.useCases.length !== 3) throw new Error(`Landing page "${candidate.slug}" must define exactly three use cases.`);
  if (!Array.isArray(candidate.process?.steps) || candidate.process.steps.length !== 7) throw new Error(`Landing page "${candidate.slug}" must define the seven production steps from the brief.`);
  if (!Array.isArray(candidate.journey?.steps) || candidate.journey.steps.length !== 3) throw new Error(`Landing page "${candidate.slug}" must define three machine-story steps.`);
  if (candidate.journey.steps.some((step) => !step.image || !step.imageAlt)) throw new Error(`Landing page "${candidate.slug}" needs a visual and alt text for every machine-story step.`);
  if (!Array.isArray(candidate.response?.tabs) || candidate.response.tabs.length !== 3) throw new Error(`Landing page "${candidate.slug}" must define three example first-response questions.`);
  if (!candidate.video?.poster || !candidate.video?.transcript?.length) throw new Error(`Landing page "${candidate.slug}" needs a poster and text alternative for its sample video.`);
  if (!Array.isArray(candidate.library?.items) || candidate.library.items.some((item) => !item.poster || !item.alt)) throw new Error(`Landing page "${candidate.slug}" needs an image and alternative text for every library card.`);
  if (candidate.video.videoUrl && !candidate.video.captionsUrl) throw new Error(`Landing page "${candidate.slug}" needs captions when a sample video URL is configured.`);
  if (!Array.isArray(candidate.faqs) || candidate.faqs.length === 0) throw new Error(`Landing page "${candidate.slug}" must define at least one FAQ.`);
}
