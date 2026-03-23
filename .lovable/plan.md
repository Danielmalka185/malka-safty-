

# תיקון הדפסת תעודה — סנכרון בין תצוגה להדפסה

## הבעיה
בתצוגה המקדימה (ImagePreview) ה-container שומר על aspect ratio של התמונה, אבל בחלון ההדפסה (downloadCertificatePdf) ה-container הוא `100vw x 100vh` — שזה A4 landscape (יחס 1.414:1). אם התמונה ביחס אחר, השדות זזים.

בנוסף, בתצוגה גודל הפונט מוקטן ב-0.7x (שורה 165) אבל בהדפסה הוא בגודל מלא — מה שגורם לטקסט להיראות שונה.

## שינוי — קובץ אחד: `CertificatePreview.tsx`

### בפונקציית `downloadCertificatePdf` (מצב image):
1. **שמירת aspect ratio של התמונה** — במקום `width:100vw; height:100vh`, להשתמש ב-container שמתאים את עצמו לתמונה:
   - `width: 100vw` + `height: auto` + `aspect-ratio` לפי התמונה (או max-height עם centering)
   - התמונה תהיה `object-fit: fill` בדיוק כמו ב-preview
2. **גודל פונט זהה** — להשתמש באותו fontSize בלי הקטנה (בהדפסה הגודל צריך להיות מלא)
3. **טעינת תמונה לפני הדפסה** — להוסיף `onload` על התמונה ולהפעיל `print()` רק אחרי שהתמונה נטענה (במקום `setTimeout` שרירותי)

### שינוי קטן:
```
// במקום:
.cert { width: 100vw; height: 100vh; }

// יהיה:
.cert { width: 100vw; position: relative; }
.cert img { width: 100%; height: auto; display: block; }
// + שדות ב-absolute positioning על גבי התמונה
```

כך התמונה תשמור על היחס שלה, והשדות יהיו באותו מיקום יחסי כמו בתצוגה.

| קובץ | שינוי |
|---|---|
| `CertificatePreview.tsx` | תיקון layout הדפסה — aspect ratio + טעינת תמונה |

