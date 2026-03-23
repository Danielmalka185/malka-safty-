import React, { createContext, useContext, useState, useCallback } from "react";
import {
  Company, Employee, Training, Certificate, CertificateTemplate, Instructor,
  companies as initCompanies,
  employees as initEmployees,
  trainings as initTrainings,
  certificates as initCertificates,
  certificateTemplates as initTemplates,
  instructors as initInstructors,
  trainingTypes,
  trainingCategories,
} from "@/data/mockData";

interface DataContextType {
  companies: Company[];
  employees: Employee[];
  trainings: Training[];
  certificates: Certificate[];
  templates: CertificateTemplate[];
  instructors: Instructor[];
  addCompany: (data: Omit<Company, 'id'>) => Company;
  updateCompany: (data: Company) => void;
  addEmployee: (data: Omit<Employee, 'id'>) => Employee;
  updateEmployee: (data: Employee) => void;
  addTraining: (data: Omit<Training, 'id'>) => Training;
  updateTraining: (data: Training) => void;
  addCertificatesForTraining: (training: Training) => void;
  addTemplate: (data: Omit<CertificateTemplate, 'id'>) => CertificateTemplate;
  updateTemplate: (data: CertificateTemplate) => void;
  getTemplateForCategory: (categoryId: string) => CertificateTemplate;
  getCompanyName: (id: string) => string;
  getEmployeeName: (id: string) => string;
  getEmployee: (id: string) => Employee | undefined;
  getTrainingTypeName: (id: string) => string;
  getCategoryName: (id: string) => string;
  addInstructor: (data: Omit<Instructor, 'id'>) => Instructor;
  updateInstructor: (data: Instructor) => void;
  deleteInstructor: (id: string) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function useData(): DataContextType {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>([...initCompanies]);
  const [employees, setEmployees] = useState<Employee[]>([...initEmployees]);
  const [trainings, setTrainings] = useState<Training[]>([...initTrainings]);
  const [certificates, setCertificates] = useState<Certificate[]>([...initCertificates]);
  const [templates, setTemplates] = useState<CertificateTemplate[]>([...initTemplates]);
  const [instructors, setInstructors] = useState<Instructor[]>([...initInstructors]);

  const addCompany = useCallback((data: Omit<Company, 'id'>): Company => {
    const newCompany: Company = { ...data, id: `c${Date.now()}` };
    setCompanies(prev => [...prev, newCompany]);
    return newCompany;
  }, []);

  const updateCompany = useCallback((data: Company) => {
    setCompanies(prev => prev.map(c => c.id === data.id ? data : c));
  }, []);

  const addEmployee = useCallback((data: Omit<Employee, 'id'>): Employee => {
    const newEmployee: Employee = { ...data, id: `e${Date.now()}` };
    setEmployees(prev => [...prev, newEmployee]);
    return newEmployee;
  }, []);

  const updateEmployee = useCallback((data: Employee) => {
    setEmployees(prev => prev.map(e => e.id === data.id ? data : e));
  }, []);

  const addTraining = useCallback((data: Omit<Training, 'id'>): Training => {
    const newTraining: Training = { ...data, id: `tr${Date.now()}` };
    setTrainings(prev => [...prev, newTraining]);
    return newTraining;
  }, []);

  const updateTraining = useCallback((data: Training) => {
    setTrainings(prev => prev.map(t => t.id === data.id ? data : t));
  }, []);

  const addCertificatesForTraining = useCallback((training: Training) => {
    const certTypeIds = training.trainingTypeIds.filter(typeId => {
      const tt = trainingTypes.find(t => t.id === typeId);
      return tt?.requiresCertificate;
    });
    if (certTypeIds.length === 0) return;

    const shortestValidity = certTypeIds.reduce((min, typeId) => {
      const tt = trainingTypes.find(t => t.id === typeId);
      return tt ? Math.min(min, tt.validityMonths) : min;
    }, Infinity);

    const issueDate = training.date;
    const expiry = new Date(issueDate);
    expiry.setMonth(expiry.getMonth() + shortestValidity);
    const expiryDate = expiry.toISOString().split('T')[0];

    const now = new Date();
    const threeMonths = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    let status: Certificate['status'] = 'valid';
    if (expiry < now) status = 'expired';
    else if (expiry <= threeMonths) status = 'expiring_soon';

    const newCerts: Certificate[] = training.participantIds.map(participantId => ({
      id: `cert${Date.now()}-${participantId}`,
      employeeId: participantId,
      companyId: training.companyId,
      trainingTypeIds: certTypeIds,
      trainingKind: training.trainingKind || 'new',
      trainingId: training.id,
      issueDate,
      expiryDate,
      status,
    }));

    setCertificates(prev => [...prev, ...newCerts]);
  }, []);

  const addTemplate = useCallback((data: Omit<CertificateTemplate, 'id'>): CertificateTemplate => {
    const newTemplate: CertificateTemplate = { ...data, id: `tmpl-${Date.now()}` };
    setTemplates(prev => [...prev, newTemplate]);
    return newTemplate;
  }, []);

  const updateTemplate = useCallback((data: CertificateTemplate) => {
    setTemplates(prev => prev.map(t => t.id === data.id ? data : t));
  }, []);

  const getTemplateForCategory = useCallback((categoryId: string): CertificateTemplate => {
    return templates.find(t => t.categoryId === categoryId)
      || templates.find(t => t.categoryId === '')
      || templates[0];
  }, [templates]);

  const getCompanyName = useCallback((id: string) => {
    return companies.find(c => c.id === id)?.name || 'לא ידוע';
  }, [companies]);

  const getEmployeeName = useCallback((id: string) => {
    const emp = employees.find(e => e.id === id);
    return emp ? `${emp.firstName} ${emp.lastName}` : 'לא ידוע';
  }, [employees]);

  const getEmployeeById = useCallback((id: string) => {
    return employees.find(e => e.id === id);
  }, [employees]);

  const getTrainingTypeName = useCallback((id: string) => {
    return trainingTypes.find(t => t.id === id)?.name || 'לא ידוע';
  }, []);

  const getCategoryName = useCallback((id: string) => {
    return trainingCategories.find(c => c.id === id)?.name || 'לא ידוע';
  }, []);

  const addInstructor = useCallback((data: Omit<Instructor, 'id'>): Instructor => {
    const newInstructor: Instructor = { ...data, id: `inst-${Date.now()}` };
    setInstructors(prev => [...prev, newInstructor]);
    return newInstructor;
  }, []);

  const updateInstructor = useCallback((data: Instructor) => {
    setInstructors(prev => prev.map(i => i.id === data.id ? data : i));
  }, []);

  const deleteInstructor = useCallback((id: string) => {
    setInstructors(prev => prev.filter(i => i.id !== id));
  }, []);

  return (
    <DataContext.Provider value={{
      companies, employees, trainings, certificates, templates, instructors,
      addCompany, updateCompany,
      addEmployee, updateEmployee,
      addTraining, updateTraining,
      addCertificatesForTraining,
      addTemplate, updateTemplate, getTemplateForCategory,
      getCompanyName, getEmployeeName,
      getEmployee: getEmployeeById,
      getTrainingTypeName, getCategoryName,
      addInstructor, updateInstructor, deleteInstructor,
    }}>
      {children}
    </DataContext.Provider>
  );
}
