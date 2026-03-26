import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useData } from "@/context/DataContext";
import type { Instructor } from "@/data/mockData";
import { toast } from "sonner";
import { formatDateHe } from "@/lib/utils";

const InstructorManager = () => {
  const { instructors, addInstructor, updateInstructor, deleteInstructor } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Instructor | null>(null);
  const [name, setName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [certificateNumber, setCertificateNumber] = useState("");
  const [certificateExpiry, setCertificateExpiry] = useState("");

  const openNew = () => {
    setEditing(null);
    setName(""); setIdNumber(""); setPhone(""); setYearsOfExperience(""); setCertificateNumber(""); setCertificateExpiry("");
    setDialogOpen(true);
  };

  const openEdit = (inst: Instructor) => {
    setEditing(inst);
    setName(inst.name);
    setIdNumber(inst.idNumber);
    setPhone(inst.phone);
    setYearsOfExperience(String(inst.yearsOfExperience));
    setCertificateNumber(inst.certificateNumber);
    setCertificateExpiry(inst.certificateExpiry);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    if (editing) {
      updateInstructor({ ...editing, name, idNumber, phone, yearsOfExperience: Number(yearsOfExperience) || 0, certificateNumber, certificateExpiry });
      toast.success("המדריך עודכן");
    } else {
      addInstructor({ name, idNumber, phone, yearsOfExperience: Number(yearsOfExperience) || 0, certificateNumber, certificateExpiry });
      toast.success("מדריך נוסף");
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteInstructor(id);
    toast.success("המדריך נמחק");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg">ניהול מדריכים</CardTitle>
        <Button onClick={openNew} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          מדריך חדש
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>שם</TableHead>
              <TableHead>שנות ותק</TableHead>
              <TableHead>מספר תעודה</TableHead>
              <TableHead>תוקף תעודה</TableHead>
              <TableHead className="w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {instructors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  אין מדריכים. הוסף מדריך חדש כדי להתחיל.
                </TableCell>
              </TableRow>
            ) : (
              instructors.map(inst => (
                <TableRow key={inst.id}>
                  <TableCell className="font-medium">{inst.name}</TableCell>
                  <TableCell>{inst.yearsOfExperience}</TableCell>
                  <TableCell>{inst.certificateNumber}</TableCell>
                  <TableCell>{inst.certificateExpiry ? formatDateHe(inst.certificateExpiry) : '—'}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(inst)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(inst.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>{editing ? 'עריכת מדריך' : 'מדריך חדש'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>שם *</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="שם המדריך" />
            </div>
            <div className="space-y-2">
              <Label>תעודת זהות</Label>
              <Input value={idNumber} onChange={e => setIdNumber(e.target.value)} placeholder="מספר תעודת זהות" />
            </div>
            <div className="space-y-2">
              <Label>טלפון</Label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="מספר טלפון" />
            </div>
            <div className="space-y-2">
              <Label>שנות ותק</Label>
              <Input type="number" value={yearsOfExperience} onChange={e => setYearsOfExperience(e.target.value)} placeholder="מספר שנות ותק" />
            </div>
            <div className="space-y-2">
              <Label>מספר תעודה</Label>
              <Input value={certificateNumber} onChange={e => setCertificateNumber(e.target.value)} placeholder="מספר תעודת מדריך" />
            </div>
            <div className="space-y-2">
              <Label>תוקף תעודה</Label>
              <Input type="date" value={certificateExpiry} onChange={e => setCertificateExpiry(e.target.value)} />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>ביטול</Button>
            <Button onClick={handleSave} disabled={!name.trim()}>
              {editing ? 'שמור' : 'הוסף'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default InstructorManager;
