import { useState } from "react";
import { Users, Plus, Search, Phone, LayoutGrid, List, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Employee, getCompanyName } from "@/data/mockData";
import { useData } from "@/context/DataContext";
import { EmployeeDialog } from "@/components/EmployeeDialog";
import { EmployeeCard } from "@/components/EmployeeCard";

const Employees = () => {
  const { employees, companies, addEmployee, updateEmployee } = useData();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [cardOpen, setCardOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const getCompanyNameLocal = (companyId: string) => {
    return companies.find(c => c.id === companyId)?.name || 'לא ידוע';
  };

  const filtered = employees.filter(e =>
    `${e.firstName} ${e.lastName}`.includes(search) ||
    e.idNumber.includes(search) ||
    getCompanyNameLocal(e.companyId).includes(search) ||
    e.profession.includes(search)
  );

  const handleSave = (data: Omit<Employee, 'id'> & { id?: string }) => {
    if (data.id) {
      updateEmployee(data as Employee);
    } else {
      const { id, ...rest } = data as any;
      addEmployee(rest);
    }
  };

  const handleEdit = (employee: Employee) => { setEditingEmployee(employee); setDialogOpen(true); };
  const handleAdd = () => { setEditingEmployee(null); setDialogOpen(true); };
  const handleView = (employee: Employee) => { setViewingEmployee(employee); setCardOpen(true); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">עובדים</h1>
          <p className="text-muted-foreground text-sm">ניהול עובדים והסמכות • {employees.length} עובדים</p>
        </div>
        <Button className="gap-2 self-start" onClick={handleAdd}>
          <Plus className="h-4 w-4" />
          עובד חדש
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative max-w-md flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="חיפוש לפי שם, ת.ז, חברה או מקצוע..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-9" />
        </div>
        <div className="flex border border-border rounded-md">
          <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="icon" className="h-9 w-9 rounded-l-none" onClick={() => setViewMode('grid')}>
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="icon" className="h-9 w-9 rounded-r-none" onClick={() => setViewMode('list')}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((emp) => (
            <Card key={emp.id} className="cursor-pointer hover:shadow-md transition-shadow border-border/60 hover:border-primary/30" onClick={() => handleView(emp)}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm leading-tight">{emp.firstName} {emp.lastName}</h3>
                      <p className="text-xs text-muted-foreground">{emp.profession}</p>
                    </div>
                  </div>
                  <Badge variant={emp.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                    {emp.status === 'active' ? 'פעיל' : 'לא פעיל'}
                  </Badge>
                </div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5 shrink-0" />
                    <span className="text-xs">{getCompanyNameLocal(emp.companyId)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span dir="ltr" className="text-xs">{emp.phone}</span>
                  </div>
                </div>
                <div className="flex justify-end mt-3">
                  <Button variant="ghost" size="sm" className="text-xs h-7" onClick={(e) => { e.stopPropagation(); handleEdit(emp); }}>עריכה</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">שם</TableHead>
                <TableHead className="text-right hidden md:table-cell">ת.ז</TableHead>
                <TableHead className="text-right">חברה</TableHead>
                <TableHead className="text-right hidden sm:table-cell">מקצוע</TableHead>
                <TableHead className="text-right hidden lg:table-cell">טלפון</TableHead>
                <TableHead className="text-right">סטטוס</TableHead>
                <TableHead className="text-right">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((emp) => (
                <TableRow key={emp.id} className="cursor-pointer" onClick={() => handleView(emp)}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                      {emp.firstName} {emp.lastName}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell" dir="ltr">{emp.idNumber}</TableCell>
                  <TableCell>{getCompanyNameLocal(emp.companyId)}</TableCell>
                  <TableCell className="hidden sm:table-cell">{emp.profession}</TableCell>
                  <TableCell className="hidden lg:table-cell" dir="ltr">{emp.phone}</TableCell>
                  <TableCell>
                    <Badge variant={emp.status === 'active' ? 'default' : 'secondary'}>
                      {emp.status === 'active' ? 'פעיל' : 'לא פעיל'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-xs h-7" onClick={(e) => { e.stopPropagation(); handleEdit(emp); }}>עריכה</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">לא נמצאו עובדים</p>
        </div>
      )}

      <EmployeeDialog open={dialogOpen} onOpenChange={setDialogOpen} employee={editingEmployee} onSave={handleSave} />
      <EmployeeCard employee={viewingEmployee} open={cardOpen} onOpenChange={setCardOpen} onEdit={handleEdit} />
    </div>
  );
};

export default Employees;
