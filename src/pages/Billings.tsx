import { useState, useMemo } from "react";
import { useData } from "@/context/DataContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Search, DollarSign, Plus, Pencil } from "lucide-react";
import { formatDateHe } from "@/lib/utils";
import { Billing } from "@/data/mockData";
import BillingDialog from "@/components/BillingDialog";

const Billings = () => {
  const { billings, updateBilling, getCompanyName, trainings } = useData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBilling, setEditingBilling] = useState<Billing | null>(null);

  const filtered = useMemo(() => {
    return billings.filter(b => {
      const companyName = getCompanyName(b.companyId);
      const matchSearch = !search || companyName.includes(search) || b.notes.includes(search) || (b.description || '').includes(search);
      const matchStatus = statusFilter === 'all' || b.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [billings, search, statusFilter, getCompanyName]);

  const totalPending = useMemo(() => filtered.filter(b => b.status === 'pending').reduce((s, b) => s + b.amount, 0), [filtered]);
  const totalPaid = useMemo(() => filtered.filter(b => b.status === 'paid').reduce((s, b) => s + b.amount, 0), [filtered]);

  const markAsPaid = (id: string) => {
    const billing = billings.find(b => b.id === id);
    if (billing) {
      updateBilling({ ...billing, status: 'paid', paidDate: new Date().toISOString().split('T')[0] });
    }
  };

  const markAsUnpaid = (id: string) => {
    const billing = billings.find(b => b.id === id);
    if (billing) {
      updateBilling({ ...billing, status: 'pending', paidDate: undefined });
    }
  };

  const getTrainingInfo = (trainingId?: string) => {
    if (!trainingId) return null;
    return trainings.find(t => t.id === trainingId);
  };

  const openEdit = (billing: Billing) => {
    setEditingBilling(billing);
    setDialogOpen(true);
  };

  const openAdd = () => {
    setEditingBilling(null);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">חיובים</h1>
          <p className="text-muted-foreground text-sm">מעקב תשלומים לפי הדרכות וחיובים נוספים</p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          חיוב חדש
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <DollarSign className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ממתין לתשלום</p>
                <p className="text-2xl font-bold">₪{totalPending.toLocaleString('he-IL')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">שולם</p>
                <p className="text-2xl font-bold">₪{totalPaid.toLocaleString('he-IL')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="חיפוש לפי חברה או תיאור..." value={search} onChange={e => setSearch(e.target.value)} className="pr-10" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="כל הסטטוסים" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">הכל</SelectItem>
            <SelectItem value="pending">ממתין</SelectItem>
            <SelectItem value="paid">שולם</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">חברה</TableHead>
              <TableHead className="text-right">תיאור</TableHead>
              <TableHead className="text-right">תאריך</TableHead>
              <TableHead className="text-right">סכום</TableHead>
              <TableHead className="text-right">סטטוס</TableHead>
              <TableHead className="text-right">תאריך תשלום</TableHead>
              <TableHead className="text-right">הערות</TableHead>
              <TableHead className="text-right">פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  אין חיובים להצגה
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(billing => {
                const training = getTrainingInfo(billing.trainingId);
                const descText = billing.description || (training ? 'הדרכה' : '—');
                return (
                  <TableRow key={billing.id}>
                    <TableCell className="font-medium">{getCompanyName(billing.companyId)}</TableCell>
                    <TableCell>{descText}</TableCell>
                    <TableCell>{training ? formatDateHe(training.date) : (billing.dueDate ? formatDateHe(billing.dueDate) : '—')}</TableCell>
                    <TableCell>₪{billing.amount.toLocaleString('he-IL')}</TableCell>
                    <TableCell>
                      <Badge className={billing.status === 'paid'
                        ? 'bg-green-100 text-green-800 hover:bg-green-100'
                        : 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                      }>
                        {billing.status === 'paid' ? 'שולם' : 'ממתין'}
                      </Badge>
                    </TableCell>
                    <TableCell>{billing.paidDate ? formatDateHe(billing.paidDate) : '—'}</TableCell>
                    <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">{billing.notes || '—'}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => openEdit(billing)} className="gap-1">
                          <Pencil className="h-3 w-3" />
                        </Button>
                        {billing.status === 'pending' ? (
                          <Button size="sm" variant="outline" onClick={() => markAsPaid(billing.id)} className="gap-1">
                            <Check className="h-3 w-3" />
                            שולם
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => markAsUnpaid(billing.id)} className="gap-1 text-amber-600">
                            החזר לממתין
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <BillingDialog open={dialogOpen} onOpenChange={setDialogOpen} billing={editingBilling} />
    </div>
  );
};

export default Billings;
