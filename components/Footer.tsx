'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Instagram, Twitter, Facebook, Phone, MapPin, Mail } from 'lucide-react';

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
                alt="REPROCOLLECTIVE Logo" 
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
            <a 
              href="https://docs.google.com/forms/d/1iryfcNbqPIAM3zrhqYp6dpBML5tVzanURpdKJIAdHFs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#F77665] font-medium hover:underline transition-colors flex items-center"
            >
              <Heart className="mr-1 h-4 w-4" />
              Become a Monthly Contributor
              <span className="ml-1 bg-[#F77665] text-white px-2 py-0.5 rounded-full text-xs">New</span>
            </a>
          </div>
          
          {/* Social icons */}
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="https://www.instagram.com/dukataze/?igshid=OGQ5ZDc2ODk2ZA%3D%3D" className="text-gray-500 hover:text-[#F77665] transition-colors">
              <Instagram size={20} />
            </a>
            <a href="https://x.com/i/flow/login?redirect_after_login=%2Fdukataze)" className="text-gray-500 hover:text-[#F77665] transition-colors">
              <Twitter size={20} />
            </a>
            <a href="https://web.facebook.com/dukataze?mibextid=LQQJ4d&_rdc=1&_rdr" className="text-gray-500 hover:text-[#F77665] transition-colors">
              <Facebook size={20} />
            </a>
          </div>
        </div>
        
        {/* Contact Information and Location */}
        <div className="flex flex-col md:flex-row justify-center gap-6 py-4 border-t border-gray-200">
          <div className="flex items-center">
            <Phone size={16} className="text-[#F77665] mr-2" />
            <span className="text-gray-600 text-sm">+250 787 304 095</span>
          </div>
          <div className="flex items-center">
            <Mail size={16} className="text-[#F77665] mr-2" />
            <a href="mailto:ayecompany@dukatazeonline.rw" className="text-gray-600 text-sm hover:text-[#F77665]">
              sayecompany@dukatazeonline.rw
            </a>
          </div>
          <div className="flex items-center">
            <MapPin size={16} className="text-[#F77665] mr-2" />
            <span className="text-gray-600 text-sm">Kigali Rwanda</span>
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