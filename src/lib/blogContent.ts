import { herbalifeProducts, HerbalifeProduct } from '@/data/herbalifeProducts';
import { ARTICLE_MEDICAL_DISCLAIMER } from '@/lib/business';

const LEGAL_DISCLAIMER = ARTICLE_MEDICAL_DISCLAIMER;

const BROKEN_INLINE_IMAGE_PATTERN = /<img\b[^>]*src=["'](?:https?:\/\/fullbody\.co\.il)?\/images\/[^"']+["'][^>]*>/gi;
const BEFORE_AFTER_IMAGE_PATTERN = /<(?:img|figure)\b[^>]*(?:before[-_ ]?after|לפני[-_ ]?ואחרי)[\s\S]*?<\/(?:figure)>|<img\b[^>]*(?:before[-_ ]?after|לפני[-_ ]?ואחרי)[^>]*>/gi;
const RISKY_CLAIM_PATTERN = /(מאושר(?:ים)?\s+(?:על ידי\s+)?משרד הבריאות|מומלץ(?:ים)?\s+על ידי\s+רופאים|תוצאות?\s+מובטח(?:ות)?|לפני\s+ואחרי|(?:מטפל|מרפא|מונע)(?:ת|ים|ות)?\s+(?:ב|מחלה)|(?:מוריד|מפחית)(?:ה|ים)?\s+(?:כולסטרול|סוכר|לחץ דם)|\b(?:סוכרת|כולסטרול|לחץ דם)\b|\d+(?:[-–]\d+)?\s*(?:קילו|ק[״"]?ג)\s+(?:בשבוע|בחודש|תוך)|תוך\s+\d+\s+(?:ימים|שבועות|חודשים)\s+(?:תרגיש|תראו|תוצאה|שיפור))/i;

export function sanitizeClaimText(text: string): string {
  if (!RISKY_CLAIM_PATTERN.test(text)) return text;
  return 'מידע כללי על תזונה מאוזנת ואורח חיים פעיל. תוצאות משתנות מאדם לאדם.';
}

function removeRiskyClaimBlocks(html: string): string {
  return html.replace(/<(p|li|h2|h3|blockquote)\b[^>]*>[\s\S]*?<\/\1>/gi, (block) =>
    RISKY_CLAIM_PATTERN.test(block)
      ? '<p>יש לשלב כל מוצר בהתאם להוראות השימוש, כחלק מתזונה מאוזנת ואורח חיים פעיל.</p>'
      : block,
  );
}

export function normalizeBlogContent(html: string): string {
  return removeRiskyClaimBlocks(html
    .replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>\s*/i, '')
    .replace(BROKEN_INLINE_IMAGE_PATTERN, '')
    .replace(BEFORE_AFTER_IMAGE_PATTERN, '')
    .replace(/<figure([^>]*)>\s*<\/figure>/gi, ''));
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

const PRODUCT_ARTICLE_PATTERN = /(שייק|אבקת\s*חלבון|חטיפ(?:י|י\s*חלבון)|תוס(?:ף|פי)\s*תזונה|אלוורה|protein\s*(?:shake|powder|bar)|meal\s*replacement|supplements?|aloe)/i;
const EXCLUDED_PRODUCT_TOPIC_PATTERN = /(אימון|שינה|מטבח|הרגל|בריאות\s*כללית|תנועה|גמישות|סיבולת|מתכון)/i;

export function isProductRelevantArticle(title: string, slug: string): boolean {
  const subject = `${title} ${slug.replace(/-/g, ' ')}`;
  return PRODUCT_ARTICLE_PATTERN.test(subject) && !EXCLUDED_PRODUCT_TOPIC_PATTERN.test(subject);
}

export function isProteinArticle(title: string, slug: string): boolean {
  return /(חלבון|protein)/i.test(`${title} ${slug}`);
}

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
  if (html.includes('המידע אינו מהווה ייעוץ רפואי')) return html;
  return `${html}<div class="blog-disclaimer mt-8 pt-6 border-t border-border text-sm text-muted-foreground italic" role="note" aria-label="הצהרה משפטית"><strong class="text-foreground">הצהרה:</strong> ${LEGAL_DISCLAIMER}</div>`;
}

export { LEGAL_DISCLAIMER };
