'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  User,
  MapPinned,
  Footprints,
  Sprout,
  Library,
  Users2,
  Luggage,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/trip-planner', label: 'Trip Planner', icon: MapPinned },
  { href: '/carbon-tracker', label: 'Carbon Tracker', icon: Footprints },
  { href: '/eco-experiences', label: 'Eco-Experiences', icon: Sprout },
  { href: '/resources', label: 'Resources', icon: Library },
  { href: '/community', label: 'Community', icon: Users2 },
  { href: '/packing-assistant', label: 'AI Packing Assistant', icon: Luggage },
];

interface MainNavProps {
  isMobile?: boolean;
}

export function MainNav({ isMobile = false }: MainNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn(
      "flex items-center space-x-4 lg:space-x-6",
      isMobile && "flex-col space-x-0 space-y-4 items-start"
    )}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary flex items-center gap-2',
            pathname === item.href
              ? 'text-primary font-semibold'
              : 'text-foreground/70',
            isMobile && "text-lg w-full p-2 hover:bg-accent/10 rounded-md"
          )}
        >
          <item.icon className={cn("h-4 w-4", isMobile && "h-5 w-5")} />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
