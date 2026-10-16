'use client';

import Link from 'next/link';
import { Home, Shield, Sparkles } from 'lucide-react';

export function Navbar() {
  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Admin', href: '/admin', icon: Shield },
  ];

  return (
    <nav className="glass sticky top-0 z-50 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
            <div className="gradient-primary p-2 rounded-lg shadow-lg">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" aria-label="AI Gallery icon" />
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI Gallery
            </span>
          </Link>

          <div className="flex items-center space-x-1 sm:space-x-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-1 sm:space-x-2 text-slate-200 hover:text-white transition-all duration-300 font-medium px-2 sm:px-3 py-1.5 rounded-lg hover:bg-white/10"
                >
                  <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
