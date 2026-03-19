import { useState } from "react";
import { GraduationCap, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { trainings, getCompanyName, getTrainingTypeName } from "@/data/mockData";

const Trainings = () => {
  const [search, setSearch] = useState("");

  const filtered = trainings.filter(t =>
    getCompanyName(t.companyId).includes(search) ||
    getTrainingTypeName(t.trainingTypeId).includes(search) ||
    t.instructor.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">הדרכות</h1>
          <p className="text-muted-foreground text-sm">ניהול אירועי הדרכה</p>
        </div>
        <Button className="gap-2 self-start">
          <Plus className="h-4 w-4" />
          הדרכה חדשה
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative max-w-sm">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="חיפוש לפי חברה, הדרכה או מדריך..."
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
                <TableHead>סוג הדרכה</TableHead>
                <TableHead>חברה</TableHead>
                <TableHead className="hidden sm:table-cell">תאריך</TableHead>
                <TableHead className="hidden md:table-cell">מיקום</TableHead>
                <TableHead className="hidden lg:table-cell">מדריך</TableHead>
                <TableHead>משתתפים</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((training) => (
                <TableRow key={training.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground shrink-0" />
                      {getTrainingTypeName(training.trainingTypeId)}
                    </div>
                  </TableCell>
                  <TableCell>{getCompanyName(training.companyId)}</TableCell>
                  <TableCell className="hidden sm:table-cell">{training.date}</TableCell>
                  <TableCell className="hidden md:table-cell">{training.location}</TableCell>
                  <TableCell className="hidden lg:table-cell">{training.instructor}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{training.participantIds.length}</Badge>
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

export default Trainings;
