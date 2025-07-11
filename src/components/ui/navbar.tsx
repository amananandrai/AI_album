'use client';

import { useState } from 'react';
import { Button } from './button';
import { Menu, X, Image, Home, Info, Contact, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/app/context/theme';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

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
    <nav className="bg-primary border-b border-secondary sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-secondary p-2 rounded-lg">
              <Image className="h-6 w-6 text-accent" />
            </div>
            <span className="text-xl font-bold text-accent">AI Gallery</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-1 font-medium transition-colors duration-200 ${isActive ? 'text-tertiary font-bold underline' : 'text-accent hover:text-tertiary'}`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{item.name}</span>
                </a>
              );
            })}
            {/* Theme Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="ml-4 text-accent hover:text-tertiary"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="text-accent hover:text-tertiary"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
            {/* Theme Toggle Button for Mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="text-accent hover:text-tertiary"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-primary border-t border-secondary">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = pathname === item.href;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors duration-200 font-medium ${isActive ? 'text-tertiary font-bold underline' : 'text-accent hover:text-tertiary hover:bg-accent'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{item.name}</span>
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