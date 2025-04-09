// /app/reports/create/page.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ReportForm from "@/components/ReportForm";
import RootLayout from "@/components/layouts/Dashboardlayout";

export default function CreateReportPage() {
  return (
    <RootLayout>
    <div className="min-h-screen bg-orange-50">
      <header className="bg-orange-600 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">
                <Link href="/">Contribution Reports</Link>
              </h1>
              <p className="mt-1">Tracking our impact and resources</p>
            </div>
            <Button variant="outline" className="bg-transparent text-white border-white hover:bg-orange-700" asChild>
              <Link href="/reports" className="flex items-center gap-1">
                <ArrowLeft size={18} />
                Back to Reports
              </Link>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-orange-800 mb-2">Create New Report</h2>
            <p className="text-gray-600">
              Fill out the form below to create a new contribution report. All fields are required.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <ReportForm />
          </div>
        </div>
      </main>
    </div>
    </RootLayout>
  );
}