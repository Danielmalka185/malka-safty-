

# הוספת שדה "חדש/ריענון" + שדות כפולים בתעודה

## מה צריך

1. **שדה "סוג הדרכה: חדש / ריענון"** — בכל הדרכה (Training) ובתעודה (Certificate)
2. **שדה זה יופיע גם על התעודה** — כדי שרואים אם זה "חדש" או "ריענון"
3. **אפשרות להוסיף שדה כפול** — למשל תאריך שמופיע ב-2-3 מקומות על התעודה (כל אחד במיקום אחר)
4. **שמירת התבנית הנוכחית** — לא לאבד את מה שכבר הגדרת

## שינויים

### 1. `src/data/mockData.ts` — הוספת שדה trainingKind
- ב-`Training` interface: הוספת `trainingKind: 'new' | 'renewal'`
- ב-`Certificate` interface: הוספת `trainingKind: 'new' | 'renewal'`

### 2. `src/components/TrainingDialog.tsx` — בחירת חדש/ריענון
- הוספת Select עם שתי אפשרויות: "הדרכה חדשה" / "ריענון"
- ברירת מחדל: "חדש"

### 3. `src/context/DataContext.tsx` — העברת trainingKind לתעודה
- `addCertificatesForTraining` יעביר את ה-`trainingKind` מההדרכה לתעודה

### 4. `src/components/ImageFieldEditor.tsx` — שדות חדשים + אפשרות כפילות
- הוספת שדה `trainingKind` (חדש/ריענון) לרשימת השדות הזמינים
- **כפתור "הוסף שדה נוסף"** — מאפשר להוסיף אותו שדה יותר מפעם אחת (למשל תאריך ב-2 מקומות שונים)
- כרגע ה-key חייב להיות ייחודי — נשנה ל-key עם סיומת מספרית (`date`, `date_2`, `date_3`)

### 5. `src/components/CertificatePreview.tsx` — תמיכה בשדות כפולים + trainingKind
- במיפוי הנתונים: `date_2` → אותו ערך כמו `date`
- `trainingKind` → "חדש" / "ריענון"

### 6. `src/pages/Certificates.tsx` — העשרת getCertData
- הוספת `trainingKind` לנתוני התעודה

| # | קובץ | שינוי |
|---|---|---|
| 1 | `mockData.ts` | הוספת `trainingKind` ל-Training ו-Certificate |
| 2 | `TrainingDialog.tsx` | Select חדש/ריענון |
| 3 | `DataContext.tsx` | העברת trainingKind לתעודה |
| 4 | `ImageFieldEditor.tsx` | שדה trainingKind + כפתור הוסף שדה כפול |
| 5 | `CertificatePreview.tsx` | תמיכה בשדות כפולים + trainingKind |
| 6 | `Certificates.tsx` | trainingKind ב-getCertData |

