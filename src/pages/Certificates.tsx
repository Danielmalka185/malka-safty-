import { useState } from "react";
import { Award, Search, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { certificates, getEmployeeName, getTrainingTypeName } from "@/data/mockData";

const statusLabels: Record<string, string> = {
  valid: 'בתוקף',
  expired: 'פג תוקף',
  expiring_soon: 'עומד לפוג',
};

const statusVariants: Record<string, 'default' | 'destructive' | 'secondary' | 'outline'> = {
  valid: 'default',
  expired: 'destructive',
  expiring_soon: 'outline',
};

const Certificates = () => {
  const [search, setSearch] = useState("");

  const filtered = certificates.filter(c =>
    getEmployeeName(c.employeeId).includes(search) ||
    getTrainingTypeName(c.trainingTypeId).includes(search)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">תעודות</h1>
        <p className="text-muted-foreground text-sm">מעקב תעודות והסמכות</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative max-w-sm">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="חיפוש לפי עובד או סוג הדרכה..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-9"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>עובד</TableHead>
                <TableHead>סוג הדרכה</TableHead>
                <TableHead className="hidden sm:table-cell">תאריך הנפקה</TableHead>
                <TableHead>תאריך תפוגה</TableHead>
                <TableHead>סטטוס</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((cert) => (
                <TableRow key={cert.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-muted-foreground shrink-0" />
                      {getEmployeeName(cert.employeeId)}
                    </div>
                  </TableCell>
                  <TableCell>{getTrainingTypeName(cert.trainingTypeId)}</TableCell>
                  <TableCell className="hidden sm:table-cell">{cert.issueDate}</TableCell>
                  <TableCell>{cert.expiryDate}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariants[cert.status]}>
                      {statusLabels[cert.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Certificates;
