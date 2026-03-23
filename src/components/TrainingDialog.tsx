import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { trainingCategories, trainingTypes, calculateFinalPrice, type Training } from "@/data/mockData";
import { useData } from "@/context/DataContext";

interface TrainingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  training?: Training | null;
  onSave: (training: Omit<Training, 'id'> & { id?: string }) => void;
}

const TrainingDialog = ({ open, onOpenChange, training, onSave }: TrainingDialogProps) => {
  const { companies, employees, instructors } = useData();
  const [companyId, setCompanyId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [selectedTypeIds, setSelectedTypeIds] = useState<string[]>([]);
  const [selectedParticipantIds, setSelectedParticipantIds] = useState<string[]>([]);
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [instructor, setInstructor] = useState('');
  const [trainingKind, setTrainingKind] = useState<'new' | 'renewal'>('new');
  const [pricingType, setPricingType] = useState<'per_person' | 'global'>('per_person');
  const [basePrice, setBasePrice] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    if (training) {
      setCompanyId(training.companyId); setCategoryId(training.categoryId);
      setSelectedTypeIds(training.trainingTypeIds); setSelectedParticipantIds(training.participantIds);
      setDate(training.date); setLocation(training.location); setInstructor(training.instructor);
      setPricingType(training.pricingType); setBasePrice(training.basePrice); setDiscountPercent(training.discountPercent);
    } else {
      setCompanyId(''); setCategoryId(''); setSelectedTypeIds([]); setSelectedParticipantIds([]);
      setDate(''); setLocation(''); setInstructor('');
      setPricingType('per_person'); setBasePrice(0); setDiscountPercent(0);
    }
  }, [training, open]);

  const categorySubTopics = useMemo(() => trainingTypes.filter(t => t.categoryId === categoryId), [categoryId]);
  const companyEmployees = useMemo(() => employees.filter(e => e.companyId === companyId && e.status === 'active'), [companyId, employees]);

  const finalPrice = useMemo(() => {
    const mockTraining = { pricingType, basePrice, discountPercent, participantIds: selectedParticipantIds } as Training;
    return calculateFinalPrice(mockTraining);
  }, [pricingType, basePrice, discountPercent, selectedParticipantIds]);

  const toggleType = (id: string) => setSelectedTypeIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleParticipant = (id: string) => setSelectedParticipantIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const selectAllParticipants = () => setSelectedParticipantIds(companyEmployees.map(e => e.id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId || !categoryId || selectedTypeIds.length === 0 || selectedParticipantIds.length === 0 || !date) return;
    onSave({ id: training?.id, companyId, categoryId, trainingTypeIds: selectedTypeIds, date, location, instructor, participantIds: selectedParticipantIds, pricingType, basePrice, discountPercent });
    onOpenChange(false);
  };

  const handleCompanyChange = (val: string) => { setCompanyId(val); setSelectedParticipantIds([]); };
  const handleCategoryChange = (val: string) => { setCategoryId(val); setSelectedTypeIds([]); };
  const isValid = companyId && categoryId && selectedTypeIds.length > 0 && selectedParticipantIds.length > 0 && date;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader><DialogTitle>{training ? 'עריכת הדרכה' : 'הדרכה חדשה'}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label>חברה *</Label>
            <Select value={companyId} onValueChange={handleCompanyChange}>
              <SelectTrigger><SelectValue placeholder="בחר חברה" /></SelectTrigger>
              <SelectContent>
                {companies.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>קטגוריית הדרכה *</Label>
            <Select value={categoryId} onValueChange={handleCategoryChange}>
              <SelectTrigger><SelectValue placeholder="בחר קטגוריה" /></SelectTrigger>
              <SelectContent>
                {trainingCategories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {categoryId && categorySubTopics.length > 0 && (
            <div className="space-y-2">
              <Label>נושאים *</Label>
              <div className="border rounded-md p-3 space-y-2">
                {categorySubTopics.map(tt => (
                  <label key={tt.id} className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors">
                    <Checkbox checked={selectedTypeIds.includes(tt.id)} onCheckedChange={() => toggleType(tt.id)} />
                    <span className="flex-1 text-sm">{tt.name}</span>
                    <Badge variant="secondary" className="text-xs">{tt.validityMonths} חודשים</Badge>
                  </label>
                ))}
              </div>
            </div>
          )}
          {companyId && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>משתתפים * ({selectedParticipantIds.length}/{companyEmployees.length})</Label>
                <Button type="button" variant="ghost" size="sm" onClick={selectAllParticipants} className="text-xs h-7">בחר הכל</Button>
              </div>
              {companyEmployees.length === 0 ? (
                <p className="text-sm text-muted-foreground p-3 text-center border rounded-md">אין עובדים פעילים בחברה זו</p>
              ) : (
                <ScrollArea className="border rounded-md p-3 max-h-[160px]">
                  <div className="space-y-1">
                    {companyEmployees.map(emp => (
                      <label key={emp.id} className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors">
                        <Checkbox checked={selectedParticipantIds.includes(emp.id)} onCheckedChange={() => toggleParticipant(emp.id)} />
                        <span className="flex-1 text-sm">{emp.firstName} {emp.lastName}</span>
                        <span className="text-xs text-muted-foreground">{emp.profession}</span>
                      </label>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="t-date">תאריך *</Label>
              <Input id="t-date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="t-instructor">מדריך</Label>
              {instructors.length > 0 ? (
                <Select value={instructor} onValueChange={setInstructor}>
                  <SelectTrigger><SelectValue placeholder="בחר מדריך" /></SelectTrigger>
                  <SelectContent>
                    {instructors.map(inst => (
                      <SelectItem key={inst.id} value={inst.name}>{inst.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input id="t-instructor" value={instructor} onChange={e => setInstructor(e.target.value)} placeholder="שם המדריך" />
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="t-location">מיקום</Label>
            <Input id="t-location" value={location} onChange={e => setLocation(e.target.value)} placeholder="מיקום ההדרכה" />
          </div>
          <div className="border-t pt-4 space-y-4">
            <Label className="text-base font-semibold">תמחור</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>סוג תמחור</Label>
                <Select value={pricingType} onValueChange={(v) => setPricingType(v as 'per_person' | 'global')}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="per_person">לפי אדם</SelectItem>
                    <SelectItem value="global">מחיר כולל</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="t-price">מחיר בסיס (₪)</Label>
                <Input id="t-price" type="number" min={0} value={basePrice || ''} onChange={e => setBasePrice(Number(e.target.value))} placeholder="0" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="t-discount">הנחה (%)</Label>
                <Input id="t-discount" type="number" min={0} max={100} value={discountPercent || ''} onChange={e => setDiscountPercent(Number(e.target.value))} placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>מחיר סופי</Label>
                <div className="h-10 flex items-center px-3 rounded-md border bg-muted/50 text-sm font-semibold">
                  ₪{finalPrice.toLocaleString('he-IL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  {pricingType === 'per_person' && selectedParticipantIds.length > 0 && (
                    <span className="text-muted-foreground font-normal mr-2">({selectedParticipantIds.length} × ₪{basePrice})</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>ביטול</Button>
            <Button type="submit" disabled={!isValid}>{training ? 'שמור שינויים' : 'צור הדרכה'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingDialog;
