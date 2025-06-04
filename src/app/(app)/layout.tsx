import { AppShell } from '@/components/layout/AppShell';
import type { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return <AppShell>{children}</AppShell>;
}
