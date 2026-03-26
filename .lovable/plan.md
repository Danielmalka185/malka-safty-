

# הוספת מספר תעודה ייחודי לכל תעודה

## מה ישתנה

### 1. `src/data/mockData.ts` — שדה `certificateNumber` ב-Certificate
הוספת `certificateNumber: string` ל-interface של Certificate.

### 2. `src/context/DataContext.tsx` — מונה רץ + יצירת מספר אוטומטית
- מונה פנימי (counter) שמתחיל מ-1000 (או מהמספר הגבוה ביותר הקיים)
- בכל יצירת תעודה ב-`addCertificatesForTraining`, כל תעודה מקבלת מספר רץ ייחודי
- פורמט: `1001`, `1002`, `1003`...

### 3. `src/pages/Certificates.tsx` — הצגה בטבלה + העברה לתעודה
- עמודה חדשה "מספר תעודה" בטבלת התעודות
- העברת `certificateNumber` כשדה ב-`getCertData` כדי שיהיה זמין בתבנית

### 4. `src/components/CertificatePreview.tsx` — שדה ברירת מחדל
- הוספת `certificateNumber: '1001'` ל-`defaultData` כדי שייראה בתצוגה מקדימה

### 5. תבנית תמונה — שדה להדבקה
המספר זמין כשדה `certificateNumber` שאפשר להוסיף בעורך התבניות (ImageFieldEditor) ולמקם על התעודה כמו כל שדה אחר.

## תוצאה
- כל תעודה מקבלת מספר רץ אוטומטי וייחודי
- המספר מופיע בטבלת התעודות
- המספר זמין כשדה `certificateNumber` להדבקה על תבנית התעודה

