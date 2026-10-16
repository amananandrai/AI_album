'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Shield, Sparkles } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Admin', href: '/admin', icon: Shield },
  ];

  return (
    <nav className="sticky top-0 z-40 border-b-2 border-ink bg-paper">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="brand flex min-w-0 items-center gap-2.5">
          <span className="mark grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-ink bg-sun text-on-sun shadow-sticker-sm">
            <Sparkles className="h-4 w-4" aria-label="AI Gallery icon" />
          </span>
          <span className="display truncate text-[1.35rem] font-extrabold sm:text-[1.7rem]">
            AI Gallery
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`lift inline-flex h-9 items-center gap-1.5 rounded-[10px] border-2 border-ink px-2.5 font-display text-sm font-extrabold shadow-sticker-sm sm:px-3 ${
                  active ? 'bg-sun text-on-sun' : 'bg-card text-ink'
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
