

# תיקון: עמוד הגדרות לא מציג כלום

## הבעיה
שתי בעיות גורמות לכך שהעמוד לא עובד כמו שצריך:

1. **pdfjs-dist worker נכשל בטעינה** — ה-URL של ה-worker (`pdf.worker.min.mjs`) לא נטען מה-CDN. גרסה 5.x של pdfjs-dist דורשת טעינת worker אחרת.

2. **pdf-lib embedFont נכשל** — `pdfDoc.embedFont('Helvetica' as any)` לא עובד ככה. ב-pdf-lib צריך להשתמש ב-`StandardFonts.Helvetica`.

## תיקונים

### `src/components/PdfFieldEditor.tsx`
- שינוי ה-workerSrc לנתיב שעובד עם pdfjs-dist v5: שימוש ב-`pdf.worker.min.js` (בלי `.mjs`) או טעינה מ-node_modules ישירות
- עטיפת הרינדור ב-try/catch כדי שלא יקרוס את כל הדף

### `src/components/CertificatePreview.tsx`
- תיקון embedFont להשתמש ב-`StandardFonts.Helvetica` מ-pdf-lib

### קבצים שישתנו
| קובץ | שינוי |
|---|---|
| `src/components/PdfFieldEditor.tsx` | תיקון workerSrc + error handling |
| `src/components/CertificatePreview.tsx` | תיקון embedFont |

