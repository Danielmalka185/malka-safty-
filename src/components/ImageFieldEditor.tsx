import { useState, useRef, useCallback, useEffect } from "react";
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
    { key: 'instructorAddress', label: 'כתובת מדריך' },
    { key: 'instructorExperience', label: 'שנות ותק מדריך' },
    { key: 'instructorCertNumber', label: 'מספר תעודת מדריך' },
    { key: 'instructorCertExpiry', label: 'תוקף תעודת מדריך' },
    { key: 'instructorSignature', label: 'חתימת מדריך' },
  ]},
  { group: 'הדרכה', fields: [
    { key: 'trainingType', label: 'נושאי הדרכה' },
    { key: 'categoryName', label: 'קטגוריה' },
    { key: 'trainingKind', label: 'חדש/ריענון' },
    { key: 'date', label: 'תאריך' },
    { key: 'expiryDate', label: 'תאריך תפוגה' },
  ]},
  { group: 'תעודה', fields: [
    { key: 'certificateNumber', label: 'מספר תעודה' },
  ]},
];

const allFields = availableFields.flatMap(g => g.fields);

// Get base key without numeric suffix (e.g., "date_2" → "date")
function getBaseKey(key: string): string {
  return key.replace(/_\d+$/, '');
}

interface ImageFieldEditorProps {
  backgroundImage: string;
  fields: ImageField[];
  onFieldsChange: (fields: ImageField[]) => void;
  onImageUpload: (dataUrl: string) => void;
}

const ImageFieldEditor = ({ backgroundImage, fields, onFieldsChange, onImageUpload }: ImageFieldEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [dragging, setDragging] = useState<{ idx: number; startX: number; startY: number; fieldX: number; fieldY: number } | null>(null);
  const [addingField, setAddingField] = useState<string>("");
  const [imgNaturalRatio, setImgNaturalRatio] = useState<number | null>(null);

  const handleImageLoad = () => {
    if (imgRef.current) {
      setImgNaturalRatio(imgRef.current.naturalWidth / imgRef.current.naturalHeight);
    }
  };

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth) {
      setImgNaturalRatio(imgRef.current.naturalWidth / imgRef.current.naturalHeight);
    }
  }, [backgroundImage]);

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

    const baseKey = getBaseKey(addingField);
    const fieldInfo = allFields.find(f => f.key === baseKey);
    if (!fieldInfo) return;

    // Generate unique key with suffix if duplicate
    const existingCount = fields.filter(f => getBaseKey(f.key) === baseKey).length;
    const fieldKey = existingCount > 0 ? `${baseKey}_${existingCount + 1}` : baseKey;
    const label = existingCount > 0 ? `${fieldInfo.label} (${existingCount + 1})` : fieldInfo.label;

    onFieldsChange([...fields, { key: fieldKey, label, xPercent, yPercent, fontSize: 14, color: '#000000' }]);
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

  // No longer filter out used keys — allow duplicates

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
                {group.fields.map(f => (
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

      {/* Image with overlay fields — uses natural image aspect ratio */}
      <div
        ref={containerRef}
        className="relative border rounded-lg overflow-hidden cursor-crosshair select-none"
        style={imgNaturalRatio ? { aspectRatio: `${imgNaturalRatio}` } : undefined}
        onClick={handleContainerClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img
          ref={imgRef}
          src={backgroundImage}
          alt="תבנית"
          className="absolute inset-0 w-full h-full object-fill"
          draggable={false}
          onLoad={handleImageLoad}
        />
        {/* Grid lines for positioning help */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.15 }}>
          {[25, 50, 75].map(p => (
            <div key={`v${p}`} className="absolute top-0 bottom-0 border-l border-dashed border-primary" style={{ left: `${p}%` }} />
          ))}
          {[25, 50, 75].map(p => (
            <div key={`h${p}`} className="absolute left-0 right-0 border-t border-dashed border-primary" style={{ top: `${p}%` }} />
          ))}
        </div>
        {fields.map((field, idx) => (
          <div
            key={idx}
            className="absolute bg-primary/20 border border-primary rounded px-2 py-0.5 text-xs cursor-move hover:bg-primary/30 transition-colors"
            style={{
              right: `${100 - field.xPercent}%`,
              top: `${field.yPercent}%`,
              fontSize: field.fontSize * 0.7,
              color: field.color,
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
