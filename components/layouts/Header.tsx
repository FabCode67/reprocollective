// src/components/Header.tsx
'use client';

import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
// import { Input } from '@/components/ui/input';

export default function Header() {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="ml-8 md:ml-0">
          {/* Page title will be handled by each page */}
        </div>
        
        <div className="flex items-center gap-4">
          {/* <Input className="max-w-[180px] hidden sm:block" placeholder="Search..." />
          
          <div className="relative">
            <Button variant="ghost" size="icon" className="text-gray-500">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
          </div> */}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/api/placeholder/32/32" alt="Avatar" />
                  <AvatarFallback className="bg-orange-100 text-[#F77665]">AD</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-sm text-left font-medium">
                  Admin User
                  <span className="block text-xs text-gray-500 font-normal">Administrator</span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            {/* <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">Log out</DropdownMenuItem>
            </DropdownMenuContent> */}
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}