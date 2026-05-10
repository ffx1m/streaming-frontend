'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    return <main className="min-h-screen bg-black">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-14 pb-20 md:pt-16 md:pb-8">
        {children}
      </main>
    </>
  );
}
