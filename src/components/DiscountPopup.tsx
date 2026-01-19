import { useState, useEffect } from 'react';
import { X, Gift, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

const POPUP_STORAGE_KEY = 'flashy_popup_shown';
const POPUP_DELAY_MS = 5000;
const POPUP_EXPIRY_DAYS = 30;

const DiscountPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    // Check if popup was already shown
    const popupData = localStorage.getItem(POPUP_STORAGE_KEY);
    if (popupData) {
      const { timestamp } = JSON.parse(popupData);
      const daysSinceShown = (Date.now() - timestamp) / (1000 * 60 * 60 * 24);
      if (daysSinceShown < POPUP_EXPIRY_DAYS) {
        return; // Don't show popup
      }
    }

    // Show popup after delay
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, POPUP_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');

    if (!email.trim()) {
      setEmailError('נא להזין כתובת אימייל');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('כתובת אימייל לא תקינה');
      return;
    }

    setIsSubmitting(true);

    try {
      // Send to Flashy - Subscribe contact to list
      if (typeof window !== 'undefined' && window.flashy?.contacts) {
        const contactData: { email: string; first_name?: string } = {
          email: email.trim(),
        };
        if (firstName.trim()) {
          contactData.first_name = firstName.trim();
        }
        window.flashy.contacts.create(contactData, 34516);
      }

      // Mark popup as shown
      localStorage.setItem(POPUP_STORAGE_KEY, JSON.stringify({
        timestamp: Date.now(),
        subscribed: true
      }));

      setIsSubmitted(true);
      
      // Close after showing success
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    } catch (error) {
      console.error('Error subscribing to Flashy:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Mark popup as shown even if closed without subscribing
    localStorage.setItem(POPUP_STORAGE_KEY, JSON.stringify({
      timestamp: Date.now(),
      subscribed: false
    }));
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent 
        className="sm:max-w-md p-0 overflow-hidden border-0 rounded-2xl"
        dir="rtl"
      >
        <DialogTitle className="sr-only">הרשמה לניוזלטר</DialogTitle>
        
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute left-4 top-4 z-10 p-1.5 rounded-full bg-background/80 hover:bg-background transition-colors"
          aria-label="סגור"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>

        {/* Header with gradient */}
        <div className="relative bg-gradient-to-br from-primary to-accent p-8 text-center">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 right-8">
              <Sparkles className="h-6 w-6 text-primary-foreground animate-pulse" />
            </div>
            <div className="absolute bottom-6 left-12">
              <Sparkles className="h-4 w-4 text-primary-foreground animate-pulse delay-300" />
            </div>
          </div>
          
          <div className="relative">
            <div className="mx-auto w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center mb-4 animate-bounce-in">
              <Gift className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-primary-foreground mb-2">
              קבלו 10% הנחה
            </h2>
            <p className="text-primary-foreground/90 text-sm">
              על ההזמנה הראשונה שלכם
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-4 animate-fade-in">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-1">נרשמת בהצלחה!</h3>
              <p className="text-sm text-muted-foreground">
                קוד ההנחה נשלח לאימייל שלך
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-center text-muted-foreground text-sm mb-4">
                הירשמו לניוזלטר וקבלו קוד הנחה ישירות למייל
              </p>
              
              <div className="space-y-3">
                <div>
                  <Input
                    type="email"
                    placeholder="כתובת אימייל *"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError('');
                    }}
                    className={`text-right ${emailError ? 'border-destructive' : ''}`}
                    dir="ltr"
                  />
                  {emailError && (
                    <p className="text-destructive text-xs mt-1">{emailError}</p>
                  )}
                </div>
                
                <Input
                  type="text"
                  placeholder="שם פרטי (אופציונלי)"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="text-right"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full shadow-cta hover:scale-[1.02] transition-transform"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'נרשם...' : 'קבלו את ההנחה'}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                ניתן לבטל את ההרשמה בכל עת
              </p>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DiscountPopup;
