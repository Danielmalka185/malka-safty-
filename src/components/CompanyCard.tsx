import { Building2, Phone, Mail, MapPin, Globe, User, FileText, Pencil, Users, GraduationCap, ClipboardList, Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Company, employees, trainings, riskSurveys, getTrainingTypeName } from "@/data/mockData";

interface CompanyCardProps {
  company: Company | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (company: Company) => void;
}

export function CompanyCard({ company, open, onOpenChange, onEdit }: CompanyCardProps) {
  if (!company) return null;

  const companyEmployees = employees.filter(e => e.companyId === company.id);
  const companyTrainings = trainings.filter(t => t.companyId === company.id);
  const companySurveys = riskSurveys.filter(s => s.companyId === company.id);
  const activeEmployees = companyEmployees.filter(e => e.status === 'active').length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Building2 className="h-5 w-5 text-primary" />
              {company.name}
            </DialogTitle>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => { onOpenChange(false); onEdit(company); }}>
              <Pencil className="h-3.5 w-3.5" />
              עריכה
            </Button>
          </div>
        </DialogHeader>

        {/* Company Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-muted/50 rounded-lg p-4">
          <InfoRow icon={FileText} label="ח.פ" value={company.registrationNumber} dir="ltr" />
          <InfoRow icon={User} label="איש קשר" value={company.contactPerson} />
          <InfoRow icon={Phone} label="נייד" value={company.phone} dir="ltr" />
          {company.officePhone && <InfoRow icon={Phone} label="טלפון משרד" value={company.officePhone} dir="ltr" />}
          <InfoRow icon={Mail} label="אימייל" value={company.email} dir="ltr" />
          <InfoRow icon={MapPin} label="כתובת" value={company.address} />
          {company.mailingAddress && <InfoRow icon={Send} label="דואר" value={company.mailingAddress} />}
          {company.website && <InfoRow icon={Globe} label="אתר" value={company.website} dir="ltr" />}
        </div>

        {company.notes && (
          <div className="bg-accent/30 rounded-lg p-3">
            <p className="text-sm text-muted-foreground font-medium mb-1">הערות</p>
            <p className="text-sm">{company.notes}</p>
          </div>
        )}

        <Separator />

        {/* Tabs */}
        <Tabs defaultValue="employees" dir="rtl">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="employees" className="gap-1.5">
              <Users className="h-3.5 w-3.5" />
              עובדים ({companyEmployees.length})
            </TabsTrigger>
            <TabsTrigger value="trainings" className="gap-1.5">
              <GraduationCap className="h-3.5 w-3.5" />
              הדרכות ({companyTrainings.length})
            </TabsTrigger>
            <TabsTrigger value="surveys" className="gap-1.5">
              <ClipboardList className="h-3.5 w-3.5" />
              סקרים ({companySurveys.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="employees" className="space-y-2 mt-3">
            {companyEmployees.length > 0 ? companyEmployees.map(emp => (
              <div key={emp.id} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{emp.firstName} {emp.lastName}</p>
                  <p className="text-xs text-muted-foreground">{emp.profession} • ת.ז {emp.idNumber}</p>
                </div>
                <Badge variant={emp.status === 'active' ? 'default' : 'secondary'}>
                  {emp.status === 'active' ? 'פעיל' : 'לא פעיל'}
                </Badge>
              </div>
            )) : <EmptyState text="אין עובדים משויכים לחברה זו" />}
            <p className="text-xs text-muted-foreground">{activeEmployees} פעילים מתוך {companyEmployees.length}</p>
          </TabsContent>

          <TabsContent value="trainings" className="space-y-2 mt-3">
            {companyTrainings.length > 0 ? companyTrainings.map(t => (
              <div key={t.id} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{getTrainingTypeName(t.trainingTypeId)}</p>
                  <p className="text-xs text-muted-foreground">{t.location} • {t.instructor}</p>
                </div>
                <div className="text-left">
                  <p className="text-sm">{t.date}</p>
                  <p className="text-xs text-muted-foreground">{t.participantIds.length} משתתפים</p>
                </div>
              </div>
            )) : <EmptyState text="אין הדרכות לחברה זו" />}
          </TabsContent>

          <TabsContent value="surveys" className="space-y-2 mt-3">
            {companySurveys.length > 0 ? companySurveys.map(s => (
              <div key={s.id} className="p-3 bg-muted/40 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-sm">{s.siteName}</p>
                  <p className="text-sm text-muted-foreground">{s.date}</p>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{s.findings}</p>
              </div>
            )) : <EmptyState text="אין סקרי סיכונים לחברה זו" />}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({ icon: Icon, label, value, dir }: { icon: any; label: string; value: string; dir?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium" dir={dir}>{value}</span>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="text-sm text-muted-foreground text-center py-4">{text}</p>;
}
