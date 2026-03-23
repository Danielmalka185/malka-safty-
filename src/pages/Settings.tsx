import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Users } from "lucide-react";
import CertificateTemplateEditor from "@/components/CertificateTemplateEditor";
import InstructorManager from "@/components/InstructorManager";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">הגדרות</h1>
        <p className="text-muted-foreground text-sm">ניהול תבניות תעודות ומדריכים</p>
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
        </TabsList>
        <TabsContent value="templates" className="mt-6">
          <CertificateTemplateEditor />
        </TabsContent>
        <TabsContent value="instructors" className="mt-6">
          <InstructorManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
