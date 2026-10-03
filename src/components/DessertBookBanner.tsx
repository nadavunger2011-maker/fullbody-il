import { BookOpen, ArrowLeft } from 'lucide-react';
export default function DessertBookBanner({ source }: { source: string }) {
  return <aside className="not-prose my-10 rounded-md bg-foreground p-6 text-background sm:flex sm:items-center sm:justify-between sm:gap-6"><div><p className="mb-1 text-sm font-bold text-accent">מתנה לקוראי FullBody</p><h2 className="text-2xl font-black">ספר קינוחי חלבון במתנה</h2></div><a href={`https://shop.fullbody.co.il/?utm_source=blog&utm_medium=article&utm_campaign=${encodeURIComponent(source)}`} className="mt-5 inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 font-bold text-accent-foreground sm:mt-0">לפרטים <BookOpen className="h-4 w-4" /><ArrowLeft className="h-4 w-4" /></a></aside>;
}
