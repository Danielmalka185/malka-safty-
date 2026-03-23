

# תיקון תעודות + הוספת עריכת הדרכה

## הבעיה העיקרית — למה תעודות לא נוצרות
פונקציות העזר (`getEmployeeName`, `getCompanyName`, וכו') ב-`mockData.ts` קוראות מהמערכים הסטטיים הריקים — לא מה-DataContext. לכן גם אם התעודות נוצרות, הן מציגות "לא ידוע" בכל מקום. צריך לתקן את זה.

## שינויים

### 1. `src/data/mockData.ts` — הפיכת helper functions לקבלת נתונים מבחוץ
הפונקציות `getCompanyName`, `getEmployeeName`, `getTrainingTypeName` וכו' ישארו כ-fallback, אבל נוסיף גרסאות שמקבלות את המערכים כפרמטר.

### 2. `src/context/DataContext.tsx` — חשיפת helper functions שעובדות עם ה-state
הוספת פונקציות עזר ל-context שמחפשות בתוך ה-state האמיתי:
- `getCompanyName(id)` — מחפש ב-`companies` של ה-state
- `getEmployeeName(id)` — מחפש ב-`employees` של ה-state
- `getEmployee(id)`

### 3. עדכון כל הדפים שמשתמשים ב-helpers
`Trainings.tsx`, `Certificates.tsx`, `Index.tsx` — שימוש ב-helpers מה-context במקום מ-mockData

### 4. `src/pages/Trainings.tsx` — כפתור עריכה
בדיאלוג הצפייה בהדרכה, הוספת כפתור "עריכה" שפותח את `TrainingDialog` עם הנתונים הקיימים

| קובץ | שינוי |
|---|---|
| `src/context/DataContext.tsx` | הוספת helper functions שעובדות עם ה-state |
| `src/pages/Trainings.tsx` | שימוש ב-helpers מ-context + כפתור עריכה בדיאלוג צפייה |
| `src/pages/Certificates.tsx` | שימוש ב-helpers מ-context |
| `src/pages/Index.tsx` | שימוש ב-helpers מ-context |

