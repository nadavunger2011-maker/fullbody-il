import os
import json
import urllib.request
import urllib.parse
from PIL import Image, ImageDraw, ImageFont

TOKEN = 'IGAAaT4FvO6hlBZAGJHWm9JLWVFdXRnaG1zdmpqai1DdU11ZA19DLVVZAQ2FEMmxRaF9CU01fWi1TY2Y0REVHNkJWTFFPbEhjMERNM3RuWFhiOEFSRWN1ckNUX0ZAHbk5MaGRYTV8tYzNwdWg3RWRFOWVHRGU4RXJ1d1pROVl6NW9KdwZDZD'
IG_USER_ID = '28425450893730217'
SITE_URL = 'https://fullbody.co.il'

def generate_slides():
    out_dir = '/opt/data/fullbody-il/public/social/carousel_1'
    os.makedirs(out_dir, exist_ok=True)

    slides_data = [
        {
            'title': 'למה אתה מתרסק מעייפות ב-14:00 בצהריים? 😴',
            'desc': 'הטעות ש-90% מהאנשים עושים בארוחת הבוקר – ואיך שייק חלבון מאוזן פותר אותה ב-60 שניות.',
            'badge': '💡 פתרון עייפות מנצח',
            'step': '1 / 5'
        },
        {
            'title': 'זינוק סוכר ענקי ואז נפילה כואבת 📉',
            'desc': 'כשאתה אוכל פחמימות ריקות בבוקר (בורקס, מאפה, קורנפלקס), הסוכר בדם מזנק – ואז צונח בצהריים. התוצאה: עייפות כבדה, תסכול ורעב למתוק.',
            'badge': '⚠️ הבעיה הפיזיולוגית',
            'step': '2 / 5'
        },
        {
            'title': 'חלבון + סיבים תזונתיים = שובע ל-4+ שעות ⏳',
            'desc': 'נוסחת PFF (Protein + Fiber + Fat):\n• 18g חלבון סויה/מי גבינה\n• 5g סיבים תזונתיים ממקור תפוח\n\nהחלבון שומר על השריר, והסיבים מאיטים את העיכול.',
            'badge': '🥑 נוסחת PFF לשובע',
            'step': '3 / 5'
        },
        {
            'title': 'שייק אנרגיה קרמי ב-60 שניות בלבד ⚡',
            'desc': '1. 250 מ"ל חלב שקדים קר\n2. 2 כפות פורמולה 1 (וניל / עוגיות)\n3. 1 כף אבקת סיבים תפוח\n4. קרח / חצי בננה קפואה\n\nערבול 45 שניות בבלנדר לקבלת מרקם גלידה!',
            'badge': '🥤 המתכון המהיר',
            'step': '4 / 5'
        },
        {
            'title': 'רוצים קופון 10% מתנה + ספר מתכונים? 🎁',
            'desc': 'תגיבו "אנרגיה" בתגובות או בפרטי – ותקבלו ישירות ל-WhatsApp את ספר המתכונים הדיגיטלי + קופון WELCOME10 להזמנה ראשונה!',
            'badge': '🎁 מתנה בלעדית',
            'step': '5 / 5'
        }
    ]

    image_urls = []
    for idx, s in enumerate(slides_data, start=1):
        img = Image.new('RGB', (1080, 1080), color='#0f172a')
        draw = ImageDraw.Draw(img)

        # Border
        draw.rectangle([20, 20, 1060, 1060], outline='#16a34a', width=10)
        # Header Badge
        draw.rectangle([60, 60, 1020, 140], fill='#16a34a')

        file_name = f'slide_{idx}.jpg'
        file_path = os.path.join(out_dir, file_name)
        img.save(file_path, 'JPEG', quality=95)
        image_urls.append(f'{SITE_URL}/social/carousel_1/{file_name}')

    print(f'Generated {len(image_urls)} slide images.')
    return image_urls

if __name__ == '__main__':
    urls = generate_slides()
    print('Slide URLs:', urls)
