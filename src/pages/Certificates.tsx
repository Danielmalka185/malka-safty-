import { useState } from "react";
import { Award, Search, Download, Building2, Eye, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CertificatePreview, { downloadCertificatePdf } from "@/components/CertificatePreview";
import { useData } from "@/context/DataContext";
import { formatDateHe } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Certificate } from "@/data/mockData";

const statusLabels: Record<string, string> = { valid: 'בתוקף', expired: 'פג תוקף', expiring_soon: 'עומד לפוג' };
const statusVariants: Record<string, 'default' | 'destructive' | 'secondary' | 'outline'> = { valid: 'default', expired: 'destructive', expiring_soon: 'outline' };

const Certificates = () => {
  const { certificates, companies, trainings, templates, instructors, getEmployeeName, getCompanyName, getTrainingTypeName, getEmployee, getCategoryName, getTemplateForCategory } = useData();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewCert, setViewCert] = useState<Certificate | null>(null);
  const [sendingCertId, setSendingCertId] = useState<string | null>(null);

  const handleSendMail = async (cert: Certificate) => {
    const emp = getEmployee(cert.employeeId);
    if (!emp?.email) {
      toast({ title: "שגיאה", description: "לעובד אין כתובת מייל", variant: "destructive" });
      return;
    }
    setSendingCertId(cert.id);
    try {
      const { data, error } = await supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'certificate-notification',
          recipientEmail: emp.email,
          idempotencyKey: `cert-notify-${cert.id}`,
          templateData: {
            employeeName: getEmployeeName(cert.employeeId),
            companyName: getCompanyName(cert.companyId),
            trainingType: getTypeNames(cert),
            date: formatDateHe(cert.issueDate),
          },
        },
      });
      if (error) throw error;
      if (data?.success === false) {
        toast({ title: "לא נשלח", description: "הכתובת חסומה או בוטלה מרשימת התפוצה", variant: "destructive" });
      } else {
        toast({ title: "המייל נשלח", description: `נשלח בהצלחה ל-${emp.email}` });
      }
    } catch (err: any) {
      toast({ title: "שגיאה בשליחה", description: err.message || "אירעה שגיאה בשליחת המייל", variant: "destructive" });
    } finally {
      setSendingCertId(null);
    }
  };

  const getTypeNames = (cert: Certificate): string => {
    return cert.trainingTypeIds.map(id => getTrainingTypeName(id)).join(', ');
  };

  const filtered = certificates.filter(c => {
    const typeNames = getTypeNames(c);
    const matchesSearch = getEmployeeName(c.employeeId).includes(search) || typeNames.includes(search) || getCompanyName(c.companyId).includes(search);
    const matchesCompany = companyFilter === "all" || c.companyId === companyFilter;
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesCompany && matchesStatus;
  });

  const getCertData = (cert: Certificate): Record<string, string> => {
    const emp = getEmployee(cert.employeeId);
    const training = trainings.find(t => t.id === cert.trainingId);
    const categoryId = training?.categoryId || '';
    const typeNames = cert.trainingTypeIds.map(id => getTrainingTypeName(id)).join('\n');
    const company = companies.find(c => c.id === cert.companyId);
    return {
      certificateNumber: cert.certificateNumber || '',
      employeeName: getEmployeeName(cert.employeeId),
      firstName: emp?.firstName || '',
      lastName: emp?.lastName || '',
      idNumber: emp?.idNumber || '',
      companyName: getCompanyName(cert.companyId),
      companyId: company?.registrationNumber || '',
      companyPhone: company?.phone || company?.officePhone || '',
      companyAddress: company?.address || '',
      trainingType: typeNames,
      categoryName: getCategoryName(categoryId),
      date: formatDateHe(cert.issueDate),
      expiryDate: formatDateHe(cert.expiryDate),
      instructor: training?.instructor || '',
      birthYear: emp?.birthYear?.toString() || '',
      fatherName: emp?.fatherName || '',
      profession: emp?.profession || '',
      phone: emp?.phone || '',
      address: emp?.address || '',
      trainingKind: cert.trainingKind === 'renewal' ? 'ריענון' : 'חדש',
      ...((() => {
        const inst = instructors.find(i => i.name === training?.instructor);
        return inst ? {
          instructorPhone: inst.phone,
          instructorId: inst.idNumber,
          instructorAddress: inst.address,
          instructorExperience: String(inst.yearsOfExperience),
          instructorCertNumber: inst.certificateNumber,
          instructorCertExpiry: inst.certificateExpiry ? formatDateHe(inst.certificateExpiry) : '',
          instructorSignature: inst.signatureImage || '',
        } : {};
      })()),
    };
  };

  const getCertTemplate = (cert: Certificate) => {
    if (cert.templateId) {
      const tmpl = templates.find(t => t.id === cert.templateId);
      if (tmpl) return tmpl;
    }
    const training = trainings.find(t => t.id === cert.trainingId);
    return getTemplateForCategory(training?.categoryId || '');
  };

  const handleDownload = (cert: Certificate) => {
    const template = getCertTemplate(cert);
    const data = getCertData(cert);
    downloadCertificatePdf(template, data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">תעודות</h1>
        <p className="text-muted-foreground text-sm">מעקב תעודות והסמכות</p>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="חיפוש לפי עובד, חברה או סוג הדרכה..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-9" />
            </div>
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="כל החברות" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל החברות</SelectItem>
                {companies.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="כל הסטטוסים" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הסטטוסים</SelectItem>
                <SelectItem value="valid">בתוקף</SelectItem>
                <SelectItem value="expiring_soon">עומד לפוג</SelectItem>
                <SelectItem value="expired">פג תוקף</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>מס׳ תעודה</TableHead>
                <TableHead>עובד</TableHead>
                <TableHead>חברה</TableHead>
                <TableHead>נושאי הדרכה</TableHead>
                <TableHead className="hidden sm:table-cell">תאריך הנפקה</TableHead>
                <TableHead>תאריך תפוגה</TableHead>
                <TableHead>סטטוס</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">לא נמצאו תעודות</TableCell></TableRow>
              ) : (
                filtered.map((cert) => (
                  <TableRow key={cert.id}>
                    <TableCell className="font-mono text-sm">{cert.certificateNumber || '—'}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2"><Award className="h-4 w-4 text-muted-foreground shrink-0" />{getEmployeeName(cert.employeeId)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-muted-foreground shrink-0" />{getCompanyName(cert.companyId)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {cert.trainingTypeIds.map(id => (
                          <Badge key={id} variant="secondary" className="text-xs">{getTrainingTypeName(id)}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{formatDateHe(cert.issueDate)}</TableCell>
                    <TableCell>{formatDateHe(cert.expiryDate)}</TableCell>
                    <TableCell><Badge variant={statusVariants[cert.status]}>{statusLabels[cert.status]}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewCert(cert)}><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleSendMail(cert)}><Mail className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDownload(cert)}><Download className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={!!viewCert} onOpenChange={() => setViewCert(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
          {viewCert && (
            <>
              <DialogHeader><DialogTitle>תעודה — {getEmployeeName(viewCert.employeeId)}</DialogTitle></DialogHeader>
              <CertificatePreview template={getCertTemplate(viewCert)} data={getCertData(viewCert)} showPrintButton />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Certificates;
