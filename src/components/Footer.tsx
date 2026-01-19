import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">FullBody</h3>
            <p className="text-primary-foreground/80 text-sm">
              תוספי תזונה איכותיים לספורטאים ולאנשים פעילים
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">קישורים מהירים</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link to="/" className="hover:text-primary-foreground transition">ראשי</Link></li>
              <li><Link to="/faq" className="hover:text-primary-foreground transition">שאלות נפוצות</Link></li>
              <li><Link to="/contact" className="hover:text-primary-foreground transition">צור קשר</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">מידע</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link to="/shipping" className="hover:text-primary-foreground transition">משלוחים</Link></li>
              <li><Link to="/returns" className="hover:text-primary-foreground transition">החזרות</Link></li>
              <li><Link to="/terms" className="hover:text-primary-foreground transition">תנאי שימוש</Link></li>
              <li><Link to="/privacy" className="hover:text-primary-foreground transition">מדיניות פרטיות</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">יצירת קשר</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>טלפון: 052-4487537</li>
              <li>דוא"ל: info@fullbody.co.il</li>
              <li>כתובת: רחוב זרחין 1, רעננה</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 pt-8 text-center">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} FullBody. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </footer>
  );
}
