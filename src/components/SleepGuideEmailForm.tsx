import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const FLASHY_LIST_ID = 34516;

interface SleepGuideEmailFormProps {
  btnText?: string;
  onSuccess: () => void;
}

export default function SleepGuideEmailForm({ btnText = "שלחו לי את המדריך", onSuccess }: SleepGuideEmailFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    try {
      if (typeof window !== "undefined" && window.flashy?.contacts) {
        window.flashy.contacts.createOrUpdate({
          email,
          lists: { [FLASHY_LIST_ID]: true },
        });
        window.flashy("CustomEvent", { event_name: "sleep_guide_download" });
      }
    } catch {
      // silent
    }
    setLoading(false);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
      <Input
        type="email"
        required
        placeholder="הכנסו את כתובת המייל שלכם"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-12 text-base bg-card border-border text-foreground placeholder:text-muted-foreground"
        dir="ltr"
      />
      <Button type="submit" size="lg" disabled={loading} className="h-12 px-8 shadow-cta whitespace-nowrap font-bold">
        {loading ? "שולח..." : btnText}
      </Button>
    </form>
  );
}
