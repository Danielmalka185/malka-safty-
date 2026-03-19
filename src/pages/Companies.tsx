import { useState } from "react";
import { Building2, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { companies } from "@/data/mockData";

const Companies = () => {
  const [search, setSearch] = useState("");

  const filtered = companies.filter(c =>
    c.name.includes(search) || c.contactPerson.includes(search) || c.registrationNumber.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">חברות</h1>
          <p className="text-muted-foreground text-sm">ניהול לקוחות עסקיים</p>
        </div>
        <Button className="gap-2 self-start">
          <Plus className="h-4 w-4" />
          חברה חדשה
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative max-w-sm">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="חיפוש לפי שם, ח.פ או איש קשר..."
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
                <TableHead>שם חברה</TableHead>
                <TableHead className="hidden md:table-cell">ח.פ</TableHead>
                <TableHead>איש קשר</TableHead>
                <TableHead className="hidden sm:table-cell">טלפון</TableHead>
                <TableHead className="hidden lg:table-cell">אימייל</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((company) => (
                <TableRow key={company.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                      {company.name}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{company.registrationNumber}</TableCell>
                  <TableCell>{company.contactPerson}</TableCell>
                  <TableCell className="hidden sm:table-cell" dir="ltr">{company.phone}</TableCell>
                  <TableCell className="hidden lg:table-cell" dir="ltr">{company.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8 text-sm">לא נמצאו חברות</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Companies;
