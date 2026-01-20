import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, ArrowLeft, Menu, X, Search, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  date: string;
  readTime: number;
  relatedProducts: string[];
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export const blogCategories: BlogCategory[] = [
  { id: 'nutrition', name: 'תזונה', slug: 'nutrition' },
  { id: 'training', name: 'אימון', slug: 'training' },
  { id: 'supplements', name: 'תוספים', slug: 'supplements' },
  { id: 'lifestyle', name: 'סגנון חיים', slug: 'lifestyle' },
];

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'protein-guide-beginners',
    title: 'המדריך המלא לאבקות חלבון למתחילים',
    excerpt: 'כל מה שצריך לדעת על אבקות חלבון: סוגים, יתרונות, ואיך לבחור את האבקה הנכונה עבורכם.',
    content: `
      <h2>מהי אבקת חלבון?</h2>
      <p>אבקת חלבון היא תוסף תזונה המכיל ריכוז גבוה של חלבון, המופק ממקורות שונים כמו חלב, ביצים, או צמחים.</p>
      
      <h2>סוגי אבקות חלבון</h2>
      <ul>
        <li><strong>Whey Protein</strong> - חלבון מי גבינה, הנפוץ והפופולרי ביותר</li>
        <li><strong>Casein</strong> - חלבון קזאין, נספג לאט יותר</li>
        <li><strong>Plant-Based</strong> - חלבון מהצומח לטבעוניים</li>
      </ul>
      
      <h2>מתי לצרוך חלבון?</h2>
      <p>הזמן האופטימלי הוא תוך שעה לאחר האימון, אך ניתן לצרוך גם כארוחת ביניים או כתוספת לארוחות.</p>
    `,
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800',
    category: 'supplements',
    date: '2025-01-15',
    readTime: 5,
    relatedProducts: ['whey', 'protein', 'חלבון']
  },
  {
    id: '2',
    slug: 'best-pre-workout-tips',
    title: '5 טיפים לאימון מושלם עם פרה-וורקאאוט',
    excerpt: 'איך להפיק את המקסימום מתוסף הפרה-וורקאאוט שלכם ולשפר את הביצועים באימון.',
    content: `
      <h2>מהו פרה-וורקאאוט?</h2>
      <p>פרה-וורקאאוט הוא תוסף שנלקח לפני האימון ומכיל רכיבים כמו קפאין, בטא-אלנין וקריאטין לשיפור הביצועים.</p>
      
      <h2>5 הטיפים שלנו</h2>
      <ul>
        <li><strong>תזמון</strong> - קחו 20-30 דקות לפני האימון</li>
        <li><strong>הידרציה</strong> - שתו הרבה מים</li>
        <li><strong>לא על קיבה ריקה</strong> - אכלו משהו קל לפני</li>
        <li><strong>התחילו בכמות נמוכה</strong> - בדקו את הסבילות שלכם</li>
        <li><strong>הימנעו בשעות הערב</strong> - הקפאין עלול להפריע לשינה</li>
      </ul>
    `,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
    category: 'training',
    date: '2025-01-10',
    readTime: 4,
    relatedProducts: ['pre-workout', 'אנרגיה', 'קפאין']
  },
  {
    id: '3',
    slug: 'creatine-benefits',
    title: 'היתרונות של קריאטין: למה כל ספורטאי צריך',
    excerpt: 'קריאטין הוא אחד התוספים הנחקרים ביותר. גלו את כל היתרונות שלו לבניית שריר וכוח.',
    content: `
      <h2>מהו קריאטין?</h2>
      <p>קריאטין הוא חומר טבעי המיוצר בגוף ונמצא גם בבשר ודגים. כתוסף, הוא מסייע לייצור אנרגיה בשרירים.</p>
      
      <h2>יתרונות מוכחים</h2>
      <ul>
        <li>הגדלת כוח ועוצמה</li>
        <li>שיפור ביצועים באימונים אינטנסיביים</li>
        <li>תמיכה בבניית מסת שריר</li>
        <li>שיפור ההתאוששות</li>
      </ul>
      
      <h2>איך לקחת?</h2>
      <p>המינון המומלץ הוא 3-5 גרם ביום, ללא צורך בשלב טעינה.</p>
    `,
    image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800',
    category: 'supplements',
    date: '2025-01-05',
    readTime: 6,
    relatedProducts: ['creatine', 'קריאטין', 'כוח']
  }
];

export default function Blog() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredPosts = selectedCategory 
    ? blogPosts.filter(post => post.category === selectedCategory)
    : blogPosts;

  return (
    <div dir="rtl" className="font-sans text-foreground bg-background min-h-screen">
      <Helmet>
        <title>הבלוג | FullBody - מאמרים על תזונה, אימון ואורח חיים בריא</title>
        <meta name="description" content="מאמרים מקצועיים על תזונת ספורטאים, תוספי תזונה, טיפים לאימון ואורח חיים בריא. כל מה שצריך לדעת על חלבונים, קריאטין ועוד." />
        <link rel="canonical" href="https://fullbody.co.il/blog" />
      </Helmet>
      {/* Announcement Bar */}
      <div className="bg-primary text-primary-foreground text-center py-2.5 text-sm font-medium">
        משלוח חינם בקנייה מעל ₪299 | כשר למהדרין
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-card shadow-card border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 text-muted-foreground hover:text-accent transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link to="/" className="flex items-center">
            <span className="text-2xl font-black text-primary">FullBody</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 font-bold text-muted-foreground">
            <Link to="/" className="hover:text-accent transition-colors">ראשי</Link>
            <Link to="/" className="hover:text-accent transition-colors">חנות</Link>
            <Link to="/blog" className="text-accent transition-colors">מאמרים</Link>
            <Link to="/faq" className="hover:text-accent transition-colors">שאלות נפוצות</Link>
            <Link to="/contact" className="hover:text-accent transition-colors">צור קשר</Link>
          </nav>

          <div className="flex items-center gap-4">
            <button className="p-2 text-muted-foreground hover:text-accent transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link to="/" className="p-2 text-muted-foreground hover:text-accent transition-colors">
              <ShoppingBag className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-foreground/50 z-40"
          />
          <div className="fixed top-0 right-0 w-72 h-full bg-card shadow-2xl z-50 p-6">
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-5 left-5"
            >
              <X className="w-6 h-6" />
            </button>
            <nav className="mt-12 space-y-4">
              <Link to="/" className="block py-3 text-lg font-bold hover:text-accent">ראשי</Link>
              <Link to="/" className="block py-3 text-lg font-bold hover:text-accent">חנות</Link>
              <Link to="/blog" className="block py-3 text-lg font-bold text-accent">מאמרים</Link>
              <Link to="/faq" className="block py-3 text-lg font-bold hover:text-accent">שאלות נפוצות</Link>
            </nav>
          </div>
        </>
      )}

      {/* Hero */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-primary-foreground mb-4">
            הבלוג שלנו
          </h1>
          <p className="text-xl text-primary-foreground/80">
            מאמרים, טיפים ומידע על תזונה, אימון ואורח חיים בריא
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-5 py-2 rounded-full font-bold transition ${
                selectedCategory === null
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              הכל
            </button>
            {blogCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2 rounded-full font-bold transition ${
                  selectedCategory === cat.id
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => {
              const category = blogCategories.find(c => c.id === post.category);
              return (
                <article 
                  key={post.id}
                  className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-hover transition-all duration-300"
                >
                  <Link to={`/blog/${post.slug}`}>
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </Link>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                      <span className="bg-accent/10 text-accent px-3 py-1 rounded-full font-bold">
                        {category?.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.date).toLocaleDateString('he-IL')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime} דק'
                      </span>
                    </div>
                    
                    <Link to={`/blog/${post.slug}`}>
                      <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors">
                        {post.title}
                      </h2>
                    </Link>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-accent font-bold hover:gap-3 transition-all"
                    >
                      קראו עוד
                      <ArrowLeft className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-primary-foreground/60">
            © {new Date().getFullYear()} FullBody. כל הזכויות שמורות.
          </p>
        </div>
      </footer>
    </div>
  );
}
