import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Upload } from "lucide-react";
import type { PdfField } from "@/data/mockData";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

const availableFields = [
  { key: 'employeeName', label: 'שם העובד' },
  { key: 'idNumber', label: 'תעודת זהות' },
  { key: 'companyName', label: 'שם החברה' },
  { key: 'trainingType', label: 'סוג הדרכה' },
  { key: 'categoryName', label: 'קטגוריה' },
  { key: 'date', label: 'תאריך' },
  { key: 'expiryDate', label: 'תאריך תפוגה' },
  { key: 'instructor', label: 'מדריך' },
  { key: 'birthYear', label: 'שנת לידה' },
  { key: 'profession', label: 'מקצוע' },
  { key: 'fatherName', label: 'שם האב' },
];

interface PdfFieldEditorProps {
  pdfBase64: string;
  fields: PdfField[];
  onFieldsChange: (fields: PdfField[]) => void;
  onPdfUpload: (base64: string) => void;
}

const PdfFieldEditor = ({ pdfBase64, fields, onFieldsChange, onPdfUpload }: PdfFieldEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 });
  const [dragging, setDragging] = useState<{ idx: number; offsetX: number; offsetY: number } | null>(null);
  const [addingField, setAddingField] = useState<string>("");
  const [scale, setScale] = useState(1);

  // Render PDF to canvas
  useEffect(() => {
    if (!pdfBase64 || !canvasRef.current) return;
    const renderPdf = async () => {
      const data = atob(pdfBase64);
      const uint8 = new Uint8Array(data.length);
      for (let i = 0; i < data.length; i++) uint8[i] = data.charCodeAt(i);

      const pdf = await pdfjsLib.getDocument({ data: uint8 }).promise;
      const page = await pdf.getPage(1);
      
      const containerWidth = containerRef.current?.clientWidth || 700;
      const viewport = page.getViewport({ scale: 1 });
      const s = containerWidth / viewport.width;
      setScale(s);
      
      const scaledViewport = page.getViewport({ scale: s });
      const canvas = canvasRef.current!;
      canvas.width = scaledViewport.width;
      canvas.height = scaledViewport.height;
      setPdfDimensions({ width: viewport.width, height: viewport.height });

      const ctx = canvas.getContext('2d')!;
      await page.render({ canvasContext: ctx, viewport: scaledViewport, canvas } as any).promise;
    };
    renderPdf();
  }, [pdfBase64]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      onPdfUpload(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!addingField || dragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = pdfDimensions.height - (e.clientY - rect.top) / scale; // PDF coords: origin bottom-left
    
    const fieldInfo = availableFields.find(f => f.key === addingField);
    if (!fieldInfo) return;
    
    onFieldsChange([...fields, { key: addingField, label: fieldInfo.label, x, y, fontSize: 14 }]);
    setAddingField("");
  };

  const handleMouseDown = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    const rect = containerRef.current!.getBoundingClientRect();
    setDragging({
      idx,
      offsetX: e.clientX - rect.left - fields[idx].x * scale,
      offsetY: e.clientY - rect.top - (pdfDimensions.height - fields[idx].y) * scale,
    });
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    const rect = containerRef.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left - dragging.offsetX) / scale;
    const y = pdfDimensions.height - (e.clientY - rect.top - dragging.offsetY) / scale;
    const updated = [...fields];
    updated[dragging.idx] = { ...updated[dragging.idx], x, y };
    onFieldsChange(updated);
  }, [dragging, fields, scale, pdfDimensions.height, onFieldsChange]);

  const handleMouseUp = useCallback(() => setDragging(null), []);

  const removeField = (idx: number) => {
    onFieldsChange(fields.filter((_, i) => i !== idx));
  };

  const updateFieldSize = (idx: number, fontSize: number) => {
    const updated = [...fields];
    updated[idx] = { ...updated[idx], fontSize };
    onFieldsChange(updated);
  };

  const usedKeys = new Set(fields.map(f => f.key));
  const unusedFields = availableFields.filter(f => !usedKeys.has(f.key));

  if (!pdfBase64) {
    return (
      <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
        <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
        <p className="text-muted-foreground">העלה קובץ PDF כתבנית לתעודה</p>
        <label className="inline-block">
          <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
          <Button asChild variant="outline">
            <span>בחר קובץ PDF</span>
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
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="הוסף שדה..." />
          </SelectTrigger>
          <SelectContent>
            {unusedFields.map(f => (
              <SelectItem key={f.key} value={f.key}>{f.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {addingField && (
          <Badge variant="outline" className="animate-pulse">
            <Plus className="h-3 w-3 ml-1" />
            לחץ על ה-PDF למיקום השדה
          </Badge>
        )}
        <label className="mr-auto">
          <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
          <Button asChild variant="outline" size="sm">
            <span>החלף PDF</span>
          </Button>
        </label>
      </div>

      {/* PDF canvas with overlay fields */}
      <div
        ref={containerRef}
        className="relative border rounded-lg overflow-hidden cursor-crosshair select-none"
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas ref={canvasRef} className="block w-full" />
        {fields.map((field, idx) => (
          <div
            key={idx}
            className="absolute bg-primary/20 border border-primary rounded px-2 py-0.5 text-xs cursor-move hover:bg-primary/30 transition-colors"
            style={{
              left: field.x * scale,
              top: (pdfDimensions.height - field.y) * scale,
              fontSize: field.fontSize * scale * 0.7,
              transform: 'translateY(-50%)',
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
              <span className="text-muted-foreground text-xs">
                x:{Math.round(field.x)} y:{Math.round(field.y)}
              </span>
              <div className="flex items-center gap-1 mr-auto">
                <Label className="text-xs">גודל:</Label>
                <Input
                  type="number"
                  value={field.fontSize}
                  onChange={(e) => updateFieldSize(idx, Number(e.target.value))}
                  className="w-16 h-7 text-xs"
                  min={8}
                  max={48}
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

export default PdfFieldEditor;
