import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Upload } from "lucide-react";
import type { ImageField } from "@/data/mockData";

const availableFields = [
  { group: 'עובד', fields: [
    { key: 'lastName', label: 'שם משפחה' },
    { key: 'firstName', label: 'שם פרטי' },
    { key: 'employeeName', label: 'שם מלא' },
    { key: 'idNumber', label: 'תעודת זהות' },
    { key: 'birthYear', label: 'שנת לידה' },
    { key: 'fatherName', label: 'שם האב' },
    { key: 'profession', label: 'מקצוע' },
    { key: 'phone', label: 'טלפון עובד' },
    { key: 'address', label: 'כתובת עובד' },
  ]},
  { group: 'חברה', fields: [
    { key: 'companyName', label: 'שם חברה' },
    { key: 'companyId', label: 'ח.פ חברה' },
    { key: 'companyPhone', label: 'טלפון חברה' },
    { key: 'companyAddress', label: 'כתובת חברה' },
  ]},
  { group: 'מדריך', fields: [
    { key: 'instructor', label: 'שם מדריך' },
    { key: 'instructorPhone', label: 'טלפון מדריך' },
    { key: 'instructorId', label: 'ת"ז מדריך' },
  ]},
  { group: 'הדרכה', fields: [
    { key: 'trainingType', label: 'נושאי הדרכה' },
    { key: 'categoryName', label: 'קטגוריה' },
    { key: 'date', label: 'תאריך' },
    { key: 'expiryDate', label: 'תאריך תפוגה' },
  ]},
];

const allFields = availableFields.flatMap(g => g.fields);

interface ImageFieldEditorProps {
  backgroundImage: string;
  fields: ImageField[];
  onFieldsChange: (fields: ImageField[]) => void;
  onImageUpload: (dataUrl: string) => void;
}

const ImageFieldEditor = ({ backgroundImage, fields, onFieldsChange, onImageUpload }: ImageFieldEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<{ idx: number; startX: number; startY: number; fieldX: number; fieldY: number } | null>(null);
  const [addingField, setAddingField] = useState<string>("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => onImageUpload(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!addingField || dragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

    const fieldInfo = allFields.find(f => f.key === addingField);
    if (!fieldInfo) return;

    onFieldsChange([...fields, { key: addingField, label: fieldInfo.label, xPercent, yPercent, fontSize: 14, color: '#000000' }]);
    setAddingField("");
  };

  const handleMouseDown = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    setDragging({ idx, startX: e.clientX, startY: e.clientY, fieldX: fields[idx].xPercent, fieldY: fields[idx].yPercent });
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dx = ((e.clientX - dragging.startX) / rect.width) * 100;
    const dy = ((e.clientY - dragging.startY) / rect.height) * 100;
    const updated = [...fields];
    updated[dragging.idx] = { ...updated[dragging.idx], xPercent: dragging.fieldX + dx, yPercent: dragging.fieldY + dy };
    onFieldsChange(updated);
  }, [dragging, fields, onFieldsChange]);

  const handleMouseUp = useCallback(() => setDragging(null), []);

  const removeField = (idx: number) => onFieldsChange(fields.filter((_, i) => i !== idx));

  const updateFieldProp = (idx: number, prop: 'fontSize' | 'color', value: number | string) => {
    const updated = [...fields];
    updated[idx] = { ...updated[idx], [prop]: value };
    onFieldsChange(updated);
  };

  const usedKeys = new Set(fields.map(f => f.key));

  if (!backgroundImage) {
    return (
      <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
        <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
        <p className="text-muted-foreground">העלה תמונת רקע לתעודה (JPG/PNG)</p>
        <p className="text-xs text-muted-foreground">עצב את התעודה בקאנבה או בכלי אחר, ייצא כתמונה והעלה כאן</p>
        <label className="inline-block">
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          <Button asChild variant="outline">
            <span>בחר תמונה</span>
          </Button>
        </label>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Field controls */}
      <div className="flex flex-wrap gap-2 items-center">
        <Select value={addingField} onValueChange={setAddingField}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="הוסף שדה..." />
          </SelectTrigger>
          <SelectContent>
            {availableFields.map(group => (
              <div key={group.group}>
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">{group.group}</div>
                {group.fields.filter(f => !usedKeys.has(f.key)).map(f => (
                  <SelectItem key={f.key} value={f.key}>{f.label}</SelectItem>
                ))}
              </div>
            ))}
          </SelectContent>
        </Select>
        {addingField && (
          <Badge variant="outline" className="animate-pulse">
            <Plus className="h-3 w-3 ml-1" />
            לחץ על התמונה למיקום השדה
          </Badge>
        )}
        <label className="mr-auto">
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          <Button asChild variant="outline" size="sm">
            <span>החלף תמונה</span>
          </Button>
        </label>
      </div>

      {/* Image with overlay fields */}
      <div
        ref={containerRef}
        className="relative border rounded-lg overflow-hidden cursor-crosshair select-none"
        onClick={handleContainerClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img src={backgroundImage} alt="תבנית" className="block w-full" draggable={false} />
        {fields.map((field, idx) => (
          <div
            key={idx}
            className="absolute bg-primary/20 border border-primary rounded px-2 py-0.5 text-xs cursor-move hover:bg-primary/30 transition-colors"
            style={{
              left: `${field.xPercent}%`,
              top: `${field.yPercent}%`,
              fontSize: field.fontSize * 0.7,
              color: field.color,
              transform: 'translate(-50%, -50%)',
            }}
            onMouseDown={(e) => handleMouseDown(e, idx)}
            onClick={(e) => e.stopPropagation()}
          >
            {field.label}
          </div>
        ))}
      </div>

      {/* Field list */}
      {fields.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">שדות ממוקמים:</Label>
          {fields.map((field, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-muted/50 rounded p-2 text-sm">
              <Badge variant="secondary">{field.label}</Badge>
              <div className="flex items-center gap-1 mr-auto">
                <Label className="text-xs">גודל:</Label>
                <Input
                  type="number"
                  value={field.fontSize}
                  onChange={(e) => updateFieldProp(idx, 'fontSize', Number(e.target.value))}
                  className="w-16 h-7 text-xs"
                  min={8}
                  max={48}
                />
                <input
                  type="color"
                  value={field.color}
                  onChange={(e) => updateFieldProp(idx, 'color', e.target.value)}
                  className="w-7 h-7 rounded border cursor-pointer"
                />
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeField(idx)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageFieldEditor;
