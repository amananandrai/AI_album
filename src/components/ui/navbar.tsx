'use client';

import { Button } from './button';
import { Image, Home, Info, Contact, Upload, Sparkles } from 'lucide-react';

export function Navbar() {
  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Gallery', href: '#gallery', icon: Image },
    { name: 'Upload', href: '/upload', icon: Upload },
    { name: 'About', href: '#about', icon: Info },
    { name: 'Contact', href: '#contact', icon: Contact },
  ];

  return (
    <nav className="glass sticky top-0 z-50 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3 animate-fade-in">
            <div className="gradient-primary p-2 rounded-lg shadow-lg animate-glow">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" aria-label="AI Gallery icon" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI Gallery
              </span>
              <span className="text-xs text-slate-400 hidden sm:block">Powered by Artificial Intelligence</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
            {navItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center space-x-1 sm:space-x-2 
                    text-slate-200 hover:text-white 
                    transition-all duration-300 
                    font-medium px-2 sm:px-3 py-1.5 rounded-lg 
                    hover:bg-white/10 hover:backdrop-blur-sm
                    hover:scale-105 hover:shadow-lg
                    animate-fade-in
                    ${item.name === 'Upload' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600' : ''}
                  `}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base hidden sm:inline">{item.name}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}