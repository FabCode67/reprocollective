"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ReportCard from "@/components/ReportCard";
import { getReports } from "@/lib/db";
import { Report } from "@/types";
import RootLayout from "@/components/layouts/Dashboardlayout";

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  
  useEffect(() => {
    setReports(getReports());
  }, []);
  
  const handleDelete = () => {
    setReports(getReports());
  };
  
  return (
    <RootLayout>
    <div className="min-h-screen bg-orange-50">
      <header className="bg-[#F77665] text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">
                <Link href="spotlight/reports">Contribution Reports</Link>
              </h1>
              <p className="mt-1">Tracking our impact and resources</p>
            </div>
            <Button asChild className="bg-white text-[#F77665] hover:bg-orange-100">
              <Link href="spotlight/reports/create" className="flex items-center gap-1">
                <Plus size={18} />
                Create Report
              </Link>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-orange-800 mb-2">All Reports</h2>
          <p className="text-gray-600">Browse through all contribution reports</p>
        </div>
        
        {reports.length === 0 ? (
          <div className="bg-white p-8 rounded-lg text-center shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">No reports yet!</h3>
            <p className="mb-6 text-gray-600">
              Start tracking your contributions by creating your first report.
            </p>
            <Button asChild className="bg-[#F77665] hover:bg-[#F77665]">
              <Link href="spotlight/reports/create">Create Your First Report</Link>
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map(report => (
              <ReportCard key={report.id} report={report} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>
    </div>
    </RootLayout>
  );
}