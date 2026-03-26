import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Employee } from "@/data/mockData";
import { useData } from "@/context/DataContext";

interface EmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: Employee | null;
  onSave: (employee: Omit<Employee, 'id'> & { id?: string }) => void;
}

export function EmployeeDialog({ open, onOpenChange, employee, onSave }: EmployeeDialogProps) {
  const { companies } = useData();
  const [form, setForm] = useState({
    firstName: '', lastName: '', fatherName: '', idNumber: '',
    birthYear: '', profession: '', address: '', phone: '', email: '',
    companyId: '', status: 'active' as 'active' | 'inactive',
  });

  useEffect(() => {
    if (employee) {
      setForm({
        firstName: employee.firstName, lastName: employee.lastName,
        fatherName: employee.fatherName, idNumber: employee.idNumber,
        birthYear: String(employee.birthYear), profession: employee.profession,
        address: employee.address, phone: employee.phone, email: employee.email || '',
        companyId: employee.companyId, status: employee.status,
      });
    } else {
      setForm({ firstName: '', lastName: '', fatherName: '', idNumber: '', birthYear: '', profession: '', address: '', phone: '', email: '', companyId: '', status: 'active' });
    }
  }, [employee, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, birthYear: Number(form.birthYear), email: form.email || undefined, ...(employee ? { id: employee.id } : {}) });
    onOpenChange(false);
  };

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{employee ? 'עריכת עובד' : 'הוספת עובד חדש'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lastName">שם משפחה *</Label>
              <Input id="lastName" value={form.lastName} onChange={e => update('lastName', e.target.value)} required placeholder="שם משפחה" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstName">שם פרטי *</Label>
              <Input id="firstName" value={form.firstName} onChange={e => update('firstName', e.target.value)} required placeholder="שם פרטי" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fatherName">שם האב *</Label>
              <Input id="fatherName" value={form.fatherName} onChange={e => update('fatherName', e.target.value)} required placeholder="שם האב" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="idNumber">תעודת זהות *</Label>
              <Input id="idNumber" value={form.idNumber} onChange={e => update('idNumber', e.target.value)} required placeholder="מספר ת.ז" dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthYear">שנת לידה *</Label>
              <Input id="birthYear" type="number" value={form.birthYear} onChange={e => update('birthYear', e.target.value)} required placeholder="1990" dir="ltr" min="1940" max="2010" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profession">מקצוע *</Label>
              <Input id="profession" value={form.profession} onChange={e => update('profession', e.target.value)} required placeholder="תפקיד / מקצוע" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">טלפון *</Label>
              <Input id="phone" type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} required placeholder="050-0000000" dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">אימייל</Label>
              <Input id="email" type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="email@example.com" dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">סטטוס</Label>
              <Select value={form.status} onValueChange={(v) => update('status', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">פעיל</SelectItem>
                  <SelectItem value="inactive">לא פעיל</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">כתובת</Label>
            <Input id="address" value={form.address} onChange={e => update('address', e.target.value)} placeholder="כתובת העובד" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyId">חברה משויכת *</Label>
            <Select value={form.companyId} onValueChange={(v) => update('companyId', v)} required>
              <SelectTrigger><SelectValue placeholder="בחר חברה..." /></SelectTrigger>
              <SelectContent>
                {companies.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3 justify-start pt-2">
            <Button type="submit">{employee ? 'שמור שינויים' : 'הוסף עובד'}</Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>ביטול</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
