import { MEDICAL_DISCLAIMER } from '@/lib/business';

export default function MedicalDisclaimer() {
  return (
    <aside className="border-t border-border bg-secondary/40 px-5 py-5 text-sm leading-relaxed text-muted-foreground" aria-label="הבהרה רפואית">
      {MEDICAL_DISCLAIMER}
    </aside>
  );
}