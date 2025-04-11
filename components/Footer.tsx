'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Mail, Instagram, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-8 pb-6">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          {/* Logo and tagline */}
          <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
            <div className="flex items-center mb-2">
              <Image 
                src="/saye.jpg" 
                alt="Reprocollecitve Logo" 
                width={80} 
                height={40} 
                className="mr-2"
              />
              <span className="text-[#F77665] font-bold text-xl">Reprocollective</span>
            </div>
            <p className="text-gray-600 text-sm">Transforming lives through compassionate giving</p>
          </div>
          
          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/#about" className="text-gray-600 hover:text-[#F77665] transition-colors">
              About Us
            </Link>
            <Link href="/report" className="text-gray-600 hover:text-[#F77665] transition-colors">
              Report
            </Link>
            <Link href="/privacy_policy" className="text-gray-600 hover:text-[#F77665] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms_of_service" className="text-gray-600 hover:text-[#F77665] transition-colors">
              Terms of Service
            </Link>
          </div>
          
          {/* Social icons */}
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-[#F77665] transition-colors">
              <Mail size={20} />
            </a>
            <a href="#" className="text-gray-500 hover:text-[#F77665] transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-gray-500 hover:text-[#F77665] transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-gray-500 hover:text-[#F77665] transition-colors">
              <Facebook size={20} />
            </a>
          </div>
        </div>
        
        {/* Bottom copyright and powered by */}
        <div className="border-t border-gray-200 pt-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Reprocollective. All rights reserved.</p>
          <div className="flex items-center mt-2 md:mt-0">
            <span>Powered by</span>
            <Heart size={14} className="mx-1 text-red-500" />
            <span>Saye Company</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;