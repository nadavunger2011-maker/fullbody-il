import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Award, CreditCard, Phone, Mail, MapPin } from 'lucide-react';

export default function ProFooter() {
  return (
    <footer className="bg-black text-white">
      {/* Trust Indicators Bar */}
      <div className="border-b border-primary-foreground/20 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: ShieldCheck, title: "תשלום מאובטח", text: "הצפנת SSL 256-bit" },
              { icon: Truck, title: "משלוח מהיר", text: "3-5 ימי עסקים" },
              { icon: Award, title: "מותגים מובילים", text: "Herbalife Nutrition" },
              { icon: CreditCard, title: "אפשרויות תשלום", text: "כרטיסי אשראי ופייפאל" },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <item.icon className="w-6 h-6 text-primary-foreground" />
                <h3 className="font-bold text-sm">{item.title}</h3>
                <p className="text-xs text-primary-foreground/70">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer - 3 Columns */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Column 1: Info & Navigation */}
            <div>
              <h4 className="font-bold text-lg mb-4 text-accent">מידע וניווט</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li><Link to="/" className="hover:text-primary-foreground transition">דף הבית</Link></li>
                <li><a href="/#products" className="hover:text-primary-foreground transition">חנות מוצרים</a></li>
                <li><Link to="/blog" className="hover:text-primary-foreground transition">מאמרים</Link></li>
                <li><Link to="/contact" className="hover:text-primary-foreground transition">צור קשר</Link></li>
              </ul>
            </div>

            {/* Column 2: Legal Policies */}
            <div>
              <h4 className="font-bold text-lg mb-4 text-accent">מדיניות משפטית</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li><Link to="/shipping-policy" className="hover:text-primary-foreground transition">מדיניות משלוחים</Link></li>
                <li><Link to="/return-policy" className="hover:text-primary-foreground transition">מדיניות החזרים וביטולים</Link></li>
                <li><Link to="/terms-of-use" className="hover:text-primary-foreground transition">תנאי שימוש</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-primary-foreground transition">מדיניות פרטיות</Link></li>
                <li><Link to="/accessibility" className="hover:text-primary-foreground transition">הצהרת נגישות</Link></li>
              </ul>
            </div>

            {/* Column 3: Contact Info */}
            <div>
              <h4 className="font-bold text-lg mb-4 text-accent">יצירת קשר</h4>
              <div className="text-sm text-primary-foreground/80 space-y-2">
                <p className="font-bold text-primary-foreground">נדב אונגר - מפיץ עצמאי הרבלייף</p>
                <p>ID מפיץ: 16Y0030013</p>
                <p>ח.פ: 200353720</p>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>זרחין 1, רעננה</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 shrink-0" />
                  <a href="mailto:info@fullbody.co.il" className="hover:text-primary-foreground transition">info@fullbody.co.il</a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 shrink-0" />
                  <a href="tel:0524487537" className="hover:text-primary-foreground transition">052-4487537</a>
                </div>
                <div className="mt-3 text-xs text-primary-foreground/60">
                  <p className="font-bold text-primary-foreground/70">שעות פעילות:</p>
                  <p>א'-ה': 09:00-18:00</p>
                  <p>ו': 09:00-13:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Disclaimer */}
          <div className="border-t border-primary-foreground/20 pt-8">
            <div className="max-w-3xl mx-auto text-center space-y-3">
              <p className="text-xs text-primary-foreground/60 leading-relaxed">
                כל ההתייחסויות לבקרת משקל קשורות לתוכנית בקרת המשקל של הרבלייף הכוללת, בין היתר, תזונה מאוזנת, פעילות גופנית קבועה, שתיית נוזלים מספקת, תוספי תזונה במידת הצורך ומנוחה נאותה. התוצאות הן אישיות ועשויות להשתנות.
              </p>
              <p className="text-xs text-primary-foreground/60 leading-relaxed">
                מוצרי הרבלייף אינם מיועדים לדיאגנוזה, לטיפול, לריפוי או למניעה של מחלות. האתר מופעל ע"י מפיץ עצמאי ואינו האתר הרשמי של חברת הרבלייף ישראל.
              </p>
              <p className="text-sm text-primary-foreground/60">
                © {new Date().getFullYear()} FullBody - נדב אונגר. כל הזכויות שמורות.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
