import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Company } from "@/data/mockData";

interface CompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company?: Company | null;
  onSave: (company: Omit<Company, 'id'> & { id?: string }) => void;
}

export function CompanyDialog({ open, onOpenChange, company, onSave }: CompanyDialogProps) {
  const [form, setForm] = useState({
    name: '',
    registrationNumber: '',
    contactPerson: '',
    phone: '',
    officePhone: '',
    email: '',
    address: '',
    mailingAddress: '',
    website: '',
    notes: '',
  });

  useEffect(() => {
    if (company) {
      setForm({
        name: company.name,
        registrationNumber: company.registrationNumber,
        contactPerson: company.contactPerson,
        phone: company.phone,
        officePhone: company.officePhone,
        email: company.email,
        address: company.address,
        mailingAddress: company.mailingAddress,
        website: company.website,
        notes: company.notes,
      });
    } else {
      setForm({ name: '', registrationNumber: '', contactPerson: '', phone: '', officePhone: '', email: '', address: '', mailingAddress: '', website: '', notes: '' });
    }
  }, [company, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, ...(company ? { id: company.id } : {}) });
    onOpenChange(false);
  };

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{company ? 'עריכת חברה' : 'הוספת חברה חדשה'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">שם חברה *</Label>
              <Input id="name" value={form.name} onChange={e => update('name', e.target.value)} required placeholder="שם החברה" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registrationNumber">ח.פ / מזהה *</Label>
              <Input id="registrationNumber" value={form.registrationNumber} onChange={e => update('registrationNumber', e.target.value)} required placeholder="מספר רישום" dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPerson">איש קשר *</Label>
              <Input id="contactPerson" value={form.contactPerson} onChange={e => update('contactPerson', e.target.value)} required placeholder="שם איש הקשר" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">טלפון נייד *</Label>
              <Input id="phone" type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} required placeholder="050-0000000" dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="officePhone">טלפון משרד</Label>
              <Input id="officePhone" type="tel" value={form.officePhone} onChange={e => update('officePhone', e.target.value)} placeholder="03-0000000" dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">דואר אלקטרוני</Label>
              <Input id="email" type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="email@example.com" dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">אתר אינטרנט</Label>
              <Input id="website" value={form.website} onChange={e => update('website', e.target.value)} placeholder="www.example.co.il" dir="ltr" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">כתובת</Label>
            <Input id="address" value={form.address} onChange={e => update('address', e.target.value)} placeholder="כתובת החברה" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mailingAddress">כתובת למשלוח דואר</Label>
            <Input id="mailingAddress" value={form.mailingAddress} onChange={e => update('mailingAddress', e.target.value)} placeholder="כתובת למשלוח מכתבים (אם שונה)" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">הערות / תקציר על החברה</Label>
            <Textarea id="notes" value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="מידע נוסף על החברה, תחום פעילות, הערות מיוחדות..." rows={3} />
          </div>
          <div className="flex gap-3 justify-start pt-2">
            <Button type="submit">{company ? 'שמור שינויים' : 'הוסף חברה'}</Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>ביטול</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
