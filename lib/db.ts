// /lib/db.ts
import { Report } from "@/types";
import axios from "axios";

// API URL (you'll need to configure this based on your environment)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Get all reports
export const getReports = async (): Promise<Report[]> => {
  try {
    const response = await axios.get(`${API_URL}/reports`);
    return response.data.reports;
  } catch (error) {
    console.error("Error fetching reports:", error);
    return [];
  }
};

// Get a specific report by ID
export const getReportById = async (id: string): Promise<Report | undefined> => {
  try {
    const response = await axios.get(`${API_URL}/reports/${id}`);
    return response.data.report;
  } catch (error) {
    console.error(`Error fetching report ${id}:`, error);
    return undefined;
  }
};

// Add a new report
export const addReport = async (report: Omit<Report, "id">): Promise<Report> => {
  try {
    const response = await axios.post(`${API_URL}/reports`, report);
    return response.data.data;
  } catch (error) {
    console.error("Error adding report:", error);
    throw error;
  }
};

// Delete a report
export const deleteReport = async (id: string): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/reports/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting report ${id}:`, error);
    return false;
  }
};

// Update a report
export const updateReport = async (id: string, reportData: Partial<Report>): Promise<Report | undefined> => {
  try {
    const response = await axios.put(`${API_URL}/reports/${id}`, reportData);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating report ${id}:`, error);
    return undefined;
  }
};

// Get report summary
export const getReportSummary = async () => {
  try {
    const response = await axios.get(`${API_URL}/reports/summary`);
    return response.data;
  } catch (error) {
    console.error("Error fetching report summary:", error);
    return {};
  }
};