import greenLogo from '@/assets/logo-green.webp';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowRight,
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  RefreshCw,
  CreditCard,
  Leaf,
  UserCheck,
} from 'lucide-react';
import ProFooter from '@/components/ProFooter';

const BUSINESS = {
  legalName: 'נדב אונגר - FullBody (עוסק מורשה)',
  taxId: '200353720',
  address: 'רחוב זרחין 1, רעננה, ישראל',
  phone: '052-4487537',
  mobile: '054-2008578',
  email: 'info@fullbody.co.il',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'OnlineStore',
  name: 'FullBody',
  legalName: BUSINESS.legalName,
  url: 'https://fullbody.co.il',
  email: BUSINESS.email,
  telephone: '+972524487537',
  taxID: BUSINESS.taxId,
  vatID: BUSINESS.taxId,
  currenciesAccepted: 'ILS',
  paymentAccepted: 'Credit Card, PayPal, Bit',
  areaServed: { '@type': 'Country', name: 'IL' },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'זרחין 1',
    addressLocality: 'רעננה',
    addressCountry: 'IL',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+972524487537',
    email: BUSINESS.email,
    contactType: 'customer service',
    availableLanguage: ['he', 'en'],
    areaServed: 'IL',
  },
};

export default function ProAbout() {
  return (
    <div dir="rtl" className="font-sans text-foreground bg-background min-h-screen">
      <Helmet>
        <title>אודות FullBody | מי אנחנו ופרטי העסק</title>
        <meta
          name="description"
          content="FullBody בהפעלת נדב אונגר, מפיץ עצמאי הרבלייף. פרטי העסק המלאים, מודל הפעילות, אמצעי תשלום, משלוחים, החזרות ודרכי יצירת קשר."
        />
        <link rel="canonical" href="https://fullbody.co.il/about" />
        <meta property="og:title" content="אודות FullBody | מי אנחנו ופרטי העסק" />
        <meta
          property="og:description"
          content="פרטי העסק המלאים של FullBody: זהות בעל העסק, כתובת, טלפון, אמצעי תשלום, משלוחים והחזרות."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fullbody.co.il/about" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <header className="sticky top-0 z-40 bg-card shadow-card border-b border-border">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={greenLogo} alt="FullBody" className="h-10" />
            <div className="flex items-center gap-1">
              <Leaf className="w-5 h-5 text-accent" />
              <span className="text-sm font-bold text-accent">PRO</span>
            </div>
          </Link>
          <Link to="/" className="text-accent font-bold flex items-center gap-2 hover:underline">
            חזרה לחנות
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <section className="bg-primary py-14">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-primary-foreground mb-4">אודות FullBody</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            חנות אונליין לתוספי תזונה ותוכניות תזונה אישיות, בהפעלת נדב אונגר, מפיץ עצמאי של הרבלייף בישראל.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="container mx-auto px-4 max-w-4xl space-y-12">
          {/* Who we are */}
          <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-bold text-primary">מי מפעיל את האתר</h2>
            </div>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>
                האתר fullbody.co.il מופעל על ידי <strong className="text-foreground">נדב אונגר</strong>, מפיץ עצמאי מורשה
                של הרבלייף (Herbalife), הפועל מרעננה ומשווק תוספי תזונה ללקוחות פרטיים בכל רחבי ישראל.
              </p>
              <p>
                האתר אינו האתר הרשמי של הרבלייף ישראל ואינו מופעל על ידה. כל המוצרים הם מוצרי הרבלייף מקוריים,
                הנרכשים מהחברה ומשווקים על ידי המפיץ העצמאי.
              </p>
              <p>
                בנוסף למכירת מוצרים, אנו מציעים ליווי ותוכניות תזונה ואימון אישיות דרך{' '}
                <Link to="/plan" className="text-accent underline">
                  שאלון התוכנית האישית
                </Link>
                . מוצרי הרבלייף אינם תרופות ואינם מיועדים לאבחון, טיפול, ריפוי או מניעה של מחלות.
              </p>
            </div>
          </div>

          {/* Business details */}
          <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-bold text-primary">פרטי העסק המלאים</h2>
            </div>
            <ul className="text-muted-foreground leading-relaxed space-y-2">
              <li>
                <strong className="text-foreground">שם העסק:</strong> {BUSINESS.legalName}
              </li>
              <li>
                <strong className="text-foreground">מספר עוסק / ח.פ:</strong> {BUSINESS.taxId}
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 text-accent shrink-0" />
                <span>
                  <strong className="text-foreground">כתובת העסק (למשלוחי דואר והחזרות):</strong> {BUSINESS.address}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-1 text-accent shrink-0" />
                <span>
                  <strong className="text-foreground">טלפון:</strong>{' '}
                  <a href="tel:0524487537" className="text-accent hover:underline">
                    {BUSINESS.phone}
                  </a>{' '}
                  | נייד:{' '}
                  <a href="tel:0542008578" className="text-accent hover:underline">
                    {BUSINESS.mobile}
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-1 text-accent shrink-0" />
                <span>
                  <strong className="text-foreground">דוא"ל:</strong>{' '}
                  <a href={`mailto:${BUSINESS.email}`} className="text-accent hover:underline">
                    {BUSINESS.email}
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-1 text-accent shrink-0" />
                <span>
                  <strong className="text-foreground">שעות מענה:</strong> א'-ה' 09:00-18:00, ו' 09:00-13:00
                </span>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
              הפעילות היא מכירה מקוונת ומשלוחים בלבד. אין חנות פיזית שבה מתקבלים לקוחות; הכתובת לעיל היא כתובת העסק
              לצורכי דיוור, החזרות ופניות רשמיות. איסוף עצמי אפשרי בתיאום מוקדם בטלפון.
            </p>
          </div>

          {/* How it works */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: CreditCard,
                title: 'תשלום ואבטחה',
                text: 'התשלום מתבצע בכרטיסי אשראי, PayPal או Bit דרך עמוד תשלום מאובטח בהצפנת SSL. פרטי האשראי אינם נשמרים באתר.',
              },
              {
                icon: Truck,
                title: 'משלוחים',
                text: 'משלוח עד הבית לכל חלקי הארץ תוך 3-5 ימי עסקים, עם מספר מעקב שנשלח במייל או ב-SMS.',
              },
              {
                icon: RefreshCw,
                title: 'החזרות וביטולים',
                text: 'ביטול עסקה והחזרת מוצרים בהתאם לחוק הגנת הצרכן. הפרטים המלאים במדיניות ההחזרים.',
              },
              {
                icon: ShieldCheck,
                title: 'מוצרים מקוריים',
                text: 'כל המוצרים הם מוצרי הרבלייף מקוריים, באריזה מקורית וסגורה, עם תאריך תפוגה בתוקף.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-6 shadow-card">
                <item.icon className="w-7 h-7 text-accent mb-3" />
                <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>

          {/* Policies */}
          <div className="bg-secondary/50 border border-border rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-primary mb-4">מדיניות ותקנון</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { to: '/shipping-policy', label: 'מדיניות משלוחים' },
                { to: '/return-policy', label: 'החזרים וביטולים' },
                { to: '/terms-of-use', label: 'תנאי שימוש' },
                { to: '/privacy-policy', label: 'מדיניות פרטיות' },
                { to: '/accessibility', label: 'הצהרת נגישות' },
                { to: '/contact', label: 'יצירת קשר' },
              ].map((l) => (
                <Link key={l.to} to={l.to} className="text-accent hover:underline font-bold">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ProFooter />
    </div>
  );
}
