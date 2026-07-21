import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Award, CreditCard, Phone, Mail, MapPin } from 'lucide-react';
import { SWEETS_CATEGORIES } from './SweetsHeader';

export default function SweetsFooter() {
  return (
    <footer className="bg-black text-white">
      <div className="border-b border-primary-foreground/20 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: ShieldCheck, title: 'תשלום מאובטח', text: 'הצפנת SSL 256-bit' },
              { icon: Truck, title: 'משלוח מהיר', text: 'עד 3 ימי עסקים' },
              { icon: Award, title: 'מותג FullBody', text: 'בריא, טעים, אמיתי' },
              { icon: CreditCard, title: 'תשלום', text: 'אשראי / PayPal / Bit' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <item.icon className="w-6 h-6" />
                <h3 className="font-bold text-sm">{item.title}</h3>
                <p className="text-xs text-white/70">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-4 text-accent">קטגוריות</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li><Link to="/sweets/products" className="hover:text-white transition">כל המוצרים</Link></li>
                {SWEETS_CATEGORIES.map((c) => (
                  <li key={c.id}><Link to={c.href} className="hover:text-white transition">{c.name}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4 text-accent">מידע ומדיניות</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li><Link to="/sweets/story" className="hover:text-white transition">הסיפור שלנו</Link></li>
                <li><Link to="/sweets/shipping" className="hover:text-white transition">מדיניות משלוחים</Link></li>
                <li><Link to="/return-policy" className="hover:text-white transition">החזרות וביטולים</Link></li>
                <li><Link to="/terms-of-use" className="hover:text-white transition">תנאי שימוש</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-white transition">מדיניות פרטיות</Link></li>
                <li><Link to="/" className="hover:text-white transition">חזרה לאתר הראשי FullBody</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4 text-accent">יצירת קשר</h4>
              <div className="text-sm text-white/80 space-y-2">
                <p className="font-bold text-white">FullBody מתוקים · נדב אונגר</p>
                <p>ח.פ: 200353720</p>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 shrink-0" /><span>זרחין 1, רעננה</span></div>
                <div className="flex items-center gap-2"><Mail className="w-4 h-4 shrink-0" /><a href="mailto:info@fullbody.co.il" className="hover:text-white">info@fullbody.co.il</a></div>
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 shrink-0" /><a href="tel:0524487537" className="hover:text-white">052-4487537</a></div>
                <div className="mt-3 text-xs text-white/60">
                  <p className="font-bold text-white/70">שעות פעילות:</p>
                  <p>א'-ה': 09:00-18:00</p>
                  <p>ו': 09:00-13:00</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-6 text-center">
            <p className="text-sm text-white/60">© {new Date().getFullYear()} FullBody מתוקים · נדב אונגר. כל הזכויות שמורות.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
