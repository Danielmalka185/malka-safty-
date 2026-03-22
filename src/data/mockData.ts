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

import { companies as _companies } from './companiesData';
import { employees as _employees } from './employeesData';
import { trainings as _trainings } from './trainingsData';
import { certificates as _certificates } from './certificatesData';

export let companies = _companies;
export const employees = _employees;

export let trainingCategories: TrainingCategory[] = [
  { id: 'cat1', name: 'עבודה בגובה', description: 'הדרכות הקשורות לעבודה בגובה על סוגיה' },
  { id: 'cat2', name: 'בטיחות כללית', description: 'הדרכות בטיחות כלליות' },
  { id: 'cat3', name: 'חומרים מסוכנים', description: 'הדרכות לטיפול בחומרים מסוכנים' },
  { id: 'cat4', name: 'מלגזה', description: 'הדרכות להפעלת מלגזה' },
];

export let trainingTypes: TrainingType[] = [
  { id: '1', categoryId: 'cat1', name: 'סולמות', field: 'עבודה בגובה', validityMonths: 24, requiresCertificate: true },
  { id: '2', categoryId: 'cat1', name: 'פיגומים נייחים וניידים', field: 'עבודה בגובה', validityMonths: 24, requiresCertificate: true },
  { id: '3', categoryId: 'cat1', name: 'בימות הרמה', field: 'עבודה בגובה', validityMonths: 24, requiresCertificate: true },
  { id: '4', categoryId: 'cat2', name: 'הדרכה כללית', field: 'בטיחות כללית', validityMonths: 24, requiresCertificate: false },
  { id: '5', categoryId: 'cat2', name: 'בטיחות אש', field: 'בטיחות כללית', validityMonths: 24, requiresCertificate: true },
  { id: '6', categoryId: 'cat2', name: 'עזרה ראשונה', field: 'בטיחות כללית', validityMonths: 36, requiresCertificate: true },
  { id: '7', categoryId: 'cat3', name: 'חומרים מסוכנים', field: 'חומרים מסוכנים', validityMonths: 12, requiresCertificate: false },
  { id: '8', categoryId: 'cat4', name: 'הפעלת מלגזה', field: 'מלגזה', validityMonths: 24, requiresCertificate: true },
  { id: '9', categoryId: 'cat1', name: 'גגות שבירים', field: 'עבודה בגובה', validityMonths: 24, requiresCertificate: true },
  { id: '10', categoryId: 'cat1', name: 'סלים להרמת אדם', field: 'עבודה בגובה', validityMonths: 24, requiresCertificate: true },
  { id: '11', categoryId: 'cat1', name: 'גגות שטוחים/משופעים/תלולים', field: 'עבודה בגובה', validityMonths: 24, requiresCertificate: true },
  { id: '12', categoryId: 'cat1', name: 'קונסטרוקציה', field: 'עבודה בגובה', validityMonths: 24, requiresCertificate: true },
  { id: '13', categoryId: 'cat1', name: 'חלל מוקף', field: 'עבודה בגובה', validityMonths: 24, requiresCertificate: true },
  { id: '14', categoryId: 'cat1', name: 'פיגומים ממוכנים', field: 'עבודה בגובה', validityMonths: 24, requiresCertificate: true },
];

export let trainings = _trainings;
export let certificates = _certificates;

export let certificateTemplates: CertificateTemplate[] = [
  {
    id: 'tmpl-default',
    categoryId: '',
    templateType: 'html',
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
    templateType: 'html',
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

export const riskSurveys: RiskSurvey[] = [];

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
