import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";
import type { CertificateTemplate } from "@/data/mockData";
import { PDFDocument, rgb } from "pdf-lib";

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
  birthYear: '1990',
  profession: 'עובד כללי',
  fatherName: 'אברהם',
};

function replacePlaceholders(text: string, data: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (_, key) => data[key] || `{${key}}`);
}

async function generatePdfWithFields(
  pdfBase64: string,
  fields: CertificateTemplate['pdfFields'],
  data: Record<string, string>
): Promise<Uint8Array> {
  const pdfBytes = Uint8Array.from(atob(pdfBase64), c => c.charCodeAt(0));
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const page = pdfDoc.getPages()[0];

  // Load font that supports Hebrew - use embedded font
  // pdf-lib doesn't have built-in Hebrew font support, so we use a basic approach
  const font = await pdfDoc.embedFont('Helvetica' as any);

  for (const field of fields || []) {
    const value = data[field.key] || '';
    try {
      page.drawText(value, {
        x: field.x,
        y: field.y,
        size: field.fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    } catch {
      // If text can't be drawn (e.g. unsupported chars), skip
    }
  }

  return pdfDoc.save();
}

const PdfPreview = ({ template, data }: { template: CertificateTemplate; data: Record<string, string> }) => {
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const mergedData = { ...defaultData, ...data };

  useEffect(() => {
    if (!template.pdfBase64) return;
    
    generatePdfWithFields(template.pdfBase64, template.pdfFields, mergedData).then(bytes => {
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      return () => URL.revokeObjectURL(url);
    });
  }, [template.pdfBase64, template.pdfFields, data]);

  const handleDownload = async () => {
    if (!template.pdfBase64) return;
    const bytes = await generatePdfWithFields(template.pdfBase64, template.pdfFields, mergedData);
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate-${mergedData.employeeName}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!template.pdfBase64) {
    return <p className="text-center text-muted-foreground py-8">לא הועלה PDF לתבנית זו</p>;
  }

  return (
    <div className="space-y-3">
      {pdfUrl && (
        <iframe src={pdfUrl} className="w-full border rounded-lg" style={{ height: 500 }} />
      )}
      <div className="flex justify-center">
        <Button onClick={handleDownload} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          הורד PDF
        </Button>
      </div>
    </div>
  );
};

const HtmlPreview = ({ template, data, showPrintButton }: CertificatePreviewProps) => {
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
          {template.showBorder && (
            <div style={{
              position: 'absolute',
              inset: 8,
              border: `1px solid ${template.borderColor}40`,
              pointerEvents: 'none',
            }} />
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

const CertificatePreview = (props: CertificatePreviewProps) => {
  if (props.template.templateType === 'pdf') {
    return <PdfPreview template={props.template} data={{ ...defaultData, ...props.data }} />;
  }
  return <HtmlPreview {...props} />;
};

export default CertificatePreview;
