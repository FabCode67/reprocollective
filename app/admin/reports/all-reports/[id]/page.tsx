"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getReportById, deleteReport } from "@/lib/db";
import { Report } from "@/types";
import { ArrowLeft, Trash2, RefreshCw } from "lucide-react";
import RootLayout from "@/components/layouts/Dashboardlayout";

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchReport = async () => {
    if (!params.id) return;
    
    try {
      setLoading(true);
      const data = await getReportById(params.id as string);
      setReport(data || null);
      setError(null);
    } catch (err) {
      setError("Failed to load report details. Please try again.");
      console.error("Error fetching report:", err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchReport();
  }, [params.id]);
  
  const handleDelete = async () => {
    if (!report) return;
    
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        setLoading(true);
        await deleteReport(report.id);
        router.push("/admin/reports/all-reports");
      } catch (err) {
        setError("Failed to delete report. Please try again.");
        console.error("Error deleting report:", err);
        setLoading(false);
      }
    }
  };
  
  if (loading) {
    return (
      <RootLayout>
        <div className="min-h-screen bg-orange-50 flex items-center justify-center">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-10 h-10 border-4 border-t-[#F77665] border-r-[#F77665] border-b-[#F77665]/40 border-l-[#F77665]/40 rounded-full animate-spin"></div>
            </div>
            <p className="text-xl text-orange-800">Loading report...</p>
          </div>
        </div>
      </RootLayout>
    );
  }
  
  if (error) {
    return (
      <RootLayout>
        <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg shadow-sm border-l-4 border-red-500 max-w-lg w-full">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Report</h1>
            <p className="mb-6 text-gray-600">{error}</p>
            <div className="flex gap-4">
              <Button onClick={fetchReport} className="bg-[#F77665] hover:bg-[#F77665]">
                <RefreshCw size={18} className="mr-2" />
                Try Again
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/reports/all-reports">Back to Reports</Link>
              </Button>
            </div>
          </div>
        </div>
      </RootLayout>
    );
  }
  
  if (!report) {
    return (
      <RootLayout>
        <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold text-orange-800 mb-4">Report Not Found</h1>
          <p className="mb-6 text-gray-600">{"The report you're looking for doesn't exist or has been removed."}</p>
          <Button asChild className="bg-[#F77665] hover:bg-[#F77665]">
            <Link href="/admin/reports/all-reports">Back to Reports</Link>
          </Button>
        </div>
      </RootLayout>
    );
  }
  
  return (
    <RootLayout>
      <div className="min-h-screen bg-orange-50">
        <header className="bg-[#F77665] text-white py-6">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">
                  <Link href="/admin/reports/all-reports">Contribution Reports</Link>
                </h1>
                <p className="mt-1">Tracking our impact and resources</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white/20" asChild>
                  <Link href="/admin/reports/all-reports" className="flex items-center gap-1">
                    <ArrowLeft size={18} />
                    Back to Reports
                  </Link>
                </Button>
                <Button variant="destructive" className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>
                  <Trash2 size={18} />
                </Button>
              </div>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-orange-100 p-6 border-b border-orange-200">
              <h1 className="text-3xl font-bold text-orange-800">{report.title}</h1>
              <p className="text-gray-600 mt-2">Published on {new Date(report.date).toLocaleDateString()}</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-orange-50 p-4 rounded border border-orange-200">
                  <p className="text-sm text-gray-600">Collected amount</p>
                  <p className="font-bold text-2xl text-orange-800">{report.moneyEarned.toFixed(2)} RWF</p>
                </div>
                {/* <div className="bg-orange-50 p-4 rounded border border-orange-200">
                  <p className="text-sm text-gray-600">Pads collected</p>
                  <p className="font-bold text-2xl text-orange-800">{report.padsBought}</p>
                </div> */}
                <div className="bg-orange-50 p-4 rounded border border-orange-200">
                  <p className="text-sm text-gray-600">Pads Donated</p>
                  <p className="font-bold text-2xl text-orange-800">{report.padsDonated}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded border border-orange-200">
                  <p className="text-sm text-gray-600">Adolescents Trained</p>
                  <p className="font-bold text-2xl text-orange-800">{report.adolescentsTrained}</p>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-orange-800 mb-2">Overview</h2>
                <p className="text-gray-700 text-lg">{report.description}</p>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-orange-800 mb-4">Full Report</h2>
                <div className="prose max-w-none">
                  {report.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-700">{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </article>
        </main>
      </div>
    </RootLayout>
  );
}