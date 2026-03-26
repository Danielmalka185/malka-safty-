import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData } from "@/context/DataContext";
import { Billing } from "@/data/mockData";

interface BillingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  billing?: Billing | null;
}

const BillingDialog = ({ open, onOpenChange, billing }: BillingDialogProps) => {
  const { companies, addBilling, updateBilling } = useData();
  const [companyId, setCompanyId] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<'pending' | 'paid'>('pending');
  const [dueDate, setDueDate] = useState('');
  const [paidDate, setPaidDate] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (billing) {
      setCompanyId(billing.companyId);
      setAmount(String(billing.amount));
      setStatus(billing.status);
      setDueDate(billing.dueDate);
      setPaidDate(billing.paidDate || '');
      setDescription(billing.description || '');
      setNotes(billing.notes);
    } else {
      setCompanyId('');
      setAmount('');
      setStatus('pending');
      setDueDate(new Date().toISOString().split('T')[0]);
      setPaidDate('');
      setDescription('');
      setNotes('');
    }
  }, [billing, open]);

  const handleSave = () => {
    if (!companyId || !amount) return;
    const data = {
      companyId,
      amount: Number(amount),
      status,
      dueDate,
      paidDate: status === 'paid' ? (paidDate || new Date().toISOString().split('T')[0]) : undefined,
      description,
      notes,
      trainingId: billing?.trainingId,
    };

    if (billing) {
      updateBilling({ ...data, id: billing.id });
    } else {
      addBilling(data);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>{billing ? 'עריכת חיוב' : 'חיוב חדש'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>חברה *</Label>
            <Select value={companyId} onValueChange={setCompanyId}>
              <SelectTrigger><SelectValue placeholder="בחר חברה" /></SelectTrigger>
              <SelectContent>
                {companies.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>תיאור</Label>
            <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="למשל: ציוד בטיחות נוסף" />
          </div>
          <div>
            <Label>סכום (₪) *</Label>
            <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
          <div>
            <Label>סטטוס</Label>
            <Select value={status} onValueChange={(v: 'pending' | 'paid') => setStatus(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">ממתין</SelectItem>
                <SelectItem value="paid">שולם</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>תאריך יעד לתשלום</Label>
            <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
          </div>
          {status === 'paid' && (
            <div>
              <Label>תאריך תשלום</Label>
              <Input type="date" value={paidDate} onChange={e => setPaidDate(e.target.value)} />
            </div>
          )}
          <div>
            <Label>הערות</Label>
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>ביטול</Button>
            <Button onClick={handleSave} disabled={!companyId || !amount}>שמור</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BillingDialog;
