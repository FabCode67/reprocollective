import Link from "next/link";
import { Button } from "@/components/ui/button";
import RootLayout from "@/app/layout";

export default function Home() {
  return (
<RootLayout>
    <div className="flex flex-col min-h-screen">
      <header className="bg-orange-600 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Contribution Reports</h1>
          <p className="mt-2">Tracking our impact and resources</p>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-orange-800 mb-6">Track Your Contribution Impact</h2>
          <p className="text-lg text-gray-700 mb-8">
            Our platform helps you monitor and share how contributions are used - from pads purchased and donated to 
            adolescents trained on Sexual and Reproductive Health Rights (SRHR).
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <h3 className="text-xl font-semibold text-orange-700 mb-3">View Reports</h3>
              <p className="mb-4">Browse through all contribution reports to see our collective impact.</p>
              <Button asChild className="bg-orange-600 hover:bg-orange-700">
                <Link href="/reports">View All Reports</Link>
              </Button>
            </div>
            
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <h3 className="text-xl font-semibold text-orange-700 mb-3">Create New Report</h3>
              <p className="mb-4">Add a new contribution report to share your impact with the community.</p>
              <Button asChild className="bg-orange-600 hover:bg-orange-700">
                <Link href="/reports/create">Create Report</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
        </RootLayout>
    
  );
}
