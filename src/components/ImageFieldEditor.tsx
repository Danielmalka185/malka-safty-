import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Trash2, Plus, Upload, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
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
    { key: 'employeeSignature', label: 'חתימת עובד' },
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

const defaultSampleData: Record<string, string> = {
  employeeName: 'ישראל ישראלי',
  lastName: 'ישראלי',
  firstName: 'ישראל',
  idNumber: '300000000',
  companyName: 'חברה לדוגמה',
  trainingType: 'הדרכת בטיחות',
  categoryName: 'בטיחות כללית',
  date: '1.1.2025',
  expiryDate: '1.1.2026',
  instructor: 'מדריך לדוגמה',
  instructorPhone: '050-0000000',
  instructorId: '200000000',
  birthYear: '1990',
  profession: 'עובד כללי',
  fatherName: 'אברהם',
  phone: '050-1234567',
  address: 'תל אביב',
  companyId: '51-1234567',
  companyPhone: '03-1234567',
  companyAddress: 'רחוב ראשי 1',
  trainingKind: 'חדש',
  certificateNumber: '1001',
  instructorAddress: 'חיפה',
  instructorExperience: '15',
  instructorCertNumber: 'M-5678',
  instructorCertExpiry: '1.1.2027',
  instructorSignature: '',
  employeeSignature: '',
};

function getBaseKey(key: string): string {
  return key.replace(/_\d+$/, '');
}

function getSampleValue(field: ImageField): string {
  if (field.sampleValue) return field.sampleValue;
  const baseKey = getBaseKey(field.key);
  return defaultSampleData[baseKey] || field.label;
}

interface ImageFieldEditorProps {
  backgroundImage: string;
  fields: ImageField[];
  onFieldsChange: (fields: ImageField[]) => void;
  onImageUpload: (dataUrl: string) => void;
}

const NUDGE_STEP = 0.5;

const ImageFieldEditor = ({ backgroundImage, fields, onFieldsChange, onImageUpload }: ImageFieldEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [dragging, setDragging] = useState<{ idx: number; startX: number; startY: number; fieldX: number; fieldY: number } | null>(null);
  const [addingField, setAddingField] = useState<string>("");
  const [imgNaturalRatio, setImgNaturalRatio] = useState<number | null>(null);
  const [selectedFieldIdx, setSelectedFieldIdx] = useState<number | null>(null);

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

    const existingCount = fields.filter(f => getBaseKey(f.key) === baseKey).length;
    const fieldKey = existingCount > 0 ? `${baseKey}_${existingCount + 1}` : baseKey;
    const label = existingCount > 0 ? `${fieldInfo.label} (${existingCount + 1})` : fieldInfo.label;

    const newFields = [...fields, { key: fieldKey, label, xPercent, yPercent, fontSize: 14, color: '#000000' }];
    onFieldsChange(newFields);
    setSelectedFieldIdx(newFields.length - 1);
    setAddingField("");
  };

  const handleMouseDown = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    setSelectedFieldIdx(idx);
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

  const removeField = (idx: number) => {
    onFieldsChange(fields.filter((_, i) => i !== idx));
    if (selectedFieldIdx === idx) setSelectedFieldIdx(null);
    else if (selectedFieldIdx !== null && selectedFieldIdx > idx) setSelectedFieldIdx(selectedFieldIdx - 1);
  };

  const updateFieldProp = (idx: number, prop: keyof ImageField, value: number | string) => {
    const updated = [...fields];
    updated[idx] = { ...updated[idx], [prop]: value };
    onFieldsChange(updated);
  };

  const handleNudge = (idx: number, direction: 'up' | 'down' | 'left' | 'right') => {
    const updated = [...fields];
    const field = { ...updated[idx] };
    switch (direction) {
      case 'up': field.yPercent = Math.max(0, field.yPercent - NUDGE_STEP); break;
      case 'down': field.yPercent = Math.min(100, field.yPercent + NUDGE_STEP); break;
      case 'left': field.xPercent = Math.max(0, field.xPercent - NUDGE_STEP); break;
      case 'right': field.xPercent = Math.min(100, field.xPercent + NUDGE_STEP); break;
    }
    updated[idx] = field;
    onFieldsChange(updated);
  };

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
      {/* Field selector + upload */}
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

      {/* WYSIWYG image canvas — fields rendered as realistic text */}
      <TooltipProvider delayDuration={200}>
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
          {fields.map((field, idx) => {
            const sampleText = getSampleValue(field);
            const isSelected = selectedFieldIdx === idx;
            const baseKey = getBaseKey(field.key);
            const isSignature = baseKey === 'instructorSignature' || baseKey === 'employeeSignature';

            return (
              <Tooltip key={idx}>
                <TooltipTrigger asChild>
                  <div
                    className={`absolute cursor-move transition-all ${
                      isSelected
                        ? 'outline outline-2 outline-primary outline-offset-1 bg-primary/10'
                        : 'hover:bg-primary/5'
                    }`}
                    style={{
                      right: `${100 - field.xPercent}%`,
                      top: `${field.yPercent}%`,
                      fontSize: `${field.fontSize * 0.7}px`,
                      color: field.color,
                      fontWeight: 600,
                      fontFamily: "'Rubik', sans-serif",
                      whiteSpace: 'pre-line',
                      borderBottom: isSelected ? 'none' : '1px dashed currentColor',
                      padding: '0 2px',
                    }}
                    onMouseDown={(e) => handleMouseDown(e, idx)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFieldIdx(idx);
                    }}
                  >
                    {isSignature ? (
                      <span className="text-muted-foreground italic" style={{ fontSize: `${field.fontSize * 0.5}px` }}>
                        [חתימה]
                      </span>
                    ) : sampleText}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {field.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>

      {/* Field list with nudge + X/Y + sample value */}
      {fields.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">שדות ממוקמים:</Label>
          {fields.map((field, idx) => (
            <div
              key={idx}
              className={`rounded p-2 text-sm space-y-2 border transition-colors ${
                selectedFieldIdx === idx ? 'border-primary bg-primary/5' : 'border-transparent bg-muted/50'
              }`}
              onClick={() => setSelectedFieldIdx(idx)}
            >
              {/* Row 1: label + size + color + delete */}
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="shrink-0">{field.label}</Badge>
                <div className="flex items-center gap-1 mr-auto">
                  <Label className="text-xs shrink-0">גודל:</Label>
                  <Input
                    type="number"
                    value={field.fontSize}
                    onChange={(e) => updateFieldProp(idx, 'fontSize', Number(e.target.value))}
                    className="w-14 h-7 text-xs"
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
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={(e) => { e.stopPropagation(); removeField(idx); }}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>

              {/* Row 2: X/Y numeric + nudge arrows */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <Label className="text-xs">X:</Label>
                  <Input
                    type="number"
                    value={Math.round(field.xPercent * 10) / 10}
                    onChange={(e) => updateFieldProp(idx, 'xPercent', Number(e.target.value))}
                    className="w-16 h-7 text-xs"
                    step={0.5}
                    min={0}
                    max={100}
                  />
                </div>
                <div className="flex items-center gap-1">
                  <Label className="text-xs">Y:</Label>
                  <Input
                    type="number"
                    value={Math.round(field.yPercent * 10) / 10}
                    onChange={(e) => updateFieldProp(idx, 'yPercent', Number(e.target.value))}
                    className="w-16 h-7 text-xs"
                    step={0.5}
                    min={0}
                    max={100}
                  />
                </div>
                <div className="flex items-center gap-0.5">
                  <Button variant="outline" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); handleNudge(idx, 'right'); }}>
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); handleNudge(idx, 'left'); }}>
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); handleNudge(idx, 'up'); }}>
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); handleNudge(idx, 'down'); }}>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Row 3: sample value input */}
              <div className="flex items-center gap-1">
                <Label className="text-xs shrink-0">ערך לדוגמה:</Label>
                <Input
                  value={field.sampleValue || ''}
                  onChange={(e) => updateFieldProp(idx, 'sampleValue', e.target.value)}
                  placeholder={defaultSampleData[getBaseKey(field.key)] || field.label}
                  className="h-7 text-xs flex-1"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageFieldEditor;
