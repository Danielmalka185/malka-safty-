

# הוספת כתובת + חתימת מדריך + פרטים מלאים בתעודה + קישור חתימת עובד

## סיכום
1. **שדה כתובת למדריך** — הוספת `address` ל-Instructor
2. **העלאת תמונת חתימה למדריך** — שדה `signatureImage` (base64) עם אפשרות העלאה בטופס
3. **כל פרטי המדריך זמינים בתבנית תעודה** — כתובת, שנות ותק, מספר תעודה, תוקף תעודה
4. **שדה חתימת מדריך כתמונה על התעודה** — שדה מיוחד `instructorSignature` שמציג תמונה (לא טקסט) על התעודה
5. **קישור חתימת עובד במייל** — דורש backend (Lovable Cloud), נכין את ה-UI עכשיו כסימולציה

---

## שינויים טכניים

### 1. `src/data/mockData.ts`
- הוספת `address: string` ו-`signatureImage?: string` ל-interface `Instructor`

### 2. `src/components/InstructorManager.tsx`
- שדה כתובת בטופס
- כפתור העלאת תמונת חתימה (file input → base64) עם תצוגה מקדימה
- עמודה "חתימה" בטבלה (אייקון ✓ אם קיימת)

### 3. `src/components/ImageFieldEditor.tsx`
- הוספת שדות מדריך חדשים לקבוצת "מדריך":
  - `instructorAddress` (כתובת מדריך)
  - `instructorExperience` (שנות ותק)
  - `instructorCertNumber` (מספר תעודת מדריך)
  - `instructorCertExpiry` (תוקף תעודת מדריך)
  - `instructorSignature` (חתימת מדריך — סוג מיוחד: תמונה)

### 4. `src/components/CertificatePreview.tsx`
- ב-`resolveFieldValue`: אם השדה הוא `instructorSignature`, מחזיר URL של תמונה
- ב-render של שדות תמונה: אם הערך מתחיל ב-`data:image`, מציג `<img>` במקום טקסט
- הוספת ערכי ברירת מחדל לשדות החדשים ב-`defaultData`

### 5. `src/pages/Certificates.tsx`
- העברת כל פרטי המדריך ל-`getCertData` (כתובת, ותק, תעודה, תוקף, חתימה)

### 6. קישור חתימת עובד (סימולציה בלבד)
- בעמוד תעודות, כפתור "שלח לחתימה" — מציג toast "נשלח קישור חתימה ל-..." (דורש Lovable Cloud לעבודה אמיתית)

---

| # | קובץ | שינוי |
|---|---|---|
| 1 | `mockData.ts` | `address` + `signatureImage` ב-Instructor |
| 2 | `InstructorManager.tsx` | שדות כתובת + העלאת חתימה |
| 3 | `ImageFieldEditor.tsx` | שדות מדריך חדשים כולל חתימה |
| 4 | `CertificatePreview.tsx` | רינדור חתימה כתמונה + ברירות מחדל |
| 5 | `Certificates.tsx` | העברת פרטי מדריך מלאים + כפתור "שלח לחתימה" |

## תוצאה
- מדריך עם כל הפרטים + חתימה מצולמת
- חתימת המדריך מודבקת על התעודה כתמונה
- כל פרטי המדריך זמינים כשדות בתבנית
- כפתור "שלח לחתימה" מוכן (סימולציה — חיבור אמיתי בהמשך עם Lovable Cloud)

