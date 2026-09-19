import urllib.request
import urllib.parse
import json
import time

TOKEN = 'IGAAaT4FvO6hlBZAGJHWm9JLWVFdXRnaG1zdmpqai1DdU11ZA19DLVVZAQ2FEMmxRaF9CU01fWi1TY2Y0REVHNkJWTFFPbEhjMERNM3RuWFhiOEFSRWN1ckNUX0ZAHbk5MaGRYTV8tYzNwdWg3RWRFOWVHRGU4RXJ1d1pROVl6NW9KdwZDZD'
IG_USER_ID = '28425450893730217'

CONTAINER_IDS = ['17880437415625043', '17880437433625043', '17880437451625043', '17880437472625043', '17880437499625043']

CAPTION = """למה אתה מתרסק מעייפות ב-14:00 בצהריים? 😴

90% מהאנשים בטוחים שעייפות בצהריים היא "גזירת גורל" או שחסר להם עוד קפה. 
המציאות הפיזיולוגית פשוטה הרבה יותר: ארוחת הבוקר שלך מפילה אותך.

כשאתה מתחיל את היום עם פחמימות ריקות (מאפה, קורנפלקס או סתם קפה מתוק), רמת הסוכר בדם מזנקת למעלה. שעתיים-שלוש לאחר מכן, הגוף חווה נפילת סוכר קשה (Sugar Crash) – ואתה חוטף עייפות כבדה ודחף עז למתוק.

הפתרון: נוסחת PFF (Protein + Fiber + Fat)
שילוב מדויק של חלבון איכותי (שומר על מסת השריר) וסיבים תזונתיים ממקור תפוח (מאיטים את ספיגת הסוכר).

🥤 רוצים לקבל במתנה את ספר המתכונים הדיגיטלי + קופון 10% הנחה להזמנה הראשונה?
תכתבו לי "אנרגיה" בתגובות או בפרטי – ותקבלו את המדריך והקופון ישירות ל-WhatsApp!
.
.
#הרבלייף #שייקחלבון #אורחחייםבריא #תזונהונכושר #חיטובבריא #הרזיהבריאה #FullBody #תזונהנכונה #בריאות #תזונהאיכותית"""

def publish_carousel():
    url_parent = f"https://graph.instagram.com/v22.0/{IG_USER_ID}/media"
    parent_params = urllib.parse.urlencode({
        'media_type': 'CAROUSEL',
        'children': ','.join(CONTAINER_IDS),
        'caption': CAPTION,
        'access_token': TOKEN
    }).encode('utf-8')

    req_parent = urllib.request.Request(url_parent, data=parent_params, method='POST')
    with urllib.request.urlopen(req_parent) as resp:
        res_parent = json.loads(resp.read().decode('utf-8'))
        parent_id = res_parent['id']
        print("Parent Carousel Container ID:", parent_id)

    time.sleep(3)

    url_pub = f"https://graph.instagram.com/v22.0/{IG_USER_ID}/media_publish"
    pub_params = urllib.parse.urlencode({
        'creation_id': parent_id,
        'access_token': TOKEN
    }).encode('utf-8')

    req_pub = urllib.request.Request(url_pub, data=pub_params, method='POST')
    with urllib.request.urlopen(req_pub) as resp:
        res_pub = json.loads(resp.read().decode('utf-8'))
        print("CAROUSEL POST PUBLISHED SUCCESSFULLY! Post ID:", res_pub.get('id'))

if __name__ == '__main__':
    publish_carousel()
