

# תיקון: Chrome חוסם את הדף בגלל pdfjs-dist worker

## הבעיה
`pdfjs-dist` v5 מנסה לטעון Web Worker בצורה שלא תואמת ל-Vite/Chrome בסביבת preview. ה-worker נחסם והדף קורס.

## הפתרון
להשבית את ה-worker לגמרי (להשתמש ב-fake worker). זה פחות יעיל לקבצי PDF גדולים אבל עובד בלי בעיות. בנוסף, נעטוף את כל הטעינה ב-try/catch.

## שינויים

### `src/components/PdfFieldEditor.tsx`
- הסרת ה-worker configuration (`GlobalWorkerOptions.workerSrc`)
- הגדרת `workerSrc` כ-`""` (fake worker — הכל רץ ב-main thread)
- עטיפת `renderPdf` ב-try/catch עם הודעת שגיאה ידידותית

### `src/components/CertificatePreview.tsx`
- אם יש שימוש ב-pdfjs גם כאן — אותו תיקון

קובץ | שינוי
---|---
`src/components/PdfFieldEditor.tsx` | השבתת worker + error handling
`src/components/CertificatePreview.tsx` | בדיקה ותיקון אם רלוונטי

