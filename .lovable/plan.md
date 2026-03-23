

# שיפור מערכת התעודות ותהליך מלא מקצה לקצה

## בעיות שזוהו

1. **תבניות לא נשמרות באמת** — `CertificateTemplateEditor` שומר ב-state מקומי, לא ב-DataContext. אין שם לתבנית, ואין חיבור ל-`getTemplateForCategory`
2. **שדות חסרים ב-PDF** — `availableFields` ב-PdfFieldEditor לא כולל שדות כמו `birthYear`, `fatherName`, `profession` שמופיעים ב-`defaultData` של CertificatePreview
3. **גופן עברי לא עובד ב-PDF** — `CertificatePreview` משתמש ב-`StandardFonts.Helvetica` שלא תומך עברית. צריך להטמיע גופן Rubik/David
4. **הורדת PDF לא עובדת** — כפתור Download בטבלת התעודות (`Certificates.tsx` שורה 114) לא מחובר לשום פונקציה
5. **תהליך מקצה לקצה חסר** — אין flow ברור: חברה → עובד → הדרכה → תעודה → הורדה

## שינויים מתוכננים

### 1. `src/context/DataContext.tsx` — ניהול תבניות ב-context
- הוספת `templates` ל-state עם `addTemplate` / `updateTemplate`
- חשיפת `getTemplateForCategory` שעובד מה-state

### 2. `src/components/CertificateTemplateEditor.tsx` — שם תבנית + שמירה אמיתית
- הוספת שדה "שם תבנית" בטופס
- שמירה דרך DataContext במקום state מקומי
- הוספת שדות חסרים ל-placeholders: שנת לידה, שם האב, מקצוע

### 3. `src/components/PdfFieldEditor.tsx` — שדות חסרים
- כבר כולל את השדות (birthYear, fatherName, profession) — אין שינוי

### 4. `src/components/CertificatePreview.tsx` — גופן עברי + הורדה
- הטמעת גופן Rubik מ-Google Fonts במקום Helvetica (באמצעות `fetch` + `pdfDoc.embedFont`)
- תיקון הורדת PDF ב-HTML mode (שימוש ב-html2canvas או print-to-pdf)

### 5. `src/pages/Certificates.tsx` — חיבור כפתור הורדה
- כפתור Download יפעיל הורדת PDF/הדפסה של התעודה הספציפית
- שימוש ב-`getTemplateForCategory` מה-context

### 6. `src/data/mockData.ts` — עדכון `CertificateTemplate` interface
- הוספת שדה `name` ל-interface

## סדר ביצוע

| # | קובץ | פעולה |
|---|---|---|
| 1 | `mockData.ts` | הוספת `name` ל-CertificateTemplate |
| 2 | `DataContext.tsx` | ניהול תבניות ב-state + getTemplateForCategory |
| 3 | `CertificateTemplateEditor.tsx` | שם תבנית + שמירה ב-context + שדות חסרים |
| 4 | `CertificatePreview.tsx` | גופן עברי (fetch Rubik) + תיקון הורדה |
| 5 | `Certificates.tsx` | חיבור כפתור הורדה + שימוש ב-context |

## תוצאה
- תבניות נשמרות עם שם ומזוהות לפי קטגוריה
- PDF תומך עברית עם גופן Rubik
- הורדת תעודה עובדת מדף התעודות
- תהליך מלא: יצירת חברה → הוספת עובד → יצירת הדרכה → תעודה נוצרת → צפייה והורדה

