export interface Company {
  id: string;
  name: string;
  registrationNumber: string;
  contactPerson: string;
  phone: string;
  officePhone: string;
  email: string;
  address: string;
  mailingAddress: string;
  website: string;
  notes: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  idNumber: string;
  birthYear: number;
  profession: string;
  address: string;
  phone: string;
  companyId: string;
  status: 'active' | 'inactive';
}

export interface TrainingCategory {
  id: string;
  name: string;
  description: string;
}

export interface TrainingType {
  id: string;
  categoryId: string;
  name: string;
  field: string;
  validityMonths: number;
  requiresCertificate: boolean;
}

export interface Training {
  id: string;
  companyId: string;
  categoryId: string;
  trainingTypeIds: string[];
  date: string;
  location: string;
  instructor: string;
  participantIds: string[];
  pricingType: 'per_person' | 'global';
  basePrice: number;
  discountPercent: number;
}

export interface Certificate {
  id: string;
  employeeId: string;
  companyId: string;
  trainingTypeId: string;
  trainingId: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expired' | 'expiring_soon';
}

export interface PdfField {
  key: string;
  label: string;
  x: number;
  y: number;
  fontSize: number;
}

export interface CertificateTemplate {
  id: string;
  categoryId: string;
  templateType: 'html' | 'pdf';
  title: string;
  bodyText: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  titleColor: string;
  fontFamily: string;
  showBorder: boolean;
  logoText: string;
  signatureText: string;
  pdfBase64?: string;
  pdfFields?: PdfField[];
}

export interface RiskSurvey {
  id: string;
  siteName: string;
  companyId: string;
  date: string;
  findings: string;
  correctiveActions: string;
  imageUrls: string[];
}

// Helper: calculate final price
export function calculateFinalPrice(training: Training): number {
  const multiplier = training.pricingType === 'per_person' ? training.participantIds.length : 1;
  const subtotal = training.basePrice * multiplier;
  return subtotal * (1 - training.discountPercent / 100);
}

export let companies: Company[] = [
  { id: '1', name: 'חברת בנייה א.ב בע"מ', registrationNumber: '512345678', contactPerson: 'אברהם כהן', phone: '050-1234567', officePhone: '03-1234567', email: 'info@building-ab.co.il', address: 'רחוב הרצל 15, תל אביב', mailingAddress: 'ת.ד 123, תל אביב', website: 'www.building-ab.co.il', notes: 'לקוח ותיק, חברת בנייה גדולה' },
  { id: '2', name: 'קבוצת גולן תשתיות', registrationNumber: '514567890', contactPerson: 'יוסי לוי', phone: '052-9876543', officePhone: '04-9876543', email: 'yossi@golan-infra.co.il', address: 'רחוב הנשיא 42, חיפה', mailingAddress: '', website: 'www.golan-infra.co.il', notes: '' },
  { id: '3', name: 'מפעלי דרום בע"מ', registrationNumber: '516789012', contactPerson: 'שרה מזרחי', phone: '054-5551234', officePhone: '', email: 'sara@south-factories.co.il', address: 'אזור תעשייה, באר שבע', mailingAddress: 'אזור תעשייה, באר שבע', website: '', notes: 'דורש חידוש הדרכות' },
  { id: '4', name: 'אלקטרו-טק פתרונות', registrationNumber: '518901234', contactPerson: 'דוד ביטון', phone: '053-7778899', officePhone: '09-7778899', email: 'david@electro-tek.co.il', address: 'פארק תעשיות, נתניה', mailingAddress: '', website: 'www.electro-tek.co.il', notes: '' },
];

export const employees: Employee[] = [
  { id: '1', firstName: 'משה', lastName: 'כהן', fatherName: 'יעקב', idNumber: '301234567', birthYear: 1985, profession: 'מנהל אתר', address: 'רחוב הרצל 10, תל אביב', phone: '050-1112233', companyId: '1', status: 'active' },
  { id: '2', firstName: 'יעקב', lastName: 'לוי', fatherName: 'אברהם', idNumber: '302345678', birthYear: 1990, profession: 'עובד גובה', address: 'רחוב ויצמן 5, רמת גן', phone: '052-4445566', companyId: '1', status: 'active' },
  { id: '3', firstName: 'רחל', lastName: 'אברהם', fatherName: 'דוד', idNumber: '303456789', birthYear: 1988, profession: 'מהנדסת בטיחות', address: 'רחוב הנביאים 22, חיפה', phone: '054-7778899', companyId: '2', status: 'active' },
  { id: '4', firstName: 'אהרון', lastName: 'מזרחי', fatherName: 'שלמה', idNumber: '304567890', birthYear: 1975, profession: 'טכנאי', address: 'רחוב הגפן 8, חיפה', phone: '053-1234567', companyId: '2', status: 'inactive' },
  { id: '5', firstName: 'שירה', lastName: 'גולן', fatherName: 'משה', idNumber: '305678901', birthYear: 1992, profession: 'עובדת כללית', address: 'שד׳ רגר 15, באר שבע', phone: '050-9998877', companyId: '3', status: 'active' },
  { id: '6', firstName: 'דניאל', lastName: 'פרץ', fatherName: 'יוסף', idNumber: '306789012', birthYear: 1983, profession: 'מנהל עבודה', address: 'רחוב הרצוג 3, נתניה', phone: '052-6665544', companyId: '4', status: 'active' },
];

export let trainingCategories: TrainingCategory[] = [
  { id: 'cat1', name: 'עבודה בגובה', description: 'הדרכות הקשורות לעבודה בגובה על סוגיה' },
  { id: 'cat2', name: 'בטיחות כללית', description: 'הדרכות בטיחות כלליות' },
  { id: 'cat3', name: 'חומרים מסוכנים', description: 'הדרכות לטיפול בחומרים מסוכנים' },
  { id: 'cat4', name: 'מלגזה', description: 'הדרכות להפעלת מלגזה' },
];

export let trainingTypes: TrainingType[] = [
  { id: '1', categoryId: 'cat1', name: 'סולמות', field: 'עבודה בגובה', validityMonths: 12, requiresCertificate: true },
  { id: '2', categoryId: 'cat1', name: 'פיגומים', field: 'עבודה בגובה', validityMonths: 12, requiresCertificate: true },
  { id: '3', categoryId: 'cat1', name: 'במות הרמה', field: 'עבודה בגובה', validityMonths: 12, requiresCertificate: true },
  { id: '4', categoryId: 'cat2', name: 'הדרכה כללית', field: 'בטיחות כללית', validityMonths: 24, requiresCertificate: false },
  { id: '5', categoryId: 'cat2', name: 'בטיחות אש', field: 'בטיחות כללית', validityMonths: 24, requiresCertificate: true },
  { id: '6', categoryId: 'cat2', name: 'עזרה ראשונה', field: 'בטיחות כללית', validityMonths: 36, requiresCertificate: true },
  { id: '7', categoryId: 'cat3', name: 'חומרים מסוכנים', field: 'חומרים מסוכנים', validityMonths: 12, requiresCertificate: false },
  { id: '8', categoryId: 'cat4', name: 'הפעלת מלגזה', field: 'מלגזה', validityMonths: 24, requiresCertificate: true },
];

export let trainings: Training[] = [
  { id: '1', companyId: '1', categoryId: 'cat1', trainingTypeIds: ['1', '2'], date: '2024-12-15', location: 'אתר בנייה תל אביב', instructor: 'ד"ר אלי שמש', participantIds: ['1', '2'], pricingType: 'per_person', basePrice: 350, discountPercent: 0 },
  { id: '2', companyId: '2', categoryId: 'cat2', trainingTypeIds: ['5'], date: '2025-01-20', location: 'משרדי החברה, חיפה', instructor: 'מיכל רון', participantIds: ['3', '4'], pricingType: 'global', basePrice: 1200, discountPercent: 10 },
  { id: '3', companyId: '3', categoryId: 'cat1', trainingTypeIds: ['2'], date: '2025-02-10', location: 'אזור תעשייה באר שבע', instructor: 'ד"ר אלי שמש', participantIds: ['5'], pricingType: 'per_person', basePrice: 400, discountPercent: 0 },
  { id: '4', companyId: '1', categoryId: 'cat2', trainingTypeIds: ['6'], date: '2025-03-05', location: 'מרכז הדרכה ראשון לציון', instructor: 'נורית כץ', participantIds: ['1', '2'], pricingType: 'global', basePrice: 2000, discountPercent: 15 },
];

export let certificates: Certificate[] = [
  { id: '1', employeeId: '1', companyId: '1', trainingTypeId: '1', trainingId: '1', issueDate: '2024-12-15', expiryDate: '2025-12-15', status: 'valid' },
  { id: '2', employeeId: '2', companyId: '1', trainingTypeId: '1', trainingId: '1', issueDate: '2024-12-15', expiryDate: '2025-12-15', status: 'valid' },
  { id: '3', employeeId: '3', companyId: '2', trainingTypeId: '3', trainingId: '2', issueDate: '2025-01-20', expiryDate: '2027-01-20', status: 'valid' },
  { id: '4', employeeId: '4', companyId: '2', trainingTypeId: '3', trainingId: '2', issueDate: '2025-01-20', expiryDate: '2027-01-20', status: 'valid' },
  { id: '5', employeeId: '5', companyId: '3', trainingTypeId: '2', trainingId: '3', issueDate: '2025-02-10', expiryDate: '2026-02-10', status: 'valid' },
  { id: '6', employeeId: '1', companyId: '1', trainingTypeId: '4', trainingId: '4', issueDate: '2025-03-05', expiryDate: '2028-03-05', status: 'valid' },
  { id: '7', employeeId: '2', companyId: '1', trainingTypeId: '4', trainingId: '4', issueDate: '2025-03-05', expiryDate: '2028-03-05', status: 'valid' },
];

export let certificateTemplates: CertificateTemplate[] = [
  {
    id: 'tmpl-default',
    categoryId: '',
    title: 'תעודת הסמכה',
    bodyText: 'ניתנת בזאת תעודת הסמכה ל{employeeName} (ת.ז. {idNumber})\nמחברת {companyName}\n\nבגין סיום בהצלחה הדרכה בנושא:\n{trainingType}\n\nההדרכה התקיימה בתאריך {date}\nבהנחיית {instructor}\n\nתעודה זו בתוקף עד {expiryDate}',
    backgroundColor: '#ffffff',
    borderColor: '#1a5276',
    textColor: '#2c3e50',
    titleColor: '#1a5276',
    fontFamily: 'Rubik',
    showBorder: true,
    logoText: 'ניהול בטיחות',
    signatureText: 'חתימת ממונה בטיחות',
  },
  {
    id: 'tmpl-cat1',
    categoryId: 'cat1',
    title: 'תעודת הסמכה — עבודה בגובה',
    bodyText: 'ניתנת בזאת תעודת הסמכה ל{employeeName} (ת.ז. {idNumber})\nמחברת {companyName}\n\nבגין סיום בהצלחה הדרכה בנושא:\n{trainingType}\n\nההדרכה התקיימה בתאריך {date}\nבהנחיית {instructor}\n\nתעודה זו בתוקף עד {expiryDate}',
    backgroundColor: '#fffef5',
    borderColor: '#b8860b',
    textColor: '#2c3e50',
    titleColor: '#8b6914',
    fontFamily: 'Rubik',
    showBorder: true,
    logoText: 'ניהול בטיחות',
    signatureText: 'חתימת ממונה בטיחות',
  },
];

export const riskSurveys: RiskSurvey[] = [
  { id: '1', siteName: 'אתר בנייה מגדלי הים', companyId: '1', date: '2025-01-10', findings: 'נמצאו מעקות חסרים בקומה 5, תאורה לקויה בחדר מדרגות', correctiveActions: 'התקנת מעקות תוך 48 שעות, החלפת תאורה תוך שבוע', imageUrls: [] },
  { id: '2', siteName: 'מפעל ייצור גולן', companyId: '2', date: '2025-02-14', findings: 'ציוד כיבוי אש לא תקין, שילוט חסר באזור חומ"ס', correctiveActions: 'החלפת מטפים, הוספת שילוט אזהרה', imageUrls: [] },
  { id: '3', siteName: 'מחסן לוגיסטי דרום', companyId: '3', date: '2025-03-01', findings: 'מעברים חסומים, חוסר בציוד מגן אישי', correctiveActions: 'פינוי מעברים מיידי, הזמנת ציוד מגן', imageUrls: [] },
];

// Helper functions
export function getCompanyName(companyId: string): string {
  return companies.find(c => c.id === companyId)?.name || 'לא ידוע';
}

export function getEmployeeName(employeeId: string): string {
  const emp = employees.find(e => e.id === employeeId);
  return emp ? `${emp.firstName} ${emp.lastName}` : 'לא ידוע';
}

export function getEmployee(employeeId: string): Employee | undefined {
  return employees.find(e => e.id === employeeId);
}

export function getTrainingTypeName(typeId: string): string {
  return trainingTypes.find(t => t.id === typeId)?.name || 'לא ידוע';
}

export function getCategoryName(categoryId: string): string {
  return trainingCategories.find(c => c.id === categoryId)?.name || 'לא ידוע';
}

export function getTemplateForCategory(categoryId: string): CertificateTemplate {
  return certificateTemplates.find(t => t.categoryId === categoryId) 
    || certificateTemplates.find(t => t.categoryId === '')!;
}
