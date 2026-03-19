import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { TrainingType } from "@/data/mockData";

interface TrainingTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trainingType?: TrainingType | null;
  categoryId: string;
  categoryName: string;
  onSave: (tt: Omit<TrainingType, 'id'> & { id?: string }) => void;
}

const TrainingTypeDialog = ({ open, onOpenChange, trainingType, categoryId, categoryName, onSave }: TrainingTypeDialogProps) => {
  const [name, setName] = useState('');
  const [validityMonths, setValidityMonths] = useState(12);
  const [requiresCertificate, setRequiresCertificate] = useState(true);

  useEffect(() => {
    if (trainingType) {
      setName(trainingType.name);
      setValidityMonths(trainingType.validityMonths);
      setRequiresCertificate(trainingType.requiresCertificate);
    } else {
      setName('');
      setValidityMonths(12);
      setRequiresCertificate(true);
    }
  }, [trainingType, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      id: trainingType?.id,
      categoryId,
      name: name.trim(),
      field: categoryName,
      validityMonths,
      requiresCertificate,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>{trainingType ? 'עריכת נושא' : 'נושא חדש'} – {categoryName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tt-name">שם הנושא</Label>
            <Input id="tt-name" value={name} onChange={e => setName(e.target.value)} placeholder="לדוגמה: סולמות" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tt-validity">תוקף (חודשים)</Label>
            <Input id="tt-validity" type="number" min={1} value={validityMonths} onChange={e => setValidityMonths(Number(e.target.value))} required />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="tt-cert">דורש תעודה</Label>
            <Switch id="tt-cert" checked={requiresCertificate} onCheckedChange={setRequiresCertificate} />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>ביטול</Button>
            <Button type="submit">{trainingType ? 'שמור שינויים' : 'הוסף נושא'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingTypeDialog;
