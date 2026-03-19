import { useState } from "react";
import { BookOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { trainingTypes } from "@/data/mockData";

const TrainingTypes = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">סוגי הדרכות</h1>
          <p className="text-muted-foreground text-sm">הגדרת סוגי הדרכות ותוקף</p>
        </div>
        <Button className="gap-2 self-start">
          <Plus className="h-4 w-4" />
          סוג הדרכה חדש
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>שם הדרכה</TableHead>
                <TableHead>תחום</TableHead>
                <TableHead>תוקף (חודשים)</TableHead>
                <TableHead>דורש תעודה</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainingTypes.map((tt) => (
                <TableRow key={tt.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                      {tt.name}
                    </div>
                  </TableCell>
                  <TableCell>{tt.field}</TableCell>
                  <TableCell>{tt.validityMonths}</TableCell>
                  <TableCell>
                    <Badge variant={tt.requiresCertificate ? 'default' : 'secondary'}>
                      {tt.requiresCertificate ? 'כן' : 'לא'}
                    </Badge>
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

export default TrainingTypes;
