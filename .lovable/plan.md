

# שינוי מבנה תעודות + תיקון הורדה וגופן

## הבעיות שזוהו

1. **6 תעודות במקום 1** — המערכת יוצרת תעודה נפרדת לכל נושא (trainingTypeId). צריך תעודה אחת לכל עובד לכל הדרכה, עם רשימת כל הנושאים בפנים
2. **גופן Rubik — 404** — כתובת ה-TTF שבורה, הורדת PDF נכשלת
3. **EmployeeCard** — משתמש ב-imports סטטיים (`certificates`, `getCompanyName`) במקום DataContext
4. **תוקף** — ייקבע לפי הנושא הראשון (הקצר ביותר)

## שינויים

### 1. `src/data/mockData.ts` — שינוי Certificate interface
```typescript
interface Certificate {
  id: string;
  employeeId: string;
  companyId: string;
  trainingTypeIds: string[];  // רשימת נושאים (במקום trainingTypeId יחיד)
  trainingId: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expired' | 'expiring_soon';
}
```

### 2. `src/context/DataContext.tsx` — תעודה אחת לכל משתתף
`addCertificatesForTraining` ישתנה: במקום לולאה על `trainingTypeIds` פנימית, ייצור תעודה אחת לכל עובד עם כל ה-`trainingTypeIds` של ההדרכה. התוקף ייקבע לפי הנושא עם הוולידיות הקצרה ביותר.

### 3. `src/components/CertificatePreview.tsx` — תיקון גופן + תצוגת נושאים
- החלפת URL הגופן Rubik לכתובת תקינה (Regular weight)
- בתבנית HTML: הצגת `trainingType` כרשימת נושאים (אחד אחרי השני)
- הורדה דרך חלון הדפסה (כמו היום, רק שעכשיו זה יעבוד עם גופן תקין)

### 4. `src/pages/Certificates.tsx` — התאמה ל-interface החדש
- עמודת "סוג הדרכה" תציג רשימת badges של כל הנושאים
- `getCertData` ישלח `trainingType` כמחרוזת של כל הנושאים מופרדים בפסיק/שורה חדשה

### 5. `src/components/EmployeeCard.tsx` — שימוש ב-DataContext
- החלפת imports סטטיים (`certificates`, `getCompanyName`, `getTrainingTypeName`) ב-`useData()`

### 6. `src/pages/Index.tsx` — התאמה ל-interface החדש
- `getTrainingTypeName(cert.trainingTypeId)` → הצגת הנושא הראשון או שם הקטגוריה

| # | קובץ | שינוי |
|---|---|---|
| 1 | `mockData.ts` | `trainingTypeId` → `trainingTypeIds: string[]` |
| 2 | `DataContext.tsx` | תעודה אחת לכל עובד, תוקף לפי הקצר |
| 3 | `CertificatePreview.tsx` | תיקון URL גופן Rubik + הצגת רשימת נושאים |
| 4 | `Certificates.tsx` | התאמה ל-interface + הצגת badges |
| 5 | `EmployeeCard.tsx` | שימוש ב-useData במקום imports סטטיים |
| 6 | `Index.tsx` | התאמה ל-interface החדש |

## תוצאה
- הדרכה עם 6 נושאים → תעודה אחת לכל עובד עם כל הנושאים רשומים
- תוקף לפי הנושא הקצר ביותר
- הורדה/הדפסה עובדת עם גופן עברי תקין

