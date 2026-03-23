

# תיקון עורך PDF — העלאה, תצוגה ומיקום שדות

## הבעיה
ה-worker של `pdfjs-dist` מוגדר כמחרוזת ריקה, מה שגורם לשגיאה ומונע טעינת PDF לחלוטין. בלי זה — אין תצוגה מקדימה, אין אפשרות למקם שדות, כלום לא עובד.

## מה ייעשה

### `src/components/PdfFieldEditor.tsx`
- תיקון שורה 11: הגדרת ה-worker לעבוד ב-fake worker mode (ללא CDN חיצוני):
  ```js
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();
  ```
- אם זה לא עובד עם גרסה 5, נעבור לגישת fallback: `import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url"` ונשתמש בזה

### מה יעבוד אחרי התיקון
- העלאת קובץ PDF — מוצג על הקנבס
- לחיצה על ה-PDF למיקום שדה חדש (שם עובד, ת"ז, תאריך וכו')
- גרירת שדות למיקום מדויק
- שינוי גודל פונט לכל שדה
- מחיקת שדות
- החלפת PDF

| קובץ | שינוי |
|---|---|
| `src/components/PdfFieldEditor.tsx` | תיקון הגדרת workerSrc של pdfjs-dist |

