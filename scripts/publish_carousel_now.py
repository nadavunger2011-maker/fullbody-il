import urllib.request
import urllib.parse
import json
import time

TOKEN = 'IGAAaT4FvO6hlBZAGJHWm9JLWVFdXRnaG1zdmpqai1DdU11ZA19DLVVZAQ2FEMmxRaF9CU01fWi1TY2Y0REVHNkJWTFFPbEhjMERNM3RuWFhiOEFSRWN1ckNUX0ZAHbk5MaGRYTV8tYzNwdWg3RWRFOWVHRGU4RXJ1d1pROVl6NW9KdwZDZD'
IG_USER_ID = '28425450893730217'
SITE_URL = 'https://fullbody.co.il'

SLIDE_URLS = [
    f'{SITE_URL}/social/carousel_1/slide_1.jpg',
    f'{SITE_URL}/social/carousel_1/slide_2.jpg',
    f'{SITE_URL}/social/carousel_1/slide_3.jpg',
    f'{SITE_URL}/social/carousel_1/slide_4.jpg',
    f'{SITE_URL}/social/carousel_1/slide_5.jpg',
]

CAPTION = """מרגיש שאתה נרדם מול המחשב ב-14:00 בצהריים? 😴

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

def post_media():
    container_ids = []
    
    # Step 1: Create container for each carousel slide
    print("Creating carousel slide containers...")
    for idx, image_url in enumerate(SLIDE_URLS, start=1):
        url = f"https://graph.instagram.com/v22.0/{IG_USER_ID}/media"
        data = urllib.parse.urlencode({
            'image_url': image_url,
            'is_carousel_item': 'true',
            'access_token': TOKEN
        }).encode('utf-8')
        
        req = urllib.request.Request(url, data=data, method='POST')
        with urllib.request.urlopen(req) as resp:
            res = json.loads(resp.read().decode('utf-8'))
            print(f"Slide {idx} container ID:", res.get('id'))
            container_ids.append(res['id'])
        time.sleep(1)

    # Step 2: Create parent Carousel container
    print("Creating parent carousel container...")
    url_parent = f"https://graph.instagram.com/v22.0/{IG_USER_ID}/media"
    parent_data = urllib.parse.urlencode({
        'media_type': 'CAROUSEL',
        'children': ','.join(container_ids),
        'caption': CAPTION,
        'access_token': TOKEN
    }).encode('utf-8')

    req_parent = urllib.request.Request(url_parent, data=parent_data, method='POST')
    with urllib.request.urlopen(req_parent) as resp:
        res_parent = json.loads(resp.read().decode('utf-8'))
        carousel_container_id = res_parent['id']
        print("Parent Carousel Container ID:", carousel_container_id)

    time.sleep(3)

    # Step 3: Publish Carousel Post
    print("Publishing Carousel post to Instagram...")
    url_pub = f"https://graph.instagram.com/v22.0/{IG_USER_ID}/media_publish"
    pub_data = urllib.parse.urlencode({
        'creation_id': carousel_container_id,
        'access_token': TOKEN
    }).encode('utf-8')

    req_pub = urllib.request.Request(url_pub, data=pub_data, method='POST')
    with urllib.request.urlopen(req_pub) as resp:
        res_pub = json.loads(resp.read().decode('utf-8'))
        print("PUBLISHED SUCCESS! Post ID:", res_pub.get('id'))
        return res_pub.get('id')

if __name__ == '__main__':
    try:
        post_id = post_media()
        print(f"COMPLETE! Published Instagram Post ID: {post_id}")
    except Exception as e:
        if hasattr(e, 'read'):
            print("API Error:", e.read().decode('utf-8'))
        else:
            print("Error:", e)
