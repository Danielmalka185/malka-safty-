# ניקוי דאטה (עם גיבוי) + הוספת עמוד משימות

## חלק 1: צמצום הדאטה עם שמירת גיבוי

במקום למחוק את הדאטה הגדול — נעביר אותו לקבצי גיבוי שיישארו בפרויקט אך לא ייטענו לאפליקציה. כך נוכל לשחזר אותו בעתיד בקלות.

### מבנה חדש

ניצור תיקיה `src/data/backup/` שתכיל את כל הדאטה המקורי המלא:
- `src/data/backup/companiesData.full.ts`
- `src/data/backup/employeesData.full.ts`
- `src/data/backup/trainingsData.full.ts`
- `src/data/backup/certificatesData.full.ts`

הקבצים האלה יכילו את כל ה-21,000+ השורות הנוכחיות, אך **לא ייובאו** בשום מקום באפליקציה (Vite לא יכלול אותם ב-bundle).

### הקבצים הפעילים

`src/data/companiesData.ts`, `employeesData.ts`, `trainingsData.ts`, `certificatesData.ts` — יוחלפו בגרסאות מצומצמות (~10%) עם הערה בראש:
```ts
// גרסה מצומצמת לפיתוח. הדאטה המלא נשמר ב: src/data/backup/<name>.full.ts
// כדי לשחזר: החלף את ה-export ב: export * from './backup/<name>.full';
```

### שמירה על קוהרנטיות

נסנן באופן שמשמר את הקשרים — חברות שנשארות → רק עובדיהן → רק הדרכות שלהן → רק תעודות שלהן. כך לא נקבל שגיאות "לא ידוע" באפליקציה.

## חלק 2: עמוד משימות חדש

### `src/data/mockData.ts` — הוספת interface
```ts
interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  companyId?: string;
  createdAt: string;
}
```

### `src/context/DataContext.tsx`
הוספת `tasks`, `addTask`, `updateTask`, `deleteTask`.

### `src/pages/Tasks.tsx` (חדש)
- כותרת + כפתור "משימה חדשה"
- סינון לפי סטטוס ועדיפות
- כרטיסיות משימות עם: כותרת, תיאור, תאריך יעד, badge סטטוס, badge עדיפות, שיוך לחברה
- כפתורי סימון הושלם / עריכה / מחיקה

### `src/components/TaskDialog.tsx` (חדש)
דיאלוג להוספה/עריכה — כותרת, תיאור, תאריך יעד, סטטוס, עדיפות, שיוך לחברה (אופציונלי).

### `src/components/AppSidebar.tsx`
פריט תפריט "משימות" עם אייקון `CheckSquare` בנתיב `/tasks`.

### `src/App.tsx`
route חדש `/tasks`.

## קבצים שיושפעו

| קובץ | פעולה |
|---|---|
| `src/data/backup/*.full.ts` | יצירה — גיבוי של הדאטה המלא |
| `src/data/companiesData.ts` | החלפה לגרסה מצומצמת |
| `src/data/employeesData.ts` | החלפה לגרסה מצומצמת |
| `src/data/trainingsData.ts` | החלפה לגרסה מצומצמת |
| `src/data/certificatesData.ts` | החלפה לגרסה מצומצמת |
| `src/data/mockData.ts` | Task interface |
| `src/context/DataContext.tsx` | ניהול משימות |
| `src/pages/Tasks.tsx` | עמוד חדש |
| `src/components/TaskDialog.tsx` | קומפוננטה חדשה |
| `src/components/AppSidebar.tsx` | פריט תפריט חדש |
| `src/App.tsx` | route חדש |

## תוצאה
- ביצועים מהירים יותר באפליקציה
- כל הדאטה המקורי נשמר בקבצי backup לשחזור עתידי בקלות
- עמוד "משימות" חדש למעקב אחרי כל מה שצריך לעשות
