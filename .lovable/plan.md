

# תוכנית מקיפה — מעבר לתמונת רקע + מדריכים + תעודה אחת לכל עובד

## סטטוס נוכחי — מה כבר עובד

- **תעודה אחת לכל עובד** — `addCertificatesForTraining` ב-DataContext כבר יוצר תעודה אחת עם כל ה-`trainingTypeIds` (שורות 84-122). **זה תקין.**
- **Certificate interface** — כבר `trainingTypeIds: string[]`. **תקין.**
- **Certificates.tsx** — כבר מציג badges לכל הנושאים, כפתור הורדה מחובר. **תקין.**
- **EmployeeCard.tsx** — כבר משתמש ב-`useData()`. **תקין.**
- **Index.tsx** — כבר משתמש ב-`trainingTypeIds`. **תקין.**

## מה לא עובד / חסר

1. **הורדת PDF נכשלת** — `CertificatePreview` משתמש ב-`pdf-lib` + `fontkit` + URL גופן Rubik שמחזיר 404, וגם מצב PDF משתמש ב-`pdfjs-dist` שלא עובד
2. **עורך PDF** — `PdfFieldEditor` מבוסס על `pdfjs-dist` שבעייתי
3. **אין ניהול מדריכים** — כל פעם מקלידים ידנית ב-TrainingDialog
4. **דף הגדרות** — רק תבניות, צריך גם מדריכים

## שינויים מתוכננים

### 1. `src/data/mockData.ts` — הוספת Instructor + עדכון CertificateTemplate
- הוספת `Instructor` interface (id, name, phone, idNumber, expertise)
- עדכון `CertificateTemplate`: `templateType: 'html' | 'image'`, `pdfBase64` → `backgroundImage`, `pdfFields` → `imageFields`
- הוספת מערך `instructors` ריק

### 2. `src/context/DataContext.tsx` — ניהול מדריכים
- הוספת `instructors` ל-state + `addInstructor`, `updateInstructor`, `deleteInstructor`
- חשיפה דרך ה-context

### 3. `src/components/ImageFieldEditor.tsx` — קומפוננטה חדשה (מחליפה PdfFieldEditor)
- העלאת תמונה (JPG/PNG) במקום PDF — `<img src={base64}>` פשוט
- לחיצה על התמונה למיקום שדה, גרירה להזזה
- שדות מורחבים: עובד (שם, ת"ז, שנת לידה, שם אב, מקצוע, טלפון, כתובת), חברה (שם, ח.פ, טלפון), מדריך (שם, טלפון, ת"ז), הדרכה (נושאים, קטגוריה, תאריך, תוקף)
- שינוי גודל פונט וצבע לכל שדה

### 4. `src/components/CertificatePreview.tsx` — פישוט מוחלט
- הסרת `pdf-lib`, `fontkit`, `pdfjs-dist`
- מצב `image`: `<div>` עם `background-image` + שדות ב-`position: absolute`
- מצב `html`: נשאר כמו היום (כבר עובד)
- הורדה = Print to PDF (חלון הדפסה) — עברית מושלמת תמיד
- תיקון: `{trainingType}` יוצג כרשימת נושאים (אחד מתחת לשני)

### 5. `src/components/CertificateTemplateEditor.tsx` — שימוש ב-ImageFieldEditor
- טאב "העלאת PDF" → "העלאת תמונת רקע"
- שימוש ב-`ImageFieldEditor` במקום `PdfFieldEditor`

### 6. `src/components/InstructorManager.tsx` — קומפוננטה חדשה
- טבלה של מדריכים (שם, טלפון, ת"ז, מומחיות)
- הוספה, עריכה, מחיקה

### 7. `src/pages/Settings.tsx` — טאבים
- טאב "תבניות תעודות" (קיים)
- טאב "מדריכים" (חדש — InstructorManager)

### 8. `src/components/TrainingDialog.tsx` — בחירת מדריך מרשימה
- שדה "מדריך" ישתנה מ-Input חופשי ל-Select עם רשימת מדריכים מה-context (+ אפשרות הקלדה ידנית)

### 9. שמירת תמונת הרקע
- התמונה שהעלית (`אישור_עבודה_בגובה_.pdf_2.png`) תישמר ב-`public/certificate-bg-heights.png`
- תבנית ברירת מחדל לקטגוריית "עבודה בגובה" תשתמש בה

### 10. `package.json` — הסרת ספריות PDF
- הסרת `pdf-lib`, `@pdf-lib/fontkit`, `pdfjs-dist`

### 11. מחיקת `src/components/PdfFieldEditor.tsx`

## סדר ביצוע

| # | קובץ | שינוי |
|---|---|---|
| 1 | `mockData.ts` | `Instructor` interface, עדכון `CertificateTemplate` |
| 2 | `DataContext.tsx` | ניהול מדריכים + עדכון template types |
| 3 | `ImageFieldEditor.tsx` | קומפוננטה חדשה — תמונה + גרירת שדות |
| 4 | `CertificatePreview.tsx` | HTML+CSS בלבד, Print to PDF, הסרת ספריות PDF |
| 5 | `CertificateTemplateEditor.tsx` | שימוש ב-ImageFieldEditor |
| 6 | `InstructorManager.tsx` | קומפוננטה חדשה — ניהול מדריכים |
| 7 | `Settings.tsx` | טאבים: תבניות + מדריכים |
| 8 | `TrainingDialog.tsx` | בחירת מדריך מרשימה |
| 9 | `certificate-bg-heights.png` | שמירת התמונה שהועלתה |
| 10 | `PdfFieldEditor.tsx` | מחיקה |
| 11 | `package.json` | הסרת pdf-lib, pdfjs-dist, fontkit |

## מה לא ישתנה (כבר תקין)
- `Certificates.tsx` — תעודה אחת עם כל הנושאים כ-badges, הורדה מחוברת
- `EmployeeCard.tsx` — כבר משתמש ב-useData
- `Index.tsx` — כבר מתאים ל-trainingTypeIds
- `DataContext.tsx` — `addCertificatesForTraining` כבר יוצר תעודה אחת לכל עובד עם כל הנושאים, תוקף לפי הקצר

## תוצאה
- תעודה אחת לכל עובד עם כל הנושאים מפורטים בפנים
- עורך תמונתי: מעצב בקאנבה → מעלה תמונה → ממקם שדות בגרירה → שומר
- הורדה/הדפסה עובדת תמיד עם עברית מושלמת (Print to PDF)
- ניהול מדריכים — שומרים פעם אחת, בוחרים מרשימה בכל הדרכה
- אפס תלות בספריות PDF בעייתיות

