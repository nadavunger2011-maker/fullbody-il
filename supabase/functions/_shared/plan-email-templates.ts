// Hebrew (RTL) email templates for FullBody plan emails.
// Kept plain-string HTML so it renders reliably across mail clients.

const GREEN = "#1e7a3c";
const DARK = "#12251a";
const SITE = "https://fullbody.co.il";

export type PlanEmailProduct = { name: string; handle: string; price?: string };

export type PlanEmailData = {
  name?: string;
  goalLabel?: string;
  experienceLabel?: string;
  isBeginnerBasePhase?: boolean;
  week?: number;
  targetCalories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  water?: number;
  days?: number;
  splitName?: string;
  products?: PlanEmailProduct[];
  daysInactive?: number;
};

const esc = (v: unknown) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const button = (href: string, label: string) => `
  <a href="${href}" style="display:inline-block;background:${GREEN};color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;padding:14px 28px;border-radius:12px">${esc(label)}</a>`;

const card = (title: string, body: string) => `
  <div style="background:#f5f8f5;border-radius:12px;padding:16px;margin:12px 0">
    <p style="margin:0 0 6px;color:${GREEN};font-weight:700;font-size:14px">${esc(title)}</p>
    <div style="margin:0;color:#33413a;font-size:15px;line-height:1.7">${body}</div>
  </div>`;

function shell(inner: string) {
  return `<!doctype html>
<html lang="he" dir="rtl">
  <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
  <body style="margin:0;padding:0;background:#ffffff;font-family:'Heebo',Arial,Helvetica,sans-serif" dir="rtl">
    <div style="max-width:600px;margin:0 auto;padding:24px 20px 8px;text-align:right">
      <p style="margin:0 0 18px;font-size:22px;font-weight:800;color:${DARK}">FullBody</p>
      ${inner}
      <hr style="border:none;border-top:1px solid #e6ece7;margin:28px 0 14px" />
      <p style="margin:0;color:#7b8a82;font-size:12px;line-height:1.8">
        נדב אונגר, מפיץ עצמאי של הרבלייף · טלפון 054-2008578<br />
        <a href="${SITE}" style="color:${GREEN};text-decoration:none">fullbody.co.il</a><br />
        התכנים אינם ייעוץ רפואי ואינם מחליפים התייעצות עם רופא או דיאטן/ית מוסמך/ת.
      </p>
    </div>
  </body>
</html>`;
}

function productList(products: PlanEmailProduct[] = []) {
  if (!products.length) return "";
  const items = products
    .slice(0, 3)
    .map(
      (p) => `<li style="margin-bottom:6px">
        <a href="${SITE}/product/${encodeURIComponent(p.handle)}" style="color:${GREEN};text-decoration:none;font-weight:600">${esc(p.name)}</a>${
        p.price ? ` <span style="color:#7b8a82">${esc(p.price)}</span>` : ""
      }</li>`
    )
    .join("");
  return card("מוצרים שהותאמו לתוכנית שלך", `<ul style="margin:0;padding-inline-start:18px">${items}</ul>`);
}

export type PlanEmailTemplate = "plan-summary" | "plan-reminder";

export function renderPlanEmail(
  template: PlanEmailTemplate,
  data: PlanEmailData
): { subject: string; html: string } {
  const first = (data.name || "").trim().split(" ")[0];
  const hello = first ? `היי ${esc(first)},` : "היי,";
  const planLink = `${SITE}/plan`;

  if (template === "plan-reminder") {
    const gap = data.daysInactive ? `כבר ${data.daysInactive} ימים שלא נכנסת` : "מזמן לא נכנסת";
    return {
      subject: "התוכנית האישית שלך מחכה לך",
      html: shell(`
        <h1 style="margin:0 0 12px;font-size:24px;color:${DARK}">${hello} התוכנית שלך מחכה</h1>
        <p style="margin:0 0 14px;color:#33413a;font-size:16px;line-height:1.8">
          ${esc(gap)}, וזה בדיוק הרגע לחזור למסלול. התוכנית האישית שלך שמורה ומוכנה,
          כולל התפריט, האימונים ויעדי הקלוריות.
        </p>
        ${data.week ? card("איפה אתה בתוכנית", `שבוע ${esc(data.week)} בתוכנית`) : ""}
        <p style="margin:18px 0 6px">${button(planLink, "חזרה לתוכנית שלי")}</p>
        <p style="margin:14px 0 0;color:#7b8a82;font-size:13px">רוצה עזרה בהתאמה? אפשר להשיב למייל הזה או להתקשר.</p>
      `),
    };
  }

  const macros = `
    <table role="presentation" style="width:100%;border-collapse:collapse;font-size:15px;color:#33413a">
      <tr><td style="padding:4px 0">קלוריות יעד ליום</td><td style="padding:4px 0;font-weight:700">${esc(data.targetCalories ?? "-")}</td></tr>
      <tr><td style="padding:4px 0">חלבון</td><td style="padding:4px 0;font-weight:700">${esc(data.protein ?? "-")} גרם</td></tr>
      <tr><td style="padding:4px 0">פחמימות</td><td style="padding:4px 0;font-weight:700">${esc(data.carbs ?? "-")} גרם</td></tr>
      <tr><td style="padding:4px 0">שומן</td><td style="padding:4px 0;font-weight:700">${esc(data.fat ?? "-")} גרם</td></tr>
      ${data.water ? `<tr><td style="padding:4px 0">מים</td><td style="padding:4px 0;font-weight:700">${esc(data.water)} מ"ל</td></tr>` : ""}
    </table>`;

  const training = `
    <div>
      ${data.splitName ? `סוג התוכנית: <strong>${esc(data.splitName)}</strong><br />` : ""}
      ${data.days ? `מספר אימונים בשבוע: <strong>${esc(data.days)}</strong><br />` : ""}
      ${data.experienceLabel ? `רמת ניסיון: <strong>${esc(data.experienceLabel)}</strong>` : ""}
    </div>`;

  const basePhase = data.isBeginnerBasePhase
    ? card(
        "שלב בניית הבסיס",
        "ב-4 השבועות הראשונים התוכנית היא גוף מלא בכל אימון, כדי ללמוד תנועה נכונה ולבנות בסיס. בתום 4 השבועות המערכת תעביר אותך אוטומטית לפיצול שרירים שמתאים למספר ימי האימון שבחרת."
      )
    : "";

  return {
    subject: "התוכנית האישית שלך מ-FullBody",
    html: shell(`
      <h1 style="margin:0 0 12px;font-size:24px;color:${DARK}">${hello} התוכנית שלך מוכנה</h1>
      <p style="margin:0 0 14px;color:#33413a;font-size:16px;line-height:1.8">
        בנינו לך תוכנית אישית${data.goalLabel ? ` למטרת <strong>${esc(data.goalLabel)}</strong>` : ""},
        לפי הנתונים שמילאת. הנה הסיכום, והתוכנית המלאה מחכה באתר.
      </p>
      ${card("יעדי התזונה שלך", macros)}
      ${card("תוכנית האימונים", training)}
      ${basePhase}
      ${productList(data.products)}
      <p style="margin:18px 0 6px">${button(planLink, "חזרה לתוכנית שלי")}</p>
      <p style="margin:14px 0 0;color:#7b8a82;font-size:13px">
        שמרנו את התוכנית, כך שבכל כניסה חזרה לאתר תראה אותה שוב עם ההתקדמות השבועית.
      </p>
    `),
  };
}
