import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Report } from "@/types";
import Link from "next/link";
import { ArrowRight, Trash2 } from "lucide-react";
import { deleteReport } from "@/lib/db";

interface ReportCardProps {
  report: Report;
  onDelete?: () => void;
}

export default function ReportCard({ report, onDelete }: ReportCardProps) {

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      deleteReport(report.id);
      if (onDelete) onDelete();
    }
  };

  return (
    <Card className="bg-white border-orange-300 hover:shadow-md transition-shadow">
      <CardHeader className="bg-orange-50">
        <CardTitle className="text-xl text-orange-800">{report.title}</CardTitle>
        <CardDescription>{report.date}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-orange-100 p-3 rounded">
              <p className="text-sm text-gray-600">Collected amount</p>
              <p className="font-bold text-orange-900">{report.moneyEarned.toFixed(2)} rwf</p>
            </div>
            <div className="bg-orange-100 p-3 rounded">
              <p className="text-sm text-gray-600">Pads collected</p>
              <p className="font-bold text-orange-900">{report.padsBought}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded">
              <p className="text-sm text-gray-600">Pads Donated</p>
              <p className="font-bold text-orange-900">{report.padsDonated}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded">
              <p className="text-sm text-gray-600">Adolescents Trained</p>
              <p className="font-bold text-orange-900">{report.adolescentsTrained}</p>
            </div>
          </div>
          <p className="text-gray-700">{report.description}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" className="text-[#F77665] border-orange-300" asChild>
          <Link href={`all-reports/${report.id}`} className="flex items-center gap-1">
            Read more <ArrowRight size={16} />
          </Link>
        </Button>
        <Button variant="ghost" className="text-red-600" onClick={handleDelete}>
          <Trash2 size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
}
