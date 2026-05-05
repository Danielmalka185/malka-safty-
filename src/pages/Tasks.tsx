import { useState, useMemo } from "react";
import { Plus, Trash2, Pencil, CheckCircle2, Circle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData } from "@/context/DataContext";
import { Task } from "@/data/mockData";
import { TaskDialog } from "@/components/TaskDialog";

const statusLabel: Record<Task['status'], string> = {
  todo: 'לעשות', in_progress: 'בתהליך', done: 'הושלם',
};
const priorityLabel: Record<Task['priority'], string> = {
  low: 'נמוכה', medium: 'בינונית', high: 'גבוהה',
};
const priorityVariant: Record<Task['priority'], 'secondary' | 'default' | 'destructive'> = {
  low: 'secondary', medium: 'default', high: 'destructive',
};

export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask, getCompanyName } = useData();
  const [open, setOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | undefined>();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    return tasks.filter(t => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
      return true;
    }).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [tasks, statusFilter, priorityFilter]);

  const handleSave = (data: Omit<Task, 'id'> | Task) => {
    if ('id' in data) updateTask(data);
    else addTask(data);
  };

  const toggleDone = (t: Task) => {
    updateTask({ ...t, status: t.status === 'done' ? 'todo' : 'done' });
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">משימות</h1>
          <p className="text-muted-foreground">מעקב ניהול משימות וטיפול בבקשות</p>
        </div>
        <Button onClick={() => { setEditTask(undefined); setOpen(true); }}>
          <Plus className="w-4 h-4 ml-2" />
          משימה חדשה
        </Button>
      </div>

      <div className="flex gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="סטטוס" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל הסטטוסים</SelectItem>
            <SelectItem value="todo">לעשות</SelectItem>
            <SelectItem value="in_progress">בתהליך</SelectItem>
            <SelectItem value="done">הושלם</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="עדיפות" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל העדיפויות</SelectItem>
            <SelectItem value="low">נמוכה</SelectItem>
            <SelectItem value="medium">בינונית</SelectItem>
            <SelectItem value="high">גבוהה</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            אין משימות עדיין. לחץ על "משימה חדשה" כדי להתחיל.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(t => (
            <Card key={t.id} className={t.status === 'done' ? 'opacity-60' : ''}>
              <CardContent className="p-4 flex items-start gap-4">
                <Button variant="ghost" size="icon" onClick={() => toggleDone(t)}>
                  {t.status === 'done' ? <CheckCircle2 className="w-5 h-5 text-primary" /> :
                   t.status === 'in_progress' ? <Clock className="w-5 h-5 text-muted-foreground" /> :
                   <Circle className="w-5 h-5 text-muted-foreground" />}
                </Button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`font-semibold ${t.status === 'done' ? 'line-through' : ''}`}>{t.title}</h3>
                    <Badge variant={priorityVariant[t.priority]}>{priorityLabel[t.priority]}</Badge>
                    <Badge variant="outline">{statusLabel[t.status]}</Badge>
                  </div>
                  {t.description && <p className="text-sm text-muted-foreground mt-1">{t.description}</p>}
                  <div className="text-xs text-muted-foreground mt-2 flex gap-3">
                    <span>תאריך יעד: {t.dueDate}</span>
                    {t.companyId && <span>חברה: {getCompanyName(t.companyId)}</span>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => { setEditTask(t); setOpen(true); }}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteTask(t.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <TaskDialog open={open} onOpenChange={setOpen} task={editTask} onSave={handleSave} />
    </div>
  );
}
