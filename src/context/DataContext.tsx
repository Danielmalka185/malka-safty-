import React, { createContext, useContext, useState, useCallback } from "react";
import {
  Company, Employee, Training, Certificate,
  companies as initCompanies,
  employees as initEmployees,
  trainings as initTrainings,
  certificates as initCertificates,
  trainingTypes,
} from "@/data/mockData";

interface DataContextType {
  companies: Company[];
  employees: Employee[];
  trainings: Training[];
  certificates: Certificate[];
  addCompany: (data: Omit<Company, 'id'>) => Company;
  updateCompany: (data: Company) => void;
  addEmployee: (data: Omit<Employee, 'id'>) => Employee;
  updateEmployee: (data: Employee) => void;
  addTraining: (data: Omit<Training, 'id'>) => Training;
  updateTraining: (data: Training) => void;
  addCertificatesForTraining: (training: Training) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>([...initCompanies]);
  const [employees, setEmployees] = useState<Employee[]>([...initEmployees]);
  const [trainings, setTrainings] = useState<Training[]>([...initTrainings]);
  const [certificates, setCertificates] = useState<Certificate[]>([...initCertificates]);

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
    const newCerts: Certificate[] = [];
    for (const participantId of training.participantIds) {
      for (const typeId of training.trainingTypeIds) {
        const tt = trainingTypes.find(t => t.id === typeId);
        if (!tt || !tt.requiresCertificate) continue;
        const issueDate = training.date;
        const expiry = new Date(issueDate);
        expiry.setMonth(expiry.getMonth() + tt.validityMonths);
        const expiryDate = expiry.toISOString().split('T')[0];
        
        const now = new Date();
        const threeMonths = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
        let status: Certificate['status'] = 'valid';
        if (expiry < now) status = 'expired';
        else if (expiry <= threeMonths) status = 'expiring_soon';

        newCerts.push({
          id: `cert${Date.now()}-${participantId}-${typeId}`,
          employeeId: participantId,
          companyId: training.companyId,
          trainingTypeId: typeId,
          trainingId: training.id,
          issueDate,
          expiryDate,
          status,
        });
      }
    }
    if (newCerts.length > 0) {
      setCertificates(prev => [...prev, ...newCerts]);
    }
  }, []);

  return (
    <DataContext.Provider value={{
      companies, employees, trainings, certificates,
      addCompany, updateCompany,
      addEmployee, updateEmployee,
      addTraining, updateTraining,
      addCertificatesForTraining,
    }}>
      {children}
    </DataContext.Provider>
  );
}
