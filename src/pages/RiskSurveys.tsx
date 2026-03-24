import { useState } from "react";
import { ClipboardCheck, Plus, Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { riskSurveys, getCompanyName } from "@/data/mockData";
import { formatDateHe } from "@/lib/utils";

const RiskSurveys = () => {
  const [search, setSearch] = useState("");

  const filtered = riskSurveys.filter(s =>
    s.siteName.includes(search) || getCompanyName(s.companyId).includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">סקרי סיכונים</h1>
          <p className="text-muted-foreground text-sm">ניהול סקרי סיכונים ודוחות</p>
        </div>
        <Button className="gap-2 self-start">
          <Plus className="h-4 w-4" />
          סקר חדש
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative max-w-sm">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="חיפוש לפי אתר או חברה..."
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
                <TableHead>שם אתר</TableHead>
                <TableHead>חברה</TableHead>
                <TableHead className="hidden sm:table-cell">תאריך</TableHead>
                <TableHead className="hidden md:table-cell">ממצאים</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((survey) => (
                <TableRow key={survey.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <ClipboardCheck className="h-4 w-4 text-muted-foreground shrink-0" />
                      {survey.siteName}
                    </div>
                  </TableCell>
                  <TableCell>{getCompanyName(survey.companyId)}</TableCell>
                  <TableCell className="hidden sm:table-cell">{survey.date}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <p className="text-sm truncate max-w-[200px]">{survey.findings}</p>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <FileText className="h-4 w-4" />
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

export default RiskSurveys;
