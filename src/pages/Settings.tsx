import CertificateTemplateEditor from "@/components/CertificateTemplateEditor";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">הגדרות</h1>
        <p className="text-muted-foreground text-sm">עורך תבניות תעודות</p>
      </div>
      <CertificateTemplateEditor />
    </div>
  );
};

export default Settings;
