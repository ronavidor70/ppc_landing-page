# Edge Functions — כלי מחקר מילים

הפונקציה `keyword-ideas` היא פרוקסי ל-Google Suggest. היא נחוצה כי הדפדפן
חוסם קריאה ישירה ל-Google (CORS). אין בה סוד ואין בה עלות.

## פריסה (חד-פעמי)

```bash
# 1. התקנת ה-CLI (אם עוד אין)
brew install supabase/tap/supabase

# 2. התחברות וקישור לפרויקט
supabase login
supabase link --project-ref <PROJECT_REF>   # מתוך Supabase → Project Settings → General

# 3. פריסת הפונקציה (בלי דרישת JWT — קריאה ציבורית מהדף)
supabase functions deploy keyword-ideas --no-verify-jwt
```

## חיבור לדף

הכתובת שתקבל היא:
`https://<PROJECT_REF>.supabase.co/functions/v1`

הכנס אותה למשתנה הסביבה (ב-`.env` מקומי, וב-Render בפרודקשן):

```
VITE_TOOLS_API_URL=https://<PROJECT_REF>.supabase.co/functions/v1
```

זהו. הווידג'ט "מחקר מילים" יתחיל להחזיר תוצאות אמיתיות.
עד שתעשה זאת — הווידג'ט עדיין עובד ומפנה ל-Google Trends (fallback),
וכלי "ריגול מתחרים" עובד תמיד (דיפ-לינקים, בלי צורך בפונקציה).

## בדיקה מהירה

```bash
curl "https://<PROJECT_REF>.supabase.co/functions/v1/keyword-ideas?q=עורך%20דין&hl=he"
```
