import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, Phone, Mail, MapPin } from 'lucide-react';
import { BUSINESS, STORE_POLICIES } from '@/lib/business';

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
              { icon: ShieldCheck, title: "מפיץ עצמאי מורשה", text: "מוצרי Herbalife" },
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
                <li><a href="https://shop.fullbody.co.il" className="hover:text-primary-foreground transition">חנות המוצרים</a></li>
                <li><Link to="/bundles" className="hover:text-primary-foreground transition">המלצות שילוב</Link></li>
                <li><Link to="/blog" className="hover:text-primary-foreground transition">מאמרים</Link></li>
                <li><Link to="/about" className="hover:text-primary-foreground transition">אודות ופרטי העסק</Link></li>
                <li><Link to="/contact" className="hover:text-primary-foreground transition">צור קשר</Link></li>
              </ul>
            </div>

            {/* Column 2: Legal Policies */}
            <div>
              <h4 className="font-bold text-lg mb-4 text-accent">מדיניות משפטית</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li><Link to="/shipping-policy" className="hover:text-primary-foreground transition">מדיניות משלוחים</Link></li>
                <li><Link to="/return-policy" className="hover:text-primary-foreground transition">מדיניות החזרות וביטולים</Link></li>
                <li><a href={STORE_POLICIES.refund} className="hover:text-primary-foreground transition">מדיניות החזרים בחנות</a></li>
                <li><a href={STORE_POLICIES.shipping} className="hover:text-primary-foreground transition">מדיניות משלוחים בחנות</a></li>
                <li><Link to="/terms-of-use" className="hover:text-primary-foreground transition">תנאי שימוש</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-primary-foreground transition">מדיניות פרטיות</Link></li>
                <li><Link to="/accessibility" className="hover:text-primary-foreground transition">הצהרת נגישות</Link></li>
              </ul>
            </div>

            {/* Column 3: Contact Info */}
            <div>
              <h4 className="font-bold text-lg mb-4 text-accent">יצירת קשר</h4>
              <div className="text-sm text-primary-foreground/80 space-y-2">
                <p className="font-bold text-primary-foreground">{BUSINESS.name}</p>
                <p>עוסק מורשה: {BUSINESS.taxId}</p>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{BUSINESS.address}<br />{BUSINESS.addressNote}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 shrink-0" />
                  <a href={BUSINESS.emailHref} className="hover:text-primary-foreground transition">{BUSINESS.email}</a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 shrink-0" />
                  <a href={BUSINESS.phoneHref} className="hover:text-primary-foreground transition">{BUSINESS.phone}</a>
                </div>
                <div className="mt-3 text-xs text-primary-foreground/60">
                  <p className="font-bold text-primary-foreground/70">שעות פעילות:</p>
                  <p>{BUSINESS.hours}</p>
                </div>
                <div className="mt-3 text-xs text-primary-foreground/60 leading-relaxed">
                  <p>חנות אונליין ומשלוחים בלבד. אין קבלת קהל ואין איסוף עצמי.</p>
                  <p>משלוח חינם בהזמנות מעל ₪299, אחרת ₪29. אספקה 3-5 ימי עסקים; בתקופות עומס עד 14 ימי עסקים.</p>
                  <p>מטבע החיוב: שקל חדש (ILS), כולל מע"מ.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Disclaimer */}
          <div className="border-t border-primary-foreground/20 pt-8">
            <div className="max-w-3xl mx-auto text-center space-y-3">
              <p className="text-sm text-primary-foreground/75 leading-relaxed">{BUSINESS.disclosure}</p>

              <div className="text-xs text-primary-foreground/60 leading-relaxed space-y-2 text-right pt-2">
                <div>
                  <p className="font-bold text-primary-foreground/70">דיסקליימר תוצאות (עבור תוצאות במלל ו/או בתמונות):</p>
                  <p>
                    כל ההפניות לבקרת משקל קשורות לתוכנית ניהול משקל של הרבלייף, הכוללת, בין היתר, תזונה מאוזנת, פעילות גופנית קבועה, שתיית נוזלים מספקת בכל יום, תוספי תזונה אם צריך ומנוחה נאותה. תוצאות אישיות עשויות להשתנות.
                  </p>
                </div>
                <div>
                  <p className="font-bold text-primary-foreground/70">דיסקליימר רווחים (באם מפרסמים באתר את ההזדמנות העסקית):</p>
                  <p>
                    ההכנסות חלות על הפרטים (או הדוגמאות) המתוארים ואינן מהוות ממוצע. הישגים משמעותיים מגיעים מעבודה קשה, השקעה והתמדה, רוב המפיצים מרוויחים הכנסה נוספת כלשהי.
                  </p>
                  <p>
                    למידע נוסף{" "}
                    <a href="https://Herbalife.com/STE" target="_blank" rel="noopener noreferrer" className="underline">
                      Herbalife.com/STE
                    </a>
                    .
                  </p>
                </div>
              </div>
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
