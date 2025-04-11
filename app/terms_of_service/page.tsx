// src/app/terms/page.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone } from "lucide-react";
import Navbar from "@/components/layouts/Navbar";

export default function TermsOfUsePage() {
  return (
    <>
    <Navbar />
    <div className="min-h-screen lg:mt-12 mt-6 bg-blue-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Card className="bg-white shadow-lg border-none">
          <CardHeader className="bg-blue-600 text-white p-6 rounded-t-lg">
            <CardTitle className="text-3xl font-bold text-center">
              TERMS OF USE
            </CardTitle>
            <p className="text-center mt-2 text-blue-100">
              Effective Date: April 10, 2025
            </p>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="prose max-w-none">
              <p className="text-lg">
                Welcome to <span className="font-bold text-[#F77665]">REPROCOLLECTIVE</span>, 
                a digital platform operated by SAYE Company Ltd. These Terms of Use 
                govern your use of our website, contributor stations, mobile services, e-commerce, 
                and any other related features Platform. By accessing or using REPROCOLLECTIVE, 
                you agree to these Terms.
              </p>
              
              <section className="mt-8">
                <h2 className="text-xl font-bold text-blue-800">1. Use of the Platform</h2>
                <Separator className="my-3 bg-orange-300" />
                <p>
                  You may use REPROCOLLECTIVE for lawful purposes only. You agree not to misuse 
                  the platform, interfere with its operations, or engage in fraudulent or harmful activity.
                </p>
              </section>
              
              <section className="mt-6">
                <h2 className="text-xl font-bold text-blue-800">2. Contributions</h2>
                <Separator className="my-3 bg-orange-300" />
                <p>
                  When you contribute through one of our contributor stations or make a purchase through 
                  our platform, you agree that the contributions are voluntary and non-refundable. We commit 
                  to directing all proceeds toward our mission of empowering youth, supporting SRHR education, 
                  and ending period poverty.
                </p>
              </section>
              
              <section className="mt-6">
                <h2 className="text-xl font-bold text-blue-800">3. Intellectual Property</h2>
                <Separator className="my-3 bg-orange-300" />
                <p>
                  All content on REPROCOLLECTIVE, including branding, images, and media, is owned or licensed 
                  by SAYE Company Ltd. You may not reproduce or use this content without written permission.
                </p>
              </section>
              
              <section className="mt-6">
                <h2 className="text-xl font-bold text-blue-800">4. User Content</h2>
                <Separator className="my-3 bg-orange-300" />
                <p>
                  If you post comments, feedback, or stories on our platform, you grant us a non-exclusive, 
                  royalty-free license to use, publish, and share that content for advocacy and awareness purposes.
                </p>
              </section>
              
              <section className="mt-6">
                <h2 className="text-xl font-bold text-blue-800">5. Termination</h2>
                <Separator className="my-3 bg-orange-300" />
                <p>
                  We reserve the right to suspend or terminate your access if you violate these terms or act 
                  in ways that harm our platform or community.
                </p>
              </section>
              
              <section className="mt-6">
                <h2 className="text-xl font-bold text-blue-800">6. Changes to These Terms</h2>
                <Separator className="my-3 bg-orange-300" />
                <p>
                  We may update these Terms from time to time. Continued use of the platform after updates 
                  means you agree to the revised terms.
                </p>
              </section>
              
              <div className="mt-10 p-6 bg-orange-50 rounded-lg border border-orange-200">
                <h3 className="text-lg font-bold text-blue-800">Contact Us</h3>
                <div className="flex mt-4 space-x-6">
                  <div className="flex items-center text-gray-700">
                    <Mail className="h-5 w-5 text-[#F77665] mr-2" />
                    <span>sayecompany@dukatazeonline.rw</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Phone className="h-5 w-5 text-[#F77665] mr-2" />
                    <span>+250 787 304 095</span>
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