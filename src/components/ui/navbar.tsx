'use client';

import { Button } from './button';
import { Image, Home, Info, Contact } from 'lucide-react';

export function Navbar() {
  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Gallery', href: '#gallery', icon: Image },
    { name: 'About', href: '#about', icon: Info },
    { name: 'Contact', href: '#contact', icon: Contact },
  ];

  return (
    <nav className="bg-primary border-b border-secondary sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="bg-secondary p-2.5 sm:p-3 rounded-lg shadow-md">
              <Image className="h-6 w-6 sm:h-7 sm:w-7 text-accent" aria-label="Gallery icon" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-accent">AI Gallery</span>
          </div>

          {/* Navigation - Always visible */}
          <div className="flex items-center space-x-4 sm:space-x-6 md:space-x-8 lg:space-x-10">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-1 sm:space-x-2 text-accent hover:text-tertiary transition-colors duration-200 font-medium px-2 sm:px-3 py-2 rounded-lg hover:bg-secondary/20"
                >
                  <IconComponent className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm md:text-base">{item.name}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}