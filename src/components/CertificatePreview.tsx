import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import type { CertificateTemplate } from "@/data/mockData";
import { formatDateHe } from "@/lib/utils";

interface CertificatePreviewProps {
  template: CertificateTemplate;
  data?: Record<string, string>;
  showPrintButton?: boolean;
}

const defaultData: Record<string, string> = {
  employeeName: 'ישראל ישראלי',
  lastName: 'ישראלי',
  firstName: 'ישראל',
  idNumber: '300000000',
  companyName: 'חברה לדוגמה',
  trainingType: 'הדרכת בטיחות',
  categoryName: 'בטיחות כללית',
  date: '2025-01-01',
  expiryDate: '2026-01-01',
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
};

function replacePlaceholders(text: string, data: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (_, key) => data[key] || `{${key}}`);
}

function resolveFieldValue(key: string, data: Record<string, string>): string {
  if (data[key]) return data[key];
  const baseKey = key.replace(/_\d+$/, '');
  return data[baseKey] || '';
}

// Shared field style — NO translate, anchor from right+top for RTL consistency
function getFieldStyle(field: { xPercent: number; yPercent: number; fontSize: number; color: string }, scale = 1) {
  return {
    position: 'absolute' as const,
    right: `${100 - field.xPercent}%`,
    top: `${field.yPercent}%`,
    fontSize: `${field.fontSize * scale}px`,
    color: field.color,
    whiteSpace: 'pre-line' as const,
    fontWeight: 600,
    fontFamily: "'Rubik', sans-serif",
  };
}

export async function downloadCertificatePdf(
  template: CertificateTemplate,
  data: Record<string, string>
) {
  const mergedData = { ...defaultData, ...data };
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  if (template.templateType === 'image' && template.backgroundImage) {
    const bgUrl = template.backgroundImage;

    const fieldsHtml = (template.imageFields || []).map(field => {
      const value = resolveFieldValue(field.key, mergedData);
      const isTrainingType = field.key === 'trainingType' || field.key.replace(/_\d+$/, '') === 'trainingType';
      
      if (isTrainingType && value.includes('\n')) {
        const topics = value.split('\n').filter(Boolean);
        const cols = topics.length <= 3 ? topics.length : topics.length <= 6 ? 3 : 3;
        const badges = topics.map(t => 
          `<span style="background:#e8e8e8;border-radius:4px;padding:2px 8px;font-size:${field.fontSize * 0.85}px;white-space:nowrap;">${t}</span>`
        ).join('');
        return `<div style="position:absolute;right:${100 - field.xPercent}%;top:${field.yPercent}%;display:flex;flex-wrap:wrap;gap:4px;justify-content:center;max-width:40%;font-family:'Rubik',sans-serif;">${badges}</div>`;
      }
      
      return `<div style="position:absolute;right:${100 - field.xPercent}%;top:${field.yPercent}%;font-size:${field.fontSize}px;color:${field.color};white-space:pre-line;font-weight:600;font-family:'Rubik',sans-serif;">${value}</div>`;
    }).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="utf-8" />
        <title>תעודה</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Rubik', sans-serif; display:flex; align-items:center; justify-content:center; min-height:100vh; }
          @page { size: A4 landscape; margin: 0; }
          @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
          .cert { width: 100vw; position: relative; }
          .cert img { width: 100%; height: auto; display: block; }
        </style>
      </head>
      <body>
        <div class="cert">
          <img src="${bgUrl}" onload="setTimeout(function(){window.print();window.close();},300);" />
          ${fieldsHtml}
        </div>
      </body>
      </html>
    `);
  } else {
    const bodyLines = replacePlaceholders(template.bodyText, mergedData).split('\n');
    const bodyHtml = bodyLines.map(line =>
      `<p style="font-weight: ${line.includes(mergedData.employeeName) ? '700' : '400'}">${line}</p>`
    ).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="utf-8" />
        <title>${template.title}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: '${template.fontFamily}', sans-serif; }
          @page { size: A4 landscape; margin: 0; }
          @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
          .cert {
            width: 100vw; height: 100vh;
            background-color: ${template.backgroundColor};
            ${template.showBorder ? `border: 4px solid ${template.borderColor};` : ''}
            padding: 40px 50px;
            color: ${template.textColor};
            display: flex; flex-direction: column; align-items: center; justify-content: space-between;
            text-align: center; position: relative;
          }
          .logo { font-size: 14px; font-weight: 600; color: ${template.borderColor}; letter-spacing: 2px; }
          h1 { font-size: 32px; font-weight: 700; color: ${template.titleColor}; margin-top: 16px; }
          .body { font-size: 16px; line-height: 2; margin-top: 16px; flex: 1; display: flex; flex-direction: column; justify-content: center; }
          .sig { margin-top: 24px; border-top: 1px solid ${template.textColor}40; padding-top: 8px; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="cert">
          <div class="logo">${template.logoText}</div>
          <h1>${replacePlaceholders(template.title, mergedData)}</h1>
          <div class="body">${bodyHtml}</div>
          <div class="sig">${template.signatureText}</div>
        </div>
      </body>
      </html>
    `);
  }

  printWindow.document.close();
  printWindow.focus();
  if (!(template.templateType === 'image' && template.backgroundImage)) {
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
  }
}

const ImagePreview = ({ template, data }: { template: CertificateTemplate; data: Record<string, string> }) => {
  const mergedData = { ...defaultData, ...data };
  const bgUrl = template.backgroundImage || '';
  const imgRef = useRef<HTMLImageElement>(null);
  const [ratio, setRatio] = useState<number | null>(null);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth) {
      setRatio(imgRef.current.naturalWidth / imgRef.current.naturalHeight);
    }
  }, [bgUrl]);

  const handleLoad = () => {
    if (imgRef.current) {
      setRatio(imgRef.current.naturalWidth / imgRef.current.naturalHeight);
    }
  };

  return (
    <div className="relative w-full" style={ratio ? { aspectRatio: `${ratio}` } : { aspectRatio: '1.414 / 1' }}>
      <img
        ref={imgRef}
        src={bgUrl}
        alt="תבנית תעודה"
        className="absolute inset-0 w-full h-full object-fill rounded-lg"
        onLoad={handleLoad}
      />
      {(template.imageFields || []).map((field, i) => {
        const value = resolveFieldValue(field.key, mergedData);
        const isTrainingType = field.key === 'trainingType' || field.key.replace(/_\d+$/, '') === 'trainingType';
        
        if (isTrainingType && value.includes('\n')) {
          const topics = value.split('\n').filter(Boolean);
          return (
            <div
              key={i}
              className="absolute flex flex-wrap gap-1 justify-center"
              style={{
                right: `${100 - field.xPercent}%`,
                top: `${field.yPercent}%`,
                maxWidth: '40%',
              }}
            >
              {topics.map((topic, ti) => (
                <span
                  key={ti}
                  className="bg-muted rounded px-1.5 py-0.5 font-semibold"
                  style={{ fontSize: `${field.fontSize * 0.55}px`, color: field.color, whiteSpace: 'nowrap' }}
                >
                  {topic}
                </span>
              ))}
            </div>
          );
        }
        
        return (
          <div
            key={i}
            className="absolute font-semibold whitespace-pre-line"
            style={getFieldStyle(field, 0.7)}
          >
            {value || field.label}
          </div>
        );
      })}
    </div>
  );
};

const HtmlPreview = ({ template, data }: CertificatePreviewProps) => {
  const printRef = useRef<HTMLDivElement>(null);
  const mergedData = { ...defaultData, ...data };
  const bodyLines = replacePlaceholders(template.bodyText, mergedData).split('\n');

  return (
    <div ref={printRef}>
      <div
        style={{
          width: '100%',
          maxWidth: 800,
          aspectRatio: '1.414 / 1',
          margin: '0 auto',
          backgroundColor: template.backgroundColor,
          border: template.showBorder ? `4px solid ${template.borderColor}` : 'none',
          padding: '40px 50px',
          fontFamily: `'${template.fontFamily}', sans-serif`,
          color: template.textColor,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {template.showBorder && (
          <div style={{ position: 'absolute', inset: 8, border: `1px solid ${template.borderColor}40`, pointerEvents: 'none' }} />
        )}
        <div style={{ fontSize: 14, fontWeight: 600, color: template.borderColor, letterSpacing: 2 }}>
          {template.logoText}
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: template.titleColor, marginTop: 16 }}>
          {replacePlaceholders(template.title, mergedData)}
        </h1>
        <div style={{ fontSize: 16, lineHeight: 2, marginTop: 16, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {bodyLines.map((line, i) => (
            <p key={i} style={{ fontWeight: line.includes(mergedData.employeeName) ? 700 : 400 }}>
              {line}
            </p>
          ))}
        </div>
        <div style={{ marginTop: 24, borderTop: `1px solid ${template.textColor}40`, paddingTop: 8, fontSize: 14 }}>
          {template.signatureText}
        </div>
      </div>
    </div>
  );
};

const CertificatePreview = (props: CertificatePreviewProps) => {
  const mergedData = { ...defaultData, ...props.data };

  const handlePrint = () => downloadCertificatePdf(props.template, props.data || {});

  return (
    <div className="space-y-3">
      {props.template.templateType === 'image' ? (
        <ImagePreview template={props.template} data={mergedData} />
      ) : (
        <HtmlPreview {...props} />
      )}
      {props.showPrintButton && (
        <div className="flex justify-center">
          <Button onClick={handlePrint} variant="outline" className="gap-2">
            <Printer className="h-4 w-4" />
            הדפס / הורד PDF
          </Button>
        </div>
      )}
    </div>
  );
};

export default CertificatePreview;