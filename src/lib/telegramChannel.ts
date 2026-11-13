export const TELEGRAM_CHANNEL_URL = 'https://t.me/Fullbodeals';
export const TELEGRAM_CTA_TEXT = 'דילים אמיתיים על תוספים וחלבונים – הצטרפו לערוץ הטלגרם שלנו';
export const TELEGRAM_CTA_BUTTON = 'להצטרפות';

/** Static HTML for the prerendered snapshot (mirrors TelegramChannelCta). */
export function telegramCtaHtml(): string {
  return `<aside data-telegram-cta><p>${TELEGRAM_CTA_TEXT} <a href="${TELEGRAM_CHANNEL_URL}" target="_blank" rel="noopener">${TELEGRAM_CTA_BUTTON}</a></p></aside>`;
}
