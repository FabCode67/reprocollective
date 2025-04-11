"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getReportById } from "@/lib/db";
import { Report } from "@/types";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/layouts/Navbar";

export default function ReportDetailPage() {
    const params = useParams();
    const [report, setReport] = useState<Report | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            const foundReport = getReportById(params.id as string);
            setReport(foundReport || null);
            setLoading(false);
        }
    }, [params.id]);


    if (loading) {
        return (
            <div className="min-h-screen bg-orange-50 flex items-center justify-center">
                <p className="text-xl text-orange-800">Loading report...</p>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold text-orange-800 mb-4">Report Not Found</h1>
                <p className="mb-6 text-gray-600">{"The report you're looking for doesn't exist or has been removed."}</p>
                <Button asChild className="bg-[#F77665] hover:bg-[#F77665]">
                    <Link href="spotlight/reports">Back to Reports</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-gray-900">
        <Navbar />
        <div className="px-4 py-6 mx-auto mt-16 sm:mt-20 w-full max-w-7xl">
            <header className="bg-[#F77665] text-white py-6">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">
                                <Link href="/">Contribution Reports</Link>
                            </h1>
                            <p className="mt-1">Tracking our impact and resources</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="bg-transparent text-white border-white hover:bg-[#F77665]" asChild>
                                <Link href="/report" className="flex items-center gap-1">
                                    <ArrowLeft size={18} />
                                    Back to Reports
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="bg-orange-100 p-6 border-b border-orange-200">
                        <h1 className="text-3xl font-bold text-orange-800">{report.title}</h1>
                        <p className="text-gray-600 mt-2">Published on {report.date}</p>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-orange-50 p-4 rounded border border-orange-200">
                                <p className="text-sm text-gray-600">Money Earned</p>
                                <p className="font-bold text-2xl text-orange-800">${report.moneyEarned.toFixed(2)}</p>
                            </div>
                            <div className="bg-orange-50 p-4 rounded border border-orange-200">
                                <p className="text-sm text-gray-600">Pads Bought</p>
                                <p className="font-bold text-2xl text-orange-800">{report.padsBought}</p>
                            </div>
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
        </div>
    );
}
