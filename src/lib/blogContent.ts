import { herbalifeProducts, HerbalifeProduct } from '@/data/herbalifeProducts';

const LEGAL_DISCLAIMER = `המידע אינו מהווה התוויה רפואית. נשים בהריון, מניקות, נוטלי תרופות וילדים – יש להיוועץ ברופא.`;

const BROKEN_INLINE_IMAGE_PATTERN = /<img\b[^>]*src=["'](?:https?:\/\/fullbody\.co\.il)?\/images\/[^"']+["'][^>]*>/gi;

export function normalizeBlogContent(html: string): string {
  return html
    .replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>\s*/i, '')
    .replace(BROKEN_INLINE_IMAGE_PATTERN, '')
    .replace(/<figure([^>]*)>\s*<\/figure>/gi, '');
}

/**
 * Split HTML content into chunks separated by H2 boundaries.
 * Each chunk begins at an <h2> (except possibly the first one).
 * Also breaks long paragraphs (>500 chars) into shorter ones at sentence boundaries.
 */
export function splitContentByH2(html: string): string[] {
  const normalized = breakLongParagraphs(html);
  const parts = normalized.split(/(?=<h2)/i).filter(Boolean);
  return parts.length > 0 ? parts : [normalized];
}

function breakLongParagraphs(html: string): string {
  return html.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (match, inner: string) => {
    const text = inner.trim();
    if (text.length < 500) return match;
    // Split into sentences (Hebrew-friendly)
    const sentences = text.split(/(?<=[.!?])\s+/);
    if (sentences.length < 3) return match;
    const chunks: string[] = [];
    let buf = '';
    for (const s of sentences) {
      if ((buf + ' ' + s).length > 280 && buf) {
        chunks.push(buf.trim());
        buf = s;
      } else {
        buf = buf ? `${buf} ${s}` : s;
      }
    }
    if (buf) chunks.push(buf.trim());
    return chunks.map(c => `<p>${c}</p>`).join('');
  });
}

const PRODUCT_KEYWORDS: { keywords: RegExp; handles: string[] }[] = [
  { keywords: /(שייק|פורמולה\s*1|תחליף\s*ארוח|formula\s*1)/i, handles: ['formula-1-vanilla', 'formula-1-chocolate', 'formula-1-kosher'] },
  { keywords: /(חלבון|protein|בניית\s*שריר|מסת\s*שריר|pdm)/i, handles: ['pdm-protein', 'h24-rebuild-strength'] },
  { keywords: /(אלוורה|עיכול|מערכת\s*עיכול|aloe)/i, handles: ['aloe-natural', 'aloe-mango'] },
  { keywords: /(שינה|לילה|התאוששות|niteworks)/i, handles: ['niteworks'] },
  { keywords: /(אנרגיה|כושר|אימון|ספורט|h24|התאוששות\s*שריר)/i, handles: ['h24-rebuild-strength'] },
];

export function pickContextualProducts(content: string, fallbackHandles: string[] = [], max = 2): HerbalifeProduct[] {
  const matched: HerbalifeProduct[] = [];
  const seen = new Set<string>();
  for (const { keywords, handles } of PRODUCT_KEYWORDS) {
    if (!keywords.test(content)) continue;
    for (const h of handles) {
      const p = herbalifeProducts.find(x => x.handle === h);
      if (p && !seen.has(p.handle)) {
        seen.add(p.handle);
        matched.push(p);
        if (matched.length >= max) return matched;
      }
    }
  }
  // Fallback to related handles from the post
  for (const h of fallbackHandles) {
    if (matched.length >= max) break;
    const p = herbalifeProducts.find(x => x.handle === h);
    if (p && !seen.has(p.handle)) {
      seen.add(p.handle);
      matched.push(p);
    }
  }
  return matched;
}

export function appendDisclaimer(html: string): string {
  // Avoid duplicating the disclaimer if it already exists
  if (html.includes('המידע אינו מהווה התוויה רפואית')) return html;
  return `${html}<div class="blog-disclaimer mt-8 pt-6 border-t border-border text-sm text-muted-foreground italic" role="note" aria-label="הצהרה משפטית"><strong class="text-foreground">הצהרה:</strong> ${LEGAL_DISCLAIMER}</div>`;
}

export { LEGAL_DISCLAIMER };
