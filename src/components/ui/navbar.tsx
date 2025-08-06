'use client';

import { useState } from 'react';
import { Button } from './button';
import { Menu, X, Image, Home, Info, Contact } from 'lucide-react';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 lg:space-x-10">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 text-accent hover:text-tertiary transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-secondary/20"
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="text-sm sm:text-base">{item.name}</span>
                </a>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="text-accent hover:text-tertiary hover:bg-secondary/20 p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-secondary/50">
            <div className="px-4 py-6 space-y-2 bg-primary">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 px-4 py-3 text-accent hover:text-tertiary hover:bg-secondary/20 rounded-lg transition-colors duration-200 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span className="text-base">{item.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}