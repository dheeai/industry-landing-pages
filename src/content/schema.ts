export type Link = { label: string; href: string };
export type LandingPage = {
  slug: string;
  segment: string;
  language: string;
  seo: { title: string; description: string };
  hero: { eyebrow: string; title: string; emphasis: string; body: string; primary: Link; secondary: Link };
  concept: { title: string; steps: string[]; body: string };
  trigger?: { eyebrow: string; title: string; body: string; dateLabel: string; source: Link };
  useCases: Array<{ number: string; title: string; body: string; tag: string }>;
  video: { title: string; description: string; duration: string; poster: string; label: string; videoUrl?: string; captionsUrl?: string; transcript: string[] };
  library: { title: string; body: string; items: Array<{ number: string; title: string; detail: string }> };
  process: { title: string; steps: Array<{ number: string; title: string }> };
  faqs: Array<{ question: string; answer: string }>;
  cta: { title: string; body: string; primary: Link; email: Link };
  footer: { disclosure: string; copyright: string };
};

export function validateLandingPage(page: unknown): asserts page is LandingPage {
  if (!page || typeof page !== 'object') throw new Error('Landing page config must be an object.');
  const candidate = page as Partial<LandingPage>;
  const required = ['slug', 'segment', 'language', 'seo', 'hero', 'concept', 'useCases', 'video', 'library', 'process', 'faqs', 'cta', 'footer'] as const;
  for (const key of required) if (!(key in candidate)) throw new Error(`Landing page config is missing required field: ${key}`);
  if (typeof candidate.slug !== 'string' || !/^[a-z0-9-]+$/.test(candidate.slug)) throw new Error('Landing page slug must use lowercase letters, numbers, and hyphens.');
  if (!candidate.seo?.title || !candidate.seo.description) throw new Error(`Landing page "${candidate.slug}" needs an SEO title and description.`);
  if (!candidate.hero?.title || !candidate.hero.body || !candidate.hero.primary?.href) throw new Error(`Landing page "${candidate.slug}" needs a complete hero and primary CTA.`);
  if (!Array.isArray(candidate.useCases) || candidate.useCases.length !== 3) throw new Error(`Landing page "${candidate.slug}" must define exactly three use cases.`);
  if (!candidate.video?.poster || !candidate.video?.transcript?.length) throw new Error(`Landing page "${candidate.slug}" needs a poster and text alternative for its sample video.`);
  if (candidate.video.videoUrl && !candidate.video.captionsUrl) throw new Error(`Landing page "${candidate.slug}" needs captions when a sample video URL is configured.`);
  if (!Array.isArray(candidate.faqs) || candidate.faqs.length === 0) throw new Error(`Landing page "${candidate.slug}" must define at least one FAQ.`);
}
