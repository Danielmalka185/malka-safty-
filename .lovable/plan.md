
# מעבר לתמונת רקע + מדריכים — הושלם ✅

## מה נעשה

1. ✅ **mockData.ts** — `Instructor` interface, `ImageField` interface, `CertificateTemplate` עודכן (`image` במקום `pdf`, `backgroundImage` + `imageFields`)
2. ✅ **DataContext.tsx** — ניהול מדריכים (`addInstructor`, `updateInstructor`, `deleteInstructor`)
3. ✅ **ImageFieldEditor.tsx** — עורך חדש: תמונת רקע + גרירת שדות (עובד/חברה/מדריך/הדרכה)
4. ✅ **CertificatePreview.tsx** — פושט: HTML/CSS בלבד, Print to PDF, ללא ספריות PDF
5. ✅ **CertificateTemplateEditor.tsx** — משתמש ב-ImageFieldEditor במקום PdfFieldEditor
6. ✅ **InstructorManager.tsx** — ניהול מדריכים (הוספה/עריכה/מחיקה)
7. ✅ **Settings.tsx** — טאבים: תבניות תעודות + מדריכים
8. ✅ **TrainingDialog.tsx** — בחירת מדריך מרשימה (Select) כשיש מדריכים שמורים
9. ✅ **PdfFieldEditor.tsx** — נמחק
10. ✅ **pdf-lib, pdfjs-dist, fontkit** — הוסרו
11. ✅ **certificate-bg-heights.png** — תמונת רקע שהועלתה נשמרה ב-public/
