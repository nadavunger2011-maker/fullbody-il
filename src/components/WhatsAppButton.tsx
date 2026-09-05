import { useState } from "react";
import { MessageCircle, X, Phone } from "lucide-react";

const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const whatsappUrl = "https://wa.link/0g4tht";
  const phoneNumber = "054-2008578";

  const handleButtonClick = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Popup Message */}
      {isOpen && (
        <div className="bg-card rounded-2xl shadow-2xl p-4 max-w-[300px] animate-in slide-in-from-bottom-2 fade-in duration-300 border border-border">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">FullBody</p>
                <p className="text-xs text-muted-foreground">נדב אונגר · ייעוץ אישי</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="סגור"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="bg-muted/50 rounded-xl p-3 mb-3">
            <p className="text-sm text-foreground leading-relaxed">
              רוצה ייעוץ והתאמה אישית? דברו איתנו בוואטסאפ / {phoneNumber}
            </p>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium py-2.5 px-4 rounded-xl transition-colors mb-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>שיחה בוואטסאפ</span>
          </a>
          <a
            href="tel:0542008578"
            className="flex items-center justify-center gap-2 w-full border border-[hsl(142,70%,35%)] text-[hsl(142,70%,35%)] font-bold py-2.5 px-4 rounded-xl transition-colors hover:bg-[hsl(142,70%,35%)]/5"
          >
            <Phone className="w-4 h-4" />
            <span>הזמנה טלפונית {phoneNumber}</span>
          </a>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={handleButtonClick}
        className="group flex items-center gap-2 px-4 h-12 bg-[#25D366] hover:bg-[#20bd5a] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        aria-label="ייעוץ בוואטסאפ או בטלפון"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 text-white" />
            <span className="text-white font-bold text-xs sm:text-sm whitespace-nowrap">רוצה ייעוץ אישי?</span>
          </>
        )}
      </button>
    </div>
  );
};

export default WhatsAppButton;
