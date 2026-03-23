import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, FileText, Image } from "lucide-react";
import CertificatePreview from "@/components/CertificatePreview";
import ImageFieldEditor from "@/components/ImageFieldEditor";
import { useData } from "@/context/DataContext";
import { trainingCategories, type CertificateTemplate, type ImageField } from "@/data/mockData";
import { toast } from "sonner";

const placeholders = [
  { key: '{employeeName}', label: 'שם העובד' },
  { key: '{idNumber}', label: 'תעודת זהות' },
  { key: '{companyName}', label: 'שם החברה' },
  { key: '{trainingType}', label: 'סוג הדרכה' },
  { key: '{categoryName}', label: 'קטגוריה' },
  { key: '{date}', label: 'תאריך' },
  { key: '{expiryDate}', label: 'תאריך תפוגה' },
  { key: '{instructor}', label: 'מדריך' },
  { key: '{birthYear}', label: 'שנת לידה' },
  { key: '{fatherName}', label: 'שם האב' },
  { key: '{profession}', label: 'מקצוע' },
];

const CertificateTemplateEditor = () => {
  const { templates, addTemplate, updateTemplate } = useData();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('__default__');

  const effectiveCategoryId = selectedCategoryId === '__default__' ? '' : selectedCategoryId;
  const currentTemplate = templates.find(t => t.categoryId === effectiveCategoryId)
    || templates.find(t => t.categoryId === '')!;

  const [form, setFormState] = useState<CertificateTemplate>(currentTemplate);

  const selectCategory = (catId: string) => {
    setSelectedCategoryId(catId);
    const effCatId = catId === '__default__' ? '' : catId;
    const tmpl = templates.find(t => t.categoryId === effCatId)
      || templates.find(t => t.categoryId === '')!;
    setFormState({ ...tmpl });
  };

  const updateField = <K extends keyof CertificateTemplate>(key: K, value: CertificateTemplate[K]) => {
    setFormState(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const saveForm = { ...form, categoryId: effectiveCategoryId };
    const existing = templates.find(t => t.id === saveForm.id);
    if (existing) {
      updateTemplate(saveForm);
    } else {
      addTemplate(saveForm);
    }
    toast.success(`התבנית "${saveForm.name}" נשמרה בהצלחה`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Editor Panel */}
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">בחר קטגוריה</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select value={selectedCategoryId} onValueChange={selectCategory}>
              <SelectTrigger><SelectValue placeholder="תבנית ברירת מחדל" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__default__">תבנית ברירת מחדל</SelectItem>
                {trainingCategories.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="space-y-2">
              <Label>שם התבנית</Label>
              <Input value={form.name} onChange={e => updateField('name', e.target.value)} placeholder="לדוגמה: תבנית עבודה בגובה" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">סוג תבנית</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={form.templateType} onValueChange={(v) => updateField('templateType', v as 'html' | 'image')}>
              <TabsList className="w-full">
                <TabsTrigger value="html" className="flex-1 gap-2">
                  <FileText className="h-4 w-4" />
                  עיצוב HTML
                </TabsTrigger>
                <TabsTrigger value="image" className="flex-1 gap-2">
                  <Image className="h-4 w-4" />
                  תמונת רקע
                </TabsTrigger>
              </TabsList>

              <TabsContent value="html" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>כותרת התעודה</Label>
                  <Input value={form.title} onChange={e => updateField('title', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>לוגו (טקסט)</Label>
                  <Input value={form.logoText} onChange={e => updateField('logoText', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>חתימה</Label>
                  <Input value={form.signatureText} onChange={e => updateField('signatureText', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>טקסט גוף</Label>
                  <Textarea
                    value={form.bodyText}
                    onChange={e => updateField('bodyText', e.target.value)}
                    rows={6}
                    className="text-sm"
                  />
                  <div className="flex flex-wrap gap-1">
                    {placeholders.map(p => (
                      <Badge key={p.key} variant="outline" className="text-xs cursor-pointer hover:bg-accent"
                        onClick={() => updateField('bodyText', form.bodyText + p.key)}>
                        {p.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="image" className="mt-4">
                <ImageFieldEditor
                  backgroundImage={form.backgroundImage || ''}
                  fields={form.imageFields || []}
                  onFieldsChange={(fields: ImageField[]) => updateField('imageFields', fields)}
                  onImageUpload={(dataUrl: string) => updateField('backgroundImage', dataUrl)}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {form.templateType === 'html' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">עיצוב</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>צבע רקע</Label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={form.backgroundColor} onChange={e => updateField('backgroundColor', e.target.value)} className="w-10 h-10 rounded border cursor-pointer" />
                    <Input value={form.backgroundColor} onChange={e => updateField('backgroundColor', e.target.value)} className="flex-1" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>צבע מסגרת</Label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={form.borderColor} onChange={e => updateField('borderColor', e.target.value)} className="w-10 h-10 rounded border cursor-pointer" />
                    <Input value={form.borderColor} onChange={e => updateField('borderColor', e.target.value)} className="flex-1" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>צבע טקסט</Label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={form.textColor} onChange={e => updateField('textColor', e.target.value)} className="w-10 h-10 rounded border cursor-pointer" />
                    <Input value={form.textColor} onChange={e => updateField('textColor', e.target.value)} className="flex-1" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>צבע כותרת</Label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={form.titleColor} onChange={e => updateField('titleColor', e.target.value)} className="w-10 h-10 rounded border cursor-pointer" />
                    <Input value={form.titleColor} onChange={e => updateField('titleColor', e.target.value)} className="flex-1" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label>הצג מסגרת</Label>
                <Switch checked={form.showBorder} onCheckedChange={v => updateField('showBorder', v)} />
              </div>
              <div className="space-y-2">
                <Label>גופן</Label>
                <Select value={form.fontFamily} onValueChange={v => updateField('fontFamily', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rubik">Rubik</SelectItem>
                    <SelectItem value="Arial">Arial</SelectItem>
                    <SelectItem value="David">David</SelectItem>
                    <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        <Button onClick={handleSave} className="w-full gap-2">
          <Save className="h-4 w-4" />
          שמור תבנית
        </Button>
      </div>

      {/* Preview Panel */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">תצוגה מקדימה</CardTitle>
          </CardHeader>
          <CardContent>
            <CertificatePreview template={form} showPrintButton />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CertificateTemplateEditor;
