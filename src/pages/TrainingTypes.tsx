import { useState } from "react";
import { BookOpen, Plus, Pencil, Trash2, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { trainingCategories, trainingTypes, type TrainingCategory, type TrainingType } from "@/data/mockData";
import TrainingCategoryDialog from "@/components/TrainingCategoryDialog";
import TrainingTypeDialog from "@/components/TrainingTypeDialog";

const TrainingTypes = () => {
  const [categories, setCategories] = useState<TrainingCategory[]>(trainingCategories);
  const [types, setTypes] = useState<TrainingType[]>(trainingTypes);

  // Category dialog state
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TrainingCategory | null>(null);

  // Type dialog state
  const [typeDialogOpen, setTypeDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<TrainingType | null>(null);
  const [activeCategory, setActiveCategory] = useState<TrainingCategory | null>(null);

  const handleSaveCategory = (data: Omit<TrainingCategory, 'id'> & { id?: string }) => {
    if (data.id) {
      setCategories(prev => prev.map(c => c.id === data.id ? { ...c, ...data, id: data.id! } : c));
    } else {
      const newCat: TrainingCategory = { ...data, id: `cat${Date.now()}` };
      setCategories(prev => [...prev, newCat]);
    }
  };

  const handleDeleteCategory = (catId: string) => {
    setCategories(prev => prev.filter(c => c.id !== catId));
    setTypes(prev => prev.filter(t => t.categoryId !== catId));
  };

  const handleSaveType = (data: Omit<TrainingType, 'id'> & { id?: string }) => {
    if (data.id) {
      setTypes(prev => prev.map(t => t.id === data.id ? { ...t, ...data, id: data.id! } : t));
    } else {
      const newType: TrainingType = { ...data, id: `tt${Date.now()}` };
      setTypes(prev => [...prev, newType]);
    }
  };

  const handleDeleteType = (typeId: string) => {
    setTypes(prev => prev.filter(t => t.id !== typeId));
  };

  const openAddType = (cat: TrainingCategory, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingType(null);
    setActiveCategory(cat);
    setTypeDialogOpen(true);
  };

  const openEditType = (tt: TrainingType, cat: TrainingCategory) => {
    setEditingType(tt);
    setActiveCategory(cat);
    setTypeDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">סוגי הדרכות</h1>
          <p className="text-muted-foreground text-sm">ניהול קטגוריות הדרכה ותתי-נושאים</p>
        </div>
        <Button className="gap-2 self-start" onClick={() => { setEditingCategory(null); setCatDialogOpen(true); }}>
          <Plus className="h-4 w-4" />
          קטגוריה חדשה
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          {categories.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>אין קטגוריות הדרכה. הוסף קטגוריה חדשה כדי להתחיל.</p>
            </div>
          ) : (
            <Accordion type="multiple" className="w-full">
              {categories.map(cat => {
                const catTypes = types.filter(t => t.categoryId === cat.id);
                return (
                  <AccordionItem key={cat.id} value={cat.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 flex-1">
                        <BookOpen className="h-5 w-5 text-primary shrink-0" />
                        <div className="text-right">
                          <span className="font-semibold">{cat.name}</span>
                          {cat.description && (
                            <span className="text-muted-foreground text-xs mr-2">– {cat.description}</span>
                          )}
                        </div>
                        <Badge variant="secondary" className="mr-auto ml-2">{catTypes.length} נושאים</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" className="gap-1" onClick={(e) => openAddType(cat, e)}>
                            <Plus className="h-3 w-3" />
                            נושא חדש
                          </Button>
                          <Button size="sm" variant="ghost" className="gap-1" onClick={() => { setEditingCategory(cat); setCatDialogOpen(true); }}>
                            <Pencil className="h-3 w-3" />
                            ערוך קטגוריה
                          </Button>
                          <Button size="sm" variant="ghost" className="gap-1 text-destructive hover:text-destructive" onClick={() => handleDeleteCategory(cat.id)}>
                            <Trash2 className="h-3 w-3" />
                            מחק קטגוריה
                          </Button>
                        </div>

                        {catTypes.length === 0 ? (
                          <p className="text-sm text-muted-foreground py-4 text-center">אין נושאים בקטגוריה זו</p>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>שם הנושא</TableHead>
                                <TableHead>תוקף (חודשים)</TableHead>
                                <TableHead>דורש תעודה</TableHead>
                                <TableHead className="w-[100px]">פעולות</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {catTypes.map(tt => (
                                <TableRow key={tt.id}>
                                  <TableCell className="font-medium">{tt.name}</TableCell>
                                  <TableCell>{tt.validityMonths}</TableCell>
                                  <TableCell>
                                    <Badge variant={tt.requiresCertificate ? 'default' : 'secondary'}>
                                      {tt.requiresCertificate ? 'כן' : 'לא'}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-1">
                                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEditType(tt, cat)}>
                                        <Pencil className="h-3.5 w-3.5" />
                                      </Button>
                                      <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDeleteType(tt.id)}>
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </CardContent>
      </Card>

      <TrainingCategoryDialog
        open={catDialogOpen}
        onOpenChange={setCatDialogOpen}
        category={editingCategory}
        onSave={handleSaveCategory}
      />

      {activeCategory && (
        <TrainingTypeDialog
          open={typeDialogOpen}
          onOpenChange={setTypeDialogOpen}
          trainingType={editingType}
          categoryId={activeCategory.id}
          categoryName={activeCategory.name}
          onSave={handleSaveType}
        />
      )}
    </div>
  );
};

export default TrainingTypes;
