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
import { Save, FileText, Image, Copy, Printer } from "lucide-react";
import CertificatePreview, { downloadCertificatePdf } from "@/components/CertificatePreview";
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
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || '');
  const [selectedFieldIdx, setSelectedFieldIdx] = useState<number | null>(null);

  const currentTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];

  const [form, setFormState] = useState<CertificateTemplate>(currentTemplate);

  const selectTemplate = (tmplId: string) => {
    setSelectedTemplateId(tmplId);
    setSelectedFieldIdx(null);
    const tmpl = templates.find(t => t.id === tmplId);
    if (tmpl) setFormState({ ...tmpl });
  };

  const updateField = <K extends keyof CertificateTemplate>(key: K, value: CertificateTemplate[K]) => {
    setFormState(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const existing = templates.find(t => t.id === form.id);
    if (existing) {
      updateTemplate(form);
    } else {
      addTemplate(form);
    }
    toast.success(`התבנית "${form.name}" נשמרה בהצלחה`);
  };

  const handleSaveAsNew = () => {
    const newName = form.name.includes('(עותק)') ? form.name : `${form.name} (עותק)`;
    const newTemplate: CertificateTemplate = {
      ...form,
      id: `tmpl-${Date.now()}`,
      name: newName,
    };
    const added = addTemplate(newTemplate);
    setFormState(added);
    setSelectedTemplateId(added.id);
    toast.success(`התבנית "${added.name}" נוצרה בהצלחה`);
  };

  const templatesByCategory = trainingCategories.map(cat => ({
    category: cat,
    templates: templates.filter(t => t.categoryId === cat.id),
  }));
  const defaultTemplates = templates.filter(t => !t.categoryId);

  const isImageTemplate = form.templateType === 'image';
  const hasBackgroundImage = isImageTemplate && !!form.backgroundImage;

  // Shared template selector card
  const templateSelectorCard = (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">בחר תבנית</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Select value={selectedTemplateId} onValueChange={selectTemplate}>
          <SelectTrigger><SelectValue placeholder="בחר תבנית" /></SelectTrigger>
          <SelectContent>
            {defaultTemplates.length > 0 && (
              <>
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">ברירת מחדל</div>
                {defaultTemplates.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </>
            )}
            {templatesByCategory.map(({ category, templates: catTemplates }) => (
              catTemplates.length > 0 ? (
                <div key={category.id}>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">{category.name}</div>
                  {catTemplates.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </div>
              ) : null
            ))}
          </SelectContent>
        </Select>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>שם התבנית</Label>
            <Input value={form.name} onChange={e => updateField('name', e.target.value)} placeholder="לדוגמה: תבנית עבודה בגובה" />
          </div>
          <div className="space-y-2">
            <Label>קטגוריה</Label>
            <Select value={form.categoryId || '__default__'} onValueChange={v => updateField('categoryId', v === '__default__' ? '' : v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__default__">ברירת מחדל (כללי)</SelectItem>
                {trainingCategories.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const templateTypeCard = (
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

          {/* For image type without background, show upload inside the tab */}
          <TabsContent value="image" className="mt-4">
            {!hasBackgroundImage && (
              <ImageFieldEditor
                backgroundImage={form.backgroundImage || ''}
                fields={form.imageFields || []}
                onFieldsChange={(fields: ImageField[]) => updateField('imageFields', fields)}
                onImageUpload={(dataUrl: string) => updateField('backgroundImage', dataUrl)}
              />
            )}
            {hasBackgroundImage && (
              <p className="text-sm text-muted-foreground">העורך והתצוגה המקדימה מוצגים למטה זה לצד זה.</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );

  const saveButtons = (
    <div className="flex gap-3">
      <Button onClick={handleSave} className="flex-1 gap-2">
        <Save className="h-4 w-4" />
        שמור תבנית
      </Button>
      <Button onClick={handleSaveAsNew} variant="outline" className="gap-2">
        <Copy className="h-4 w-4" />
        שמור כתבנית חדשה
      </Button>
    </div>
  );

  // IMAGE TEMPLATE with background — side-by-side layout
  if (hasBackgroundImage) {
    return (
      <div className="space-y-6">
        {/* Top: settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {templateSelectorCard}
          {templateTypeCard}
        </div>

        {/* Middle: canvas (editor) + preview side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">מיקום שדות</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageFieldEditor
                backgroundImage={form.backgroundImage || ''}
                fields={form.imageFields || []}
                onFieldsChange={(fields: ImageField[]) => updateField('imageFields', fields)}
                onImageUpload={(dataUrl: string) => updateField('backgroundImage', dataUrl)}
                renderMode="canvas-only"
                selectedFieldIdx={selectedFieldIdx}
                onSelectedFieldChange={setSelectedFieldIdx}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">תצוגה מקדימה</CardTitle>
            </CardHeader>
            <CardContent>
              <CertificatePreview template={form} />
            </CardContent>
          </Card>
        </div>

        {/* Bottom: field controls + save */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">הגדרות שדות</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageFieldEditor
              backgroundImage={form.backgroundImage || ''}
              fields={form.imageFields || []}
              onFieldsChange={(fields: ImageField[]) => updateField('imageFields', fields)}
              onImageUpload={(dataUrl: string) => updateField('backgroundImage', dataUrl)}
              renderMode="controls-only"
              selectedFieldIdx={selectedFieldIdx}
              onSelectedFieldChange={setSelectedFieldIdx}
            />
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          {saveButtons}
          <Button onClick={() => downloadCertificatePdf(form, {})} variant="outline" className="gap-2">
            <Printer className="h-4 w-4" />
            הדפס / הורד PDF
          </Button>
        </div>
      </div>
    );
  }

  // HTML or image without background — original two-column layout
  return (
    <div className={isImageTemplate ? "space-y-6" : "grid grid-cols-1 lg:grid-cols-2 gap-6"}>
      <div className="space-y-6">
        {templateSelectorCard}
        {templateTypeCard}

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

        {saveButtons}
      </div>

      {!isImageTemplate && (
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
      )}
    </div>
  );
};

export default CertificateTemplateEditor;
