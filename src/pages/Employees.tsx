import { useState } from "react";
import { Users, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { employees, getCompanyName } from "@/data/mockData";

const Employees = () => {
  const [search, setSearch] = useState("");

  const filtered = employees.filter(e =>
    `${e.firstName} ${e.lastName}`.includes(search) || e.idNumber.includes(search) || getCompanyName(e.companyId).includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">עובדים</h1>
          <p className="text-muted-foreground text-sm">ניהול עובדים והסמכות</p>
        </div>
        <Button className="gap-2 self-start">
          <Plus className="h-4 w-4" />
          עובד חדש
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative max-w-sm">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="חיפוש לפי שם, ת.ז או חברה..."
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
                <TableHead>שם</TableHead>
                <TableHead className="hidden md:table-cell">ת.ז</TableHead>
                <TableHead>חברה</TableHead>
                <TableHead className="hidden sm:table-cell">תפקיד</TableHead>
                <TableHead>סטטוס</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((emp) => (
                <TableRow key={emp.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                      {emp.firstName} {emp.lastName}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{emp.idNumber}</TableCell>
                  <TableCell>{getCompanyName(emp.companyId)}</TableCell>
                  <TableCell className="hidden sm:table-cell">{emp.role}</TableCell>
                  <TableCell>
                    <Badge variant={emp.status === 'active' ? 'default' : 'secondary'}>
                      {emp.status === 'active' ? 'פעיל' : 'לא פעיל'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8 text-sm">לא נמצאו עובדים</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Employees;
