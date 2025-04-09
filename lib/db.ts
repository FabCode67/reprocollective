// /lib/db.ts
import { Report } from "@/types";
import { v4 as uuidv4 } from "uuid";

// Mock database with localStorage
export const getReports = (): Report[] => {
  if (typeof window === "undefined") return [];
  
  const reports = localStorage.getItem("reports");
  return reports ? JSON.parse(reports) : [];
};

export const getReportById = (id: string): Report | undefined => {
  const reports = getReports();
  return reports.find(report => report.id === id);
};

export const addReport = (report: Omit<Report, "id">): Report => {
  const newReport = { ...report, id: uuidv4() };
  const reports = getReports();
  localStorage.setItem("reports", JSON.stringify([...reports, newReport]));
  return newReport;
};

export const deleteReport = (id: string): boolean => {
  const reports = getReports();
  const filteredReports = reports.filter(report => report.id !== id);
  localStorage.setItem("reports", JSON.stringify(filteredReports));
  return true;
};