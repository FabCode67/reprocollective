// src/app/privacy/page.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Globe, Shield, Lock } from "lucide-react";
import Navbar from "@/components/layouts/Navbar";

export default function PrivacyPolicyPage() {
  return (
    <>
    <Navbar />
    <div className="min-h-screen lg:mt-12 mt-6 bg-blue-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Card className="bg-white shadow-lg border-none">
          <CardHeader className="bg-blue-600 text-white p-6 rounded-t-lg">
            <div className="flex justify-center mb-3">
              <Lock className="h-10 w-10 text-orange-300" />
            </div>
            <CardTitle className="text-3xl font-bold text-center">
              PRIVACY POLICY
            </CardTitle>
            <p className="text-center mt-2 text-blue-100">
              Effective Date: April 10, 2025
            </p>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="prose max-w-none">
              <p className="text-lg">
                <span className="font-bold text-orange-600">REPROCOLLECTIVE</span>, operated by SAYE Company Ltd, 
                is committed to protecting your privacy. This policy explains what data we collect, how we use it, 
                and how we keep it safe.
              </p>
              
              <section className="mt-8">
                <h2 className="text-xl font-bold text-blue-800">1. Information We Collect</h2>
                <Separator className="my-3 bg-orange-300" />
                <p>We may collect:</p>
                <ul className="space-y-2 pl-6 list-disc mt-3 text-gray-700">
                  <li>Personal details (name, email, phone) when you contribute, purchase, or sign up.</li>
                  <li>Payment information (processed securely through third-party gateways).</li>
                  <li>Non-personal data like browser type, device info, and interactions on the platform.</li>
                </ul>
              </section>
              
              <section className="mt-6">
                <h2 className="text-xl font-bold text-blue-800">2. How We Use Your Data</h2>
                <Separator className="my-3 bg-orange-300" />
                <p>We use your data to:</p>
                <ul className="space-y-2 pl-6 list-disc mt-3 text-gray-700">
                  <li>Process contributions and purchases</li>
                  <li>Improve our services and user experience</li>
                  <li>Keep you informed about our impact and ways to get involved</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>
              
              <section className="mt-6">
                <h2 className="text-xl font-bold text-blue-800">3. Sharing Your Information</h2>
                <Separator className="my-3 bg-orange-300" />
                <p>
                  We do <span className="font-bold">not</span> sell your personal information.
                </p>
              </section>
              
              <section className="mt-6">
                <h2 className="text-xl font-bold text-blue-800">4. Data Security</h2>
                <Separator className="my-3 bg-orange-300" />
                <p>
                  We use secure technologies and best practices to protect your data. However, no platform is 100% secure, 
                  so we encourage you to be cautious with your personal information online.
                </p>
              </section>
              
              <section className="mt-6">
                <h2 className="text-xl font-bold text-blue-800">5. Your Rights</h2>
                <Separator className="my-3 bg-orange-300" />
                <p>
                  You have the right to access, correct, or request deletion of your personal data. 
                  To do so, please contact us.
                </p>
              </section>
              
              <section className="mt-6">
                <h2 className="text-xl font-bold text-blue-800">6. Cookies</h2>
                <Separator className="my-3 bg-orange-300" />
                <p>
                  Our website may use cookies to enhance your experience. You can control cookie settings 
                  through your browser.
                </p>
              </section>
              
              <section className="mt-6">
                <h2 className="text-xl font-bold text-blue-800">7. Updates</h2>
                <Separator className="my-3 bg-orange-300" />
                <p>
                  {"This policy may be updated. We'll notify users of significant changes and update the effective date."}
                </p>
              </section>
              
              <div className="mt-10 p-6 bg-orange-50 rounded-lg border border-orange-200">
                <h3 className="text-lg font-bold text-blue-800 flex items-center">
                  <Shield className="h-5 w-5 text-orange-600 mr-2" />
                  Contact Us
                </h3>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-700">
                    <Mail className="h-5 w-5 text-orange-600 mr-2 flex-shrink-0" />
                    <span>sayecompany@dukatazeonline.rw</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Phone className="h-5 w-5 text-orange-600 mr-2 flex-shrink-0" />
                    <span>+250 787 304 095</span>
                  </div>
                  <div className="flex items-center text-gray-700 col-span-1 md:col-span-2">
                    <Globe className="h-5 w-5 text-orange-600 mr-2 flex-shrink-0" />
                    <span>www.reprocollective.org | www.dukataze.rw</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>&copy; 2025 SAYE Company Ltd. All rights reserved.</p>
        </footer>
      </div>
    </div>
    </>
  );
}