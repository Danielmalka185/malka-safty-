

# הוספת טאב חיובים + הכנת תשתית לשליחת מיילים

## סיכום
שני דברים:
1. **טאב חיובים** — מעקב אחרי חיובים לפי הדרכה (בוצע / לא בוצע), בלי חשבוניות
2. **טאב תבנית מייל בהגדרות** — הכנת UI לניהול נוסח המייל שנשלח עם תעודות (השליחה בפועל תחובר בהמשך עם Lovable Cloud)

---

## שינויים

### 1. `src/data/mockData.ts` — interface חדש `Billing`
```typescript
export interface Billing {
  id: string;
  trainingId: string;
  companyId: string;
  amount: number;        // סכום סופי (אחרי הנחה)
  status: 'pending' | 'paid';
  dueDate: string;
  paidDate?: string;
  notes: string;
}
```
+ interface `EmailTemplate` לנוסח מייל (subject, body עם placeholders)

### 2. `src/context/DataContext.tsx` — ניהול חיובים + תבנית מייל
- State חדש: `billings`, `emailTemplate`
- פונקציות: `addBilling`, `updateBilling` (שינוי סטטוס ל-paid), `updateEmailTemplate`
- כשיוצרים הדרכה (`addTraining`) — נוצר חיוב אוטומטי עם הסכום מ-`calculateFinalPrice`

### 3. `src/pages/Billings.tsx` — עמוד חיובים חדש
- טבלה עם: חברה, הדרכה, סכום, סטטוס (ממתין/שולם), תאריך
- Badge צבעוני לסטטוס
- כפתור "סמן כשולם" שמעדכן סטטוס + תאריך תשלום
- חיפוש וסינון לפי חברה וסטטוס
- סיכום: סה"כ ממתין / סה"כ שולם

### 4. `src/pages/Settings.tsx` — טאב תבנית מייל
- טאב שלישי "תבנית מייל" עם אייקון Mail
- עורך פשוט: שדה נושא (subject) + textarea לגוף המייל
- Placeholders זמינים: `{employeeName}`, `{companyName}`, `{trainingType}`, `{date}`
- כפתור שמירה
- (השליחה בפועל תחובר בשלב הבא עם Lovable Cloud)

### 5. `src/components/AppSidebar.tsx` + `src/App.tsx` — ניווט + route
- הוספת "חיובים" לתפריט עם אייקון `CreditCard`
- Route חדש: `/billings`

---

| # | קובץ | שינוי |
|---|---|---|
| 1 | `mockData.ts` | interfaces: Billing, EmailTemplate |
| 2 | `DataContext.tsx` | state + פונקציות חיובים ומייל |
| 3 | `Billings.tsx` (חדש) | עמוד מעקב חיובים |
| 4 | `Settings.tsx` | טאב תבנית מייל |
| 5 | `AppSidebar.tsx` + `App.tsx` | ניווט ו-route |

## תוצאה
- מעקב חיובים לכל הדרכה — ממתין/שולם
- עורך נוסח מייל בהגדרות (מוכן לחיבור שליחה בהמשך)
- חיוב נוצר אוטומטית עם יצירת הדרכה

