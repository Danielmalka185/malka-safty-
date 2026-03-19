import { useState } from "react";
import { Building2, Plus, Search, Phone, Mail, Users, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { companies as companiesData, employees, Company } from "@/data/mockData";
import { CompanyDialog } from "@/components/CompanyDialog";
import { CompanyCard } from "@/components/CompanyCard";

const Companies = () => {
  const [search, setSearch] = useState("");
  const [companies, setCompanies] = useState<Company[]>(companiesData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [viewingCompany, setViewingCompany] = useState<Company | null>(null);
  const [cardOpen, setCardOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = companies.filter(c =>
    c.name.includes(search) || c.contactPerson.includes(search) || c.registrationNumber.includes(search)
  );

  const handleSave = (data: Omit<Company, 'id'> & { id?: string }) => {
    if (data.id) {
      setCompanies(prev => prev.map(c => c.id === data.id ? { ...c, ...data } as Company : c));
    } else {
      const newCompany: Company = {
        ...data,
        id: String(Date.now()),
      } as Company;
      setCompanies(prev => [...prev, newCompany]);
    }
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingCompany(null);
    setDialogOpen(true);
  };

  const handleView = (company: Company) => {
    setViewingCompany(company);
    setCardOpen(true);
  };

  const getEmployeeCount = (companyId: string) => employees.filter(e => e.companyId === companyId).length;
  const getActiveEmployeeCount = (companyId: string) => employees.filter(e => e.companyId === companyId && e.status === 'active').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">חברות</h1>
          <p className="text-muted-foreground text-sm">ניהול לקוחות עסקיים • {companies.length} חברות</p>
        </div>
        <Button className="gap-2 self-start" onClick={handleAdd}>
          <Plus className="h-4 w-4" />
          חברה חדשה
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative max-w-md flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="חיפוש לפי שם, ח.פ או איש קשר..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-9"
          />
        </div>
        <div className="flex border border-border rounded-md">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="icon"
            className="h-9 w-9 rounded-l-none"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="icon"
            className="h-9 w-9 rounded-r-none"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((company) => (
            <Card
              key={company.id}
              className="cursor-pointer hover:shadow-md transition-shadow border-border/60 hover:border-primary/30"
              onClick={() => handleView(company)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm leading-tight">{company.name}</h3>
                      <p className="text-xs text-muted-foreground" dir="ltr">{company.registrationNumber}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs gap-1">
                    <Users className="h-3 w-3" />
                    {getActiveEmployeeCount(company.id)}/{getEmployeeCount(company.id)}
                  </Badge>
                </div>

                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="font-medium text-foreground">{company.contactPerson}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span dir="ltr" className="text-xs">{company.phone}</span>
                  </div>
                  {company.officePhone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      <span dir="ltr" className="text-xs">{company.officePhone}</span>
                      <span className="text-xs">(משרד)</span>
                    </div>
                  )}
                  {company.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      <span dir="ltr" className="text-xs truncate">{company.email}</span>
                    </div>
                  )}
                </div>

                {company.notes && (
                  <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border/50 line-clamp-2">
                    {company.notes}
                  </p>
                )}

                <div className="flex justify-end mt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7"
                    onClick={(e) => { e.stopPropagation(); handleEdit(company); }}
                  >
                    עריכה
                  </Button>
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
                <TableHead className="text-right">שם חברה</TableHead>
                <TableHead className="text-right">ח.פ</TableHead>
                <TableHead className="text-right">איש קשר</TableHead>
                <TableHead className="text-right">נייד</TableHead>
                <TableHead className="text-right">טלפון משרד</TableHead>
                <TableHead className="text-right">אימייל</TableHead>
                <TableHead className="text-right">עובדים</TableHead>
                <TableHead className="text-right">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((company) => (
                <TableRow
                  key={company.id}
                  className="cursor-pointer"
                  onClick={() => handleView(company)}
                >
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell dir="ltr" className="text-right">{company.registrationNumber}</TableCell>
                  <TableCell>{company.contactPerson}</TableCell>
                  <TableCell dir="ltr" className="text-right">{company.phone}</TableCell>
                  <TableCell dir="ltr" className="text-right">{company.officePhone || '—'}</TableCell>
                  <TableCell dir="ltr" className="text-right">{company.email || '—'}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs gap-1">
                      <Users className="h-3 w-3" />
                      {getActiveEmployeeCount(company.id)}/{getEmployeeCount(company.id)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7"
                      onClick={(e) => { e.stopPropagation(); handleEdit(company); }}
                    >
                      עריכה
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">לא נמצאו חברות</p>
        </div>
      )}

      <CompanyDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        company={editingCompany}
        onSave={handleSave}
      />

      <CompanyCard
        company={viewingCompany}
        open={cardOpen}
        onOpenChange={setCardOpen}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default Companies;
