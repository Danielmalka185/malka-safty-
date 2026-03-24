import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Users, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CertificateTemplateEditor from "@/components/CertificateTemplateEditor";
import InstructorManager from "@/components/InstructorManager";
import { useData } from "@/context/DataContext";
import { toast } from "@/hooks/use-toast";

const EmailTemplateEditor = () => {
  const { emailTemplate, updateEmailTemplate } = useData();
  const [subject, setSubject] = useState(emailTemplate.subject);
  const [body, setBody] = useState(emailTemplate.body);

  const handleSave = () => {
    updateEmailTemplate({ subject, body });
    toast({ title: "תבנית המייל נשמרה בהצלחה" });
  };

  const placeholders = [
    { key: '{employeeName}', label: 'שם העובד' },
    { key: '{companyName}', label: 'שם החברה' },
    { key: '{trainingType}', label: 'סוג הדרכה' },
    { key: '{date}', label: 'תאריך' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">נוסח המייל</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>נושא המייל (Subject)</Label>
            <Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="נושא המייל" dir="rtl" />
          </div>
          <div className="space-y-2">
            <Label>גוף המייל</Label>
            <Textarea value={body} onChange={e => setBody(e.target.value)} placeholder="תוכן המייל..." rows={8} dir="rtl" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">משתנים זמינים:</Label>
            <div className="flex flex-wrap gap-2">
              {placeholders.map(p => (
                <Badge key={p.key} variant="secondary" className="cursor-pointer text-xs" onClick={() => setBody(prev => prev + ' ' + p.key)}>
                  {p.key} — {p.label}
                </Badge>
              ))}
            </div>
          </div>
          <Button onClick={handleSave}>שמור תבנית</Button>
        </CardContent>
      </Card>
    </div>
  );
};

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">הגדרות</h1>
        <p className="text-muted-foreground text-sm">ניהול תבניות תעודות, מדריכים ותבנית מייל</p>
      </div>
      <Tabs defaultValue="templates" dir="rtl">
        <TabsList>
          <TabsTrigger value="templates" className="gap-2">
            <FileText className="h-4 w-4" />
            תבניות תעודות
          </TabsTrigger>
          <TabsTrigger value="instructors" className="gap-2">
            <Users className="h-4 w-4" />
            מדריכים
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-2">
            <Mail className="h-4 w-4" />
            תבנית מייל
          </TabsTrigger>
        </TabsList>
        <TabsContent value="templates" className="mt-6">
          <CertificateTemplateEditor />
        </TabsContent>
        <TabsContent value="instructors" className="mt-6">
          <InstructorManager />
        </TabsContent>
        <TabsContent value="email" className="mt-6">
          <EmailTemplateEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
