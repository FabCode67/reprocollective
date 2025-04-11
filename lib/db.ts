// /lib/db.ts
import { Report } from "@/types";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

// API URL (you'll need to configure this based on your environment)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Get all reports
export const getReports = async (): Promise<Report[]> => {
  if (typeof window === "undefined") {
    // Server-side - make API call
    try {
      const response = await axios.get(`${API_URL}/reports`);
      return response.data.reports;
    } catch (error) {
      console.error("Error fetching reports:", error);
      return [];
    }
  } else {
    // Client-side - use localStorage
    const reports = localStorage.getItem("reports");
    return reports ? JSON.parse(reports) : [];
  }
};

// Get a specific report by ID
export const getReportById = async (id: string): Promise<Report | undefined> => {
  if (typeof window === "undefined") {
    // Server-side - make API call
    try {
      const response = await axios.get(`${API_URL}/reports/${id}`);
      return response.data.report;
    } catch (error) {
      console.error(`Error fetching report ${id}:`, error);
      return undefined;
    }
  } else {
    // Client-side - use localStorage
    const reports = getReports();
    return reports.then(reports => reports.find(report => report.id === id));
  }
};

// Add a new report
export const addReport = async (report: Omit<Report, "id">): Promise<Report> => {
  if (typeof window === "undefined") {
    // Server-side - make API call
    try {
      const response = await axios.post(`${API_URL}/reports`, report);
      return response.data.data;
    } catch (error) {
      console.error("Error adding report:", error);
      throw error;
    }
  } else {
    // Client-side - use localStorage
    const newReport = { ...report, id: uuidv4() };
    const reports = await getReports();
    localStorage.setItem("reports", JSON.stringify([...reports, newReport]));
    return newReport;
  }
};

// Delete a report
export const deleteReport = async (id: string): Promise<boolean> => {
  if (typeof window === "undefined") {
    // Server-side - make API call
    try {
      await axios.delete(`${API_URL}/reports/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting report ${id}:`, error);
      return false;
    }
  } else {
    // Client-side - use localStorage
    const reports = await getReports();
    const filteredReports = reports.filter(report => report.id !== id);
    localStorage.setItem("reports", JSON.stringify(filteredReports));
    return true;
  }
};

// Update a report
export const updateReport = async (id: string, reportData: Partial<Report>): Promise<Report | undefined> => {
  if (typeof window === "undefined") {
    // Server-side - make API call
    try {
      const response = await axios.put(`${API_URL}/reports/${id}`, reportData);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating report ${id}:`, error);
      return undefined;
    }
  } else {
    // Client-side - use localStorage
    const reports = await getReports();
    const reportIndex = reports.findIndex(report => report.id === id);
    
    if (reportIndex === -1) return undefined;
    
    const updatedReport = { ...reports[reportIndex], ...reportData };
    reports[reportIndex] = updatedReport;
    localStorage.setItem("reports", JSON.stringify(reports));
    return updatedReport;
  }
};

// Get report summary
export const getReportSummary = async () => {
  if (typeof window === "undefined") {
    // Server-side - make API call
    try {
      const response = await axios.get(`${API_URL}/reports/summary`);
      return response.data;
    } catch (error) {
      console.error("Error fetching report summary:", error);
      return {};
    }
  } else {
    // Client-side - calculate from localStorage
    const reports = await getReports();
    
    // Calculate current year stats
    const currentYear = new Date().getFullYear();
    
    // Generate monthly stats
    const monthlyStats = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const monthName = new Date(currentYear, i, 1).toLocaleString('default', { month: 'long' });
      
      const monthReports = reports.filter(report => {
        const reportDate = new Date(report.date);
        return reportDate.getFullYear() === currentYear && reportDate.getMonth() === i;
      });
      
      return {
        month,
        monthName,
        moneyEarned: monthReports.reduce((sum, r) => sum + r.moneyEarned, 0),
        padsBought: monthReports.reduce((sum, r) => sum + r.padsBought, 0),
        padsDonated: monthReports.reduce((sum, r) => sum + r.padsDonated, 0),
        adolescentsTrained: monthReports.reduce((sum, r) => sum + r.adolescentsTrained, 0),
      };
    });
    
    // Calculate yearly totals
    const yearReports = reports.filter(report => {
      const reportDate = new Date(report.date);
      return reportDate.getFullYear() === currentYear;
    });
    
    const yearlyTotals = {
      year: currentYear,
      totalMoneyEarned: yearReports.reduce((sum, r) => sum + r.moneyEarned, 0),
      totalPadsBought: yearReports.reduce((sum, r) => sum + r.padsBought, 0),
      totalPadsDonated: yearReports.reduce((sum, r) => sum + r.padsDonated, 0),
      totalAdolescentsTrained: yearReports.reduce((sum, r) => sum + r.adolescentsTrained, 0),
    };
    
    return { monthlyStats, yearlyTotals };
  }
};