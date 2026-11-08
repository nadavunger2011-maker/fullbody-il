export function israelSlot(now: Date): { date: string; allowed: boolean } {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jerusalem', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(now);
  const value = (type: string) => parts.find(p => p.type === type)?.value ?? '';
  return { date: `${value('year')}-${value('month')}-${value('day')}`, allowed: value('hour') === '20' && value('minute') === '00' };
}

export const GUIDE_TOPIC = /קריאטין|חלבון|קזאין|מגנזיום|תוספי?\s*תזונה|תוספים|creatine|protein|casein|magnesium|supplement|iherb/i;
export const PROTECTED_GUIDE_IDS = [
  'd4974f95-04ea-45bd-91c4-8b23cdd838fd', 'd5221188-e43c-445b-a1a8-009a86b38dac',
  'ed5cb42b-4cf4-4e31-8994-66b53e8777dd', '29940094-9686-462e-b090-d99f2bb1ad9c',
];
export function isGuidePost(item: { id: string; title?: string | null; caption?: string | null }) {
  return PROTECTED_GUIDE_IDS.includes(item.id) || GUIDE_TOPIC.test(`${item.title ?? ''}\n${item.caption ?? ''}`);
}