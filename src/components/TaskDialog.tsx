import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Task } from "@/data/mockData";
import { useData } from "@/context/DataContext";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
  onSave: (data: Omit<Task, 'id'> | Task) => void;
}

export function TaskDialog({ open, onOpenChange, task, onSave }: Props) {
  const { companies } = useData();
  const [form, setForm] = useState<Omit<Task, 'id'>>({
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    status: 'todo',
    priority: 'medium',
    companyId: undefined,
    createdAt: new Date().toISOString(),
  });

  useEffect(() => {
    if (task) {
      const { id, ...rest } = task;
      setForm(rest);
    } else {
      setForm({
        title: '', description: '',
        dueDate: new Date().toISOString().split('T')[0],
        status: 'todo', priority: 'medium', companyId: undefined,
        createdAt: new Date().toISOString(),
      });
    }
  }, [task, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave(task ? { ...form, id: task.id } : form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" dir="rtl">
        <DialogHeader>
          <DialogTitle>{task ? 'עריכת משימה' : 'משימה חדשה'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>כותרת *</Label>
            <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <Label>תיאור</Label>
            <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>תאריך יעד</Label>
              <Input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
            </div>
            <div>
              <Label>סטטוס</Label>
              <Select value={form.status} onValueChange={(v: Task['status']) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">לעשות</SelectItem>
                  <SelectItem value="in_progress">בתהליך</SelectItem>
                  <SelectItem value="done">הושלם</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>עדיפות</Label>
              <Select value={form.priority} onValueChange={(v: Task['priority']) => setForm({ ...form, priority: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">נמוכה</SelectItem>
                  <SelectItem value="medium">בינונית</SelectItem>
                  <SelectItem value="high">גבוהה</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>שיוך לחברה</Label>
              <Select value={form.companyId || 'none'} onValueChange={v => setForm({ ...form, companyId: v === 'none' ? undefined : v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">ללא</SelectItem>
                  {companies.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>ביטול</Button>
            <Button type="submit">שמירה</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
