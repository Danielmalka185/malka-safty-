import { useState } from "react";
import { Building2, Users, GraduationCap, Award, AlertTriangle, Download } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useData } from "@/context/DataContext";
import { formatDateHe } from "@/lib/utils";

const Dashboard = () => {
  const { companies, employees, trainings, certificates, getEmployeeName, getCompanyName, getCategoryName, getTrainingTypeName } = useData();
  const [monthsRange, setMonthsRange] = useState("3");

  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const thisMonthTrainings = trainings.filter(t => {
    const now = new Date();
    const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return t.date.startsWith(prefix);
  }).length;
  const expiredCerts = certificates.filter(c => c.status === 'expired').length;

  const now = new Date();
  const rangeMs = parseInt(monthsRange) * 30 * 24 * 60 * 60 * 1000;
  const cutoff = new Date(now.getTime() + rangeMs);

  const expiringCerts = certificates
    .filter(c => {
      const expiry = new Date(c.expiryDate);
      return expiry > now && expiry <= cutoff;
    })
    .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

  const displayedCerts = expiringCerts.slice(0, 5);

  const exportCsv = () => {
    const bom = '\uFEFF';
    const header = 'שם עובד,חברה,נושאי הדרכה,תאריך תפוגה\n';
    const rows = expiringCerts.map(cert => {
      const empName = getEmployeeName(cert.employeeId);
      const compName = getCompanyName(cert.companyId);
      const typeNames = cert.trainingTypeIds.map(id => getTrainingTypeName(id)).join(' | ');
      return `"${empName}","${compName}","${typeNames}","${formatDateHe(cert.expiryDate)}"`;
    }).join('\n');
    const blob = new Blob([bom + header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expiring-certificates-${monthsRange}m.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">דשבורד</h1>
        <p className="text-muted-foreground text-sm">סקירה כללית של המערכת</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="חברות" value={companies.length} icon={Building2} />
        <StatCard title="עובדים פעילים" value={activeEmployees} icon={Users} variant="success" />
        <StatCard title="הדרכות החודש" value={thisMonthTrainings} icon={GraduationCap} />
        <StatCard title="תעודות שפג תוקפן" value={expiredCerts} icon={Award} variant="destructive" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                תעודות שעומדות לפוג ({expiringCerts.length})
              </CardTitle>
              <div className="flex items-center gap-2">
                <ToggleGroup type="single" value={monthsRange} onValueChange={(v) => v && setMonthsRange(v)} size="sm">
                  <ToggleGroupItem value="1">חודש</ToggleGroupItem>
                  <ToggleGroupItem value="2">חודשיים</ToggleGroupItem>
                  <ToggleGroupItem value="3">3 חודשים</ToggleGroupItem>
                </ToggleGroup>
                {expiringCerts.length > 0 && (
                  <Button variant="outline" size="sm" onClick={exportCsv}>
                    <Download className="h-4 w-4" />
                    ייצוא
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {displayedCerts.length > 0 ? (
              <div className="space-y-3">
                {displayedCerts.map(cert => (
                  <div key={cert.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{getEmployeeName(cert.employeeId)}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {cert.trainingTypeIds.map(id => (
                          <span key={id} className="text-xs text-muted-foreground">{getTrainingTypeName(id)}</span>
                        ))}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-warning border-warning">{formatDateHe(cert.expiryDate)}</Badge>
                  </div>
                ))}
                {expiringCerts.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    ועוד {expiringCerts.length - 5} תעודות נוספות — השתמש בייצוא לצפייה בכולן
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">אין תעודות שעומדות לפוג בטווח הנבחר</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              הדרכות אחרונות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trainings.slice(-4).reverse().map(training => (
                <div key={training.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{getCategoryName(training.categoryId)}</p>
                    <p className="text-xs text-muted-foreground">{training.location}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm">{training.date}</p>
                    <p className="text-xs text-muted-foreground">{training.participantIds.length} משתתפים</p>
                  </div>
                </div>
              ))}
              {trainings.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">אין הדרכות עדיין</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
