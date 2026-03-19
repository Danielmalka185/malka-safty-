import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { TrainingCategory } from "@/data/mockData";

interface TrainingCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: TrainingCategory | null;
  onSave: (category: Omit<TrainingCategory, 'id'> & { id?: string }) => void;
}

const TrainingCategoryDialog = ({ open, onOpenChange, category, onSave }: TrainingCategoryDialogProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description);
    } else {
      setName('');
      setDescription('');
    }
  }, [category, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ id: category?.id, name: name.trim(), description: description.trim() });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>{category ? 'עריכת קטגוריה' : 'קטגוריה חדשה'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cat-name">שם הקטגוריה</Label>
            <Input id="cat-name" value={name} onChange={e => setName(e.target.value)} placeholder="לדוגמה: עבודה בגובה" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cat-desc">תיאור</Label>
            <Textarea id="cat-desc" value={description} onChange={e => setDescription(e.target.value)} placeholder="תיאור קצר של הקטגוריה" rows={3} />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>ביטול</Button>
            <Button type="submit">{category ? 'שמור שינויים' : 'הוסף קטגוריה'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingCategoryDialog;
