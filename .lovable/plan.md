

# חיבור כפתור שליחת תעודה במייל לתשתית האמיתית

## מצב נוכחי
כפתור המייל בטבלת התעודות מציג הודעת "סימולציה" בלבד. תשתית המייל (`send-transactional-email`, דומיין מאומת, תבנית `certificate-notification`) כבר קיימת ומוכנה.

## שינויים

### 1. `src/pages/Certificates.tsx` — עדכון `handleSendMail`
- החלפת הסימולציה בקריאה אמיתית ל-Edge Function:
  ```
  supabase.functions.invoke('send-transactional-email', {
    body: {
      templateName: 'certificate-notification',
      recipientEmail: emp.email,
      idempotencyKey: `cert-notify-${cert.id}`,
      templateData: { employeeName, companyName, trainingType, date }
    }
  })
  ```
- הוספת מצב טעינה (loading) לכפתור בזמן השליחה
- טיפול בשגיאות עם toast מתאים
- import של supabase client

### קבצים שישתנו
| קובץ | שינוי |
|---|---|
| `src/pages/Certificates.tsx` | החלפת סימולציה בקריאה אמיתית ל-Edge Function |

## תוצאה
לחיצה על כפתור המייל תשלח מייל אמיתי לעובד עם פרטי התעודה דרך `notify.malkasafety.com`.

