import { writeFileSync } from 'node:fs';
import { GUIDE_POSTS } from '../src/data/guidePosts';
import { TRANSPARENCY_DISCLOSURE } from '../src/lib/business';

export const AI_GUIDES: Record<string, string> = {
  'creatine-guide': 'מהו קריאטין, מינון, סוגים ובטיחות.',
  'best-creatine-iherb': 'השוואת מוצרי קריאטין לפי הרכב, בדיקות ומחיר.',
  'creatine-for-women': 'התאמה לנשים, שימוש ושאלות נפוצות.',
  'does-creatine-cause-weight-gain': 'ההבדל בין אגירת מים לעלייה בשומן.',
  'best-protein-powder-iherb': 'השוואת אבקות לפי מחיר לגרם חלבון.',
  'protein-powder-types-guide': 'הבדלים בין סוגי אבקות חלבון ובחירה מתאימה.',
  'whey-vs-plant-protein': 'השוואת חלבון צמחי וחלבון מי גבינה.',
  'casein-protein-before-sleep': 'המחקר על חלבון לפני שינה וחלופות מהמזון.',
  'protein-powder-for-women': 'צרכים, התאמה ובחירת אבקת חלבון לנשים.',
  'protein-bars-guide': 'איך לקרוא תווית ומתי חטיף חלבון שימושי.',
  'mass-gainer-guide': 'למי גיינר מתאים ואיך להכין חלופה ביתית.',
  'gym-supplements-what-works': 'תוספי תזונה למתאמנים: ראיות, התאמה ומגבלות.',
  'pre-workout-guide': 'מרכיבי קדם אימון, יעילות וזהירות.',
  'multivitamin-for-athletes': 'מתי מולטי ויטמין עשוי להתאים ומה לבדוק.',
  'magnesium-types-guide': 'הבדלים בין צורות מגנזיום ובחירת סוג.',
  'best-magnesium-iherb': 'השוואת מוצרי מגנזיום, הרכב ומחיר.',
  'magnesium-for-sleep': 'מה ידוע על מגנזיום ושינה ולמי הוא מתאים.',
};

export function buildLlms() {
  const links = Object.entries(AI_GUIDES).map(([slug, description]) => {
    const guide = GUIDE_POSTS.find(p => p.slug === slug);
    if (!guide) throw new Error(`Missing public guide: ${slug}`);
    return `- [${guide.title}](https://fullbody.co.il/blog/${slug}): ${description}`;
  });
  return ['# FullBody', '', '> מדריכי תזונה וכושר עצמאיים בעברית לקוראים בישראל.', '',
    'FullBody publishes independent Hebrew nutrition and fitness guides for readers in Israel.', '',
    'האתר מציע מדריכים מעשיים על חלבון, קריאטין, מגנזיום ותוספי תזונה, לצד מחשבון חלבון. המידע כללי ואינו ייעוץ רפואי.', '',
    TRANSPARENCY_DISCLOSURE, '', '## מדריכים', '', ...links, '', '## כלים', '',
    '- [מחשבון חלבון יומי](https://fullbody.co.il/protein-calculator): הערכה כללית לצריכת חלבון לפי משקל, פעילות ומטרה.', ''].join('\n');
}

if (process.argv[1]?.endsWith('build-llms.ts')) writeFileSync('public/llms.txt', buildLlms());