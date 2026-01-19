import { useState } from 'react';
import { Accessibility, X, ZoomIn, ZoomOut, Eye, RotateCcw } from 'lucide-react';

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);

  const increaseFontSize = () => {
    if (fontSize < 150) {
      const newSize = fontSize + 10;
      setFontSize(newSize);
      document.documentElement.style.fontSize = `${newSize}%`;
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 80) {
      const newSize = fontSize - 10;
      setFontSize(newSize);
      document.documentElement.style.fontSize = `${newSize}%`;
    }
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    document.body.classList.toggle('high-contrast');
  };

  const resetAll = () => {
    setFontSize(100);
    setHighContrast(false);
    document.documentElement.style.fontSize = '100%';
    document.body.classList.remove('high-contrast');
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-accent text-accent-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-accent/90 transition-all"
        aria-label="פתח תפריט נגישות"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Accessibility className="w-5 h-5" />}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="absolute bottom-16 left-0 bg-card rounded-xl shadow-hover border border-border p-4 w-64 animate-scale-in">
          <h3 className="font-bold text-foreground mb-4 text-center">כלי נגישות</h3>
          
          <div className="space-y-3">
            {/* Font Size */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">גודל טקסט</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={decreaseFontSize}
                  className="w-8 h-8 bg-secondary rounded flex items-center justify-center hover:bg-secondary/80 transition"
                  aria-label="הקטן טקסט"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold w-10 text-center">{fontSize}%</span>
                <button
                  onClick={increaseFontSize}
                  className="w-8 h-8 bg-secondary rounded flex items-center justify-center hover:bg-secondary/80 transition"
                  aria-label="הגדל טקסט"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* High Contrast */}
            <button
              onClick={toggleHighContrast}
              className={`w-full flex items-center justify-between p-3 rounded-lg border transition ${
                highContrast ? 'bg-accent text-accent-foreground border-accent' : 'bg-secondary border-border hover:border-accent'
              }`}
            >
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">ניגודיות גבוהה</span>
              </div>
              <span className="text-xs">{highContrast ? 'פעיל' : 'כבוי'}</span>
            </button>

            {/* Reset */}
            <button
              onClick={resetAll}
              className="w-full flex items-center justify-center gap-2 p-3 bg-muted rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted/80 transition"
            >
              <RotateCcw className="w-4 h-4" />
              איפוס הגדרות
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
