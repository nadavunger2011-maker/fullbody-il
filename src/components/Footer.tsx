import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Award, CreditCard, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Trust Indicators Bar */}
      <div className="border-b border-primary-foreground/20 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: ShieldCheck, title: "תשלום מאובטח", text: "הצפנת SSL 256-bit" },
              { icon: Truck, title: "משלוח מהיר", text: "עד 3 ימי עסקים" },
              { icon: Award, title: "מותגים מובילים", text: "איכות ללא פשרות" },
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

      {/* Main Footer */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* About */}
            <div>
              <h3 className="font-bold text-lg mb-4">FullBody</h3>
              <p className="text-primary-foreground/80 text-sm mb-4">
                חנות תוספי תזונה איכותיים לספורטאים ולאנשים פעילים. פועלים מאז 2018 עם אלפי לקוחות מרוצים בכל רחבי ישראל.
              </p>
              <div className="text-xs text-primary-foreground/60 space-y-1">
                <p>ח.פ./עוסק מורשה: 516247890</p>
                <p>© {new Date().getFullYear()} FullBody בע"מ</p>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-4">קישורים מהירים</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li><Link to="/nava" className="hover:text-primary-foreground transition">ראשי</Link></li>
                <li><Link to="/nava/products" className="hover:text-primary-foreground transition">מוצרים</Link></li>
                <li><Link to="/nava/about" className="hover:text-primary-foreground transition">אודות</Link></li>
                <li><Link to="/nava/faq" className="hover:text-primary-foreground transition">שאלות נפוצות</Link></li>
                <li><Link to="/nava/contact" className="hover:text-primary-foreground transition">צור קשר</Link></li>
              </ul>
            </div>
            
            {/* Policies */}
            <div>
              <h4 className="font-bold mb-4">מדיניות ותקנון</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li><Link to="/nava/shipping" className="hover:text-primary-foreground transition">מדיניות משלוחים</Link></li>
                <li><Link to="/nava/returns" className="hover:text-primary-foreground transition">מדיניות החזרות</Link></li>
                <li><Link to="/nava/terms" className="hover:text-primary-foreground transition">תנאי שימוש</Link></li>
                <li><Link to="/nava/privacy" className="hover:text-primary-foreground transition">מדיניות פרטיות</Link></li>
                <li><Link to="/nava/accessibility" className="hover:text-primary-foreground transition">הצהרת נגישות</Link></li>
              </ul>
            </div>
            
            {/* Contact */}
            <div>
              <h4 className="font-bold mb-4">יצירת קשר</h4>
              <ul className="space-y-3 text-sm text-primary-foreground/80">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary-foreground/80" />
                  <a href="tel:0524487537" className="hover:text-primary-foreground transition">052-4487537</a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary-foreground/80" />
                  <a href="mailto:info@fullbody.co.il" className="hover:text-primary-foreground transition">info@fullbody.co.il</a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-primary-foreground/80 mt-0.5" />
                  <span>רחוב זרחין 1, רעננה</span>
                </li>
              </ul>
              <div className="mt-4 text-xs text-primary-foreground/60">
                <p>שעות פעילות:</p>
                <p>א'-ה' 9:00-18:00</p>
                <p>ו' 9:00-13:00</p>
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-primary-foreground/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-primary-foreground/60">
                © {new Date().getFullYear()} FullBody בע"מ. כל הזכויות שמורות.
              </p>
              <div className="flex items-center gap-4 text-xs text-primary-foreground/60">
                <span>אבטחת תשלום על ידי SSL</span>
                <span>•</span>
                <span>איכות מובטחת</span>
                <span>•</span>
                <span>משלוח לכל הארץ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
