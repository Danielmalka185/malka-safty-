import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import type { CertificateTemplate } from "@/data/mockData";

interface CertificatePreviewProps {
  template: CertificateTemplate;
  data?: Record<string, string>;
  showPrintButton?: boolean;
}

const defaultData: Record<string, string> = {
  employeeName: 'ישראל ישראלי',
  idNumber: '300000000',
  companyName: 'חברה לדוגמה',
  trainingType: 'הדרכת בטיחות',
  categoryName: 'בטיחות כללית',
  date: '2025-01-01',
  expiryDate: '2026-01-01',
  instructor: 'מדריך לדוגמה',
};

function replacePlaceholders(text: string, data: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (_, key) => data[key] || `{${key}}`);
}

const CertificatePreview = ({ template, data, showPrintButton = false }: CertificatePreviewProps) => {
  const printRef = useRef<HTMLDivElement>(null);
  const mergedData = { ...defaultData, ...data };
  const bodyLines = replacePlaceholders(template.bodyText, mergedData).split('\n');

  const handlePrint = () => {
    if (!printRef.current) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
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
        </style>
      </head>
      <body>${printRef.current.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 300);
  };

  return (
    <div className="space-y-3">
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
          {/* Decorative inner border */}
          {template.showBorder && (
            <div style={{
              position: 'absolute',
              inset: 8,
              border: `1px solid ${template.borderColor}40`,
              pointerEvents: 'none',
            }} />
          )}

          {/* Logo */}
          <div style={{ fontSize: 14, fontWeight: 600, color: template.borderColor, letterSpacing: 2 }}>
            {template.logoText}
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 32,
            fontWeight: 700,
            color: template.titleColor,
            marginTop: 16,
          }}>
            {replacePlaceholders(template.title, mergedData)}
          </h1>

          {/* Body */}
          <div style={{ fontSize: 16, lineHeight: 2, marginTop: 16, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {bodyLines.map((line, i) => (
              <p key={i} style={{ fontWeight: line.includes(mergedData.employeeName) ? 700 : 400 }}>
                {line}
              </p>
            ))}
          </div>

          {/* Signature */}
          <div style={{ marginTop: 24, borderTop: `1px solid ${template.textColor}40`, paddingTop: 8, fontSize: 14 }}>
            {template.signatureText}
          </div>
        </div>
      </div>

      {showPrintButton && (
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
