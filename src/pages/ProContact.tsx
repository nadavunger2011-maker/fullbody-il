import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Phone, Mail, MapPin, Clock, Send, Leaf } from 'lucide-react';
import { toast } from 'sonner';
import ProFooter from '@/components/ProFooter';

export default function ProContact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappMessage = encodeURIComponent(`היי, שמי ${formData.name}. ${formData.message}`);
    window.open(`https://wa.me/972524487537?text=${whatsappMessage}`, '_blank');
    toast.success('ההודעה נשלחה בהצלחה! ניצור איתך קשר בהקדם.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div dir="rtl" className="font-sans text-foreground bg-background min-h-screen">
      <Helmet>
        <title>צור קשר | FullBody Pro - Herbalife Nutrition</title>
        <meta name="description" content="צרו קשר עם FullBody Pro בטלפון 052-4487537 או במייל info@fullbody.co.il. מפיץ מורשה של Herbalife Nutrition בישראל." />
        <link rel="canonical" href="https://fullbody.co.il/pro/contact" />
      </Helmet>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-card shadow-card border-b border-border">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="https://fullbody.co.il/assets/logo-C2aje_0c.png" alt="FullBody Pro" className="h-10" />
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

      {/* Hero */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-primary-foreground mb-4">צור קשר</h1>
          <p className="text-xl text-primary-foreground/80">נשמח לשמוע מכם ולעזור בכל שאלה</p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-primary mb-8">פרטי התקשרות</h2>
              <div className="space-y-6">
                {[
                  { icon: Phone, title: "טלפון", text: "052-4487537", link: "tel:0524487537" },
                  { icon: Mail, title: "אימייל", text: "info@fullbody.co.il", link: "mailto:info@fullbody.co.il" },
                  { icon: MapPin, title: "כתובת", text: "רחוב זרחין 1, רעננה", link: null },
                  { icon: Clock, title: "שעות פעילות", text: "א'-ה' 9:00-18:00, ו' 9:00-13:00", link: null },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{item.title}</h3>
                      {item.link ? (
                        <a href={item.link} className="text-muted-foreground hover:text-accent transition-colors">
                          {item.text}
                        </a>
                      ) : (
                        <p className="text-muted-foreground">{item.text}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <div className="mt-8 p-6 bg-accent/10 rounded-xl border border-accent/20">
                <h3 className="font-bold text-foreground mb-2">💬 דברו איתנו בוואטסאפ</h3>
                <p className="text-sm text-muted-foreground mb-4">תשובה מהירה תוך דקות בשעות הפעילות</p>
                <a
                  href="https://wa.me/972524487537?text=%D7%94%D7%99%D7%99%2C%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A7%D7%91%D7%9C%20%D7%99%D7%99%D7%A2%D7%95%D7%A5%20%D7%9C%D7%92%D7%91%D7%99%20%D7%9E%D7%95%D7%A6%D7%A8%D7%99%20Herbalife"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-bold py-3 px-6 rounded-lg hover:bg-accent/90 transition-all"
                >
                  שלחו הודעה בוואטסאפ
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card rounded-xl p-8 shadow-card border border-border">
              <h2 className="text-2xl font-bold text-primary mb-6">שלחו לנו הודעה</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">שם מלא</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                    placeholder="הכניסו את שמכם"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">אימייל</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                    placeholder="example@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">טלפון</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                    placeholder="050-0000000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">הודעה</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all resize-none"
                    placeholder="במה נוכל לעזור?"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-4 rounded-lg shadow-cta transition-all flex items-center justify-center gap-2"
                >
                  שליחה
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <ProFooter />
    </div>
  );
}
