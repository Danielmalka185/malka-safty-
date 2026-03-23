import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";
import type { CertificateTemplate } from "@/data/mockData";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

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

const RUBIK_FONT_URL = 'https://fonts.gstatic.com/s/rubik/v28/iJWZBXyIfDnIV5PNhY1KTN7Z-Yh-B4i.ttf';

function replacePlaceholders(text: string, data: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (_, key) => data[key] || `{${key}}`);
}

let cachedFontBytes: ArrayBuffer | null = null;

async function fetchRubikFont(): Promise<ArrayBuffer> {
  if (cachedFontBytes) return cachedFontBytes;
  const res = await fetch(RUBIK_FONT_URL);
  cachedFontBytes = await res.arrayBuffer();
  return cachedFontBytes;
}

async function generatePdfWithFields(
  pdfBase64: string,
  fields: CertificateTemplate['pdfFields'],
  data: Record<string, string>
): Promise<Uint8Array> {
  const pdfBytes = Uint8Array.from(atob(pdfBase64), c => c.charCodeAt(0));
  const pdfDoc = await PDFDocument.load(pdfBytes);
  pdfDoc.registerFontkit(fontkit);

  const fontBytes = await fetchRubikFont();
  const font = await pdfDoc.embedFont(fontBytes);

  const page = pdfDoc.getPages()[0];

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
      // Skip unsupported chars
    }
  }

  return pdfDoc.save();
}

export async function downloadCertificatePdf(
  template: CertificateTemplate,
  data: Record<string, string>
) {
  const mergedData = { ...defaultData, ...data };

  if (template.templateType === 'pdf' && template.pdfBase64) {
    const bytes = await generatePdfWithFields(template.pdfBase64, template.pdfFields, mergedData);
    const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate-${mergedData.employeeName}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  } else {
    // HTML template — use print
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
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
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
  }
}

const PdfPreview = ({ template, data }: { template: CertificateTemplate; data: Record<string, string> }) => {
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const mergedData = { ...defaultData, ...data };

  useEffect(() => {
    if (!template.pdfBase64) return;
    
    generatePdfWithFields(template.pdfBase64, template.pdfFields, mergedData).then(bytes => {
      const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      return () => URL.revokeObjectURL(url);
    });
  }, [template.pdfBase64, template.pdfFields, data]);

  const handleDownload = () => downloadCertificatePdf(template, data || {});

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

  const handlePrint = () => downloadCertificatePdf(template, data || {});

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
