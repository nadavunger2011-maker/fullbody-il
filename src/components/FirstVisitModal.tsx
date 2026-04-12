import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const STORAGE_KEY = "fullbody_first_visit_seen";
const HERBALIFE_URL = "https://www.herbalife.com/";

export default function FirstVisitModal() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const t = setTimeout(() => setOpen(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const handleContinue = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  const handleRedirect = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    window.open(HERBALIFE_URL, "_blank", "noopener");
    setOpen(false);
  };

  const content = (
    <div className="flex flex-col items-center text-center gap-4 py-2" dir="rtl">
      <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
        הקשר האישי שלך עם המפיץ הוא המפתח להשגת יעדי התזונה שלך. אם כבר יש לך
        מפיץ אישי, אנו מעודדים אותך לרכוש את המוצרים דרכו. אם אין לך מפיץ,
        נשמח ללוות אותך כחלק מקהילת FullBody!
      </p>

      <Button
        onClick={handleContinue}
        className="w-full max-w-xs h-11 text-base font-semibold rounded-lg"
      >
        אין לי מפיץ – המשך לאתר
      </Button>

      <button
        onClick={handleRedirect}
        className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
      >
        יש לי מפיץ – מעבר לאתר הרשמי
      </button>

      <p className="text-[11px] text-muted-foreground/60 mt-2 max-w-sm leading-relaxed">
        אתר זה מופעל ע״י נדב אונגר, מפיץ עצמאי של הרבלייף (ID: 16Y0030013).
      </p>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={(o) => { if (!o) handleContinue(); }}>
        <DrawerContent dir="rtl" className="px-6 pb-8">
          <DrawerHeader className="pt-4 pb-0">
            <DrawerTitle className="text-xl font-bold text-center">
              ברוכים הבאים ל-FullBody
            </DrawerTitle>
            <DrawerDescription className="text-sm text-muted-foreground text-center mt-1">
              האם כבר שוחחת עם חבר הרבלייף עצמאי?
            </DrawerDescription>
          </DrawerHeader>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleContinue(); }}>
      <DialogContent
        dir="rtl"
        className="max-w-md rounded-xl p-8 shadow-xl border-border/40"
      >
        <DialogHeader className="gap-1">
          <DialogTitle className="text-xl font-bold text-center">
            ברוכים הבאים ל-FullBody
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground text-center">
            האם כבר שוחחת עם חבר הרבלייף עצמאי?
          </DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
