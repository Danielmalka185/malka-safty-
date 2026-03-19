import { useState } from "react";
import { GraduationCap, Plus, Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  trainings as initialTrainings,
  companies,
  trainingCategories,
  trainingTypes,
  employees,
  getCompanyName,
  getCategoryName,
  getTrainingTypeName,
  getEmployeeName,
  type Training,
} from "@/data/mockData";
import TrainingDialog from "@/components/TrainingDialog";

const Trainings = () => {
  const [allTrainings, setAllTrainings] = useState<Training[]>(initialTrainings);
  const [search, setSearch] = useState("");
  const [filterCompany, setFilterCompany] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState<Training | null>(null);
  const [viewTraining, setViewTraining] = useState<Training | null>(null);

  const filtered = allTrainings.filter(t => {
    const matchSearch =
      getCompanyName(t.companyId).includes(search) ||
      getCategoryName(t.categoryId).includes(search) ||
      t.instructor.includes(search) ||
      t.location.includes(search);
    const matchCompany = filterCompany === "all" || t.companyId === filterCompany;
    const matchCategory = filterCategory === "all" || t.categoryId === filterCategory;
    return matchSearch && matchCompany && matchCategory;
  });

  const handleSave = (data: Omit<Training, 'id'> & { id?: string }) => {
    if (data.id) {
      setAllTrainings(prev => prev.map(t => t.id === data.id ? { ...t, ...data, id: data.id! } : t));
    } else {
      const newTraining: Training = { ...data, id: `tr${Date.now()}` };
      setAllTrainings(prev => [...prev, newTraining]);
    }
  };

  const getTypeNames = (typeIds: string[]) =>
    typeIds.map(id => getTrainingTypeName(id)).join(', ');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">הדרכות</h1>
          <p className="text-muted-foreground text-sm">ניהול אירועי הדרכה</p>
        </div>
        <Button className="gap-2 self-start" onClick={() => { setEditingTraining(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4" />
          הדרכה חדשה
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="חיפוש..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-9"
              />
            </div>
            <Select value={filterCompany} onValueChange={setFilterCompany}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="כל החברות" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל החברות</SelectItem>
                {companies.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="כל הקטגוריות" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הקטגוריות</SelectItem>
                {trainingCategories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>קטגוריה</TableHead>
                <TableHead>נושאים</TableHead>
                <TableHead>חברה</TableHead>
                <TableHead className="hidden sm:table-cell">תאריך</TableHead>
                <TableHead className="hidden md:table-cell">מיקום</TableHead>
                <TableHead className="hidden lg:table-cell">מדריך</TableHead>
                <TableHead>משתתפים</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    לא נמצאו הדרכות
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((training) => (
                  <TableRow key={training.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setViewTraining(training)}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-primary shrink-0" />
                        {getCategoryName(training.categoryId)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {training.trainingTypeIds.map(id => (
                          <Badge key={id} variant="outline" className="text-xs">{getTrainingTypeName(id)}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{getCompanyName(training.companyId)}</TableCell>
                    <TableCell className="hidden sm:table-cell">{training.date}</TableCell>
                    <TableCell className="hidden md:table-cell">{training.location}</TableCell>
                    <TableCell className="hidden lg:table-cell">{training.instructor}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{training.participantIds.length}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setViewTraining(training); }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <TrainingDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        training={editingTraining}
        onSave={handleSave}
      />

      {/* View Training Detail Dialog */}
      <Dialog open={!!viewTraining} onOpenChange={() => setViewTraining(null)}>
        <DialogContent className="sm:max-w-lg" dir="rtl">
          {viewTraining && (
            <>
              <DialogHeader>
                <DialogTitle>{getCategoryName(viewTraining.categoryId)}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">חברה:</span>
                    <p className="font-medium">{getCompanyName(viewTraining.companyId)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">תאריך:</span>
                    <p className="font-medium">{viewTraining.date}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">מיקום:</span>
                    <p className="font-medium">{viewTraining.location || '—'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">מדריך:</span>
                    <p className="font-medium">{viewTraining.instructor || '—'}</p>
                  </div>
                </div>

                <div>
                  <span className="text-sm text-muted-foreground">נושאים:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {viewTraining.trainingTypeIds.map(id => (
                      <Badge key={id} variant="default">{getTrainingTypeName(id)}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-sm text-muted-foreground">משתתפים ({viewTraining.participantIds.length}):</span>
                  <div className="mt-1 space-y-1">
                    {viewTraining.participantIds.map(id => (
                      <p key={id} className="text-sm font-medium">{getEmployeeName(id)}</p>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Trainings;
