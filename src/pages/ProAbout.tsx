import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  RefreshCw,
  CreditCard,
  UserCheck,
} from 'lucide-react';
import ProFooter from '@/components/ProFooter';
import ContentHeader from '@/components/ContentHeader';
import { BUSINESS, TRANSPARENCY_DISCLOSURE } from '@/lib/business';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'FullBody',
  legalName: BUSINESS.name,
  url: 'https://fullbody.co.il',
  email: BUSINESS.email,
  telephone: '+972542008578',
  taxID: BUSINESS.taxId,
  vatID: BUSINESS.taxId,
  areaServed: { '@type': 'Country', name: 'IL' },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'רחוב זרחין 1, קומה 3',
    addressLocality: 'רעננה',
    postalCode: '4366238',
    addressCountry: 'IL',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+972542008578',
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

      <ContentHeader />

      <section className="bg-primary py-14">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-primary-foreground mb-4">אודות FullBody</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            מי עומד מאחורי המדריכים, ולמה הקמתי את האתר
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
                אני <strong className="text-foreground">נדב אונגר</strong>. הקמתי את FullBody כדי לעזור לאנשים להבין תזונה,
                חלבון ואימונים בלי ללכת לאיבוד בין הבטחות, טרנדים ודיאטות קיצוניות.
              </p>
              <p>
                כאן אני מפרסם מדריכים, מתכונים וכלים מעשיים שאפשר לבדוק וליישם בשגרה. המטרה היא לתת נקודת התחלה
                ברורה וכנה; המידע כללי ואינו מחליף ייעוץ רפואי או תזונתי אישי.
              </p>
              <p>
                {TRANSPARENCY_DISCLOSURE}
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
                <strong className="text-foreground">שם העסק:</strong> {BUSINESS.name}
              </li>
              <li>
                <strong className="text-foreground">מספר עוסק / ח.פ:</strong> {BUSINESS.taxId}
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 text-accent shrink-0" />
                <span>
                  <strong className="text-foreground">כתובת המשרד:</strong> {BUSINESS.address}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-1 text-accent shrink-0" />
                <span>
                  <strong className="text-foreground">טלפון:</strong>{' '}
                  <a href="tel:0542008578" className="text-accent hover:underline">
                    {BUSINESS.phone}
                  </a>{' '}
                 
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
              לצורכי דיוור ופניות רשמיות בלבד. אין קבלת קהל ואין איסוף עצמי.
            </p>
          </div>

          {/* How it works */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: CreditCard,
                title: 'תשלום ואבטחה',
                text: 'התשלום מתבצע בחנות Shopify בכתובת shop.fullbody.co.il. פרטי התשלום אינם נשמרים באתר התוכן.',
              },
              {
                icon: Truck,
                title: 'משלוחים',
                text: 'משלוח עד הבית עולה 29 ₪ וחינם מעל 299 ₪. אספקה בתוך 3-5 ימי עסקים, ובעומס עד 14 ימי עסקים.',
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
