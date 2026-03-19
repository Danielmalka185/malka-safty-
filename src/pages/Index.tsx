import { Building2, Users, GraduationCap, Award, AlertTriangle } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { companies, employees, trainings, certificates, getEmployeeName, getCategoryName, getTrainingTypeName } from "@/data/mockData";

const Dashboard = () => {
  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const thisMonthTrainings = trainings.filter(t => t.date.startsWith('2025-03')).length;
  const expiredCerts = certificates.filter(c => c.status === 'expired').length;
  const expiringCerts = certificates.filter(c => {
    const expiry = new Date(c.expiryDate);
    const now = new Date();
    const threeMonths = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    return expiry <= threeMonths && expiry > now;
  });

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
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              תעודות שעומדות לפוג בקרוב
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expiringCerts.length > 0 ? (
              <div className="space-y-3">
                {expiringCerts.map(cert => (
                  <div key={cert.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{getEmployeeName(cert.employeeId)}</p>
                      <p className="text-xs text-muted-foreground">{getTrainingTypeName(cert.trainingTypeId)}</p>
                    </div>
                    <Badge variant="outline" className="text-warning border-warning">
                      {cert.expiryDate}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">אין תעודות שעומדות לפוג בקרוב</p>
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
