

# תיקון מיקום שדות בעורך התעודות

## הבעיה
ה-`imageFields` בתבנית "עבודה בגובה" ריק (`[]`), וגם כשממקמים שדות דרך העורך — המיקום לא תואם בין העורך לבין התצוגה המקדימה וההדפסה. הסיבה: הבדלי aspect ratio בין העורך, ה-preview, וחלון ההדפסה.

## שינויים

### 1. `src/components/ImageFieldEditor.tsx` — תיקון aspect ratio
- לאחד את ה-aspect ratio בין העורך לבין CertificatePreview — שניהם ישתמשו ב-`aspect-ratio` של התמונה עצמה (לא ערך קבוע)
- הוספת grid lines עדינות כדי לעזור במיקום מדויק

### 2. `src/components/CertificatePreview.tsx` — סנכרון מיקום
- להשתמש באותו חישוב מיקום כמו בעורך (אותו container style)
- בחלון ההדפסה: אותו aspect ratio ואותו חישוב אחוזים

### 3. `src/data/mockData.ts` — שדות ברירת מחדל מותאמים לתמונה
- הוספת שדות מוגדרים מראש עם מיקומים מותאמים לתמונת "אישור עבודה בגובה" שהעלית
- המשתמש יוכל לגרור ולתקן דרך העורך אם צריך

### 4. `src/pages/Certificates.tsx` — העשרת getCertData
- הוספת שדות חסרים: `lastName`, `firstName`, `phone`, `companyId`, `instructorPhone` וכו'
- שליחת נתונים אמיתיים של העובד במקום ערכי ברירת מחדל

| # | קובץ | שינוי |
|---|---|---|
| 1 | `ImageFieldEditor.tsx` | סנכרון aspect ratio + grid עזר |
| 2 | `CertificatePreview.tsx` | אותו חישוב מיקום כמו בעורך |
| 3 | `mockData.ts` | imageFields מוגדרים מראש לתבנית cat1 |
| 4 | `Certificates.tsx` | העשרת getCertData עם כל שדות העובד/חברה/מדריך |

## תוצאה
- מיקום שדות בעורך = בדיוק אותו מיקום ב-preview וב-PDF
- שדות מוגדרים מראש על תמונת עבודה בגובה (אפשר לגרור ולתקן)
- נתוני עובד אמיתיים בתעודה

