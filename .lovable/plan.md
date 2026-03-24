

# שינוי תצוגת תאריכים לפורמט עברי (D.M.YYYY)

## מה ישתנה

### 1. `src/lib/utils.ts` — פונקציה חדשה `formatDateHe`
```typescript
export function formatDateHe(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parseInt(parts[2])}.${parseInt(parts[1])}.${parts[0]}`;
}
```

### 2. עדכון כל הקבצים שמציגים תאריכים

| קובץ | מה ישתנה |
|---|---|
| `src/pages/Certificates.tsx` | `cert.issueDate`, `cert.expiryDate` בטבלה + `getCertData` — date ו-expiryDate יעברו דרך `formatDateHe` |
| `src/pages/Trainings.tsx` | `training.date` בטבלה |
| `src/pages/Index.tsx` | `cert.expiryDate` ב-badge, `training.date` ברשימה, ייצוא CSV |
| `src/pages/RiskSurveys.tsx` | `survey.date` בטבלה |
| `src/components/EmployeeCard.tsx` | `cert.issueDate`, `cert.expiryDate` |
| `src/components/CompanyCard.tsx` | `t.date`, `s.date` |
| `src/components/CertificatePreview.tsx` | `defaultData` — שינוי ערכי ברירת מחדל לפורמט עברי, + `resolveFieldValue` יפרמט אוטומטית שדות שמכילים תאריך (date, expiryDate, issueDate) |

### 3. `src/components/CertificatePreview.tsx` — פורמט בתעודות
- ב-`defaultData`: `date: '1.1.2025'`, `expiryDate: '1.1.2026'`
- ב-`resolveFieldValue`: זיהוי שדות תאריך (key מכיל `date` או `Date`) והמרה אוטומטית אם הערך בפורמט ISO
- זה מכסה גם שדות כפולים כמו `date_2`

### 4. `src/pages/Certificates.tsx` — `getCertData`
- `date: formatDateHe(cert.issueDate)` במקום הערך הגולמי
- `expiryDate: formatDateHe(cert.expiryDate)`

## תוצאה
כל תאריך בכל המערכת — טבלאות, דשבורד, כרטיסים, תעודות, תצוגה מקדימה, והדפסה — יוצג כ-`24.3.2026`

