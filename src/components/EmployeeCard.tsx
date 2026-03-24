import { User, Phone, MapPin, Briefcase, FileText, Pencil, Award, Building2, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Employee } from "@/data/mockData";
import { useData } from "@/context/DataContext";
import { formatDateHe } from "@/lib/utils";

interface EmployeeCardProps {
  employee: Employee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (employee: Employee) => void;
}

export function EmployeeCard({ employee, open, onOpenChange, onEdit }: EmployeeCardProps) {
  const { certificates, getCompanyName, getTrainingTypeName } = useData();

  if (!employee) return null;

  const employeeCerts = certificates.filter(c => c.employeeId === employee.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <User className="h-5 w-5 text-primary" />
              {employee.firstName} {employee.lastName}
            </DialogTitle>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => { onOpenChange(false); onEdit(employee); }}>
              <Pencil className="h-3.5 w-3.5" />
              עריכה
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-muted/50 rounded-lg p-4">
          <InfoRow icon={FileText} label="ת.ז" value={employee.idNumber} dir="ltr" />
          <InfoRow icon={User} label="שם האב" value={employee.fatherName} />
          <InfoRow icon={Calendar} label="שנת לידה" value={String(employee.birthYear)} dir="ltr" />
          <InfoRow icon={Briefcase} label="מקצוע" value={employee.profession} />
          <InfoRow icon={Phone} label="טלפון" value={employee.phone} dir="ltr" />
          <InfoRow icon={Building2} label="חברה" value={getCompanyName(employee.companyId)} />
          {employee.address && <InfoRow icon={MapPin} label="כתובת" value={employee.address} />}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">סטטוס:</span>
          <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
            {employee.status === 'active' ? 'פעיל' : 'לא פעיל'}
          </Badge>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            הסמכות ותעודות ({employeeCerts.length})
          </h3>
          {employeeCerts.length > 0 ? (
            <div className="space-y-2">
              {employeeCerts.map(cert => (
                <div key={cert.id} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                  <div>
                    <div className="flex flex-wrap gap-1 mb-1">
                      {cert.trainingTypeIds.map(id => (
                        <Badge key={id} variant="secondary" className="text-xs">{getTrainingTypeName(id)}</Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      הונפקה: {cert.issueDate} • תפוגה: {cert.expiryDate}
                    </p>
                  </div>
                  <Badge variant={
                    cert.status === 'valid' ? 'default' :
                    cert.status === 'expiring_soon' ? 'secondary' : 'destructive'
                  }>
                    {cert.status === 'valid' ? 'בתוקף' :
                     cert.status === 'expiring_soon' ? 'עומד לפוג' : 'פג תוקף'}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">אין הסמכות לעובד זה</p>
          )}
        </div>
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
